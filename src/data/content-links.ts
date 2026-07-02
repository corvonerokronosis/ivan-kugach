import { getProductionImageAsset } from "../utils/image-assets";
import type { FrontendDataRepository } from "./repository";

const knownStaticPaths = new Set([
  "/",
  "/artist/",
  "/experience/",
  "/experience/color-return/",
  "/experience/details/",
  "/experience/light/",
  "/works/",
  "/archive/",
]);

export function validateContentLinks(repository: FrontendDataRepository): void {
  validateArtworkLinks(repository);
  validateSeriesLinks(repository);
  validateNarrativeLinks(repository);
  validateHotspotLinks(repository);
}

function validateArtworkLinks(repository: FrontendDataRepository): void {
  const artworks = repository.getArtworks();

  assertUnique(
    artworks,
    (artwork) => artwork.id,
    "artworks",
    "id",
    (artwork) => artwork.id,
  );
  assertUnique(
    artworks,
    (artwork) => artwork.slug,
    "artworks",
    "slug",
    (artwork) => artwork.id,
  );

  artworks.forEach((artwork) => {
    assert(
      repository.artworkAvailabilityLabels[artwork.availability] !== undefined,
      `content links: artworks "${artwork.id}" availability has no status label`,
    );

    artwork.images.forEach((image, imageIndex) => {
      assertProductionImage(
        image.src,
        `artworks "${artwork.id}" images[${imageIndex}].src`,
      );
    });

    if (artwork.seo?.image) {
      assertProductionImage(
        artwork.seo.image,
        `artworks "${artwork.id}" seo.image`,
      );
    }

    if (!artwork.series) {
      return;
    }

    const series = repository.getSeriesById(artwork.series.id);

    assert(
      series !== undefined,
      `content links: artworks "${artwork.id}" series.id "${artwork.series.id}" is missing`,
    );
    assert(
      series.slug === artwork.series.slug,
      `content links: artworks "${artwork.id}" series.slug does not match series "${series.id}"`,
    );
    assert(
      series.title === artwork.series.title,
      `content links: artworks "${artwork.id}" series.title does not match series "${series.id}"`,
    );
  });
}

function validateSeriesLinks(repository: FrontendDataRepository): void {
  const series = repository.getSeries();

  assertUnique(
    series,
    (item) => item.id,
    "series",
    "id",
    (item) => item.id,
  );
  assertUnique(
    series,
    (item) => item.slug,
    "series",
    "slug",
    (item) => item.id,
  );

  series.forEach((item) => {
    if (item.cover) {
      assertProductionImage(item.cover.src, `series "${item.id}" cover.src`);
    }

    if (item.seo?.image) {
      assertProductionImage(item.seo.image, `series "${item.id}" seo.image`);
    }
  });
}

function validateNarrativeLinks(repository: FrontendDataRepository): void {
  const sequences = repository.getNarrativeSequences();
  const routes = repository.getNarrativeRouteDefinitions();
  const knownPaths = new Set([
    ...knownStaticPaths,
    ...routes.map((route) => route.pathname),
  ]);

  assertUnique(
    sequences,
    (sequence) => sequence.id,
    "narrative",
    "id",
    (sequence) => sequence.id,
  );
  assertUnique(
    routes,
    (route) => route.pathname,
    "narrative routes",
    "pathname",
    (route) => route.sequenceId,
  );

  sequences.forEach((sequence) => {
    const route = repository.getNarrativeRouteBySequenceId(sequence.id);

    assert(
      route !== undefined,
      `content links: narrative "${sequence.id}" route is missing`,
    );
    assert(
      route.completionAction === sequence.completionAction,
      `content links: narrative "${sequence.id}" completionAction does not match route`,
    );
    assertKnownPath(
      knownPaths,
      route.completionPath,
      `narrative "${sequence.id}" completionPath`,
    );

    route.entryPaths.forEach((entryPath, entryIndex) => {
      assertKnownPath(
        knownPaths,
        entryPath,
        `narrative "${sequence.id}" entryPaths[${entryIndex}]`,
      );
    });

    sequence.slides.forEach((slide, slideIndex) => {
      assertProductionImage(
        slide.image.src,
        `narrative "${sequence.id}" slides[${slideIndex}].image.src`,
      );
    });
  });
}

function validateHotspotLinks(repository: FrontendDataRepository): void {
  const hotspots = repository.getHotspots();

  assertUnique(
    hotspots,
    (hotspot) => hotspot.id,
    "hotspots",
    "id",
    (hotspot) => hotspot.id,
  );

  hotspots.forEach((hotspot) => {
    assertProductionImage(
      hotspot.image.src,
      `hotspots "${hotspot.id}" image.src`,
    );
  });
}

function assertProductionImage(src: string, field: string): void {
  try {
    getProductionImageAsset(src);
  } catch {
    throw new Error(
      `content links: ${field} points to unknown production image "${src}"`,
    );
  }
}

function assertKnownPath(
  knownPaths: Set<string>,
  pathname: string,
  field: string,
): void {
  assert(
    knownPaths.has(pathname),
    `content links: ${field} points to unknown route "${pathname}"`,
  );
}

function assertUnique<T>(
  records: T[],
  getValue: (record: T) => string,
  collectionName: string,
  fieldName: string,
  getRecordId: (record: T) => string,
): void {
  const seen = new Map<string, string>();

  records.forEach((record) => {
    const value = getValue(record);
    const recordId = getRecordId(record);
    const previousRecordId = seen.get(value);

    assert(
      previousRecordId === undefined,
      `content links: ${collectionName} "${recordId}" ${fieldName} duplicates "${previousRecordId}"`,
    );
    seen.set(value, recordId);
  });
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
