import { mountColorRevealEngine } from "./color-reveal-engine";
import type { ColorRevealEngine } from "../types/color-reveal";

const initializedPreviews = new WeakSet<HTMLElement>();

function setupColorRevealPreview(root: HTMLElement): void {
  if (initializedPreviews.has(root)) {
    return;
  }

  const container = root.querySelector<HTMLElement>("[data-reveal-container]");
  const baseCanvas =
    root.querySelector<HTMLCanvasElement>("[data-reveal-base]");
  const revealCanvas = root.querySelector<HTMLCanvasElement>(
    "[data-reveal-layer]",
  );
  const sourceImage = root.querySelector<HTMLImageElement>(
    "[data-reveal-source]",
  );
  const brushElement = root.querySelector<HTMLElement>("[data-reveal-brush]");
  const phaseOutput = root.querySelector<HTMLElement>("[data-reveal-phase]");
  const progressOutput = root.querySelector<HTMLElement>(
    "[data-reveal-progress]",
  );
  const remountButton = root.querySelector<HTMLButtonElement>(
    "[data-reveal-remount]",
  );
  const resetButton = root.querySelector<HTMLButtonElement>(
    "[data-reveal-reset]",
  );
  const destroyButton = root.querySelector<HTMLButtonElement>(
    "[data-reveal-destroy]",
  );

  if (
    !container ||
    !baseCanvas ||
    !revealCanvas ||
    !sourceImage ||
    !brushElement ||
    !phaseOutput ||
    !progressOutput ||
    !remountButton ||
    !resetButton ||
    !destroyButton
  ) {
    return;
  }

  const stageContainer = container;
  const baseLayer = baseCanvas;
  const revealLayer = revealCanvas;
  const artworkSource = sourceImage;
  const brush = brushElement;
  const phaseElement = phaseOutput;
  const progressElement = progressOutput;
  let engine: ColorRevealEngine | null = null;

  function mount(): void {
    engine = mountColorRevealEngine({
      container: stageContainer,
      baseCanvas: baseLayer,
      revealCanvas: revealLayer,
      sourceImage: artworkSource,
      brushElement: brush,
      onPhaseChange: (phase) => {
        phaseElement.textContent = phase;
      },
      onProgress: ({ displayPercent, phase }) => {
        phaseElement.textContent = phase;
        progressElement.textContent = `${displayPercent}%`;
      },
      onComplete: () => {
        phaseElement.textContent = "complete";
      },
    });
  }

  remountButton.addEventListener("click", mount);
  resetButton.addEventListener("click", () => engine?.reset());
  destroyButton.addEventListener("click", () => engine?.destroy());
  root.ownerDocument.defaultView?.addEventListener(
    "pagehide",
    () => engine?.destroy(),
    { once: true },
  );

  initializedPreviews.add(root);
  mount();
}

document
  .querySelectorAll<HTMLElement>("[data-color-reveal-preview]")
  .forEach(setupColorRevealPreview);
