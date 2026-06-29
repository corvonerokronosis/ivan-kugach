import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const distDir = path.join(rootDir, "dist");
const kib = 1024;

const routes = [
  {
    label: "Главная",
    route: "/",
    htmlFile: "index.html",
    budget: {
      firstLoad: 160 * kib,
      css: 40 * kib,
      js: 20 * kib,
      lcpImage: 80 * kib,
    },
  },
  {
    label: "Каталог",
    route: "/works/",
    htmlFile: "works/index.html",
    budget: {
      firstLoad: 130 * kib,
      css: 40 * kib,
      js: 20 * kib,
      lcpImage: 0,
    },
  },
  {
    label: "Возвращение цвета",
    route: "/experience/color-return/",
    htmlFile: "experience/color-return/index.html",
    budget: {
      firstLoad: 160 * kib,
      css: 40 * kib,
      js: 28 * kib,
      lcpImage: 48 * kib,
    },
  },
  {
    label: "Приблизить детали",
    route: "/experience/details/",
    htmlFile: "experience/details/index.html",
    budget: {
      firstLoad: 170 * kib,
      css: 44 * kib,
      js: 28 * kib,
      lcpImage: 48 * kib,
    },
  },
  {
    label: "Свет в мастерской",
    route: "/experience/light/",
    htmlFile: "experience/light/index.html",
    budget: {
      firstLoad: 380 * kib,
      css: 44 * kib,
      js: 24 * kib,
      lcpImage: 260 * kib,
    },
  },
];

if (!existsSync(distDir)) {
  fail("dist/ не найден. Сначала выполните npm.cmd run build.");
}

const results = routes.map(measureRoute);
const failures = [];

for (const result of results) {
  compare(result, "firstLoad", result.totalBytes, failures);
  compare(result, "css", result.cssBytes, failures);
  compare(result, "js", result.jsBytes, failures);
  compare(result, "lcpImage", result.lcpImageBytes, failures);
}

printReport(results);

if (failures.length > 0) {
  console.error("\nPerformance budget exceeded:");
  failures.forEach((message) => console.error(`- ${message}`));
  process.exitCode = 1;
}

function measureRoute(routeConfig) {
  const htmlPath = path.join(distDir, routeConfig.htmlFile);
  const html = read(htmlPath);
  const cssFiles = extractAttribute(
    html,
    /<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi,
    "href",
  );
  const scriptFiles = extractAttribute(
    html,
    /<script\b[^>]*\bsrc=["'][^"']+["'][^>]*>/gi,
    "src",
  );
  const jsFiles = collectJavaScriptFiles(scriptFiles);
  const lcpImages = findPriorityImages(html);

  const htmlBytes = size(htmlPath);
  const cssBytes = sumFiles(cssFiles);
  const jsBytes = sumFiles(jsFiles);
  const lcpImageBytes = sumFiles(lcpImages.map((image) => image.src));

  return {
    ...routeConfig,
    htmlBytes,
    cssBytes,
    jsBytes,
    lcpImageBytes,
    totalBytes: htmlBytes + cssBytes + jsBytes + lcpImageBytes,
    cssFiles,
    jsFiles,
    lcpImages,
  };
}

function compare(result, field, value, failures) {
  const limit = result.budget[field];
  if (value > limit) {
    failures.push(
      `${result.route} ${field}: ${formatBytes(value)} > ${formatBytes(limit)}`,
    );
  }
}

function printReport(results) {
  console.log("Performance budget check:");
  console.log(
    ["Route", "Status", "First load", "CSS", "JS", "LCP image", "Budget"].join(
      " | ",
    ),
  );
  console.log(
    ["---", ":---:", "---:", "---:", "---:", "---:", "---:"].join(" | "),
  );

  for (const result of results) {
    console.log(
      [
        `${result.label} (${result.route})`,
        routePassed(result) ? "PASS" : "FAIL",
        formatBytes(result.totalBytes),
        formatBytes(result.cssBytes),
        formatBytes(result.jsBytes),
        formatBytes(result.lcpImageBytes),
        formatBytes(result.budget.firstLoad),
      ].join(" | "),
    );
  }

  if (failures.length === 0) {
    console.log("\nPerformance budget result: PASS");
  }
}

