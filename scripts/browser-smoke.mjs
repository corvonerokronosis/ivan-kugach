import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { chromium } from "playwright";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const siteBase = "/ivan-kugach";
const smokeViewport = { width: 1280, height: 820 };
const compactDesktopViewport = { width: 1180, height: 760 };
const tabletViewport = { width: 820, height: 1180 };
const mobileMediaViewport = { width: 390, height: 844 };
const routes = {
  home: "/",
  catalog: "/works/",
  colorReveal: "/experience/color-return/",
  details: "/experience/details/",
  light: "/experience/light/",
  uiPreview: "/ui-preview/",
};

if (!existsSync(distDir)) {
  fail(
    "dist/ не найден. Запустите npm.cmd run build или npm.cmd run test:smoke.",
  );
}

const server = await startStaticServer();
const baseUrl = `http://127.0.0.1:${server.port}`;
const browser = await chromium.launch();
const context = await browser.newContext({
  reducedMotion: "reduce",
  viewport: smokeViewport,
});
const runtimeErrors = [];

try {
  await smokeStaticHeader();
  await smokeContentRoutes();
  await smokeUiPrimitives();
  await smokeColorReveal();
  await smokeDetailsExplorer();
  await smokeLightWorkshop();

  if (runtimeErrors.length > 0) {
    fail(
      [
        "Browser smoke runtime errors:",
        ...runtimeErrors.map((message) => `- ${message}`),
      ].join("\n"),
    );
  }

  console.log("Browser smoke result: PASS");
} finally {
  await context.close();
  await browser.close();
  await server.close();
}

async function smokeStaticHeader() {
  const page = await newSmokePage();

  await page.setViewportSize(compactDesktopViewport);
  await page.goto(toUrl(routes.home));
  await assertVisible(
    page.getByRole("heading", { level: 1, name: /Войти в картину/i }),
  );

  const skipLink = page.getByRole("link", { name: "Перейти к содержанию" });
  await page.keyboard.press("Tab");
  assert(
    await skipLink.evaluate(
      (element) => element.ownerDocument.activeElement === element,
    ),
    "Skip-link должен быть первым элементом Tab-порядка.",
  );
  await skipLink.click();
  assert(
    await page
      .locator("#main-content")
      .evaluate((element) => element.ownerDocument.activeElement === element),
    "Skip-link должен переводить фокус в main-content.",
  );

  const homeCurrentLink = page.locator(
    '.site-navigation__link[aria-current="page"]',
  );
  assert(
    (await homeCurrentLink.count()) === 1 &&
      (await homeCurrentLink.innerText()) === "Главная",
    "Главная должна быть единственным активным пунктом navigation.",
  );

  await assertDesktopHeaderGeometry(page);
  await page.evaluate(() => {
    globalThis.window.scrollTo(0, 600);
  });
  const stickyNavTop = await page
    .locator(".site-navigation")
    .evaluate((element) => element.getBoundingClientRect().top);
  assert(
    stickyNavTop >= 15 && stickyNavTop <= 25,
    `Sticky navigation должна сохранять safe inset, получено ${stickyNavTop}px.`,
  );

  await page.setViewportSize(tabletViewport);
  const tabletHeaderPosition = await page
    .locator(".site-header")
    .evaluate((element) => {
      const view = element.ownerDocument.defaultView;

      if (!view) {
        throw new Error("Window недоступен для проверки tablet header.");
      }

      return view.getComputedStyle(element).position;
    });
  assert(
    tabletHeaderPosition !== "sticky",
    "До отдельного mobile-menu header должен оставаться статичным ниже desktop breakpoint.",
  );

  const tabletLinks = await page.locator(".site-navigation__link").all();
  for (const link of tabletLinks) {
    assert(
      await link.isVisible(),
      "No-JS navigation link должен оставаться видимым на tablet.",
    );
  }

  await page.close();

  const noJsContext = await browser.newContext({
    javaScriptEnabled: false,
    viewport: compactDesktopViewport,
  });
  const noJsPage = await noJsContext.newPage();

  try {
    await noJsPage.goto(toUrl(routes.home));
    await noJsPage.getByRole("link", { name: "Каталог", exact: true }).click();
    await noJsPage.waitForURL(toUrl(routes.catalog));
    await assertVisible(
      noJsPage.getByRole("heading", { level: 1, name: "Каталог работ" }),
    );
  } finally {
    await noJsContext.close();
  }
}

