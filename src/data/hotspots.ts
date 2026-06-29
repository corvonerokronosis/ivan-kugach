import detailsArtwork from "../assets/images/interactive/details/kugach-picture-2.png";
import type { Hotspot } from "../types/hotspot";

const hotspotImage = {
  src: detailsArtwork.src,
  alt: "Картина для исследовательского интерактива с точками внимания",
} as const;

const hotspots = validateHotspots([
  {
    id: "sign",
    order: 1,
    image: hotspotImage,
    position: {
      x: 0.172,
      y: 0.195,
    },
    targetScale: 0.94,
    label: "Точка 1",
    title: "Вывеска на стене",
    text: "В этой версии прототипа вывеска работает как тестовая точка внимания. Здесь позже можно рассказать, как текст на фасаде вводит зрителя в сюжет, связывает бытовую сцену с конкретным местом и помогает считывать эпоху.",
  },
  {
    id: "crack",
    order: 2,
    image: hotspotImage,
    position: {
      x: 0.12,
      y: 0.105,
    },
    targetScale: 0.9,
    label: "Точка 2",
    title: "Трещина и след времени",
    text: "Эта зона может стать поводом для короткой музейной ремарки о материальности старого дома. Пока здесь заглушка: в финальной версии можно говорить о фактуре штукатурки, следах старения и том, как художник работает с ощущением прожитого пространства.",
  },
  {
    id: "window",
    order: 3,
    image: hotspotImage,
    position: {
      x: 0.575,
      y: 0.425,
    },
    targetScale: 1,
    label: "Точка 3",
    title: "Окно как центр взгляда",
    text: "Оконный проём удобно использовать как главный смысловой фокус. Внутри этой карточки потом можно разместить текст о композиции, ритме наличников и о том, как тёмное стекло собирает вокруг себя соседние детали.",
  },
  {
    id: "brick",
    order: 4,
    image: hotspotImage,
    position: {
      x: 0.59,
      y: 0.91,
    },
    targetScale: 0.88,
    label: "Точка 4",
    title: "Кирпичная кладка внизу",
    text: "Нижний фрагмент с кирпичом хорошо подходит для разговора о слоях поверхности и ручной фактуре письма. Сейчас это временный текст-заполнитель, который можно заменить на описание колорита, ритма кладки или состояния архитектурной среды.",
  },
] satisfies Hotspot[]);

export function getHotspots(): Hotspot[] {
  return [...hotspots].sort((a, b) => a.order - b.order);
}

export function getHotspotById(id: string): Hotspot | undefined {
  return hotspots.find((hotspot) => hotspot.id === id);
}

function validateHotspots(records: Hotspot[]): Hotspot[] {
  assert(records.length > 0, "hotspots: ожидается хотя бы одна точка");

  const ids = new Set<string>();
  const orders = new Set<number>();

  records.forEach((record, index) => {
    validateHotspot(record, index);
    assertUnique(ids, record.id, `hotspots: дублируется id "${record.id}"`);
    assertUnique(
      orders,
      record.order,
      `hotspots: дублируется order "${record.order}" у "${record.id}"`,
    );
  });

  return records;
}

function validateHotspot(record: Hotspot, index: number): void {
  const label = record.id || `#${index + 1}`;

  assertNonEmptyString(record.id, `hotspots[${index}]: id обязателен`);
  assert(
    Number.isInteger(record.order) && record.order > 0,
    `hotspots "${label}": order должен быть положительным целым числом`,
  );
  assertNonEmptyString(
    record.image.src,
    `hotspots "${label}": image.src обязателен`,
  );
  assertNonEmptyString(
    record.image.alt,
    `hotspots "${label}": image.alt обязателен`,
  );
  assert(
    record.position.x >= 0 && record.position.x <= 1,
    `hotspots "${label}": position.x должен быть от 0 до 1`,
  );
  assert(
    record.position.y >= 0 && record.position.y <= 1,
    `hotspots "${label}": position.y должен быть от 0 до 1`,
  );
  assert(
    record.targetScale > 0,
    `hotspots "${label}": targetScale должен быть больше 0`,
  );
  assertNonEmptyString(record.label, `hotspots "${label}": label обязателен`);
  assertNonEmptyString(record.title, `hotspots "${label}": title обязателен`);
  assertNonEmptyString(record.text, `hotspots "${label}": text обязателен`);
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
