# Project map

Краткая навигация по репозиторию для будущих сессий Codex.  
Сначала читать этот файл, затем открывать только указанные файлы по задаче.

## 1. Проект

Интерактивный сайт о творчестве Ивана Кугача: главная в образе мастерской, сюжетные переходы, три интерактива с картинами и каталог работ.

Текущая поддерживаемая версия — многостраничный Astro frontend в `src/`, который собирается в статический `dist/`.

Исторический proof-of-concept сохранён в `archive/index_masterskaya.html` как legacy-reference после FRT-062. Он не участвует в production build и не является источником новых продуктовых изменений.

## 2. Стек

| Область     | Сейчас                                                     | План                                                     |
| ----------- | ---------------------------------------------------------- | -------------------------------------------------------- |
| Разметка    | Astro pages/components                                     | Поддерживаемый Astro production-контур                   |
| Стили       | Раздельные CSS tokens/global/component styles              | Развитие дизайн-системы без монолита                     |
| Логика      | TypeScript и изолированные клиентские модули               | Дальнейшая изоляция интерактивов                         |
| Роутинг     | Astro имеет 13 route patterns и 20 static pages            | Полная файловая карта Astro                              |
| Данные      | Типизированные локальные данные с заменяемым CMS-адаптером | Будущий CMS/build-time адаптер                           |
| Сборка      | Astro dev, build и production preview                      | Astro production build                                   |
| Тесты       | `test:unit` для чистой математики color reveal и zoom/pan  | Полный unit-контур, content checks и browser smoke tests |
| Backend/API | Нет                                                        | Вне текущего frontend-этапа                              |

## 3. Входные точки

