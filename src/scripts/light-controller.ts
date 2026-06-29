import type {
  LightController,
  LightControllerOptions,
  LightControllerState,
  LightState,
  LightWork,
} from "../types/light";

export function createLightController(
  options: LightControllerOptions,
): LightController {
  const works = cloneWorks(options.works).sort((a, b) => a.order - b.order);
  const states = cloneStates(options.states).sort((a, b) => a.order - b.order);
  assertControllerOptions(works, states, options);

  const defaultWorkIndex = works.findIndex(
    (work) => work.id === options.defaults.workId,
  );
  const defaultStateIndex = states.findIndex(
    (state) => state.id === options.defaults.stateId,
  );

  let activeWorkIndex = defaultWorkIndex;
  let activeStateIndex = defaultStateIndex;
  let viewedStateIds = new Set([states[defaultStateIndex].id]);
  let hasEmittedCompletion = false;
  let destroyed = false;
  let onStateChange = options.onStateChange;
  let onComplete = options.onComplete;

  function getState(): LightControllerState {
    return createSnapshot(
      works,
      states,
      activeWorkIndex,
      activeStateIndex,
      viewedStateIds,
    );
  }

  function emitState(): void {
    if (destroyed) {
      return;
    }

    const snapshot = getState();
    onStateChange?.(snapshot);

    if (snapshot.isComplete && !hasEmittedCompletion) {
      hasEmittedCompletion = true;
      onComplete?.(snapshot);
    }
  }

  function setWork(workId: string): void {
    if (destroyed) {
      return;
    }

    const nextIndex = works.findIndex((work) => work.id === workId);
    if (nextIndex < 0 || nextIndex === activeWorkIndex) {
      return;
    }

    activeWorkIndex = nextIndex;
    emitState();
  }

  function setRangeValue(value: number): void {
    if (destroyed) {
      return;
    }

    const nextIndex = clampIndex(value, states.length, activeStateIndex);
    const nextStateId = states[nextIndex].id;
    const isNewState = !viewedStateIds.has(nextStateId);

    if (nextIndex === activeStateIndex && !isNewState) {
      return;
    }

    activeStateIndex = nextIndex;
    viewedStateIds.add(nextStateId);
    emitState();
  }

  function reset(): void {
    if (destroyed) {
      return;
    }

    activeWorkIndex = defaultWorkIndex;
    activeStateIndex = defaultStateIndex;
    viewedStateIds = new Set([states[defaultStateIndex].id]);
    hasEmittedCompletion = false;
    emitState();
  }

  function destroy(): void {
    if (destroyed) {
      return;
    }

    destroyed = true;
    onStateChange = undefined;
    onComplete = undefined;
  }

  return {
    getState,
    setWork,
    setRangeValue,
    reset,
    destroy,
  };
}

function createSnapshot(
  works: LightWork[],
  states: LightState[],
  activeWorkIndex: number,
  activeStateIndex: number,
  viewedStateIds: Set<string>,
): LightControllerState {
  const activeWork = works[activeWorkIndex];
  const activeState = states[activeStateIndex];

  return {
    activeWork: cloneWork(activeWork),
    activeState: cloneState(activeState),
    rangeValue: activeStateIndex,
    rangeMin: 0,
    rangeMax: states.length - 1,
    viewedStateIds: states
      .filter((state) => viewedStateIds.has(state.id))
      .map((state) => state.id),
    viewedCount: viewedStateIds.size,
    totalStates: states.length,
    isComplete: viewedStateIds.size === states.length,
  };
}

function clampIndex(value: number, length: number, fallback: number): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(0, Math.min(length - 1, Math.round(value)));
}

function assertControllerOptions(
  works: LightWork[],
  states: LightState[],
  options: LightControllerOptions,
): void {
  assert(works.length > 0, "Light controller: требуется хотя бы одна работа");
  assert(
    states.length > 0,
    "Light controller: требуется хотя бы одно состояние",
  );
  assertUniqueIds(works, "works");
  assertUniqueIds(states, "states");
  assert(
    works.some((work) => work.id === options.defaults.workId),
    `Light controller: default work "${options.defaults.workId}" не найден`,
  );
  assert(
    states.some((state) => state.id === options.defaults.stateId),
    `Light controller: default state "${options.defaults.stateId}" не найден`,
  );
}

function assertUniqueIds(records: Array<{ id: string }>, label: string): void {
  const ids = new Set<string>();
  records.forEach((record) => {
    assert(
      !ids.has(record.id),
      `Light controller: ${label} содержит повтор id "${record.id}"`,
    );
    ids.add(record.id);
  });
}

function cloneWorks(works: LightWork[]): LightWork[] {
  return works.map(cloneWork);
}

function cloneStates(states: LightState[]): LightState[] {
  return states.map(cloneState);
}

function cloneWork(work: LightWork): LightWork {
  return { ...work, image: { ...work.image } };
}

function cloneState(state: LightState): LightState {
  return { ...state, visual: { ...state.visual } };
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
