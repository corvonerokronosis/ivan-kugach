export interface SeriesRef {
  id: string;
  slug: string;
  title: string;
}

export interface SeriesCover {
  src: string;
  alt: string;
  caption?: string;
}

export interface SeriesSeoFields {
  title?: string;
  description?: string;
  image?: string;
}

export interface Series extends SeriesRef {
  description: string;
  cover: SeriesCover | null;
  order: number;
  seo?: SeriesSeoFields;
}

export type SeriesSummary = Pick<
  Series,
  "id" | "slug" | "title" | "description" | "cover" | "order"
>;