function routePassed(result) {
  return (
    result.totalBytes <= result.budget.firstLoad &&
    result.cssBytes <= result.budget.css &&
    result.jsBytes <= result.budget.js &&
    result.lcpImageBytes <= result.budget.lcpImage
  );
}

function collectJavaScriptFiles(entryFiles) {
  const visited = new Set();

  function visit(assetUrl) {
    const assetPath = toDistPath(assetUrl);
    if (visited.has(assetUrl)) {
      return;
    }

    visited.add(assetUrl);
    const source = read(assetPath);
    const imports = source.matchAll(
      /(?:from\s*|import\s*\(\s*)["']([^"']+)["']/g,
    );

    for (const match of imports) {
      const importedUrl = match[1];
      if (!importedUrl.startsWith(".")) {
        continue;
      }

      const resolved = path
        .join(path.dirname(assetUrl), importedUrl)
        .replaceAll("\\", "/");
      visit(resolved.startsWith("/") ? resolved : `/${resolved}`);
    }
  }

  entryFiles.forEach(visit);
  return [...visited];
}

function findPriorityImages(html) {
  const images = [];
  const pictureMatches = [...html.matchAll(/<picture\b[\s\S]*?<\/picture>/gi)];
  let htmlWithoutPictures = html;

  for (const match of pictureMatches) {
    const picture = match[0];
    htmlWithoutPictures = htmlWithoutPictures.replace(picture, "");
    const imageTag = picture.match(/<img\b[^>]*>/i)?.[0];
    if (!imageTag || !isPriorityImage(imageTag)) {
      continue;
    }

    const sourceTag = picture.match(
      /<source\b[^>]*type=["']image\/(?:avif|webp)["'][^>]*>/i,
    )?.[0];
    const srcset = sourceTag ? getAttribute(sourceTag, "srcset") : "";
    const candidates = srcset
      ? parseSrcset(srcset)
      : [getAttribute(imageTag, "src")];
    const src = largestExistingAsset(candidates);
    if (src) {
      images.push({ src, tag: imageTag });
    }
  }

  for (const match of htmlWithoutPictures.matchAll(/<img\b[^>]*>/gi)) {
    const imageTag = match[0];
    if (!isPriorityImage(imageTag)) {
      continue;
    }

    const src = getAttribute(imageTag, "src");
    if (src) {
      images.push({ src, tag: imageTag });
    }
  }

  return images;
}

function isPriorityImage(imageTag) {
  return (
    getAttribute(imageTag, "fetchpriority") === "high" ||
    getAttribute(imageTag, "loading") === "eager"
  );
}

function extractAttribute(html, tagPattern, attributeName) {
  return [...html.matchAll(tagPattern)]
    .map((match) => getAttribute(match[0], attributeName))
    .filter(Boolean);
}

function getAttribute(tag, name) {
  const pattern = new RegExp(`${name}=["']([^"']+)["']`, "i");
  return tag.match(pattern)?.[1] ?? "";
}

function parseSrcset(srcset) {
  return srcset
    .split(",")
    .map((candidate) => candidate.trim().split(/\s+/)[0])
    .filter(Boolean);
}

function largestExistingAsset(assetUrls) {
  return assetUrls
    .filter((assetUrl) => existsSync(toDistPath(assetUrl)))
    .sort((left, right) => size(toDistPath(right)) - size(toDistPath(left)))[0];
}

function sumFiles(assetUrls) {
  return assetUrls.reduce(
    (total, assetUrl) => total + size(toDistPath(assetUrl)),
    0,
  );
}

function toDistPath(assetUrl) {
  const pathname = assetUrl.split("?")[0];
  return path.join(distDir, pathname.replace(/^\//, ""));
}

function read(filePath) {
  return readFileSync(filePath, "utf8");
}

function size(filePath) {
  return statSync(filePath).size;
}

function formatBytes(bytes) {
  return `${(bytes / kib).toFixed(1)} KiB`;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
