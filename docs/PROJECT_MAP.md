# Project map

Краткая навигация по репозиторию для будущих сессий Codex.  
Сначала читать этот файл, затем открывать только указанные файлы по задаче.

## 1. Проект

Интерактивный сайт о творчестве Ивана Кугача: главная в образе мастерской, сюжетные переходы, три интерактива с картинами и каталог работ.

Текущая полнофункциональная версия — proof-of-concept в одном файле `index_masterskaya.html`. В нём находятся разметка, CSS, данные, состояние и JavaScript всех актуальных экранов.

Рядом создан минимальный Astro-каркас: `package.json`, `astro.config.mjs`, строгий `tsconfig.json`, `src/layouts/BaseLayout.astro` и `src/pages/index.astro`. Новая страница пока служит только технической проверкой запуска и не заменяет legacy-прототип.

## 2. Стек

| Область     | Сейчас                                   | План                                                       |
| ----------- | ---------------------------------------- | ---------------------------------------------------------- |
| Разметка    | Legacy HTML и техническая Astro-страница | Astro pages/components                                     |
| Стили       | Встроенный CSS                           | Раздельные CSS tokens/global/component styles              |
| Логика      | Vanilla JavaScript, DOM API, Canvas API  | TypeScript и изолированные клиентские модули               |
| Роутинг     | Legacy без URL; Astro имеет только `/`   | Файловые маршруты Astro                                    |
| Данные      | Константы внутри `<script>`              | Типизированные локальные данные с заменяемым CMS-адаптером |
| Сборка      | Astro dev, build и production preview    | Astro production build                                     |
| Тесты       | Нет                                      | Unit, content checks и browser smoke tests                 |
| Backend/API | Нет                                      | Вне текущего frontend-этапа                                |

## 3. Входные точки

| Путь                                       | Роль                                                           | Когда открывать                                                   |
| ------------------------------------------ | -------------------------------------------------------------- | ----------------------------------------------------------------- |
| `AGENTS.md`                                | Обязательные правила работы будущих сессий Codex               | Автоматически учитывать до исследования и изменений               |
| `index_masterskaya.html`                   | Единственная актуальная полнофункциональная версия сайта       | Любое изменение текущего UI, сценариев, данных или интерактивов   |
| `package.json`                             | Зависимости и доступные npm-команды Astro                      | Запуск и настройка инструментов                                   |
| `astro.config.mjs`                         | Базовая конфигурация статической Astro-сборки                  | Изменение режима сборки или интеграций                            |
| `tsconfig.json`                            | Строгая TypeScript-конфигурация                                | Изменение правил типов и области проверки                         |
| `src/pages/index.astro`                    | Техническая стартовая страница новой версии                    | Проверка Astro-каркаса                                            |
| `src/layouts/BaseLayout.astro`             | Минимальный HTML-layout новой версии                           | Общая оболочка Astro-страниц                                      |
| `src/README.md`                            | Правила структуры, именования и границ модулей                 | Перед созданием новых Astro/TypeScript-файлов                     |
| `README.md`                                | Краткое описание продукта, маршрута, ассетов и способа запуска | Первичная ориентация и проверка актуальной точки входа            |
| `docs/PROJECT_MAP.md`                      | Навигация по проекту                                           | Всегда первой в новой сессии                                      |
| `docs/Frontend_Rebuild_Backlog.md`         | План миграции в Astro, задачи `FRT-001`–`FRT-062`              | Работа над технической переработкой                               |
| `docs/LEGACY_MIGRATION_CHECKLIST.md`       | Карта экранов, переходов, состояний и форм legacy-прототипа    | Перед переносом или проверкой любого работающего сценария         |
| `docs/VISUAL_BASELINE.md`                  | Индекс desktop/mobile PNG и допустимых отличий Astro-версии    | Перед визуальным переносом и regression-сравнением                |
| `docs/ENTRYPOINT_CUTOVER_PLAN.md`          | Статусы точек входа, gates FRT-062 и порядок архивации legacy  | При вопросах о production entry, cutover или rollback             |
| `docs/Prototype_Functional_Description.md` | Более подробное описание исторически реализованных сценариев   | Когда нужно понять ожидаемое поведение прототипа; сверять с кодом |

