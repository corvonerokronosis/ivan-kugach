# Backlog редизайна Astro-сайта по variant-3

Документ фиксирует рабочий план переноса визуального направления из локального
эксперимента `experiments/local-homepage-redesign-variant-3` в production
Astro-сайт. Variant-3 заменяет variant-2 как основной visual reference для
будущего редизайна.

Эксперимент остаётся локальным reference и не является источником production
кода. Источник текущего поведения, маршрутов, данных и доступности — Astro-код в
`src/`. Если experiment отсутствует в другом checkout, этот документ должен
оставаться достаточным описанием направления для начала реализации.

## Design read

Reading this as: site-wide redesign художественного сайта для зрителей и
потенциальных покупателей, с языком современной тёплой мастерской, материальной
композицией и плотной sans-serif типографикой, реализованный на Astro, CSS и
минимальном DOM/TypeScript.

Ключевая метафора — не «бумаги на рабочем столе» из variant-2 и не стандартный
музейный white cube. Сайт должен ощущаться как вечерняя мастерская, где работа
стоит в деревянной раме на мольберте, рядом видны лён, штукатурка, рейки и
направленный рабочий свет. Картина остаётся главным визуальным объектом, а
материальность поддерживает её и не превращается в декоративный реквизит.

Дизайн-настройки:

- `DESIGN_VARIANCE: 8` — асимметрия и предметная композиция без шаблонной сетки.
- `MOTION_INTENSITY: 5` — мягкие reveal, hover и pointer-light эффекты с полной
  поддержкой `prefers-reduced-motion`.
- `VISUAL_DENSITY: 5-6` — выразительно, но компактно; CTA и следующий смысловой
  блок не должны теряться в пустом пространстве.

## Visual contract variant-3

### Палитра и материалы

Ориентиры experiment, которые нужно перевести в semantic production tokens, а
не копировать как локальные имена:

| Роль                    | Dark reference | Light reference | Назначение                                        |
| ----------------------- | -------------- | --------------- | ------------------------------------------------- |
| Основная стена          | `#281b15`      | `#cda384`       | Общий фон мастерской                              |
| Приподнятая поверхность | `#38271f`      | `#bd8564`       | Навигация, панели и рабочие зоны                  |
| Сильная поверхность     | `#4a3227`      | `#a96f51`       | Active/hover и визуальная глубина                 |
| Основной текст          | `#f4e9da`      | `#291d17`       | Контрастный текст                                 |
| Приглушённый текст      | `#c7b49f`      | `#664b3d`       | Вторичный текст                                   |
| Киноварный акцент       | `#df5737`      | `#bd4028`       | CTA, active marker и один акцент на всей странице |
| Дерево                  | `#71482f`      | `#75482f`       | Рамы, рейки и опоры                               |
| Лён                     | `#ddc6a5`      | `#e2caab`       | Паспарту и media-slot                             |
| Рабочий свет            | `#efc98e`      | `#fff0c2`       | Мягкая световая температура, не второй CTA-цвет   |

Правила:

- Одна тёплая тема на странице; dark/light переключаются целиком, без случайных
  инвертированных секций.
- Киноварный цвет остаётся единственным интерактивным акцентом.
- Базовый радиус близок к `2px`; материалы читаются через слой, фактуру и тень,
  а не через набор мягких generic cards.
- Дерево, лён и свет используются системно. Не добавлять декоративные кисти,
  стикеры, псевдозаписки и другие предметы только ради метафоры.

### Типографика и плотность

- Display и body используют современную sans-serif систему; не возвращать serif
  как автоматический «художественный» приём.
- Заголовки рассчитываются относительно доступной колонки, а не только viewport.
  Длинные русские слова не обрезаются, не заходят на изображения и не получают
  случайные автоматические дефисы.
- Hero помещается в первый viewport вместе с основным CTA.
- Секции используют компактный ритм: ориентир `70-112px` на desktop и `60-72px`
  на mobile/tablet, если конкретному экрану не требуется больше.
- Не создавать полноэкранную секцию, если в ней недостаточно контента для такого
  масштаба.

### Общая оболочка

- Sticky header имеет внутренний безопасный inset `16-24px`; крайняя надпись не
  касается границы viewport.
- Desktop navigation остаётся в одну строку. Она переходит в menu до появления
  переполнения, а не после него; reference breakpoint variant-3 — около `1120px`.
