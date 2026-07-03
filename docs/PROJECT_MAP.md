# Project map

Карта актуального Astro-проекта. Сначала читать этот файл, затем открывать
только профильные файлы по задаче. При расхождении документации и кода источником
правды является текущий код в `src/`.

## 1. Проект и границы

Интерактивный статический сайт о творчестве Ивана Кугача: главная в образе
мастерской, последовательный narrative-маршрут, три интерактива, каталог,
страницы работ, серий и архив проданных работ.

- Production-контур: Astro + TypeScript в `src/`.
- Сборка: статический `dist/`; generated-файлы вручную не редактируются.
- Backend, CMS, настоящая отправка заявок и оплата отсутствуют.
- `archive/index_masterskaya.html` — только исторический reference.
- `experiments/`, `archive/`, `scrns/` и временные директории не входят в
  обычный поиск и production build.

## 2. Начальные точки

| Путь                  | Роль                               | Когда открывать                             |
| --------------------- | ---------------------------------- | ------------------------------------------- |
| `AGENTS.md`           | Обязательные правила работы        | Перед исследованием и изменениями           |
| `docs/README.md`      | Индекс активной документации       | Когда нужно выбрать профильный документ     |
| `docs/PROJECT_MAP.md` | Карта текущего проекта             | Сразу после `AGENTS.md`                     |
| `README.md`           | Пользовательский маршрут и команды | Для общего знакомства и запуска             |
| `src/README.md`       | Правила структуры `src/`           | Перед созданием или перемещением Astro-кода |
| `package.json`        | Реальные npm-команды и зависимости | Перед запуском проверок или сменой tooling  |
| `astro.config.mjs`    | Static build, `site` и sitemap     | При изменении сборки, SEO или публикации    |

## 3. Маршруты

| URL                             | Исходник                                      | Ответственность                                      |
| ------------------------------- | --------------------------------------------- | ---------------------------------------------------- |
| `/`                             | `src/pages/index.astro`                       | Главная мастерской и входы в основные сценарии       |
| `/artist/`                      | `src/pages/artist.astro`                      | Контекст художника и связанные подборки              |
| `/experience/`                  | `src/pages/experience/index.astro`            | Landing последовательного интерактивного опыта       |
| `/experience/color-return/`     | `src/pages/experience/color-return.astro`     | Canvas-интерактив возвращения цвета                  |
| `/experience/details/`          | `src/pages/experience/details.astro`          | Zoom/pan, hotspots и прогресс исследования           |
| `/experience/light/`            | `src/pages/experience/light.astro`            | Выбор работы и состояния света                       |
| `/experience/story/[sequence]/` | `src/pages/experience/story/[sequence].astro` | Generated narrative-страницы                         |
| `/works/`                       | `src/pages/works/index.astro`                 | Каталог доступных и зарезервированных работ          |
| `/works/[slug]/`                | `src/pages/works/[slug].astro`                | Generated detail-страницы всех работ                 |
| `/series/[slug]/`               | `src/pages/series/[slug].astro`               | Generated витрины серий                              |
| `/archive/`                     | `src/pages/archive/index.astro`               | Проданные работы                                     |
| `/ui-preview/`                  | `src/pages/ui-preview.astro`                  | Технический preview компонентов; исключён из sitemap |
| `/404.html`                     | `src/pages/404.astro`                         | Статическая 404                                      |

Narrative-последовательность и правила browser Back зафиксированы в
`docs/NARRATIVE_ROUTE_CONTRACT.md` и исполняются через
`src/data/narrative-routes.ts`.

## 4. Компоненты и клиентская логика

