export const socialModes = ["friendship-quiz", "friend-manual", "friend-chemistry", "compliment-card"] as const;
export type SocialMode = typeof socialModes[number];
export type Question = { prompt: string; options: readonly string[] };
const tastes: Question[] = [
  { prompt: "여행은 어떻게 시작하는 편?", options: ["일정표부터 만든다", "표만 끊고 떠난다"] },
  { prompt: "연락이 뜸해도 우정은?", options: ["마음만 같으면 괜찮다", "자주 안부를 나눠야 한다"] },
  { prompt: "같이 밥을 먹는다면?", options: ["늘 먹던 검증된 메뉴", "처음 보는 메뉴 도전"] },
  { prompt: "친구가 실수했을 때?", options: ["바로 솔직하게 말한다", "분위기를 보고 천천히 말한다"] },
  { prompt: "쉬는 날 함께 하고 싶은 것?", options: ["밖에서 새로운 경험", "집에서 편안하게 수다"] },
  { prompt: "사진을 찍을 때 더 중요한 것은?", options: ["예쁘게 남기는 결과", "웃긴 순간의 기억"] },
  { prompt: "약속 시간에 대한 생각은?", options: ["10분 전 도착이 기본", "정각 근처면 충분"] },
  { prompt: "깜짝 선물을 고른다면?", options: ["실용적으로 필요한 것", "취향 저격 의미 있는 것"] },
];
export const socialGames: Record<SocialMode, { title: string; eyebrow: string; description: string; emoji: string; questions: Question[] }> = {
  "friendship-quiz": { title: "나에 대한 우정고사", eyebrow: "HOW WELL DO YOU KNOW ME?", emoji: "✍️", description: "내 취향 8개를 정하고 친구에게 출제하세요. 친구가 나를 얼마나 알고 있을까요?", questions: [
    { prompt: "기운이 없을 때 내가 찾는 것은?", options: ["맛있는 음식", "혼자 쉬는 시간", "친구와 수다", "산책과 운동"] },
    { prompt: "내가 더 좋아하는 계절은?", options: ["봄", "여름", "가을", "겨울"] },
    { prompt: "내가 받고 싶은 선물은?", options: ["직접 쓴 편지", "실용적인 물건", "함께하는 경험", "취향에 맞는 간식"] },
    { prompt: "약속 없는 주말의 나는?", options: ["집에서 충전", "즉흥 외출", "취미에 몰입", "친구 만나기"] },
    { prompt: "내가 고를 영화는?", options: ["웃기는 코미디", "몰입하는 스릴러", "설레는 로맨스", "상상 가득 판타지"] },
    { prompt: "친구와 여행할 때 내 역할은?", options: ["계획 담당", "사진 담당", "맛집 담당", "분위기 담당"] },
    { prompt: "내가 더 듣고 싶은 말은?", options: ["네 덕분이야", "너랑 있으면 재밌어", "넌 참 믿음직해", "네 생각이 궁금해"] },
    { prompt: "지금 함께 가고 싶은 곳은?", options: ["바다", "조용한 카페", "놀이공원", "숲과 공원"] },
  ] },
  "friend-chemistry": { title: "친구 케미 테스트", eyebrow: "TWO PEOPLE, EIGHT CHOICES", emoji: "🧩", description: "각자 자신의 취향을 고르고 비교하세요. 친구의 답을 맞히는 시험이 아니라, 서로를 알아가는 놀이예요.", questions: tastes },
  "friend-manual": { title: "친구가 쓰는 내 사용 설명서", eyebrow: "WRITTEN BY A FRIEND", emoji: "📖", description: "내 링크를 보내면 친구가 다섯 가지 선택으로 나만의 설명서를 만들어 줘요.", questions: [
    { prompt: "이 친구를 한 단어로 표현하면?", options: ["든든한 나무", "따뜻한 햇살", "반짝이는 아이디어", "유쾌한 바람"] },
    { prompt: "이 친구가 빛나는 순간은?", options: ["이야기를 들어줄 때", "새로운 일에 도전할 때", "모두를 웃게 할 때", "약속을 지킬 때"] },
    { prompt: "이 친구에게 추천하는 충전법은?", options: ["느긋한 산책", "맛있는 한 끼", "신나는 노래", "편안한 휴식"] },
    { prompt: "함께하면 좋은 활동은?", options: ["새로운 동네 탐험", "카페에서 수다", "보드게임 한 판", "영화 보고 이야기"] },
    { prompt: "이 친구에게 전하고 싶은 말은?", options: ["지금의 너로 충분해", "네 이야기를 응원해", "함께라서 고마워", "앞으로도 잘 부탁해"] },
  ] },
  "compliment-card": { title: "친구 칭찬 카드", eyebrow: "A LITTLE NOTE FOR YOU", emoji: "💌", description: "말로 하기 쑥스러웠던 칭찬을 카드로 전하세요. 순위도, 부정적인 평가도 없어요.", questions: [
    { prompt: "친구에게 주고 싶은 상은?", options: ["최고의 이야기 친구상", "마음이 따뜻해지는 상", "믿고 함께하는 상", "일상을 웃게 하는 상"] },
    { prompt: "특히 고마운 것은?", options: ["내 말을 들어줘서", "먼저 안부를 물어줘서", "작은 약속도 기억해서", "함께 웃어줘서"] },
    { prompt: "다음에 함께하고 싶은 것은?", options: ["맛있는 밥 한 끼", "산책하며 이야기", "새로운 취미 도전", "사진 한 장 남기기"] },
  ] },
};
export type SocialPayload = { v: 1; mode: SocialMode; kind: "invite" | "result"; id: string; creator: string; answers: number[]; guest?: string; replies?: number[] };
export function encodeSocial(value: SocialPayload) {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  return btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join("")).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
export function validAnswers(mode: SocialMode, answers: unknown): answers is number[] {
  return Array.isArray(answers) && answers.length === socialGames[mode].questions.length && Array.from(answers).every((answer, index) => Number.isInteger(answer) && answer >= 0 && answer < socialGames[mode].questions[index].options.length);
}
export function isComparison(mode: SocialMode) { return mode === "friendship-quiz" || mode === "friend-chemistry"; }
function validName(value: unknown): value is string { return typeof value === "string" && value.trim().length > 0 && value.length <= 12 && !/[\u0000-\u001f\u007f]/.test(value); }
export function decodeSocial(raw: string, mode: SocialMode): SocialPayload | null {
  try {
    if (!raw || raw.length > 2400 || !/^[\w-]+$/.test(raw)) return null;
    const binary = atob(raw.replace(/-/g, "+").replace(/_/g, "/"));
    const value = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(Uint8Array.from(binary, (c) => c.charCodeAt(0))));
    if (!value || value.v !== 1 || value.mode !== mode || !["invite", "result"].includes(value.kind) || !validName(value.creator) || typeof value.id !== "string" || !/^[\w-]{1,64}$/.test(value.id)) return null;
    if (isComparison(mode) ? !validAnswers(mode, value.answers) : !Array.isArray(value.answers) || value.answers.length !== 0) return null;
    if (value.kind === "result" && (!validName(value.guest) || !validAnswers(mode, value.replies))) return null;
    if (value.kind === "invite" && (value.guest !== undefined || value.replies !== undefined)) return null;
    return { v: 1, mode, kind: value.kind, id: value.id, creator: value.creator.trim(), answers: value.answers, ...(value.kind === "result" ? { guest: value.guest.trim(), replies: value.replies } : {}) };
  } catch { return null; }
}
export function socialScore(answers: number[], replies: number[]) {
  const matches = answers.filter((answer, index) => answer === replies[index]).length;
  return { matches, total: answers.length, percent: answers.length ? Math.round(matches / answers.length * 100) : 0 };
}
