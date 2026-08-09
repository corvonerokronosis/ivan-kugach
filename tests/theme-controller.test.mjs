import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  THEME_STORAGE_KEY,
  createThemeController,
  persistThemePreference,
  readStoredTheme,
  resolveTheme,
} from "../.tmp/unit-tests/scripts/theme-controller.js";

describe("theme controller", () => {
  it("resolves system preference without turning it into an override", () => {
    assert.equal(resolveTheme("system", false), "light");
    assert.equal(resolveTheme("system", true), "dark");
    assert.equal(resolveTheme("light", true), "light");
    assert.equal(resolveTheme("dark", false), "dark");
  });

  it("reads only explicit stored themes and survives storage failures", () => {
    const storage = createStorage();
    storage.values.set(THEME_STORAGE_KEY, "dark");
    assert.equal(readStoredTheme(storage), "dark");

    storage.values.set(THEME_STORAGE_KEY, "sepia");
    assert.equal(readStoredTheme(storage), null);
    assert.equal(readStoredTheme(createThrowingStorage()), null);
  });

  it("persists explicit choice and removes override for system mode", () => {
    const storage = createStorage();

    assert.equal(persistThemePreference(storage, "light"), true);
    assert.equal(storage.values.get(THEME_STORAGE_KEY), "light");

    assert.equal(persistThemePreference(storage, "system"), true);
    assert.equal(storage.values.has(THEME_STORAGE_KEY), false);
    assert.equal(
      persistThemePreference(createThrowingStorage(), "dark"),
      false,
    );
  });

  it("follows system changes only while there is no explicit override", () => {
    const root = { dataset: {} };
    const control = createControl();
    const storage = createStorage();
    const mediaQuery = createMediaQuery(false);
    const controller = createThemeController({
      root,
      control,
      storage,
      mediaQuery,
    });

    assert.equal(root.dataset.theme, "light");
    assert.equal(control.value, "system");
    assert.equal(control.disabled, false);

    mediaQuery.emit(true);
    assert.equal(root.dataset.theme, "dark");

    control.change("light");
    mediaQuery.emit(true);
    assert.equal(root.dataset.theme, "light");
    assert.equal(storage.values.get(THEME_STORAGE_KEY), "light");

    control.change("system");
    assert.equal(root.dataset.theme, "dark");
    assert.equal(storage.values.has(THEME_STORAGE_KEY), false);

    controller.destroy();
    mediaQuery.emit(false);
    assert.equal(root.dataset.theme, "dark");
  });

  it("keeps the current session usable when storage is unavailable", () => {
    const root = { dataset: {} };
    const control = createControl();
    const mediaQuery = createMediaQuery(true);
    const controller = createThemeController({
      root,
      control,
      storage: createThrowingStorage(),
      mediaQuery,
    });

    assert.equal(controller.getPreference(), "system");
    assert.equal(controller.getTheme(), "dark");

    control.change("light");
    assert.equal(controller.getPreference(), "light");
    assert.equal(controller.getTheme(), "light");
    assert.equal(root.dataset.theme, "light");
  });
});

function createStorage() {
  const values = new Map();

  return {
    values,
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

function createThrowingStorage() {
  return {
    getItem: () => {
      throw new Error("storage denied");
    },
    setItem: () => {
      throw new Error("storage denied");
    },
    removeItem: () => {
      throw new Error("storage denied");
    },
  };
}

function createControl() {
  let listener;

  return {
    value: "system",
    disabled: true,
    addEventListener: (_type, nextListener) => {
      listener = nextListener;
    },
    removeEventListener: (_type, nextListener) => {
      if (listener === nextListener) {
        listener = undefined;
      }
    },
    change(nextValue) {
      this.value = nextValue;
      listener?.();
    },
  };
}

function createMediaQuery(initialMatches) {
  let listener;

  return {
    matches: initialMatches,
    addEventListener: (_type, nextListener) => {
      listener = nextListener;
    },
    removeEventListener: (_type, nextListener) => {
      if (listener === nextListener) {
        listener = undefined;
      }
    },
    emit(nextMatches) {
      this.matches = nextMatches;
      listener?.({ matches: nextMatches });
    },
  };
}
