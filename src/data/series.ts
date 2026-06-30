import dor3518Image from "../assets/images/works/dor-3518.jpg";
import type { Series, SeriesRef, SeriesSummary } from "../types/series";

const joinText = (...parts: string[]): string => parts.join(" ");

const series = validateSeries([
  {
    id: "demo-series-needs-title",
    slug: "demo-series-needs-title",
    title: "Демонстрационная серия: требует замены названия",
    description: joinText(
      "Временная серия из legacy-каталога.",
      "Название, состав и кураторское описание требуют редакционного уточнения после атрибуции работ.",
    ),
    cover: {
      src: dor3518Image.src,
      alt: "Обложка демонстрационной серии — DOR 3518",
      caption: "Временная обложка серии из стартовой подборки каталога.",
    },
    order: 1,
  },
]);

export function getSeries(): Series[] {
  return [...series].sort((a, b) => a.order - b.order);
}

export function getSeriesSummaries(): SeriesSummary[] {
  return getSeries().map(({ seo: _seo, ...summary }) => summary);
}

export function getSeriesById(id: string): Series | undefined {
  return series.find((item) => item.id === id);
}

export function getSeriesBySlug(slug: string): Series | undefined {
  return series.find((item) => item.slug === slug);
}

export function getSeriesRefById(id: string): SeriesRef {
  const item = getSeriesById(id);

  assert(item !== undefined, `series: не найдена серия "${id}"`);

  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
  };
}

function validateSeries(records: Series[]): Series[] {
  assert(records.length > 0, "series: ожидается хотя бы одна запись");

  const ids = new Set<string>();
  const slugs = new Set<string>();
  const orders = new Set<number>();

  records.forEach((record, index) => {
    validateSeriesRecord(record, index);
    assertUnique(ids, record.id, `series: дублируется id "${record.id}"`);
    assertUnique(
      slugs,
      record.slug,
      `series: дублируется slug "${record.slug}"`,
    );
    assertUnique(
      orders,
      record.order,
      `series: дублируется order "${record.order}" у "${record.id}"`,
    );
  });

  return records;
}

function validateSeriesRecord(record: Series, index: number): void {
  const label = record.id || `#${index + 1}`;

  assertNonEmptyString(record.id, `series[${index}]: id обязателен`);
  assertSlug(
    record.slug,
    `series "${label}": slug должен быть lowercase kebab-case`,
  );
  assertNonEmptyString(record.title, `series "${label}": title обязателен`);
  assertNonEmptyString(
    record.description,
    `series "${label}": description обязателен`,
  );
  assert(
    Number.isInteger(record.order) && record.order > 0,
    `series "${label}": order должен быть положительным целым числом`,
  );

  if (record.cover !== null) {
    assertNonEmptyString(
      record.cover.src,
      `series "${label}": cover.src обязателен`,
    );
    assertNonEmptyString(
      record.cover.alt,
      `series "${label}": cover.alt обязателен`,
    );
  }
}

function assertUnique<T>(set: Set<T>, value: T, message: string): void {
  assert(!set.has(value), message);
  set.add(value);
}

function assertSlug(value: string, message: string): void {
  assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), message);
}

function assertNonEmptyString(value: string, message: string): void {
  assert(value.trim().length > 0, message);
}

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
