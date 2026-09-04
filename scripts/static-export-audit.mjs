import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const outputRoot = join(root, "out");
assert.ok(existsSync(outputRoot), "out directory is missing; run npm run build first");

const files = readdirSync(outputRoot, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => join(entry.parentPath, entry.name));
const htmlFiles = files.filter((path) => extname(path) === ".html");
const knownFiles = new Set(files.map((path) => relative(outputRoot, path).replaceAll("\\", "/")));
const brokenTargets = [];
const malformedPages = [];
let internalLinks = 0;
let assetReferences = 0;
let structuredDataBlocks = 0;
let processedPages = 0;

function routeTargetExists(rawHref) {
  const pathname = decodeURIComponent(rawHref.split(/[?#]/, 1)[0]);
  if (pathname === "/") return knownFiles.has("index.html");
  const normalized = pathname.replace(/^\/+|\/+$/g, "");
  return knownFiles.has(`${normalized}.html`) || knownFiles.has(`${normalized}/index.html`);
}

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const relativePath = relative(outputRoot, file).replaceAll("\\", "/");
  const isVerificationFile = /^google[\da-f]+\.html$/i.test(relativePath);
  if (!isVerificationFile && (!/^<!DOCTYPE html>/i.test(html) || !html.includes("</html>"))) {
    malformedPages.push(`${relativePath}: incomplete document`);
  }
  if (!isVerificationFile && !/<title>[^<]+<\/title>/i.test(html) && relativePath !== "offline.html") {
    malformedPages.push(`${relativePath}: missing title`);
  }
  if (!isVerificationFile && relativePath !== "offline.html") {
    const descriptionTags = [...html.matchAll(/<meta\b[^>]*>/gi)].filter(
      ([tag]) => /\bname="description"/i.test(tag) && /\bcontent="[^"]+"/i.test(tag),
    );
    if (descriptionTags.length !== 1) {
      malformedPages.push(`${relativePath}: expected one meta description, found ${descriptionTags.length}`);
    }

    const canonicalTags = [...html.matchAll(/<link\b[^>]*>/gi)].filter(
      ([tag]) => /\brel="canonical"/i.test(tag) && /\bhref="https:\/\/[^\"]+"/i.test(tag),
    );
    if (canonicalTags.length !== 1) {
      malformedPages.push(`${relativePath}: expected one absolute canonical, found ${canonicalTags.length}`);
    }
  }

  for (const match of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    structuredDataBlocks += 1;
    try {
      JSON.parse(match[1]);
    } catch (error) {
      malformedPages.push(`${relativePath}: invalid JSON-LD (${error.message})`);
    }
  }

  for (const match of html.matchAll(/\bhref="([^"]+)"/g)) {
    const href = match[1];
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    if (href.startsWith("/_next/") || extname(href.split(/[?#]/, 1)[0])) continue;
    internalLinks += 1;
    if (!routeTargetExists(href)) brokenTargets.push(`${relativePath} -> ${href}`);
  }

  for (const match of html.matchAll(/\b(?:src|href)="(\/_next\/[^"]+)"/g)) {
    const asset = decodeURIComponent(match[1].split(/[?#]/, 1)[0]).slice(1);
    assetReferences += 1;
    if (!knownFiles.has(asset)) brokenTargets.push(`${relativePath} -> /${asset}`);
  }
  processedPages += 1;
  if (process.env.QA_PROGRESS && processedPages % 100 === 0) {
    console.error(`Audited ${processedPages}/${htmlFiles.length} HTML pages`);
  }
}

assert.equal(malformedPages.length, 0, malformedPages.slice(0, 20).join("\n"));
assert.equal(brokenTargets.length, 0, brokenTargets.slice(0, 20).join("\n"));

const sitemapPath = join(outputRoot, "sitemap.xml");
assert.ok(existsSync(sitemapPath), "sitemap.xml is missing from the static export");
const sitemapXml = readFileSync(sitemapPath, "utf8");
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => new URL(url));
const sitemapPaths = new Set(sitemapUrls.map((url) => decodeURIComponent(url.pathname).replace(/\/$/, "") || "/"));
assert.equal(sitemapPaths.size, sitemapUrls.length, "sitemap.xml contains duplicate URLs");
for (const url of sitemapUrls) {
  assert.ok(routeTargetExists(url.pathname), `sitemap target is missing: ${url.href}`);
}

const { allItems } = await import("../lib/sections.ts");
const missingToolRoutes = allItems
  .map((item) => item.href)
  .filter((href) => !sitemapPaths.has(href));
assert.deepEqual(missingToolRoutes, [], `tool routes missing from sitemap: ${missingToolRoutes.join(", ")}`);

console.log(JSON.stringify({
  htmlPages: htmlFiles.length,
  files: files.length,
  internalLinks,
  assetReferences,
  structuredDataBlocks,
  sitemapUrls: sitemapUrls.length,
  listedTools: allItems.length,
  brokenTargets: brokenTargets.length,
  malformedPages: malformedPages.length,
}, null, 2));
