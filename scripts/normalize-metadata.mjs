import fs from "node:fs";
import path from "node:path";

const appRoot = path.resolve("app");
const siteOrigin = "https://modu-dogu.pages.dev";

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function routeForLayout(file) {
  const directory = path.dirname(path.relative(appRoot, file)).split(path.sep).join("/");
  return directory === "." ? "/" : `/${directory}`;
}

let updated = 0;
for (const file of walk(appRoot).filter((candidate) => candidate.endsWith(`${path.sep}layout.tsx`))) {
  const route = routeForLayout(file);
  if (route.includes("[")) continue;

  let source = fs.readFileSync(file, "utf8");
  if (!source.includes("export const metadata: Metadata = {")) continue;

  const before = source;
  source = source.replaceAll("/og-image.svg", "/og-image.png");
  if (!source.includes("alternates:")) {
    source = source.replace(
      "export const metadata: Metadata = {",
      `export const metadata: Metadata = {\n  alternates: { canonical: "${route}" },`,
    );
  }
  if (!source.includes("images:") && /openGraph\s*:\s*{/.test(source)) {
    source = source.replace(/openGraph\s*:\s*{/, (match) => `${match}\n    images: ["/og-image.svg"],`);
  }

  if (source !== before) {
    fs.writeFileSync(file, source, "utf8");
    updated += 1;
  }
}

const dynamicBases = new Map([
  ["app/calculators/bmi/[params]/layout.tsx", "/calculators/bmi"],
  ["app/calculators/loan/[params]/layout.tsx", "/calculators/loan"],
  ["app/calculators/rent-conversion/[params]/layout.tsx", "/calculators/rent-conversion"],
  ["app/calculators/retirement/[params]/layout.tsx", "/calculators/retirement"],
  ["app/calculators/salary/[amount]/layout.tsx", "/calculators/salary"],
  ["app/calculators/unemployment/[params]/layout.tsx", "/calculators/unemployment"],
]);

for (const [relativeFile, canonical] of dynamicBases) {
  const file = path.resolve(relativeFile);
  let source = fs.readFileSync(file, "utf8");
  const metadataStart = source.indexOf("export async function generateMetadata");
  if (metadataStart < 0) continue;
  const before = source;
  source = source.replaceAll("/og-image.svg", "/og-image.png");
  const prefix = source.slice(0, metadataStart);
  let metadataSource = source.slice(metadataStart);

  if (!metadataSource.includes("alternates:")) {
    metadataSource = metadataSource.replace(
      /return\s*{\s*\n/,
      `return {\n    alternates: { canonical: "${canonical}" },\n    robots: { index: false, follow: true },\n`,
    );
  }
  if (!metadataSource.includes("images:") && /openGraph\s*:\s*{/.test(metadataSource)) {
    metadataSource = metadataSource.replace(/openGraph\s*:\s*{/, (match) => `${match}\n      images: ["/og-image.svg"],`);
  }
  source = prefix + metadataSource;
  if (source !== before) {
    fs.writeFileSync(file, source, "utf8");
    updated += 1;
  }
}

const sitemapFile = path.resolve("public/sitemap.xml");
let sitemap = fs.readFileSync(sitemapFile, "utf8");
const dynamicPattern = /\s*<url>\s*<loc>https:\/\/modu-dogu\.pages\.dev\/calculators\/(?:bmi|loan|rent-conversion|retirement|salary|unemployment)\/[^<]+<\/loc>[\s\S]*?<\/url>/g;
const originalSitemap = sitemap;
sitemap = sitemap.replace(dynamicPattern, "");
if (sitemap !== originalSitemap) {
  fs.writeFileSync(sitemapFile, sitemap, "utf8");
  updated += 1;
}

console.log(`Normalized metadata and indexing in ${updated} files for ${siteOrigin}.`);
