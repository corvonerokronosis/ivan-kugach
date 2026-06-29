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
