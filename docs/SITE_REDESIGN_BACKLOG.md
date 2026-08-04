# Backlog редизайна Astro-сайта по variant-3

Документ фиксирует execution-ready план переноса визуального направления из локального
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

Редизайн меняет визуальную систему, композицию и presentation layer, но не
пересобирает продукт. Функциональный контракт задаёт текущий Astro-код: четыре
входа с главной, последовательный narrative-маршрут, прямые URL трёх
интерактивов, каталог, detail-страницы, серии, архив и frontend-only заявка
должны сохраниться. Новые глобальные функции разрешены только там, где они
явно выделены отдельными задачами этого backlog: theme control и mobile menu.

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

- Display и body используют реальный системный sans-serif stack:

  ```css
  "Segoe UI Variable", "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, Arial, sans-serif
  ```

  Имя `Studio Grotesk` из experiment не является доступной гарнитурой и не
  переносится в production. Подключение локального web-font требует отдельной
  задачи с проверкой лицензии, загрузки и performance budget.

- Не возвращать serif как автоматический «художественный» приём.
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
- Theme control и mobile menu являются новыми progressive-enhancement
  возможностями и реализуются отдельными изолированными задачами, а не как
  побочный эффект визуальной правки header.
- Footer является общей частью `BaseLayout` и присутствует на каждом маршруте,
  включая story, интерактивы, 404 и технический preview. Он остаётся в обычном
  document flow, не бывает fixed/sticky и не перекрывает stage, controls,
  dialogs или форму.

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

Сохраняемые production-возможности:

- четыре самостоятельных входа с главной: три интерактива и каталог;
- `/experience/` как обзор, последовательные story routes и browser
  Back/Forward contract;
- прямой вход, reload и сохранение ссылок на каждый интерактив;
- canvas/progress/reset/completion возвращения цвета;
- zoom/pan/hotspots/dialog/progress исследования деталей;
- выбор работы, состояния и completion мастерской света;
- каталог доступных и зарезервированных работ, отдельный архив проданных;
- generated work detail и series routes;
- статусы, цены, галерея, форма интереса и её frontend-only validation;
- metadata, JSON-LD, base-aware URL, focus flow и reduced motion.

### Что переносится из experiment

| Элемент variant-3                          | Решение для production                                                                                                                |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Тёплая dark/light мастерская               | Перенести как общую semantic token system для всех маршрутов.                                                                         |
| Рама, мольберт, лён, дерево и рабочий свет | Перенести как композиционные primitives; материалы поддерживают иерархию и не становятся декором ради декора.                         |
| Асимметричная hero/works/artist композиция | Перенести на главную с актуальным production-контентом и текущими CTA.                                                                |
| Tabs превью трёх интерактивов              | Не переносить как новую функциональность. Визуальный язык tabs можно переосмыслить как список существующих прямых входов без скрытия. |
| Hero-кнопка «Убрать цвет»                  | Не переносить на главную. Она дублирует существующий интерактив возвращения цвета и требует отдельного продуктового решения.          |
| Pointer light, parallax и reveal           | Допустимы как необязательное визуальное усиление, если контент доступен без JS и соблюдается `prefers-reduced-motion`.                |
| Theme control                              | Перенести как явно разрешённую новую глобальную функцию в отдельной задаче.                                                           |
| Collapsed mobile menu                      | Перенести как явно разрешённую новую глобальную функцию в отдельной задаче.                                                           |
| Композиция footer                          | Перенести в общий production footer без новых продуктовых обещаний и изменения публичных фактов.                                      |

Если visual reference конфликтует с production-функцией, сохраняется функция,
а визуальная композиция адаптируется вокруг неё. Experiment не определяет
тексты, URL, количество сценариев, данные или state lifecycle.

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
- Сначала расширять существующие tokens, layout и common components. В
  частности, stable media geometry и новый язык рам сначала реализуются через
  эволюцию `FramedArtwork.astro` и `OptimizedImage.astro`.
- Новый primitive создаётся только после документированного вывода, что
  существующий компонент невозможно или нецелесообразно расширить без смешения
  ответственностей. Старый компонент удаляется только после перевода всех
  consumers, обновления `/ui-preview/`, успешного поиска оставшихся imports и
  прохождения проверок. До этого старый и новый компоненты не считаются
  взаимозаменяемыми.
- Route-specific стили и scripts не должны загружаться на чужих страницах.
- Сохранять текущие accessibility wins: skip-link, focus flow, native dialogs,
  alt text, keyboard controls и контраст.