| Путь                                                       | Роль                                                                     | Когда открывать                                                               |
| ---------------------------------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| `AGENTS.md`                                                | Обязательные правила работы будущих сессий Codex                         | Автоматически учитывать до исследования и изменений                           |
| `src/pages/index.astro`                                    | Единственная поддерживаемая исходная главная Astro route `/`             | Изменение главной, CTA и входов в пользовательские маршруты                   |
| `archive/index_masterskaya.html`                           | Архивный legacy-reference после FRT-062                                  | Только историческая сверка поведения или визуального baseline                 |
| `package.json`                                             | Зависимости и доступные npm-команды Astro, включая `@astrojs/sitemap`    | Запуск и настройка инструментов                                               |
| `.gitattributes`                                           | Единые LF-окончания строк и binary-исключения                            | При ложных Git-изменениях или настройке редактора                             |
| `astro.config.mjs`                                         | Статическая Astro-сборка, `site`, sitemap-интеграция и фильтры dev-URL   | Изменение режима сборки, SEO-файлов или интеграций                            |
| `tsconfig.json`                                            | Строгая TypeScript-конфигурация                                          | Изменение правил типов и области проверки                                     |
| `src/pages/artist.astro`                                   | Страница художника: контекст, цитата и связанные подборки                | Изменение биографической композиции и её responsive-layout                    |
| `src/pages/experience/index.astro`                         | Landing маршрута: порядок трёх этапов и прямые входы                     | Изменение последовательности, описаний и CTA интерактивного опыта             |
| `src/pages/experience/color-return.astro`                  | Продуктовая страница интерактива возвращения цвета                       | Canvas-stage, HUD, reset, completion dialog и переход к `bridge`              |
| `src/pages/experience/details.astro`                       | Продуктовая страница исследования деталей                                | Zoom/pan viewport, hotspots, progress, dialogs и переход к `lightBridge`      |
| `src/pages/experience/light.astro`                         | Продуктовая страница интерактива света                                   | Stage, selector, range, progress, dialog и переход к `finale`                 |
| `src/pages/experience/story/[sequence].astro`              | Generated-страницы четырёх narrative-блоков                              | Изменение композиции story-страницы и связи с route-contract                  |
| `src/pages/works/index.astro`                              | Каталог доступных работ и frontend-форма интереса                        | Изменение композиции каталога, CTA карточек, формы и разделения статусов      |
| `src/pages/works/[slug].astro`                             | Generated-страница работы с предвыбранной формой интереса                | Изменение detail-layout, параметров, CTA заявки, галереи и связи с серией     |
| `src/pages/archive/index.astro`                            | Отдельный архив проданных работ с CTA к похожим произведениям            | Изменение archive-layout, пустого состояния и CTA                             |
| `src/pages/series/[slug].astro`                            | Generated-витрина серии из локальных данных и связанных работ            | Изменение описания серии, cover/fallback, списка работ и пустого состояния    |
| `src/pages/404.astro`                                      | Оформленная 404 и контекст неизвестных работ или серий                   | Изменение fallback-навигации и текстов ненайденных маршрутов                  |
| `src/pages/ui-preview.astro`                               | Техническая проверка common UI, dialog, narrative, canvas и zoom/hotspot | Ручная проверка переиспользуемых модулей до продуктового подключения          |
| `src/components/experience/ColorRevealExperience.astro`    | Продуктовый UI интерактива возвращения цвета                             | Stage, HUD, progress, reset, подсказка и dialog завершения                    |
| `src/components/experience/DetailsExplorer.astro`          | Продуктовый UI исследования деталей                                      | Рама, viewport, data-driven hotspots, zoom HUD, progress и dialogs            |
| `src/components/experience/LightWorkshop.astro`            | Продуктовый UI мастерской света                                          | Картина, visual layers, selector, range, note, progress и completion dialog   |
| `src/components/experience/ColorRevealEnginePreview.astro` | Технический canvas-стенд FRT-031                                         | Ручная проверка paint, progress, remount, reset и destroy                     |
| `src/components/experience/ZoomPanEnginePreview.astro`     | Технический стенд zoom/pan и hotspot-данных FRT-034/FRT-035              | Ручная проверка buttons, wheel, drag, reset, remount, destroy и dialog        |
| `src/components/narrative/NarrativeSequence.astro`         | Универсальный UI narrative-последовательности                            | Изменение разметки слайда, счётчика и кнопок без встраивания story-контента   |
| `src/scripts/color-reveal-engine.ts`                       | Изолированный Canvas/Pointer-движок возвращения цвета                    | Кисть, coverage, resize, auto-reveal, callbacks и lifecycle                   |
| `src/scripts/color-reveal-page.ts`                         | Инициализация продуктовой страницы возвращения цвета                     | Подключение движка, progress, reset, dialog и pagehide cleanup                |
| `src/scripts/color-reveal-preview.ts`                      | Инициализация технического стенда canvas engine                          | Только `/ui-preview/`; не продуктовая страница интерактива                    |
| `src/scripts/dialog-controller.ts`                         | Единый доступный контроллер нативных dialog                              | showModal/close, trap focus, Escape, backdrop, возврат фокуса и cleanup       |
| `src/scripts/dialog-preview.ts`                            | Инициализация dialog-примера на `/ui-preview/`                           | Только `/ui-preview/`; ручная keyboard-проверка общего dialog-механизма       |
| `src/utils/color-reveal-progress.ts`                       | Чистая математика coverage grid для интерактива раскрытия                | Progress, reset, completion threshold и граничные координаты кисти            |
| `src/scripts/zoom-pan-engine.ts`                           | Изолированный DOM-движок zoom/pan для исследования деталей               | Buttons, wheel, pointer drag, fit/reset, bounds и lifecycle                   |
| `src/scripts/details-explorer-page.ts`                     | Инициализация продуктовой страницы исследования деталей                  | Hotspots, keyboard, progress, dialogs, completion и pagehide cleanup          |
| `src/scripts/zoom-pan-preview.ts`                          | Инициализация технического стенда zoom/pan и hotspot-поведения           | Только `/ui-preview/`; viewed IDs, центрирование точки и dialog               |
| `src/scripts/light-controller.ts`                          | Изолированный state-controller интерактива света                         | Active work/state, range, viewed progress, reset, completion и destroy        |
| `src/scripts/light-workshop-page.ts`                       | Инициализация продуктовой страницы света                                 | DOM render, selector/range events, dialog, reset и pagehide cleanup           |
| `src/utils/zoom-pan.ts`                                    | Чистая математика zoom/pan                                               | Fit, bounds, clamp, zoom-at-focus, pan и center-on                            |
| `src/utils/structured-data.ts`                             | JSON-LD helpers для schema.org                                           | Person/VisualArtwork для страниц работ без неподтверждённых атрибутов         |
| `src/scripts/narrative-sequence.ts`                        | Изолированное DOM-управление narrative-компонентом                       | Переключение слайдов, клавиатура и события завершения/пропуска                |
| `src/scripts/narrative-route.ts`                           | Связь narrative-событий с completionPath через location.replace          | Изменение финального перехода и browser history                               |
| `src/data/narrative-routes.ts`                             | Валидируемый контракт URL и browser history narrative-маршрута           | Изменение порядка переходов, completionPath или канонических story URL        |
| `src/data/artist-page.ts`                                  | Временный типизированный контент страницы художника                      | Замена текстов, тем и связанных подборок без изменения layout                 |
| `src/data/repository.ts`                                   | Frontend-репозиторий данных и фасад над local-источниками                | Основная точка чтения данных из UI; место будущего CMS/build-time адаптера    |
| `src/data/content-links.ts`                                | Build-time gate контентных связей и production-ассетов                   | Проверки ID/slug, image registry, series, narrative routes и hotspot ID       |
| `src/data/artworks.ts`                                     | Локальный типизированный источник пяти работ каталога                    | Изменение данных работ, slug, статусов, цен и временных атрибутов             |
| `src/data/series.ts`                                       | Локальный типизированный источник серий                                  | Изменение серий, stable ID, slug, cover и связи с работами                    |
| `src/data/narrative.ts`                                    | Локальный типизированный источник narrative-блоков                       | Изменение story-слайдов, текстов, изображений и completionAction              |
| `src/data/hotspots.ts`                                     | Локальный типизированный источник hotspot-точек                          | Изменение точек деталей, координат, масштаба и поясняющих текстов             |
| `src/data/light.ts`                                        | Локальный типизированный источник работ и состояний света                | Изменение картин, порядка, подписей, CSS-параметров и начального состояния    |
| `src/types/artwork.ts`                                     | Канонический TypeScript-контракт произведения                            | Перед переносом данных работ, карточек, страниц работ и серий                 |
| `src/types/color-reveal.ts`                                | Контракты options, lifecycle, phase и progress canvas engine             | Подключение движка к UI без page-global состояния                             |
| `src/types/zoom-pan.ts`                                    | Контракты состояния, bounds и options zoom/pan engine                    | Подключение исследовательского интерактива без глобального состояния          |
| `src/types/inquiry.ts`                                     | Контракты payload, ошибок, состояний и адаптера формы                    | Изменение frontend-формы и будущего интерфейса отправки                       |
| `src/types/series.ts`                                      | Канонический TypeScript-контракт серии                                   | Перед переносом страниц серий, связей работ и будущего CMS-адаптера           |
| `src/types/narrative.ts`                                   | TypeScript-контракт narrative-последовательностей                        | Перед переносом narrative UI и маршрутов между этапами                        |
| `src/types/narrative-route.ts`                             | TypeScript-контракт URL, входов и history actions narrative              | Изменение структуры route-definition                                          |
| `src/types/hotspot.ts`                                     | TypeScript-контракт hotspot-точек исследовательского интерактива         | Перед переносом zoom/pan и карточек точек                                     |
| `src/types/light.ts`                                       | Контракты данных, snapshot и lifecycle контроллера света                 | Изменение работ, состояний, callbacks или controller API                      |
| `src/layouts/BaseLayout.astro`                             | Общий layout новой версии с навигацией, metadata и optional-декором      | Общая оболочка Astro-страниц                                                  |
| `src/components/common/PageMetadata.astro`                 | Единый компонент `<head>` metadata: title, canonical, OG, social, robots | Изменение SEO-основы страниц и безопасных значений по умолчанию               |
| `src/README.md`                                            | Правила структуры, именования и границ модулей                           | Перед созданием новых Astro/TypeScript-файлов                                 |
| `README.md`                                                | Краткое описание продукта, маршрута, ассетов и способа запуска           | Первичная ориентация и проверка актуальной точки входа                        |
| `docs/PROJECT_MAP.md`                                      | Навигация по проекту                                                     | Всегда первой в новой сессии                                                  |
| `docs/Frontend_Rebuild_Backlog.md`                         | План миграции в Astro, задачи `FRT-001`–`FRT-062`                        | Работа над технической переработкой                                           |
| `docs/LOCAL_CONTENT_GUIDE.md`                              | Временная инструкция по локальным данным до CMS                          | Перед изменением работ, серий, narrative, hotspots или production-ассетов     |
| `docs/QA_CHECKLIST.md`                                     | Последовательный ручной QA-checklist FRT-061                             | Перед release-проверкой, FRT-062 и после изменений пользовательских сценариев |
| `docs/LEGACY_MIGRATION_CHECKLIST.md`                       | Карта экранов, переходов, состояний и форм legacy-прототипа              | Перед переносом или проверкой любого работающего сценария                     |
| `docs/NARRATIVE_ROUTE_CONTRACT.md`                         | Решение по URL, direct entry, completion и browser Back                  | Перед подключением narrative-страниц и completion-переходов                   |
| `docs/VISUAL_BASELINE.md`                                  | Индекс desktop/mobile PNG и допустимых отличий Astro-версии              | Перед визуальным переносом и regression-сравнением                            |
| `docs/ENTRYPOINT_CUTOVER_PLAN.md`                          | Статусы точек входа, gates FRT-062 и порядок архивации legacy            | При вопросах о production entry, cutover или rollback                         |
| `docs/Prototype_Functional_Description.md`                 | Более подробное описание исторически реализованных сценариев             | Когда нужно понять ожидаемое поведение прототипа; сверять с кодом             |

