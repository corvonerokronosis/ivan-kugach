# QA target viewport

Документ фиксирует минимальную матрицу viewport для ручного визуального QA Astro-версии. Он используется в FRT-052 и FRT-053 как список обязательных размеров до появления полного `docs/QA_CHECKLIST.md` в FRT-061.

## Базовые правила

- Проверять Astro candidate-версию в dev или production preview, не legacy-файл.
- Для каждого размера сначала проверить отсутствие горизонтального overflow на уровне страницы.
- Сравнение с legacy выполнять по `docs/VISUAL_BASELINE.md`: desktop `1440x900` и mobile `390x844` являются прямыми baseline-размерами.
- Для generated-страниц достаточно проверять один представительный slug и отдельно один неизвестный slug через 404.
- Если визуальная ошибка не исправляется в текущей задаче, фиксировать её как отдельную follow-up задачу перед закрытием FRT-052 или FRT-053.

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
