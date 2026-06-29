interface OpenDialogOptions {
  initialFocus?: HTMLElement | null;
  trigger?: HTMLElement | null;
}

interface CloseDialogOptions {
  restoreFocus?: boolean;
}

interface DialogControllerOptions {
  closeOnBackdrop?: boolean;
}

export interface AccessibleDialogController {
  close: (options?: CloseDialogOptions) => void;
  destroy: () => void;
  open: (options?: OpenDialogOptions) => void;
}

const focusableSelector = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "details > summary:first-of-type",
  "iframe",
  "object",
  "embed",
  "[contenteditable='true']",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function createAccessibleDialogController(
  dialog: HTMLDialogElement,
  options: DialogControllerOptions = {},
): AccessibleDialogController {
  const { closeOnBackdrop = true } = options;
  let restoreFocusTarget: HTMLElement | null = null;
  let shouldRestoreFocus = true;

  function getFocusableElements(): HTMLElement[] {
    return Array.from(
      dialog.querySelectorAll<HTMLElement>(focusableSelector),
    ).filter((element) => !element.hidden && isVisible(element));
  }

  function getInitialFocusTarget(preferred?: HTMLElement | null): HTMLElement {
    if (preferred && dialog.contains(preferred) && isFocusable(preferred)) {
      return preferred;
    }

    return getFocusableElements()[0] ?? dialog;
  }

  function focusInitialTarget(target?: HTMLElement | null): void {
    const focusTarget = getInitialFocusTarget(target);
    focusTarget.focus({ preventScroll: true });
  }

  function open(openOptions: OpenDialogOptions = {}): void {
    const activeElement = dialog.ownerDocument.activeElement;
    restoreFocusTarget =
      openOptions.trigger ??
      (activeElement instanceof HTMLElement ? activeElement : null);
    shouldRestoreFocus = true;

    if (!dialog.open) {
      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        dialog.open = true;
      }
    }

    focusInitialTarget(openOptions.initialFocus);
  }

  function close(closeOptions: CloseDialogOptions = {}): void {
    shouldRestoreFocus = closeOptions.restoreFocus !== false;

    if (!dialog.open) {
      return;
    }

    if (typeof dialog.close === "function") {
      dialog.close();
      return;
    }

    dialog.open = false;
    restoreFocus();
  }

  function restoreFocus(): void {
    if (!shouldRestoreFocus || !restoreFocusTarget?.isConnected) {
      restoreFocusTarget = null;
      return;
    }

    restoreFocusTarget.focus({ preventScroll: true });
    restoreFocusTarget = null;
  }

  function handleClick(event: MouseEvent): void {
    if (closeOnBackdrop && event.target === dialog) {
      close();
    }
  }

  function handleClose(): void {
    restoreFocus();
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (!dialog.open) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = getFocusableElements();

    if (focusableElements.length === 0) {
      event.preventDefault();
      dialog.focus({ preventScroll: true });
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = dialog.ownerDocument.activeElement;

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus({ preventScroll: true });
      return;
    }

    if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus({ preventScroll: true });
    }
  }

  function destroy(): void {
    dialog.removeEventListener("click", handleClick);
    dialog.removeEventListener("close", handleClose);
    dialog.removeEventListener("keydown", handleKeydown);
  }

  dialog.addEventListener("click", handleClick);
  dialog.addEventListener("close", handleClose);
  dialog.addEventListener("keydown", handleKeydown);

  return {
    close,
    destroy,
    open,
  };
}

function isFocusable(element: HTMLElement): boolean {
  return !element.matches(":disabled") && isVisible(element);
}

function isVisible(element: HTMLElement): boolean {
  return !!(
    element.offsetWidth ||
    element.offsetHeight ||
    element.getClientRects().length
  );
}