- Anchor-переходы учитывают высоту header через `scroll-padding`/`scroll-margin`.
- Header, skip-link, menu, theme control и footer работают без изменения
  маршрутов или публичных nav labels.

### Картины и media-slot

- Картина — главный визуальный объект. Рамы и рейки поддерживают изображение, но
  не конкурируют с ним.
- Компонент с переключаемыми изображениями всегда резервирует единый media-slot.
  Смена landscape/portrait не меняет внешнюю высоту панели и не вызывает CLS.
- Landscape может использовать `cover`, если crop не теряет важный фрагмент.
  Portrait/detail по умолчанию использует `contain` на льняной поверхности.
- Все изображения имеют известные размеры или aspect ratio до загрузки.
- Calibration bars в исходных сканах допустимы, если композиция использует их
  как честную часть архивного материала, а не как случайный обрезанный край.

### Motion и состояния

- Motion объясняет иерархию, обратную связь или смену состояния.
- Контент остаётся доступным при отключённом JavaScript.
- Reveal выполняется через IntersectionObserver/CSS, без scroll listener.
- Переключатели, menu, dialogs и формы имеют keyboard/focus/active/error states.
- Theme и interactive media не должны менять размеры layout после действия.

## Функциональные границы

Редизайн охватывает `/`, `/artist/`, `/experience/`, story routes, три
интерактива, `/works/`, work detail, `/series/`, `/archive/`, `/404.html` и
технический `/ui-preview/`.

Нельзя менять без отдельной задачи:

- URL, route contracts и browser Back/Forward;
- факты, цены, статусы, названия и публичные продуктовые тексты;
- data contracts, ID/slug и связи repository;
- frontend-only характер заявки;
- canvas/zoom/light state lifecycle;
- JSON-LD, metadata и base-aware ссылки.

## Правила реализации

- Не переносить experiment как один HTML/CSS/JS-монолит в `src/`.
- Не подключать React/Vue или shadcn runtime: текущий production-стек — Astro,
  TypeScript, DOM/Canvas modules и CSS.
- Сначала расширять существующие tokens, layout и common components. Новый
  компонент добавлять только для повторяемой ответственности.
- Возможные новые primitives (`StudioFrame`, `StableMediaSlot`, `MaterialPanel`)
  являются кандидатами и не считаются существующими до отдельной реализации.
- Route-specific стили и scripts не должны загружаться на чужих страницах.
- Сохранять текущие accessibility wins: skip-link, focus flow, native dialogs,
  alt text, keyboard controls и контраст.
- Редизайн должен уменьшать ощущение длинного scroll, а не добавлять
  декоративные переходные экраны.

## Backlog

Статусы: `done` — завершено в текущем документе; `ready` — можно брать после
выполнения зависимостей; `blocked` — нельзя начинать до отдельного решения.