| Область              | Основные файлы                                                                                                                    |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Общая оболочка       | `src/layouts/BaseLayout.astro`, `src/components/SiteNavigation.astro`, `src/components/StudioDecoration.astro`                    |
| Общие UI-примитивы   | `src/components/common/`                                                                                                          |
| Метаданные и JSON-LD | `src/components/common/PageMetadata.astro`, `src/utils/structured-data.ts`                                                        |
| Base-aware URL       | `src/utils/site-path.ts`                                                                                                          |
| Каталог и заявки     | `src/components/works/`, `src/scripts/interest-form.ts`, `src/utils/inquiry-adapter.ts`                                           |
| Narrative            | `src/components/narrative/NarrativeSequence.astro`, `src/scripts/narrative-sequence.ts`, `src/scripts/narrative-route.ts`         |
| Возвращение цвета    | `src/components/experience/ColorRevealExperience.astro`, `src/scripts/color-reveal-page.ts`, `src/scripts/color-reveal-engine.ts` |
| Исследование деталей | `src/components/experience/DetailsExplorer.astro`, `src/scripts/details-explorer-page.ts`, `src/scripts/zoom-pan-engine.ts`       |
| Свет                 | `src/components/experience/LightWorkshop.astro`, `src/scripts/light-workshop-page.ts`, `src/scripts/light-controller.ts`          |
| Dialogs              | `src/components/common/DialogShell.astro`, `src/scripts/dialog-controller.ts`                                                     |
| Изображения          | `src/components/common/OptimizedImage.astro`, `src/utils/image-assets.ts`                                                         |

Клиентский модуль подключается только на странице своего интерактива. Общие
DOM-independent вычисления лежат в `src/utils/` или тестируемых controller-файлах,
а не дублируются внутри страниц.

## 5. Данные и контент

UI получает данные через `src/data/repository.ts`. Локальные источники:

| Данные                   | Файл                           | Типы                           |
| ------------------------ | ------------------------------ | ------------------------------ |
| Работы                   | `src/data/artworks.ts`         | `src/types/artwork.ts`         |
| Серии                    | `src/data/series.ts`           | `src/types/series.ts`          |
| Страница художника       | `src/data/artist-page.ts`      | Локальный контракт файла       |
| Narrative                | `src/data/narrative.ts`        | `src/types/narrative.ts`       |
| Narrative routes         | `src/data/narrative-routes.ts` | `src/types/narrative-route.ts` |
| Hotspots                 | `src/data/hotspots.ts`         | `src/types/hotspot.ts`         |
| Работы и состояния света | `src/data/light.ts`            | `src/types/light.ts`           |

`src/data/content-links.ts` проверяет связи ID/slug/routes и production assets.
Перед контентной правкой читать `docs/LOCAL_CONTENT_GUIDE.md`; при добавлении
изображений также `docs/IMAGE_INVENTORY.md`.

Форма интереса остаётся frontend-only: `src/utils/inquiry-adapter.ts` валидирует
ввод и возвращает подготовленное состояние, но ничего не отправляет.

## 6. Стили и assets

| Путь                             | Назначение                                           |
| -------------------------------- | ---------------------------------------------------- |
| `src/styles/tokens.css`          | Цвета, типографика, spacing, радиусы и motion tokens |
| `src/styles/global.css`          | Reset, базовая типографика и общая layout-система    |
| `src/styles/studio.css`          | Визуальный слой мастерской                           |
| `src/assets/images/works/`       | Production-изображения каталога                      |
| `src/assets/images/interactive/` | Изображения трёх интерактивов                        |
| `src/utils/image-assets.ts`      | Реестр разрешённых production assets                 |

Новые production-изображения: lowercase kebab-case, без пробелов; использовать
Astro asset imports и `OptimizedImage.astro`. Большие изображения не открывать
как текст.

## 7. Документы по задачам

| Задача                                | Документ                           |
| ------------------------------------- | ---------------------------------- |
| Найти нужный код                      | `docs/PROJECT_MAP.md`              |
| Изменить локальный контент            | `docs/LOCAL_CONTENT_GUIDE.md`      |
| Изменить narrative URL или completion | `docs/NARRATIVE_ROUTE_CONTRACT.md` |
| Добавить/проверить изображение        | `docs/IMAGE_INVENTORY.md`          |
| Проверить performance limits          | `docs/PERFORMANCE_BUDGET.md`       |
| Провести release QA                   | `docs/QA_CHECKLIST.md`             |
| Выбрать размеры visual QA             | `docs/QA_VIEWPORTS.md`             |
| Свериться с прежним прототипом        | `docs/LEGACY_REFERENCE.md`         |

