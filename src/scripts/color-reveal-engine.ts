import type {
  ColorRevealEngine,
  ColorRevealEngineOptions,
  ColorRevealPhase,
  ColorRevealProgress,
  ColorRevealSourceBounds,
} from "../types/color-reveal";

const DEFAULT_SOURCE_BOUNDS: ColorRevealSourceBounds = {
  x: 0,
  y: 0,
  width: 579,
  height: 480,
};

const mountedEngines = new WeakMap<HTMLElement, ColorRevealEngine>();

export function mountColorRevealEngine(
  options: ColorRevealEngineOptions,
): ColorRevealEngine {
  mountedEngines.get(options.container)?.destroy();

  const baseContext = getRequired2dContext(options.baseCanvas);
  const revealContext = getRequired2dContext(options.revealCanvas, {
    willReadFrequently: true,
  });
  const offscreenCanvas =
    options.container.ownerDocument.createElement("canvas");
  const offscreenContext = getRequired2dContext(offscreenCanvas, {
    willReadFrequently: true,
  });
  const view = options.container.ownerDocument.defaultView;

  if (!view) {
    throw new Error("Color reveal engine: Window недоступен");
  }

  const engineView = view;

  const sourceBounds = validateSourceBounds(
    options.sourceBounds ?? DEFAULT_SOURCE_BOUNDS,
  );
  const brushRadius = positiveNumber(options.brushRadius, 64);
  const splashRadius = positiveNumber(options.splashRadius, 110);
  const coverageCellSize = positiveNumber(options.coverageCellSize, 24);
  const completionTarget = boundedNumber(options.completionTarget, 82, 1, 100);
  const autoRevealDuration = positiveNumber(options.autoRevealDuration, 2100);
  const completionDelay = nonNegativeNumber(options.completionDelay, 160);
  const isEnabled = options.isEnabled ?? (() => true);

  let phase: ColorRevealPhase = "idle";
  let isPainting = false;
  let isPointerInside = false;
  let activePointerId: number | null = null;
  let coverageColumns = 0;
  let coverageRows = 0;
  let revealedCells = 0;
  let totalCells = 0;
  let coverageMap: Uint8Array = new Uint8Array();
  let rawProgress = 0;
  let lastPaintPoint: { x: number; y: number } | null = null;
  let autoRevealFrame: number | null = null;
  let completionTimer: number | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let destroyed = false;

  function setPhase(nextPhase: ColorRevealPhase): void {
    if (phase === nextPhase) {
      return;
    }

    phase = nextPhase;
    options.onPhaseChange?.(phase);
  }

  function getProgress(): ColorRevealProgress {
    return {
      rawPercent: Math.min(100, rawProgress),
      displayPercent: Math.min(100, Math.round(rawProgress)),
      phase,
    };
  }

  function emitProgress(): void {
    options.onProgress?.(getProgress());
  }

  function initializeCoverageMap(): void {
    coverageColumns = Math.max(
      1,
      Math.ceil(options.revealCanvas.width / coverageCellSize),
    );
    coverageRows = Math.max(
      1,
      Math.ceil(options.revealCanvas.height / coverageCellSize),
    );
    totalCells = coverageColumns * coverageRows;
    revealedCells = 0;
    coverageMap = new Uint8Array(totalCells);
    rawProgress = 0;
  }

  function drawBasePainting(): void {
    baseContext.clearRect(
      0,
      0,
      options.baseCanvas.width,
      options.baseCanvas.height,
    );
    baseContext.drawImage(
      options.sourceImage,
      sourceBounds.x,
      sourceBounds.y,
      sourceBounds.width,
      sourceBounds.height,
      0,
      0,
      options.baseCanvas.width,
      options.baseCanvas.height,
    );
  }

  function drawGrayOverlay(): void {
    offscreenContext.clearRect(
      0,
      0,
      offscreenCanvas.width,
      offscreenCanvas.height,
    );
    offscreenContext.filter = "grayscale(1) contrast(1.08) brightness(0.94)";
    offscreenContext.drawImage(
      options.sourceImage,
      sourceBounds.x,
      sourceBounds.y,
      sourceBounds.width,
      sourceBounds.height,
      0,
      0,
      offscreenCanvas.width,
      offscreenCanvas.height,
    );
    offscreenContext.filter = "none";

    revealContext.clearRect(
      0,
      0,
      options.revealCanvas.width,
      options.revealCanvas.height,
    );
    revealContext.globalCompositeOperation = "source-over";
    revealContext.drawImage(offscreenCanvas, 0, 0);
  }

  function positionCanvas(
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    offsetX: number,
    offsetY: number,
  ): void {
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.style.left = `${offsetX}px`;
    canvas.style.top = `${offsetY}px`;
  }

  function resize(): void {
    if (destroyed || !options.sourceImage.complete) {
      return;
    }

    cancelAsyncWork();
    const containerRect = options.container.getBoundingClientRect();
    const containerWidth = Math.round(
      options.container.clientWidth || containerRect.width,
    );
    const containerHeight = Math.round(
      options.container.clientHeight || containerRect.height,
    );

    if (containerWidth <= 0) {
      return;
    }

    const aspectRatio = sourceBounds.width / sourceBounds.height;
    let renderWidth = Math.max(1, containerWidth);
    let renderHeight = Math.max(1, Math.round(renderWidth / aspectRatio));

    if (containerHeight > 0 && renderHeight > containerHeight) {
      renderHeight = Math.max(1, containerHeight);
      renderWidth = Math.max(1, Math.round(renderHeight * aspectRatio));
    }

    const offsetX = Math.max(0, Math.round((containerWidth - renderWidth) / 2));
    const offsetY = Math.max(
      0,
      Math.round((containerHeight - renderHeight) / 2),
    );

    positionCanvas(
      options.baseCanvas,
      renderWidth,
      renderHeight,
      offsetX,
      offsetY,
    );
    positionCanvas(
      options.revealCanvas,
      renderWidth,
      renderHeight,
      offsetX,
      offsetY,
    );
    offscreenCanvas.width = renderWidth;
    offscreenCanvas.height = renderHeight;

    isPainting = false;
    activePointerId = null;
    lastPaintPoint = null;
    setBrushOpacity(0);
    setPhase("idle");
    initializeCoverageMap();
    drawBasePainting();
    drawGrayOverlay();
    emitProgress();
  }

  function eraseAt(
    x: number,
    y: number,
    radius: number,
    strength: number,
  ): void {
    const gradient = revealContext.createRadialGradient(
      x,
      y,
      radius * 0.18,
      x,
      y,
      radius,
    );
    gradient.addColorStop(0, `rgba(0, 0, 0, ${strength})`);
    gradient.addColorStop(0.65, `rgba(0, 0, 0, ${strength * 0.85})`);
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    revealContext.save();
    revealContext.globalCompositeOperation = "destination-out";
    revealContext.fillStyle = gradient;
    revealContext.beginPath();
    revealContext.arc(x, y, radius, 0, Math.PI * 2);
    revealContext.fill();
    revealContext.restore();
  }

  function eraseEverywhere(strength: number): void {
    revealContext.save();
    revealContext.globalCompositeOperation = "destination-out";
    revealContext.fillStyle = `rgba(0, 0, 0, ${strength})`;
    revealContext.fillRect(
      0,
      0,
      options.revealCanvas.width,
      options.revealCanvas.height,
    );
    revealContext.restore();
  }

  function stampCoverage(x: number, y: number, radius: number): void {
    const minColumn = Math.max(0, Math.floor((x - radius) / coverageCellSize));
    const maxColumn = Math.min(
      coverageColumns - 1,
      Math.floor((x + radius) / coverageCellSize),
    );
    const minRow = Math.max(0, Math.floor((y - radius) / coverageCellSize));
    const maxRow = Math.min(
      coverageRows - 1,
      Math.floor((y + radius) / coverageCellSize),
    );

    for (let row = minRow; row <= maxRow; row += 1) {
      for (let column = minColumn; column <= maxColumn; column += 1) {
        const centerX = column * coverageCellSize + coverageCellSize / 2;
        const centerY = row * coverageCellSize + coverageCellSize / 2;

        if (Math.hypot(centerX - x, centerY - y) > radius) {
          continue;
        }

        const index = row * coverageColumns + column;
        if (coverageMap[index] === 0) {
          coverageMap[index] = 1;
          revealedCells += 1;
        }
      }
    }
  }

  function splashReveal(x: number, y: number): void {
    eraseAt(x, y, brushRadius, 0.92);

    for (let splash = 0; splash < 3; splash += 1) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 20 + Math.random() * 52;
      const radius = 26 + Math.random() * 34;
      eraseAt(
        x + Math.cos(angle) * distance,
        y + Math.sin(angle) * distance,
        radius,
        0.34,
      );
    }

    eraseAt(x, y, splashRadius, 0.14);
    stampCoverage(x, y, splashRadius * 1.15);
  }

  function updateProgress(): void {
    rawProgress = totalCells > 0 ? (revealedCells / totalCells) * 100 : 0;
    emitProgress();

    if (rawProgress >= completionTarget) {
      startAutoReveal();
    }
  }

  function getCanvasPoint(event: PointerEvent): { x: number; y: number } {
    const rect = options.revealCanvas.getBoundingClientRect();
    const scaleX = options.revealCanvas.width / rect.width;
    const scaleY = options.revealCanvas.height / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }

  function moveBrush(event: PointerEvent): void {
    if (!options.brushElement) {
      return;
    }

    const containerRect = options.container.getBoundingClientRect();
    options.brushElement.style.left = `${event.clientX - containerRect.left}px`;
    options.brushElement.style.top = `${event.clientY - containerRect.top}px`;
  }

  function setBrushOpacity(opacity: number): void {
    if (options.brushElement) {
      options.brushElement.style.opacity = String(opacity);
    }
  }

  function paint(event: PointerEvent): void {
    if (!isPainting || phase === "completing" || phase === "complete") {
      return;
    }

    event.preventDefault();
    const point = getCanvasPoint(event);
    lastPaintPoint = point;
    moveBrush(event);
    splashReveal(point.x, point.y);
    updateProgress();
  }

  function handlePointerDown(event: PointerEvent): void {
    if (
      destroyed ||
      !isEnabled() ||
      phase === "completing" ||
      phase === "complete"
    ) {
      return;
    }

    event.preventDefault();
    isPainting = true;
    isPointerInside = true;
    activePointerId = event.pointerId;
    setPhase("painting");
    options.revealCanvas.setPointerCapture?.(event.pointerId);
    setBrushOpacity(1);
    moveBrush(event);
    paint(event);
  }

  function handlePointerMove(event: PointerEvent): void {
    moveBrush(event);
    if (activePointerId === null || event.pointerId === activePointerId) {
      paint(event);
    }
  }

  function handlePointerEnd(event: PointerEvent): void {
    if (activePointerId !== null && event.pointerId !== activePointerId) {
      return;
    }

    if (
      activePointerId !== null &&
      options.revealCanvas.hasPointerCapture?.(activePointerId)
    ) {
      options.revealCanvas.releasePointerCapture?.(activePointerId);
    }

    isPainting = false;
    activePointerId = null;
    if (phase === "painting") {
      setPhase("idle");
      emitProgress();
    }
    setBrushOpacity(isPointerInside ? 0.9 : 0);
  }

  function handlePointerEnter(): void {
    isPointerInside = true;
    setBrushOpacity(isPainting ? 1 : 0.9);
  }

  function handlePointerLeave(): void {
    isPointerInside = false;
    if (!isPainting) {
      setBrushOpacity(0);
    }
  }

  function startAutoReveal(): void {
    if (destroyed || phase === "completing" || phase === "complete") {
      return;
    }

    isPainting = false;
    activePointerId = null;
    const autoRevealStartProgress = rawProgress;
    revealedCells = totalCells;
    coverageMap.fill(1);
    setPhase("completing");
    setBrushOpacity(isPointerInside ? 0.9 : 0);
    emitProgress();

    const width = options.revealCanvas.width;
    const height = options.revealCanvas.height;
    const anchor = lastPaintPoint ?? { x: width / 2, y: height / 2 };
    const revealPoints = [
      { x: width * 0.2, y: height * 0.75, radius: width * 0.18 },
      { x: width * 0.5, y: height * 0.5, radius: width * 0.2 },
      { x: width * 0.75, y: height * 0.3, radius: width * 0.17 },
      { x: anchor.x, y: anchor.y, radius: width * 0.16 },
      { x: width * 0.68, y: height * 0.72, radius: width * 0.14 },
    ];
    let startTime: number | null = null;

    const animateReveal = (timestamp: number): void => {
      if (destroyed || phase !== "completing") {
        return;
      }

      startTime ??= timestamp;
      const elapsed = timestamp - startTime;
      const completion = Math.min(1, elapsed / autoRevealDuration);
      rawProgress =
        autoRevealStartProgress + (100 - autoRevealStartProgress) * completion;
      emitProgress();

      revealPoints.forEach((point, index) => {
        const local = Math.min(
          1,
          Math.max(0, completion * 1.45 - index * 0.12),
        );
        if (local > 0) {
          eraseAt(
            point.x,
            point.y,
            point.radius * (0.45 + local * 0.75),
            0.08 + local * 0.12,
          );
        }
      });
      eraseEverywhere(0.006 + completion * 0.024);

      if (completion < 1) {
        autoRevealFrame = engineView.requestAnimationFrame(animateReveal);
        return;
      }

      revealContext.clearRect(
        0,
        0,
        options.revealCanvas.width,
        options.revealCanvas.height,
      );
      autoRevealFrame = null;
      rawProgress = 100;
      setPhase("complete");
      emitProgress();
      completionTimer = engineView.setTimeout(() => {
        completionTimer = null;
        if (!destroyed && phase === "complete") {
          options.onComplete?.();
        }
      }, completionDelay);
    };

    autoRevealFrame = engineView.requestAnimationFrame(animateReveal);
  }

  function cancelAsyncWork(): void {
    if (autoRevealFrame !== null) {
      engineView.cancelAnimationFrame(autoRevealFrame);
      autoRevealFrame = null;
    }
    if (completionTimer !== null) {
      engineView.clearTimeout(completionTimer);
      completionTimer = null;
    }
  }

  function reset(): void {
    if (destroyed) {
      return;
    }

    cancelAsyncWork();
    isPainting = false;
    isPointerInside = false;
    activePointerId = null;
    lastPaintPoint = null;
    setBrushOpacity(0);
    setPhase("idle");

    if (options.revealCanvas.width > 0 && options.revealCanvas.height > 0) {
      initializeCoverageMap();
      drawGrayOverlay();
    } else {
      rawProgress = 0;
    }
    emitProgress();
  }

  function handleImageLoad(): void {
    resize();
  }

  function destroy(): void {
    if (destroyed) {
      return;
    }

    destroyed = true;
    cancelAsyncWork();
    resizeObserver?.disconnect();
    resizeObserver = null;
    options.sourceImage.removeEventListener("load", handleImageLoad);
    options.revealCanvas.removeEventListener("pointerdown", handlePointerDown);
    options.revealCanvas.removeEventListener("pointermove", handlePointerMove);
    options.revealCanvas.removeEventListener(
      "pointerenter",
      handlePointerEnter,
    );
    options.revealCanvas.removeEventListener(
      "pointerleave",
      handlePointerLeave,
    );
    engineView.removeEventListener("pointerup", handlePointerEnd);
    engineView.removeEventListener("pointercancel", handlePointerEnd);
    if (
      activePointerId !== null &&
      options.revealCanvas.hasPointerCapture?.(activePointerId)
    ) {
      options.revealCanvas.releasePointerCapture?.(activePointerId);
    }
    isPainting = false;
    activePointerId = null;
    setBrushOpacity(0);
    setPhase("destroyed");

    if (mountedEngines.get(options.container) === controller) {
      mountedEngines.delete(options.container);
    }
  }

  const controller: ColorRevealEngine = {
    resize,
    reset,
    startAutoReveal,
    getProgress,
    destroy,
  };

  options.sourceImage.addEventListener("load", handleImageLoad);
  options.revealCanvas.addEventListener("pointerdown", handlePointerDown);
  options.revealCanvas.addEventListener("pointermove", handlePointerMove);
  options.revealCanvas.addEventListener("pointerenter", handlePointerEnter);
  options.revealCanvas.addEventListener("pointerleave", handlePointerLeave);
  engineView.addEventListener("pointerup", handlePointerEnd);
  engineView.addEventListener("pointercancel", handlePointerEnd);

  if (options.observeResize !== false && "ResizeObserver" in engineView) {
    resizeObserver = new engineView.ResizeObserver(() => resize());
    resizeObserver.observe(options.container);
  }

  mountedEngines.set(options.container, controller);

  if (options.sourceImage.complete) {
    resize();
  }

  return controller;
}

function getRequired2dContext(
  canvas: HTMLCanvasElement,
  settings?: CanvasRenderingContext2DSettings,
): CanvasRenderingContext2D {
  const context = canvas.getContext("2d", settings);

  if (!context) {
    throw new Error("Color reveal engine: Canvas 2D недоступен");
  }

  return context;
}

function validateSourceBounds(
  bounds: ColorRevealSourceBounds,
): ColorRevealSourceBounds {
  if (bounds.x < 0 || bounds.y < 0 || bounds.width <= 0 || bounds.height <= 0) {
    throw new Error("Color reveal engine: sourceBounds некорректен");
  }

  return { ...bounds };
}

function positiveNumber(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : fallback;
}

function nonNegativeNumber(
  value: number | undefined,
  fallback: number,
): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : fallback;
}

function boundedNumber(
  value: number | undefined,
  fallback: number,
  minimum: number,
  maximum: number,
): number {
  return typeof value === "number" &&
    Number.isFinite(value) &&
    value >= minimum &&
    value <= maximum
    ? value
    : fallback;
}
