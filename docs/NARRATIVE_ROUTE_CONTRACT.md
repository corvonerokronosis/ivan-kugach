# Контракт URL narrative-маршрута

Документ фиксирует действующий URL-контракт narrative-страниц. Исполняемая
конфигурация находится в `src/data/narrative-routes.ts`; при расхождении
приоритет имеет код.

## Граница URL и внутреннего состояния

- Каждый narrative-блок является отдельным переходным шагом со стабильным URL.
- Отдельный слайд не получает собственного URL, query-параметра или history entry.
- Текущий индекс слайда — локальное состояние `NarrativeSequence.astro`. Обновление страницы начинает блок с первого слайда.
- Completion-модалки интерактивов остаются частью своих страниц; самостоятельный URL получает только открываемый из них narrative-блок.
- `/ui-preview/` остаётся технической страницей и не входит в продуктовый маршрут.

## Карта маршрута

| После страницы              | Narrative URL                     | После завершения или пропуска |
| --------------------------- | --------------------------------- | ----------------------------- |
| `/` или `/experience/`      | `/experience/story/intro/`        | `/experience/color-return/`   |
| `/experience/color-return/` | `/experience/story/bridge/`       | `/experience/details/`        |
| `/experience/details/`      | `/experience/story/light-bridge/` | `/experience/light/`          |
| `/experience/light/`        | `/experience/story/finale/`       | `/`                           |

Прямые входы `/experience/color-return/`, `/experience/details/` и `/experience/light/` сохраняются. Они загружают собственное начальное состояние и не проверяют, был ли пройден предыдущий этап.

## Правило browser history

1. Переход со страницы или completion-модалки в narrative выполняется обычной навигацией (`push` / ссылка).
2. Переключение слайдов не меняет URL и history.
3. `narrative:complete` и `narrative:skip` ведут в один `completionPath` через `window.location.replace(...)`.
4. Поэтому Back после завершения блока возвращает к предыдущему содержательному этапу, а не к последнему слайду уже завершённого narrative.

Пример последовательного фрагмента history:

```text
/experience/color-return/
  -> push /experience/story/bridge/
  -> replace /experience/details/
  -> Back возвращает /experience/color-return/
```

При прямом входе в narrative URL страница получает последовательность только из pathname. Глобальное состояние, `sessionStorage` или заранее созданный runtime-контекст не требуются.

## Проверка после изменений

- Generated-страницы создаёт `src/pages/experience/story/[sequence].astro`.
- Completion-состояния интерактивов используют обычные ссылки на narrative URL.
- После изменения проверить direct entry, refresh, последовательный маршрут и
  browser Back в production preview по `docs/QA_CHECKLIST.md`.
