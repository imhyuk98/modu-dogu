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

// Result-page metadata is owned by calculator-result-indexing.ts. Never infer
// indexing policy from a dynamic route or overwrite its reviewed allowlist.
await import("./generate-sitemap.mjs");

console.log(`Normalized metadata and indexing in ${updated} files for ${siteOrigin}.`);
