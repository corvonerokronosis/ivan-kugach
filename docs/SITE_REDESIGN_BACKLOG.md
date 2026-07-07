# Backlog редизайна сайта

Документ фиксирует рабочий план переноса направления из эксперимента
`experiments/local-homepage-redesign-variant-2` во весь production Astro-сайт.
Эксперимент остаётся визуальным reference, но не является источником production
кода. Источник текущего поведения — Astro-код в `src/`.

## Design read

Весь сайт должен перейти из текущей рамочной музейной версии в живую рабочую
поверхность мастерской: fixed header, компактные first-view экраны, слои
картин/бумаги/стола, тёплая палитра, читаемая типографика, плотная навигация по
интерактивам и каталог, который ощущается как подборка работ, а не стандартная
витрина.

Главная из эксперимента задаёт язык редизайна, но перенос должен охватить:

- `/` — главная и входы в основные сценарии;
- `/artist/` — страница художника;
- `/experience/` и story routes — вход в последовательный опыт;
- `/experience/color-return/`, `/experience/details/`, `/experience/light/` —
  три интерактивных экрана;
- `/works/`, `/works/[slug]/` — каталог и страницы работ;
- `/series/[slug]/` — страницы серий;
- `/archive/` — архив проданных работ;
- `/404.html` — ошибка в той же визуальной системе;
- `/ui-preview/` — технический стенд, который не должен стать продуктовой
  страницей.

Дизайн-настройки для реализации:

- `DESIGN_VARIANCE: 8` — асимметрия, предметная композиция, не шаблонная сетка.
- `MOTION_INTENSITY: 5-6` — мягкие reveal/hover-состояния без зависимости
  доступности контента от JavaScript.
- `VISUAL_DENSITY: 4-5` — богато, но компактно; без длинных пустых секций.

## Принципы переноса

- Не переносить experiment как один HTML/CSS-файл в `src/`.
- Не менять факты, цены, статусы, маршруты и публичные продуктовые тексты без
  отдельной задачи.
- Не подключать React/Vue/shadcn runtime ради визуального редизайна: текущий
  production-стек — Astro + TypeScript + CSS + минимальный DOM.
- Не подключать код одного интерактива к чужим страницам.
- Header должен быть закреплён сверху, но контент и anchor-переходы не должны
  уходить под него.
- Тексты на тёплом фоне должны проходить ручную contrast-проверку глазами на
  desktop и mobile.
- Карточки и секции должны адаптироваться под реальный объём текста, без
  искусственно пустых больших плит.
- Редизайн должен уменьшать ощущение длинного scroll, а не добавлять
  декоративные экраны между пользовательскими действиями.

## Backlog

| ID   | Приоритет | Область           | Задача                                                        | Основные файлы                                                                    | Acceptance criteria                                                                                           |
| ---- | --------- | ----------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| S-01 | P0        | Направление       | Зафиксировать site-wide visual contract                       | `docs/SITE_REDESIGN_BACKLOG.md`, experiment reference                             | Главная признана visual reference, но scope явно покрывает все route-группы сайта.                            |
| S-02 | P0        | Layout/navigation | Пересобрать общий layout и fixed header                       | `src/layouts/BaseLayout.astro`, `src/components/SiteNavigation.astro`, global CSS | Header всегда сверху; контент не прячется; mobile menu кликается; anchors работают.                           |
| S-03 | P0        | Tokens/styles     | Обновить дизайн-токены под мастерскую                         | `src/styles/tokens.css`, `src/styles/global.css`, `src/styles/studio.css`         | Палитра, тени, радиусы, header offset, typography и surfaces доступны как reusable tokens.                    |
| S-04 | P0        | Components        | Создать слой site-секций и shared visual primitives           | `src/components/common/*`, новые domain components                                | Не появляется новый CSS-монолит; повторяемые паттерны вынесены в компоненты.                                  |
| S-05 | P0        | Главная           | Реализовать новую главную в метафоре рабочего стола           | `src/pages/index.astro`, `src/components/home/*`                                  | Hero, route cards, works teaser и artist teaser соответствуют эксперименту, но собраны production-паттернами. |
| S-06 | P0        | Experience index  | Редизайн landing страницы последовательного опыта             | `src/pages/experience/index.astro`, narrative components                          | Страница визуально продолжает главную и ясно ведёт к story route без ощущения отдельного шаблона.             |
| S-07 | P0        | Story routes      | Редизайн narrative story screens                              | `src/pages/experience/story/[sequence].astro`, narrative components/styles        | Story pages читаются как листы/заметки мастерской; completion/back flow не меняется.                          |
| S-08 | P0        | Интерактивы       | Привести три интерактива к новой оболочке без поломки механик | `src/pages/experience/*.astro`, `src/components/experience/*`, scoped styles      | Canvas/zoom/light остаются рабочими; вокруг них новая визуальная система, контраст и компактные controls.     |
| S-09 | P1        | Каталог           | Редизайн `/works/` как подборки работ на рабочей поверхности  | `src/pages/works/index.astro`, `src/components/works/*`                           | Фильтры/статусы/форма читаются лучше; каталог не выглядит как generic cards grid.                             |
| S-10 | P1        | Work detail       | Редизайн страниц работ                                        | `src/pages/works/[slug].astro`, work components                                   | Изображение, описание, статус, цена и interest flow имеют единый визуальный язык и не теряют факты.           |
| S-11 | P1        | Series/archive    | Редизайн страниц серий и архива                               | `src/pages/series/[slug].astro`, `src/pages/archive/index.astro`                  | Серии и архив не выглядят второстепенно; sold/archive статусы читаются ясно.                                  |
| S-12 | P1        | Artist            | Редизайн страницы художника                                   | `src/pages/artist.astro`, `src/data/artist-page.ts`, components                   | Страница держит тёплый мастерской язык, но не превращается в копию главной.                                   |
| S-13 | P1        | Forms/dialogs     | Привести формы, dialogs и states к новой системе              | `InterestForm.astro`, `DialogShell.astro`, `interest-form.ts`, styles             | Focus, errors, empty/loading states, Escape и restore focus работают; microcopy не обещает реальную отправку. |
| S-14 | P1        | Responsive        | Провести site-wide responsive pass                            | все изменённые pages/components                                                   | Нет horizontal overflow, налезаний, пустых экранов, скрытого текста и некликабельных элементов.               |
| S-15 | P2        | Motion            | Добавить мягкий motion layer без лишнего JS                   | scoped styles, scripts только при необходимости                                   | Reveal/hover не скрывают контент при ошибке JS; `prefers-reduced-motion` уважён.                              |
| S-16 | P2        | 404/ui-preview    | Привести 404 к стилю сайта, ui-preview оставить техстендом    | `src/pages/404.astro`, `src/pages/ui-preview.astro`                               | 404 выглядит частью сайта; ui-preview не попадает в sitemap/product flow.                                     |
| S-17 | P0        | Links/base        | Проверить base-aware ссылки по всему сайту                    | `src/utils/site-path.ts`, route components                                        | Dev, production preview и GitHub Pages base `/ivan-kugach/` ведут одинаково корректно.                        |
| S-18 | P0        | QA/docs           | Обновить QA и карту после реальных структурных изменений      | `docs/PROJECT_MAP.md`, `docs/QA_VIEWPORTS.md`, `docs/QA_CHECKLIST.md`             | Документация отражает новые компоненты, маршруты проверки и visual QA viewport.                               |
| S-19 | P0        | Verification      | Финальная проверка production-контура                         | npm scripts                                                                       | `npm.cmd run verify` проходит; production preview открыт; direct/reload/back проверены вручную.               |

