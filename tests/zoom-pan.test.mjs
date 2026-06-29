import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  calculateCenteredZoomPanState,
  calculateFitZoomPanState,
  calculateZoomAtFocus,
  clampZoomPanPosition,
} from "../.tmp/unit-tests/utils/zoom-pan.js";

const viewport = { width: 800, height: 600 };
const content = { width: 1600, height: 900 };
const scaleRatios = { minScaleRatio: 0.72, maxScaleRatio: 1.9 };

describe("zoom/pan math", () => {
  it("calculates fit scale and centers content in the viewport", () => {
    const state = calculateFitZoomPanState({
      viewport,
      content,
      ...scaleRatios,
    });

    assert.deepEqual(state, {
      scale: 0.36,
      minScale: 0.36,
      maxScale: 0.95,
      x: 112,
      y: 138,
      isDragging: false,
    });
  });

  it("clamps requested scale to the configured minimum and maximum", () => {
    const state = calculateFitZoomPanState({
      viewport,
      content,
      ...scaleRatios,
    });

    assert.equal(
      calculateZoomAtFocus(state, viewport, content, 0.1).scale,
      state.minScale,
    );
    assert.equal(
      calculateZoomAtFocus(state, viewport, content, 2).scale,
      state.maxScale,
    );
  });

  it("clamps pan position to all viewport bounds", () => {
    const bounds = { minX: -400, maxX: 0, minY: -300, maxY: 0 };

    assert.deepEqual(clampZoomPanPosition(bounds, { x: 120, y: 90 }), {
      x: 0,
      y: 0,
    });
    assert.deepEqual(clampZoomPanPosition(bounds, { x: -520, y: -410 }), {
      x: -400,
      y: -300,
    });
  });

  it("centers a normalized hotspot and clamps it when an edge is reached", () => {
    const state = calculateFitZoomPanState({
      viewport,
      content,
      ...scaleRatios,
    });
    const centered = calculateCenteredZoomPanState(
      state,
      viewport,
      content,
      { x: 0.25, y: 0.5 },
      0.8,
    );

    assert.equal(centered.scale, 0.76);
    assert.equal(centered.x, 0);
    assert.equal(centered.y, -42);
  });

  it("recalculates fit state when the viewport is resized", () => {
    const desktop = calculateFitZoomPanState({
      viewport,
      content,
      ...scaleRatios,
    });
    const mobile = calculateFitZoomPanState({
      viewport: { width: 360, height: 480 },
      content,
      ...scaleRatios,
    });

    assert.deepEqual(
      { scale: desktop.scale, x: desktop.x, y: desktop.y },
      { scale: 0.36, x: 112, y: 138 },
    );
    assert.ok(Math.abs(mobile.scale - 0.162) < Number.EPSILON);
    assert.ok(Math.abs(mobile.x - 50.4) < 1e-10);
    assert.ok(Math.abs(mobile.y - 167.1) < 1e-10);
  });
});
