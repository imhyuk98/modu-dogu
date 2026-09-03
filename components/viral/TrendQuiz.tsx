"use client";

import { useEffect, useMemo, useState } from "react";
import ShareResultCard from "@/components/ShareResultCard";
import { trackEvent } from "@/lib/analytics";

export interface TrendQuizChoice {
  label: string;
  scores: Record<string, number>;
}

export interface TrendQuizQuestion {
  prompt: string;
  choices: TrendQuizChoice[];
}

export interface TrendQuizResult {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  tips: string[];
  accent: string;
}

interface TrendQuizProps {
  slug: string;
  kicker: string;
  questions: TrendQuizQuestion[];
  results: TrendQuizResult[];
}

export default function TrendQuiz({ slug, kicker, questions, results }: TrendQuizProps) {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [resultId, setResultId] = useState<string | null>(null);

  useEffect(() => {
    const shared = new URLSearchParams(window.location.search).get("result");
    if (results.some((item) => item.id === shared)) {
      // Shared results are restored from the browser URL after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResultId(shared);
      trackEvent("shared_result_open", { tool: slug, result: shared ?? undefined });
    }
  }, [results, slug]);

  const result = useMemo(
    () => results.find((item) => item.id === resultId) ?? null,
    [resultId, results],
  );

  const choose = (choice: TrendQuizChoice) => {
    const next = { ...scores };
    Object.entries(choice.scores).forEach(([key, value]) => {
      next[key] = (next[key] ?? 0) + value;
    });
    setScores(next);

    if (step < questions.length - 1) {
      setStep((value) => value + 1);
      return;
    }

    const winner = results.reduce((best, item) =>
      (next[item.id] ?? 0) > (next[best.id] ?? 0) ? item : best,
    results[0]);
    setResultId(winner.id);
    trackEvent("quiz_complete", { tool: slug, result: winner.id, question_count: questions.length });
    const target = new URL(window.location.href);
    target.searchParams.set("result", winner.id);
    window.history.replaceState({}, "", target);
  };

  const reset = () => {
    setStep(0);
    setScores({});
    setResultId(null);
    window.history.replaceState({}, "", window.location.pathname);
    trackEvent("quiz_retry", { tool: slug });
  };

  if (result) {
    const shareUrl = typeof window === "undefined"
      ? `https://modu-dogu.pages.dev/tools/${slug}?result=${result.id}`
      : window.location.href;

    return (
      <div className="space-y-5">
        <section className="calc-card overflow-hidden">
          <div className="p-7 sm:p-10 text-white" style={{ background: `linear-gradient(135deg, ${result.accent}, #1d1c19)` }}>
            <p className="text-xs font-mono font-bold tracking-[0.16em] opacity-80">YOUR RESULT</p>
            <div className="mt-8 text-6xl" aria-hidden="true">{result.emoji}</div>
            <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold tracking-tight">{result.title}</h2>
            <p className="mt-3 text-lg font-semibold text-white/80">{result.subtitle}</p>
          </div>
          <div className="p-6 sm:p-8">
            <p className="leading-7 text-gray-700">{result.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {result.tags.map((tag) => <span key={tag} className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-700">#{tag}</span>)}
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {result.tips.map((tip, index) => (
                <div key={tip} className="rounded-xl border border-gray-200 p-4 text-sm leading-6 text-gray-700">
                  <strong className="mr-2" style={{ color: result.accent }}>0{index + 1}</strong>{tip}
                </div>
              ))}
            </div>
            <button type="button" onClick={reset} className="mt-7 min-h-11 rounded-lg border border-gray-300 px-5 text-sm font-bold text-gray-700 hover:bg-gray-50">다시 테스트하기</button>
          </div>
        </section>
        <ShareResultCard
          kicker={kicker}
          title={result.title}
          subtitle={result.subtitle}
          highlights={result.tags.slice(0, 4).map((tag, index) => ({ label: `KEY 0${index + 1}`, value: tag }))}
          shareText={`내 결과는 ${result.title}! 당신의 결과는?`}
          fileName={`${slug}-${result.id}`}
          url={shareUrl}
          accent={result.accent}
        />
      </div>
    );
  }

  const question = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  return (
    <section className="calc-card p-6 sm:p-8">
      <div className="flex items-center justify-between gap-4 text-xs font-bold text-gray-500">
        <span>{String(step + 1).padStart(2, "0")} / {questions.length}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100" aria-hidden="true">
        <div className="h-full rounded-full bg-[#a93d28] transition-all" style={{ width: `${progress}%` }} />
      </div>
      <h2 className="mt-9 text-2xl font-extrabold leading-snug text-gray-900">{question.prompt}</h2>
      <div className="mt-7 grid gap-3">
        {question.choices.map((choice, index) => (
          <button
            key={choice.label}
            type="button"
            onClick={() => choose(choice)}
            className="group min-h-14 rounded-xl border border-gray-200 bg-white px-5 py-4 text-left font-semibold text-gray-800 transition hover:-translate-y-0.5 hover:border-[#a93d28] hover:bg-[#fffaf7]"
          >
            <span className="mr-3 font-mono text-xs text-[#a93d28]">{String.fromCharCode(65 + index)}</span>
            {choice.label}
          </button>
        ))}
      </div>
    </section>
  );
}
