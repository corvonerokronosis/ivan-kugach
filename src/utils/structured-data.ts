import type { Artwork, ArtworkImage } from "../types/artwork";

export type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdObject
  | JsonLdValue[];

export interface JsonLdObject {
  [key: string]: JsonLdValue;
}

interface CreateArtworkStructuredDataOptions {
  artwork: Artwork;
  primaryImage: ArtworkImage;
  pageUrl: URL;
}

const artistName = "Иван Кугач";
const unconfirmedMarker = "уточняется";

export function createArtworkStructuredData({
  artwork,
  primaryImage,
  pageUrl,
}: CreateArtworkStructuredDataOptions): JsonLdObject {
  const artist = createArtistStructuredData(pageUrl);
  const artworkData: JsonLdObject = {
    "@type": "VisualArtwork",
    "@id": new URL("#artwork", pageUrl).toString(),
    url: pageUrl.toString(),
    name: artwork.title,
    creator: {
      "@id": String(artist["@id"]),
    },
    image: new URL(primaryImage.src, pageUrl).toString(),
    description: artwork.fullDescription,
  };

  addConfirmedField(artworkData, "dateCreated", artwork.year);
  addConfirmedField(artworkData, "artMedium", artwork.technique);
  addConfirmedField(artworkData, "size", artwork.dimensions.label);

  if (artwork.series) {
    artworkData.isPartOf = {
      "@type": "CreativeWorkSeries",
      name: artwork.series.title,
      url: new URL(`/series/${artwork.series.slug}/`, pageUrl).toString(),
    };
  }

  return {
    "@context": "https://schema.org",
    "@graph": [artist, artworkData],
  };
}

function createArtistStructuredData(baseUrl: URL): JsonLdObject {
  return {
    "@type": "Person",
    "@id": new URL("/#ivan-kugach", baseUrl).toString(),
    name: artistName,
  };
}

function addConfirmedField(
  target: JsonLdObject,
  property: string,
  value: string,
): void {
  const normalizedValue = value.trim();

  if (
    normalizedValue.length > 0 &&
    !normalizedValue.toLowerCase().includes(unconfirmedMarker)
  ) {
    target[property] = normalizedValue;
  }
}
