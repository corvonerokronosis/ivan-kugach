# Image inventory

Инвентаризация production-изображений после FRT-044. Документ фиксирует
текущие web-ассеты, их назначение и ожидаемые варианты для следующего шага
оптимизации. Файлы перечислены только из активного контура `src/assets/images/`;
`archive/`, `experiments/`, `scrns/` и generated output не входят в этот список.

## Правила

- Production web-ассеты лежат в `src/assets/images/` и имеют lowercase
  kebab-case имена без пробелов.
- Изображения сгруппированы по предметной области: `works/` для каталога,
  `interactive/` для интерактивного маршрута.
- Отдельных master/original-файлов в активном frontend-контуре нет. Текущие
  файлы считаются web-источниками для Astro и legacy baseline; если появятся
  исходники большего качества, их нельзя импортировать напрямую в UI.
- FRT-045 должен строить hero, thumbnail, detail и interactive-варианты от
  этих web-источников через Astro image pipeline.

## Production Assets

| Файл                                                              |    Размер |    Вес | Назначение                                                             | Текущие поверхности                                                                                                  | Варианты для FRT-045                    |
| ----------------------------------------------------------------- | --------: | -----: | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| `src/assets/images/interactive/color-reveal/kugach-picture-1.png` |   579x480 | 584 KB | Источник интерактива раскрытия цвета и временный narrative-визуал      | `/experience/color-return/`, `/experience/story/*`, `/`, `/artist/`, `/ui-preview/`, legacy `index_masterskaya.html` | `interactive`, `hero`, `thumbnail`      |
| `src/assets/images/interactive/details/kugach-picture-2.png`      |   373x480 | 409 KB | Источник zoom/hotspot-интерактива деталей и временный narrative-визуал | `/experience/details/`, `/experience/story/*`, `/`, `/artist/`, legacy `index_masterskaya.html`                      | `interactive`, `hero`, `thumbnail`      |
| `src/assets/images/interactive/light/dor-6254.jpg`                | 3436x2291 | 3.8 MB | Вторая работа интерактива света                                        | `/experience/light/`, legacy `index_masterskaya.html`                                                                | `interactive`, `thumbnail`              |
| `src/assets/images/interactive/light/dor-6258.jpg`                | 3173x2115 | 3.2 MB | Основная работа интерактива света и preview маршрута                   | `/experience/light/`, `/experience/story/light-bridge/`, `/`, legacy `index_masterskaya.html`                        | `interactive`, `hero`, `thumbnail`      |
| `src/assets/images/interactive/light/dor-6263.jpg`                | 3396x2264 | 4.8 MB | Третья работа интерактива света                                        | `/experience/light/`, legacy `index_masterskaya.html`                                                                | `interactive`, `thumbnail`              |
| `src/assets/images/works/dor-3518.jpg`                            | 6623x4724 | 2.9 MB | Основная работа каталога, обложка демо-серии и OG-image legacy         | `/works/`, `/works/dor-3518/`, `/series/demo-series-needs-title/`, `/`, legacy `index_masterskaya.html`              | `hero`, `thumbnail`, `detail`, `social` |
| `src/assets/images/works/dor-3571.jpg`                            | 6759x4724 | 6.5 MB | Доступная работа каталога                                              | `/works/`, `/works/dor-3571/`, `/series/demo-series-needs-title/`, legacy `index_masterskaya.html`                   | `thumbnail`, `detail`                   |
| `src/assets/images/works/dsc-8578.jpg`                            | 1335x1707 | 940 KB | Зарезервированная работа каталога                                      | `/works/`, `/works/dsc-8578/`, `/series/demo-series-needs-title/`, legacy `index_masterskaya.html`                   | `thumbnail`, `detail`                   |
| `src/assets/images/works/dsc-8599.jpg`                            | 2560x1621 | 1.6 MB | Архивная проданная работа                                              | `/archive/`, `/works/dsc-8599/`, `/series/demo-series-needs-title/`, legacy `index_masterskaya.html`                 | `thumbnail`, `detail`                   |
| `src/assets/images/works/dsc-8602.jpg`                            | 1414x1707 | 898 KB | Архивная проданная работа                                              | `/archive/`, `/works/dsc-8602/`, `/series/demo-series-needs-title/`, legacy `index_masterskaya.html`                 | `thumbnail`, `detail`                   |

## Проверки FRT-044

- Все активные изображения в `src/assets/images/` используются в Astro-коде или
  legacy baseline.
- Старые пути `src/for_sales/`, `src/picture_light_shadow/` и файлы
  `Kugach_picture_*.png` больше не используются.
- Имена файлов и директорий приведены к lowercase kebab-case.
- В активном frontend-контуре нет отдельной директории оригиналов, поэтому UI
  не загружает master/original-файлы напрямую.
