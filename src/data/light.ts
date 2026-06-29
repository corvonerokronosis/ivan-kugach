import light6254Url from "../assets/images/interactive/light/dor-6254.jpg?url";
import light6258Url from "../assets/images/interactive/light/dor-6258.jpg?url";
import light6263Url from "../assets/images/interactive/light/dor-6263.jpg?url";
import type {
  LightExperienceDefaults,
  LightState,
  LightWork,
} from "../types/light";

const lightWorks = validateLightWorks([
  {
    id: "light-6258",
    order: 1,
    title: "Работа 1",
    image: {
      src: light6258Url,
      alt: "Первая картина Ивана Кугача для опыта со светом",
    },
  },
  {
    id: "light-6254",
    order: 2,
    title: "Работа 2",
    image: {
      src: light6254Url,
      alt: "Вторая картина Ивана Кугача для опыта со светом",
    },
  },
  {
    id: "light-6263",
    order: 3,
    title: "Работа 3",
    image: {
      src: light6263Url,
      alt: "Третья картина Ивана Кугача для опыта со светом",
    },
  },
] satisfies LightWork[]);

const lightStates = validateLightStates([
  {
    id: "morning",
    order: 1,
    label: "Утро",
    scaleLabel: "Утро",
    title: "Утренний боковой свет",
    text: "Мягкий тёплый свет вытягивает воздух вокруг стен и оставляет в картине ощущение начала дня.",
    visual: {
      filter: "saturate(1.02) contrast(1.01) brightness(1.07)",
      overlay:
        "linear-gradient(115deg, rgba(255, 226, 158, 0.48), rgba(255, 241, 210, 0.12) 46%, rgba(81, 93, 103, 0.18))",
      overlayOpacity: 0.48,
      beam: "linear-gradient(115deg, rgba(255, 235, 176, 0.4), transparent 42%)",
      beamOpacity: 0.42,
      shadow: 0.16,
      sideShadow: 0.14,
      focusX: "34%",
      focusY: "36%",
      shadowAngle: "120deg",
    },
  },
  {
    id: "day",
    order: 2,
    label: "Холодный день",
    scaleLabel: "День",
    title: "Холодный дневной свет",
    text: "В таком свете сильнее читается архитектура: плоскости стены, ритм окон и спокойная конструкция места.",
    visual: {
      filter: "saturate(0.9) contrast(1.05) brightness(1.02)",
      overlay:
        "linear-gradient(145deg, rgba(172, 202, 219, 0.34), rgba(255, 249, 232, 0.06) 48%, rgba(72, 83, 96, 0.12))",
      overlayOpacity: 0.42,
      beam: "linear-gradient(150deg, rgba(210, 231, 242, 0.24), transparent 45%)",
      beamOpacity: 0.28,
      shadow: 0.19,
      sideShadow: 0.18,
      focusX: "52%",
      focusY: "42%",
      shadowAngle: "130deg",
    },
  },
  {
    id: "evening",
    order: 3,
    label: "Вечер",
    scaleLabel: "Вечер",
    title: "Вечерний свет и память места",
    text: "Вечер приглушает подробности и собирает сцену в состояние памяти: остаются силуэты, тёплая стена и тишина.",
    visual: {
      filter: "saturate(0.92) contrast(1.08) brightness(0.82)",
      overlay:
        "linear-gradient(145deg, rgba(126, 75, 54, 0.42), rgba(210, 129, 72, 0.26) 44%, rgba(31, 31, 55, 0.34))",
      overlayOpacity: 0.62,
      beam: "radial-gradient(circle at 64% 42%, rgba(242, 160, 88, 0.28), transparent 38%)",
      beamOpacity: 0.34,
      shadow: 0.32,
      sideShadow: 0.34,
      focusX: "58%",
      focusY: "46%",
      shadowAngle: "105deg",
    },
  },
  {
    id: "lamp",
    order: 4,
    label: "Лампа",
    scaleLabel: "Лампа",
    title: "Тёплая лампа мастерской",
    text: "Лампа делает мотив ближе и телеснее: важнее становятся следы быта, поверхность дерева и человеческое присутствие.",
    visual: {
      filter: "saturate(1.08) contrast(1.06) brightness(0.94)",
      overlay:
        "radial-gradient(circle at 68% 38%, rgba(255, 199, 112, 0.58), rgba(147, 71, 33, 0.22) 44%, rgba(22, 14, 9, 0.42))",
      overlayOpacity: 0.74,
      beam: "radial-gradient(circle at 70% 36%, rgba(255, 229, 160, 0.46), transparent 34%)",
      beamOpacity: 0.54,
      shadow: 0.4,
      sideShadow: 0.42,
      focusX: "68%",
      focusY: "38%",
      shadowAngle: "250deg",
    },
  },
] satisfies LightState[]);

