import { createLightController } from "./light-controller";
import { createAccessibleDialogController } from "./dialog-controller";
import type {
  LightControllerState,
  LightExperienceDefaults,
  LightState,
  LightWork,
} from "../types/light";

interface LightWorkshopConfig {
  works: LightWork[];
  states: LightState[];
  defaults: LightExperienceDefaults;
}

const initializedWorkshops = new WeakSet<HTMLElement>();

function setupLightWorkshop(root: HTMLElement): void {
  if (initializedWorkshops.has(root)) {
    return;
  }

  const configElement = root.querySelector<HTMLScriptElement>(
    "[data-light-config]",
  );
  const stage = root.querySelector<HTMLElement>("[data-light-stage]");
  const image = root.querySelector<HTMLImageElement>("[data-light-image]");
  const label = root.querySelector<HTMLElement>("[data-light-label]");
  const range = root.querySelector<HTMLInputElement>("[data-light-range]");
  const noteKicker = root.querySelector<HTMLElement>(
    "[data-light-note-kicker]",
  );
  const noteTitle = root.querySelector<HTMLElement>("[data-light-note-title]");
  const noteText = root.querySelector<HTMLElement>("[data-light-note-text]");
  const progressText = root.querySelector<HTMLElement>(
    "[data-light-progress-text]",
  );
  const continueLink = root.querySelector<HTMLAnchorElement>(
    "[data-light-continue]",
  );
  const resetButton =
    root.querySelector<HTMLButtonElement>("[data-light-reset]");
  const workSelector = root.querySelector<HTMLElement>(
    "[data-light-work-selector]",
  );
  const workButtons = Array.from(
    root.querySelectorAll<HTMLButtonElement>("[data-light-work-id]"),
  );
  const progressDots = Array.from(
    root.querySelectorAll<HTMLElement>("[data-light-progress-id]"),
  );
  const completionDialog = root.querySelector<HTMLDialogElement>(
    "#light-workshop-complete-dialog",
  );
  const completionClose = root.querySelector<HTMLButtonElement>(
    "[data-light-complete-close]",
  );
  const completionPrimary = root.querySelector<HTMLAnchorElement>(
    "[data-light-complete-primary]",
  );

  if (
    !configElement ||
    !stage ||
    !image ||
    !label ||
    !range ||
    !noteKicker ||
    !noteTitle ||
    !noteText ||
    !progressText ||
    !continueLink ||
    !resetButton ||
    !workSelector ||
    !completionDialog ||
    !completionClose
  ) {
    return;
  }

  const config = parseConfig(configElement);
  const lightStage = stage;
  const lightImage = image;
  const lightLabel = label;
  const lightRange = range;
  const stateKicker = noteKicker;
  const stateTitle = noteTitle;
  const stateText = noteText;
  const progress = progressText;
  const nextStageLink = continueLink;
  const reset = resetButton;
  const selector = workSelector;
  const completeDialog = completionDialog;
  const completeClose = completionClose;
  const completeDialogController =
    createAccessibleDialogController(completeDialog);
  const view = root.ownerDocument.defaultView;
  let completionTimer: number | null = null;

  function render(state: LightControllerState): void {
    const visual = state.activeState.visual;
    lightImage.src = state.activeWork.image.src;
    lightImage.alt = state.activeWork.image.alt;
    lightLabel.textContent = state.activeState.label;
    lightRange.min = String(state.rangeMin);
    lightRange.max = String(state.rangeMax);
    lightRange.value = String(state.rangeValue);
    lightRange.setAttribute("aria-valuetext", state.activeState.label);
    stateKicker.textContent = `Состояние ${state.rangeValue + 1} из ${state.totalStates}`;
    stateTitle.textContent = state.activeState.title;
    stateText.textContent = state.activeState.text;

    lightStage.style.setProperty("--light-filter", visual.filter);
    lightStage.style.setProperty("--light-overlay", visual.overlay);
    lightStage.style.setProperty(
      "--light-overlay-opacity",
      String(visual.overlayOpacity),
    );
    lightStage.style.setProperty("--light-beam", visual.beam);
    lightStage.style.setProperty(
      "--light-beam-opacity",
      String(visual.beamOpacity),
    );
    lightStage.style.setProperty("--light-shadow", String(visual.shadow));
    lightStage.style.setProperty(
      "--light-side-shadow",
      String(visual.sideShadow),
    );
    lightStage.style.setProperty("--light-focus-x", visual.focusX);
    lightStage.style.setProperty("--light-focus-y", visual.focusY);
    lightStage.style.setProperty("--light-shadow-angle", visual.shadowAngle);

    workButtons.forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.lightWorkId === state.activeWork.id),
      );
    });
    progressDots.forEach((dot) => {
      dot.dataset.viewed = String(
        state.viewedStateIds.includes(dot.dataset.lightProgressId ?? ""),
      );
    });

    progress.textContent = state.isComplete
      ? "Все состояния открыты. Можно продолжить историю или ещё поработать со светом."
      : `Открыто состояний: ${state.viewedCount} из ${state.totalStates}.`;
    nextStageLink.hidden = !state.isComplete;
  }

  function scheduleCompletion(): void {
    if (!view || completionTimer !== null) {
      return;
    }

    completionTimer = view.setTimeout(() => {
      completionTimer = null;
      completeDialogController.open({ initialFocus: completionPrimary });
    }, 360);
  }

  const controller = createLightController({
    ...config,
    onStateChange: render,
    onComplete: scheduleCompletion,
  });

  function handleWorkClick(event: MouseEvent): void {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const button = target.closest<HTMLButtonElement>("[data-light-work-id]");
    if (button && selector.contains(button)) {
      controller.setWork(button.dataset.lightWorkId ?? "");
    }
  }

  function handleRangeInput(): void {
    controller.setRangeValue(Number(lightRange.value));
  }

  function handleReset(): void {
    if (view && completionTimer !== null) {
      view.clearTimeout(completionTimer);
      completionTimer = null;
    }
    completeDialogController.close();
    controller.reset();
    lightRange.focus({ preventScroll: true });
  }

  function closeCompletion(): void {
    completeDialogController.close();
  }

  function destroy(): void {
    if (view && completionTimer !== null) {
      view.clearTimeout(completionTimer);
      completionTimer = null;
    }
    selector.removeEventListener("click", handleWorkClick);
    lightRange.removeEventListener("input", handleRangeInput);
    reset.removeEventListener("click", handleReset);
    completeClose.removeEventListener("click", closeCompletion);
    completeDialogController.destroy();
    controller.destroy();
  }

  selector.addEventListener("click", handleWorkClick);
  lightRange.addEventListener("input", handleRangeInput);
  reset.addEventListener("click", handleReset);
  completeClose.addEventListener("click", closeCompletion);
  view?.addEventListener("pagehide", destroy, { once: true });

  initializedWorkshops.add(root);
  render(controller.getState());
}

function parseConfig(element: HTMLScriptElement): LightWorkshopConfig {
  const source = element.textContent;
  if (!source) {
    throw new Error("Light workshop: конфигурация отсутствует");
  }

  return JSON.parse(source) as LightWorkshopConfig;
}

document
  .querySelectorAll<HTMLElement>("[data-light-workshop]")
  .forEach(setupLightWorkshop);
