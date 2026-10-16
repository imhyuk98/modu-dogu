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
    <section className="rounded-2xl border border-gray-200 bg-white p-6 text-sm leading-7 text-gray-600"><h2 className="mb-2 font-bold text-gray-900">이용 방법</h2><ol className="list-decimal space-y-1 pl-5"><li>두 사람의 닉네임과 생년월일을 입력합니다. 상대의 생일은 동의를 받고 입력해 주세요.</li><li>&apos;우리의 달 카드 만들기&apos;를 누르면 각자의 생일 달 모양과 두 달의 관계 문구가 담긴 카드가 만들어집니다.</li><li>카드를 이미지로 저장하거나 결과 링크를 공유합니다. 링크에는 생년월일 대신 닉네임과 달 유형만 들어갑니다.</li></ol>
      <h2 className="mb-2 mt-6 font-bold text-gray-900">카드 문구는 이렇게 정해져요</h2><p>달 모양은 새달, 초승달, 상현달, 차오르는 달, 보름달, 기우는 달, 하현달, 그믐달의 8단계입니다. 두 사람의 달이 같은 단계면 &apos;같은 리듬의 두 달&apos;, 1~2단계 차이면 &apos;나란히 걷는 두 달&apos;, 3단계 이상 떨어져 있으면 &apos;서로 다른 빛의 두 달&apos; 카드가 나옵니다. 8단계는 원형으로 이어지므로 그믐달과 새달은 1단계 차이로 봅니다.</p><p className="mt-2">어떤 결과든 좋고 나쁨을 가르지 않고, 함께 나눌 이야기나 작은 약속을 제안하는 문구로 구성했습니다.</p>
      <h2 className="mb-2 mt-6 font-bold text-gray-900">자주 묻는 질문</h2><h3 className="font-bold text-gray-900">궁합 점수가 나오나요?</h3><p>점수는 없습니다. 생일 달을 모티브로 한 감성 카드이며 과학적인 궁합 판정이나 관계 진단이 아닙니다.</p><h3 className="mt-3 font-bold text-gray-900">입력한 생일은 저장되나요?</h3><p>생년월일은 브라우저 안에서 달 유형을 계산하는 데만 쓰이고 서버로 보내지지 않습니다. 계산 후 입력 칸도 비워집니다.</p><h3 className="mt-3 font-bold text-gray-900">태어난 시간이 달라도 결과가 같나요?</h3><p>출생 시각과 지역은 반영하지 않고 날짜만 사용합니다. 그래서 달 모양이 바뀌는 경계 날짜에는 실제 관측과 한 단계 다를 수 있습니다.</p></section>
    <Link href="/tools/friendship-quiz" className="block rounded-xl border border-gray-200 bg-white p-5 font-bold">✍️ 이번에는 친구가 나를 얼마나 아는지 확인해 볼까요? →</Link>
  </div></main>;
}
