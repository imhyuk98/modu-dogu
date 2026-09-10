import { readFileSync, writeFileSync } from "node:fs";
import { allItems, sections } from "../lib/sections.ts";
import { englishToolHref, englishTools } from "../lib/en-tools.ts";
import { indexableCalculatorResults } from "../lib/calculator-result-indexing.ts";

const origin = "https://modu-dogu.pages.dev";
const lastmod = process.env.SITEMAP_DATE ?? new Date().toISOString().slice(0, 10);
const sitemapFile = new URL("../public/sitemap.xml", import.meta.url);
// Do not pretend unchanged pages were updated whenever the sitemap is generated.
const previousDates = new Map();
try {
  const previous = readFileSync(sitemapFile, "utf8");
  for (const [, url, date] of previous.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)) {
    previousDates.set(new URL(url).pathname, date);
  }
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const updatedPaths = new Set((process.env.SITEMAP_UPDATED_PATHS ?? "").split(",").filter(Boolean));
const publicPages = [
  "/", "/about", "/faq", "/privacy", "/calculation-policy", "/editorial-policy", "/changelog", "/feedback",
  "/en", "/en/about", "/en/faq", "/en/privacy",
];
const paths = [...new Set([
  ...publicPages,
  ...allItems.map((item) => item.href),
  ...sections.map((section) => `/category/${section.key}`),
  ...englishTools.map(englishToolHref),
  ...indexableCalculatorResults,
])];

const escapeXml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...paths.map((path) => {
    const pageDate = updatedPaths.has(path) ? lastmod : previousDates.get(path) ?? lastmod;
    const priority = path === "/" ? "1.0" : path.startsWith("/category/") || path === "/en" ? "0.9" : path.startsWith("/calculators/") || path.startsWith("/tools/") || path.startsWith("/en/") ? "0.8" : "0.6";
    return `  <url>\n    <loc>${escapeXml(path === "/" ? origin : `${origin}${path}`)}</loc>\n    <lastmod>${pageDate}</lastmod>\n    <changefreq>${path === "/" ? "weekly" : "monthly"}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  }),
  "</urlset>",
  "",
].join("\n");

writeFileSync(new URL("../public/sitemap.xml", import.meta.url), xml, "utf8");
console.log(`Generated sitemap with ${paths.length} canonical URLs (${lastmod}).`);
