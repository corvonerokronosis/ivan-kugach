# Performance budget

Документ фиксирует действующий бюджет первой загрузки Astro production build.
Бюджет проверяется статически по содержимому `dist/` и является blocking gate в
`npm.cmd run verify`.

## Что проверяется автоматически

Команда:

```powershell
npm.cmd run build
npm.cmd run performance:budget
```

`scripts/check-performance-budget.mjs` читает production HTML, связанные CSS,
page-level JavaScript с его статическими импортами и LCP-кандидаты с
`fetchpriority="high"` или `loading="eager"`.

Размеры считаются в KiB по файлам build output без сетевого сжатия. Для
`<picture>` используется современный AVIF/WebP-кандидат, который выбирает
современный браузер; fallback JPG/PNG остаётся частью image pipeline, но не
является основным LCP-бюджетом.

## Blocking budgets

| Маршрут                     | Тип страницы      | First load |      CSS |       JS | LCP image |
| --------------------------- | ----------------- | ---------: | -------: | -------: | --------: |
| `/`                         | Главная           |  160.0 KiB | 40.0 KiB | 20.0 KiB |  80.0 KiB |
| `/works/`                   | Каталог           |  130.0 KiB | 40.0 KiB | 20.0 KiB |   0.0 KiB |
| `/experience/color-return/` | Интерактив canvas |  160.0 KiB | 40.0 KiB | 28.0 KiB |  48.0 KiB |
| `/experience/details/`      | Интерактив zoom   |  170.0 KiB | 44.0 KiB | 28.0 KiB |  48.0 KiB |
| `/experience/light/`        | Интерактив света  |  380.0 KiB | 44.0 KiB | 24.0 KiB | 260.0 KiB |

Для каталога LCP ожидается текстовым или layout-элементом, поэтому
high-priority изображений на `/works/` быть не должно.

Существенное превышение любого из этих чисел считается блокирующей регрессией:
`npm.cmd run performance:budget` завершится с ошибкой, а `npm.cmd run verify`
не пройдёт.

## Mobile и Lighthouse ориентиры

Ручной Lighthouse-профиль:

- режим: mobile;
- throttling: Lighthouse default simulated Slow 4G + CPU slowdown;
- проверять отдельно `/works/`, `/experience/color-return/`,
  `/experience/details/`, `/experience/light/`;
- целевой Performance score: не ниже 85 для контентных страниц и каталога, не
  ниже 80 для интерактивов;
- целевой LCP: до 2.8 s для каталога и до 3.5 s для интерактивов;
- CLS: до 0.1;
- Total Blocking Time: до 200 ms для каталога и до 300 ms для интерактивов.

Эти Lighthouse числа пока являются QA-ориентирами, а не автоматическим gate:
локальная машина, browser cache и preview-сервер могут заметно влиять на
результат. Blocking regression для текущего этапа определяется статическим
budget gate выше.
