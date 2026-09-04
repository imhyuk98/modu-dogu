"use client";
/* eslint-disable react-hooks/set-state-in-effect -- query-string hydration initializes client-only invite state */

import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import ShareActions from "@/components/ShareActions";
import {
  decodeTelepathyChallenge,
  encodeTelepathyPayload,
  telepathyScore,
  telepathyTier,
  telepathyTierCopy,
  type TelepathyChallengePayload,
} from "@/lib/telepathy";

export const LINK_TOPICS = [
  "치킨 브랜드 하면?", "야식 메뉴 하면?", "데이트 장소 하면?", "여행지 하면?", "커피 브랜드 하면?",
  "편의점 하면?", "색깔 하면?", "계절 하면?", "숫자 1~10 하면?", "동물 하면?",
  "스트레스 해소법 하면?", "사랑 하면?", "우정 하면?", "주말에 하고 싶은 일은?", "함께 보고 싶은 영화 장르는?",
  "지금 떠오르는 노래는?", "비 오는 날 음식 하면?", "둘이 가장 가고 싶은 나라는?", "선물 받고 싶은 것은?", "우리 사이를 색으로 표현하면?",
  "주말 아침 메뉴 하면?", "편의점 간식 하면?", "여름 휴가지 하면?", "겨울 간식 하면?", "둘이 찍고 싶은 사진 포즈는?",
  "노래방 첫 곡 하면?", "같이 배우고 싶은 취미는?", "하루 쉬면 가장 먼저 할 일은?", "우리에게 어울리는 동물은?", "기억에 남는 학교 급식은?",
  "첫 월급으로 사고 싶은 것은?", "무인도에 하나 가져간다면?", "가장 먼저 떠오르는 스포츠는?", "드라이브할 때 듣고 싶은 장르는?", "둘이 도전할 음식은?",
  "가장 좋아하는 요일은?", "카페에서 고르는 자리는?", "늦잠 잔 날 포기하는 것은?", "사진 찍기 좋은 계절은?", "함께 키우고 싶은 반려동물은?",
  "추억의 게임 하면?", "받으면 기분 좋은 한마디는?", "우리의 다음 약속 장소는?", "한 달 살기 하고 싶은 도시는?", "잠들기 전 하는 일은?",
];

function pickTopicIndexes(count: number) {
  const indexes = Array.from({ length: LINK_TOPICS.length }, (_, index) => index);
  for (let index = indexes.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [indexes[index], indexes[other]] = [indexes[other], indexes[index]];
  }
  return indexes.slice(0, Math.min(count, LINK_TOPICS.length));
}

function getInitialTopicIndexes(count: number) {
  return Array.from({ length: count }, (_, index) => (index * 7) % LINK_TOPICS.length);
}

