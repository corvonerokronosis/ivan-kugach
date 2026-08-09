export const MOBILE_MENU_DESKTOP_QUERY = "(min-width: 70rem)";

export interface MobileMenuElements {
  root: HTMLElement;
  toggle: HTMLButtonElement;
  panel: HTMLElement;
  links: HTMLElement;
  backdrop: HTMLButtonElement;
  backgroundElements: HTMLElement[];
  scrollRoot: HTMLElement;
  mediaQuery: MediaQueryList;
  documentTarget: Document;
}

export interface MobileMenuController {
  isOpen: () => boolean;
  close: (restoreFocus?: boolean) => void;
  destroy: () => void;
}

function isNavigationLink(target: EventTarget | null): boolean {
  const candidate = target as {
    closest?: (selector: string) => unknown;
  } | null;

  return Boolean(candidate?.closest?.("a[href]"));
}

export function createMobileMenuController(
  elements: MobileMenuElements,
): MobileMenuController {
  let open = false;

  const syncPresentation = () => {
    const expanded = open && !elements.mediaQuery.matches;

    elements.toggle.setAttribute("aria-expanded", String(expanded));
    elements.panel.hidden = !elements.mediaQuery.matches && !expanded;
    elements.backdrop.hidden = !expanded;

    if (expanded) {
      elements.root.dataset.menuOpen = "";
      elements.scrollRoot.dataset.mobileMenuOpen = "";
    } else {
      delete elements.root.dataset.menuOpen;
      delete elements.scrollRoot.dataset.mobileMenuOpen;
    }

    for (const backgroundElement of elements.backgroundElements) {
      backgroundElement.inert = expanded;
    }
  };

  const setOpen = (nextOpen: boolean, restoreFocus = false) => {
    const wasOpen = open;
    open = !elements.mediaQuery.matches && nextOpen;
    syncPresentation();

    if (restoreFocus && wasOpen && !open) {
      elements.toggle.focus();
    }
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleLinkClick = (event: Event) => {
    if (open && isNavigationLink(event.target)) {
      setOpen(false);
    }
  };

  const handleBackdropClick = () => {
    if (open) {
      setOpen(false, true);
    }
  };

  const handleDocumentClick = (event: Event) => {
    if (open && event.target && !elements.root.contains(event.target as Node)) {
      setOpen(false, true);
    }
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (open && event.key === "Escape") {
      event.preventDefault();
      setOpen(false, true);
    }
  };

  const handleMediaChange = () => {
    setOpen(false);
  };

  elements.root.dataset.menuReady = "";
  syncPresentation();

  elements.toggle.addEventListener("click", handleToggle);
  elements.links.addEventListener("click", handleLinkClick);
  elements.backdrop.addEventListener("click", handleBackdropClick);
  elements.documentTarget.addEventListener("click", handleDocumentClick);
  elements.documentTarget.addEventListener("keydown", handleKeydown);
  elements.mediaQuery.addEventListener("change", handleMediaChange);

  return {
    isOpen: () => open,
    close: (restoreFocus = false) => setOpen(false, restoreFocus),
    destroy: () => {
      elements.toggle.removeEventListener("click", handleToggle);
      elements.links.removeEventListener("click", handleLinkClick);
      elements.backdrop.removeEventListener("click", handleBackdropClick);
      elements.documentTarget.removeEventListener("click", handleDocumentClick);
      elements.documentTarget.removeEventListener("keydown", handleKeydown);
      elements.mediaQuery.removeEventListener("change", handleMediaChange);

      open = false;
      delete elements.root.dataset.menuReady;
      delete elements.root.dataset.menuOpen;
      delete elements.scrollRoot.dataset.mobileMenuOpen;
      elements.toggle.setAttribute("aria-expanded", "false");
      elements.panel.hidden = false;
      elements.backdrop.hidden = true;

      for (const backgroundElement of elements.backgroundElements) {
        backgroundElement.inert = false;
      }
    },
  };
}

export function initMobileMenuController(
  documentTarget: Document = document,
): MobileMenuController | null {
  const root = documentTarget.querySelector<HTMLElement>("[data-menu-root]");
  const toggle = root?.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  const panel = root?.querySelector<HTMLElement>("[data-menu-panel]");
  const links = root?.querySelector<HTMLElement>("[data-menu-links]");
  const backdrop = root?.querySelector<HTMLButtonElement>(
    "[data-menu-backdrop]",
  );

  if (!root || !toggle || !panel || !links || !backdrop) {
    return null;
  }

  return createMobileMenuController({
    root,
    toggle,
    panel,
    links,
    backdrop,
    backgroundElements: Array.from(
      documentTarget.querySelectorAll<HTMLElement>("[data-menu-background]"),
    ),
    scrollRoot: documentTarget.documentElement,
    mediaQuery: window.matchMedia(MOBILE_MENU_DESKTOP_QUERY),
    documentTarget,
  });
}