## Рекомендуемый порядок веток

1. `codex/site-redesign-foundation`
   - S-02, S-03, S-04, S-17.
   - Цель: общий layout, fixed header, tokens и reusable primitives без полного
     переписывания страниц.
2. `codex/site-redesign-home-experience`
   - S-05, S-06, S-07, S-08, S-15.
   - Цель: перенести основной визуальный язык на главную и весь experience flow.
3. `codex/site-redesign-commerce-content`
   - S-09, S-10, S-11, S-12, S-13.
   - Цель: каталог, карточки работ, архив, серии, artist и формы.
4. `codex/site-redesign-qa-docs`
   - S-14, S-16, S-18, S-19.
   - Цель: site-wide responsive QA, 404/ui-preview, документация и финальная
     проверка.

## Риски

- Fixed header может ломать anchor-переходы и визуально перекрывать контент.
- Base-aware ссылки могут разойтись между dev server, production preview и GitHub
  Pages base `/ivan-kugach/`.
- Если переносить эксперимент слишком буквально, сайт получит набор CSS-монолитов
  вместо production-компонентов.
- Большие decorative/layered изображения могут ухудшить LCP/CLS.
- Интерактивы имеют собственные canvas/DOM-механики; редизайн оболочки не должен
  менять их state lifecycle.
- Каталог и forms содержат коммерческий сценарий frontend-only; visual polish не
  должен создавать ожидание настоящей отправки заявки.
- Story routes и Back/Forward поведение нельзя менять без отдельной route-contract
  задачи.

## Минимальные проверки для каждой реализации

- `npm.cmd run check`
- `npm.cmd run lint`
- `npm.cmd run format:check`
- `npm.cmd run build`
- `npm.cmd run test:smoke:dist`
- для финальной ветки: `npm.cmd run verify`

Ручная проверка:

- `/` direct entry, reload и переходы по header links;
- `/experience/`, все story routes и browser Back;
- `/experience/color-return/`, `/experience/details/`, `/experience/light/`:
  основное взаимодействие, reset/progress/controls;
- `/works/`, `/works/[slug]/`, форма интереса: invalid, valid, reset, sold work;
- `/artist/`, `/archive/`, `/series/[slug]/`, `/404.html`;
- fixed header на desktop и mobile;
- mobile menu: open, click link, Escape;
- отсутствие horizontal overflow и скрытого текста на целевых viewport;
- консоль браузера без ошибок.

## Документация после реализации

- Обновить `docs/PROJECT_MAP.md`, если добавлены реальные компоненты,
  изменились directories или ответственность существующих файлов.
- Обновить `docs/QA_VIEWPORTS.md`, если проведена новая visual QA матрица.
- Обновить `docs/QA_CHECKLIST.md`, если изменился release-проход из-за нового
  header, route flow или интерактивных states.
- Не обновлять `AGENTS.md`, если порядок работы, команды и источник текущей
  правды не менялись.