Запуск Astro-проекта: `npm.cmd install`, затем `npm.cmd run dev`.

Проверки и production-сборка: `npm.cmd run verify`. Отдельно доступны `check`, `lint`, `test:unit`, `test:smoke`, `test:smoke:dist`, `performance:budget`, `format`, `format:check`, `build` и `preview`.

ESLint проверяет Astro/TypeScript-код, unit-тесты, служебные scripts и корневые конфиги. `test:unit` компилирует DOM-independent utilities для color reveal и zoom/pan во временный каталог и запускает оба Node test suites. `test:smoke` выполняет production build и запускает browser smoke, а `test:smoke:dist` поднимает локальный static-сервер уже собранного `dist/` и проходит smoke-сценарии без backend. `performance:budget` и `test:smoke:dist` проверяют production `dist/` после `build` и входят в `verify`. Prettier форматирует Astro, TypeScript, тесты, scripts, CSS, JSON и активную Markdown-документацию. Архивный legacy HTML, архивы, эксперименты и generated output исключены.

Запуск архивного legacy-reference: открыть `archive/index_masterskaya.html` в браузере.

## 4. Основные директории

| Директория                    | Содержимое                                                     | Статус                                                                                               |
| ----------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `src/`                        | Astro-код и изображения production frontend                    | Актуальная исходная директория; правила в `src/README.md`                                            |
| `src/assets/`                 | Импортируемые Astro web-ассеты                                 | `images/works` и `images/interactive` содержат production web-изображения FRT-044                    |
| `src/components/`             | Повторно используемые Astro-компоненты                         | Навигация, common UI, works-, narrative-, experience-компоненты и декор                              |
| `src/content/`                | Записи Astro Content Collections                               | Пустой каркас                                                                                        |
| `src/data/`                   | Типизированные локальные данные и frontend-репозиторий         | `repository.ts` читает local-источники и запускает `content-links.ts` как build-time gate            |
| `src/layouts/`                | Общие Astro-layouts                                            | `BaseLayout.astro`: metadata, skip-link и page slots                                                 |
| `src/pages/`                  | Файловые маршруты Astro                                        | Главная, художник, experience/story, каталог, архив, generated-страницы, 404 и `/ui-preview/`        |
| `src/scripts/`                | Изолированные клиентские DOM/Canvas/state-модули               | Форма, narrative, canvas/zoom-pan engines и контроллер света                                         |
| `src/styles/`                 | Токены и общие CSS-слои                                        | `global.css`, `tokens.css` и опциональный `studio.css`                                               |
| `src/types/`                  | Общие TypeScript-контракты                                     | Модели данных, narrative, hotspots, свет, canvas engine и zoom/pan                                   |
| `src/utils/`                  | Чистые helpers и адаптеры                                      | Валидация заявки, coverage grid, zoom/pan math, JSON-LD helpers и frontend-only `inquiry-adapter.ts` |
| `scripts/`                    | Служебные Node-скрипты                                         | `check-performance-budget.mjs` проверяет static budget, `browser-smoke.mjs` проходит Chromium smoke  |
| `tests/`                      | Unit-тесты чистой frontend-логики                              | Покрывает coverage, zoom/pan math и lifecycle контроллера света                                      |
| `public/`                     | Статические файлы без обработки Astro                          | `robots.txt` для crawler rules и `favicon.svg` для общей оболочки                                    |
| `docs/`                       | Требования, описание прототипа, дизайн-планы и frontend-бэклог | Читать выборочно по задаче                                                                           |
| `docs/LOCAL_CONTENT_GUIDE.md` | Инструкция по правке локального контента до подключения CMS    | Открывать перед изменением `src/data/*`, новых изображений и content links                           |
| `docs/IMAGE_INVENTORY.md`     | Инвентаризация production-изображений и ожидаемых вариантов    | Открывать перед задачами по image pipeline, SEO social image и визуальному QA                        |
| `docs/PERFORMANCE_BUDGET.md`  | Проверяемые лимиты первой загрузки, LCP и Lighthouse-ориентиры | Открывать перед задачами по производительности, image pipeline и visual QA                           |
| `docs/QA_CHECKLIST.md`        | Последовательный ручной QA-checklist Astro production preview  | Открывать перед release-проходом и после изменений маршрутов или интерактивов                        |
| `docs/QA_VIEWPORTS.md`        | Целевые размеры viewport и страницы для ручного visual QA      | Открывать перед FRT-052, FRT-053 и FRT-054                                                           |
| `docs/visual-baseline/`       | Эталонные PNG актуального legacy-прототипа                     | Использовать для visual regression; не менять вручную                                                |
| `experiments/`                | Самостоятельные HTML-эксперименты дизайна и механик            | Не production; только визуальные/исторические референсы                                              |
| `archive/`                    | Старые версии HTML, changelog и bug notes                      | История; не источник текущего поведения                                                              |
| `scrns/`                      | Старые скриншоты                                               | Визуальный референс, не код                                                                          |

