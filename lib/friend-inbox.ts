import type { SocialMode, SocialPayload } from "./social-games";

const api = process.env.NEXT_PUBLIC_FRIEND_INBOX_API?.replace(/\/$/, "") ?? "";
export const inboxConfigured = Boolean(api);
const storageKey = "modu:friend-inboxes:v1";
export type InboxInfo = { id: string; mode: SocialMode; creator: string; createdAt: number; expiresAt: number; maxResponses: number };
export type OwnedInbox = InboxInfo & { ownerToken: string };
export type InboxResponse = { id: string; createdAt: number; result: SocialPayload };
export type InboxView = InboxInfo & { responses: InboxResponse[] };

export async function inboxRequest<T>(path: string, options: { method?: string; body?: unknown; ownerToken?: string; signal?: AbortSignal } = {}): Promise<T> {
  if (!api) throw new Error("결과함 연결이 설정되지 않았어요. 운영 홈페이지에서 이용해 주세요.");
  const controller = new AbortController();
  const abort = () => controller.abort();
  const timer = setTimeout(abort, 15000);
  options.signal?.addEventListener("abort", abort, { once: true });
  if (options.signal?.aborted) abort();
  try {
  let response: Response;
  try {
    response = await fetch(`${api}/v1${path}`, {
      method: options.method ?? "GET", cache: "no-store", credentials: "omit", referrerPolicy: "no-referrer",
      signal: controller.signal,
      headers: { ...(options.body ? { "Content-Type": "application/json" } : {}), ...(options.ownerToken ? { Authorization: `Bearer ${options.ownerToken}` } : {}) },
      ...(options.body ? { body: JSON.stringify(options.body) } : {}),
    });
  } catch { throw new Error("서버 응답을 확인하지 못했어요. 입력은 유지됩니다. 연결을 확인한 뒤 다시 시도해 주세요."); }
  let body;
  try { body = await response.json(); } catch { throw new Error("결과함 응답을 읽지 못했어요. 잠시 후 다시 시도해 주세요."); }
  if (!response.ok) throw new Error(typeof body?.error === "string" ? body.error : "결과함 요청을 처리하지 못했어요.");
  return body as T;
  } finally { clearTimeout(timer); options.signal?.removeEventListener("abort", abort); }
}
export function inviteUrl(box: Pick<InboxInfo, "mode" | "id">) { return `${window.location.origin}/tools/${box.mode}#box=${box.id}`; }
export function ownerUrl(box: Pick<OwnedInbox, "id" | "ownerToken">) { return `${window.location.origin}/tools/friend-inbox#${box.id}.${box.ownerToken}`; }
export function readOwnedInboxes(): OwnedInbox[] {
  try {
    const rows: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
    if (!Array.isArray(rows)) return [];
    return rows.filter((row): row is OwnedInbox => row && /^[a-f0-9]{32}$/.test(row.id) && /^[a-f0-9]{64}$/.test(row.ownerToken) && ["friendship-quiz", "friend-chemistry", "friend-manual", "compliment-card"].includes(row.mode) && typeof row.creator === "string" && row.creator.length <= 12 && Number.isFinite(row.expiresAt) && row.expiresAt > Date.now());
  } catch { return []; }
}
export function rememberInbox(box: OwnedInbox) {
  try {
    const previous = readOwnedInboxes().filter(row => row.id !== box.id);
    if (previous.length >= 100) return false;
    localStorage.setItem(storageKey, JSON.stringify([box, ...previous]));
    return true;
  } catch { return false; }
}
export function forgetInbox(id: string) {
  try { localStorage.setItem(storageKey, JSON.stringify(readOwnedInboxes().filter(row => row.id !== id))); } catch { /* Storage may be blocked. */ }
}
export async function prepareInbox(mode: SocialMode, creator: string): Promise<OwnedInbox> {
  const ownerToken = Array.from(crypto.getRandomValues(new Uint8Array(32)), byte => byte.toString(16).padStart(2, "0")).join("");
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ownerToken));
  const id = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("").slice(0, 32);
  return { id, ownerToken, mode, creator, createdAt: Date.now(), expiresAt: Date.now() + 30 * 86400000, maxResponses: 100 };
}
