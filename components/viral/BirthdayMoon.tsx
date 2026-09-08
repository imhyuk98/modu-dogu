"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ShareActions from "@/components/ShareActions";
import SocialResultCard from "./SocialResultCard";
import styles from "./social.module.css";
import { trackEvent } from "@/lib/analytics";
import { birthdayPhase, decodeMoon, encodeMoon, moonPhases, moonStory, type MoonCard } from "@/lib/birthday-moon";

export default function BirthdayMoon() {
  const [names, setNames] = useState(["", ""]);
  const [dates, setDates] = useState(["", ""]);
  const [card, setCard] = useState<MoonCard | null>(null);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");
  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const restore = () => {
      setCard(null); setUrl(""); setError("");
      if (window.location.hash) {
        const value = decodeMoon(window.location.hash.slice(1));
        if (value) { setCard(value); setUrl(window.location.href); trackEvent("shared_result_open", { tool: "moon-compatibility" }); }
        else setError("결과 링크를 읽을 수 없어요. 전체 주소를 다시 받거나 새 카드를 만들어 주세요.");
      }
      setReady(true);
    };
    restore(); window.addEventListener("hashchange", restore); window.addEventListener("popstate", restore);
    return () => { window.removeEventListener("hashchange", restore); window.removeEventListener("popstate", restore); };
  }, []);
  const markStart = () => { if (!started) { setStarted(true); trackEvent("tool_start", { tool: "moon-compatibility" }); } };
  const story = card ? moonStory(card.a, card.b) : null;
  const reset = () => { setCard(null); setDates(["", ""]); setNames(["", ""]); setUrl(""); setError(""); setStarted(false); window.history.replaceState(null, "", "/tools/moon-compatibility"); };
  return <main className={styles.play}><div className={`${styles.wrap} space-y-7`}>
    <header className={styles.header}><p className={styles.eyebrow}>친구랑, 한 장.</p><h1 className="mt-3 text-3xl font-black sm:text-4xl">생일 달 궁합 카드</h1><p className="mt-4 leading-7 text-gray-600">두 생일의 달을 모티브로 우리만의 카드를 만들어요. 실제 궁합 점수를 매기지 않는 감성 놀이입니다.</p></header>
    {error && <p role="alert" className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">{error}</p>}
    {!ready ? <p role="status">카드를 확인하고 있어요.</p> : card && story ? <>
      <h2 className={styles.resultHeading}>{story.title}</h2>
      <SocialResultCard data={{kind:"moon-compatibility",title:story.title,subtitle:`${card.first} · ${card.second} / 오락용 달 모티브 카드`,moons:[card.a,card.b],highlights:[{label:card.first,value:moonPhases[card.a].name},{label:card.second,value:moonPhases[card.b].name}]}} url={url}/>
      <p className={styles.note}>{story.text} 평균 달 주기를 사용한 근사 표현이며 천문 관측·관계 진단용이 아닙니다.</p>
      <ShareActions tool="moon-compatibility" title={story.title} text={`${card.first} · ${card.second}, ${story.title}`} url={url}/>
      <button onClick={reset} className="min-h-12 rounded-xl border border-gray-300 bg-white px-6 font-bold">다른 생일로 새 카드 만들기</button>
    </> : <form className="calc-card space-y-6 p-6 sm:p-8" onSubmit={(event) => {
      event.preventDefault();
      const a = birthdayPhase(dates[0]), b = birthdayPhase(dates[1]);
      if (a === null || b === null || names.some((name) => !name.trim())) { setError("닉네임과 1900년 이후, 오늘까지의 올바른 생일을 입력해 주세요."); return; }
      const next = { first: names[0].trim(), second: names[1].trim(), a, b };
      const destination = `${window.location.origin}/tools/moon-compatibility#${encodeMoon(next)}`;
      setCard(next); setUrl(destination); setError(""); setDates(["", ""]);
      window.history.replaceState(null, "", destination);
      trackEvent("tool_complete", { tool: "moon-compatibility" });
    }}>
      {[0, 1].map((index) => <fieldset key={index} className="space-y-3"><legend className="mb-3 font-bold">{index === 0 ? "첫 번째 사람" : "두 번째 사람"}</legend><label className="block text-sm">닉네임<input required maxLength={12} value={names[index]} onChange={(event) => { setNames((current) => current.map((name, i) => i === index ? event.target.value.replace(/[\u0000-\u001f\u007f]/g, "") : name)); markStart(); }} className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3" /></label><label className="block text-sm">생년월일<input required type="date" min="1900-01-01" max={new Date().toISOString().slice(0, 10)} value={dates[index]} onChange={(event) => { setDates((current) => current.map((date, i) => i === index ? event.target.value : date)); markStart(); }} className="mt-2 min-w-0 w-full rounded-xl border border-gray-300 bg-white px-4 py-3" /></label></fieldset>)}
      <p className="text-xs leading-6 text-gray-600">상대의 동의를 받고 입력해 주세요. 생년월일은 브라우저에서만 계산하고, 공유 링크에는 닉네임과 8단계 달 유형만 포함합니다.</p><button type="submit" className="min-h-12 w-full rounded-xl bg-[#344563] px-5 font-bold text-white">우리의 달 카드 만들기</button>
    </form>}
    <section className="rounded-2xl border border-gray-200 bg-white p-6 text-sm leading-7 text-gray-600"><h2 className="mb-2 font-bold text-gray-900">달 모양은 어떻게 정하나요?</h2><p>생일의 UTC 정오를 기준으로, 2000년 1월 6일 새달과 평균 약 29.53일 주기로 계산해 8단계 모티브로 나눕니다. 실제 달 주기는 일정하지 않아 경계 날짜에서는 관측값과 다를 수 있습니다. 출생 시각·지역은 반영하지 않습니다.</p><p className="mt-2">카드의 관계 문구는 창작이며 과학적인 궁합 판정이 아닙니다. 정확한 천문 정보는 <a className="underline" href="https://aa.usno.navy.mil/data/MoonPhases" target="_blank" rel="noopener noreferrer">미 해군 천문대의 달 위상 자료</a>를 참고하세요.</p><p className="mt-2">링크는 암호화되지 않습니다. 주소를 받은 사람은 닉네임과 결과를 읽거나 바꿀 수 있습니다.</p></section>
    <Link href="/tools/friendship-quiz" className="block rounded-xl border border-gray-200 bg-white p-5 font-bold">✍️ 이번에는 친구가 나를 얼마나 아는지 확인해 볼까요? →</Link>
  </div></main>;
}