Завершённый frontend migration backlog, старые changelog, требования к
до-Astro прототипу и brainstorming удалены из активного дерева. При редкой
исторической необходимости использовать Git, а не восстанавливать их как
актуальные спецификации.

## 8. Команды и проверки

```powershell
npm.cmd run dev
npm.cmd run check
npm.cmd run lint
npm.cmd run test:unit
npm.cmd run format:check
npm.cmd run build
npm.cmd run performance:budget
npm.cmd run test:smoke:dist
npm.cmd run verify
```

`verify` последовательно запускает typecheck, lint, unit-тесты, format-check,
production build, performance budget и browser smoke по `dist/`.

GitHub Pages project site публикуется из `main` workflow-файлом
`.github/workflows/deploy.yml`. Production URL использует base
`/ivan-kugach/`; внутренние URL на границе рендера и клиентской навигации
преобразует `src/utils/site-path.ts`, а data route contracts продолжают хранить
канонические пути от корня проекта.

Тестовые точки:

- `tests/data-contract.test.mjs` — локальные данные и связи;
- `tests/color-reveal-progress.test.mjs` — математика прогресса canvas;
- `tests/zoom-pan.test.mjs` — zoom/pan bounds и преобразования;
- `tests/light-controller.test.mjs` — состояние интерактива света;
- `scripts/browser-smoke.mjs` — production routes и базовые сценарии;
- `scripts/check-performance-budget.mjs` — blocking budgets сборки.

## 9. Common tasks → start here

| Задача                | Сначала открыть                                                                                |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| Главная или навигация | `src/pages/index.astro`, `src/components/SiteNavigation.astro`                                 |
| Artist page           | `src/pages/artist.astro`, `src/data/artist-page.ts`                                            |
| Каталог/архив/работа  | `src/pages/works/`, `src/pages/archive/index.astro`, `src/data/artworks.ts`                    |
| Серия                 | `src/pages/series/[slug].astro`, `src/data/series.ts`                                          |
| Narrative             | `docs/NARRATIVE_ROUTE_CONTRACT.md`, `src/data/narrative-routes.ts`                             |
| Интерактив цвета      | `src/pages/experience/color-return.astro`, `src/scripts/color-reveal-page.ts`                  |
| Интерактив деталей    | `src/pages/experience/details.astro`, `src/scripts/details-explorer-page.ts`                   |
| Интерактив света      | `src/pages/experience/light.astro`, `src/scripts/light-workshop-page.ts`                       |
| Контент               | `docs/LOCAL_CONTENT_GUIDE.md`, затем нужный `src/data/*.ts`                                    |
| SEO                   | `src/components/common/PageMetadata.astro`, `src/utils/structured-data.ts`, `astro.config.mjs` |
| Release               | `docs/QA_CHECKLIST.md`, `npm.cmd run verify`                                                   |

## 10. Опасные зоны

- Не редактировать `dist/`, `.astro/`, `node_modules/` и временные каталоги.
- Не возвращать legacy HTML в корень и не использовать его как production.
- Не менять цены, статусы, факты о работах и публичные тексты без явной задачи.
- Не разрывать синхронность `src/data/*`, `src/types/*`, repository и content
  link validation.
- Не добавлять новый asset без реестра `src/utils/image-assets.ts`.
- Не подключать код одного интерактива к чужим страницам.
- Не перезаписывать unrelated изменения в грязном worktree.

## 11. Минимальный порядок чтения

1. `AGENTS.md`.
2. `docs/PROJECT_MAP.md`.
3. `git status --short`.
4. Один профильный документ из `docs/`, если нужен.
5. Конкретный route/component/data/script из таблиц выше.
6. `archive/index_masterskaya.html` — только точечным поиском для исторической
   сверки.
