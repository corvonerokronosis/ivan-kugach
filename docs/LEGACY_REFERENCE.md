# Архивный legacy-reference

Документ объединяет сведения, которые ещё полезны для исторической сверки:
статус старой точки входа, функциональные ориентиры и индекс baseline PNG.
Legacy не является источником новых продуктовых решений.

## Статус точек входа

| Роль             | Путь                             | Статус                                                                 |
| ---------------- | -------------------------------- | ---------------------------------------------------------------------- |
| Исходная главная | `src/pages/index.astro`          | Единственная поддерживаемая главная и route `/`                        |
| Production entry | `dist/index.html`                | Генерируется `npm.cmd run build`; не редактируется и не хранится в Git |
| Legacy-reference | `archive/index_masterskaya.html` | Исторический proof-of-concept; не участвует в build и production       |

После завершённого переключения нельзя восстанавливать корневой legacy HTML,
создавать рукописный `index.html` или использовать архив как основу новых
изменений. При регрессии исправляется Astro-контур. Откат опубликованной версии
выполняется средствами deployment к предыдущему проверенному `dist/`.

## Когда обращаться к legacy

- Нужно понять исходную последовательность экранов или состояние старой
  модалки.
- Нужно сравнить визуальное направление Astro-страницы с зафиксированным PNG.
- Нужно проверить, было ли отличие намеренным при миграции.

Сначала используйте поиск по точному ID, функции, константе или CSS-классу. Не
читайте весь `archive/index_masterskaya.html` без необходимости.

```powershell
rg -n "landingScreen|experienceScreen|exploreScreen|lightScreen|salesScreen" archive/index_masterskaya.html
rg -n "NARRATIVE_SEQUENCES|HOTSPOTS|LIGHT_WORKS|SALES_WORKS" archive/index_masterskaya.html
rg -n "showScreen|goToExperience|fitExploreView|updateLightState" archive/index_masterskaya.html
```

## Функциональная карта старого прототипа

Legacy был одностраничным приложением без URL-state. Основной маршрут:

1. Главная мастерской.
2. Narrative intro.
3. «Возвращение цвета» и completion modal.
4. Narrative bridge.
5. «Приблизить детали» и completion modal.
6. Narrative light bridge.
7. «Свет в мастерской» и completion modal.
8. Narrative finale и возврат на главную.

Отдельно существовали прямые входы в три интерактива и каталог. Каталог
содержал доступные, зарезервированные и проданные работы, detail modal и две
frontend-only формы. Данные не отправлялись: отсутствовали backend, оплата,
email, CRM и постоянное browser storage.

При сверке поведения проверяйте:

- мышь, touch и доступные клавиатурные действия;
- reset, повторный вход и возврат;
- dialog focus, `Escape` и восстановление фокуса;
- desktop и mobile;
- отсутствие ошибок в console;
- намеренные отличия Astro: самостоятельные URL, доступные native dialogs,
  исправленный overflow, reduced motion и responsive images.

Точные текущие сценарии всегда проверяются по `src/pages/`, `src/components/`
и `src/scripts/`, а не по архивной разметке.

## Visual baseline

Снимки сделаны 19 июня 2026 года в Chromium: desktop `1440x900`, mobile
`390x844`. Они фиксируют старую композицию и художественное направление, но не
являются новой дизайн-спецификацией.

| Экран              | Desktop                                                                             | Mobile                                                                             |
| ------------------ | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Главная мастерской | [`01-landing.png`](visual-baseline/legacy/desktop/01-landing.png)                   | [`01-landing.png`](visual-baseline/legacy/mobile/01-landing.png)                   |
| Narrative intro    | [`02-narrative-intro.png`](visual-baseline/legacy/desktop/02-narrative-intro.png)   | [`02-narrative-intro.png`](visual-baseline/legacy/mobile/02-narrative-intro.png)   |
| Возвращение цвета  | [`03-color-return.png`](visual-baseline/legacy/desktop/03-color-return.png)         | [`03-color-return.png`](visual-baseline/legacy/mobile/03-color-return.png)         |
| Приблизить детали  | [`04-details-explorer.png`](visual-baseline/legacy/desktop/04-details-explorer.png) | [`04-details-explorer.png`](visual-baseline/legacy/mobile/04-details-explorer.png) |
| Свет в мастерской  | [`05-light-workshop.png`](visual-baseline/legacy/desktop/05-light-workshop.png)     | [`05-light-workshop.png`](visual-baseline/legacy/mobile/05-light-workshop.png)     |
| Каталог и архив    | [`06-sales-catalog.png`](visual-baseline/legacy/desktop/06-sales-catalog.png)       | [`06-sales-catalog.png`](visual-baseline/legacy/mobile/06-sales-catalog.png)       |

Desktop-состояния:

| Состояние            | Снимок                                                                                          |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| Цвет раскрыт         | [`07-color-complete-modal.png`](visual-baseline/legacy/desktop/07-color-complete-modal.png)     |
| Текст hotspot        | [`08-hotspot-story-modal.png`](visual-baseline/legacy/desktop/08-hotspot-story-modal.png)       |
| Все hotspots открыты | [`09-details-complete-modal.png`](visual-baseline/legacy/desktop/09-details-complete-modal.png) |
| Все состояния света  | [`10-light-complete-modal.png`](visual-baseline/legacy/desktop/10-light-complete-modal.png)     |
| Детали работы        | [`11-sales-detail-modal.png`](visual-baseline/legacy/desktop/11-sales-detail-modal.png)         |
| Форма заказа         | [`12-sales-order-modal.png`](visual-baseline/legacy/desktop/12-sales-order-modal.png)           |

При визуальной сверке сохраняются тёплая мастерская, физические рамы, бумажные
поверхности, тёмно-коричневый UI, терракотовый акцент и ясная иерархия. Не
считаются регрессией улучшения семантики, focus, touch targets, reduced motion,
responsive images и исправление legacy overflow.
