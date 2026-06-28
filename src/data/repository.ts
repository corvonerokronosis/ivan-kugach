import {
  getArtistPageContent as getLocalArtistPageContent,
  type ArtistPageContent,
} from "./artist-page";
import {
  artworkAvailabilityLabels as localArtworkAvailabilityLabels,
  getArchivedArtworks as getLocalArchivedArtworks,
  getArtworkBySlug as getLocalArtworkBySlug,
  getArtworkSummaries as getLocalArtworkSummaries,
  getArtworks as getLocalArtworks,
  getArtworksBySeriesId as getLocalArtworksBySeriesId,
  getCatalogArtworks as getLocalCatalogArtworks,
  getFeaturedArtworks as getLocalFeaturedArtworks,
} from "./artworks";
import {
  getHotspotById as getLocalHotspotById,
  getHotspots as getLocalHotspots,
} from "./hotspots";
import {
  getNarrativeSequence as getLocalNarrativeSequence,
  getNarrativeSequences as getLocalNarrativeSequences,
} from "./narrative";
import {
  getSeries as getLocalSeries,
  getSeriesById as getLocalSeriesById,
  getSeriesBySlug as getLocalSeriesBySlug,
  getSeriesRefById as getLocalSeriesRefById,
  getSeriesSummaries as getLocalSeriesSummaries,
} from "./series";
import type { Artwork, ArtworkSummary } from "../types/artwork";
import type { Hotspot } from "../types/hotspot";
import type { NarrativeSequence } from "../types/narrative";
import type { Series, SeriesRef, SeriesSummary } from "../types/series";

export type ArtworkAvailabilityLabels = typeof localArtworkAvailabilityLabels;

export interface FrontendDataRepository {
  artworkAvailabilityLabels: ArtworkAvailabilityLabels;
  getArtistPageContent(): ArtistPageContent;
  getArtworks(): Artwork[];
  getArtworkSummaries(): ArtworkSummary[];
  getCatalogArtworks(): ArtworkSummary[];
  getArchivedArtworks(): ArtworkSummary[];
  getFeaturedArtworks(): ArtworkSummary[];
  getArtworkBySlug(slug: string): Artwork | undefined;
  getArtworksBySeriesId(seriesId: string): ArtworkSummary[];
  getSeries(): Series[];
  getSeriesSummaries(): SeriesSummary[];
  getSeriesById(id: string): Series | undefined;
  getSeriesBySlug(slug: string): Series | undefined;
  getSeriesRefById(id: string): SeriesRef;
  getNarrativeSequences(): NarrativeSequence[];
  getNarrativeSequence(id: string): NarrativeSequence | undefined;
  getHotspots(): Hotspot[];
  getHotspotById(id: string): Hotspot | undefined;
}

const localDataRepository = {
  artworkAvailabilityLabels: localArtworkAvailabilityLabels,
  getArtistPageContent: getLocalArtistPageContent,
  getArtworks: getLocalArtworks,
  getArtworkSummaries: getLocalArtworkSummaries,
  getCatalogArtworks: getLocalCatalogArtworks,
  getArchivedArtworks: getLocalArchivedArtworks,
  getFeaturedArtworks: getLocalFeaturedArtworks,
  getArtworkBySlug: getLocalArtworkBySlug,
  getArtworksBySeriesId: getLocalArtworksBySeriesId,
  getSeries: getLocalSeries,
  getSeriesSummaries: getLocalSeriesSummaries,
  getSeriesById: getLocalSeriesById,
  getSeriesBySlug: getLocalSeriesBySlug,
  getSeriesRefById: getLocalSeriesRefById,
  getNarrativeSequences: getLocalNarrativeSequences,
  getNarrativeSequence: getLocalNarrativeSequence,
  getHotspots: getLocalHotspots,
  getHotspotById: getLocalHotspotById,
} satisfies FrontendDataRepository;

export function getDataRepository(): FrontendDataRepository {
  return localDataRepository;
}

export const artworkAvailabilityLabels =
  localDataRepository.artworkAvailabilityLabels;

export function getArtistPageContent(): ArtistPageContent {
  return getDataRepository().getArtistPageContent();
}

export function getArtworks(): Artwork[] {
  return getDataRepository().getArtworks();
}

export function getArtworkSummaries(): ArtworkSummary[] {
  return getDataRepository().getArtworkSummaries();
}

export function getCatalogArtworks(): ArtworkSummary[] {
  return getDataRepository().getCatalogArtworks();
}

export function getArchivedArtworks(): ArtworkSummary[] {
  return getDataRepository().getArchivedArtworks();
}

export function getFeaturedArtworks(): ArtworkSummary[] {
  return getDataRepository().getFeaturedArtworks();
}

export function getArtworkBySlug(slug: string): Artwork | undefined {
  return getDataRepository().getArtworkBySlug(slug);
}

export function getArtworksBySeriesId(seriesId: string): ArtworkSummary[] {
  return getDataRepository().getArtworksBySeriesId(seriesId);
}

export function getSeries(): Series[] {
  return getDataRepository().getSeries();
}

export function getSeriesSummaries(): SeriesSummary[] {
  return getDataRepository().getSeriesSummaries();
}

export function getSeriesById(id: string): Series | undefined {
  return getDataRepository().getSeriesById(id);
}

export function getSeriesBySlug(slug: string): Series | undefined {
  return getDataRepository().getSeriesBySlug(slug);
}

export function getSeriesRefById(id: string): SeriesRef {
  return getDataRepository().getSeriesRefById(id);
}

export function getNarrativeSequences(): NarrativeSequence[] {
  return getDataRepository().getNarrativeSequences();
}

export function getNarrativeSequence(
  id: string,
): NarrativeSequence | undefined {
  return getDataRepository().getNarrativeSequence(id);
}

export function getHotspots(): Hotspot[] {
  return getDataRepository().getHotspots();
}

export function getHotspotById(id: string): Hotspot | undefined {
  return getDataRepository().getHotspotById(id);
}
