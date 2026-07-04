type NarrativeEventName =
  | "narrative:slidechange"
  | "narrative:complete"
  | "narrative:skip";

interface NarrativeEventDetail {
  sequenceId: string;
  slideId: string;
  index: number;
  total: number;
  completionAction: string;
}

const initializedNarratives = new WeakSet<HTMLElement>();

function setupNarrativeSequence(root: HTMLElement): void {
  if (initializedNarratives.has(root)) {
    return;
  }

  const slides = Array.from(
    root.querySelectorAll<HTMLElement>("[data-narrative-slide]"),
  );
  const previousButton = root.querySelector<HTMLButtonElement>(
    "[data-narrative-previous]",
  );
  const nextButton = root.querySelector<HTMLButtonElement>(
    "[data-narrative-next]",
  );
  const skipButton = root.querySelector<HTMLButtonElement>(
    "[data-narrative-skip]",
  );

  if (slides.length === 0 || !previousButton || !nextButton || !skipButton) {
    return;
  }

  const previousControl = previousButton;
  const nextControl = nextButton;
  const skipControl = skipButton;

  const sequenceId = root.dataset.sequenceId ?? "";
  const completionAction = root.dataset.completionAction ?? "";
  const completionLabel = root.dataset.completionLabel ?? "Завершить блок";
  const parsedInitialIndex = Number.parseInt(
    root.dataset.initialIndex ?? "0",
    10,
  );
  let currentIndex = Number.isNaN(parsedInitialIndex)
    ? 0
    : Math.max(0, Math.min(slides.length - 1, parsedInitialIndex));

  function getEventDetail(): NarrativeEventDetail {
    return {
      sequenceId,
      slideId: slides[currentIndex]?.dataset.slideId ?? "",
      index: currentIndex,
      total: slides.length,
      completionAction,
    };
  }

  function dispatchNarrativeEvent(name: NarrativeEventName): void {
    root.dispatchEvent(
      new CustomEvent<NarrativeEventDetail>(name, {
        bubbles: true,
        detail: getEventDetail(),
      }),
    );
  }

  function render(announceChange = true): void {
    slides.forEach((slide, index) => {
      slide.hidden = index !== currentIndex;
    });
    root.dataset.currentIndex = String(currentIndex);
    previousControl.disabled = currentIndex === 0;
    nextControl.textContent =
      currentIndex === slides.length - 1 ? completionLabel : "Далее";

    if (announceChange) {
      dispatchNarrativeEvent("narrative:slidechange");
    }
  }

  function move(direction: -1 | 1): void {
    const nextIndex = currentIndex + direction;

    if (direction === 1 && nextIndex >= slides.length) {
      dispatchNarrativeEvent("narrative:complete");
      return;
    }

    const boundedIndex = Math.max(0, Math.min(slides.length - 1, nextIndex));
    if (boundedIndex === currentIndex) {
      return;
    }

    currentIndex = boundedIndex;
    render();
  }

  previousControl.addEventListener("click", () => move(-1));
  nextControl.addEventListener("click", () => move(1));
  skipControl.addEventListener("click", () => {
    dispatchNarrativeEvent("narrative:skip");
  });
  root.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    }
  });

  initializedNarratives.add(root);
  render(false);
}

document
  .querySelectorAll<HTMLElement>("[data-narrative-sequence]")
  .forEach(setupNarrativeSequence);
