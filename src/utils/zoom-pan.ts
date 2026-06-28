import type {
  ZoomPanBounds,
  ZoomPanPoint,
  ZoomPanSize,
  ZoomPanState,
} from "../types/zoom-pan";

export interface FitZoomPanOptions {
  viewport: ZoomPanSize;
  content: ZoomPanSize;
  minScaleRatio: number;
  maxScaleRatio: number;
}

export function calculateZoomPanBounds(
  viewport: ZoomPanSize,
  content: ZoomPanSize,
  scale: number,
): ZoomPanBounds {
  const scaledWidth = content.width * scale;
  const scaledHeight = content.height * scale;
  const minX =
    scaledWidth <= viewport.width
      ? (viewport.width - scaledWidth) / 2
      : viewport.width - scaledWidth;
  const maxX = scaledWidth <= viewport.width ? minX : 0;
  const minY =
    scaledHeight <= viewport.height
      ? (viewport.height - scaledHeight) / 2
      : viewport.height - scaledHeight;
  const maxY = scaledHeight <= viewport.height ? minY : 0;

  return { minX, maxX, minY, maxY };
}

export function clampZoomPanPosition(
  bounds: ZoomPanBounds,
  position: ZoomPanPoint,
): ZoomPanPoint {
  return {
    x: Math.min(bounds.maxX, Math.max(bounds.minX, position.x)),
    y: Math.min(bounds.maxY, Math.max(bounds.minY, position.y)),
  };
}

export function calculateFitZoomPanState(
  options: FitZoomPanOptions,
): ZoomPanState {
  assertPositiveSize(options.viewport, "viewport");
  assertPositiveSize(options.content, "content");

  const fitScale = Math.min(
    options.viewport.width / options.content.width,
    options.viewport.height / options.content.height,
  );
  const minScale = fitScale * positiveNumber(options.minScaleRatio, 0.72);
  const maxScale = fitScale * positiveNumber(options.maxScaleRatio, 1.9);
  const centered = clampZoomPanPosition(
    calculateZoomPanBounds(options.viewport, options.content, minScale),
    {
      x: (options.viewport.width - options.content.width * minScale) / 2,
      y: (options.viewport.height - options.content.height * minScale) / 2,
    },
  );

  return {
    scale: minScale,
    minScale,
    maxScale: Math.max(minScale, maxScale),
    x: centered.x,
    y: centered.y,
    isDragging: false,
  };
}

export function calculateZoomAtFocus(
  state: ZoomPanState,
  viewport: ZoomPanSize,
  content: ZoomPanSize,
  nextScale: number,
  focus?: Partial<ZoomPanPoint>,
): ZoomPanState {
  const scale = clampNumber(nextScale, state.minScale, state.maxScale);
  const focusX = finiteNumber(focus?.x, viewport.width / 2);
  const focusY = finiteNumber(focus?.y, viewport.height / 2);
  const imagePointX = (focusX - state.x) / state.scale;
  const imagePointY = (focusY - state.y) / state.scale;
  const proposed = {
    x: focusX - imagePointX * scale,
    y: focusY - imagePointY * scale,
  };
  const position = clampZoomPanPosition(
    calculateZoomPanBounds(viewport, content, scale),
    proposed,
  );

  return {
    ...state,
    scale,
    x: position.x,
    y: position.y,
  };
}

export function calculatePanZoomPanState(
  state: ZoomPanState,
  viewport: ZoomPanSize,
  content: ZoomPanSize,
  delta: ZoomPanPoint,
): ZoomPanState {
  const position = clampZoomPanPosition(
    calculateZoomPanBounds(viewport, content, state.scale),
    {
      x: state.x + delta.x,
      y: state.y + delta.y,
    },
  );

  return {
    ...state,
    x: position.x,
    y: position.y,
  };
}

export function calculateCenteredZoomPanState(
  state: ZoomPanState,
  viewport: ZoomPanSize,
  content: ZoomPanSize,
  normalizedPoint: ZoomPanPoint,
  targetScaleRatio = 1,
): ZoomPanState {
  const scale = clampNumber(
    state.maxScale * positiveNumber(targetScaleRatio, 1),
    state.minScale,
    state.maxScale,
  );
  const proposed = {
    x: viewport.width / 2 - normalizedPoint.x * content.width * scale,
    y: viewport.height / 2 - normalizedPoint.y * content.height * scale,
  };
  const position = clampZoomPanPosition(
    calculateZoomPanBounds(viewport, content, scale),
    proposed,
  );

  return {
    ...state,
    scale,
    x: position.x,
    y: position.y,
  };
}

function assertPositiveSize(size: ZoomPanSize, label: string): void {
  if (
    !Number.isFinite(size.width) ||
    !Number.isFinite(size.height) ||
    size.width <= 0 ||
    size.height <= 0
  ) {
    throw new Error(`Zoom/pan ${label} size must be positive`);
  }
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function finiteNumber(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function positiveNumber(value: number, fallback: number): number {
  return Number.isFinite(value) && value > 0 ? value : fallback;
}
