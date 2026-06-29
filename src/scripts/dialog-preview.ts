import { createAccessibleDialogController } from "./dialog-controller";

const previewRoot = document.querySelector<HTMLElement>(
  "[data-dialog-preview]",
);
const openButton = previewRoot?.querySelector<HTMLButtonElement>(
  "[data-preview-dialog-open]",
);
const dialog = previewRoot?.querySelector<HTMLDialogElement>("#preview-dialog");
const closeButton = dialog?.querySelector<HTMLButtonElement>(
  "[data-preview-dialog-close]",
);

if (previewRoot && openButton && dialog && closeButton) {
  const controller = createAccessibleDialogController(dialog);

  openButton.addEventListener("click", () => {
    controller.open({ initialFocus: closeButton, trigger: openButton });
  });
  closeButton.addEventListener("click", () => controller.close());
  window.addEventListener("pagehide", () => controller.destroy(), {
    once: true,
  });
}
