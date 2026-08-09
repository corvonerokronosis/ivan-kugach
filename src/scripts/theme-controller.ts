export const THEME_STORAGE_KEY = "ivan-kugach-theme";
export const THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";

export type Theme = "light" | "dark";
export type ThemePreference = Theme | "system";

interface ThemeRoot {
  dataset: {
    theme?: string;
  };
}

interface ThemeControl {
  value: string;
  disabled: boolean;
  addEventListener(type: "change", listener: () => void): void;
  removeEventListener(type: "change", listener: () => void): void;
}

interface ThemeStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

interface ThemeMediaChangeEvent {
  matches: boolean;
}

interface ThemeMediaQuery {
  readonly matches: boolean;
  addEventListener(
    type: "change",
    listener: (event: ThemeMediaChangeEvent) => void,
  ): void;
  removeEventListener(
    type: "change",
    listener: (event: ThemeMediaChangeEvent) => void,
  ): void;
}

interface ThemeControllerOptions {
  root: ThemeRoot;
  control?: ThemeControl | null;
  storage?: ThemeStorage | null;
  mediaQuery: ThemeMediaQuery;
}

export interface ThemeController {
  getPreference(): ThemePreference;
  getTheme(): Theme;
  destroy(): void;
}

export const themeBootstrapScript = `
(() => {
  const storageKey = ${JSON.stringify(THEME_STORAGE_KEY)};
  const mediaQuery = ${JSON.stringify(THEME_MEDIA_QUERY)};
  let theme;

  try {
    const storedTheme = localStorage.getItem(storageKey);
    if (storedTheme === "light" || storedTheme === "dark") {
      theme = storedTheme;
    }
  } catch {}

  if (!theme) {
    try {
      theme = matchMedia(mediaQuery).matches ? "dark" : "light";
    } catch {
      theme = "light";
    }
  }

  document.documentElement.dataset.theme = theme;
})();
`;

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === "system" || value === "light" || value === "dark";
}

export function resolveTheme(
  preference: ThemePreference,
  systemPrefersDark: boolean,
): Theme {
  if (preference === "system") {
    return systemPrefersDark ? "dark" : "light";
  }

  return preference;
}

export function readStoredTheme(
  storage: ThemeStorage | null | undefined,
): Theme | null {
  if (!storage) {
    return null;
  }

  try {
    const storedTheme = storage.getItem(THEME_STORAGE_KEY);
    return storedTheme === "light" || storedTheme === "dark"
      ? storedTheme
      : null;
  } catch {
    return null;
  }
}

export function persistThemePreference(
  storage: ThemeStorage | null | undefined,
  preference: ThemePreference,
): boolean {
  if (!storage) {
    return false;
  }

  try {
    if (preference === "system") {
      storage.removeItem(THEME_STORAGE_KEY);
    } else {
      storage.setItem(THEME_STORAGE_KEY, preference);
    }

    return true;
  } catch {
    return false;
  }
}

export function createThemeController(
  options: ThemeControllerOptions,
): ThemeController {
  const { root, control = null, storage = null, mediaQuery } = options;
  let preference: ThemePreference = readStoredTheme(storage) ?? "system";
  let theme = resolveTheme(preference, mediaQuery.matches);
  let destroyed = false;

  const render = () => {
    theme = resolveTheme(preference, mediaQuery.matches);
    root.dataset.theme = theme;

    if (control) {
      control.value = preference;
      control.disabled = false;
    }
  };

  const handleControlChange = () => {
    if (destroyed || !control || !isThemePreference(control.value)) {
      return;
    }

    preference = control.value;
    persistThemePreference(storage, preference);
    render();
  };

  const handleSystemChange = (event: ThemeMediaChangeEvent) => {
    if (destroyed || preference !== "system") {
      return;
    }

    theme = event.matches ? "dark" : "light";
    root.dataset.theme = theme;
  };

  render();
  control?.addEventListener("change", handleControlChange);
  mediaQuery.addEventListener("change", handleSystemChange);

  return {
    getPreference: () => preference,
    getTheme: () => theme,
    destroy: () => {
      if (destroyed) {
        return;
      }

      destroyed = true;
      control?.removeEventListener("change", handleControlChange);
      mediaQuery.removeEventListener("change", handleSystemChange);
    },
  };
}

export function initThemeController(): ThemeController {
  const mediaQuery = getMediaQuery(window);
  const storage = getStorage(window);
  const control = document.querySelector<HTMLSelectElement>(
    "[data-theme-control]",
  );

  return createThemeController({
    root: document.documentElement,
    control,
    storage,
    mediaQuery,
  });
}

function getStorage(windowReference: Window): Storage | null {
  try {
    return windowReference.localStorage;
  } catch {
    return null;
  }
}

function getMediaQuery(windowReference: Window): ThemeMediaQuery {
  try {
    return windowReference.matchMedia(THEME_MEDIA_QUERY);
  } catch {
    return {
      matches: false,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    };
  }
}