- Редизайн должен уменьшать ощущение длинного scroll, а не добавлять
  декоративные переходные экраны.

## Backlog

Статусы:

- `ready` — задача может начаться сейчас: все зависимости выполнены и влиты в
  `origin/main`, открытых продуктовых решений нет;
- `blocked` — задача ожидает перечисленные зависимости или отдельное решение;
  это нормальное состояние очереди, а не ошибка;
- `in_progress` — работа ведётся в одной выделенной ветке;
- `review` — реализация и проверки завершены, но ветка ещё не принята/не влита;
- `done` — acceptance criteria выполнены, результат принят и находится в
  `origin/main`.

Приоритет определяет порядок и критичность, но не обязательность: для переноса
всего сайта должны быть закрыты все задачи R3-00–R3-26.

| ID    | Приоритет | Статус  | Зависит от                 | Область                   | Задача                                                     | Основные текущие файлы/зоны                                                                                           | Acceptance criteria                                                                                                                                                                   |
| ----- | --------- | ------- | -------------------------- | ------------------------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R3-00 | P0        | done    | —                          | Contract gate             | Утвердить site-wide visual и functional contract variant-3 | этот документ, локальный experiment                                                                                   | Пользователь подтверждает таблицу переноса experiment, системный font stack, сохранение текущих функций и две разрешённые новые функции; после принятия задача отмечена `done`.       |
| R3-01 | P0        | blocked | R3-00                      | Production audit          | Сопоставить весь Astro-контур с утверждённым contract      | этот документ, `src/pages/`, `src/layouts/`, `src/components/`, `src/styles/`, профильные scripts                     | В этом документе перечислены сохраняемые components, conflicts, consumers, route-local CSS и точки расширения; нет решения переписать сайт монолитом.                                 |
| R3-02 | P0        | blocked | R3-01                      | Tokens/palette            | Ввести semantic tokens тёплой dark/light мастерской        | `tokens.css`, `global.css`, `studio.css`                                                                              | Wall, surfaces, text, accent, wood, linen, lamp, borders, shadows, spacing, frame, header и motion tokens работают в обеих темах; старые разноцветные accents не протекают.           |
| R3-03 | P0        | blocked | R3-02                      | Typography/density        | Перекалибровать type scale и вертикальный ритм             | `tokens.css`, `global.css`, shared headings                                                                           | Используется утверждённый системный sans stack; hero/section headings компактны; длинные русские слова не обрезаются; ненужных fullscreen-секций нет.                                 |
| R3-04 | P0        | blocked | R3-02, R3-03               | Media primitives          | Эволюционно обновить frame и stable media geometry         | `FramedArtwork.astro`, `OptimizedImage.astro`, image registry/utilities                                               | Существующие components расширены прежде создания новых; `cover`/`contain` явны; landscape/portrait не меняют внешний slot; размеры резервируются; все consumers продолжают работать. |
| R3-05 | P0        | blocked | R3-02, R3-03               | UI primitives             | Обновить actions, panels и реальные shared states          | `Action`, `SectionHeader`, `MetaBadge`, `MessageState`, `ProgressIndicator`, `FormField`, `DialogShell`, catalog card | Focus, hover, active, disabled, invalid, error, success и dialog states используют одну систему и проходят contrast; несуществующие loading/filter features не добавляются.           |
| R3-06 | P0        | blocked | R3-02, R3-03               | Layout/header             | Пересобрать BaseLayout и статическую desktop navigation    | `BaseLayout.astro`, `SiteNavigation.astro`, global styles                                                             | Sticky header имеет safe inset; desktop nav одна строка; active route, skip-link, anchors и no-JS navigation работают; mobile/theme behavior не спрятаны внутри этой задачи.          |
| R3-07 | P0        | blocked | R3-02, R3-06               | New: theme                | Реализовать глобальный theme controller                    | `BaseLayout.astro`, `SiteNavigation.astro`, новый client module, `tests/`, `package.json`                             | Первый визит следует system preference; explicit choice сохраняется; тема ставится до paint без flash; storage failure безопасен; system change учитывается без override.             |
| R3-08 | P0        | blocked | R3-06                      | New: mobile menu          | Реализовать progressive-enhancement mobile menu            | `SiteNavigation.astro`, новый client module, `tests/`, `package.json`                                                 | Breakpoint срабатывает до тесноты; без JS nav доступна; open/link/Escape/outside/resize, scroll lock, focus return и `aria-expanded` работают; background interaction контролируется. |
| R3-09 | P0        | blocked | R3-05, R3-06               | Shared footer             | Сделать footer общим компонентом всех маршрутов            | `BaseLayout.astro`, новый/обновлённый footer component, global styles                                                 | Footer есть на каждом BaseLayout route, остаётся в flow, не перекрывает интерактивы/dialogs/forms, поддерживает обе темы и не добавляет ложных обещаний.                              |
| R3-10 | P0        | blocked | R3-04–R3-09                | Foundation preview gate   | Обновить `/ui-preview/` и принять foundation               | `src/pages/ui-preview.astro`, все foundation primitives                                                               | Preview показывает реальные variants/states/media ratios/theme/menu/footer; нет дублированной старой системы; foundation утверждён до редизайна продуктовых страниц.                  |
| R3-11 | P0        | blocked | R3-10                      | Главная pilot             | Перенести variant-3 на production-главную                  | `src/pages/index.astro`, существующие common/home components                                                          | Перенесены hero-мольберт, works и artist composition; сохранены четыре текущих входа и CTA; tabs/color toggle не добавлены; experiment-монолит не копируется.                         |
| R3-12 | P0        | blocked | R3-11                      | Visual approval gate      | Провести и зафиксировать приёмку production-главной        | preview `/`, `docs/QA_VIEWPORTS.md`                                                                                   | Пользователь подтверждает обе темы, материалы, плотность, header/menu/footer, media slots и все пять viewport; замечания закрыты до rollout других routes.                            |
| R3-13 | P0        | blocked | R3-12                      | Experience/story          | Редизайн `/experience/` и всех narrative story routes      | experience landing, story route, narrative components/styles                                                          | Обзор и четыре story-state визуально продолжают главную; direct/reload/Back/Forward/completion contract и текущие CTA сохранены; длинный текст читаем.                                |
| R3-14 | P0        | blocked | R3-04, R3-12               | Color return              | Обновить оболочку интерактива возвращения цвета            | `color-return.astro`, `ColorRevealExperience.astro`, scoped styles                                                    | Canvas, pointer/keyboard alternative, progress, reset и completion работают; stage стабилен по размеру; lifecycle не меняется.                                                        |
| R3-15 | P0        | blocked | R3-04, R3-12               | Details                   | Обновить оболочку исследования деталей                     | `details.astro`, `DetailsExplorer.astro`, scoped styles                                                               | Zoom/pan/hotspots/dialog/progress сохраняются; portrait/detail используют корректный fit; нет overflow, CLS или потери focus.                                                         |
| R3-16 | P0        | blocked | R3-04, R3-12               | Light                     | Обновить оболочку интерактива света                        | `light.astro`, `LightWorkshop.astro`, scoped styles                                                                   | Выбор работы и состояния, reset/progress/completion сохраняются; controls компактны; смена landscape/portrait и света не меняет геометрию stage.                                      |
| R3-17 | P1        | blocked | R3-05, R3-12               | Works index               | Редизайн `/works/` как рабочей развески                    | `src/pages/works/index.astro`, `ArtworkCatalogCard.astro`                                                             | Текущий каталог без новых filters сохраняет available/reserved statuses, цену и переходы; layout не становится generic equal-card grid; изображения и текст не пересекаются.          |
| R3-18 | P1        | blocked | R3-04, R3-05, R3-12        | Work detail/forms         | Редизайн work detail и inline interest flow                | `works/[slug].astro`, `InterestForm.astro`, `interest-form.ts`                                                        | Изображение, status, price, description, gallery и frontend-only form сохраняют данные, validation, reset, success и focus flow для available/reserved/sold вариантов.                |
| R3-19 | P1        | blocked | R3-04, R3-05, R3-12        | Series                    | Редизайн generated series routes                           | `series/[slug].astro`, common/catalog components                                                                      | Populated и empty state принадлежат общей системе; landscape/portrait и все статусы читаются; unknown slug сохраняет 404 behavior.                                                    |
| R3-20 | P1        | blocked | R3-04, R3-05, R3-12        | Archive                   | Редизайн `/archive/`                                       | `archive/index.astro`, common/catalog components                                                                      | Проданные работы визуально отличимы от каталога, но принадлежат одной системе; sold status и empty state сохраняются без новой commerce-функции.                                      |
| R3-21 | P1        | blocked | R3-04, R3-05, R3-12        | Artist                    | Редизайн страницы художника                                | `artist.astro`, `artist-page.ts`, связанные components                                                                | Композиция не копирует главную; факты, ссылки, серии и тексты не изменены; длинный русский контент и изображения устойчивы на всех viewport.                                          |
| R3-22 | P0        | blocked | R3-13–R3-21                | Dialogs/forms/states      | Провести общий pass всех реально достижимых состояний      | `DialogShell`, `InterestForm`, interactive components/scripts, shared styles                                          | Initial/progress/empty/invalid/error/success/completion states проверены там, где существуют; Escape, trap/restore focus и reduced motion работают; искусственных states нет.         |
| R3-23 | P1        | blocked | R3-05, R3-06, R3-09, R3-12 | 404                       | Обновить пользовательскую 404                              | `src/pages/404.astro`                                                                                                 | 404 выглядит частью сайта, имеет общий header/footer и полезные base-aware пути назад; unknown product/generated URL не ведёт в тупик.                                                |
| R3-24 | P0        | blocked | R3-13–R3-23                | Responsive/theme/state QA | Пройти site-wide visual state matrix                       | все product routes/components, `docs/QA_VIEWPORTS.md`                                                                 | Обе темы и все классы ниже проверены на пяти viewport; нет overflow, clipping, collisions, layout jumps, позднего nav collapse или чрезмерно пустых секций.                           |
| R3-25 | P0        | blocked | R3-24                      | Links/SEO/performance     | Проверить global behavior, URLs, metadata и budgets        | global client modules/tests, smoke script, `site-path.ts`, metadata, image pipeline, performance script               | Theme/menu/footer добавлены в automated smoke; dev/preview/GitHub Pages совпадают; metadata/JSON-LD не регрессируют; CSS/JS/image budgets и LCP/CLS ориентиры проходят.               |
| R3-26 | P0        | blocked | R3-25                      | Final QA/docs             | Выполнить release pass и синхронизировать документацию     | QA docs, `PROJECT_MAP.md` при структурных изменениях, npm scripts                                                     | `npm.cmd run verify` проходит; direct/reload/back, все интерактивы и state matrix проверены; нет известных P0/P1 дефектов; документы описывают только созданное.                      |

