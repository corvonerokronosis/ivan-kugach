import dor3518Image from "../for_sales/DOR_3518.jpg";
import dor3571Image from "../for_sales/DOR_3571.jpg";
import dsc8578Image from "../for_sales/DSC_8578 1.jpg";
import dsc8599Image from "../for_sales/DSC_8599 1.jpg";
import dsc8602Image from "../for_sales/DSC_8602 1.jpg";
import { getSeriesById, getSeriesRefById } from "./series";
import {
  isArtworkAvailability,
  isArtworkPriceType,
  type Artwork,
  type ArtworkSummary,
} from "../types/artwork";

export const artworkAvailabilityLabels = {
  available: "Доступна",
  reserved: "Зарезервирована",
  sold: "Продана",
} as const satisfies Record<Artwork["availability"], string>;

const artworks = validateArtworks([
  {
    id: "dor-3518",
    slug: "dor-3518",
    title: "Название уточняется",
    year: "Год уточняется",
    series: getSeriesRefById("demo-series-needs-title"),
    images: [
      {
        src: dor3518Image.src,
        alt: "Название уточняется — DOR 3518",
        role: "primary",
      },
    ],
    technique: "Техника уточняется",
    dimensions: {
      label: "Размер уточняется",
    },
    priceType: "fixed",
    price: "420 000 ₽",
    availability: "available",
    shortDescription: "Работа из стартовой подборки для заявочной галереи.",
    fullDescription:
      "Временное описание фиксирует место произведения в MVP-каталоге. После уточнения атрибуции здесь появится реальный сюжет, техника, размер и история работы Ивана Кугача.",
    featured: true,
    order: 1,
  },
  {
    id: "dor-3571",
    slug: "dor-3571",
    title: "Название уточняется",
    year: "Год уточняется",
    series: getSeriesRefById("demo-series-needs-title"),
    images: [
      {
        src: dor3571Image.src,
        alt: "Название уточняется — DOR 3571",
        role: "primary",
      },
    ],
    technique: "Техника уточняется",
    dimensions: {
      label: "Размер уточняется",
    },
    priceType: "request",
    price: null,
    availability: "available",
    shortDescription: "Доступная работа с ценой по запросу.",
    fullDescription:
      "Эта карточка демонстрирует сценарий уточнения цены. Пользователь может открыть детальный просмотр и отправить заявку, не воспринимая страницу как интернет-магазин с мгновенной оплатой.",
    featured: true,
    order: 2,
  },
  {
    id: "dsc-8578",
    slug: "dsc-8578",
    title: "Название уточняется",
    year: "Год уточняется",
    series: getSeriesRefById("demo-series-needs-title"),
    images: [
      {
        src: dsc8578Image.src,
        alt: "Название уточняется — DSC 8578",
        role: "primary",
      },
    ],
    technique: "Техника уточняется",
    dimensions: {
      label: "Размер уточняется",
    },
    priceType: "fixed",
    price: "360 000 ₽",
    availability: "reserved",
    shortDescription:
      "Зарезервированная работа остается видимой, но не выглядит свободной для покупки.",
    fullDescription:
      "Статус резерва помогает показать реальное состояние каталога. Форма может принять вопрос о сроках, похожих работах или серии, но не обещает автоматическое снятие резерва.",
    featured: false,
    order: 3,
  },
  {
    id: "dsc-8599",
    slug: "dsc-8599",
    title: "Название уточняется",
    year: "Год уточняется",
    series: getSeriesRefById("demo-series-needs-title"),
    images: [
      {
        src: dsc8599Image.src,
        alt: "Название уточняется — DSC 8599",
        role: "primary",
      },
    ],
    technique: "Техника уточняется",
    dimensions: {
      label: "Размер уточняется",
    },
    priceType: "request",
    price: null,
    availability: "sold",
    shortDescription:
      "Проданная работа вынесена в архив и не предлагает покупку конкретного произведения.",
    fullDescription:
      "Архивная карточка помогает понять диапазон творчества Ивана Кугача и может вести к вопросу о похожих произведениях или работах этой серии.",
    featured: false,
    order: 4,
  },
  {
    id: "dsc-8602",
    slug: "dsc-8602",
    title: "Название уточняется",
    year: "Год уточняется",
    series: getSeriesRefById("demo-series-needs-title"),
    images: [
      {
        src: dsc8602Image.src,
        alt: "Название уточняется — DSC 8602",
        role: "primary",
      },
    ],
    technique: "Техника уточняется",
    dimensions: {
      label: "Размер уточняется",
    },
    priceType: "fixed",
    price: "390 000 ₽",
    availability: "sold",
    shortDescription:
      "Архивная работа с фиксированной исторической ценой в данных MVP.",
    fullDescription:
      "Работа отображается отдельно от доступного каталога. CTA формулируется как интерес к похожим работам, чтобы не создавать впечатления доступности.",
    featured: false,
    order: 5,
  },
]);

