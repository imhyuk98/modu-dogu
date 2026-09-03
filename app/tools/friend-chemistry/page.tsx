"use client";

import { useEffect, useMemo, useState } from "react";
import RelatedTools from "@/components/RelatedTools";
import ShareResultCard from "@/components/ShareResultCard";
import { trackEvent } from "@/lib/analytics";

const questions = [
  { prompt: "여행은 어떻게 시작하는 편?", options: ["일정표부터 만든다", "표만 끊고 떠난다"] },
  { prompt: "연락이 뜸해도 우정은?", options: ["마음만 같으면 괜찮다", "자주 안부를 나눠야 한다"] },
  { prompt: "같이 밥을 먹는다면?", options: ["늘 먹던 검증된 메뉴", "처음 보는 메뉴 도전"] },
  { prompt: "친구가 실수했을 때?", options: ["바로 솔직하게 말한다", "분위기를 보고 천천히 말한다"] },
  { prompt: "쉬는 날 함께 하고 싶은 것?", options: ["밖에서 새로운 경험", "집에서 편안하게 수다"] },
  { prompt: "사진을 찍을 때 더 중요한 것은?", options: ["예쁘게 남기는 결과", "웃긴 순간의 기억"] },
  { prompt: "약속 시간에 대한 생각은?", options: ["10분 전 도착이 기본", "정각 근처면 충분"] },
  { prompt: "깜짝 선물을 고른다면?", options: ["실용적으로 필요한 것", "취향 저격 의미 있는 것"] },
];

function level(score: number) {
  if (score >= 88) return { emoji: "🪩", title: "거의 같은 세계관", subtitle: "말하지 않아도 다음 선택이 보이는 사이", accent: "#a93d28" };
  if (score >= 63) return { emoji: "🧩", title: "달라서 더 잘 맞는 사이", subtitle: "공통점과 차이점의 균형이 좋은 조합", accent: "#596f62" };
  if (score >= 38) return { emoji: "🎢", title: "예측 불가 케미", subtitle: "매번 새로운 결말을 만드는 흥미로운 조합", accent: "#405e8c" };
  return { emoji: "🪐", title: "평행우주 단짝", subtitle: "선택은 반대지만 그래서 더 궁금한 사이", accent: "#775286" };
}