## Правило веток: одна задача — одна ветка

- Каждая задача R3-00–R3-26 выполняется в отдельной ветке
  `codex/site-redesign-v3-r3-XX-<short-scope>`. Одна ветка не закрывает два ID,
  даже если изменения кажутся маленькими.
- Перед созданием ветки выполнить `git fetch origin main` и убедиться, что все
  задачи из `Зависит от` имеют статус `done` и уже находятся в `origin/main`.
- Ветку создавать от свежего `origin/main`, например:
  `git switch -c codex/site-redesign-v3-r3-07-theme origin/main`.
- По умолчанию не использовать stacked branches. Следующая задача не начинается,
  пока зависимые ветки находятся только локально, в review или ещё не влиты.
- После реализации выполнить профильные проверки, открыть PR/передать ветку на
  review и выставить `review`. После явной приёмки в той же ветке последним
  коммитом выставить `done` и сразу влить её; следующая задача всё равно ждёт,
  пока `done` физически появится в `origin/main`.
- Если в задаче обнаружена новая самостоятельная ответственность, её сначала
  добавить в backlog отдельным ID и зависимостями; не расширять текущую ветку
  молча.
- Документационные и approval-gate задачи также получают собственную ветку. Это
  сохраняет однозначное соответствие ID, diff, проверок и решения о приёмке.