async function assertDesktopHeaderGeometry(page) {
  const geometry = await page.locator(".site-header").evaluate((header) => {
    const view = header.ownerDocument.defaultView;

    if (!view) {
      throw new Error("Window недоступен для проверки desktop header.");
    }

    const navigation = header.querySelector(".site-navigation");
    const items = Array.from(
      header.querySelectorAll(".site-navigation__list li"),
    );

    if (!(navigation instanceof view.HTMLElement) || items.length === 0) {
      throw new Error("Navigation geometry недоступна.");
    }

    const navigationRect = navigation.getBoundingClientRect();
    const itemTops = items.map((item) => item.getBoundingClientRect().top);

    return {
      headerPosition: view.getComputedStyle(header).position,
      itemTopDelta: Math.max(...itemTops) - Math.min(...itemTops),
      navigationLeft: navigationRect.left,
      navigationRight: navigationRect.right,
      navigationTop: navigationRect.top,
      viewportWidth: view.innerWidth,
    };
  });

  assert(
    geometry.headerPosition === "sticky",
    "Header должен быть sticky на compact desktop.",
  );
  assert(
    geometry.itemTopDelta < 1,
    `Desktop navigation должна оставаться в одну строку, delta ${geometry.itemTopDelta}px.`,
  );
  assert(
    geometry.navigationLeft >= 16 &&
      geometry.navigationRight <= geometry.viewportWidth - 16 &&
      geometry.navigationTop >= 16,
    "Sticky navigation должна сохранять safe inset 16–24px от viewport.",
  );
}

async function smokeUiPrimitives() {
  const page = await newSmokePage();

  await page.goto(toUrl(routes.uiPreview));
  await assertVisible(
    page.getByRole("heading", { level: 1, name: "Общие UI-компоненты" }),
  );

  const disabledAction = page.getByRole("button", {
    name: "Недоступное действие",
  });
  assert(
    await disabledAction.isDisabled(),
    "Недоступное Action-действие должно оставаться disabled.",
  );
  await assertVisible(page.getByRole("alert"));

  await page.getByRole("button", { name: "Открыть dialog" }).click();
  await page.locator("#preview-dialog[open]").waitFor();
  await page.getByRole("button", { name: "Остаться" }).click();
  await page.locator("#preview-dialog[open]").waitFor({ state: "detached" });

  await page.evaluate(() => {
    globalThis.document.documentElement.dataset.theme = "dark";
  });
  await assertVisible(page.getByText("Успешное состояние"));

  await page.setViewportSize(mobileMediaViewport);
  const hasHorizontalOverflow = await page.evaluate(
    () =>
      globalThis.document.documentElement.scrollWidth >
      globalThis.window.innerWidth,
  );
  assert(
    !hasHorizontalOverflow,
    "UI primitives не должны создавать горизонтальный overflow на mobile.",
  );

  await page.close();
}