Запуск Astro-каркаса: `npm.cmd install`, затем `npm.cmd run dev`.

Проверки и production-сборка: `npm.cmd run verify`. Отдельно доступны `check`, `lint`, `format`, `format:check`, `build` и `preview`.

ESLint проверяет новый Astro/TypeScript-код и корневые конфиги. Prettier форматирует Astro, TypeScript, CSS, JSON и активную Markdown-документацию. Legacy HTML, архивы, эксперименты и generated output исключены.

Запуск полнофункционального legacy-эталона: открыть `index_masterskaya.html` в браузере.

## 4. Основные директории

| Директория                  | Содержимое                                                     | Статус                                                  |
| --------------------------- | -------------------------------------------------------------- | ------------------------------------------------------- |
| `src/`                      | Astro-код и изображения актуального прототипа                  | Новая исходная директория; правила в `src/README.md`    |
| `src/assets/`               | Импортируемые Astro web-ассеты                                 | Пустой каркас; legacy-ассеты будут перенесены позже     |
| `src/components/`           | Повторно используемые Astro-компоненты                         | Навигация, common UI и `StudioDecoration.astro`         |
| `src/content/`              | Записи Astro Content Collections                               | Пустой каркас                                           |
| `src/data/`                 | Типизированные локальные данные                                | Пустой каркас                                           |
| `src/layouts/`              | Общие Astro-layouts                                            | `BaseLayout.astro`: metadata, skip-link и page slots    |
| `src/pages/`                | Файловые маршруты Astro                                        | Основные заглушки и технический `/ui-preview/`          |
| `src/scripts/`              | Изолированные клиентские DOM/Canvas-модули                     | Пустой каркас                                           |
| `src/styles/`               | Токены и общие CSS-слои                                        | `global.css`, `tokens.css` и опциональный `studio.css`  |
| `src/types/`                | Общие TypeScript-контракты                                     | Пустой каркас                                           |
| `src/utils/`                | Чистые helpers и адаптеры                                      | Пустой каркас                                           |
| `public/`                   | Статические файлы без обработки Astro                          | Пустой каркас                                           |
| `src/for_sales/`            | Legacy-изображения каталога работ                              | Временно сохраняет пути монолита                        |
| `src/picture_light_shadow/` | Legacy-изображения интерактива света                           | Временно сохраняет пути монолита                        |
| `docs/`                     | Требования, описание прототипа, дизайн-планы и frontend-бэклог | Читать выборочно по задаче                              |
| `docs/visual-baseline/`     | Эталонные PNG актуального legacy-прототипа                     | Использовать для visual regression; не менять вручную   |
| `experiments/`              | Самостоятельные HTML-эксперименты дизайна и механик            | Не production; только визуальные/исторические референсы |
| `archive/`                  | Старые версии HTML, changelog и bug notes                      | История; не источник текущего поведения                 |
| `scrns/`                    | Старые скриншоты                                               | Визуальный референс, не код                             |

## 5. Ключевые экраны и фичи

Все указанные блоки сейчас находятся в `index_masterskaya.html`.

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

| Область              | Где находится                               | Текущее устройство                                               |
| -------------------- | ------------------------------------------- | ---------------------------------------------------------------- |
| Каталог работ        | `SALES_WORKS` в `index_masterskaya.html`    | Локальный JS-массив: изображения, цена, статус, серия и описания |
| Статусные подписи    | `SALES_STATUS_LABELS`                       | Маппинг `available/reserved/sold` на русский UI                  |
| Narrative            | `NARRATIVE_SEQUENCES`                       | Объект последовательностей `intro`, `bridge`, `finale`           |
| Hotspots             | `HOTSPOTS`                                  | Массив координат, подписей, текста и масштаба                    |
| Свет                 | `LIGHT_WORKS`, `LIGHT_STATES`               | Локальные конфигурации картин и состояний освещения              |
| Canvas bounds        | `ART_BOUNDS`                                | Базовая геометрия интерактива раскрытия                          |
| Runtime state        | Набор `let` после конфигурационных констант | Глобальное состояние paint, zoom, hotspots, light и narrative    |
| Постоянное состояние | Отсутствует                                 | Нет `localStorage`, cookies или базы                             |
| API                  | Отсутствует                                 | Нет `fetch`, backend или реальной отправки формы                 |

