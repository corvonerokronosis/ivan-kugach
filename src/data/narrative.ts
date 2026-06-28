import colorArtwork from "../Kugach_picture_1.png";
import detailsArtwork from "../Kugach_picture_2.png";
import lightArtworkUrl from "../picture_light_shadow/_DOR6258.JPG?url";
import {
  isNarrativeCompletionAction,
  isNarrativeContentStatus,
  type NarrativeSequence,
} from "../types/narrative";

const narrativeSequences = validateNarrativeSequences([
  {
    id: "intro",
    order: 1,
    contentStatus: "placeholder",
    eyebrow: "Сюжетная линия",
    lead: "Первый блок вводит в историю и готовит пользователя к мягкому раскрытию живописи.",
    completionLabel: "Перейти к интерактиву",
    skipLabel: "Пропустить вступление",
    completionAction: "experience",
    slides: [
      {
        id: "intro-1",
        order: 1,
        meta: ["Пролог", "Окно 1", "Заглушка"],
        title: "В музейном зале становится тише",
        image: {
          src: colorArtwork.src,
          alt: "В музейном зале становится тише",
          caption:
            "Временная иллюстрация вступления: здесь позже может появиться отдельный narrative-кадр.",
        },
        text: "Посетитель входит в зал и сначала видит не механику, а настроение. Это окно задаёт тон будущей истории и объясняет, что интерактивы будут частью одного маршрута, а не двумя отдельными упражнениями.",
        secondaryText:
          "Здесь позже можно разместить короткую кураторскую ремарку о том, почему история начинается именно с возвращения цвета.",
      },
      {
        id: "intro-2",
        order: 2,
        meta: ["Пролог", "Окно 2", "Маршрут"],
        title: "Перед нами картина, будто приглушённая временем",
        image: {
          src: colorArtwork.src,
          alt: "Перед нами картина, будто приглушённая временем",
          caption:
            "Заглушка для второго сюжетного окна с опорой на первое произведение.",
        },
        text: "Во втором окне narrative может подвести пользователя к мысли, что работа ещё не раскрылась полностью. В текущем патче здесь стоит временный текст, который просто держит структуру и ритм последовательности.",
        secondaryText:
          "Дополнительный слот можно использовать для короткой инструкции, эмоциональной подводки или музейного комментария.",
      },
      {
        id: "intro-3",
        order: 3,
        meta: ["Пролог", "Окно 3", "Переход"],
        title: "Следующий шаг — прикоснуться к поверхности",
        image: {
          src: colorArtwork.src,
          alt: "Следующий шаг — прикоснуться к поверхности",
          caption:
            "Финальное окно вступления должно подготовить вход в первый интерактив.",
        },
        text: "Третье окно завершает вводный блок и подводит к действию. Пока здесь заглушка, но позже именно это место станет смысловым мостом между историей и сценой 'Возвращение цвета'.",
        secondaryText:
          "В следующем патче это окно будет связано с реальным переходом в экран раскрашивания.",
      },
    ],
  },
  {
    id: "bridge",
    order: 2,
    contentStatus: "placeholder",
    eyebrow: "Связка маршрутов",
    lead: "Второй блок соединит завершение раскрашивания с переходом к исследованию другой картины.",
    completionLabel: "Перейти к исследованию",
    skipLabel: "Пропустить вставку",
    completionAction: "explore",
    slides: [
      {
        id: "bridge-1",
        order: 1,
        meta: ["Интерлюдия", "Окно 1", "После финала"],
        title: "Цвет возвращается, но история ещё не закончена",
        image: {
          src: colorArtwork.src,
          alt: "Цвет возвращается, но история ещё не закончена",
          caption:
            "Здесь позже можно показать кадр-переход после завершения первого интерактива.",
        },
        text: "Первое промежуточное окно должно объяснять, что восстановление живописного слоя было только первой частью путешествия. Сейчас это временный текст, который помогает собрать будущую структуру сценария.",
        secondaryText:
          "Блок предназначен для плавного перехода от действия к созерцанию и дальнейшему исследованию.",
      },
      {
        id: "bridge-2",
        order: 2,
        meta: ["Интерлюдия", "Окно 2", "Подготовка"],
        title: "Чтобы понять пространство глубже, надо приблизиться",
        image: {
          src: detailsArtwork.src,
          alt: "Чтобы понять пространство глубже, надо приблизиться",
          caption: "Временный визуал для связки с исследовательским сценарием.",
        },
        text: "Во втором окне narrative может сместить фокус с общего впечатления на детали: следы времени, архитектуру, ритм фактур и малые элементы композиции.",
        secondaryText:
          "Здесь удобно заложить будущую мотивацию для точек взаимодействия и режима свободного просмотра.",
      },
      {
        id: "bridge-3",
        order: 3,
        meta: ["Интерлюдия", "Окно 3", "Вход"],
        title: "Теперь картина открывается как пространство для исследования",
        image: {
          src: detailsArtwork.src,
          alt: "Теперь картина открывается как пространство для исследования",
          caption:
            "Последнее окно второго блока позже поведёт пользователя в режим зума и точек.",
        },
        text: "Финал промежуточной вставки готовит вход во второй интерактив. На этом этапе текст работает как заглушка, но структура карточки и место под будущий переход уже заложены.",
        secondaryText:
          "В следующем патче этот слайд станет отправной точкой для экрана исследования.",
      },
    ],
  },
  {
    id: "lightBridge",
    order: 3,
    contentStatus: "placeholder",
    eyebrow: "Переход в мастерскую",
    lead: "Третий блок переводит маршрут от открытых деталей к работе со светом и состоянием картины.",
    completionLabel: "Перейти к свету",
    skipLabel: "Пропустить вставку",
    completionAction: "light",
    slides: [
      {
        id: "light-bridge-1",
        order: 1,
        meta: ["Интерлюдия", "Окно 1", "После деталей"],
        title: "Когда детали найдены, меняется сам способ смотреть",
        image: {
          src: detailsArtwork.src,
          alt: "Когда детали найдены, меняется сам способ смотреть",
          caption: "Связка после исследования второй картины.",
        },
        text: "Пользователь уже приблизился к фактурам и точкам внимания. Следующий шаг переносит его в условную мастерскую, где тот же взгляд проверяется светом.",
        secondaryText:
          "Здесь сюжет делает переход от поиска деталей к ощущению времени суток и настроения.",
      },
      {
        id: "light-bridge-2",
        order: 2,
        meta: ["Интерлюдия", "Окно 2", "Свет"],
        title: "Свет показывает не новую картину, а новое состояние",
        image: {
          src: lightArtworkUrl,
          alt: "Свет показывает не новую картину, а новое состояние",
          caption: "Одна из экспериментальных работ для интерактива света.",
        },
        text: "У Кугача состояние часто держится на тонкой разнице: холодный день делает видимой конструкцию, вечер собирает память, лампа приближает человеческое присутствие.",
        secondaryText:
          "В мастерской будет один регулятор и четыре состояния, чтобы не усложнять механику, а усилить созерцание.",
      },
    ],
  },
  {
    id: "finale",
    order: 4,
    contentStatus: "placeholder",
    eyebrow: "Финальная вставка",
    lead: "Последний блок завершит маршрут после работы со светом в мастерской.",
    completionLabel: "Завершить блок",
    skipLabel: "Пропустить блок",
    completionAction: "landing",
    slides: [
      {
        id: "finale-1",
        order: 1,
        meta: ["Эпилог", "Окно 1", "После исследования"],
        title: "Собранные детали начинают складываться в целое",
        image: {
          src: detailsArtwork.src,
          alt: "Собранные детали начинают складываться в целое",
          caption: "Заглушка для первой финальной narrative-карточки.",
        },
        text: "После просмотра всех точек здесь может появиться первый итоговый смысловой акцент. Пока это техническая заглушка, но экран уже рассчитан на финальную подачу истории.",
        secondaryText:
          "Дополнительный текстовый слот можно использовать для вывода, цитаты или короткого музейного комментария.",
      },
      {
        id: "finale-2",
        order: 2,
        meta: ["Эпилог", "Окно 2", "Смысл"],
        title: "Маршрут соединяет жест, взгляд и память о месте",
        image: {
          src: detailsArtwork.src,
          alt: "Маршрут соединяет жест, взгляд и память о месте",
          caption:
            "Второе окно эпилога может закрепить смысловую рамку всего прохождения.",
        },
        text: "Здесь narrative уже не ведёт к новой механике, а собирает опыт пользователя в завершённую историю. Сейчас текст заполнительный, но логика финальной трёхоконной вставки уже подготовлена.",
        secondaryText:
          "В будущем сюда можно поместить вывод о живописной среде, авторском взгляде или ощущении времени.",
      },
      {
        id: "finale-3",
        order: 3,
        meta: ["Эпилог", "Окно 3", "Возврат"],
        title: "История завершена, и можно вернуться к выбору маршрута",
        image: {
          src: colorArtwork.src,
          alt: "История завершена, и можно вернуться к выбору маршрута",
          caption:
            "Последнее окно эпилога станет точкой выхода обратно на главную страницу.",
        },
        text: "Это финальное окно должно замыкать весь путь и возвращать пользователя на посадочную страницу. Пока оно остаётся заглушкой, но уже занимает своё место в общей narrative-системе.",
        secondaryText:
          "В одном из следующих патчей здесь появится реальный завершающий переход на главный экран.",
      },
    ],
  },
] satisfies NarrativeSequence[]);

