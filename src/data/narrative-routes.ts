import { getNarrativeSequences } from "./narrative";
import type { NarrativeCompletionAction } from "../types/narrative";
import type { NarrativeRouteDefinition } from "../types/narrative-route";

export const directInteractivePaths = [
  "/experience/color-return/",
  "/experience/details/",
  "/experience/light/",
] as const;

const completionPaths: Record<NarrativeCompletionAction, string> = {
  landing: "/",
  experience: "/experience/color-return/",
  explore: "/experience/details/",
  light: "/experience/light/",
};

const narrativeRouteDefinitions = validateNarrativeRoutes([
  {
    sequenceId: "intro",
    pathname: "/experience/story/intro/",
    entryPaths: ["/", "/experience/"],
    completionAction: "experience",
    completionPath: "/experience/color-return/",
    enterHistoryAction: "push",
    exitHistoryAction: "replace",
  },
  {
    sequenceId: "bridge",
    pathname: "/experience/story/bridge/",
    entryPaths: ["/experience/color-return/"],
    completionAction: "explore",
    completionPath: "/experience/details/",
    enterHistoryAction: "push",
    exitHistoryAction: "replace",
  },
  {
    sequenceId: "lightBridge",
    pathname: "/experience/story/light-bridge/",
    entryPaths: ["/experience/details/"],
    completionAction: "light",
    completionPath: "/experience/light/",
    enterHistoryAction: "push",
    exitHistoryAction: "replace",
  },
  {
    sequenceId: "finale",
    pathname: "/experience/story/finale/",
    entryPaths: ["/experience/light/"],
    completionAction: "landing",
    completionPath: "/",
    enterHistoryAction: "push",
    exitHistoryAction: "replace",
  },
] satisfies NarrativeRouteDefinition[]);

export function getNarrativeRouteDefinitions(): NarrativeRouteDefinition[] {
  return narrativeRouteDefinitions.map((route) => ({
    ...route,
    entryPaths: [...route.entryPaths],
  }));
}

export function getNarrativeRouteBySequenceId(
  sequenceId: string,
): NarrativeRouteDefinition | undefined {
  const route = narrativeRouteDefinitions.find(
    (candidate) => candidate.sequenceId === sequenceId,
  );

  return route ? { ...route, entryPaths: [...route.entryPaths] } : undefined;
}

export function getNarrativeRouteByPathname(
  pathname: string,
): NarrativeRouteDefinition | undefined {
  const route = narrativeRouteDefinitions.find(
    (candidate) => candidate.pathname === pathname,
  );

  return route ? { ...route, entryPaths: [...route.entryPaths] } : undefined;
}

function validateNarrativeRoutes(
  routes: NarrativeRouteDefinition[],
): NarrativeRouteDefinition[] {
  const sequences = getNarrativeSequences();
  const sequenceIds = new Set(sequences.map((sequence) => sequence.id));
  const configuredSequenceIds = new Set<string>();
  const pathnames = new Set<string>();

  assert(
    routes.length === sequences.length,
    "narrative routes: каждая последовательность должна иметь один URL",
  );

  routes.forEach((route) => {
    assert(
      sequenceIds.has(route.sequenceId),
      `narrative routes: неизвестная последовательность "${route.sequenceId}"`,
    );
    assert(
      !configuredSequenceIds.has(route.sequenceId),
      `narrative routes: повторяется sequenceId "${route.sequenceId}"`,
    );
    assert(
      !pathnames.has(route.pathname),
      `narrative routes: повторяется pathname "${route.pathname}"`,
    );
    assertCanonicalPath(route.pathname, `pathname для "${route.sequenceId}"`);
    route.entryPaths.forEach((entryPath) => {
      assertCanonicalPath(entryPath, `entryPath для "${route.sequenceId}"`);
    });
    assertCanonicalPath(
      route.completionPath,
      `completionPath для "${route.sequenceId}"`,
    );
    assert(
      route.completionPath === completionPaths[route.completionAction],
      `narrative routes: completionPath не соответствует completionAction у "${route.sequenceId}"`,
    );
    assert(
      route.enterHistoryAction === "push",
      `narrative routes: вход в "${route.sequenceId}" должен добавлять history entry`,
    );
    assert(
      route.exitHistoryAction === "replace",
      `narrative routes: выход из "${route.sequenceId}" должен заменять history entry`,
    );

    configuredSequenceIds.add(route.sequenceId);
    pathnames.add(route.pathname);
  });

  return routes;
}

function assertCanonicalPath(pathname: string, label: string): void {
  assert(
    pathname.startsWith("/") &&
      (pathname === "/" || pathname.endsWith("/")) &&
      !pathname.includes("?") &&
      !pathname.includes("#"),
    `narrative routes: ${label} должен быть каноническим pathname`,
  );
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