Для будущей миграции данных начинать с EPIC F5 в `docs/Frontend_Rebuild_Backlog.md`, особенно `FRT-018`–`FRT-022`.

## 7. Стили и дизайн-система

| Зона                  | Где искать                                  | Примечание                                      |
| --------------------- | ------------------------------------------- | ----------------------------------------------- |
| Astro navigation      | `src/components/SiteNavigation.astro`       | Обычные ссылки, active state и mobile layout    |
| Common Astro UI       | `src/components/common/`                    | Actions, headers, artwork, forms, dialog, state |
| UI component preview  | `src/pages/ui-preview.astro`                | Техническая проверка; не продуктовый URL        |
| Studio decoration     | `src/components/StudioDecoration.astro`     | `aria-hidden` декор, подключаемый через layout  |
| Studio background     | `src/styles/studio.css`                     | Тяжёлые слои только для страниц с декором       |
| Astro design tokens   | `src/styles/tokens.css`                     | Палитра, семантические цвета, шкалы и motion    |
| Astro global styles   | `src/styles/global.css`                     | Reset, базовая типографика, skip-link и shell   |
| Глобальные токены     | `:root` в начале `index_masterskaya.html`   | Цвета, тени, поверхности и акценты              |
| Body и фон мастерской | Начало `<style>`                            | Многослойные gradients и fixed pseudo-elements  |
| Общие экраны          | `.screen`, `.screen.hidden`                 | Основа текущей псевдонавигации                  |
| Декор мастерской      | `.studio-props`                             | `aria-hidden`; широкое влияние на композицию    |
| Общие панели          | `.hero-panel`, `.workspace`                 | Используются несколькими экранами               |
| Narrative             | `.narrative-*`                              | Карточка, progress и переходы                   |
| Details explorer      | `.explore-*`, `.hotspot`                    | Viewport, transforms и hotspot animations       |
| Light workshop        | `.light-*`                                  | Stage, control panel, layers и selectors        |
| Каталог               | `.sales-*`, `.art-card`, `.price-label`     | Каталог, архив, detail и forms                  |
| Модалки               | `.modal`, `.modal-card`                     | Общая основа всех modal-сценариев               |
| Responsive            | `@media` около строк 639, 1279, 2331 и 2360 | Breakpoints `721px`, `960px`, `720px`           |

При переработке дизайн-системы начинать с `FRT-009`–`FRT-013`, а не механически копировать весь `<style>`.

## 8. Common tasks → Start here

