# QA target viewport

Документ фиксирует минимальную матрицу viewport для ручного визуального QA
Astro-версии. Полный последовательный проход находится в
`docs/QA_CHECKLIST.md`.

## Базовые правила

- Проверять Astro candidate-версию в dev или production preview, не legacy-файл.
- Для каждого размера сначала проверить отсутствие горизонтального overflow на уровне страницы.
- Сравнение с legacy выполнять по `docs/LEGACY_REFERENCE.md`: desktop `1440x900` и mobile `390x844` являются прямыми baseline-размерами.
- Для generated-страниц достаточно проверять один представительный slug и отдельно один неизвестный slug через 404.
- Если визуальная ошибка не исправляется в текущей задаче, фиксировать её как отдельную follow-up задачу.

## Viewport matrix

| Профиль         | Viewport   | Основные проверяемые страницы                                                                                                                                                             |
| --------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Desktop         | `1440x900` | `/`, `/artist/`, `/experience/`, `/experience/story/intro/`, `/experience/color-return/`, `/experience/details/`, `/experience/light/`, `/works/`, `/works/dor-3518/`, `/archive/`        |
| Compact desktop | `1180x760` | `/`, `/experience/`, `/experience/color-return/`, `/experience/details/`, `/experience/light/`, `/works/`, `/works/dor-3518/`, `/series/demo-series-needs-title/`                         |
| Tablet portrait | `820x1180` | `/`, `/artist/`, `/experience/story/bridge/`, `/experience/details/`, `/experience/light/`, `/works/`, `/works/dor-3518/`, `/archive/`                                                    |
| Mobile          | `390x844`  | `/`, `/artist/`, `/experience/`, `/experience/story/light-bridge/`, `/experience/color-return/`, `/experience/details/`, `/experience/light/`, `/works/`, `/works/dor-3518/`, `/archive/` |
| Narrow mobile   | `360x800`  | `/`, `/experience/story/finale/`, `/experience/color-return/`, `/experience/details/`, `/experience/light/`, `/works/`, `/works/dor-3518/`, `/series/demo-series-needs-title/`, `/404/`   |

## Что покрывает матрица

- Общая оболочка: header, skip-link, navigation, footer, декор мастерской и ширина контента.
- Контентные маршруты: главная, художник, каталог, архив, detail-страница работы и страница серии.
- Narrative: все четыре story-состояния распределены по разным размерам, чтобы проверить карточку, изображение, прогресс и CTA.
- Интерактивы: три продуктовых stage проверяются на каждом размере, включая controls, progress, dialog и повторный запуск.
- Ошибки маршрутизации: narrow mobile включает `/404/`, чтобы проверить fallback-навигацию в самом тесном размере.

## Минимум ручной проверки на каждом размере

1. Открыть страницу напрямую по URL и обновить её.
2. Проверить первый viewport и затем full-page scroll.
3. Убедиться, что нет горизонтальной прокрутки.
4. Пройти клавишей `Tab` до основных CTA и controls.
5. Для интерактивов выполнить reset или повторный запуск, а на `390x844` дополнительно открыть completion/dialog-состояние.

## Зафиксированный результат — оболочка и контентные страницы

Проверено 2026-06-30 на production-сборке. Из-за блокировки локальной навигации во встроенном браузере итоговый проход выполнен через локальный Playwright CLI без записи QA-артефактов в репозиторий.

| Профиль    | Проверенные контентные маршруты                                                                                  | Результат |
| ---------- | ---------------------------------------------------------------------------------------------------------------- | --------- |
| `1440x900` | `/`, `/artist/`, `/experience/`, `/experience/story/intro/`, `/works/`, `/works/dor-3518/`, `/archive/`          | Пройдено  |
| `1180x760` | `/`, `/experience/`, `/works/`, `/works/dor-3518/`, `/series/demo-series-needs-title/`                           | Пройдено  |
| `820x1180` | `/`, `/artist/`, `/experience/story/bridge/`, `/works/`, `/works/dor-3518/`, `/archive/`                         | Пройдено  |
| `390x844`  | `/`, `/artist/`, `/experience/`, `/experience/story/light-bridge/`, `/works/`, `/works/dor-3518/`, `/archive/`   | Пройдено  |
| `360x800`  | `/`, `/experience/story/finale/`, `/works/`, `/works/dor-3518/`, `/series/demo-series-needs-title/`, `/404.html` | Пройдено  |

