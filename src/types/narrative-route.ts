import type { NarrativeCompletionAction } from "./narrative";

export type NarrativeHistoryAction = "push" | "replace";

export interface NarrativeRouteDefinition {
  sequenceId: string;
  pathname: string;
  entryPaths: string[];
  completionAction: NarrativeCompletionAction;
  completionPath: string;
  enterHistoryAction: "push";
  exitHistoryAction: "replace";
}