| ID    | Приоритет | Статус | Зависит от   | Область               | Задача                                              | Основные текущие файлы/зоны                                                          | Acceptance criteria                                                                                                      |
| ----- | --------- | ------ | ------------ | --------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| R3-00 | P0        | done   | —            | Направление           | Зафиксировать variant-3 как новый visual contract   | `docs/SITE_REDESIGN_BACKLOG.md`, локальный experiment                                | Документ самодостаточно описывает палитру, материалы, плотность, responsive и функциональные границы variant-3.          |
| R3-01 | P0        | ready  | R3-00        | Production audit      | Сопоставить current Astro с visual contract         | `src/pages/index.astro`, `BaseLayout.astro`, `SiteNavigation.astro`, `src/styles/*`  | Зафиксирован список сохраняемых компонентов, конфликтующих старых паттернов и точек расширения без изменения поведения.  |
| R3-02 | P0        | ready  | R3-01        | Tokens/theme          | Ввести semantic tokens тёплой мастерской            | `src/styles/tokens.css`, `src/styles/global.css`, `src/styles/studio.css`            | Dark/light palette, wood, linen, lamp, text, accent, spacing, frame, shadow и header offsets доступны повторно.          |
| R3-03 | P0        | ready  | R3-02        | Typography/density    | Перекалибровать type scale и вертикальный ритм      | `src/styles/tokens.css`, `src/styles/global.css`, shared headings                    | Hero и section headings компактны; длинные русские слова не обрезаются; нет лишних fullscreen-секций.                    |
| R3-04 | P0        | ready  | R3-02, R3-03 | Layout/navigation     | Пересобрать BaseLayout, sticky header и menu        | `src/layouts/BaseLayout.astro`, `src/components/SiteNavigation.astro`, global styles | Safe inset, single-line desktop nav, ранний menu breakpoint, anchors, skip-link, Escape и theme control работают.        |
| R3-05 | P0        | ready  | R3-02, R3-03 | Media primitives      | Реализовать reusable frame и stable media-slot      | `src/components/common/`, `OptimizedImage.astro`, image utilities                    | Landscape/portrait не меняют внешний layout; `cover`/`contain` выбираются явно; dimensions резервируются до загрузки.    |
| R3-06 | P1        | ready  | R3-02, R3-03 | UI primitives         | Обновить actions, material panels и shared states   | `Action.astro`, `DialogShell.astro`, common components/styles                        | CTA, focus, active, disabled, error и dialog states используют один visual contract и проходят contrast check.           |
| R3-07 | P0        | ready  | R3-04, R3-05 | Главная pilot         | Перенести variant-3 на production-главную           | `src/pages/index.astro`, существующие common/home responsibilities                   | Hero-мольберт, works composition и artist teaser реализованы в Astro без experiment-монолита и изменения маршрутов.      |
| R3-08 | P0        | ready  | R3-07        | Visual approval gate  | Согласовать production-главную до site-wide rollout | production preview `/`, QA viewports                                                 | Пользователь подтверждает мастерскую, палитру, плотность, header и mobile; замечания закрыты до изменения других routes. |
| R3-09 | P0        | ready  | R3-08        | Experience/story      | Редизайн `/experience/` и narrative story routes    | `src/pages/experience/index.astro`, story route, narrative components/styles         | Визуально продолжают главную; completion и Back/Forward contract не меняются; narrative остаётся читаемым.               |
| R3-10 | P0        | ready  | R3-05, R3-08 | Color return          | Обновить оболочку интерактива возвращения цвета     | `color-return.astro`, `ColorRevealExperience.astro`, scoped styles                   | Canvas, progress, reset и completion работают; stage использует stable frame и не скачет при state changes.              |
| R3-11 | P0        | ready  | R3-05, R3-08 | Details               | Обновить оболочку исследования деталей              | `details.astro`, `DetailsExplorer.astro`, scoped styles                              | Zoom/pan/hotspots/dialog сохраняются; portrait/detail media вписывается без overflow и layout shift.                     |
| R3-12 | P0        | ready  | R3-05, R3-08 | Light                 | Обновить оболочку интерактива света                 | `light.astro`, `LightWorkshop.astro`, scoped styles                                  | Selector и состояния света стабильны по размеру; controls компактны; изображение не меняет stage geometry.               |
| R3-13 | P1        | ready  | R3-06, R3-08 | Works index           | Редизайн `/works/` как рабочей развески             | `src/pages/works/index.astro`, `src/components/works/*`                              | Каталог не становится generic cards grid; filters/status читаются; изображение и текст не пересекаются.                  |
| R3-14 | P1        | ready  | R3-05, R3-06 | Work detail/forms     | Редизайн work detail и interest flow                | `src/pages/works/[slug].astro`, works components, `interest-form.ts`                 | Изображение, статус, цена, описание и frontend-only форма сохраняют данные, validation и focus flow.                     |
| R3-15 | P1        | ready  | R3-05, R3-06 | Series/archive        | Редизайн серий и архива                             | `src/pages/series/[slug].astro`, `src/pages/archive/index.astro`                     | Series/sold/archive различимы, но принадлежат одной системе; generated routes и empty states не ломаются.                |
| R3-16 | P1        | ready  | R3-05, R3-08 | Artist                | Редизайн страницы художника                         | `src/pages/artist.astro`, `src/data/artist-page.ts`, связанные components            | Сохраняется тёплый язык, но композиция не копирует главную; факты и ссылки остаются без изменений.                       |
| R3-17 | P1        | ready  | R3-06        | Dialogs/forms/states  | Провести общий pass форм, dialogs и состояний       | `DialogShell.astro`, `InterestForm.astro`, scripts и shared styles                   | Loading/empty/error/success, Escape, restore focus и reduced motion проверены; нет ложного обещания отправки.            |
| R3-18 | P2        | ready  | R3-04, R3-06 | 404/ui-preview        | Обновить 404 и технический preview                  | `src/pages/404.astro`, `src/pages/ui-preview.astro`                                  | 404 выглядит частью сайта; preview покрывает реальные primitives, но остаётся вне sitemap и product navigation.          |
| R3-19 | P0        | ready  | R3-09–R3-18  | Responsive/theme QA   | Провести site-wide responsive и dual-theme pass     | все изменённые routes/components, `docs/QA_VIEWPORTS.md`                             | Нет overflow, clipping, text/image collision, late nav collapse, layout jumps и чрезмерно пустых секций.                 |
| R3-20 | P0        | ready  | R3-07–R3-19  | Links/SEO/performance | Проверить base-aware URLs, metadata и budgets       | `site-path.ts`, metadata/structured data, image pipeline, performance script         | Dev/preview/GitHub Pages совпадают; SEO не регрессирует; LCP/CLS и bundle budgets проходят.                              |
| R3-21 | P0        | ready  | R3-19, R3-20 | Final QA/docs         | Выполнить release pass и обновить документацию      | QA docs, `PROJECT_MAP.md` при структурных изменениях, npm scripts                    | `npm.cmd run verify` проходит; direct/reload/back и интерактивы проверены; документация описывает реально созданное.     |