Такой процесс намеренно последовательный. Он создаёт больше небольших PR, но
каждая ветка воспроизводима из `origin/main`, не содержит скрытых локальных
зависимостей и может быть безопасно проверена или отклонена отдельно.

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
- Theme bootstrap может вызвать flash неверной темы или падение при недоступном
  storage; начальное состояние задаётся до paint, а storage access всегда имеет
  безопасный fallback.
- Mobile menu не должен делать навигацию зависимой от JavaScript. До успешной
  инициализации controller ссылки остаются доступны, а переход между breakpoint
  сбрасывает временное состояние menu и scroll lock.
- Общий footer изменяет геометрию всех страниц. Особенно проверяются короткая
  404, длинные content routes и интерактивные stage с dialogs/controls.
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

## Проверки по типу задачи

Для документационных R3-00 и R3-01:

- `npm.cmd run format:check`;
- проверить diff, ссылки на существующие файлы и соответствие текущему `src/`;
- не запускать full build только ради документа, если код не менялся.

R3-12 является approval gate, поэтому дополнительно запускает
`npm.cmd run verify` для уже собранной и влитой pilot-главной, даже если сама
ветка R3-12 меняет только QA-документацию.

Для каждой ветки с Astro/CSS/TypeScript:

- `npm.cmd run check`;
- `npm.cmd run lint`;
- `npm.cmd run format:check`;
- `npm.cmd run build`;
- `npm.cmd run test:smoke:dist`;
- `npm.cmd run test:unit`, если менялись controllers, routes, data или чистая
  интерактивная логика;
