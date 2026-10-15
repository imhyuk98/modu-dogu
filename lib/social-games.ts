export const socialModes = ["friendship-quiz", "friend-manual", "friend-chemistry", "compliment-card"] as const;
export type SocialMode = typeof socialModes[number];
export type Question = { prompt: string; options: readonly string[] };
export type SocialGuide = { steps: string[]; howTitle: string; how: string[]; faq: { q: string; a: string }[] };
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
const inboxFaq = { q: "친구 여러 명에게 보내도 되나요?", a: "같은 참여 링크를 여러 친구에게 보낼 수 있어요. 결과함 하나에 최대 100개 응답이 모이고, 생성일로부터 30일이 지나면 접근이 종료된 뒤 정리 작업으로 삭제됩니다." };
const ownerFaq = { q: "친구 답변은 어디서 보나요?", a: "링크를 만든 브라우저에서 '내가 만든 질문의 결과함'을 열면 친구별 답변을 볼 수 있어요. 다른 기기에서 보려면 링크를 만들 때 표시되는 생성자 전용 주소를 따로 보관해 두세요. 이 주소를 가진 사람은 답변을 보고 삭제할 수 있으니 공유하지 마세요." };
const guides: Record<SocialMode, SocialGuide> = {
  "friendship-quiz": {
    steps: ["닉네임을 입력하고 8개 질문마다 실제 내 취향에 맞는 답을 고릅니다.", "서버 저장에 동의하고 초대 링크를 만듭니다.", "카카오톡·메시지 등으로 친구에게 참여 링크만 보냅니다.", "친구가 내 답을 추측해 8문제를 풀고 제출하면, 친구 화면에 결과 카드가 나타나고 내 결과함에도 저장됩니다."],
    howTitle: "점수는 이렇게 매겨져요",
    how: ["점수는 내가 고른 답과 친구가 고른 답이 같은 문항의 수입니다. 8문제 중 몇 개를 맞혔는지로 표시되고, 문항별 비교에서 다른 답은 '새롭게 알게 된 취향'으로 보여줍니다.", "정답 기준은 서버에 저장된 내 답을 사용하며, 친구가 참여하기 전에는 내 답이나 다른 친구의 답이 공개되지 않습니다. 점수는 대화를 시작하기 위한 놀이용이며 우정의 깊이를 판단하지 않습니다."],
    faq: [inboxFaq, ownerFaq, { q: "내 답을 바꾸고 싶어요.", a: "'내용을 바꿔 새 링크 만들기'로 새 초대를 만들 수 있어요. 이미 보낸 링크와 그 결과함은 원래 답을 기준으로 유지됩니다." }],
  },
  "friend-chemistry": {
    steps: ["닉네임을 입력하고 8개의 양자택일 질문에 내 취향을 고릅니다.", "초대 링크를 만들어 친구에게 보냅니다.", "친구도 같은 질문에 자기 취향대로 답합니다. 내 답을 맞히는 시험이 아닙니다.", "제출하면 두 사람의 취향 일치도와 문항별 선택을 결과 카드로 확인합니다."],
    howTitle: "취향 일치도 계산 방법",
    how: ["8개 문항 중 두 사람이 같은 쪽을 고른 문항 수를 백분율로 바꿔 반올림한 값입니다. 예를 들어 6개가 같으면 75%입니다.", "여행 계획, 약속 시간, 선물 고르는 법처럼 정답이 없는 질문이라 일치도가 낮다고 사이가 나쁜 것은 아닙니다. 다른 선택은 서로 이야기할 거리로 활용해 보세요. 결과는 재미를 위한 것이며 성격이나 관계를 진단하지 않습니다."],
    faq: [inboxFaq, ownerFaq, { q: "예전에 받은 링크도 열리나요?", a: "이전 방식으로 공유된 초대·결과 링크도 계속 열립니다. 다만 그 링크로 참여한 답변은 결과함에 자동 저장되지 않으니 결과 링크를 직접 보내 주세요." }],
  },
  "friend-manual": {
    steps: ["내 닉네임만 입력하고 초대 링크를 만듭니다. 내가 미리 고르는 답은 없습니다.", "친구에게 링크를 보내면, 친구가 나를 떠올리며 다섯 가지 질문에 하나씩 고릅니다.", "친구가 완성하면 '○○님의 사용 설명서' 카드가 만들어지고 내 결과함에 저장됩니다."],
    howTitle: "설명서는 이렇게 만들어져요",
    how: ["한 단어 표현, 빛나는 순간, 추천 충전법, 함께하면 좋은 활동, 전하고 싶은 말의 다섯 항목을 친구가 고른 그대로 카드에 담습니다. 점수나 순위는 없습니다.", "선택지는 모두 긍정적인 표현으로만 구성되어 있어 부담 없이 주고받을 수 있습니다. 여러 친구가 참여하면 친구마다 서로 다른 설명서가 만들어지니 비교해 보는 재미도 있습니다."],
    faq: [inboxFaq, ownerFaq, { q: "친구가 쓴 내용을 고칠 수 있나요?", a: "완성된 설명서는 친구가 고른 그대로 보여주며 수정 기능은 없습니다. 원하지 않는 결과함은 생성자가 결과함에서 삭제할 수 있습니다." }],
  },
  "compliment-card": {
    steps: ["내 닉네임을 입력하고 칭찬을 받을 초대 링크를 만듭니다.", "친구가 링크를 열어 주고 싶은 상, 고마운 점, 다음에 함께하고 싶은 일 세 가지를 고릅니다.", "완성된 칭찬 카드는 이미지로 저장하거나 공유할 수 있고 내 결과함에도 모입니다."],
    howTitle: "칭찬 카드의 구성",
    how: ["세 문항 모두 칭찬과 고마움을 표현하는 선택지만 있어 순위나 부정적인 평가가 생기지 않습니다. 말로 하기 쑥스러운 마음을 가볍게 전하는 용도입니다.", "카드에는 친구가 고른 문장이 그대로 들어갑니다. 생일, 졸업, 이별 선물처럼 고마움을 전하고 싶은 날에 활용해 보세요."],
    faq: [inboxFaq, ownerFaq, { q: "칭찬을 보낸 친구 이름이 보이나요?", a: "친구가 참여할 때 입력한 닉네임이 결과 카드와 결과함에 표시됩니다. 실명 대신 별명을 써도 됩니다." }],
  },
};
export const socialGames: Record<SocialMode, { title: string; eyebrow: string; description: string; emoji: string; questions: Question[]; guide: SocialGuide }> = {
  "friendship-quiz": { guide: guides["friendship-quiz"], title: "나에 대한 우정고사", eyebrow: "HOW WELL DO YOU KNOW ME?", emoji: "✍️", description: "내 취향 8개를 정하고 친구에게 출제하세요. 친구가 나를 얼마나 알고 있을까요?", questions: [
    { prompt: "기운이 없을 때 내가 찾는 것은?", options: ["맛있는 음식", "혼자 쉬는 시간", "친구와 수다", "산책과 운동"] },
    { prompt: "내가 더 좋아하는 계절은?", options: ["봄", "여름", "가을", "겨울"] },
    { prompt: "내가 받고 싶은 선물은?", options: ["직접 쓴 편지", "실용적인 물건", "함께하는 경험", "취향에 맞는 간식"] },
    { prompt: "약속 없는 주말의 나는?", options: ["집에서 충전", "즉흥 외출", "취미에 몰입", "친구 만나기"] },
    { prompt: "내가 고를 영화는?", options: ["웃기는 코미디", "몰입하는 스릴러", "설레는 로맨스", "상상 가득 판타지"] },
    { prompt: "친구와 여행할 때 내 역할은?", options: ["계획 담당", "사진 담당", "맛집 담당", "분위기 담당"] },
    { prompt: "내가 더 듣고 싶은 말은?", options: ["네 덕분이야", "너랑 있으면 재밌어", "넌 참 믿음직해", "네 생각이 궁금해"] },
    { prompt: "지금 함께 가고 싶은 곳은?", options: ["바다", "조용한 카페", "놀이공원", "숲과 공원"] },
  ] },
  "friend-chemistry": { guide: guides["friend-chemistry"], title: "친구 케미 테스트", eyebrow: "TWO PEOPLE, EIGHT CHOICES", emoji: "🧩", description: "각자 자신의 취향을 고르고 비교하세요. 친구의 답을 맞히는 시험이 아니라, 서로를 알아가는 놀이예요.", questions: tastes },
  "friend-manual": { guide: guides["friend-manual"], title: "친구가 쓰는 내 사용 설명서", eyebrow: "WRITTEN BY A FRIEND", emoji: "📖", description: "내 링크를 보내면 친구가 다섯 가지 선택으로 나만의 설명서를 만들어 줘요.", questions: [
    { prompt: "이 친구를 한 단어로 표현하면?", options: ["든든한 나무", "따뜻한 햇살", "반짝이는 아이디어", "유쾌한 바람"] },
    { prompt: "이 친구가 빛나는 순간은?", options: ["이야기를 들어줄 때", "새로운 일에 도전할 때", "모두를 웃게 할 때", "약속을 지킬 때"] },
    { prompt: "이 친구에게 추천하는 충전법은?", options: ["느긋한 산책", "맛있는 한 끼", "신나는 노래", "편안한 휴식"] },
    { prompt: "함께하면 좋은 활동은?", options: ["새로운 동네 탐험", "카페에서 수다", "보드게임 한 판", "영화 보고 이야기"] },
    { prompt: "이 친구에게 전하고 싶은 말은?", options: ["지금의 너로 충분해", "네 이야기를 응원해", "함께라서 고마워", "앞으로도 잘 부탁해"] },
  ] },
  "compliment-card": { guide: guides["compliment-card"], title: "친구 칭찬 카드", eyebrow: "A LITTLE NOTE FOR YOU", emoji: "💌", description: "말로 하기 쑥스러웠던 칭찬을 카드로 전하세요. 순위도, 부정적인 평가도 없어요.", questions: [
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
