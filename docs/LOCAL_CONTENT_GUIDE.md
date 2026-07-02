# Local content guide

Временная инструкция для обновления локального контента в Astro-контуре до
подключения CMS или внешнего content source. Сейчас данные лежат в TypeScript
файлах, проходят runtime/build-time валидацию и читаются UI только через
`src/data/repository.ts`.

Не меняйте компоненты ради правки контента. Если нужно изменить работу, серию,
narrative или hotspot, начинайте с файлов в `src/data/` и сверяйте типы в
`src/types/`.

## Быстрый маршрут

| Задача                       | Где менять                                                               | Что проверить                                |
| ---------------------------- | ------------------------------------------------------------------------ | -------------------------------------------- |
| Добавить или изменить работу | `src/data/artworks.ts`, при новой серии ещё `src/data/series.ts`         | `npm.cmd run test:unit`, затем нужный route  |
| Изменить статус или цену     | `availability`, `priceType`, `price` в `src/data/artworks.ts`            | `/works/`, `/archive/`, страница работы      |
| Добавить серию               | `src/data/series.ts`, ссылки работ через `getSeriesRefById(...)`         | `/series/{slug}/` и карточки работ           |
| Изменить narrative           | `src/data/narrative.ts`, маршруты в `src/data/narrative-routes.ts`       | `/experience/story/{sequence}/`              |
| Добавить hotspot             | `src/data/hotspots.ts`                                                   | `/experience/details/`                       |
| Добавить изображение         | `src/assets/images/...`, импорты data-файла, `src/utils/image-assets.ts` | `npm.cmd run test:unit`, `npm.cmd run build` |
| Проверить всё перед сдачей   | `npm.cmd run verify`                                                     | Все gates должны пройти                      |

## Общие правила локальных данных

- `id` должен быть стабильным внутренним ключом. Не переименовывайте его без
  проверки всех ссылок.
- `slug` должен быть lowercase kebab-case: `dor-3518`, `winter-yard`.
- `order` должен быть положительным целым числом и не должен повторяться внутри
  коллекции.
- Видимый интерфейс остаётся на русском языке.
- Не меняйте цены, статусы, факты о работах и тексты атрибуции без отдельного
  редакционного решения.
- Изображения в данных должны ссылаться на импортированные Astro assets через
  `.src`, а не на строковый путь, введённый вручную.
- После изменения данных запускайте минимум `npm.cmd run test:unit`; перед
  сдачей задачи запускайте `npm.cmd run verify`.

## Работы каталога

Источник: `src/data/artworks.ts`. Типы: `src/types/artwork.ts`.

Обязательные поля работы:

- `id` и `slug` — уникальные lowercase kebab-case значения;
- `title`, `year`, `technique`, `dimensions.label`;
- `series` — `getSeriesRefById("series-id")` или `null`;
- `images` — минимум одно изображение и одно `role: "primary"`;
- `priceType` — `fixed` или `request`;
- `price` — строка для `fixed`, строго `null` для `request`;
- `availability` — `available`, `reserved` или `sold`;
- `shortDescription`, `fullDescription`, `featured`, `order`.

Статус влияет на витрины:

- `available` и `reserved` попадают в `/works/`;
- `sold` попадает в `/archive/`;
- detail-страница `/works/{slug}/` создаётся для всех работ.

При добавлении работы:

1. Положите web-изображение в `src/assets/images/works/`.
2. Добавьте импорт изображения в `src/data/artworks.ts`.
3. Добавьте asset в `productionImageAssets` в `src/utils/image-assets.ts`.
4. Добавьте объект работы в массив `artworks`.
5. Если работа относится к новой серии, сначала добавьте серию в
   `src/data/series.ts`.
6. Запустите `npm.cmd run test:unit`.

## Статус и цена

Для фиксированной цены используйте:

```ts
priceType: "fixed",
price: "420 000 ₽",
```

Для цены по запросу используйте:

```ts
priceType: "request",
price: null,
```