export default function TelepathyLinkChallenge() {
  const [incoming, setIncoming] = useState<TelepathyChallengePayload | null>(null);
  const [invalidLink, setInvalidLink] = useState(false);
  const [creator, setCreator] = useState("나");
  const [friend, setFriend] = useState("친구");
  const [count, setCount] = useState(5);
  // The first render must match the statically generated HTML. Later user actions
  // intentionally randomize the questions.
  const [topicIndexes, setTopicIndexes] = useState<number[]>(() => getInitialTopicIndexes(5));
  const [answers, setAnswers] = useState<string[]>(Array(5).fill(""));
  const [friendAnswers, setFriendAnswers] = useState<string[]>([]);
  const [challengeUrl, setChallengeUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [linkNotice, setLinkNotice] = useState("");

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("challenge");
    if (!value) return;
    const decoded = decodeTelepathyChallenge(value);
    if (!decoded) {
      setInvalidLink(true);
      return;
    }
    setIncoming(decoded);
    setFriendAnswers(Array(decoded.answers.length).fill(""));
    trackEvent("tool_start", { tool: "telepathy-game", flow: "invite", challenge_id: decoded.id });
  }, []);

  const score = useMemo(
    () => incoming && resultUrl ? telepathyScore(incoming, friendAnswers) : null,
    [friendAnswers, incoming, resultUrl],
  );

  const updateCount = (nextCount: number) => {
    setCount(nextCount);
    setTopicIndexes(pickTopicIndexes(nextCount));
    setAnswers(Array(nextCount).fill(""));
    setChallengeUrl("");
  };

  const createChallenge = () => {
    if (!creator.trim() || !friend.trim() || answers.some((answer) => !answer.trim())) return;
    const payload: TelepathyChallengePayload = {
      v: 1,
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`,
      creator: creator.trim().slice(0, 12),
      friend: friend.trim().slice(0, 12),
      topics: topicIndexes,
      answers: answers.map((answer) => answer.trim().slice(0, 30)),
    };
    const url = `${window.location.origin}/tools/telepathy-game?challenge=${encodeTelepathyPayload(payload)}`;
    if (url.length > 3500) {
      setLinkNotice("링크가 너무 깁니다. 답을 짧게 줄인 뒤 다시 만들어 주세요.");
      return;
    }
    setLinkNotice("");
    setChallengeUrl(url);
    localStorage.setItem("telepathy:last-created", JSON.stringify({ id: payload.id, createdAt: Date.now(), rounds: count }));
    trackEvent("invite_create", { tool: "telepathy-game", challenge_id: payload.id, rounds: count });
  };

  const completeChallenge = () => {
    if (!incoming || friendAnswers.some((answer) => !answer.trim())) return;
    const cleanAnswers = friendAnswers.map((answer) => answer.trim().slice(0, 30));
    const result = telepathyScore(incoming, cleanAnswers);
    const tier = telepathyTier(result.percent);
    const payload = encodeTelepathyPayload({ v: 1, challenge: incoming, friendAnswers: cleanAnswers });
    const url = `${window.location.origin}/tools/telepathy-game/result/${tier}?data=${payload}`;
    setFriendAnswers(cleanAnswers);
    setResultUrl(url);
    trackEvent("invite_complete", {
      tool: "telepathy-game",
      challenge_id: incoming.id,
      rounds: result.total,
      matches: result.matches,
      score: result.percent,
    });
    trackEvent("tool_complete", { tool: "telepathy-game", flow: "invite", score: result.percent });
  };

  if (invalidLink) {
    return (
      <section className="mb-8 rounded-3xl border border-red-200 bg-red-50 p-6 text-center">
        <strong className="text-red-800">초대 링크를 읽을 수 없어요.</strong>
        <p className="mt-2 text-sm text-red-700">링크가 잘리지 않았는지 확인하거나 새 텔레파시를 만들어주세요.</p>
        <a href="/tools/telepathy-game" className="mt-4 inline-block rounded-xl bg-red-700 px-5 py-2.5 text-sm font-bold text-white">새로 만들기</a>
      </section>
    );
  }

  if (incoming) {
    return (
      <section className="mb-8 overflow-hidden rounded-3xl border border-purple-200 bg-white shadow-lg" aria-labelledby="invite-title">
        <div className="bg-gradient-to-br from-purple-600 to-pink-500 px-6 py-7 text-white">
          <p className="text-xs font-black tracking-[0.14em] text-white/75">친구에게서 텔레파시 도착</p>
          <h2 id="invite-title" className="mt-2 text-2xl font-black">{incoming.creator}님이 {incoming.friend}님을 기다려요</h2>
          <p className="mt-2 text-sm text-white/85">먼저 남긴 답은 제출하기 전까지 공개되지 않습니다.</p>
        </div>
        <div className="space-y-4 p-5 sm:p-7">
          {incoming.topics.map((topicIndex, index) => (
            <label key={`${topicIndex}-${index}`} className="block rounded-2xl bg-purple-50 p-4">
              <span className="mb-2 block text-sm font-bold text-purple-900">{index + 1}. {LINK_TOPICS[topicIndex]}</span>
              <input
                value={friendAnswers[index] ?? ""}
                onChange={(event) => setFriendAnswers((current) => current.map((answer, answerIndex) => answerIndex === index ? event.target.value : answer))}
                maxLength={30}
                placeholder="떠오른 답을 입력하세요"
                className="w-full rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                disabled={Boolean(resultUrl)}
              />
            </label>
          ))}
          {!resultUrl ? (
            <button type="button" onClick={completeChallenge} disabled={friendAnswers.some((answer) => !answer.trim())} className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 py-4 font-black text-white shadow-md disabled:cursor-not-allowed disabled:opacity-40">
              두 사람의 답 비교하기
            </button>
          ) : score ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
              <div className="text-4xl">{telepathyTierCopy[telepathyTier(score.percent)].emoji}</div>
              <strong className="mt-2 block text-xl text-emerald-900">{score.matches}/{score.total}개 일치 · {score.percent}%</strong>
              <p className="mt-1 text-sm text-emerald-800">{telepathyTierCopy[telepathyTier(score.percent)].description}</p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <a href={resultUrl} className="flex-1 rounded-xl border border-emerald-300 bg-white px-4 py-3 text-sm font-bold text-emerald-800">전체 결과 보기</a>
              </div>
              <div className="mt-3"><ShareActions compact tool="telepathy-game" title="텔레파시 결과" text={`${incoming.creator}님과 텔레파시 ${score.percent}%!`} url={resultUrl} /></div>
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8 overflow-hidden rounded-3xl border border-[#e4c8bc] bg-white shadow-lg" aria-labelledby="link-challenge-title">
      <div className="bg-[#2c211c] px-6 py-7 text-white sm:px-8">
        <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-black tracking-[0.12em] text-[#ffd9c9]">추천 플레이</span>
        <h2 id="link-challenge-title" className="mt-4 text-2xl font-black sm:text-3xl">옆에 없어도 마음이 통할까?</h2>
        <p className="mt-2 text-sm leading-6 text-white/75">내 답을 먼저 남기고 링크를 보내세요. 친구가 답하면 둘의 일치율을 바로 확인할 수 있어요.</p>
      </div>
      <div className="space-y-5 p-5 sm:p-7">
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm font-bold text-gray-700">내 이름<input value={creator} onChange={(event) => setCreator(event.target.value)} maxLength={12} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-[#c26046]" /></label>
          <label className="text-sm font-bold text-gray-700">친구 이름<input value={friend} onChange={(event) => setFriend(event.target.value)} maxLength={12} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-[#c26046]" /></label>
        </div>
        <fieldset>
          <legend className="mb-2 text-sm font-bold text-gray-700">질문 수</legend>
          <div className="grid grid-cols-2 gap-2">
            {[3, 5].map((value) => <button key={value} type="button" onClick={() => updateCount(value)} className={`rounded-xl border px-4 py-2.5 text-sm font-bold ${count === value ? "border-[#a93d28] bg-[#fff0e9] text-[#9d3926]" : "border-gray-200 text-gray-600"}`}>{value}문제</button>)}
          </div>
        </fieldset>
        <div className="space-y-3">
          {topicIndexes.map((topicIndex, index) => (
            <label key={`${topicIndex}-${index}`} className="block rounded-2xl bg-[#faf6f3] p-4">
              <span className="mb-2 block text-sm font-bold text-[#513b31]">{index + 1}. {LINK_TOPICS[topicIndex]}</span>
              <input value={answers[index] ?? ""} onChange={(event) => setAnswers((current) => current.map((answer, answerIndex) => answerIndex === index ? event.target.value : answer))} maxLength={30} placeholder="내 답을 먼저 입력" className="w-full rounded-xl border border-[#eaded7] bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#c26046]" />
            </label>
          ))}
        </div>
        {!challengeUrl ? (
          <button type="button" onClick={createChallenge} disabled={!creator.trim() || !friend.trim() || answers.some((answer) => !answer.trim())} className="w-full rounded-2xl bg-[#a93d28] py-4 font-black text-white shadow-md transition-colors hover:bg-[#8f2f20] disabled:cursor-not-allowed disabled:opacity-40">
            친구 초대 링크 만들기
          </button>
        ) : (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <strong className="text-emerald-900">초대 링크가 준비됐어요!</strong>
            <p className="mt-1 text-sm text-emerald-800">친구가 답을 제출하면 두 사람의 결과 페이지가 만들어집니다.</p>
            <div className="mt-4"><ShareActions compact tool="telepathy-game" title="텔레파시 도착!" text={`${creator}님이 보낸 텔레파시 질문에 답해보세요!`} url={challengeUrl} /></div>
            <p className={`mt-2 text-xs ${challengeUrl.length > 1800 ? "font-bold text-amber-800" : "text-emerald-800"}`}>링크 길이 {challengeUrl.length.toLocaleString()}자{challengeUrl.length > 1800 ? " · 일부 메신저에서 잘릴 수 있으니 링크 복사 후 전체가 붙었는지 확인하세요." : " · 일반적인 메신저 공유 범위입니다."}</p>
            <button type="button" onClick={() => { setChallengeUrl(""); setTopicIndexes(pickTopicIndexes(count)); setAnswers(Array(count).fill("")); }} className="mt-2 w-full py-2 text-sm font-bold text-emerald-800">다른 질문으로 새로 만들기</button>
          </div>
        )}
        {linkNotice && <p role="alert" className="rounded-xl bg-amber-50 p-3 text-sm font-bold text-amber-900">{linkNotice}</p>}
        <p className="text-xs leading-5 text-gray-500">별도 서버에 답을 저장하지 않습니다. 초대 정보는 링크에 포함되므로 민감한 개인정보나 비밀번호는 입력하지 마세요.</p>
      </div>
    </section>
  );
}