export function getArtworks(): Artwork[] {
  return [...artworks].sort((a, b) => a.order - b.order);
}

export function getArtworkSummaries(): ArtworkSummary[] {
  return getArtworks().map(
    ({ fullDescription: _fullDescription, seo: _seo, ...summary }) => summary,
  );
}

export function getFeaturedArtworks(): ArtworkSummary[] {
  return getArtworkSummaries().filter((artwork) => artwork.featured);
}

export function getArtworkBySlug(slug: string): Artwork | undefined {
  return artworks.find((artwork) => artwork.slug === slug);
}

export function getArtworksBySeriesId(seriesId: string): ArtworkSummary[] {
  return getArtworkSummaries().filter(
    (artwork) => artwork.series?.id === seriesId,
  );
}

function validateArtworks(records: Artwork[]): Artwork[] {
  assert(records.length > 0, "artworks: ожидается хотя бы одна запись");

  const ids = new Set<string>();
  const slugs = new Set<string>();
  const orders = new Set<number>();

  records.forEach((record, index) => {
    validateArtwork(record, index);
    assertUnique(ids, record.id, `artworks: дублируется id "${record.id}"`);
    assertUnique(
      slugs,
      record.slug,
      `artworks: дублируется slug "${record.slug}"`,
    );
    assertUnique(
      orders,
      record.order,
      `artworks: дублируется order "${record.order}" у "${record.id}"`,
    );
  });

  return records;
}

function validateArtwork(record: Artwork, index: number): void {
  const label = record.id || `#${index + 1}`;

  assertNonEmptyString(record.id, `artworks[${index}]: id обязателен`);
  assertSlug(
    record.slug,
    `artworks "${label}": slug должен быть lowercase kebab-case`,
  );
  assertNonEmptyString(record.title, `artworks "${label}": title обязателен`);
  assertNonEmptyString(record.year, `artworks "${label}": year обязателен`);
  assertNonEmptyString(
    record.technique,
    `artworks "${label}": technique обязателен`,
  );
  assertNonEmptyString(
    record.dimensions.label,
    `artworks "${label}": dimensions.label обязателен`,
  );
  assert(
    isArtworkAvailability(record.availability),
    `artworks "${label}": неизвестный availability "${record.availability}"`,
  );
  assert(
    isArtworkPriceType(record.priceType),
    `artworks "${label}": неизвестный priceType "${record.priceType}"`,
  );
  assert(
    Number.isInteger(record.order) && record.order > 0,
    `artworks "${label}": order должен быть положительным целым числом`,
  );
  assertNonEmptyString(
    record.shortDescription,
    `artworks "${label}": shortDescription обязателен`,
  );
  assertNonEmptyString(
    record.fullDescription,
    `artworks "${label}": fullDescription обязателен`,
  );
  assert(
    record.images.length > 0,
    `artworks "${label}": нужна хотя бы одна картинка`,
  );
  assert(
    record.images.some((image) => image.role === "primary"),
    `artworks "${label}": нужна primary-картинка`,
  );

  record.images.forEach((image, imageIndex) => {
    assertNonEmptyString(
      image.src,
      `artworks "${label}" image[${imageIndex}]: src обязателен`,
    );
    assertNonEmptyString(
      image.alt,
      `artworks "${label}" image[${imageIndex}]: alt обязателен`,
    );
  });

  if (record.series !== null) {
    const linkedSeries = getSeriesById(record.series.id);

    assertNonEmptyString(
      record.series.id,
      `artworks "${label}": series.id обязателен`,
    );
    assertSlug(
      record.series.slug,
      `artworks "${label}": series.slug должен быть lowercase kebab-case`,
    );
    assertNonEmptyString(
      record.series.title,
      `artworks "${label}": series.title обязателен`,
    );
    assert(
      linkedSeries !== undefined,
      `artworks "${label}": серия "${record.series.id}" отсутствует в src/data/series.ts`,
    );
    assert(
      record.series.slug === linkedSeries.slug,
      `artworks "${label}": series.slug "${record.series.slug}" не совпадает с "${linkedSeries.slug}"`,
    );
    assert(
      record.series.title === linkedSeries.title,
      `artworks "${label}": series.title "${record.series.title}" не совпадает с "${linkedSeries.title}"`,
    );
  }

  if (record.priceType === "fixed") {
    assertNonEmptyString(
      record.price,
      `artworks "${label}": fixed price обязателен`,
    );
  }

  if (record.priceType === "request") {
    assert(
      record.price === null,
      `artworks "${label}": request price должен быть null`,
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
