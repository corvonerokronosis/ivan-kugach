import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createMobileMenuController } from "../.tmp/unit-tests/scripts/mobile-menu-controller.js";

class FakeEventTarget {
  listeners = new Map();

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) ?? new Set();
    listeners.add(listener);
    this.listeners.set(type, listeners);
  }

  removeEventListener(type, listener) {
    this.listeners.get(type)?.delete(listener);
  }

  emit(type, overrides = {}) {
    const event = {
      target: this,
      key: undefined,
      defaultPrevented: false,
      preventDefault() {
        this.defaultPrevented = true;
      },
      ...overrides,
    };

    for (const listener of this.listeners.get(type) ?? []) {
      if (typeof listener === "function") {
        listener(event);
      } else {
        listener.handleEvent(event);
      }
    }

    return event;
  }
}

class FakeElement extends FakeEventTarget {
  dataset = {};
  attributes = new Map();
  hidden = false;
  inert = false;
  focusCount = 0;
  descendants = new Set();

  setAttribute(name, value) {
    this.attributes.set(name, value);
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  contains(target) {
    return target === this || this.descendants.has(target);
  }

  focus() {
    this.focusCount += 1;
  }
}

class FakeMediaQuery extends FakeEventTarget {
  constructor(matches) {
    super();
    this.matches = matches;
  }

  setMatches(matches) {
    this.matches = matches;
    this.emit("change");
  }
}

function createFixture({ desktop = false } = {}) {
  const root = new FakeElement();
  const toggle = new FakeElement();
  const panel = new FakeElement();
  const links = new FakeElement();
  const backdrop = new FakeElement();
  const background = new FakeElement();
  const scrollRoot = new FakeElement();
  const documentTarget = new FakeEventTarget();
  const mediaQuery = new FakeMediaQuery(desktop);

  backdrop.hidden = true;
  root.descendants = new Set([toggle, panel, links, backdrop]);

  return {
    elements: {
      root,
      toggle,
      panel,
      links,
      backdrop,
      backgroundElements: [background],
      scrollRoot,
      mediaQuery,
      documentTarget,
    },
    root,
    toggle,
    panel,
    links,
    backdrop,
    background,
    scrollRoot,
    documentTarget,
    mediaQuery,
  };
}

describe("mobile menu controller", () => {
  it("enhances mobile navigation and restores the no-JS presentation on destroy", () => {
    const fixture = createFixture();
    assert.equal(fixture.panel.hidden, false);

    const controller = createMobileMenuController(fixture.elements);

    assert.equal("menuReady" in fixture.root.dataset, true);
    assert.equal(fixture.panel.hidden, true);
    assert.equal(fixture.toggle.getAttribute("aria-expanded"), "false");

    fixture.toggle.emit("click");

    assert.equal(controller.isOpen(), true);
    assert.equal(fixture.panel.hidden, false);
    assert.equal(fixture.backdrop.hidden, false);
    assert.equal(fixture.toggle.getAttribute("aria-expanded"), "true");
    assert.equal("menuOpen" in fixture.root.dataset, true);
    assert.equal("mobileMenuOpen" in fixture.scrollRoot.dataset, true);
    assert.equal(fixture.background.inert, true);

    const link = { closest: (selector) => selector === "a[href]" };
    fixture.links.emit("click", { target: link });

    assert.equal(controller.isOpen(), false);
    assert.equal(fixture.panel.hidden, true);
    assert.equal(fixture.background.inert, false);

    fixture.toggle.emit("click");
    const escapeEvent = fixture.documentTarget.emit("keydown", {
      key: "Escape",
    });

    assert.equal(escapeEvent.defaultPrevented, true);
    assert.equal(controller.isOpen(), false);
    assert.equal(fixture.toggle.focusCount, 1);

    fixture.toggle.emit("click");
    fixture.backdrop.emit("click");
    assert.equal(controller.isOpen(), false);
    assert.equal(fixture.toggle.focusCount, 2);

    fixture.toggle.emit("click");
    fixture.documentTarget.emit("click", { target: {} });
    assert.equal(controller.isOpen(), false);
    assert.equal(fixture.toggle.focusCount, 3);

    controller.destroy();

    assert.equal("menuReady" in fixture.root.dataset, false);
    assert.equal(fixture.panel.hidden, false);
    assert.equal(fixture.backdrop.hidden, true);
    assert.equal(fixture.background.inert, false);
    assert.equal(fixture.toggle.getAttribute("aria-expanded"), "false");
  });

  it("keeps the panel visible on desktop and closes an open menu on resize", () => {
    const fixture = createFixture({ desktop: true });
    const controller = createMobileMenuController(fixture.elements);

    assert.equal(fixture.panel.hidden, false);
    fixture.toggle.emit("click");
    assert.equal(controller.isOpen(), false);

    fixture.mediaQuery.setMatches(false);
    assert.equal(fixture.panel.hidden, true);

    fixture.toggle.emit("click");
    assert.equal(controller.isOpen(), true);

    fixture.mediaQuery.setMatches(true);
    assert.equal(controller.isOpen(), false);
    assert.equal(fixture.panel.hidden, false);
    assert.equal(fixture.backdrop.hidden, true);
    assert.equal(fixture.background.inert, false);
    assert.equal("mobileMenuOpen" in fixture.scrollRoot.dataset, false);
  });
});
