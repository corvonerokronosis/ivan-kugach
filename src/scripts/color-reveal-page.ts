import { mountColorRevealEngine } from "./color-reveal-engine";
import type { ColorRevealEngine } from "../types/color-reveal";

const initializedPages = new WeakSet<HTMLElement>();

const statusByPhase = {
  idle: "Зажмите и ведите курсором или пальцем по картине.",
  painting: "Цвет возвращается вслед за движением кисти.",
  completing: "Картина раскрывается полностью.",
  complete: "Картина раскрыта. Можно продолжить историю.",
  destroyed: "Интерактив остановлен.",
} as const;

function setupColorRevealPage(root: HTMLElement): void {
  if (initializedPages.has(root)) {
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
  const progressElement = root.querySelector<HTMLProgressElement>(
    "[data-reveal-progress]",
  );
  const progressText = root.querySelector<HTMLElement>(
    "[data-reveal-progress-text]",
  );
  const statusElement = root.querySelector<HTMLElement>("[data-reveal-status]");
  const resetButton = root.querySelector<HTMLButtonElement>(
    "[data-reveal-reset]",
  );
  const dialog = root.querySelector<HTMLDialogElement>("dialog");
  const dialogResetButton = root.querySelector<HTMLButtonElement>(
    "[data-reveal-dialog-reset]",
  );
  const dialogCloseButton = root.querySelector<HTMLButtonElement>(
    "[data-reveal-dialog-close]",
  );
  const continueLink = dialog?.querySelector<HTMLAnchorElement>("a[href]");

  if (
    !container ||
    !baseCanvas ||
    !revealCanvas ||
    !sourceImage ||
    !brushElement ||
    !progressElement ||
    !progressText ||
    !statusElement ||
    !resetButton ||
    !dialog ||
    !dialogResetButton ||
    !dialogCloseButton
  ) {
    return;
  }

  const progressBar = progressElement;
  const progressLabel = progressText;
  const completionDialog = dialog;
  let engine: ColorRevealEngine | null = null;

  function updateProgress(displayPercent: number): void {
    progressBar.value = displayPercent;
    progressBar.textContent = `${displayPercent}%`;
    progressLabel.textContent = `${displayPercent}%`;
  }

  function closeDialog(): void {
    if (completionDialog.open) {
      completionDialog.close();
    }
  }

  function reset(): void {
    closeDialog();
    engine?.reset();
  }

  function openCompletionDialog(): void {
    if (!completionDialog.open) {
      completionDialog.showModal();
    }
    continueLink?.focus({ preventScroll: true });
  }

  engine = mountColorRevealEngine({
    container,
    baseCanvas,
    revealCanvas,
    sourceImage,
    brushElement,
    onPhaseChange: (phase) => {
      statusElement.textContent = statusByPhase[phase];
    },
    onProgress: ({ displayPercent, phase }) => {
      updateProgress(displayPercent);
      statusElement.textContent = statusByPhase[phase];
    },
    onComplete: openCompletionDialog,
  });

  resetButton.addEventListener("click", reset);
  dialogResetButton.addEventListener("click", reset);
  dialogCloseButton.addEventListener("click", closeDialog);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeDialog();
    }
  });
  root.ownerDocument.defaultView?.addEventListener(
    "pagehide",
    () => engine?.destroy(),
    { once: true },
  );

  initializedPages.add(root);
}

document
  .querySelectorAll<HTMLElement>("[data-color-reveal-page]")
  .forEach(setupColorRevealPage);
