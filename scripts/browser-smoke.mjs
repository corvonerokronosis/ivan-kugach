import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { chromium } from "playwright";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const smokeViewport = { width: 1280, height: 820 };
const routes = {
  home: "/",
  catalog: "/works/",
  colorReveal: "/experience/color-return/",
  details: "/experience/details/",
  light: "/experience/light/",
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
  await smokeContentRoutes();
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

  const firstWorkLink = page
    .locator('a[href^="/works/"]:not([href="/works/"])')
    .first();
  const firstWorkHref = await firstWorkLink.getAttribute("href");
  assert(
    Boolean(firstWorkHref),
    "В каталоге должна быть ссылка на страницу работы.",
  );
  await firstWorkLink.click();
  await page.waitForURL(toUrl(firstWorkHref));
  await assertVisible(page.getByRole("heading", { level: 1 }).first());

  await page.getByRole("button", { name: "Подготовить заявку" }).click();
  await assertVisible(page.getByText("Проверьте отмеченные поля."));

  await page.locator('input[name="name"]').fill("Тестовый посетитель");
  await page.locator('input[name="email"]').fill("visitor@example.test");
  await page.locator('input[name="consent"]').check();
  await page.getByRole("button", { name: "Подготовить заявку" }).click();
  await assertVisible(page.getByText(/подготовлена для проверки/i));

  await page.close();
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
  return new URL(pathname, baseUrl).toString();
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
  const safePathname = decodeURIComponent(pathname).replace(/^\/+/, "");
  const candidates = [];

  if (pathname === "/" || pathname.endsWith("/")) {
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
