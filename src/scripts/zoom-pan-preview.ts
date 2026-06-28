import { mountZoomPanEngine } from "./zoom-pan-engine";
import type { ZoomPanEngine } from "../types/zoom-pan";

const initializedPreviews = new WeakSet<HTMLElement>();

interface PreviewHotspot {
  id: string;
  x: number;
  y: number;
  targetScale: number;
  label: string;
  title: string;
  text: string;
  button: HTMLButtonElement;
}

function setupZoomPanPreview(root: HTMLElement): void {
  if (initializedPreviews.has(root)) {
    return;
  }

  const viewport = root.querySelector<HTMLElement>("[data-zoom-pan-viewport]");
  const content = root.querySelector<HTMLElement>("[data-zoom-pan-content]");
  const image = root.querySelector<HTMLImageElement>("[data-zoom-pan-image]");
  const zoomInButton =
    root.querySelector<HTMLButtonElement>("[data-zoom-pan-in]");
  const zoomOutButton = root.querySelector<HTMLButtonElement>(
    "[data-zoom-pan-out]",
  );
  const resetButton = root.querySelector<HTMLButtonElement>(
    "[data-zoom-pan-reset]",
  );
  const remountButton = root.querySelector<HTMLButtonElement>(
    "[data-zoom-pan-remount]",
  );
  const destroyButton = root.querySelector<HTMLButtonElement>(
    "[data-zoom-pan-destroy]",
  );
  const scaleOutput = root.querySelector<HTMLElement>("[data-zoom-pan-scale]");
  const positionOutput = root.querySelector<HTMLElement>(
    "[data-zoom-pan-position]",
  );
  const statusOutput = root.querySelector<HTMLElement>(
    "[data-zoom-pan-status]",
  );
  const progressOutput = root.querySelector<HTMLElement>(
    "[data-zoom-pan-progress]",
  );
  const hotspotButtons = Array.from(
    root.querySelectorAll<HTMLButtonElement>("[data-zoom-pan-hotspot]"),
  );
  const hotspotDialog = root.querySelector<HTMLDialogElement>(
    "#zoom-preview-hotspot-dialog",
  );
  const hotspotDialogLabel = root.querySelector<HTMLElement>(
    "[data-hotspot-dialog-label]",
  );
  const hotspotDialogTitle = root.querySelector<HTMLElement>(
    "[data-hotspot-dialog-title]",
  );
  const hotspotDialogText = root.querySelector<HTMLElement>(
    "[data-hotspot-dialog-text]",
  );
  const hotspotDialogClose = root.querySelector<HTMLButtonElement>(
    "[data-hotspot-dialog-close]",
  );

  if (
    !viewport ||
    !content ||
    !image ||
    !zoomInButton ||
    !zoomOutButton ||
    !resetButton ||
    !remountButton ||
    !destroyButton ||
    !scaleOutput ||
    !positionOutput ||
    !statusOutput ||
    !progressOutput ||
    !hotspotDialog ||
    !hotspotDialogLabel ||
    !hotspotDialogTitle ||
    !hotspotDialogText ||
    !hotspotDialogClose
  ) {
    return;
  }

  const previewViewport = viewport;
  const previewContent = content;
  const previewImage = image;
  const zoomInControl = zoomInButton;
  const zoomOutControl = zoomOutButton;
  const resetControl = resetButton;
  const remountControl = remountButton;
  const destroyControl = destroyButton;
  const scaleElement = scaleOutput;
  const positionElement = positionOutput;
  const statusElement = statusOutput;
  const progressElement = progressOutput;
  const dialog = hotspotDialog;
  const dialogLabel = hotspotDialogLabel;
  const dialogTitle = hotspotDialogTitle;
  const dialogText = hotspotDialogText;
  const dialogClose = hotspotDialogClose;
  const hotspots = hotspotButtons.map(readHotspotFromButton);
  const viewedIds = new Set<string>();
  let engine: ZoomPanEngine | null = null;

  function setControlsEnabled(isEnabled: boolean): void {
    zoomInControl.disabled = !isEnabled;
    zoomOutControl.disabled = !isEnabled;
    resetControl.disabled = !isEnabled;
    destroyControl.disabled = !isEnabled;
    hotspots.forEach((hotspot) => {
      hotspot.button.disabled = !isEnabled;
    });
  }

  function updateHotspotState(activeId: string | null = null): void {
    progressElement.textContent = `${viewedIds.size} из ${hotspots.length}`;
    hotspots.forEach((hotspot) => {
      const isActive = hotspot.id === activeId;
      hotspot.button.setAttribute("aria-pressed", String(isActive));
      hotspot.button.dataset.viewed = String(viewedIds.has(hotspot.id));
    });

    statusElement.textContent = getStatusText(false);
  }

  function getStatusText(isDragging: boolean): string {
    if (hotspots.length > 0 && viewedIds.size === hotspots.length) {
      return "all hotspots viewed";
    }

    return isDragging ? "dragging" : "active";
  }

  function openHotspotDialog(hotspot: PreviewHotspot): void {
    dialogLabel.textContent = hotspot.label;
    dialogTitle.textContent = hotspot.title;
    dialogText.textContent = hotspot.text;

    if (typeof dialog.showModal === "function" && !dialog.open) {
      dialog.showModal();
    } else {
      dialog.open = true;
    }

    dialogClose.focus({ preventScroll: true });
  }

  function activateHotspot(hotspot: PreviewHotspot): void {
    viewedIds.add(hotspot.id);
    engine?.centerOn({ x: hotspot.x, y: hotspot.y }, hotspot.targetScale, true);
    updateHotspotState(hotspot.id);
    openHotspotDialog(hotspot);
  }

  function mount(): void {
    engine = mountZoomPanEngine({
      viewport: previewViewport,
      content: previewContent,
      imageElement: previewImage,
      zoomInButton: zoomInControl,
      zoomOutButton: zoomOutControl,
      resetButton: resetControl,
      onStateChange: ({ scale, maxScale, x, y, isDragging }) => {
        const percent = maxScale > 0 ? Math.round((scale / maxScale) * 100) : 0;
        scaleElement.textContent = `${percent}%`;
        positionElement.textContent = `${Math.round(x)}, ${Math.round(y)}`;
        statusElement.textContent = getStatusText(isDragging);
      },
    });
    setControlsEnabled(true);
    updateHotspotState();
  }

  hotspots.forEach((hotspot) => {
    hotspot.button.addEventListener("click", () => activateHotspot(hotspot));
  });
  remountControl.addEventListener("click", mount);
  destroyControl.addEventListener("click", () => {
    engine?.destroy();
    engine = null;
    statusElement.textContent = "destroyed";
    dialog.close();
    setControlsEnabled(false);
  });
  dialogClose.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
  root.ownerDocument.defaultView?.addEventListener(
    "pagehide",
    () => engine?.destroy(),
    { once: true },
  );

  initializedPreviews.add(root);
  mount();
}

document
  .querySelectorAll<HTMLElement>("[data-zoom-pan-preview]")
  .forEach(setupZoomPanPreview);

function readHotspotFromButton(button: HTMLButtonElement): PreviewHotspot {
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
    throw new Error(`Zoom/pan preview: missing ${label}`);
  }

  return value;
}

function requiredNumber(value: string | undefined, label: string): number {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`Zoom/pan preview: invalid ${label}`);
  }

  return parsed;
}
