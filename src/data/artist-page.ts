export interface ArtistTheme {
  title: string;
  description: string;
}

export interface ArtistRelatedSeries {
  title: string;
  description: string;
  artworkKey: "interior" | "architecture";
  href: string;
}

export interface ArtistPageContent {
  eyebrow: string;
  title: string;
  lead: string;
  quote: string;
  contextTitle: string;
  contextParagraphs: string[];
  themes: ArtistTheme[];
  relatedSeries: ArtistRelatedSeries[];
}

const joinText = (...parts: string[]): string => parts.join(" ");

const artistPageContent: ArtistPageContent = {
  eyebrow: "Художник",
  title: "Иван Кугач",
  lead: "Иван Кугач известен вниманием к тихим сюжетам, человеческому масштабу и мягкой живописной атмосфере.",
  quote: joinText(
    "Мир Кугача держится на тепле повседневности:",
    "в его работах важны свет, человеческое присутствие и ощущение живой, узнаваемой среды.",
  ),
  contextTitle: "Взгляд на повседневность",
  contextParagraphs: [
    joinText(
      "Эта страница собирает художественный контекст вокруг уже представленных в проекте работ.",
      "Пока биографические сведения проходят редакционное уточнение,",
      "здесь остаются только подтверждённые наблюдения о языке живописи.",
    ),
    joinText(
      "Композиция построена так, чтобы позднее дополнить материал датами,",
      "источниками и авторской цитатой без изменения структуры страницы.",
    ),
  ],
  themes: [
    {
      title: "Тихий сюжет",
      description:
        "Повседневная сцена становится самостоятельным предметом внимательного и неспешного наблюдения.",
    },
    {
      title: "Человеческий масштаб",
      description:
        "Интерьеры и архитектурные детали сохраняют ощущение присутствия человека, даже когда он остаётся за пределами кадра.",
    },
    {
      title: "Свет и атмосфера",
      description:
        "Тёплая палитра, материальность поверхности и мягкий свет связывают отдельные мотивы в узнаваемую среду.",
    },
  ],
  relatedSeries: [
    {
      title: "Тихие интерьеры",
      description:
        "Временная редакционная подборка работ, где пространство мастерской и дома становится главным героем.",
      artworkKey: "interior",
      href: "/works/",
    },
    {
      title: "Архитектурные наблюдения",
      description:
        "Временная подборка деталей фасадов и мест, сохраняющих след времени и человеческого присутствия.",
      artworkKey: "architecture",
      href: "/works/",
    },
  ],
};

export function getArtistPageContent(): ArtistPageContent {
  return artistPageContent;
}