Image pipeline FRT-045:

- `src/components/common/OptimizedImage.astro` — AVIF/WebP, responsive-профили,
  intrinsic-размеры, lazy loading и hero priority;
- `src/utils/image-assets.ts` — реестр production-изображений, который связывает
  URL из типизированных данных с Astro image metadata.

Local content FRT-060:

- `docs/LOCAL_CONTENT_GUIDE.md` — временная инструкция до CMS: как добавлять
  работы, менять статусы и цены, добавлять серии, narrative, hotspots и
  production-изображения;
- локальные данные правятся в `src/data/*`, UI читает их через
  `src/data/repository.ts`, а связи проверяет `src/data/content-links.ts`.

Performance budget FRT-047:

- `docs/PERFORMANCE_BUDGET.md` — допустимый вес первой загрузки, LCP image
  limits, mobile throttling и Lighthouse-ориентиры;
- `scripts/check-performance-budget.mjs` — static gate по `dist/` для главной,
  каталога и трёх интерактивов;
- `npm.cmd run performance:budget` — отдельная проверка после `npm.cmd run build`;
  `npm.cmd run verify` запускает её автоматически.

Browser smoke FRT-056:

- `scripts/browser-smoke.mjs` — Playwright smoke-набор для production `dist/`:
  главная, каталог, detail работы, форма, три интерактива и dialog-состояния;