export function getNarrativeSequences(): NarrativeSequence[] {
  return [...narrativeSequences].sort((a, b) => a.order - b.order);
}

export function getNarrativeSequence(
  id: string,
): NarrativeSequence | undefined {
  return narrativeSequences.find((sequence) => sequence.id === id);
}

function validateNarrativeSequences(
  records: NarrativeSequence[],
): NarrativeSequence[] {
  assert(
    records.length > 0,
    "narrative: ожидается хотя бы одна последовательность",
  );

  const ids = new Set<string>();
  const orders = new Set<number>();
  const slideIds = new Set<string>();

  records.forEach((record, index) => {
    validateNarrativeSequence(record, index, slideIds);
    assertUnique(ids, record.id, `narrative: дублируется id "${record.id}"`);
    assertUnique(
      orders,
      record.order,
      `narrative: дублируется order "${record.order}" у "${record.id}"`,
    );
  });

  return records;
}

function validateNarrativeSequence(
  record: NarrativeSequence,
  index: number,
  slideIds: Set<string>,
): void {
  const label = record.id || `#${index + 1}`;
  const slideOrders = new Set<number>();

  assertNonEmptyString(record.id, `narrative[${index}]: id обязателен`);
  assert(
    Number.isInteger(record.order) && record.order > 0,
    `narrative "${label}": order должен быть положительным целым числом`,
  );
  assertNonEmptyString(
    record.eyebrow,
    `narrative "${label}": eyebrow обязателен`,
  );
  assertNonEmptyString(record.lead, `narrative "${label}": lead обязателен`);
  assert(
    isNarrativeContentStatus(record.contentStatus),
    `narrative "${label}": неизвестный contentStatus "${record.contentStatus}"`,
  );
  assertNonEmptyString(
    record.completionLabel,
    `narrative "${label}": completionLabel обязателен`,
  );
  assertNonEmptyString(
    record.skipLabel,
    `narrative "${label}": skipLabel обязателен`,
  );
  assert(
    isNarrativeCompletionAction(record.completionAction),
    `narrative "${label}": неизвестный completionAction "${record.completionAction}"`,
  );
  assert(
    record.slides.length > 0,
    `narrative "${label}": нужна хотя бы одна карточка`,
  );

  record.slides.forEach((slide, slideIndex) => {
    const slideLabel = `${label}/${slide.id || `#${slideIndex + 1}`}`;

    assertNonEmptyString(slide.id, `narrative "${label}": slide.id обязателен`);
    assertUnique(
      slideIds,
      slide.id,
      `narrative: дублируется slide id "${slide.id}"`,
    );
    assertUnique(
      slideOrders,
      slide.order,
      `narrative "${label}": дублируется slide.order "${slide.order}"`,
    );
    assert(
      Number.isInteger(slide.order) && slide.order > 0,
      `narrative "${slideLabel}": order должен быть положительным целым числом`,
    );
    assert(
      slide.meta.length > 0,
      `narrative "${slideLabel}": meta должен содержать хотя бы одно значение`,
    );
    slide.meta.forEach((item, metaIndex) => {
      assertNonEmptyString(
        item,
        `narrative "${slideLabel}": meta[${metaIndex}] обязателен`,
      );
    });
    assertNonEmptyString(
      slide.title,
      `narrative "${slideLabel}": title обязателен`,
    );
    assertNonEmptyString(
      slide.image.src,
      `narrative "${slideLabel}": image.src обязателен`,
    );
    assertNonEmptyString(
      slide.image.alt,
      `narrative "${slideLabel}": image.alt обязателен`,
    );
    assertNonEmptyString(
      slide.image.caption,
      `narrative "${slideLabel}": image.caption обязателен`,
    );
    assertNonEmptyString(
      slide.text,
      `narrative "${slideLabel}": text обязателен`,
    );
    assertNonEmptyString(
      slide.secondaryText,
      `narrative "${slideLabel}": secondaryText обязателен`,
    );
  });
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
