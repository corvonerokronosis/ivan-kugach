export type CssPercentage = `${number}%`;
export type CssAngle = `${number}deg`;

export interface LightWorkImage {
  src: string;
  alt: string;
}

export interface LightWork {
  id: string;
  order: number;
  title: string;
  image: LightWorkImage;
}

export interface LightStateVisual {
  filter: string;
  overlay: string;
  overlayOpacity: number;
  beam: string;
  beamOpacity: number;
  shadow: number;
  sideShadow: number;
  focusX: CssPercentage;
  focusY: CssPercentage;
  shadowAngle: CssAngle;
}

export interface LightState {
  id: string;
  order: number;
  label: string;
  title: string;
  text: string;
  visual: LightStateVisual;
}

export interface LightExperienceDefaults {
  workId: string;
  stateId: string;
}

export interface LightControllerState {
  activeWork: LightWork;
  activeState: LightState;
  rangeValue: number;
  rangeMin: number;
  rangeMax: number;
  viewedStateIds: string[];
  viewedCount: number;
  totalStates: number;
  isComplete: boolean;
}

export interface LightControllerOptions {
  works: LightWork[];
  states: LightState[];
  defaults: LightExperienceDefaults;
  onStateChange?: (state: LightControllerState) => void;
  onComplete?: (state: LightControllerState) => void;
}

export interface LightController {
  getState(): LightControllerState;
  setWork(workId: string): void;
  setRangeValue(value: number): void;
  reset(): void;
  destroy(): void;
}
