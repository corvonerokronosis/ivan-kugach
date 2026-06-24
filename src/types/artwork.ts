import type { SeriesRef } from "./series";

export const artworkAvailabilityValues = [
  "available",
  "reserved",
  "sold",
] as const;

export type ArtworkAvailability = (typeof artworkAvailabilityValues)[number];

export const artworkPriceTypeValues = ["fixed", "request"] as const;

export type ArtworkPriceType = (typeof artworkPriceTypeValues)[number];

export type ArtworkSeriesRef = SeriesRef;

export interface ArtworkImage {
  src: string;
  alt: string;
  caption?: string;
  role?: "primary" | "detail" | "context";
}

export interface ArtworkDimensions {
  label: string;
  width?: number;
  height?: number;
  unit?: "cm" | "mm" | "m";
}

export interface ArtworkSeoFields {
  title?: string;
  description?: string;
  image?: string;
}

export type ArtworkPrice =
  | {
      priceType: "fixed";
      price: string;
    }
  | {
      priceType: "request";
      price: null;
    };

export interface ArtworkBase {
  id: string;
  slug: string;
  title: string;
  year: string;
  series: ArtworkSeriesRef | null;
  images: ArtworkImage[];
  technique: string;
  dimensions: ArtworkDimensions;
  availability: ArtworkAvailability;
  shortDescription: string;
  fullDescription: string;
  featured: boolean;
  order: number;
  seo?: ArtworkSeoFields;
}

export type Artwork = ArtworkBase & ArtworkPrice;

export type ArtworkSummary = Pick<
  Artwork,
  | "id"
  | "slug"
  | "title"
  | "year"
  | "series"
  | "images"
  | "technique"
  | "dimensions"
  | "priceType"
  | "price"
  | "availability"
  | "shortDescription"
  | "featured"
  | "order"
>;

export function isArtworkAvailability(
  value: string,
): value is ArtworkAvailability {
  return artworkAvailabilityValues.includes(value as ArtworkAvailability);
}

export function isArtworkPriceType(value: string): value is ArtworkPriceType {
  return artworkPriceTypeValues.includes(value as ArtworkPriceType);
}