export default function FriendChemistryPage() {
  const [hostAnswers, setHostAnswers] = useState<number[] | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("answers");
    if (raw && /^[01]{8}$/.test(raw)) {
      // The invitation payload exists only in the browser URL.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHostAnswers(raw.split("").map(Number));
      trackEvent("friend_invite_open", { tool: "friend-chemistry" });
    }
  }, []);

  const isGuest = hostAnswers !== null;
  const completed = answers.length === questions.length;
  const inviteUrl = useMemo(() => {
    if (typeof window === "undefined" || answers.length !== questions.length) return "";
    const target = new URL(window.location.pathname, window.location.origin);
    target.searchParams.set("answers", answers.join(""));
    return target.href;
  }, [answers]);

  const score = isGuest && completed
    ? Math.round((answers.filter((answer, index) => answer === hostAnswers[index]).length / questions.length) * 100)
    : 0;
  const result = level(score);

  const choose = (value: number) => {
    const next = [...answers, value];
    setAnswers(next);
    if (next.length !== questions.length) return;
    if (hostAnswers) {
      const matchScore = Math.round((next.filter((answer, index) => answer === hostAnswers[index]).length / questions.length) * 100);
      trackEvent("friend_match_complete", { tool: "friend-chemistry", score: matchScore });
    } else {
      trackEvent("friend_invite_created", { tool: "friend-chemistry" });
    }
  };
  const reset = () => setAnswers([]);
  const becomeHost = () => {
    setHostAnswers(null);
    setAnswers([]);
    window.history.replaceState({}, "", window.location.pathname);
  };

  const shareInvite = async () => {
    const data = { title: "우리 우정 케미는 몇 점?", text: "내 선택을 맞혀보고 우정 케미를 확인해봐!", url: inviteUrl };
    if (navigator.share) {
      try { await navigator.share(data); trackEvent("friend_invite_share", { tool: "friend-chemistry", method: "native" }); return; } catch (error) { if (error instanceof DOMException && error.name === "AbortError") return; }
    }
    await navigator.clipboard.writeText(`${data.text}\n${data.url}`);
    setCopied(true);
    trackEvent("friend_invite_share", { tool: "friend-chemistry", method: "clipboard" });
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl px-4">
        <header className="mb-8">
          <p className="text-sm font-bold text-[#a93d28]">ASYNC FRIEND CHALLENGE</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-950">친구 케미 테스트</h1>
          <p className="mt-4 leading-7 text-gray-600">같은 시간, 같은 장소에 없어도 됩니다. 먼저 8개를 고르고 링크를 보내면 친구의 선택과 바로 비교됩니다.</p>
        </header>

        {!completed && (
          <section className="calc-card p-6 sm:p-8">
            {isGuest && answers.length === 0 && <div className="mb-6 rounded-xl bg-[#f6eee9] p-4 text-sm font-semibold text-[#80311f]">친구가 선택을 남겼어요. 내 답을 고르면 케미 점수가 공개됩니다.</div>}
            <div className="flex items-center justify-between text-xs font-bold text-gray-500"><span>{answers.length + 1} / {questions.length}</span><span>{Math.round(((answers.length + 1) / questions.length) * 100)}%</span></div>
            <div className="mt-3 h-1.5 rounded-full bg-gray-100"><div className="h-full rounded-full bg-[#a93d28] transition-all" style={{ width: `${((answers.length + 1) / questions.length) * 100}%` }} /></div>
            <h2 className="mt-9 text-2xl font-extrabold text-gray-900">{questions[answers.length].prompt}</h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {questions[answers.length].options.map((option, index) => (
                <button key={option} type="button" onClick={() => choose(index)} className="min-h-28 rounded-xl border border-gray-200 bg-white p-5 text-left font-bold text-gray-800 transition hover:-translate-y-0.5 hover:border-[#a93d28] hover:bg-[#fffaf7]"><span className="mb-3 block font-mono text-xs text-[#a93d28]">CHOICE {index + 1}</span>{option}</button>
              ))}
            </div>
          </section>
        )}

        {completed && !isGuest && (
          <section className="calc-card overflow-hidden">
            <div className="bg-[#1d1c19] p-8 text-white sm:p-10">
              <p className="font-mono text-xs font-bold tracking-[0.16em] text-[#e67d62]">LINK READY</p>
              <h2 className="mt-5 text-3xl font-extrabold">이제 친구 차례예요</h2>
              <p className="mt-3 leading-7 text-white/70">답은 링크 주소에 숫자로만 저장됩니다. 서버에는 어떤 선택도 전송하지 않습니다.</p>
            </div>
            <div className="p-6 sm:p-8">
              <div className="break-all rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-xs text-gray-600">{inviteUrl}</div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" onClick={shareInvite} className="min-h-12 rounded-lg bg-[#a93d28] px-6 font-bold text-white hover:bg-[#8d321f]">{copied ? "링크 복사 완료" : "친구에게 도전장 보내기"}</button>
                <button type="button" onClick={reset} className="min-h-12 rounded-lg border border-gray-300 px-5 font-bold text-gray-700">답 다시 고르기</button>
              </div>
            </div>
          </section>
        )}

        {completed && isGuest && (
          <div className="space-y-5">
            <section className="calc-card overflow-hidden">
              <div className="p-8 text-white sm:p-10" style={{ background: `linear-gradient(135deg, ${result.accent}, #1d1c19)` }}>
                <p className="font-mono text-xs font-bold tracking-[0.16em] text-white/70">CHEMISTRY SCORE</p>
                <div className="mt-5 text-6xl">{result.emoji}</div>
                <p className="mt-6 text-6xl font-black">{score}<span className="text-2xl">점</span></p>
                <h2 className="mt-5 text-3xl font-extrabold">{result.title}</h2>
                <p className="mt-2 text-white/75">{result.subtitle}</p>
              </div>
              <div className="grid gap-3 p-6 sm:grid-cols-2 sm:p-8">
                {questions.map((question, index) => {
                  const same = answers[index] === hostAnswers[index];
                  return <div key={question.prompt} className={`rounded-xl border p-4 ${same ? "border-emerald-200 bg-emerald-50" : "border-orange-200 bg-orange-50"}`}><strong className="text-sm text-gray-900">{same ? "같은 선택" : "다른 선택"}</strong><p className="mt-1 text-xs leading-5 text-gray-600">{question.prompt}</p></div>;
                })}
              </div>
              <div className="px-6 pb-7 sm:px-8"><button type="button" onClick={becomeHost} className="min-h-11 rounded-lg border border-gray-300 px-5 text-sm font-bold text-gray-700">내 친구에게도 보내기</button></div>
            </section>
            <ShareResultCard kicker="FRIEND CHEMISTRY" title={`${score}점 · ${result.title}`} subtitle={result.subtitle} highlights={[{ label: "일치", value: `${Math.round(score / 12.5)}개` }, { label: "차이", value: `${8 - Math.round(score / 12.5)}개` }, { label: "관계", value: "친구" }, { label: "문항", value: "8개" }]} shareText={`우리 우정 케미는 ${score}점! 당신의 친구와도 해보세요.`} fileName={`friend-chemistry-${score}`} accent={result.accent} />
          </div>
        )}

        <section className="calc-seo-card mt-8"><h2 className="calc-seo-title">친구 케미 테스트 이용 방법</h2><p className="text-sm leading-7 text-gray-600">먼저 답한 사람이 링크를 만들고 메신저로 보냅니다. 링크를 받은 사람이 같은 질문에 답하면 일치 개수와 서로 다른 선택이 표시됩니다. 이름, 연락처, 로그인은 필요하지 않습니다.</p></section>
        <RelatedTools current="friend-chemistry" />
      </div>
    </main>
  );
}
