"use client";
/* eslint-disable react-hooks/set-state-in-effect -- query-string hydration initializes client-only result state */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ShareResultCard from "@/components/ShareResultCard";
import { trackEvent } from "@/lib/analytics";
import {
  decodeTelepathyResult,
  normalizeTelepathyAnswer,
  telepathyScore,
  telepathyTier,
  telepathyTierCopy,
  type TelepathyResultPayload,
} from "@/lib/telepathy";
import { LINK_TOPICS } from "@/components/viral/TelepathyLinkChallenge";

export default function TelepathyResultView() {
  const [payload, setPayload] = useState<TelepathyResultPayload | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("data") ?? "";
    const decoded = decodeTelepathyResult(value);
    setPayload(decoded);
    setLoaded(true);
    if (decoded) {
      const score = telepathyScore(decoded.challenge, decoded.friendAnswers);
      trackEvent("telepathy_result_view", { score: score.percent, rounds: score.total });
    }
  }, []);

  const score = useMemo(
    () => payload ? telepathyScore(payload.challenge, payload.friendAnswers) : null,
    [payload],
  );

  if (!loaded) return <div className="mx-auto max-w-2xl px-4 py-16 text-center text-gray-500">결과를 불러오는 중...</div>;

  if (!payload || !score) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="text-5xl">🔗</div>
        <h1 className="mt-4 text-2xl font-black text-gray-900">결과 링크가 유효하지 않아요</h1>
        <p className="mt-2 text-gray-600">링크가 잘리지 않았는지 확인하거나 새로운 텔레파시를 시작해주세요.</p>
        <Link href="/tools/telepathy-game" className="mt-6 inline-block rounded-xl bg-purple-600 px-6 py-3 font-bold text-white">새 텔레파시 만들기</Link>
      </div>
    );
  }

  const copy = telepathyTierCopy[telepathyTier(score.percent)];
  const resultRows = payload.challenge.topics.map((topicIndex, index) => ({
    topic: LINK_TOPICS[topicIndex],
    creatorAnswer: payload.challenge.answers[index],
    friendAnswer: payload.friendAnswers[index],
    match: normalizeTelepathyAnswer(payload.challenge.answers[index]) === normalizeTelepathyAnswer(payload.friendAnswers[index]),
  }));

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <header className="rounded-3xl bg-gradient-to-br from-purple-700 via-purple-600 to-pink-500 px-6 py-9 text-center text-white shadow-xl">
        <div className="text-6xl">{copy.emoji}</div>
        <p className="mt-4 text-xs font-black tracking-[0.15em] text-white/70">TELEPATHY RESULT</p>
        <h1 className="mt-2 text-3xl font-black">{payload.challenge.creator} × {payload.challenge.friend}</h1>
        <p className="mt-5 text-5xl font-black">{score.percent}%</p>
        <strong className="mt-3 block text-xl">{copy.title}</strong>
        <p className="mt-1 text-sm text-white/80">{copy.description}</p>
      </header>

      <section className="mt-6 space-y-3" aria-labelledby="answer-comparison-title">
        <h2 id="answer-comparison-title" className="text-xl font-black text-gray-900">답변 비교</h2>
        {resultRows.map((row, index) => (
          <article key={`${row.topic}-${index}`} className={`rounded-2xl border p-4 ${row.match ? "border-emerald-200 bg-emerald-50" : "border-gray-200 bg-white"}`}>
            <div className="flex items-start justify-between gap-3">
              <strong className="text-sm text-gray-800">{index + 1}. {row.topic}</strong>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-black ${row.match ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600"}`}>{row.match ? "일치" : "서로 다름"}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl bg-white/80 p-3"><span className="block text-[11px] text-gray-500">{payload.challenge.creator}</span><b className="mt-1 block text-gray-900">{row.creatorAnswer}</b></div>
              <div className="rounded-xl bg-white/80 p-3"><span className="block text-[11px] text-gray-500">{payload.challenge.friend}</span><b className="mt-1 block text-gray-900">{row.friendAnswer}</b></div>
            </div>
          </article>
        ))}
      </section>

      <div className="mt-6">
        <ShareResultCard
          kicker="친구 텔레파시 결과"
          title={`${payload.challenge.creator} × ${payload.challenge.friend} · ${score.percent}%`}
          subtitle={copy.description}
          highlights={[
            { label: "일치한 답", value: `${score.matches}/${score.total}` },
            { label: "우리 유형", value: copy.title },
          ]}
          shareText={`${payload.challenge.creator}님과 ${payload.challenge.friend}님의 텔레파시는 ${score.percent}%! 나와도 해볼래?`}
          fileName={`telepathy-${telepathyTier(score.percent)}`}
          accent="#7e22ce"
        />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link href="/tools/telepathy-game" className="rounded-2xl bg-purple-700 px-5 py-4 text-center font-black text-white">내 친구에게 도전 보내기</Link>
        <Link href="/tools/friend-chemistry" className="rounded-2xl border border-purple-200 bg-purple-50 px-5 py-4 text-center font-black text-purple-800">친구 케미도 비교하기</Link>
      </div>
    </div>
  );
}
