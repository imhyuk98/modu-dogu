"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ShareActions from "@/components/ShareActions";
import SocialResultCard from "./SocialResultCard";
import SocialQuestionFlow from "./SocialQuestionFlow";
import styles from "./social.module.css";
import { trackEvent } from "@/lib/analytics";
import { decodeSocial, encodeSocial, isComparison, socialGames, socialModes, socialScore, validAnswers, type SocialMode, type SocialPayload } from "@/lib/social-games";

export default function SocialGame({ mode }: { mode: SocialMode }) {
  const game = socialGames[mode];
  const [payload, setPayload] = useState<SocialPayload | null>(null);
  const [invalid, setInvalid] = useState(false);
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState<number[]>([]);
  const [url, setUrl] = useState("");
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const restore = () => {
      setPayload(null); setInvalid(false); setAnswers([]); setName(""); setUrl(""); setStarted(false);
      const raw = window.location.hash.slice(1);
      if (raw) {
        const decoded = decodeSocial(raw, mode);
        if (!decoded) setInvalid(true);
        else {
          setPayload(decoded);
          if (decoded.kind === "result") setUrl(window.location.href);
          trackEvent(decoded.kind === "invite" ? "invite_open" : "shared_result_open", { tool: mode });
        }
      } else if (mode === "friend-chemistry") {
        // Keep invitations shared before this release working.
        const legacy = new URLSearchParams(window.location.search).get("answers");
        if (legacy !== null) {
          if (/^[01]{8}$/.test(legacy)) {
            setPayload({ v: 1, mode, kind: "invite", id: "legacy", creator: "친구", answers: legacy.split("").map(Number) });
            trackEvent("invite_open", { tool: mode });
          } else setInvalid(true);
        }
      }
      setReady(true);
    };
    restore();
    window.addEventListener("hashchange", restore);
    window.addEventListener("popstate", restore);
    return () => { window.removeEventListener("hashchange", restore); window.removeEventListener("popstate", restore); };
  }, [mode]);
  const guest = payload?.kind === "invite";
  const result = payload?.kind === "result" ? payload : null;
  const needsAnswers = guest || isComparison(mode);
  const markStart = () => {
    if (!started) { setStarted(true); trackEvent("tool_start", { tool: mode, flow: guest ? "invite" : "create" }); }
  };
  const publish = () => {
    if (!name.trim() || (needsAnswers && !validAnswers(mode, answers))) return;
    const next: SocialPayload = guest && payload
      ? { ...payload, kind: "result", guest: name.trim(), replies: answers }
      : { v: 1, mode, kind: "invite", id: crypto.randomUUID(), creator: name.trim(), answers: isComparison(mode) ? answers : [] };
    const destination = `${window.location.origin}/tools/${mode}#${encodeSocial(next)}`;
    setUrl(destination);
    if (guest) {
      setPayload(next);
      window.history.replaceState(null, "", destination);
      trackEvent("invite_complete", { tool: mode });
    } else trackEvent("invite_create", { tool: mode });
    trackEvent("tool_complete", { tool: mode, flow: guest ? "invite" : "create" });
  };
  const reset = () => {
    window.history.replaceState(null, "", `/tools/${mode}`);
    setPayload(null); setInvalid(false); setAnswers([]); setName(""); setUrl(""); setStarted(false);
  };
  const score = result && isComparison(mode) ? socialScore(result.answers, result.replies!) : null;
  const title = result ? score
    ? mode === "friendship-quiz" ? `${score.matches}/${score.total}문제 정답!` : `취향 일치도 ${score.percent}%`
    : mode === "friend-manual" ? `${result.creator}님의 사용 설명서` : `${result.creator}님에게 주는 칭찬`
    : "";
  const subtitle = result ? score
    ? mode === "friendship-quiz" ? `${result.guest}님이 발견한 ${result.creator}님의 취향. 몰랐던 답으로 다음 이야기를 시작해요.` : `${result.creator}님과 ${result.guest}님, 같은 선택도 다른 선택도 이야기거리가 돼요.`
    : `${result.guest}님이 직접 골라 보낸 마음입니다.` : "";
  const imageTitle = result && mode === "friend-manual" ? `${result.creator}님의\n사용 설명서` : result && mode === "compliment-card" ? `${result.creator}님에게\n주는 칭찬` : title;
  return <main className={styles.play}><div className={styles.wrap}>
    <header className={styles.header}><p className={styles.eyebrow}>친구랑, 한 장.</p><h1>{game.title}</h1><p>{game.description}</p></header>
    {!ready ? <p role="status">초대 정보를 확인하고 있어요.</p> : invalid ? <section className={styles.stage}><h2 className={styles.question}>링크를 읽을 수 없어요</h2><p className="my-4">주소가 잘렸거나 다른 종류의 카드예요. 보낸 친구에게 전체 링크를 다시 요청해 주세요.</p><button className={styles.primary} onClick={reset}>새로 만들기</button></section> : result ? <div className={styles.result}>
      <h2 id="social-result-title" className={styles.resultHeading}>{title}</h2><p className={styles.note}>{subtitle}</p>
      <SocialResultCard data={{kind:mode,title:imageTitle,subtitle,metric:score ? (mode==="friendship-quiz" ? `${score.matches}/${score.total}` : `${score.percent}%`) : undefined,highlights:score ? [{label:"같은 답",value:`${score.matches}개`},{label:"다른 답",value:`${score.total-score.matches}개`},{label:"함께한 친구",value:`${result.creator} · ${result.guest}`}] : game.questions.map((question,index)=>({label:`${index+1}번째 마음`,value:question.options[result.replies![index]]}))}} url={url}/>
      <div className="mt-5"><ShareActions tool={mode} title={title} text={subtitle} url={url}/></div>
      <p className={styles.note}>결과는 자동 전달되지 않아요. 결과 링크를 친구에게 다시 보내주세요. 여러 친구의 답변을 모으는 보관함은 없습니다.</p>
      <details className={styles.details}><summary>{score ? "문항별 답 비교하기" : "친구가 고른 내용 자세히 보기"}</summary><div className="space-y-4 pt-3">{game.questions.map((question,index)=><div key={question.prompt} className="border-b border-current/15 pb-4"><h3 className="font-bold">{question.prompt}</h3>{score&&<p>{result.creator}: {question.options[result.answers[index]]}</p>}<p>{score?`${result.guest}: `:""}{question.options[result.replies![index]]}</p>{score&&<p className="text-xs">{result.answers[index]===result.replies![index]?(mode==="friendship-quiz"?"정답":"같은 선택"):"새롭게 알게 된 취향"}</p>}</div>)}</div></details>
      <button className={`${styles.primary} mt-6`} onClick={reset}>나도 초대 링크 만들기 →</button>
    </div> : url ? <section className={styles.stage}><div className={styles.ticket}><span>도전장 준비 완료</span><strong>이제 친구 차례예요</strong><p>{name}님의 링크를 보내주세요.</p></div><ShareActions tool={mode} title={game.title} text={`${name}님의 ${game.title}에 참여해 주세요!`} url={url}/><label className={styles.label}>직접 복사할 초대 주소<input readOnly value={url} onFocus={(event)=>event.target.select()}/></label><p className={styles.note}>친구가 답한 뒤 결과 링크를 다시 보내주면 함께 볼 수 있어요.</p><button onClick={reset} className={`${styles.secondary} mt-5`}>내용을 바꿔 새 링크 만들기</button></section> :
      <SocialQuestionFlow key={payload?.id??mode} name={name} onName={(value)=>{setName(value);markStart();}} answers={answers} onAnswer={(index,choice)=>{setAnswers(previous=>{const next=[...previous];next[index]=choice;return next;});markStart();}} questions={game.questions} needsAnswers={Boolean(needsAnswers)} invitation={guest?`${payload.creator}님이 초대했어요. ${mode==="friendship-quiz"?"친구의 답을 맞혀보세요.":mode==="friend-chemistry"?"내 취향대로 답하세요.":"친구를 떠올리며 골라주세요."}`:""} onComplete={publish} submitLabel={guest?"결과 카드 완성하기":"친구 초대 링크 만들기"}/>
    }
    <details className={styles.details}><summary>개인정보 및 이용 안내</summary><p>닉네임과 선택은 링크의 # 뒤에 포함됩니다. 암호화된 비밀 편지가 아니며 링크를 가진 사람은 내용을 읽거나 바꿀 수 있어요. 민감한 정보는 넣지 말고, 공유할 때 상대의 동의를 구해 주세요. 별도 답변 서버나 자동 알림은 없습니다.</p><p className="mt-2">놀이용 콘텐츠이며 실제 우정의 깊이·성격을 진단하지 않습니다. 분석에 동의한 경우에도 닉네임과 답변은 분석 이벤트에 넣지 않습니다.</p></details>
    <nav aria-label="다른 친구 놀이" className="mt-8 grid gap-3">{socialModes.filter(item=>item!==mode).map(item=><Link key={item} href={`/tools/${item}`} className="border-b border-current/15 py-3 text-sm font-bold">{socialGames[item].title} →</Link>)}<Link href="/tools/moon-compatibility" className="border-b border-current/15 py-3 text-sm font-bold">생일 달 궁합 카드 →</Link></nav>
  </div></main>;
}
