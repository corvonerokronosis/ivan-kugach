import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createLightController } from "../.tmp/unit-tests/scripts/light-controller.js";

const works = [
  {
    id: "work-1",
    order: 1,
    title: "Работа 1",
    image: { src: "/work-1.jpg", alt: "Работа 1" },
  },
  {
    id: "work-2",
    order: 2,
    title: "Работа 2",
    image: { src: "/work-2.jpg", alt: "Работа 2" },
  },
];

const states = [
  createState("morning", 1),
  createState("day", 2),
  createState("evening", 3),
  createState("lamp", 4),
];

const defaults = { workId: "work-1", stateId: "day" };

describe("light controller", () => {
  it("starts from data-driven defaults and counts the initial state as viewed", () => {
    const controller = createLightController({ works, states, defaults });

    assert.deepEqual(snapshotSummary(controller.getState()), {
      workId: "work-1",
      stateId: "day",
      rangeValue: 1,
      rangeMin: 0,
      rangeMax: 3,
      viewedStateIds: ["day"],
      viewedCount: 1,
      totalStates: 4,
      isComplete: false,
    });
  });

  it("rounds and clamps range values while tracking unique viewed states", () => {
    const controller = createLightController({ works, states, defaults });

    controller.setRangeValue(-4);
    controller.setRangeValue(1.6);
    controller.setRangeValue(20);
    controller.setRangeValue(20);

    assert.deepEqual(controller.getState().viewedStateIds, [
      "morning",
      "day",
      "evening",
      "lamp",
    ]);
    assert.equal(controller.getState().rangeValue, 3);
    assert.equal(controller.getState().isComplete, true);
  });

  it("switches work without changing the selected light state or progress", () => {
    const controller = createLightController({ works, states, defaults });
    controller.setRangeValue(2);
    controller.setWork("work-2");

    assert.deepEqual(snapshotSummary(controller.getState()), {
      workId: "work-2",
      stateId: "evening",
      rangeValue: 2,
      rangeMin: 0,
      rangeMax: 3,
      viewedStateIds: ["day", "evening"],
      viewedCount: 2,
      totalStates: 4,
      isComplete: false,
    });
  });

  it("emits completion once and allows it again after reset", () => {
    let completionCount = 0;
    const controller = createLightController({
      works,
      states,
      defaults,
      onComplete: () => {
        completionCount += 1;
      },
    });

    controller.setRangeValue(0);
    controller.setRangeValue(2);
    controller.setRangeValue(3);
    controller.setRangeValue(2);
    assert.equal(completionCount, 1);

    controller.reset();
    assert.deepEqual(controller.getState().viewedStateIds, ["day"]);
    controller.setRangeValue(0);
    controller.setRangeValue(2);
    controller.setRangeValue(3);
    assert.equal(completionCount, 2);
  });

  it("keeps instances independent and removes callbacks on destroy", () => {
    let stateChanges = 0;
    let completions = 0;
    const first = createLightController({
      works,
      states,
      defaults,
      onStateChange: () => {
        stateChanges += 1;
      },
      onComplete: () => {
        completions += 1;
      },
    });
    const second = createLightController({ works, states, defaults });

    first.setRangeValue(0);
    assert.deepEqual(first.getState().viewedStateIds, ["morning", "day"]);
    assert.deepEqual(second.getState().viewedStateIds, ["day"]);

    const stateBeforeDestroy = snapshotSummary(first.getState());
    first.destroy();
    first.setRangeValue(2);
    first.setRangeValue(3);

    assert.equal(stateChanges, 1);
    assert.equal(completions, 0);
    assert.deepEqual(snapshotSummary(first.getState()), stateBeforeDestroy);
    assert.deepEqual(second.getState().viewedStateIds, ["day"]);
  });
});

function createState(id, order) {
  return {
    id,
    order,
    label: id,
    title: id,
    text: id,
    visual: {
      filter: "none",
      overlay: "none",
      overlayOpacity: 0,
      beam: "none",
      beamOpacity: 0,
      shadow: 0,
      sideShadow: 0,
      focusX: "50%",
      focusY: "50%",
      shadowAngle: "0deg",
    },
  };
}

function snapshotSummary(state) {
  return {
    workId: state.activeWork.id,
    stateId: state.activeState.id,
    rangeValue: state.rangeValue,
    rangeMin: state.rangeMin,
    rangeMax: state.rangeMax,
    viewedStateIds: state.viewedStateIds,
    viewedCount: state.viewedCount,
    totalStates: state.totalStates,
    isComplete: state.isComplete,
  };
}