- `npm.cmd run performance:budget`, если менялись layout, media, assets, CSS,
  motion или глобальный client JavaScript;
- `npm.cmd run verify` для R3-10, R3-22 и R3-24–R3-26.

Новые theme/menu controllers должны иметь unit-testable pure state/helpers и
browser smoke для реального DOM-поведения. Одной ручной проверки недостаточно.

## Матрица визуально и функционально значимых классов

Один representative generated slug больше не считается достаточным для
site-wide redesign. На R3-24 проверяется каждый класс ниже. Если текущие данные
не содержат достижимого empty/error-варианта, он проверяется через реальный
component preview/контролируемую fixture, а не добавляется в production-данные.

| Семейство          | Обязательные классы и состояния                                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Global theme       | first visit dark/light system preference; сохранённый override; reload/navigation; system change без override; storage unavailable        |
| Header/mobile menu | wide one-line nav; breakpoint до тесноты; open/close/link/Escape/outside/resize; keyboard focus; scroll lock; no-JS fallback              |
| Footer             | короткая 404; длинная content page; каждый интерактив; dialog open/closed; обе темы; narrow mobile                                        |
| Главная            | четыре существующих входа; hero CTA в первом viewport; works и artist blocks; короткие/длинные русские labels                             |
| Experience/story   | landing; `intro`, `bridge`, `light-bridge`, `finale`; direct/reload; Back/Forward; completion/next CTA                                    |
| Color return       | initial; partial progress; completion dialog; reset/replay; pointer и keyboard-accessible path; reduced motion                            |
| Details            | portrait contain; default zoom; pan bounds; каждый hotspot; hotspot dialog; all-viewed completion; reset; reduced motion                  |
| Light              | landscape и portrait work; каждое light state; selector; reset; completion; смена media без изменения stage geometry                      |
| Works index        | available и reserved; фиксированная цена и «по запросу»; landscape/portrait; catalog→detail; catalog→archive; форма под каталогом         |
| Work detail/form   | available, reserved и sold; landscape/portrait; gallery; required/invalid/valid/reset/success; Escape/focus там, где используется dialog  |
| Series             | populated и empty presentation; mixed availability; landscape/portrait; известный и неизвестный slug                                      |
| Archive            | sold list и empty presentation; landscape/portrait; переход в detail; отсутствие purchase promise                                         |
| Artist             | hero, факты, themes, series links; длинный русский текст; landscape/portrait; отсутствие изменения фактов                                 |
| Shared primitives  | hover, focus, active, disabled, invalid, error, success, empty, progress и dialog только для компонентов, у которых эти состояния реальны |
| 404                | `/404.html`; неизвестный work slug; неизвестный series slug; base-aware возврат на основные разделы                                       |

Каждый применимый класс проверяется в dark и light theme на релевантных
viewport из `docs/QA_VIEWPORTS.md`: `1440x900`, `1180x760`, `820x1180`,
`390x844`, `360x800`. Не требуется делать полный декартов продукт всех строк и
размеров: `QA_VIEWPORTS.md` распределяет классы так, чтобы каждый был покрыт
хотя бы один раз, а самые рискованные global/header/footer/media состояния — на
всех пяти размерах.

Общий ручной минимум:

- direct entry и reload каждого изменённого URL в production preview;
- нет horizontal overflow, clipping, скрытого текста, неуместных переносов,
  collision или заметного CLS;
- mobile menu и theme сохраняют доступность и ожидаемое состояние;
- dialogs проходят focus trap, Escape и restore focus;
- первый viewport показывает назначение страницы и основной CTA;
- landscape/portrait и interactive state changes не двигают внешний layout;
- browser console чиста, чужие route-specific scripts не загружаются;
- dev, production preview и GitHub Pages base-aware paths совпадают.

## Definition of Ready для задачи

- Все зависимости имеют статус `done` и присутствуют в свежем `origin/main`.
- Acceptance criteria не требуют незафиксированного продуктового решения.
- Известны текущие consumers, route contract и состояния, которые нельзя сломать.
- Определены профильные automated checks и короткий ручной сценарий.
- Создана ровно одна новая `codex/site-redesign-v3-r3-XX-*` ветка от
  `origin/main`; рабочее дерево до старта чистое.

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