- `npm.cmd run test:smoke` — одна команда для сборки, локального static-сервера и
  Chromium-проверки без backend или внешних сервисов.
- `npm.cmd run test:smoke:dist` — smoke-проверка уже собранного `dist/`; эта
  команда используется внутри `npm.cmd run verify` после production build и
  performance budget.

Manual QA FRT-061:

- `docs/QA_CHECKLIST.md` — последовательный ручной проход по production preview,
  маршрутам, каталогу, detail-странице, narrative, трём интерактивам, dialogs,
  форме, keyboard navigation, viewport sweep и консоли;
- чеклист опирается на `docs/QA_VIEWPORTS.md` для размеров и на
  `docs/VISUAL_BASELINE.md` для визуального сравнения с legacy.

Visual QA FRT-051:

- `docs/QA_VIEWPORTS.md` — целевые размеры `1440x900`, `1180x760`,
  `820x1180`, `390x844` и `360x800`, а также основные страницы для
  ручной проверки оболочки, контента, narrative и трёх интерактивов.

Visual QA FRT-052:

- оболочка и контентные страницы прошли 31 сочетание route/viewport без
  горизонтального overflow и ошибок консоли; покрытие и representative
  визуальная проверка записаны в `docs/QA_VIEWPORTS.md`;
- общий layout подключает `public/favicon.svg`, чтобы прямые входы не создавали
  ошибку запроса `/favicon.ico`.

## 5. Историческая карта legacy-экрана

Эти блоки находятся в `archive/index_masterskaya.html` и нужны только для
исторической сверки после FRT-062. Текущие продуктовые изменения выполняются в
Astro-контуре `src/`.

