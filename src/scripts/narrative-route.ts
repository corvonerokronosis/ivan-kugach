const initializedNarrativeRoutes = new WeakSet<HTMLElement>();

function setupNarrativeRoute(root: HTMLElement): void {
  if (initializedNarrativeRoutes.has(root)) {
    return;
  }

  const completionPath = root.dataset.completionPath;
  const nextButton = root.querySelector<HTMLButtonElement>(
    "[data-narrative-next]",
  );

  if (!completionPath || !isCanonicalPath(completionPath)) {
    return;
  }

  const completeRoute = (): void => {
    window.location.replace(completionPath);
  };

  root.addEventListener("narrative:complete", completeRoute);
  root.addEventListener("narrative:skip", completeRoute);
  initializedNarrativeRoutes.add(root);

  window.requestAnimationFrame(() => {
    nextButton?.focus({ preventScroll: true });
  });
}

function isCanonicalPath(pathname: string): boolean {
  return (
    pathname.startsWith("/") &&
    (pathname === "/" || pathname.endsWith("/")) &&
    !pathname.includes("?") &&
    !pathname.includes("#")
  );
}

document
  .querySelectorAll<HTMLElement>("[data-narrative-route]")
  .forEach(setupNarrativeRoute);
