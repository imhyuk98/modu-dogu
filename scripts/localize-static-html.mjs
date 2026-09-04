import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const outputRoot = join(process.cwd(), "out");
const englishRoot = join(outputRoot, "en");

async function collectHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? collectHtml(path) : entry.isFile() && entry.name.endsWith(".html") ? [path] : [];
  }));
  return files.flat();
}

const files = [join(outputRoot, "en.html"), ...(await collectHtml(englishRoot))];
let updated = 0;

for (const file of files) {
  const source = await readFile(file, "utf8");
  const localized = source.replace('<html lang="ko"', '<html lang="en"');
  if (localized !== source) {
    await writeFile(file, localized, "utf8");
    updated += 1;
  }
}

console.log(`English lang attributes verified: ${files.length} pages (${updated} updated).`);
