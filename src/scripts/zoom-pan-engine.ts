import type {
  ZoomPanEngine,
  ZoomPanEngineOptions,
  ZoomPanPoint,
  ZoomPanSize,
  ZoomPanState,
} from "../types/zoom-pan";
import {
  calculateCenteredZoomPanState,
  calculateFitZoomPanState,
  calculatePanZoomPanState,
  calculateZoomAtFocus,
} from "../utils/zoom-pan";

const mountedEngines = new WeakMap<HTMLElement, ZoomPanEngine>();

export function mountZoomPanEngine(
  options: ZoomPanEngineOptions,
): ZoomPanEngine {
  mountedEngines.get(options.viewport)?.destroy();

  const view = options.viewport.ownerDocument.defaultView;
  if (!view) {
    throw new Error("Zoom/pan engine: Window недоступен");
  }
  const engineView = view;

  const zoomStep = positiveNumber(options.zoomStep, 0.14);
  const minScaleRatio = positiveNumber(options.minScaleRatio, 0.72);
  const maxScaleRatio = positiveNumber(options.maxScaleRatio, 1.9);
  const ignoredPointerSelector =
    options.ignoredPointerSelector ?? "[data-zoom-pan-ignore]";
  const transition =
    options.transition ?? "transform 0.72s cubic-bezier(0.22, 1, 0.36, 1)";

  let state: ZoomPanState = {
    scale: 1,
    minScale: 1,
    maxScale: 1,
    x: 0,
    y: 0,
    isDragging: false,
  };
  let dragStart: ZoomPanPoint | null = null;
  let dragOrigin: ZoomPanPoint | null = null;
  let activePointerId: number | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let destroyed = false;

  function getViewportSize(): ZoomPanSize | null {
    const rect = options.viewport.getBoundingClientRect();
    const width = Math.round(options.viewport.clientWidth || rect.width);
    const height = Math.round(options.viewport.clientHeight || rect.height);

    return width > 0 && height > 0 ? { width, height } : null;
  }

  function getContentSize(): ZoomPanSize | null {
    if (options.imageSize) {
      return options.imageSize;
    }

    if (options.imageElement) {
      const width = options.imageElement.naturalWidth;
      const height = options.imageElement.naturalHeight;

      return width > 0 && height > 0 ? { width, height } : null;
    }

    const width = options.content.scrollWidth;
    const height = options.content.scrollHeight;

    return width > 0 && height > 0 ? { width, height } : null;
  }

  function emitState(): void {
    options.onStateChange?.(getState());
  }

  function applyState(useTransition = false): void {
    const contentSize = getContentSize();
    if (contentSize) {
      options.content.style.width = `${contentSize.width}px`;
      options.content.style.height = `${contentSize.height}px`;
    }

    const shouldTransition = useTransition && !prefersReducedMotion(engineView);

    options.content.style.transformOrigin = "0 0";
    options.content.style.transition = shouldTransition ? transition : "none";
    options.content.style.setProperty("--zoom-pan-scale", String(state.scale));
    options.content.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) scale(${state.scale})`;
    options.viewport.dataset.zoomPanDragging = state.isDragging
      ? "true"
      : "false";
    emitState();
  }

  function setState(nextState: ZoomPanState, useTransition = false): void {
    if (destroyed) {
      return;
    }

    state = nextState;
    applyState(useTransition);
  }

  function fit(): void {
    if (destroyed) {
      return;
    }

    const viewport = getViewportSize();
    const content = getContentSize();
    if (!viewport || !content) {
      return;
    }

    dragStart = null;
    dragOrigin = null;
    activePointerId = null;
    setState(
      calculateFitZoomPanState({
        viewport,
        content,
        minScaleRatio,
        maxScaleRatio,
      }),
    );
  }

  function reset(): void {
    fit();
  }

  function setScale(
    nextScale: number,
    focus?: Partial<ZoomPanPoint>,
    useTransition = false,
  ): void {
    const viewport = getViewportSize();
    const content = getContentSize();
    if (!viewport || !content) {
      return;
    }

    setState(
      calculateZoomAtFocus(state, viewport, content, nextScale, focus),
      useTransition,
    );
  }

  function panBy(delta: ZoomPanPoint): void {
    const viewport = getViewportSize();
    const content = getContentSize();
    if (!viewport || !content) {
      return;
    }

    setState(calculatePanZoomPanState(state, viewport, content, delta));
  }

  function centerOn(
    point: ZoomPanPoint,
    targetScaleRatio = 1,
    useTransition = true,
  ): void {
    const viewport = getViewportSize();
    const content = getContentSize();
    if (!viewport || !content) {
      return;
    }

    setState(
      calculateCenteredZoomPanState(
        state,
        viewport,
        content,
        point,
        targetScaleRatio,
      ),
      useTransition,
    );
  }

  function getState(): ZoomPanState {
    return { ...state };
  }

  function shouldIgnorePointer(event: PointerEvent): boolean {
    const target = event.target;

    return (
      target instanceof Element &&
      Boolean(ignoredPointerSelector) &&
      Boolean(target.closest(ignoredPointerSelector))
    );
  }

  function handlePointerDown(event: PointerEvent): void {
    if (destroyed || event.button !== 0 || shouldIgnorePointer(event)) {
      return;
    }

    event.preventDefault();
    dragStart = { x: event.clientX, y: event.clientY };
    dragOrigin = { x: state.x, y: state.y };
    activePointerId = event.pointerId;
    state = { ...state, isDragging: true };
    applyState(false);
    options.viewport.setPointerCapture?.(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent): void {
    if (
      destroyed ||
      !dragStart ||
      !dragOrigin ||
      activePointerId !== event.pointerId
    ) {
      return;
    }

    event.preventDefault();
    const viewport = getViewportSize();
    const content = getContentSize();
    if (!viewport || !content) {
      return;
    }

    setState(
      calculatePanZoomPanState(
        { ...state, x: dragOrigin.x, y: dragOrigin.y },
        viewport,
        content,
        {
          x: event.clientX - dragStart.x,
          y: event.clientY - dragStart.y,
        },
      ),
    );
  }

  function handlePointerEnd(event: PointerEvent): void {
    if (activePointerId !== event.pointerId) {
      return;
    }

    if (options.viewport.hasPointerCapture?.(event.pointerId)) {
      options.viewport.releasePointerCapture?.(event.pointerId);
    }

    dragStart = null;
    dragOrigin = null;
    activePointerId = null;
    setState({ ...state, isDragging: false });
  }

  function handleWheel(event: WheelEvent): void {
    if (destroyed) {
      return;
    }

    event.preventDefault();
    const rect = options.viewport.getBoundingClientRect();
    const direction = event.deltaY < 0 ? 1 : -1;

    setScale(
      state.scale + direction * zoomStep * 0.5,
      {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      },
      false,
    );
  }

  function handleDragStart(event: DragEvent): void {
    event.preventDefault();
  }

  function handleImageLoad(): void {
    fit();
  }

  function destroy(): void {
    if (destroyed) {
      return;
    }

    destroyed = true;
    resizeObserver?.disconnect();
    resizeObserver = null;
    options.imageElement?.removeEventListener("load", handleImageLoad);
    options.zoomInButton?.removeEventListener("click", handleZoomIn);
    options.zoomOutButton?.removeEventListener("click", handleZoomOut);
    options.resetButton?.removeEventListener("click", reset);
    options.viewport.removeEventListener("pointerdown", handlePointerDown);
    options.viewport.removeEventListener("pointermove", handlePointerMove);
    options.viewport.removeEventListener("pointerup", handlePointerEnd);
    options.viewport.removeEventListener("pointercancel", handlePointerEnd);
    options.viewport.removeEventListener("dragstart", handleDragStart);
    options.viewport.removeEventListener("wheel", handleWheel);

    if (
      activePointerId !== null &&
      options.viewport.hasPointerCapture?.(activePointerId)
    ) {
      options.viewport.releasePointerCapture?.(activePointerId);
    }

    dragStart = null;
    dragOrigin = null;
    activePointerId = null;
    options.viewport.dataset.zoomPanDragging = "false";

    if (mountedEngines.get(options.viewport) === controller) {
      mountedEngines.delete(options.viewport);
    }
  }

  function handleZoomIn(): void {
    setScale(state.scale + zoomStep, undefined, true);
  }

  function handleZoomOut(): void {
    setScale(state.scale - zoomStep, undefined, true);
  }

  const controller: ZoomPanEngine = {
    fit,
    reset,
    setScale,
    panBy,
    centerOn,
    getState,
    destroy,
  };

  options.zoomInButton?.addEventListener("click", handleZoomIn);
  options.zoomOutButton?.addEventListener("click", handleZoomOut);
  options.resetButton?.addEventListener("click", reset);
  options.viewport.addEventListener("pointerdown", handlePointerDown);
  options.viewport.addEventListener("pointermove", handlePointerMove);
  options.viewport.addEventListener("pointerup", handlePointerEnd);
  options.viewport.addEventListener("pointercancel", handlePointerEnd);
  options.viewport.addEventListener("dragstart", handleDragStart);
  options.viewport.addEventListener("wheel", handleWheel, { passive: false });
  options.imageElement?.addEventListener("load", handleImageLoad);

  if (options.observeResize !== false && "ResizeObserver" in engineView) {
    resizeObserver = new engineView.ResizeObserver(() => fit());
    resizeObserver.observe(options.viewport);
  }

  mountedEngines.set(options.viewport, controller);

  if (!options.imageElement || options.imageElement.complete) {
    fit();
  }

  return controller;
}

function positiveNumber(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : fallback;
}

function prefersReducedMotion(view: Window): boolean {
  return view.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
