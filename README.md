# Сайт о творчестве Ивана Кугача

Многостраничный frontend на Astro для интерактивного сайта о творчестве Ивана
Кугача. Проект собирает мастерскую, сюжетный маршрут, три интерактива с
картинами, каталог работ, страницы произведений, серии и архив в статическую
production-сборку без backend.

`index_masterskaya.html` сохранен в корне как legacy-эталон поведения и
визуального сравнения до финального переключения точки входа в `FRT-062`.
Основной разрабатываемый frontend находится в `src/` и запускается через
команды npm.

## Требования

- Windows + PowerShell.
- Node.js версии, совместимой с Astro 6.
- npm из установленного Node.js.

На Windows используйте `npm.cmd`, не меняя PowerShell execution policy.

## Установка

```powershell
npm.cmd install
```

## Разработка

```powershell
npm.cmd run dev
```

Команда запускает Astro dev server. Основные URL для проверки:

- `/` - главная мастерской;
- `/artist/` - страница художника;
- `/experience/` - вход в интерактивный маршрут;
- `/experience/color-return/` - интерактив возвращения цвета;
- `/experience/details/` - исследование деталей;
- `/experience/light/` - мастерская света;
- `/works/` - каталог работ;
- `/archive/` - архив проданных работ;
- `/ui-preview/` - технический стенд общих компонентов и движков.

## Production-сборка

```powershell
npm.cmd run build
```

Сборка создает статический `dist/`.

## Preview

```powershell
npm.cmd run preview
```

Preview открывает production-сборку локально. Используйте его для проверки
прямого входа по URL, обновления страницы и итоговых ассетов после `build`.

## Единая проверка

```powershell
npm.cmd run verify
```

`verify` последовательно запускает:

- `check` - Astro/TypeScript-проверку;
- `lint` - ESLint для нового frontend-контура, тестов и scripts;
- `test:unit` - unit-тесты чистой frontend-логики;
- `format:check` - проверку форматирования;
- `build` - production-сборку;
- `performance:budget` - static performance budget по `dist/`;
- `test:smoke:dist` - browser smoke по уже собранному `dist/`.

Smoke-этап считается успешным, когда в выводе есть
`Browser smoke result: PASS`.

Отдельные команды:

```powershell
npm.cmd run check
npm.cmd run lint
npm.cmd run test:unit
npm.cmd run test:smoke
npm.cmd run test:smoke:dist
npm.cmd run performance:budget
npm.cmd run format:check
npm.cmd run format
```

`format` изменяет только новый production-контур и активную документацию.
Legacy-прототип, архивы, эксперименты, generated output и временные директории
исключены из ESLint и Prettier.

## Карта директорий

| Путь                     | Назначение                                                                      |
| ------------------------ | ------------------------------------------------------------------------------- |
| `src/pages/`             | Astro-маршруты и композиция страниц                                             |
| `src/layouts/`           | Общий HTML-каркас, metadata, slots и декор                                      |
| `src/components/`        | Переиспользуемые Astro-компоненты UI, каталога, narrative и интерактивов        |
| `src/assets/`            | Импортируемые production web-изображения и другие ассеты                        |
| `src/content/`           | Каркас Astro Content Collections                                                |
| `src/data/`              | Типизированные локальные данные, route-контракты и frontend-репозиторий         |
| `src/scripts/`           | Изолированные клиентские DOM/Canvas/state-модули                                |
| `src/styles/`            | Дизайн-токены, глобальные стили и общие CSS-слои                                |
| `src/types/`             | Общие TypeScript-контракты данных, интерактивов, форм и маршрутов               |
| `src/utils/`             | Чистые helpers, адаптеры, image registry и structured data                      |
| `tests/`                 | Unit-тесты DOM-independent логики                                               |
| `scripts/`               | Служебные Node-скрипты smoke и performance budget                               |
| `public/`                | Файлы без обработки Astro: `robots.txt`, `favicon.svg`                          |
| `docs/`                  | Бэклог, карта проекта, migration checklist, visual baseline, QA и release gates |
| `index_masterskaya.html` | Legacy-эталон до `FRT-062`, не production-точка новой Astro-версии              |

Подробные правила для `src/` описаны в [src/README.md](src/README.md).
Навигация по репозиторию - в [docs/PROJECT_MAP.md](docs/PROJECT_MAP.md).

## Контент и данные

Локальная инструкция по изменению работ, статусов, цен, серий, narrative,
hotspots и production-изображений находится в
[docs/LOCAL_CONTENT_GUIDE.md](docs/LOCAL_CONTENT_GUIDE.md). Она временная до
подключения CMS: сейчас данные лежат в `src/data/*`, UI читает их через
`src/data/repository.ts`, а связи проверяются в `src/data/content-links.ts`.

Перед изменением локальных данных также сверяйте актуальные ID, slug,
изображения и связи с [docs/PROJECT_MAP.md](docs/PROJECT_MAP.md) и
[docs/LEGACY_MIGRATION_CHECKLIST.md](docs/LEGACY_MIGRATION_CHECKLIST.md).
Инвентаризация production-изображений находится в
[docs/IMAGE_INVENTORY.md](docs/IMAGE_INVENTORY.md).

Форма интереса пока frontend-only: она валидирует поля и показывает локальное
подтверждение, но не отправляет данные, не резервирует работу и не подключает
email, CRM, Telegram или оплату.

## Ручной QA-checklist

До отдельного документа `FRT-061` ручная проверка опирается на:

- [docs/QA_VIEWPORTS.md](docs/QA_VIEWPORTS.md) - целевые viewport, страницы и
  результаты визуального QA;
- [docs/VISUAL_BASELINE.md](docs/VISUAL_BASELINE.md) - legacy-снимки для
  визуального сравнения;
- [docs/ENTRYPOINT_CUTOVER_PLAN.md](docs/ENTRYPOINT_CUTOVER_PLAN.md) - gates
  переключения точки входа.

Минимальный ручной сценарий после изменений:

1. Запустить `npm.cmd run verify`.
2. Запустить `npm.cmd run preview`.
3. Проверить прямой вход и обновление страницы на `/`, `/works/`,
   `/works/{slug}/`, `/archive/`, `/experience/`,
   `/experience/color-return/`, `/experience/details/` и
   `/experience/light/`.
4. На целевых viewport из `docs/QA_VIEWPORTS.md` убедиться, что нет
   горизонтального overflow, ошибок консоли и перекрытий UI.
5. Пройти форму интереса без отправки на backend и убедиться, что текст
   подтверждения остается честным frontend-only сообщением.
6. Для визуальных изменений свериться с baseline из `docs/VISUAL_BASELINE.md`.

## Legacy-эталон

`index_masterskaya.html` не удаляется и не заменяется до `FRT-062`. Его нужно
открывать напрямую в браузере, когда требуется проверить исходное поведение
прототипа или сравнить визуальное состояние с Astro-версией.

Быстрая проверка встроенного JavaScript legacy-файла:

```powershell
node -e "const fs=require('fs');const s=fs.readFileSync('index_masterskaya.html','utf8');const m=s.match(/<script>([\s\S]*?)<\/script>/i);new Function(m[1]);console.log('Inline JS syntax OK')"
```

Порядок финального переключения зафиксирован в
[docs/ENTRYPOINT_CUTOVER_PLAN.md](docs/ENTRYPOINT_CUTOVER_PLAN.md).
