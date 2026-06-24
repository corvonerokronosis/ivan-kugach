export const narrativeCompletionActionValues = [
  "landing",
  "experience",
  "explore",
  "light",
] as const;

export type NarrativeCompletionAction =
  (typeof narrativeCompletionActionValues)[number];

export interface NarrativeImage {
  src: string;
  alt: string;
  caption: string;
}

export interface NarrativeSlide {
  id: string;
  order: number;
  meta: string[];
  title: string;
  image: NarrativeImage;
  text: string;
  secondaryText: string;
}

export interface NarrativeSequence {
  id: string;
  order: number;
  eyebrow: string;
  lead: string;
  completionLabel: string;
  skipLabel: string;
  completionAction: NarrativeCompletionAction;
  slides: NarrativeSlide[];
}

export function isNarrativeCompletionAction(
  value: string,
): value is NarrativeCompletionAction {
  return narrativeCompletionActionValues.includes(
    value as NarrativeCompletionAction,
  );
}
