import { execFileSync } from "node:child_process";
import { writeFile } from "node:fs/promises";

function releaseId() {
  const environmentSha = process.env.CF_PAGES_COMMIT_SHA || process.env.GITHUB_SHA;
  if (environmentSha) return environmentSha.slice(0, 12);
  try {
    return execFileSync("git", ["rev-parse", "--short=12", "HEAD"], { encoding: "utf8" }).trim();
  } catch {
    return "local";
  }
}

const cacheName = `modu-dogu-${releaseId()}`;
const source = `const CACHE_NAME = ${JSON.stringify(cacheName)};
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(["/", OFFLINE_URL])));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;
  event.respondWith(fetch(event.request).then((response) => {
    if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()));
    return response;
  }).catch(async () => (await caches.match(event.request)) || caches.match(OFFLINE_URL)));
});
`;

await writeFile("public/sw.js", source, "utf8");
console.log(`Generated service worker cache ${cacheName}.`);
