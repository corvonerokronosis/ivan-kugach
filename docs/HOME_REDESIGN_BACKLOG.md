# Backlog редизайна главной

Документ фиксирует рабочий план переноса направления из эксперимента
`experiments/local-homepage-redesign-variant-2` в production Astro-главную.
Эксперимент остаётся визуальным reference, но не является источником production
кода. Источник текущего поведения — `src/pages/index.astro` и связанные
компоненты в `src/`.

## Design read

Главная должна перейти из текущей рамочной музейной версии в живую рабочую
поверхность мастерской: fixed header, компактный first viewport, слои
картин/бумаги/стола, тёплая палитра, читаемая типографика и более плотный
маршрут по интерактивам.

Дизайн-настройки для реализации:

- `DESIGN_VARIANCE: 8` — асимметрия, предметная композиция, не шаблонная сетка.
- `MOTION_INTENSITY: 5-6` — мягкие reveal/hover-состояния без зависимости
  доступности контента от JavaScript.
- `VISUAL_DENSITY: 4-5` — богато, но компактнее эксперимента; без длинных
  пустых секций.

## Принципы переноса

- Не переносить experiment как один HTML/CSS-файл в `src/`.
- Не менять факты, цены, статусы, маршруты и публичные продуктовые тексты без
  отдельной задачи.
- Не подключать React/Vue/shadcn runtime ради главной: текущий production-стек —
  Astro + TypeScript + CSS + минимальный DOM.
- Не подключать код интерактивов `/experience/*` на главную; только ссылки и
  визуальные teaser-блоки.
- Header должен быть закреплён сверху, но контент и anchor-переходы не должны
  уходить под него.
- Тексты на тёплом фоне должны проходить ручную contrast-проверку глазами на
  desktop и mobile.
- Карточки интерактивов должны адаптироваться под количество текста, без
  искусственно пустых больших плит.

## Backlog

| ID   | Приоритет | Задача                                                            | Основные файлы                                                                     | Acceptance criteria                                                                                    |
| ---- | --------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| R-01 | P0        | Зафиксировать production-направление редизайна главной            | `src/pages/index.astro`, `experiments/local-homepage-redesign-variant-2/`          | Выбраны fixed header, hero-стол, вертикальные карточки интерактивов, compact scroll и тёплая палитра.  |
| R-02 | P0        | Разобрать текущую главную на home-компоненты                      | `src/pages/index.astro`, `src/components/home/*`                                   | Главная собирает компоненты, а не хранит крупный CSS/markup-монолит.                                   |
| R-03 | P0        | Обновить дизайн-токены под вариант рабочей мастерской             | `src/styles/tokens.css`, `src/styles/global.css`, возможно `src/styles/studio.css` | Палитра, тени, радиусы, header offset и типографика доступны как reusable tokens.                      |
| R-04 | P0        | Пересобрать header как fixed top panel без перекрытия контента    | `src/components/SiteNavigation.astro`, `src/layouts/BaseLayout.astro`, styles      | Header всегда сверху; anchors/reload/scroll не прячут контент; mobile menu кликается и закрывается.    |
| R-05 | P0        | Реализовать новый hero в метафоре рабочего стола                  | `src/components/home/HomeHero.astro`, `src/pages/index.astro`                      | CTA видны в первом viewport; стол не конфликтует с кнопками; кисть/декор не закрывают текст.           |
| R-06 | P0        | Реализовать компактный блок интерактивов                          | `src/components/home/HomeExperienceRoutes.astro`                                   | `01/02/03` идут вертикально и адаптируются по тексту; `04` визуально отделён и не раздувает секцию.    |
| R-07 | P1        | Пересобрать catalog teaser в духе подборки на столе               | `src/components/home/HomeWorksTeaser.astro`, image imports                         | Работы выглядят как раскладка; секция компактна на desktop/mobile; ссылки ведут в каталог.             |
| R-08 | P1        | Пересобрать artist teaser и усилить контраст текста               | `src/components/home/HomeArtistTeaser.astro`                                       | Нижний блок читается без напряжения; нет серого текста на близком тёплом фоне.                         |
| R-09 | P1        | Привести кнопки и ссылки главной к единой системе состояний       | `src/components/common/Action.astro`, home styles                                  | Primary/secondary/plain имеют contrast, hover, active, focus; labels не ломаются на узких viewport.    |
| R-10 | P1        | Проверить все ссылки с base `/ivan-kugach/`                       | `src/utils/site-path.ts`, home components                                          | Production preview корректно открывает все ссылки, включая direct entry и refresh.                     |
| R-11 | P1        | Провести responsive-полировку                                     | home components/styles                                                             | Проверены mobile/tablet/desktop; нет horizontal overflow, налезаний, огромных пустот и hidden content. |
| R-12 | P2        | Добавить мягкий motion layer без лишнего JS                       | home styles, `src/scripts/*` только при необходимости                              | Reveal/hover не скрывают контент при ошибке JS; `prefers-reduced-motion` уважён.                       |
| R-13 | P2        | Обновить visual QA записи после фиксации результата               | `docs/QA_VIEWPORTS.md`                                                             | Есть свежая матрица viewport для новой главной.                                                        |
| R-14 | P2        | Обновить карту проекта при добавлении production home-компонентов | `docs/PROJECT_MAP.md`                                                              | Карта отражает новые реальные компоненты и структуру, если они появились.                              |
| R-15 | P0        | Финальная проверка production-контура                             | npm scripts                                                                        | `npm.cmd run verify` проходит; production preview открыт; `/` direct/reload проверен вручную.          |

## Рекомендуемый порядок веток

1. `codex/home-redesign-foundation`
   - R-02, R-03, R-04.
   - Цель: подготовить структуру, токены и fixed header без полного визуального
     переписывания главной.
2. `codex/home-redesign-hero-routes`
   - R-05, R-06, R-09.
   - Цель: перенести ключевое впечатление эксперимента и основной маршрут.
3. `codex/home-redesign-polish`
   - R-07, R-08, R-10, R-11, R-12, R-13, R-14, R-15.
   - Цель: довести каталог, artist teaser, адаптив, QA и документацию.

## Риски

- Fixed header может ломать anchor-переходы и визуально перекрывать контент.
- Base-aware ссылки могут разойтись между локальным file preview, dev server и
  GitHub Pages base `/ivan-kugach/`.
- Если перенести эксперимент слишком буквально, главная снова станет CSS-монолитом.
- Большие декоративные изображения и layered композиция могут ухудшить LCP/CLS.
- Reveal-анимации не должны оставлять content hidden в full-page screenshot,
  при ошибке JS или при `prefers-reduced-motion`.

## Минимальные проверки для каждой реализации

- `npm.cmd run check`
- `npm.cmd run lint`
- `npm.cmd run format:check`
- `npm.cmd run build`
- `npm.cmd run test:smoke:dist`
- для финальной ветки: `npm.cmd run verify`

Ручная проверка:

- `/` direct entry, reload и переходы по header links;
- fixed header на desktop и mobile;
- mobile menu: open, click link, Escape;
- hero first viewport: CTA видны, декор не закрывает текст;
- блок интерактивов: `01/02/03` без пустых плит, `04` не раздувает страницу;
- catalog teaser и artist teaser читаются на целевых viewport;
- консоль браузера без ошибок.

## Документация после реализации

- Обновить `docs/PROJECT_MAP.md`, если добавлены реальные `src/components/home/*`
  или изменилась структура главной.
- Обновить `docs/QA_VIEWPORTS.md`, если проведена новая visual QA матрица.
- Не обновлять `AGENTS.md`, если порядок работы, команды и источник текущей
  правды не менялись.
