// Entertainment approximation, not an ephemeris. Reference new moon:
// USNO Circular 169, January 6, 2000 ~18:15 (TDT; minute difference immaterial here).
// https://aa.usno.navy.mil/downloads/Circular_169_coverupdate.pdf
export const moonPhases = [
  { name: "새달", emoji: "🌑" }, { name: "초승달", emoji: "🌒" },
  { name: "상현달", emoji: "🌓" }, { name: "차오르는 달", emoji: "🌔" },
  { name: "보름달", emoji: "🌕" }, { name: "기우는 달", emoji: "🌖" },
  { name: "하현달", emoji: "🌗" }, { name: "그믐달", emoji: "🌘" },
];
export function birthdayPhase(value: string, now = new Date()): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T12:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value || value < "1900-01-01" || value > now.toISOString().slice(0, 10)) return null;
  const days = (date.getTime() - Date.UTC(2000, 0, 6, 18, 15)) / 86400000;
  const cycle = ((days / 29.530588853) % 1 + 1) % 1;
  return Math.round(cycle * 8) % 8;
}
export type MoonCard = { first: string; second: string; a: number; b: number };
export function encodeMoon(card: MoonCard) {
  return new URLSearchParams({ v: "1", first: card.first, second: card.second, a: String(card.a), b: String(card.b) }).toString();
}
export function decodeMoon(raw: string): MoonCard | null {
  if (raw.length > 800) return null;
  const params = new URLSearchParams(raw);
  const first = params.get("first"), second = params.get("second"), a = params.get("a"), b = params.get("b");
  if (params.get("v") !== "1" || !first?.trim() || !second?.trim() || first.length > 12 || second.length > 12 || /[\u0000-\u001f\u007f]/.test(first + second) || !/^[0-7]$/.test(a ?? "") || !/^[0-7]$/.test(b ?? "")) return null;
  return { first: first.trim(), second: second.trim(), a: Number(a), b: Number(b) };
}
export function moonStory(a: number, b: number) {
  const distance = Math.min(Math.abs(a - b), 8 - Math.abs(a - b));
  if (distance === 0) return { title: "같은 리듬의 두 달", text: "비슷한 빛을 가진 우리. 둘 다 좋아하는 순간을 하나씩 이야기해 볼까요?" };
  if (distance >= 3) return { title: "서로 다른 빛의 두 달", text: "다른 모습이라 더 궁금한 우리. 서로에게 배우고 싶은 것을 하나 골라보세요." };
  return { title: "나란히 걷는 두 달", text: "조금씩 다른 속도로 빛나는 우리. 다음에 함께할 작은 약속을 정해보세요." };
}
