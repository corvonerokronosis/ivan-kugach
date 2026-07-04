# Аудит Astro-проекта

Дата аудита: 2026-07-02. Актуализировано: 2026-07-04.

Проверка выполнена после завершения миграции production-контура в `src/`.
Код не изменялся. `archive/`, `experiments/`, `dist/`, `.astro/`, `scrns/`,
`test-results/` и временные каталоги не рассматривались как источник
production-правды.

## 1. Краткий статус проекта

Проект технически хорошо собран для статического Astro-контура:
`pages/components/scripts/data/types/utils/styles` в целом разделены,
production-код не зависит от `archive/`, `dist/` или `.astro/`, клиентские
интерактивные модули подключаются только на своих страницах. Все автоматические
проверки проходят.

Главные риски перед публикацией:

- lifecycle на `pagehide`/BFCache;
- публикация placeholder/demo-контента;
- неполное покрытие smoke/budget по маршрутам.

## 2. Исправлено после аудита

- `F-02` закрыт 2026-07-04: `astro.config.mjs` теперь фиксирует production site
  `https://corvonerokronosis.github.io` и base `/ivan-kugach`, а
  `.github/workflows/deploy.yml` публикует project site из `main` через GitHub
  Pages. Base-aware внутренние URL обрабатывает `src/utils/site-path.ts`; контракт
  покрыт unit-тестами и production smoke/budget.

## 3. Открытые findings

| ID   | Severity | Область                       | Наблюдение                                                                                                                                                                          | Доказательство                                                                                                                                                                                                                                                             | Риск                                                                                                                | Рекомендованный фикс                                                                                                                                                                        | Проверка после фикса                                                                                                          |
| ---- | -------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| F-01 | P1       | Lifecycle интерактивов и форм | На `pagehide` контроллеры и listeners уничтожаются, но при возврате из BFCache скрипты могут не выполниться заново, а `WeakSet` уже помнит root.                                    | `src/scripts/color-reveal-page.ts`: `initializedPages` и `pagehide`; `src/scripts/details-explorer-page.ts`: `pagehide`; `src/scripts/light-workshop-page.ts`: `destroy()` на `pagehide`; `src/components/works/InterestForm.astro`: `cleanupInterestForms` на `pagehide`. | После Back/Forward пользователь может вернуться на страницу с неработающим canvas, zoom, light range или формой.    | Не уничтожать state на `pagehide`, когда `event.persisted === true`, либо добавить `pageshow` re-init/remount. При destroy удалять root из lifecycle-guard или хранить cleanup в `WeakMap`. | Playwright smoke: открыть интерактив или форму, уйти на другой route, browser Back, снова нажать reset/complete/range/submit. |
| F-03 | P2       | Контентные контракты          | `contentStatus` есть, но не влияет на публикацию; все narrative sequences сейчас `placeholder`, а demo-серия генерирует публичный route.                                            | `src/data/narrative.ts`: `contentStatus: "placeholder"` у `intro`, `bridge`, `lightBridge`, `finale`; `src/data/series.ts`: `demo-series-needs-title`; `docs/LOCAL_CONTENT_GUIDE.md`: `contentStatus` может быть `placeholder`, `review` или `approved`.                   | На production видны placeholder/demo-маркеры вроде “Заглушка”, “Демонстрационная серия”, “требует замены названия”. | Добавить release-gate: public routes не проходят verify при `placeholder`, кроме явного allowlist; либо noindex/review-маркировка для неутверждённого контента.                             | Unit content test и smoke assertion, что публичные страницы не содержат placeholder/demo-маркеры.                             |
| F-04 | P2       | Smoke / route coverage        | Smoke проверяет только `/`, `/works/`, work detail через каталог и 3 интерактива; не покрывает `/artist/`, `/archive/`, `/series/[slug]/`, story routes, 404, refresh/back-history. | `scripts/browser-smoke.mjs`: `routes` содержит `home`, `catalog`, `colorReveal`, `details`, `light`; `smokeContentRoutes()` не проходит всю route map.                                                                                                                     | Регрессия маршрута, narrative completion или 404 может пройти `verify`.                                             | Генерировать route matrix из repository/static paths; добавить direct entry, reload, internal-link crawl и narrative completion/back сценарий.                                              | `npm.cmd run test:smoke:dist` должен падать на битой ссылке, story route, 404 или BFCache regression.                         |
| F-05 | P2       | Performance budgets           | Blocking budget покрывает только 5 страниц, хотя build генерирует 20 страниц.                                                                                                       | `scripts/check-performance-budget.mjs`: массив `routes` содержит `/`, `/works/`, 3 интерактива; `docs/PERFORMANCE_BUDGET.md` фиксирует те же 5 routes; build output: 20 pages.                                                                                             | `/artist/`, `/archive/`, `/series/[slug]/`, `/works/[slug]/`, story routes могут разрастись без budget-сигнала.     | Добавить бюджеты по шаблонам: content page, work detail, series, archive, story, 404/ui-preview отдельно или исключить явно.                                                                | `npm.cmd run performance:budget` выводит все route-классы и падает на превышении.                                             |
| F-06 | P3       | Коммерческий сценарий         | Формы честно пишут frontend-only, но UI всё ещё использует формулировки “Запросить покупку”/“Заявка” при отсутствии отправки и при наличии sold options в select.                   | `src/pages/works/index.astro`: заголовок формы; `src/components/works/InterestForm.astro`: frontend-only note; `src/utils/inquiry-adapter.ts`: `prepare()` только возвращает локальное состояние.                                                                          | У части пользователей может возникнуть ожидание реального запроса/резерва, хотя backend отсутствует.                | На frontend-этапе усилить microcopy без изменения фактов: “подготовить локальный запрос”, “черновик обращения”; sold options сопровождать текстом про похожие работы.                       | Ручной проход формы: invalid, valid, reset, sold work, сообщение “данные не отправлены”.                                      |

