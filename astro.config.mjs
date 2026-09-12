import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { URL } from "node:url";

const site = "https://corvonerokronosis.github.io";
const base = "/ivan-kugach";
const excludedSitemapPathPrefixes = ["/404", "/ui-preview"];

export default defineConfig({
  site,
  base,
  output: "static",
  // Preserve Astro 6 whitespace semantics during the Astro 7 migration.
  compressHTML: true,
  integrations: [
    sitemap({
      filter: (page) => {
        const { pathname } = new URL(page);
        const projectPathname = pathname.startsWith(`${base}/`)
          ? pathname.slice(base.length)
          : pathname;

        return !excludedSitemapPathPrefixes.some((pathPrefix) => {
          return (
            projectPathname === pathPrefix ||
            projectPathname.startsWith(`${pathPrefix}/`)
          );
        });
      },
    }),
  ],
});
