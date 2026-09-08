export type SocialCardKind = "friendship-quiz" | "friend-manual" | "friend-chemistry" | "compliment-card" | "moon-compatibility";
export interface SocialCardData {
  kind: SocialCardKind; title: string; subtitle: string; highlights: { label: string; value: string }[];
  metric?: string; moons?: [number, number];
}
export const socialCardLabels: Record<SocialCardKind, string> = {
  "friendship-quiz": "우정고사 성적표", "friend-manual": "친구가 쓴 나의 설명서", "friend-chemistry": "우리의 취향 교집합", "compliment-card": "너에게 주는 작은 상장", "moon-compatibility": "우리 둘의 밤하늘",
};
export function moonShape(phase: number, radius = 100) {
  const cosine = Math.cos((phase / 8) * Math.PI * 2);
  const points: [number, number][] = [];
  for (let i = 0; i <= 64; i++) { const y = -radius + 2 * radius * i / 64; const x = Math.sqrt(Math.max(0, radius * radius - y * y)); points.push([phase <= 4 ? x : -x, y]); }
  for (let i = 64; i >= 0; i--) { const y = -radius + 2 * radius * i / 64; const x = Math.sqrt(Math.max(0, radius * radius - y * y)); points.push([phase <= 4 ? cosine * x : -cosine * x, y]); }
  return `M${points.map(([x,y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" L")}Z`;
}
