import { mountZoomPanEngine } from "./zoom-pan-engine";
import type { ZoomPanEngine } from "../types/zoom-pan";

const initializedExplorers = new WeakSet<HTMLElement>();

interface DetailsHotspot {
  id: string;
  x: number;
  y: number;
  targetScale: number;
  label: string;
  title: string;
  text: string;
  button: HTMLButtonElement;
}

function setupDetailsExplorer(root: HTMLElement): void {
  if (initializedExplorers.has(root)) {
    return;
  }

  const viewport = root.querySelector<HTMLElement>("[data-details-viewport]");
  const content = root.querySelector<HTMLElement>("[data-details-content]");
  const image = root.querySelector<HTMLImageElement>("[data-details-image]");
  const zoomInButton = root.querySelector<HTMLButtonElement>(
    "[data-details-zoom-in]",
  );
  const zoomOutButton = root.querySelector<HTMLButtonElement>(
    "[data-details-zoom-out]",
  );
  const resetButton = root.querySelector<HTMLButtonElement>(
    "[data-details-reset]",
  );
  const scaleOutput = root.querySelector<HTMLOutputElement>(
    "[data-details-scale]",
  );
  const progressOutput = root.querySelector<HTMLElement>(
    "[data-details-progress]",
  );
  const continueLink = root.querySelector<HTMLAnchorElement>(
    "[data-details-continue]",
  );
  const hotspotButtons = Array.from(
    root.querySelectorAll<HTMLButtonElement>("[data-details-hotspot]"),
  );
  const hotspotDialog = root.querySelector<HTMLDialogElement>(
    "#details-hotspot-dialog",
  );
  const hotspotDialogTitle = root.querySelector<HTMLElement>(
    "#details-hotspot-dialog-title",
  );
  const hotspotDialogLabel = root.querySelector<HTMLElement>(
    "[data-details-dialog-label]",
  );
  const hotspotDialogText = root.querySelector<HTMLElement>(
    "[data-details-dialog-text]",
  );
  const hotspotDialogClose = root.querySelector<HTMLButtonElement>(
    "[data-details-dialog-close]",
  );
  const completionDialog = root.querySelector<HTMLDialogElement>(
    "#details-complete-dialog",
  );
  const completionDialogClose = root.querySelector<HTMLButtonElement>(
    "[data-details-complete-close]",
  );
  const completionPrimaryAction =
    completionDialog?.querySelector<HTMLAnchorElement>("a[href]");

  if (
    !viewport ||
    !content ||
    !image ||
    !zoomInButton ||
    !zoomOutButton ||
    !resetButton ||
    !scaleOutput ||
    !progressOutput ||
    !continueLink ||
    !hotspotDialog ||
    !hotspotDialogTitle ||
    !hotspotDialogLabel ||
    !hotspotDialogText ||
    !hotspotDialogClose ||
    !completionDialog ||
    !completionDialogClose
  ) {
    return;
  }

  const detailsViewport = viewport;
  const detailsContent = content;
  const detailsImage = image;
  const scaleElement = scaleOutput;
  const progressElement = progressOutput;
  const nextStageLink = continueLink;
  const storyDialog = hotspotDialog;
  const storyTitle = hotspotDialogTitle;
  const storyLabel = hotspotDialogLabel;
  const storyText = hotspotDialogText;
  const storyClose = hotspotDialogClose;
  const completeDialog = completionDialog;
  const completeClose = completionDialogClose;
  const hotspots = hotspotButtons.map(readHotspotFromButton);
  const viewedIds = new Set<string>();
  const timers = new Set<number>();
  const view = root.ownerDocument.defaultView;
  let engine: ZoomPanEngine | null = null;
  let activeHotspot: DetailsHotspot | null = null;
  let completionShown = false;

  function schedule(callback: () => void, delay: number): void {
    if (!view) {
      callback();
      return;
    }

    const timer = view.setTimeout(() => {
      timers.delete(timer);
      callback();
    }, delay);
    timers.add(timer);
  }

  function updateHotspotState(): void {
    hotspots.forEach((hotspot) => {
      const isActive = hotspot.id === activeHotspot?.id;
      hotspot.button.setAttribute("aria-pressed", String(isActive));
      hotspot.button.dataset.viewed = String(viewedIds.has(hotspot.id));
    });
  }

  function updateProgress(): void {
    const isComplete =
      hotspots.length > 0 && viewedIds.size === hotspots.length;

    if (isComplete) {
      progressElement.textContent =
        "Все точки открыты. Можно остаться в режиме свободного просмотра или перейти к мастерской света.";
      nextStageLink.hidden = false;
      return;
    }

    progressElement.textContent = `Открыто точек: ${viewedIds.size} из ${hotspots.length}. Перетаскивайте картину мышью или пальцем и исследуйте оставшиеся детали.`;
    nextStageLink.hidden = true;
  }

  function closeStoryDialog(): void {
    if (storyDialog.open) {
      storyDialog.close();
    }
  }

  function openStoryDialog(hotspot: DetailsHotspot): void {
    storyLabel.textContent = hotspot.label;
    storyTitle.textContent = hotspot.title;
    storyText.textContent = hotspot.text;
    openDialog(storyDialog);
    storyClose.focus({ preventScroll: true });
  }

  function openCompletionDialog(): void {
    closeStoryDialog();
    openDialog(completeDialog);
    completionPrimaryAction?.focus({ preventScroll: true });
  }

  function activateHotspot(hotspot: DetailsHotspot): void {
    activeHotspot = hotspot;
    viewedIds.add(hotspot.id);
    updateHotspotState();
    updateProgress();
    engine?.centerOn({ x: hotspot.x, y: hotspot.y }, hotspot.targetScale, true);

    schedule(() => {
      if (activeHotspot?.id === hotspot.id) {
        openStoryDialog(hotspot);
      }
    }, 460);

    if (viewedIds.size === hotspots.length && !completionShown) {
      completionShown = true;
      schedule(openCompletionDialog, 620);
    }
  }

  function resetView(): void {
    activeHotspot = null;
    closeStoryDialog();
    engine?.reset();
    updateHotspotState();
    detailsViewport.focus({ preventScroll: true });
  }

  function handleViewportKeyboard(event: KeyboardEvent): void {
    if (event.target !== detailsViewport || !engine) {
      return;
    }

    const state = engine.getState();
    const panStep = 48;

    switch (event.key) {
      case "ArrowLeft":
        engine.panBy({ x: panStep, y: 0 });
        break;
      case "ArrowRight":
        engine.panBy({ x: -panStep, y: 0 });
        break;
      case "ArrowUp":
        engine.panBy({ x: 0, y: panStep });
        break;
      case "ArrowDown":
        engine.panBy({ x: 0, y: -panStep });
        break;
      case "+":
      case "=":
        engine.setScale(state.scale + 0.14, undefined, true);
        break;
      case "-":
      case "_":
        engine.setScale(state.scale - 0.14, undefined, true);
        break;
      case "0":
        resetView();
        break;
      default:
        return;
    }

    event.preventDefault();
  }

  engine = mountZoomPanEngine({
    viewport: detailsViewport,
    content: detailsContent,
    imageElement: detailsImage,
    zoomInButton,
    zoomOutButton,
    resetButton,
    onStateChange: ({ scale, maxScale }) => {
      const percent = maxScale > 0 ? Math.round((scale / maxScale) * 100) : 0;
      scaleElement.textContent = `${percent}%`;
    },
  });

  hotspots.forEach((hotspot) => {
    hotspot.button.addEventListener("click", () => activateHotspot(hotspot));
  });
  resetButton.addEventListener("click", resetView);
  detailsViewport.addEventListener("keydown", handleViewportKeyboard);
  storyClose.addEventListener("click", closeStoryDialog);
  storyDialog.addEventListener("click", (event) => {
    if (event.target === storyDialog) {
      closeStoryDialog();
    }
  });
  completeClose.addEventListener("click", () => completeDialog.close());
  completeDialog.addEventListener("click", (event) => {
    if (event.target === completeDialog) {
      completeDialog.close();
    }
  });
  view?.addEventListener(
    "pagehide",
    () => {
      timers.forEach((timer) => view.clearTimeout(timer));
      timers.clear();
      engine?.destroy();
    },
    { once: true },
  );

  initializedExplorers.add(root);
  updateHotspotState();
  updateProgress();
}

function openDialog(dialog: HTMLDialogElement): void {
  if (dialog.open) {
    return;
  }

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.open = true;
  }
}

function readHotspotFromButton(button: HTMLButtonElement): DetailsHotspot {
  return {
    id: requiredString(button.dataset.hotspotId, "hotspot id"),
    x: requiredNumber(button.dataset.hotspotX, "hotspot x"),
    y: requiredNumber(button.dataset.hotspotY, "hotspot y"),
    targetScale: requiredNumber(button.dataset.hotspotScale, "hotspot scale"),
    label: requiredString(button.dataset.hotspotLabel, "hotspot label"),
    title: requiredString(button.dataset.hotspotTitle, "hotspot title"),
    text: requiredString(button.dataset.hotspotText, "hotspot text"),
    button,
  };
}

function requiredString(value: string | undefined, label: string): string {
  if (!value) {
    throw new Error(`Details explorer: отсутствует ${label}`);
  }

  return value;
}

function requiredNumber(value: string | undefined, label: string): number {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Details explorer: некорректное значение ${label}`);
  }

  return parsed;
}

document
  .querySelectorAll<HTMLElement>("[data-details-explorer]")
  .forEach(setupDetailsExplorer);
