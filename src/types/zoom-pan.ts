export interface ZoomPanPoint {
  x: number;
  y: number;
}

export interface ZoomPanSize {
  width: number;
  height: number;
}

export interface ZoomPanBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface ZoomPanState {
  scale: number;
  minScale: number;
  maxScale: number;
  x: number;
  y: number;
  isDragging: boolean;
}

export interface ZoomPanEngineOptions {
  viewport: HTMLElement;
  content: HTMLElement;
  imageElement?: HTMLImageElement;
  imageSize?: ZoomPanSize;
  zoomInButton?: HTMLButtonElement;
  zoomOutButton?: HTMLButtonElement;
  resetButton?: HTMLButtonElement;
  zoomStep?: number;
  minScaleRatio?: number;
  maxScaleRatio?: number;
  observeResize?: boolean;
  ignoredPointerSelector?: string;
  transition?: string;
  onStateChange?: (state: ZoomPanState) => void;
}

export interface ZoomPanEngine {
  fit(): void;
  reset(): void;
  setScale(
    nextScale: number,
    focus?: Partial<ZoomPanPoint>,
    useTransition?: boolean,
  ): void;
  panBy(delta: ZoomPanPoint): void;
  centerOn(
    point: ZoomPanPoint,
    targetScaleRatio?: number,
    useTransition?: boolean,
  ): void;
  getState(): ZoomPanState;
  destroy(): void;
}