const lightExperienceDefaults = validateLightExperienceDefaults({
  workId: "light-6258",
  stateId: "day",
} satisfies LightExperienceDefaults);

export function getLightWorks(): LightWork[] {
  return [...lightWorks]
    .sort((a, b) => a.order - b.order)
    .map((work) => ({ ...work, image: { ...work.image } }));
}

export function getLightWorkById(id: string): LightWork | undefined {
  const work = lightWorks.find((item) => item.id === id);
  return work ? { ...work, image: { ...work.image } } : undefined;
}

export function getLightStates(): LightState[] {
  return [...lightStates]
    .sort((a, b) => a.order - b.order)
    .map(cloneLightState);
}

export function getLightStateById(id: string): LightState | undefined {
  const state = lightStates.find((item) => item.id === id);
  return state ? cloneLightState(state) : undefined;
}

export function getLightExperienceDefaults(): LightExperienceDefaults {
  return { ...lightExperienceDefaults };
}

function cloneLightState(state: LightState): LightState {
  return { ...state, visual: { ...state.visual } };
}

function validateLightWorks(records: LightWork[]): LightWork[] {
  validateOrderedRecords(records, "light works");

  records.forEach((record, index) => {
    const label = record.id || `#${index + 1}`;
    assertNonEmptyString(
      record.title,
      `light work "${label}": title обязателен`,
    );
    assertNonEmptyString(
      record.image.src,
      `light work "${label}": image.src обязателен`,
    );
    assertNonEmptyString(
      record.image.alt,
      `light work "${label}": image.alt обязателен`,
    );
  });

  return records;
}

function validateLightStates(records: LightState[]): LightState[] {
  validateOrderedRecords(records, "light states");

  records.forEach((record, index) => {
    const label = record.id || `#${index + 1}`;
    assertNonEmptyString(
      record.label,
      `light state "${label}": label обязателен`,
    );
    assertNonEmptyString(
      record.scaleLabel,
      `light state "${label}": scaleLabel обязателен`,
    );
    assertNonEmptyString(
      record.title,
      `light state "${label}": title обязателен`,
    );
    assertNonEmptyString(
      record.text,
      `light state "${label}": text обязателен`,
    );
    assertNonEmptyString(
      record.visual.filter,
      `light state "${label}": filter обязателен`,
    );
    assertNonEmptyString(
      record.visual.overlay,
      `light state "${label}": overlay обязателен`,
    );
    assertNonEmptyString(
      record.visual.beam,
      `light state "${label}": beam обязателен`,
    );
    validateOpacity(record.visual.overlayOpacity, label, "overlayOpacity");
    validateOpacity(record.visual.beamOpacity, label, "beamOpacity");
    validateOpacity(record.visual.shadow, label, "shadow");
    validateOpacity(record.visual.sideShadow, label, "sideShadow");
  });

  return records;
}

function validateOrderedRecords(
  records: Array<{ id: string; order: number }>,
  label: string,
): void {
  assert(records.length > 0, `${label}: ожидается хотя бы одна запись`);

  const ids = new Set<string>();
  const orders = new Set<number>();
  records.forEach((record, index) => {
    assertNonEmptyString(record.id, `${label}[${index}]: id обязателен`);
    assert(
      Number.isInteger(record.order) && record.order > 0,
      `${label} "${record.id}": order должен быть положительным целым числом`,
    );
    assertUnique(ids, record.id, `${label}: дублируется id "${record.id}"`);
    assertUnique(
      orders,
      record.order,
      `${label}: дублируется order "${record.order}"`,
    );
  });
}

function validateLightExperienceDefaults(
  defaults: LightExperienceDefaults,
): LightExperienceDefaults {
  assert(
    lightWorks.some((work) => work.id === defaults.workId),
    `light defaults: workId "${defaults.workId}" не найден`,
  );
  assert(
    lightStates.some((state) => state.id === defaults.stateId),
    `light defaults: stateId "${defaults.stateId}" не найден`,
  );
  return defaults;
}

function validateOpacity(value: number, stateId: string, field: string): void {
  assert(
    Number.isFinite(value) && value >= 0 && value <= 1,
    `light state "${stateId}": ${field} должен быть от 0 до 1`,
  );
}

function assertUnique<T>(set: Set<T>, value: T, message: string): void {
  assert(!set.has(value), message);
  set.add(value);
}

function assertNonEmptyString(value: string, message: string): void {
  assert(value.trim().length > 0, message);
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