## Рекомендуемый порядок веток

1. `codex/site-redesign-v3-foundation`
   - R3-01–R3-06.
   - Цель: зафиксировать production-аудит, tokens, типографику, shell, header,
     stable media slot и общие primitives без полного переписывания страниц.
   - Gate: `/ui-preview/` и существующие страницы подтверждают, что новая основа
     не ломает текущую функциональность и не требует page-specific hacks.
2. `codex/site-redesign-v3-home-pilot`
   - R3-07–R3-08.
   - Цель: собрать production-главную как эталон новой системы и показать её на
     всей viewport-матрице в обеих темах.
   - Gate: пользователь отдельно утверждает метафору мастерской, плотность,
     header, медиаслоты и mobile до распространения дизайна на другие routes.
3. `codex/site-redesign-v3-experience`
   - R3-09–R3-12.
   - Цель: перенести утверждённый язык на narrative flow и три интерактива,
     сохранив их механику и route contract.
   - Gate: story navigation, Back/Forward, progress, reset, zoom/pan, hotspots и
     light selector проходят профильные сценарии.
4. `codex/site-redesign-v3-content-commerce`
   - R3-13–R3-18.
   - Цель: редизайн каталога, работы, серий, архива, artist, форм, dialogs, 404 и
     технического preview в одной визуальной системе.
   - Gate: данные, статусы, цены, frontend-only validation, focus flow и
     generated routes не изменились.
5. `codex/site-redesign-v3-qa-docs`
   - R3-19–R3-21.
   - Цель: site-wide responsive/theme pass, проверка links/SEO/performance,
     release QA и синхронизация активной документации.
   - Gate: `npm.cmd run verify` и ручная матрица проходят без известных P0/P1
     визуальных или функциональных дефектов.

Каждая ветка начинается от актуального `origin/main`. Следующая ветка создаётся
после завершения и приёмки предыдущего gate; ветки не должны молча зависеть от
неопубликованных локальных изменений.

## Риски

- Буквальный перенос мастерской может превратиться в декоративный театр. Дерево,
  холст, штукатурка, свет и рамы должны объяснять иерархию, а не заполнять пустоты.
- Старые global styles, tokens и `StudioDecoration.astro` могут конфликтовать с
  новой материальной системой; до добавления слоёв нужен аудит R3-01.
- Sticky header может ломать anchor-переходы, обрезать последний пункт навигации
  и слишком поздно переходить в mobile menu. Нужны safe inset и ранний breakpoint.
- Крупная viewport-зависимая типографика опасна для длинных русских слов: нельзя
  допускать clipping, случайные переносы и столкновение текста с изображением.
- Разные пропорции работ могут менять высоту интерактивного блока. Stable media
  slot обязан резервировать геометрию, а режимы `cover` и `contain` выбираются по
  смыслу изображения.
- Base-aware ссылки могут разойтись между dev server, production preview и GitHub
  Pages base `/ivan-kugach/`.
- Светлая тема не должна быть простой инверсией: контраст текста, muted copy,
  controls и поверхностей проверяется отдельно от тёмной.
