import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { validateContentLinks } from "../.tmp/unit-tests/data/content-links.js";
import { getDataRepository } from "../.tmp/unit-tests/data/repository.js";

const repo = getDataRepository();

describe("frontend data repository contract", () => {
  it("keeps all content links valid for production build", () => {
    assert.doesNotThrow(() => validateContentLinks(repo));
  });

  it("reports record and field for broken content links", () => {
    const [firstArtwork, ...otherArtworks] = repo.getArtworks();
    const invalidArtwork = {
      ...firstArtwork,
      images: [
        {
          ...firstArtwork.images[0],
          src: "/missing-production-image.jpg",
        },
      ],
    };

    assert.throws(
      () =>
        validateContentLinks({
          ...repo,
          getArtworks: () => [invalidArtwork, ...otherArtworks],
        }),
      /artworks "dor-3518" images\[0\]\.src points to unknown production image/,
    );
  });

  it("partitions artworks into catalog and archive without losing records", () => {
    const artworks = repo.getArtworks();
    const catalog = repo.getCatalogArtworks();
    const archive = repo.getArchivedArtworks();
    const featured = repo.getFeaturedArtworks();

    assert.ok(artworks.length > 0);
    assert.equal(catalog.length + archive.length, artworks.length);
    assert.equal(
      catalog.every((artwork) => artwork.availability !== "sold"),
      true,
    );
    assert.equal(
      archive.every((artwork) => artwork.availability === "sold"),
      true,
    );
    assert.equal(
      featured.every((artwork) => artwork.featured === true),
      true,
    );
  });

  it("keeps artwork ids, slugs, summaries and images valid", () => {
    const artworks = repo.getArtworks();
    const summaries = repo.getArtworkSummaries();

    assert.equal(
      new Set(artworks.map((artwork) => artwork.id)).size,
      artworks.length,
    );
    assert.equal(
      new Set(artworks.map((artwork) => artwork.slug)).size,
      artworks.length,
    );
    assert.equal(summaries.length, artworks.length);

    artworks.forEach((artwork) => {
      assert.match(artwork.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      assert.ok(artwork.images.some((image) => image.role === "primary"));
      assert.equal(repo.getArtworkBySlug(artwork.slug)?.id, artwork.id);

      if (artwork.priceType === "fixed") {
        assert.equal(typeof artwork.price, "string");
      } else {
        assert.equal(artwork.price, null);
      }
    });

    summaries.forEach((summary) => {
      assert.equal("fullDescription" in summary, false);
      assert.equal("seo" in summary, false);
    });
  });

  it("resolves artwork series references to existing series", () => {
    const series = repo.getSeries();

    assert.equal(new Set(series.map((item) => item.id)).size, series.length);
    assert.equal(new Set(series.map((item) => item.slug)).size, series.length);

    repo.getArtworks().forEach((artwork) => {
      if (artwork.series === null) {
        return;
      }

      const linkedSeries = repo.getSeriesById(artwork.series.id);

      assert.ok(linkedSeries);
      assert.equal(artwork.series.slug, linkedSeries.slug);
      assert.equal(artwork.series.title, linkedSeries.title);
      assert.equal(
        repo.getSeriesBySlug(linkedSeries.slug)?.id,
        linkedSeries.id,
      );
      assert.ok(
        repo
          .getArtworksBySeriesId(linkedSeries.id)
          .some((candidate) => candidate.id === artwork.id),
      );
    });
  });

  it("keeps narrative routes in sync with narrative sequences", () => {
    const sequences = repo.getNarrativeSequences();
    const routes = repo.getNarrativeRouteDefinitions();
    const sequenceIds = new Set(sequences.map((sequence) => sequence.id));

    assert.equal(routes.length, sequences.length);

    routes.forEach((route) => {
      assert.equal(sequenceIds.has(route.sequenceId), true);
      assertCanonicalPath(route.pathname);
      assertCanonicalPath(route.completionPath);
      route.entryPaths.forEach(assertCanonicalPath);
      assert.equal(
        repo.getNarrativeRouteBySequenceId(route.sequenceId)?.pathname,
        route.pathname,
      );
      assert.equal(
        repo.getNarrativeRouteByPathname(route.pathname)?.sequenceId,
        route.sequenceId,
      );
    });
  });

  it("keeps hotspot positions and light defaults resolvable", () => {
    const hotspots = repo.getHotspots();
    const lightDefaults = repo.getLightExperienceDefaults();

    assert.deepEqual(
      hotspots.map((hotspot) => hotspot.order),
      [...hotspots].map((hotspot) => hotspot.order).sort((a, b) => a - b),
    );
    hotspots.forEach((hotspot) => {
      assert.equal(repo.getHotspotById(hotspot.id)?.title, hotspot.title);
      assert.ok(hotspot.position.x >= 0 && hotspot.position.x <= 1);
      assert.ok(hotspot.position.y >= 0 && hotspot.position.y <= 1);
      assert.ok(hotspot.targetScale > 0);
    });

    assert.ok(repo.getLightWorkById(lightDefaults.workId));
    assert.ok(repo.getLightStateById(lightDefaults.stateId));
    assert.ok(repo.getLightWorks().length > 0);
    assert.ok(repo.getLightStates().length > 0);
  });
});

function assertCanonicalPath(pathname) {
  assert.equal(pathname.startsWith("/"), true);
  assert.equal(pathname === "/" || pathname.endsWith("/"), true);
  assert.equal(pathname.includes("?"), false);
  assert.equal(pathname.includes("#"), false);
}
