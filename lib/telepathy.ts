export interface TelepathyChallengePayload {
  v: 1;
  id: string;
  creator: string;
  friend: string;
  topics: number[];
  answers: string[];
}

export interface TelepathyResultPayload {
  v: 1;
  challenge: TelepathyChallengePayload;
  friendAnswers: string[];
}

export type TelepathyTier = "perfect" | "great" | "spark";

function toBase64Url(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeTelepathyPayload(value: TelepathyChallengePayload | TelepathyResultPayload) {
  return toBase64Url(JSON.stringify(value));
}

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function decodeTelepathyChallenge(value: string): TelepathyChallengePayload | null {
  try {
    if (!value || value.length > 5000) return null;
    const parsed = JSON.parse(fromBase64Url(value)) as Partial<TelepathyChallengePayload>;
    if (parsed.v !== 1 || !Array.isArray(parsed.topics) || !Array.isArray(parsed.answers)) return null;
    const topics = parsed.topics.filter((topic) => Number.isInteger(topic) && topic >= 0 && topic < 100).slice(0, 7);
    const answers = parsed.answers.map((answer) => clean(answer, 30)).slice(0, 7);
    if (topics.length < 3 || topics.length !== answers.length || answers.some((answer) => !answer)) return null;
    return {
      v: 1,
      id: clean(parsed.id, 64) || "shared",
      creator: clean(parsed.creator, 12) || "친구",
      friend: clean(parsed.friend, 12) || "친구",
      topics,
      answers,
    };
  } catch {
    return null;
  }
}

export function decodeTelepathyResult(value: string): TelepathyResultPayload | null {
  try {
    if (!value || value.length > 9000) return null;
    const parsed = JSON.parse(fromBase64Url(value)) as Partial<TelepathyResultPayload>;
    const challengeValue = parsed.challenge;
    if (!challengeValue) return null;
    const challenge = decodeTelepathyChallenge(encodeTelepathyPayload(challengeValue as TelepathyChallengePayload));
    const friendAnswers = Array.isArray(parsed.friendAnswers)
      ? parsed.friendAnswers.map((answer) => clean(answer, 30)).slice(0, 7)
      : [];
    if (!challenge || friendAnswers.length !== challenge.answers.length || friendAnswers.some((answer) => !answer)) return null;
    return { v: 1, challenge, friendAnswers };
  } catch {
    return null;
  }
}

export function normalizeTelepathyAnswer(value: string) {
  return value.trim().toLocaleLowerCase("ko").replace(/[\s.,!?~'"’“”()-]/g, "");
}

export function telepathyScore(challenge: TelepathyChallengePayload, friendAnswers: string[]) {
  const matches = challenge.answers.reduce(
    (total, answer, index) => total + (normalizeTelepathyAnswer(answer) === normalizeTelepathyAnswer(friendAnswers[index] ?? "") ? 1 : 0),
    0,
  );
  return { matches, total: challenge.answers.length, percent: Math.round((matches / challenge.answers.length) * 100) };
}

export function telepathyTier(percent: number): TelepathyTier {
  if (percent === 100) return "perfect";
  if (percent >= 60) return "great";
  return "spark";
}

export const telepathyTierCopy: Record<TelepathyTier, { title: string; emoji: string; description: string }> = {
  perfect: { title: "완벽한 텔레파시", emoji: "🎯", description: "말하지 않아도 통하는 환상의 조합이에요." },
  great: { title: "제법 통하는 사이", emoji: "✨", description: "서로의 취향을 꽤 정확히 알고 있어요." },
  spark: { title: "다름이 재밌는 사이", emoji: "⚡", description: "다른 답 덕분에 새롭게 알게 될 것이 많아요." },
};