| Экран/фича           | Разметка / данные                                                                      | Основная логика                                                               | Что учитывать                                              |
| -------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Главная мастерской   | `#landingScreen`, около строки 2451                                                    | `goToLanding`, CTA listeners в конце script                                   | Содержит входы во все сценарии                             |
| Возвращение цвета    | `#experienceScreen`, около строки 2618                                                 | `fitCanvasToImage`, paint/coverage, `autoCompletePainting`, `resetExperience` | Canvas, pointer events, resize и completion тесно связаны  |
| Narrative            | `#narrativeScreen`, около строки 2655; `NARRATIVE_SEQUENCES` около 3408                | `renderNarrativeSlide`, `openNarrativeSequence`, `completeNarrativeSequence`  | Связывает этапы общего маршрута                            |
| Приблизить детали    | `#exploreScreen`, около строки 2708; `HOTSPOTS` около 3545                             | zoom/pan functions, `fitExploreView`, hotspot activation                      | Математика зависит от viewport и natural image size        |
| Интерактив света     | `#lightScreen`, около строки 2753; `LIGHT_WORKS` около 3245; `LIGHT_STATES` около 3265 | `updateLightState`, work selection, completion tracking                       | Изображение, range и просмотренные состояния связаны       |
| Каталог и архив      | `#salesScreen`, около строки 2811; `SALES_WORKS` около 3331                            | `renderSalesCatalog`, detail modal, form preparation                          | Карточки, серии, select и архив строятся из одного массива |
| Формы интереса       | `#salesInquiryForm` около 2915; `#salesOrderForm` около 3077                           | `submitSalesForm` около 3839                                                  | Только frontend-валидация; данные не отправляются          |
| Модальные окна       | После основного `<main>`, перед `<script>`                                             | `syncModalState`, функции open/close, общий Escape handler                    | Несколько модалок делят `body.modal-active`                |
| Переключение экранов | Все `.screen` в одном DOM                                                              | `showScreen` около 3959; `goTo*` около 4022–4076                              | URL и browser history не меняются                          |

## 6. Данные, состояние и API

| Область              | Где находится                                    | Текущее устройство                                               |
| -------------------- | ------------------------------------------------ | ---------------------------------------------------------------- |
| Каталог работ        | `SALES_WORKS` в `archive/index_masterskaya.html` | Локальный JS-массив: изображения, цена, статус, серия и описания |
| Статусные подписи    | `SALES_STATUS_LABELS`                            | Маппинг `available/reserved/sold` на русский UI                  |
| Narrative            | `NARRATIVE_SEQUENCES`                            | Объект последовательностей `intro`, `bridge`, `finale`           |
| Hotspots             | `HOTSPOTS`                                       | Массив координат, подписей, текста и масштаба                    |
| Свет                 | `LIGHT_WORKS`, `LIGHT_STATES`                    | Локальные конфигурации картин и состояний освещения              |
| Canvas bounds        | `ART_BOUNDS`                                     | Базовая геометрия интерактива раскрытия                          |
| Runtime state        | Набор `let` после конфигурационных констант      | Глобальное состояние paint, zoom, hotspots, light и narrative    |
| Постоянное состояние | Отсутствует                                      | Нет `localStorage`, cookies или базы                             |
| API                  | Отсутствует                                      | Нет `fetch`, backend или реальной отправки формы                 |

Для будущей миграции данных начинать с EPIC F5 в `docs/Frontend_Rebuild_Backlog.md`, особенно `FRT-018`–`FRT-022`.

## 7. Стили и дизайн-система

