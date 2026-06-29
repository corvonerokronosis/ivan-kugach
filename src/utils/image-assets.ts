import type { ImageMetadata } from "astro";
import colorRevealArtwork from "../assets/images/interactive/color-reveal/kugach-picture-1.png";
import detailsArtwork from "../assets/images/interactive/details/kugach-picture-2.png";
import light6254Artwork from "../assets/images/interactive/light/dor-6254.jpg";
import light6258Artwork from "../assets/images/interactive/light/dor-6258.jpg";
import light6263Artwork from "../assets/images/interactive/light/dor-6263.jpg";
import dor3518Artwork from "../assets/images/works/dor-3518.jpg";
import dor3571Artwork from "../assets/images/works/dor-3571.jpg";
import dsc8578Artwork from "../assets/images/works/dsc-8578.jpg";
import dsc8599Artwork from "../assets/images/works/dsc-8599.jpg";
import dsc8602Artwork from "../assets/images/works/dsc-8602.jpg";

const productionImageAssets = [
  colorRevealArtwork,
  detailsArtwork,
  light6254Artwork,
  light6258Artwork,
  light6263Artwork,
  dor3518Artwork,
  dor3571Artwork,
  dsc8578Artwork,
  dsc8599Artwork,
  dsc8602Artwork,
] satisfies ImageMetadata[];

const productionImageAssetsByUrl = new Map(
  productionImageAssets.map((asset) => [asset.src, asset]),
);

export function getProductionImageAsset(src: string): ImageMetadata {
  const asset = productionImageAssetsByUrl.get(src);

  if (!asset) {
    throw new Error(`Image pipeline: unknown production asset "${src}"`);
  }

  return asset;
}
