import { mountColorRevealEngine } from "./color-reveal-engine";
import { createAccessibleDialogController } from "./dialog-controller";
import type {
  ColorRevealEngine,
  ColorRevealPhase,
} from "../types/color-reveal";

const initializedPages = new WeakSet<HTMLElement>();

const statusByPhase = {
  idle: "Зажмите и ведите курсором или пальцем по картине либо нажмите «Показать полностью».",
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
  const completeButton = root.querySelector<HTMLButtonElement>(
    "[data-reveal-complete]",
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
    !completeButton ||
    !dialog ||
    !dialogResetButton ||
    !dialogCloseButton
  ) {
    return;
  }

  const progressBar = progressElement;
  const progressLabel = progressText;
  const status = statusElement;
  const revealCompleteButton = completeButton;
  const completionDialog = dialog;
  const completionDialogController =
    createAccessibleDialogController(completionDialog);
  let engine: ColorRevealEngine | null = null;

  function updateProgress(displayPercent: number): void {
    progressBar.value = displayPercent;
    progressBar.textContent = `${displayPercent}%`;
    progressLabel.textContent = `${displayPercent}%`;
  }

  function updateCompleteButton(phase: ColorRevealPhase): void {
    revealCompleteButton.disabled =
      phase === "completing" || phase === "complete";
  }

  function closeDialog(): void {
    completionDialogController.close();
  }

  function reset(): void {
    closeDialog();
    engine?.reset();
  }

  function completeWithoutGesture(): void {
    if (!engine) {
      return;
    }

    status.textContent = statusByPhase.completing;
    engine.startAutoReveal();
  }

  function openCompletionDialog(): void {
    completionDialogController.open({ initialFocus: continueLink });
  }

  engine = mountColorRevealEngine({
    container,
    baseCanvas,
    revealCanvas,
    sourceImage,
    brushElement,
    onPhaseChange: (phase) => {
      status.textContent = statusByPhase[phase];
      updateCompleteButton(phase);
    },
    onProgress: ({ displayPercent, phase }) => {
      updateProgress(displayPercent);
      status.textContent = statusByPhase[phase];
      updateCompleteButton(phase);
    },
    onComplete: openCompletionDialog,
  });

  resetButton.addEventListener("click", reset);
  revealCompleteButton.addEventListener("click", completeWithoutGesture);
  dialogResetButton.addEventListener("click", reset);
  dialogCloseButton.addEventListener("click", closeDialog);
  root.ownerDocument.defaultView?.addEventListener(
    "pagehide",
    () => {
      completionDialogController.destroy();
      engine?.destroy();
    },
    { once: true },
  );

  initializedPages.add(root);
}

document
  .querySelectorAll<HTMLElement>("[data-color-reveal-page]")
  .forEach(setupColorRevealPage);
