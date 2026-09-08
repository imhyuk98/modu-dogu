"use client";
import { useEffect, useRef, useState } from "react";
import type { Question } from "@/lib/social-games";
import styles from "./social.module.css";

export default function SocialQuestionFlow({ name, onName, answers, onAnswer, questions, needsAnswers, invitation, onComplete, submitLabel, storageNotice, busy = false }: {
  name: string; onName: (name: string) => void; answers: number[]; onAnswer: (index: number, choice: number) => void;
  questions: Question[]; needsAnswers: boolean; invitation: string; onComplete: () => void; submitLabel: string; storageNotice?: string; busy?: boolean;
}) {
  const [accepted, setAccepted] = useState(false);
  const [step, setStep] = useState(-1);
  const heading = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const returnToReview = useRef(false);
  const [advancing, setAdvancing] = useState(false);
  useEffect(() => () => { if (timer.current !== null) clearTimeout(timer.current); }, []);
  const goTo = (next: number, editing = false) => {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
    returnToReview.current = editing;
    setAdvancing(false);
    setStep(next);
  };
  const selectAnswer = (choice: number) => {
    if (timer.current !== null) return;
    onAnswer(step, choice);
    setAdvancing(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      const next = returnToReview.current ? questions.length : step + 1;
      returnToReview.current = false;
      setAdvancing(false);
      setStep(next);
    }, 240);
  };
  useEffect(() => {
    if (mounted.current) heading.current?.focus({ preventScroll: true });
    mounted.current = true;
  }, [step]);
  const reviewing = step === questions.length;
  const question = questions[step];
  const canSubmit = !busy && (!storageNotice || accepted);
  const storageConsent = storageNotice ? <label className={styles.storageConsent}><input type="checkbox" checked={accepted} onChange={event => setAccepted(event.target.checked)} disabled={busy} required /><span>{storageNotice} <a href="/privacy" target="_blank" rel="noreferrer" className="underline">처리 안내</a>를 확인하고 저장에 동의합니다.</span></label> : null;
  return <section className={styles.stage} data-quiz-step={step}>
    {invitation && <p className={styles.invitation}>{invitation}</p>}
    {step < 0 ? <form onSubmit={(event) => { event.preventDefault(); if (busy) return; if (name.trim()) { if (needsAnswers) setStep(0); else if (canSubmit) onComplete(); } }}>
      <div className={styles.ticket}><span>친구에게 보내는 작은 도전장</span><strong>{needsAnswers ? `${questions.length}번의 선택, 한 장의 결과` : "친구의 시선으로 완성되는 나"}</strong><p>가입 없이 만들고, 링크로 주고받아요.</p></div>
      <h2 ref={heading} tabIndex={-1} className={styles.question}>어떤 이름으로 시작할까요?</h2>
      <label className={styles.label}>내 닉네임<input required maxLength={12} autoComplete="off" disabled={busy} value={name} onChange={(event) => onName(event.target.value.replace(/[\u0000-\u001f\u007f]/g, ""))} placeholder="실명 대신 별명도 좋아요" /></label>
      {!needsAnswers && storageConsent}
      <button type="submit" className={styles.primary} disabled={!name.trim() || busy || (!needsAnswers && !canSubmit)}>{busy ? "저장 확인 중…" : needsAnswers ? "시작하기 →" : submitLabel}</button>
      <p className={styles.note}>{storageNotice ? "완성할 때 서버 저장 안내를 확인해 주세요." : "닉네임과 선택은 공유 링크에 포함돼요."}{needsAnswers && " 답을 고르면 자동으로 다음 문항으로 이동해요."}</p>
    </form> : <form onSubmit={(event) => { event.preventDefault(); if (busy || timer.current !== null) return; if (reviewing) { if (canSubmit) onComplete(); } else if (answers[step] !== undefined) goTo(returnToReview.current ? questions.length : step + 1); }}>
      <div className={styles.progressLabel}><span>{reviewing ? "마지막 확인" : "한 번에 하나씩"}</span><strong>{reviewing ? `${questions.length} / ${questions.length}` : `${String(step + 1).padStart(2, "0")} / ${String(questions.length).padStart(2, "0")}`}</strong></div>
      <div className={styles.progress} role="progressbar" aria-label="답변 진행" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={reviewing ? questions.length : step}><span style={{ transform: `scaleX(${reviewing ? 1 : step / questions.length})` }} /></div>
      <h2 ref={heading} tabIndex={-1} className={styles.question}>{reviewing ? "이대로 완성할까요?" : question.prompt}</h2>
      {!reviewing && <p className={styles.note}>답을 선택하면 자동으로 이동해요. 이전 버튼으로 돌아갈 수 있어요.</p>}
      {reviewing ? <div className={styles.review}>{questions.map((item, index) => <button type="button" key={item.prompt} disabled={busy} onClick={() => goTo(index, true)}><span>{index + 1}. {item.prompt}<strong>{item.options[answers[index]]}</strong></span><small>수정</small></button>)}</div> : <fieldset className={styles.options} key={step} disabled={advancing || busy}><legend className="sr-only">{question.prompt}</legend>{question.options.map((option, index) => <label key={option} className={`${styles.option} ${answers[step] === index ? styles.selected : ""}`}><input type="radio" name={`question-${step}`} value={index} checked={answers[step] === index} onClick={() => selectAnswer(index)} onChange={() => selectAnswer(index)} /><span>{option}</span><span className={styles.check} aria-hidden="true">{answers[step] === index ? "✓" : String(index + 1).padStart(2, "0")}</span></label>)}</fieldset>}
      {reviewing && storageConsent}
      <div className={styles.navigation}><button type="button" className={styles.secondary} disabled={busy} onClick={() => goTo(step - 1)}>← 이전</button><button type="submit" className={styles.primary} disabled={busy || advancing || (reviewing ? !canSubmit : answers[step] === undefined)}>{busy ? "저장 확인 중…" : reviewing ? submitLabel : advancing ? "다음으로…" : step === questions.length - 1 ? "선택 확인 →" : "다음 →"}</button></div>
      <p className={styles.note}>{reviewing ? "완성 전까지 답을 바꿀 수 있어요. 완성 버튼을 눌러야 제출돼요." : "마지막에는 전체 답을 확인한 뒤 직접 완성해요."}</p>
    </form>}
  </section>;
}