async function smokeContentRoutes() {
  const page = await newSmokePage();

  await page.goto(toUrl(routes.home));
  await assertVisible(
    page.getByRole("heading", { level: 1, name: /Войти в картину/i }),
  );

  await page.getByRole("link", { name: "Работы для покупки" }).click();
  await page.waitForURL(toUrl(routes.catalog));
  await assertVisible(
    page.getByRole("heading", { level: 1, name: "Каталог работ" }),
  );

  await assertStableCatalogMedia(page);
  await page.setViewportSize(mobileMediaViewport);
  await assertStableCatalogMedia(page);
  await page.setViewportSize(smokeViewport);

  const firstWorkLink = page
    .locator(`a[href^="${siteBase}/works/"]:not([href="${siteBase}/works/"])`)
    .first();
  const firstWorkHref = await firstWorkLink.getAttribute("href");
  assert(
    Boolean(firstWorkHref),
    "В каталоге должна быть ссылка на страницу работы.",
  );
  await firstWorkLink.click();
  await page.waitForURL(toUrl(firstWorkHref));
  await assertVisible(page.getByRole("heading", { level: 1 }).first());
  await assertStableWorkMedia(page);

  const catalogCurrentLink = page.locator(
    '.site-navigation__link[aria-current="page"]',
  );
  assert(
    (await catalogCurrentLink.count()) === 1 &&
      (await catalogCurrentLink.innerText()) === "Каталог",
    "Detail route должна сохранять активный раздел Каталог.",
  );

  await page.locator('a[href="#work-inquiry"]').first().click();
  await page.waitForURL(/#work-inquiry$/);
  const anchorGeometry = await page
    .locator("#work-inquiry")
    .evaluate((target) => {
      const navigation = target.ownerDocument.querySelector(".site-navigation");

      if (!navigation) {
        throw new Error("Navigation недоступна для проверки anchor offset.");
      }

      return {
        navigationBottom: navigation.getBoundingClientRect().bottom,
        targetTop: target.getBoundingClientRect().top,
      };
    });
  assert(
    anchorGeometry.targetTop >= anchorGeometry.navigationBottom,
    "Anchor target не должен скрываться под sticky navigation.",
  );

  await page.getByRole("button", { name: "Подготовить заявку" }).click();
  await assertVisible(page.getByText("Проверьте отмеченные поля."));

  await page.locator('input[name="name"]').fill("Тестовый посетитель");
  await page.locator('input[name="email"]').fill("visitor@example.test");
  await page.locator('input[name="consent"]').check();
  await page.getByRole("button", { name: "Подготовить заявку" }).click();
  await assertVisible(page.getByText(/подготовлена для проверки/i));

  await page.close();
}

async function assertStableCatalogMedia(page) {
  const slots = page.locator('[data-media-slot="landscape"]');
  const slotCount = await slots.count();
  const sourceOrientations = new Set();

  assert(slotCount > 1, "В каталоге ожидается несколько медиаслотов.");

  for (let index = 0; index < slotCount; index += 1) {
    const slot = slots.nth(index);
    const image = slot.locator("img");
    const frameRatio = await slot
      .locator(".framed-artwork__frame")
      .evaluate((element) => {
        const { width, height } = element.getBoundingClientRect();

        return width / height;
      });
    const dimensions = await assertReservedImageDimensions(image);
    const objectFit = await image.evaluate((element) => {
      const view = element.ownerDocument.defaultView;

      if (!view) {
        throw new Error("Window недоступен для проверки object-fit.");
      }

      return view.getComputedStyle(element).objectFit;
    });

    assert(
      Math.abs(frameRatio - 4 / 3) < 0.02,
      `Медиаслот каталога должен сохранять 4:3, получено ${frameRatio}.`,
    );
    assert(
      (await slot.getAttribute("data-media-fit")) === "contain",
      'Медиаслот каталога должен явно использовать fit="contain".',
    );
    assert(
      (await image.getAttribute("data-image-fit")) === "contain" &&
        objectFit === "contain",
      "Изображение каталога должно применять object-fit: contain.",
    );

    sourceOrientations.add(
      dimensions.width > dimensions.height ? "landscape" : "portrait",
    );
  }

  assert(
    sourceOrientations.has("landscape") && sourceOrientations.has("portrait"),
    "Каталог должен проверять единый слот на альбомном и портретном исходниках.",
  );
}

async function assertStableWorkMedia(page) {
  const primarySlot = page.locator('[data-media-slot="square"]').first();
  const primaryImage = primarySlot.locator("img");
  const frameRatio = await primarySlot
    .locator(".framed-artwork__frame")
    .evaluate((element) => {
      const { width, height } = element.getBoundingClientRect();

      return width / height;
    });

  await assertReservedImageDimensions(primaryImage);
  assert(
    Math.abs(frameRatio - 1) < 0.02,
    `Основной медиаслот работы должен быть квадратным, получено ${frameRatio}.`,
  );
  assert(
    (await primarySlot.getAttribute("data-media-fit")) === "contain",
    'Основная работа должна явно использовать fit="contain".',
  );
}

async function assertReservedImageDimensions(image) {
  const width = Number(await image.getAttribute("width"));
  const height = Number(await image.getAttribute("height"));

  assert(
    Number.isFinite(width) &&
      width > 0 &&
      Number.isFinite(height) &&
      height > 0,
    "OptimizedImage должен резервировать положительные width и height.",
  );

  return { width, height };
}

async function smokeColorReveal() {
  const page = await newSmokePage();

  await page.goto(toUrl(routes.colorReveal));
  await assertVisible(
    page.getByRole("heading", { level: 1, name: "Возвращение цвета" }),
  );
  await page.locator("[data-reveal-complete]").click();
  await page.locator("#color-reveal-complete-dialog[open]").waitFor();
  await page.locator("[data-reveal-dialog-close]").click();
  await page.locator("#color-reveal-complete-dialog[open]").waitFor({
    state: "detached",
  });

  await page.close();
}

async function smokeDetailsExplorer() {
  const page = await newSmokePage();

  await page.goto(toUrl(routes.details));
  await assertVisible(
    page.getByRole("heading", { level: 1, name: "Приблизить детали" }),
  );

  const hotspots = page.locator("[data-details-hotspot]");
  const hotspotCount = await hotspots.count();
  assert(hotspotCount > 0, "На странице деталей должны быть hotspots.");

  for (let index = 0; index < hotspotCount; index += 1) {
    await hotspots.nth(index).click({ force: true });

    if (index < hotspotCount - 1) {
      await page.locator("#details-hotspot-dialog[open]").waitFor();
      await page.locator("[data-details-dialog-close]").click();
      await page.locator("#details-hotspot-dialog[open]").waitFor({
        state: "detached",
      });
    }
  }

  await page.locator("#details-complete-dialog[open]").waitFor();
  await page.locator("[data-details-complete-close]").click();

  await page.close();
}

async function smokeLightWorkshop() {
  const page = await newSmokePage();

  await page.goto(toUrl(routes.light));
  await assertVisible(
    page.getByRole("heading", { level: 1, name: "Свет в мастерской" }),
  );

  const range = page.locator("[data-light-range]");
  const max = Number(await range.getAttribute("max"));
  assert(
    Number.isFinite(max) && max > 0,
    "У света должен быть range с max > 0.",
  );

  for (let value = 0; value <= max; value += 1) {
    await range.evaluate((element, nextValue) => {
      const view = element.ownerDocument.defaultView;

      if (!view) {
        throw new Error("Window недоступен для range input.");
      }

      element.value = String(nextValue);
      element.dispatchEvent(new view.Event("input", { bubbles: true }));
    }, value);
  }

  await page.locator("#light-workshop-complete-dialog[open]").waitFor();
  await page.locator("[data-light-complete-close]").click();
  await page.locator("#light-workshop-complete-dialog[open]").waitFor({
    state: "detached",
  });

  await page.close();
}

async function newSmokePage() {
  const page = await context.newPage();

  page.on("console", (message) => {
    if (message.type() === "error") {
      runtimeErrors.push(`console error: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => {
    runtimeErrors.push(`page error: ${error.message}`);
  });
  page.on("requestfailed", (request) => {
    const failure = request.failure();

    if (failure) {
      runtimeErrors.push(
        `request failed: ${request.url()} (${failure.errorText})`,
      );
    }
  });
  page.on("response", (response) => {
    if (response.url().startsWith(baseUrl) && response.status() >= 400) {
      runtimeErrors.push(`response ${response.status()}: ${response.url()}`);
    }
  });

  return page;
}

async function assertVisible(locator) {
  await locator.waitFor({ state: "visible" });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function toUrl(pathname) {
  const projectPathname = pathname.startsWith(`${siteBase}/`)
    ? pathname
    : pathname === siteBase
      ? `${siteBase}/`
      : `${siteBase}${pathname}`;

  return new URL(projectPathname, baseUrl).toString();
}

async function startStaticServer() {
  const server = createServer(async (request, response) => {
    const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
    const filePath = await resolveDistPath(requestUrl.pathname);

    if (!filePath) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "content-type": getContentType(filePath),
    });
    createReadStream(filePath).pipe(response);
  });

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });

  const address = server.address();
  assert(
    address && typeof address === "object",
    "Не удалось определить порт smoke-сервера.",
  );

  return {
    port: address.port,
    close: () =>
      new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      }),
  };
}

async function resolveDistPath(pathname) {
  const decodedPathname = decodeURIComponent(pathname);

  if (
    decodedPathname !== siteBase &&
    !decodedPathname.startsWith(`${siteBase}/`)
  ) {
    return null;
  }

  const projectPathname = decodedPathname.slice(siteBase.length) || "/";
  const safePathname = projectPathname.replace(/^\/+/, "");
  const candidates = [];

  if (projectPathname === "/" || projectPathname.endsWith("/")) {
    candidates.push(path.join(distDir, safePathname, "index.html"));
  } else {
    candidates.push(path.join(distDir, safePathname));
    candidates.push(path.join(distDir, safePathname, "index.html"));
  }

  for (const candidate of candidates) {
    const normalized = path.normalize(candidate);

    if (!normalized.startsWith(distDir)) {
      continue;
    }

    if (await isFile(normalized)) {
      return normalized;
    }
  }

  return null;
}

async function isFile(filePath) {
  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
}

function getContentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const contentTypes = {
    ".avif": "image/avif",
    ".css": "text/css; charset=utf-8",
    ".gif": "image/gif",
    ".html": "text/html; charset=utf-8",
    ".ico": "image/x-icon",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".webp": "image/webp",
    ".xml": "application/xml; charset=utf-8",
  };

  return contentTypes[extension] ?? "application/octet-stream";
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