| Зона                  | Где искать                                                 | Примечание                                                                |
| --------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------- |
| Astro navigation      | `src/components/SiteNavigation.astro`                      | Обычные ссылки, active state и mobile layout                              |
| Astro home page       | `src/pages/index.astro`                                    | Hero, четыре launch-card и три fact-блока                                 |
| Astro artist page     | `src/pages/artist.astro`                                   | Редакционное досье; контент в `src/data/artist-page.ts`                   |
| Astro works page      | `src/pages/works/index.astro`                              | Каталог доступных работ и форма интереса                                  |
| Astro archive page    | `src/pages/archive/index.astro`                            | Отдельный архив проданных работ и CTA к похожим произведениям             |
| Astro work detail     | `src/pages/works/[slug].astro`                             | Страница работы: изображение, параметры, описание, CTA и галерея          |
| Astro narrative       | `src/pages/experience/story/[sequence].astro`              | Четыре generated story-страницы из route-contract                         |
| Astro color reveal    | `src/pages/experience/color-return.astro`                  | Продуктовый canvas-интерактив FRT-032                                     |
| Astro details         | `src/pages/experience/details.astro`                       | Продуктовый zoom/pan и hotspot-интерактив FRT-036                         |
| Astro light           | `src/pages/experience/light.astro`                         | Продуктовый интерактив света FRT-040                                      |
| Common Astro UI       | `src/components/common/`                                   | Actions, metadata, headers, artwork, forms, dialog, state                 |
| Narrative Astro UI    | `src/components/narrative/`                                | Слайды, метаданные, прогресс и действия                                   |
| Color reveal Astro UI | `src/components/experience/ColorRevealExperience.astro`    | Stage, HUD, progress, reset и completion dialog                           |
| Details Astro UI      | `src/components/experience/DetailsExplorer.astro`          | Viewport, hotspots, zoom HUD, progress и два dialog-состояния             |
| Light Astro UI        | `src/components/experience/LightWorkshop.astro`            | Stage, visual layers, selector, range, progress и dialog                  |
| Canvas engine preview | `src/components/experience/ColorRevealEnginePreview.astro` | Технический lifecycle-стенд FRT-031                                       |
| Works Astro UI        | `src/components/works/`                                    | Карточка каталога и переиспользуемая frontend-форма интереса              |
| UI component preview  | `src/pages/ui-preview.astro`                               | Техническая проверка common UI, dialog и интерактивов; не продуктовый URL |
| Studio decoration     | `src/components/StudioDecoration.astro`                    | `aria-hidden` декор, подключаемый через layout                            |
| Studio background     | `src/styles/studio.css`                                    | Тяжёлые слои только для страниц с декором                                 |
| Astro design tokens   | `src/styles/tokens.css`                                    | Палитра, семантические цвета, шкалы и motion                              |
| Astro global styles   | `src/styles/global.css`                                    | Reset, базовая типографика, skip-link и shell                             |
| Legacy-токены         | `:root` в начале `archive/index_masterskaya.html`          | Исторические цвета, тени, поверхности и акценты                           |
| Body и фон мастерской | Начало `<style>`                                           | Многослойные gradients и fixed pseudo-elements                            |
| Legacy-экраны         | `.screen`, `.screen.hidden`                                | Основа архивной псевдонавигации                                           |
| Декор мастерской      | `.studio-props`                                            | `aria-hidden`; широкое влияние на композицию                              |
| Общие панели          | `.hero-panel`, `.workspace`                                | Используются несколькими экранами                                         |
| Narrative             | `.narrative-*`                                             | Карточка, progress и переходы                                             |
| Details explorer      | `.explore-*`, `.hotspot`                                   | Viewport, transforms и hotspot animations                                 |
| Light workshop        | `.light-*`                                                 | Stage, control panel, layers и selectors                                  |
| Каталог               | `.sales-*`, `.art-card`, `.price-label`                    | Каталог, архив, detail и forms                                            |
| Модалки               | `.modal`, `.modal-card`                                    | Общая основа всех modal-сценариев                                         |
| Responsive            | `@media` около строк 639, 1279, 2331 и 2360                | Breakpoints `721px`, `960px`, `720px`                                     |

При переработке дизайн-системы начинать с `FRT-009`–`FRT-013`, а не механически копировать весь `<style>`.

## 8. Common tasks → Start here

