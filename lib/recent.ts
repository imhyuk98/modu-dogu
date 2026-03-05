const RECENT_KEY = "recent_tools";
const MAX_RECENT = 5;

export function getRecentTools(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch { return []; }
}

export function addRecentTool(href: string) {
  if (typeof window === "undefined") return;
  try {
    const recent = getRecentTools().filter((h) => h !== href);
    recent.unshift(href);
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
  } catch { /* ignore */ }
}