Итог:

- 31 сочетание route/viewport отдало ожидаемую страницу с title и h1;
- `documentElement.scrollWidth` совпал с шириной viewport во всех случаях;
- видимые ссылки, кнопки и поля не выходят за горизонтальные границы;
- representative screenshots не показали clipping карточек, перекрытия декором или нечитаемых отступов;
- основной CTA главной открыл `/experience/story/intro/`, а mobile Tab-порядок последовательно прошёл skip-link, brand, навигацию и CTA карточек;
- после добавления `public/favicon.svg` консоль прошла без ошибок и предупреждений;
- detail-изображения отдельно дождались decode и подтвердили ненулевые natural-размеры.

## Зафиксированный результат — визуальное сравнение с legacy

Проверено 2026-07-01 на production-сборке `dist` через локальный статический
сервер `http://127.0.0.1:4321/`. Сравнение выполнялось по
`docs/LEGACY_REFERENCE.md` на baseline-размерах `1440x900` и `390x844`.
Встроенный Browser использован для первичной проверки, но bulk-съёмка через него
превысила таймаут, поэтому итоговые PNG сняты Playwright CLI в `.tmp/frt-054/`.

| Зона сравнения            | Astro candidate                                                                 | Результат |
| ------------------------- | ------------------------------------------------------------------------------- | --------- |
| Первый экран              | `/`                                                                             | Пройдено  |
| Карточки запуска          | `/` и `/experience/`                                                            | Пройдено  |
| Narrative intro           | `/experience/story/intro/`                                                      | Пройдено  |
| Интерактивные stage       | `/experience/color-return/`, `/experience/details/`, `/experience/light/`       | Пройдено  |
| Каталог                   | `/works/`, `/archive/`                                                          | Пройдено  |
| Модальные состояния       | completion dialogs трёх интерактивов, hotspot dialog, detail route и form state | Пройдено  |
| Mobile baseline `390x844` | `/`, story, три интерактива, `/works/`, `/archive/`, `/works/dor-3518/`         | Пройдено  |

Итог:

- Astro сохраняет визуальный контракт legacy: тёплую мастерскую, бумажные
  поверхности, физические рамы, тёмно-коричневый UI, терракотовый акцент,
  serif-заголовки и музейную плотность текста;
- первый экран и карточки запуска не копируют старую псевдонавигацию `.screen`,
  но сохраняют четыре основных входа и мастерскую как первый визуальный сигнал;
- stage трёх интерактивов сохраняют композицию картины в раме, HUD/progress и
  подсказки; на mobile исправлен legacy-overflow деталей без потери controls;
- каталог намеренно разделён на `/works/`, `/archive/` и detail-страницы работ,
  поэтому legacy modal detail/order сравнивались с `/works/dor-3518/` и
  подготовленным состоянием frontend-формы;
- модальные состояния интерактивов визуально совпадают по роли: затемнение
  сцены, бумажная dialog-карточка, продолжение маршрута и вторичные действия;
- необъяснённых визуальных регрессий по baseline-снимкам не найдено.

Зафиксированные намеренные отличия:

- реальные Astro URL, header/navigation, skip-link и footer вместо монолитного
  скрытия экранов в одном DOM;
- доступные native dialogs и focus-flow вместо legacy-модалок на общем runtime;
- оптимизированные responsive-изображения и исправленные mobile-композиции;
- sales detail/order больше не являются модалками каталога: detail вынесен в
  route `/works/{slug}/`, заявка стала inline frontend-формой без отправки.
