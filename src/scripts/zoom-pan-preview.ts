import { mountZoomPanEngine } from "./zoom-pan-engine";
import type { ZoomPanEngine } from "../types/zoom-pan";

const initializedPreviews = new WeakSet<HTMLElement>();

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
    !statusOutput
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
  let engine: ZoomPanEngine | null = null;

  function setControlsEnabled(isEnabled: boolean): void {
    zoomInControl.disabled = !isEnabled;
    zoomOutControl.disabled = !isEnabled;
    resetControl.disabled = !isEnabled;
    destroyControl.disabled = !isEnabled;
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
        statusElement.textContent = isDragging ? "dragging" : "active";
      },
    });
    setControlsEnabled(true);
  }

  remountControl.addEventListener("click", mount);
  destroyControl.addEventListener("click", () => {
    engine?.destroy();
    engine = null;
    statusElement.textContent = "destroyed";
    setControlsEnabled(false);
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