- Большие рамы, фоновые фактуры, grain и сложные compositing-эффекты могут
  ухудшить LCP/CLS и перегрузить GPU. Новые изображения добавляются только при
  реальной композиционной необходимости и с явными размерами.
- Интерактивы имеют собственные canvas/DOM-механики; редизайн оболочки не должен
  менять их state lifecycle.
- Каталог и forms содержат коммерческий сценарий frontend-only; visual polish не
  должен создавать ожидание настоящей отправки заявки.
- Story routes и Back/Forward поведение нельзя менять без отдельной route-contract
  задачи.
- `experiments/` игнорируется Git и может отсутствовать в другом checkout.
  Поэтому этот документ — переносимый контракт, а эксперимент используется как
  визуальная сверка, но не как runtime dependency или источник production-кода.
- Попытка «добавить воздуха» крупными пустыми секциями вернёт прежнюю проблему
  длинной прокрутки. Плотность и first viewport проверяются как отдельные критерии.

## Минимальные проверки для каждой реализации

- `npm.cmd run check`
- `npm.cmd run lint`
- `npm.cmd run test:unit`, если менялись данные, routes, controllers или
  интерактивная логика
- `npm.cmd run format:check`
- `npm.cmd run build`
- `npm.cmd run test:smoke:dist`
- `npm.cmd run performance:budget`, если менялись изображения, layout, assets или
  motion
- для интеграционных и финальной веток: `npm.cmd run verify`

Ручная проверка:

- вся матрица `1440x900`, `1180x760`, `820x1180`, `390x844`, `360x800` из
  `docs/QA_VIEWPORTS.md`;
- тёмная и светлая темы, включая сохранение темы после навигации и reload;
- `/` direct entry, reload, anchors и переходы по header links;
- desktop header имеет безопасный правый отступ и одну строку навигации, а menu
  сворачивается до появления тесноты;
- mobile menu: open, click link, Escape, возврат фокуса и блокировка фоновой
  прокрутки;
- первый экран показывает смысл страницы и основной CTA без лишней прокрутки;
- секции не растянуты пустыми промежутками, но текст сохраняет читаемый ритм;
- нет horizontal overflow, clipping, скрытого текста, неуместных переносов и
  столкновения текста с изображениями;
- landscape и portrait работы меняются внутри стабильного медиаслота без скачка
  контейнера или соседнего контента;
- `/experience/`, все story routes, browser Back и Forward;
- `/experience/color-return/`, `/experience/details/`, `/experience/light/`:
  основное взаимодействие, reset/progress/controls;
- `/works/`, `/works/[slug]/`, форма интереса: invalid, valid, reset, sold work;
- `/artist/`, `/archive/`, `/series/[slug]/`, `/404.html`;
- dialogs: focus trap, Escape, restore focus и reduced motion;
- прямой вход и reload каждого изменённого URL в production preview;
- консоль браузера без ошибок и страница не загружает код чужих интерактивов.

## Definition of Done для page-family

- Содержимое, цены, статусы, ссылки и функциональные контракты не изменены без
  отдельной продуктовой задачи.
- Страница использует общие tokens и primitives; локальный CSS не копирует
  foundation и не создаёт вторую систему.
- Основной текст, controls и CTA читаются в обеих темах и на релевантных
  viewport из общей матрицы.
- Изображения имеют зарезервированную геометрию; нет заметного CLS при загрузке,
  переключении состояния или смене работы.
- Сохраняются keyboard flow, visible focus, semantic headings, reduced motion и
  подходящие alt-тексты.
- Ветка проходит профильные автоматические проверки и содержит короткий ручной
  сценарий приёмки в отчёте.

## Документация после реализации

- Обновить `docs/PROJECT_MAP.md`, если добавлены реальные компоненты,
  изменились директории, routes, команды или ответственность существующих файлов.
- Обновить `docs/QA_VIEWPORTS.md` результатами новой visual QA матрицы только
  после фактического прохода.
- Обновить `docs/QA_CHECKLIST.md`, если изменился release-проход из-за нового
  header, theme flow, stable media slot или интерактивных states.
- Обновить `docs/IMAGE_INVENTORY.md`, если в production добавлены или заменены
  изображения.
- Не обновлять `AGENTS.md`, если порядок работы, команды и источник текущей
  правды не менялись.
- После завершения редизайна отметить задачи выполненными, а долговечные
  требования перенести в профильные активные документы; Git хранит историю
  закрытого плана.
