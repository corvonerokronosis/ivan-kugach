function normalizeBase(baseUrl: string): string {
  const normalized = `/${baseUrl}`.replace(/\/+/g, "/").replace(/\/$/, "");

  return normalized === "" || normalized === "/" ? "" : normalized;
}

export function withBasePath(
  path: string,
  baseUrl = import.meta.env.BASE_URL,
): string {
  if (!path.startsWith("/") || path.startsWith("//")) {
    return path;
  }

  const base = normalizeBase(baseUrl);

  if (!base || path === base || path.startsWith(`${base}/`)) {
    return path;
  }

  return path === "/" ? `${base}/` : `${base}${path}`;
}

export function withoutBasePath(
  pathname: string,
  baseUrl = import.meta.env.BASE_URL,
): string {
  const base = normalizeBase(baseUrl);

  if (!base) {
    return pathname;
  }

  if (pathname === base) {
    return "/";
  }

  return pathname.startsWith(`${base}/`)
    ? pathname.slice(base.length)
    : pathname;
}
