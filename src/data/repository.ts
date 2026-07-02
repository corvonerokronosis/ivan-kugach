import {
  getArtistPageContent as getLocalArtistPageContent,
  type ArtistPageContent,
} from "./artist-page";
import { validateContentLinks } from "./content-links";
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
  getLightExperienceDefaults as getLocalLightExperienceDefaults,
  getLightStateById as getLocalLightStateById,
  getLightStates as getLocalLightStates,
  getLightWorkById as getLocalLightWorkById,
  getLightWorks as getLocalLightWorks,
} from "./light";
import {
  getNarrativeSequence as getLocalNarrativeSequence,
  getNarrativeSequences as getLocalNarrativeSequences,
} from "./narrative";
import {
  getNarrativeRouteByPathname as getLocalNarrativeRouteByPathname,
  getNarrativeRouteBySequenceId as getLocalNarrativeRouteBySequenceId,
  getNarrativeRouteDefinitions as getLocalNarrativeRouteDefinitions,
} from "./narrative-routes";
import {
  getSeries as getLocalSeries,
  getSeriesById as getLocalSeriesById,
  getSeriesBySlug as getLocalSeriesBySlug,
  getSeriesRefById as getLocalSeriesRefById,
  getSeriesSummaries as getLocalSeriesSummaries,
} from "./series";
import type { Artwork, ArtworkSummary } from "../types/artwork";
import type { Hotspot } from "../types/hotspot";
import type {
  LightExperienceDefaults,
  LightState,
  LightWork,
} from "../types/light";
import type { NarrativeSequence } from "../types/narrative";
import type { NarrativeRouteDefinition } from "../types/narrative-route";
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
  getNarrativeRouteDefinitions(): NarrativeRouteDefinition[];
  getNarrativeRouteBySequenceId(
    sequenceId: string,
  ): NarrativeRouteDefinition | undefined;
  getNarrativeRouteByPathname(
    pathname: string,
  ): NarrativeRouteDefinition | undefined;
  getHotspots(): Hotspot[];
  getHotspotById(id: string): Hotspot | undefined;
  getLightWorks(): LightWork[];
  getLightWorkById(id: string): LightWork | undefined;
  getLightStates(): LightState[];
  getLightStateById(id: string): LightState | undefined;
  getLightExperienceDefaults(): LightExperienceDefaults;
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
  getNarrativeRouteDefinitions: getLocalNarrativeRouteDefinitions,
  getNarrativeRouteBySequenceId: getLocalNarrativeRouteBySequenceId,
  getNarrativeRouteByPathname: getLocalNarrativeRouteByPathname,
  getHotspots: getLocalHotspots,
  getHotspotById: getLocalHotspotById,
  getLightWorks: getLocalLightWorks,
  getLightWorkById: getLocalLightWorkById,
  getLightStates: getLocalLightStates,
  getLightStateById: getLocalLightStateById,
  getLightExperienceDefaults: getLocalLightExperienceDefaults,
} satisfies FrontendDataRepository;

validateContentLinks(localDataRepository);

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

export function getNarrativeRouteDefinitions(): NarrativeRouteDefinition[] {
  return getDataRepository().getNarrativeRouteDefinitions();
}

export function getNarrativeRouteBySequenceId(
  sequenceId: string,
): NarrativeRouteDefinition | undefined {
  return getDataRepository().getNarrativeRouteBySequenceId(sequenceId);
}

export function getNarrativeRouteByPathname(
  pathname: string,
): NarrativeRouteDefinition | undefined {
  return getDataRepository().getNarrativeRouteByPathname(pathname);
}

export function getHotspots(): Hotspot[] {
  return getDataRepository().getHotspots();
}

export function getHotspotById(id: string): Hotspot | undefined {
  return getDataRepository().getHotspotById(id);
}

export function getLightWorks(): LightWork[] {
  return getDataRepository().getLightWorks();
}

export function getLightWorkById(id: string): LightWork | undefined {
  return getDataRepository().getLightWorkById(id);
}

export function getLightStates(): LightState[] {
  return getDataRepository().getLightStates();
}

export function getLightStateById(id: string): LightState | undefined {
  return getDataRepository().getLightStateById(id);
}

export function getLightExperienceDefaults(): LightExperienceDefaults {
  return getDataRepository().getLightExperienceDefaults();
}
