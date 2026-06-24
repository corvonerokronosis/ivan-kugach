export interface HotspotImage {
  src: string;
  alt: string;
}

export interface HotspotPosition {
  x: number;
  y: number;
}

export interface Hotspot {
  id: string;
  order: number;
  image: HotspotImage;
  position: HotspotPosition;
  targetScale: number;
  label: string;
  title: string;
  text: string;
}