## 4. Не баги, но технический долг

- Крупные файлы ожидаемы, но кандидаты на разделение:
  `src/scripts/color-reveal-engine.ts` около 616 строк,
  `src/components/experience/LightWorkshop.astro` около 546 строк,
  `src/components/experience/DetailsExplorer.astro` около 489 строк.
- В `src/assets` есть большие исходные web-изображения:
  `dor-3571.jpg` 6.53 MiB, light images 3.18-4.8 MiB. Build оптимизирует
  output, но repo/build-cache растут.
- `/ui-preview/` корректно `noindex` и excluded из sitemap, но содержит
  собственные preview scripts; важно держать его вне продуктового QA как
  техстенд.

## 5. Что стоит покрыть тестами

- BFCache/back-forward lifecycle для трёх интерактивов и формы.
- Direct entry и reload для всех routes из `docs/PROJECT_MAP.md`.
- Narrative completion path:
  `/experience/story/intro/ -> /experience/color-return/`,
  `/experience/story/bridge/ -> /experience/details/`,
  `/experience/story/light-bridge/ -> /experience/light/`,
  `/experience/story/finale/ -> /`, плюс browser Back.
- Content release gate для `contentStatus !== "approved"` и
  demo/placeholder-маркеров.
- Internal link crawl по `dist/`.
- Performance budget для `/artist/`, `/archive/`, `/series/[slug]/`,
  `/works/[slug]/`, story routes и 404.

## 6. Что проверить вручную в браузере

- Production preview на desktop/mobile: `/`, `/artist/`, `/experience/`, все
  story routes, 3 интерактива, `/works/`, `/archive/`,
  `/series/demo-series-needs-title/`, все `/works/[slug]/`, `/404.html`.
- Back/Forward после взаимодействия с canvas, hotspots, light range и формой.
- Dialog focus trap, Escape, backdrop, restore focus.
- Keyboard-only: narrative arrows, details arrows/zoom/reset, light range,
  form errors.
- Консоль браузера и отсутствие horizontal overflow на целевых viewport.

## 7. Приоритетный план исправлений

1. Итерация 1: исправить `pagehide`/`pageshow` lifecycle и добавить BFCache
   smoke.
2. Итерация 2: ввести release-gate для `contentStatus`; решить
   demo-series/placeholder policy без изменения фактов вне отдельной контентной
   задачи.
3. Итерация 3: расширить smoke и performance budgets по route matrix, добавить
   internal-link crawl.

## 8. Запущенные команды

| Команда                          | Результат                     |
| -------------------------------- | ----------------------------- |
| `git status --short`             | PASS, вывода нет              |
| `rg --files`                     | PASS                          |
| `npm.cmd run check`              | PASS, 0 errors/warnings/hints |
| `npm.cmd run lint`               | PASS                          |
| `npm.cmd run test:unit`          | PASS, 22/22                   |
| `npm.cmd run format:check`       | PASS                          |
| `npm.cmd run build`              | PASS, 20 pages                |
| `npm.cmd run performance:budget` | PASS                          |
| `npm.cmd run test:smoke:dist`    | PASS                          |
| `npm.cmd run verify`             | PASS                          |

`npm.cmd install` не запускался: `node_modules` уже был установлен.

## 9. Что не удалось проверить

- Ручной `npm.cmd run preview`.
- Mobile visual QA.
- Lighthouse.
- Screen reader.
- Реальный GitHub Pages deploy после merge в `main`.

Во время исходного read-only аудита `docs/PROJECT_MAP.md` и `AGENTS.md` не
обновлялись. При актуализации 2026-07-04 оба документа синхронизированы с
GitHub Pages и обязательным branch workflow.
