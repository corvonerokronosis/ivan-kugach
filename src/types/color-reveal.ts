export type ColorRevealPhase =
  | "idle"
  | "painting"
  | "completing"
  | "complete"
  | "destroyed";

export interface ColorRevealSourceBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ColorRevealProgress {
  rawPercent: number;
  displayPercent: number;
  phase: ColorRevealPhase;
}

export interface ColorRevealEngineOptions {
  container: HTMLElement;
  baseCanvas: HTMLCanvasElement;
  revealCanvas: HTMLCanvasElement;
  sourceImage: HTMLImageElement;
  brushElement?: HTMLElement;
  sourceBounds?: ColorRevealSourceBounds;
  brushRadius?: number;
  splashRadius?: number;
  coverageCellSize?: number;
  completionTarget?: number;
  autoRevealDuration?: number;
  completionDelay?: number;
  observeResize?: boolean;
  isEnabled?: () => boolean;
  onProgress?: (progress: ColorRevealProgress) => void;
  onPhaseChange?: (phase: ColorRevealPhase) => void;
  onComplete?: () => void;
}

export interface ColorRevealEngine {
  resize(): void;
  reset(): void;
  startAutoReveal(): void;
  getProgress(): ColorRevealProgress;
  destroy(): void;
}