| Задача                                    | Начать здесь                                                               | Затем проверить                                                    |
| ----------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Изменить Astro-главную или её CTA         | `src/pages/index.astro`                                                    | Все целевые URL и desktop/mobile layout                            |
| Изменить страницу художника или её тексты | `src/pages/artist.astro`, `src/data/artist-page.ts`                        | `/artist/`, изображения, связанные подборки и responsive-layout    |
| Сверить legacy-главную                    | `#landingScreen` в `archive/index_masterskaya.html`                        | Только историческое сравнение с Astro `/`                          |
| Изменить общий визуальный стиль           | `src/styles/`, `src/layouts/BaseLayout.astro`, нужный компонент            | Все основные Astro routes и responsive rules                       |
| Изменить картину/цену/статус              | `src/data/artworks.ts`                                                     | `src/data/repository.ts`, страницы работ, каталог и архив          |
| Изменить форму                            | `src/components/works/InterestForm.astro` и form scripts                   | Валидация, frontend-only подтверждение и generated detail routes   |
| Изменить narrative                        | `src/data/narrative.ts`, `src/data/narrative-routes.ts`                    | Story routes, completionPath и browser history                     |
| Изменить hotspot                          | `src/data/hotspots.ts`, `src/components/experience/DetailsExplorer.astro`  | Hotspot dialog, viewed progress и completion                       |
| Исправить zoom/pan                        | `src/scripts/zoom-pan-engine.ts`, `src/utils/zoom-pan.ts`                  | Wheel, pointer drag, resize и hotspot centering                    |
| Исправить кисть/progress                  | `src/scripts/color-reveal-engine.ts`, `src/utils/color-reveal-progress.ts` | Coverage, completion dialog и reset                                |
| Изменить интерактив света                 | `src/data/light.ts`, `src/scripts/light-controller.ts`                     | Selector, range, progress и completion tracking                    |
| Добавить/заменить изображение             | Соответствующая папка в `src/assets/images/`                               | Image registry, content links и архивные ссылки при необходимости  |
| Исправить mobile layout                   | Responsive rules в конце `<style>`                                         | Главная, каталог и каждый интерактив отдельно                      |
| Проверить завершённый frontend-бэклог     | `docs/Frontend_Rebuild_Backlog.md`                                         | FRT-062 отмечает переключение, новые задачи вести отдельно         |
| Сверить поведение с legacy-reference      | `docs/LEGACY_MIGRATION_CHECKLIST.md`                                       | Точные ID, данные и обработчики в `archive/index_masterskaya.html` |
| Сравнить визуальный результат             | `docs/VISUAL_BASELINE.md`                                                  | PNG нужного экрана в desktop/mobile и modal/completion state       |
| Проверить статус основной точки входа     | `docs/ENTRYPOINT_CUTOVER_PLAN.md`                                          | Astro `/` — исходная главная; `dist/index.html` — generated entry  |
| Понять ожидаемый пользовательский маршрут | `README.md`                                                                | Astro routes, narrative completion и form CTA                      |
| Посмотреть альтернативный дизайн          | Только нужный файл в `experiments/`                                        | Не переносить его как текущую реализацию без явного решения        |

## 9. Опасные зоны

- `archive/index_masterskaya.html` — исторический монолит: не править его как production-код без отдельной архивной задачи.
- Общие layout, metadata и navigation в `src/layouts/BaseLayout.astro` влияют на все страницы.
- `src/data/repository.ts` и `src/data/content-links.ts` связывают локальные данные, маршруты и production-ассеты.
- Клиентские модули интерактивов должны подключаться только на своих routes.
- `src/styles/global.css`, `src/styles/tokens.css` и shared common-компоненты имеют широкий визуальный эффект.
- Изменение ID, slug или статуса в `src/data/*` влияет на generated routes, sitemap, JSON-LD и content checks.
- Пути к изображениям чувствительны к регистру и пробелам в именах файлов.
- Не восстанавливать корневой legacy HTML как альтернативную production-главную.

## 10. Не читать без прямой необходимости

- `experiments/` — много самостоятельных HTML-копий с дублирующимся кодом.
- `archive/` — архивный legacy-reference, старые реализации и исторические заметки.
- `scrns/` — бинарные скриншоты.
- Содержимое крупных файлов в `src/` — изображения не нужно читать как текст.
- `docs/Вводные.md` — большой исходный документ; открывать только для продуктовых требований.
- Старые `docs/CHANGELOG_*.md` — только для истории конкретного решения.
- `docs/Interactive_Storyline_Mechanics_Ideas.md` — идеи, а не текущий контракт.
- `docs/Design_Improvement_Plan.md` — открывать только для дизайн-задач.
- `docs/Artwork_Sales_Page_Requirements.md` и `docs/Artwork_Sales_Page_MVP_Scope.md` — открывать для коммерческого раздела; текущую реализацию сверять с Astro-кодом и локальными данными.

Если после Astro-миграции появятся `node_modules/`, `dist/`, `build/`, `coverage/`, `.astro/` или временные каталоги, не включать их в первичное исследование.

## 11. Минимальный порядок чтения

1. Учесть правила корневого `AGENTS.md`.
2. `docs/PROJECT_MAP.md`.
3. `git status --short` и компактный `rg --files`.
4. Для текущего поведения — `src/README.md`, `package.json`, нужная Astro-страница, layout, компонент, data или script.
5. Для legacy-сверки — только строковые сигнатуры нужной зоны в `archive/index_masterskaya.html`.
6. Соответствующий epic в `docs/Frontend_Rebuild_Backlog.md`, если задача относится к миграции.
7. Один профильный документ из `docs/`, только если кода и карты недостаточно.
