import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { env } from "node:process";
import { URL } from "node:url";

const site = env.PUBLIC_SITE_URL ?? "https://ivan-kugach.example";
const excludedSitemapPathPrefixes = ["/404", "/ui-preview"];

export default defineConfig({
  site,
  output: "static",
  integrations: [
    sitemap({
      filter: (page) => {
        const { pathname } = new URL(page);

        return !excludedSitemapPathPrefixes.some((pathPrefix) => {
          return (
            pathname === pathPrefix || pathname.startsWith(`${pathPrefix}/`)
          );
        });
      },
    }),
  ],
});