Нельзя оставлять строковую цену при `priceType: "request"` или `null` при
`priceType: "fixed"`: валидация остановит проверку.

Доступные статусы и подписи задаются в `artworkAvailabilityLabels`:

- `available` — «Доступна»;
- `reserved` — «Зарезервирована»;
- `sold` — «Продана».

## Серии

Источник: `src/data/series.ts`. Типы: `src/types/series.ts`.

Серия содержит `id`, `slug`, `title`, `description`, `cover`, `order` и
опциональный `seo`. `cover` может быть `null`, но если обложка есть, у неё
обязательны `src` и `alt`.

При добавлении серии:

1. Добавьте объект в массив `series`.
2. Убедитесь, что `id`, `slug` и `order` не повторяются.
3. Если у серии новая обложка, добавьте изображение в image registry.
4. В работах используйте `series: getSeriesRefById("new-series-id")`.
5. Проверьте `/series/{slug}/` после сборки или в dev.

Не копируйте вручную `{ id, slug, title }` в работу, если можно использовать
`getSeriesRefById(...)`: так связь останется синхронизированной с источником
серий.

## Narrative

Источники: `src/data/narrative.ts` и `src/data/narrative-routes.ts`. Типы:
`src/types/narrative.ts` и `src/types/narrative-route.ts`.

Каждая sequence содержит:

- `id`, `order`, `contentStatus`;
- `eyebrow`, `lead`, `completionLabel`, `skipLabel`;
- `completionAction`;
- `slides` с уникальными `id`, `order`, `meta`, `title`, `image`, `text`,
  `secondaryText`.

`contentStatus` может быть `placeholder`, `review` или `approved`.
`completionAction` может быть `landing`, `experience`, `explore` или `light`.

Если добавляется новая sequence или меняется её `id`, обновите
`src/data/narrative-routes.ts`: каждая sequence должна иметь один canonical URL
и корректный `completionPath`. Пути должны начинаться с `/`, заканчиваться `/`
и не содержать query/hash.

## Hotspots

Источник: `src/data/hotspots.ts`. Типы: `src/types/hotspot.ts`.

Hotspot содержит:

- `id` и `order`;
- `image.src` и `image.alt`;
- `position.x` и `position.y` от `0` до `1`;
- `targetScale` больше `0`;
- `label`, `title`, `text`.

Координаты считаются относительно изображения: `x: 0` — левый край,
`x: 1` — правый край, `y: 0` — верх, `y: 1` — низ. После добавления точки
проверьте `/experience/details/` на desktop и mobile: точка должна попадать в
смысловую область, открывать dialog и корректно центрироваться.

## Изображения

Инвентаризация текущих production-файлов находится в
`docs/IMAGE_INVENTORY.md`.

Правила:

- production web-ассеты лежат в `src/assets/images/`;
- работы каталога — в `src/assets/images/works/`;
- интерактивы — в `src/assets/images/interactive/`;
- имена файлов: lowercase kebab-case, без пробелов;
- не импортируйте master/original-файлы напрямую в UI;
- при добавлении production-изображения обновите
  `src/utils/image-assets.ts`, иначе `validateContentLinks` остановит
  `test:unit`, `build` или `verify`.

Если изображение используется и в legacy baseline, дополнительно проверьте
строковые ссылки в `index_masterskaya.html`; до FRT-062 legacy остаётся
источником текущей полнофункциональной правды.

## Проверки

Минимальная проверка после изменения локального контента:

```powershell
npm.cmd run test:unit
```

Она компилирует data/repository-зависимости и запускает
`tests/data-contract.test.mjs`, где проверяются связи контента.

Полная проверка перед сдачей:

```powershell
npm.cmd run verify
```

`verify` запускает typecheck, lint, unit-тесты, format-check, production build,
performance budget и browser smoke по `dist/`.

При ошибке в данных смотрите текст исключения: проверки указывают коллекцию,
запись и проблемное поле, например `artworks "dor-3518" images[0].src` или
`content links: narrative "intro" route is missing`.
