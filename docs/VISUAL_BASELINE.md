# Visual baseline legacy-прототипа

Эталонные снимки legacy-прототипа, который после FRT-062 хранится в
`archive/index_masterskaya.html`. Они фиксируют исходное художественное
направление, геометрию экранов, responsive-поведение и состояния интерактивов;
это исторический visual reference, а не новая дизайн-спецификация.

## Параметры съёмки

- Дата: 2026-06-19.
- Исходный источник съёмки: `http://127.0.0.1:4173/index_masterskaya.html`.
- Текущий путь legacy-reference в репозитории:
  `archive/index_masterskaya.html`.
- Desktop viewport: `1440×900`.
- Mobile viewport: `390×844`.
- Формат: PNG, full-page screenshot после завершения переходов и загрузки изображений.
- Инструмент: Playwright Chromium.
- Browser console: функциональных runtime-ошибок нет; зафиксирован только `404` для отсутствующего `/favicon.ico`.
- Full-page PNG сохраняет фактическую ширину документа: `04-details-explorer.png` на mobile имеет ширину `441 px` при viewport `390 px` из-за существующего горизонтального overflow.

## Экраны

| Экран              | Desktop                                                                             | Mobile                                                                             | Что сверять                                                         |
| ------------------ | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Главная мастерской | [`01-landing.png`](visual-baseline/legacy/desktop/01-landing.png)                   | [`01-landing.png`](visual-baseline/legacy/mobile/01-landing.png)                   | Hero-рама, CTA, четыре launch-card, декор и информационные карточки |
| Narrative intro    | [`02-narrative-intro.png`](visual-baseline/legacy/desktop/02-narrative-intro.png)   | [`02-narrative-intro.png`](visual-baseline/legacy/mobile/02-narrative-intro.png)   | Верхняя панель, narrative-card, изображение, тексты и действия      |
| Возвращение цвета  | [`03-color-return.png`](visual-baseline/legacy/desktop/03-color-return.png)         | [`03-color-return.png`](visual-baseline/legacy/mobile/03-color-return.png)         | Canvas-stage, рама, HUD, progress и подсказка                       |
| Приблизить детали  | [`04-details-explorer.png`](visual-baseline/legacy/desktop/04-details-explorer.png) | [`04-details-explorer.png`](visual-baseline/legacy/mobile/04-details-explorer.png) | Viewport, рамка картины, hotspots, zoom-controls и progress         |
| Свет в мастерской  | [`05-light-workshop.png`](visual-baseline/legacy/desktop/05-light-workshop.png)     | [`05-light-workshop.png`](visual-baseline/legacy/mobile/05-light-workshop.png)     | Stage, selector работ, range, заметка и progress states             |
| Каталог и архив    | [`06-sales-catalog.png`](visual-baseline/legacy/desktop/06-sales-catalog.png)       | [`06-sales-catalog.png`](visual-baseline/legacy/mobile/06-sales-catalog.png)       | Hero, карточки работ, серия, архив, форма и legal-блоки             |

## Модалки и завершённые состояния

| Состояние            | Desktop screenshot                                                                              | Как воспроизведено                                                  |
| -------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Цвет раскрыт         | [`07-color-complete-modal.png`](visual-baseline/legacy/desktop/07-color-complete-modal.png)     | Запущено штатное auto-complete; progress `100%`, открыт `infoModal` |
| Текст hotspot        | [`08-hotspot-story-modal.png`](visual-baseline/legacy/desktop/08-hotspot-story-modal.png)       | Активирован hotspot `sign`, открыт `storyModal`                     |
| Все hotspots открыты | [`09-details-complete-modal.png`](visual-baseline/legacy/desktop/09-details-complete-modal.png) | Просмотрены `sign`, `crack`, `window`, `brick`                      |
| Все состояния света  | [`10-light-complete-modal.png`](visual-baseline/legacy/desktop/10-light-complete-modal.png)     | Просмотрены `morning`, `day`, `evening`, `lamp`                     |
| Детали работы        | [`11-sales-detail-modal.png`](visual-baseline/legacy/desktop/11-sales-detail-modal.png)         | Открыта первая карточка основного каталога                          |
| Форма заказа         | [`12-sales-order-modal.png`](visual-baseline/legacy/desktop/12-sales-order-modal.png)           | Открыт CTA первой доступной работы                                  |

## Что является обязательным визуальным контрактом

- Тёплая мастерская с деревянным фоном, верхним светом и декоративными холстами.
- Картины и основные интерактивные stage оформлены как физические рамы.
- Бумажные поверхности, тёмно-коричневый UI и терракотовый основной акцент.
- Контрастная serif-типографика заголовков и спокойная музейная плотность текста.
- Понятная иерархия: вводный текст → основное действие → художественный объект → progress/пояснение.
- Отдельный, более спокойный коммерческий сценарий каталога без стилистического разрыва с мастерской.
- На mobile все основные действия, тексты, изображения и progress остаются доступны без горизонтального overflow.

## Допустимые намеренные отличия Astro-версии

Следующие изменения не считаются регрессией, если они зафиксированы в задаче и не разрушают художественное направление:

- настоящие URL и обычные переходы между страницами вместо скрытия `.screen` в одном DOM;
- семантические landmarks, skip-link, корректный порядок заголовков и нативные/доступные dialogs;
- улучшенная keyboard-navigation, focus-state, touch-target и reduced-motion;
- оптимизированные responsive-изображения при сохранении содержания и логики кадрирования;
- исправление clipping, горизонтального overflow и слишком плотных mobile-композиций;
- разбиение монолитных экранов на компоненты без появления лишних визуальных контейнеров;
- исправление отсутствующего favicon и других чисто технических ошибок загрузки;
- замена явно временных продуктовых текстов и атрибуций только в отдельной согласованной контентной задаче.

## Известные legacy-дефекты

- Отсутствует `/favicon.ico`, поэтому browser console получает один `404`.
- Mobile-экран «Приблизить детали» выходит за viewport `390 px`; новая версия должна убрать горизонтальный overflow, сохранив доступность картины, hotspots и controls.
- Некоторые desktop full-page screenshots выше `900 px`, потому что содержимое экрана не помещается в один viewport. При сравнении отдельно проверять первый viewport и всю страницу.

## Что не допускается без отдельного решения

- смена тёплой мастерской на нейтральную белую галерею;
- удаление рам, бумажных поверхностей и ключевой пространственной метафоры;
- изменение продуктовых текстов, цен, статусов или числа работ «заодно» с миграцией;
- превращение каталога или интерактивов в типовой card-grid/bento-интерфейс;
- изменение порядка основного narrative-маршрута;
- замена реальных изображений заглушками, CSS-рисунками или несогласованными ассетами.

## Порядок сравнения после переноса

1. Открыть соответствующий legacy PNG в этом документе.
2. Снять новую страницу в том же viewport.
3. Сравнить copy, композицию первого viewport, рамки, типографику, цвета, изображения, controls и progress.
4. Отдельно проверить mobile и связанное modal/completion-состояние.
5. Любое заметное отличие либо исправить, либо записать как намеренное до завершения задачи.