| Задача                                    | Начать здесь                                                  | Затем проверить                                                  |
| ----------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------- |
| Изменить текст или CTA главной            | `#landingScreen` в `index_masterskaya.html`                   | Связанные `addEventListener` и переходы `goTo*`                  |
| Изменить общий визуальный стиль           | `:root`, `body`, `.hero-panel`, `.workspace`                  | Все шесть экранов и responsive rules                             |
| Изменить картину/цену/статус              | `SALES_WORKS`                                                 | `renderSalesCatalog`, select формы, detail modal и архив         |
| Изменить форму                            | Разметка двух sales forms                                     | `getSalesFormState`, `validateSalesFormState`, `submitSalesForm` |
| Изменить narrative                        | `NARRATIVE_SEQUENCES`                                         | `renderNarrativeSlide`, completion routes                        |
| Изменить hotspot                          | `HOTSPOTS`                                                    | `ensureExploreHotspots`, `centerExploreOn`, completion count     |
| Исправить zoom/pan                        | `getExploreBounds`, `clampExplorePosition`, `setExploreScale` | Wheel, pointer drag, resize и hotspot centering                  |
| Исправить кисть/progress                  | `ART_BOUNDS`, coverage variables, `fitCanvasToImage`          | `stampCoverage`, `updateProgress`, `autoCompletePainting`, reset |
| Изменить интерактив света                 | `LIGHT_WORKS`, `LIGHT_STATES`                                 | Selector render, `updateLightState`, completion tracking         |
| Добавить/заменить изображение             | Соответствующая папка в `src/`                                | Все строковые ссылки в HTML и массивах данных                    |
| Исправить mobile layout                   | Responsive rules в конце `<style>`                            | Главная, каталог и каждый интерактив отдельно                    |
| Начать Astro-миграцию                     | `docs/Frontend_Rebuild_Backlog.md`, `FRT-001`                 | Не удалять legacy HTML до `FRT-062`                              |
| Зафиксировать поведение перед переносом   | `docs/LEGACY_MIGRATION_CHECKLIST.md`                          | Точные ID, данные и обработчики в `index_masterskaya.html`       |
| Сравнить визуальный результат             | `docs/VISUAL_BASELINE.md`                                     | PNG нужного экрана в desktop/mobile и modal/completion state     |
| Проверить статус основной точки входа     | `docs/ENTRYPOINT_CUTOVER_PLAN.md`                             | Не переключать production до gates FRT-062                       |
| Понять ожидаемый пользовательский маршрут | `README.md`                                                   | Код `goTo*`, narrative completion и modal CTA                    |
| Посмотреть альтернативный дизайн          | Только нужный файл в `experiments/`                           | Не переносить его как текущую реализацию без явного решения      |

## 9. Опасные зоны

- `index_masterskaya.html` — монолит: небольшое изменение может задеть несвязанный экран.
- `showScreen` и функции `goTo*` — управляют видимостью, scroll, reset и инициализацией нескольких сценариев.
- Общий глобальный runtime state после конфигурационных массивов — переменные разных интерактивов находятся в одной области видимости.
- Общий `window` keyboard handler — управляет narrative и закрывает все типы модалок.
- Общий resize handler — пересчитывает canvas и explorer.
- `.hero-panel`, `.workspace`, `.launch-card`, `.modal` — общие CSS-классы с широким визуальным эффектом.
- `renderSalesCatalog` — одновременно заполняет каталог, архив, серию и оба select формы.
- `SALES_WORKS` — изменение ID или статуса влияет на карточки, detail modal и формы.
- `NARRATIVE_SEQUENCES` — поля завершения определяют переходы между экранами.
- Пути к изображениям чувствительны к регистру и пробелам в именах файлов.
- Не заменять legacy-прототип целиком до появления работающей новой точки входа и визуального baseline.

## 10. Не читать без прямой необходимости

- `experiments/` — много самостоятельных HTML-копий с дублирующимся кодом.
- `archive/` — старые реализации и исторические заметки.
- `scrns/` — бинарные скриншоты.
- Содержимое крупных файлов в `src/` — изображения не нужно читать как текст.
- `docs/Вводные.md` — большой исходный документ; открывать только для продуктовых требований.
- Старые `docs/CHANGELOG_*.md` — только для истории конкретного решения.
- `docs/Interactive_Storyline_Mechanics_Ideas.md` — идеи, а не текущий контракт.
- `docs/Design_Improvement_Plan.md` — открывать только для дизайн-задач.
- `docs/Artwork_Sales_Page_Requirements.md` и `docs/Artwork_Sales_Page_MVP_Scope.md` — открывать для коммерческого раздела; текущую правду всё равно сверять с `index_masterskaya.html`.

Если после Astro-миграции появятся `node_modules/`, `dist/`, `build/`, `coverage/`, `.astro/` или временные каталоги, не включать их в первичное исследование.

## 11. Минимальный порядок чтения

1. Учесть правила корневого `AGENTS.md`.
2. `docs/PROJECT_MAP.md`.
3. `git status --short` и компактный `rg --files`.
4. Для legacy-поведения — только строковые сигнатуры нужной зоны в `index_masterskaya.html`.
5. Для Astro-каркаса — `src/README.md`, `package.json`, нужная страница или layout.
6. Соответствующий epic в `docs/Frontend_Rebuild_Backlog.md`, если задача относится к миграции.
7. Один профильный документ из `docs/`, только если кода и карты недостаточно.
