"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ShareActions from "@/components/ShareActions";
import SocialResultCard from "./SocialResultCard";
import SocialQuestionFlow from "./SocialQuestionFlow";
import styles from "./social.module.css";
import { trackEvent } from "@/lib/analytics";
import { decodeSocial, encodeSocial, isComparison, socialGames, socialModes, socialScore, validAnswers, type SocialMode, type SocialPayload } from "@/lib/social-games";
import { inboxConfigured, inboxRequest, prepareInbox, rememberInbox, inviteUrl, ownerUrl, type InboxInfo, type OwnedInbox } from "@/lib/friend-inbox";

export default function SocialGame({ mode }: { mode: SocialMode }) {
  const game = socialGames[mode];
  const [payload, setPayload] = useState<SocialPayload | null>(null);
  const [invalid, setInvalid] = useState(false);
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState<number[]>([]);
  const [url, setUrl] = useState("");
  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [remoteInvite, setRemoteInvite] = useState<InboxInfo | null>(null);
  const [owned, setOwned] = useState<OwnedInbox | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);
  const pendingOwner = useRef<{ signature: string; box: OwnedInbox } | null>(null);
  const submission = useRef("");
  const busyRef = useRef(false);
  const version = useRef(0);
  const [reload, setReload] = useState(0);
  useEffect(() => {
    const navigationVersion = version;
    let controller: AbortController | undefined;
    const restore = async () => {
      controller?.abort();
      controller = new AbortController();
      const current = ++version.current;
      busyRef.current = false;
      submission.current = "";
      pendingOwner.current = null;
      setReady(false); setBusy(false); setError(""); setRemoteInvite(null); setOwned(null); setSaved(false);
      setPayload(null); setInvalid(false); setAnswers([]); setName(""); setUrl(""); setStarted(false);
      const raw = window.location.hash.slice(1);
      if (raw.startsWith("box=")) {
        if (!/^box=[a-f0-9]{32}$/.test(raw)) setInvalid(true);
        else {
          try {
            const box = await inboxRequest<InboxInfo>(`/inboxes/${raw.slice(4)}`, { signal: controller.signal });
            if (version.current !== current) return;
            if (box.mode !== mode) setInvalid(true);
            else { setRemoteInvite(box); trackEvent("invite_open", { tool: mode }); }
          } catch (err) { if (version.current === current) { setInvalid(true); setError(err instanceof Error ? err.message : "초대를 불러오지 못했어요."); } }
        }
      } else if (raw) {
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
      if (version.current === current) setReady(true);
    };
    restore();
    window.addEventListener("hashchange", restore);
    window.addEventListener("popstate", restore);
    return () => { navigationVersion.current++; controller?.abort(); window.removeEventListener("hashchange", restore); window.removeEventListener("popstate", restore); };
  }, [mode, reload]);
  const guest = payload?.kind === "invite" || Boolean(remoteInvite && payload?.kind !== "result");
  const result = payload?.kind === "result" ? payload : null;
  const needsAnswers = guest || isComparison(mode);
  const markStart = () => {
    if (!started) { setStarted(true); trackEvent("tool_start", { tool: mode, flow: guest ? "invite" : "create" }); }
  };
  const publish = async () => {
    if (busyRef.current || !name.trim() || (needsAnswers && !validAnswers(mode, answers))) return;
    busyRef.current = true;
    setBusy(true); setError("");
    const current = version.current;
    try {
      let next: SocialPayload | null = null;
      let destination: string;
      if (remoteInvite && guest) {
        submission.current ||= crypto.randomUUID();
        const response = await inboxRequest<{ saved: boolean; result: SocialPayload }>(`/inboxes/${remoteInvite.id}/responses`, { method: "POST", body: { submissionId: submission.current, guest: name.trim(), replies: answers, storageAccepted: true } });
        if (current !== version.current) return;
        if (!response.saved || !decodeSocial(encodeSocial(response.result), mode)) throw new Error("저장 결과를 확인하지 못했어요. 다시 시도해 주세요.");
        next = response.result;
        setSaved(true);
        destination = `${window.location.origin}/tools/${mode}#${encodeSocial(next)}`;
      } else if (!guest && inboxConfigured) {
        const selected = isComparison(mode) ? answers : [];
        const signature = JSON.stringify([name.trim(), selected]);
        if (pendingOwner.current?.signature !== signature) {
          const box = await prepareInbox(mode, name.trim());
          if (current !== version.current) return;
          pendingOwner.current = { signature, box };
          // Save capability before the request, so an ambiguous network failure
          // cannot make an already-created inbox inaccessible after a reload.
          setStorageWarning(!rememberInbox(box));
        }
        const box = pendingOwner.current.box;
        const created = await inboxRequest<InboxInfo>("/inboxes", { method: "POST", body: { mode, creator: name.trim(), answers: selected, ownerToken: box.ownerToken, storageAccepted: true } });
        if (current !== version.current) return;
        const mine = { ...created, ownerToken: box.ownerToken };
        setStorageWarning(!rememberInbox(mine)); setOwned(mine);
        destination = inviteUrl(mine);
      } else {
        next = guest && payload
          ? { ...payload, kind: "result", guest: name.trim(), replies: answers }
          : { v: 1, mode, kind: "invite", id: crypto.randomUUID(), creator: name.trim(), answers: isComparison(mode) ? answers : [] };
        destination = `${window.location.origin}/tools/${mode}#${encodeSocial(next)}`;
      }
      setUrl(destination);
      if (guest && next) {
        setPayload(next);
        window.history.replaceState(null, "", destination);
        trackEvent("invite_complete", { tool: mode });
      } else trackEvent("invite_create", { tool: mode });
      trackEvent("tool_complete", { tool: mode, flow: guest ? "invite" : "create" });
    } catch (err) { if (current === version.current) setError(err instanceof Error ? err.message : "저장하지 못했어요. 다시 시도해 주세요."); }
    finally { if (current === version.current) { busyRef.current = false; setBusy(false); } }
  };
  const reset = () => {
    version.current++; busyRef.current = false; pendingOwner.current = null; submission.current = "";
    setRemoteInvite(null); setOwned(null); setBusy(false); setError(""); setSaved(false);
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
    {error && <p role="alert" className={`${styles.storageConsent} mb-5`}>{error}</p>}
    {!ready ? <p role="status">초대 정보를 확인하고 있어요.</p> : invalid ? <section className={styles.stage}><h2 className={styles.question}>링크를 읽을 수 없어요</h2><p className="my-4">주소가 잘렸거나 만료·삭제된 카드일 수 있어요. 보낸 친구에게 확인해 주세요.</p><div className={styles.inboxActions}><button className={styles.secondary} onClick={() => setReload(value => value + 1)}>다시 불러오기</button><button className={styles.primary} onClick={reset}>새로 만들기</button></div></section> : result ? <div className={styles.result}>
      <h2 id="social-result-title" className={styles.resultHeading}>{title}</h2><p className={styles.note}>{subtitle}</p>
      <SocialResultCard data={{kind:mode,title:imageTitle,subtitle,metric:score ? (mode==="friendship-quiz" ? `${score.matches}/${score.total}` : `${score.percent}%`) : undefined,highlights:score ? [{label:"같은 답",value:`${score.matches}개`},{label:"다른 답",value:`${score.total-score.matches}개`},{label:"함께한 친구",value:`${result.creator} · ${result.guest}`}] : game.questions.map((question,index)=>({label:`${index+1}번째 마음`,value:question.options[result.replies![index]]}))}} url={url}/>
      <div className="mt-5"><ShareActions tool={mode} title={title} text={subtitle} url={url}/></div>
      <p className={styles.note} role="status">{saved ? "생성자의 결과함에 저장됐어요. 결과 링크를 다시 보내지 않아도 생성자가 확인할 수 있어요. SNS 알림은 별도로 발송하지 않습니다." : "공유된 결과 카드예요. 기존 링크로 참여한 경우에는 자동 저장되지 않으니 결과 링크를 친구에게 보내주세요."}</p>
      <details className={styles.details}><summary>{score ? "문항별 답 비교하기" : "친구가 고른 내용 자세히 보기"}</summary><div className="space-y-4 pt-3">{game.questions.map((question,index)=><div key={question.prompt} className="border-b border-current/15 pb-4"><h3 className="font-bold">{question.prompt}</h3>{score&&<p>{result.creator}: {question.options[result.answers[index]]}</p>}<p>{score?`${result.guest}: `:""}{question.options[result.replies![index]]}</p>{score&&<p className="text-xs">{result.answers[index]===result.replies![index]?(mode==="friendship-quiz"?"정답":"같은 선택"):"새롭게 알게 된 취향"}</p>}</div>)}</div></details>
      <button className={`${styles.primary} mt-6`} onClick={reset}>나도 초대 링크 만들기 →</button>
    </div> : url ? <section className={styles.stage}><div className={styles.ticket}><span>도전장 준비 완료</span><strong>이제 친구 차례예요</strong><p>{name}님의 링크를 보내주세요.</p></div><ShareActions tool={mode} title={game.title} text={`${name}님의 ${game.title}에 참여해 주세요!`} url={url}/><label className={styles.label}>직접 복사할 초대 주소<input readOnly value={url} onFocus={(event)=>event.target.select()}/></label><p className={styles.note}>{owned ? "친구가 제출하면 내 결과함에 자동으로 모여요. 생성일로부터 30일 동안 최대 100개 응답을 받을 수 있어요." : "친구가 답한 뒤 결과 링크를 다시 보내주면 함께 볼 수 있어요."}</p>
      {owned && <div className={styles.details}><h2 className="font-bold">친구에게는 위 참여 링크만 보내세요</h2><button className={`${styles.primary} mt-4`} onClick={() => window.location.assign(ownerUrl(owned))}>내 결과함 열기 →</button><details className={styles.details}><summary>생성자 전용 주소 보관하기</summary><p>이 주소를 가진 사람은 모든 답변을 보고 삭제할 수 있어요. 친구나 SNS에 공유하지 마세요. 다른 기기에서 내 결과함을 열 때만 사용하세요.</p><input aria-label="생성자 전용 결과함 주소" className={styles.privateLink} readOnly value={ownerUrl(owned)} onFocus={event => event.target.select()} /></details>{storageWarning && <p role="alert" className={styles.note}>이 브라우저에 결과함 주소를 저장하지 못했어요. 페이지를 닫기 전에 위 생성자 전용 주소를 따로 보관해 주세요.</p>}</div>}
      <button onClick={reset} className={`${styles.secondary} mt-5`}>내용을 바꿔 새 링크 만들기</button></section> :
      <SocialQuestionFlow key={remoteInvite?.id??payload?.id??mode} name={name} onName={(value)=>{setName(value);markStart();}} answers={answers} onAnswer={(index,choice)=>{if(busyRef.current)return;setAnswers(previous=>{const next=[...previous];next[index]=choice;return next;});markStart();}} questions={game.questions} needsAnswers={Boolean(needsAnswers)} invitation={guest?`${remoteInvite?.creator??payload?.creator}님이 초대했어요. ${mode==="friendship-quiz"?"친구의 답을 맞혀보세요.":mode==="friend-chemistry"?"내 취향대로 답하세요.":"친구를 떠올리며 골라주세요."}`:""} onComplete={publish} busy={busy} storageNotice={remoteInvite && guest ? `닉네임과 답변이 생성자에게 공개되고, ${new Date(remoteInvite.expiresAt).toLocaleDateString("ko-KR")}까지 서버 결과함에 저장됩니다.` : !guest && inboxConfigured ? "닉네임과 선택이 30일간 서버에 저장됩니다. 참여 링크를 받은 친구는 닉네임을 볼 수 있습니다." : undefined} submitLabel={guest?"결과 카드 완성하기":"친구 초대 링크 만들기"}/>
    }
    <Link href="/tools/friend-inbox" className="mt-6 inline-block min-h-11 py-3 text-sm font-bold underline">내가 만든 질문의 결과함</Link>
    <details className={styles.details}><summary>개인정보 및 이용 안내</summary><p>새 초대는 닉네임과 선택을 서버에 저장하고 친구 답변을 생성자의 결과함에 모읍니다. 생성 30일 후 접근이 종료되고 정기 정리 작업으로 삭제됩니다. 생성자는 결과함 전체를 먼저 삭제할 수 있습니다. 서버 저장은 완성 단계에서 별도로 동의하며 선택 분석 쿠키와는 다릅니다.</p><p className="mt-2">기존 초대·공유 결과 카드에는 닉네임과 선택이 링크에 포함될 수 있습니다. 링크 소지자는 내용을 읽거나 바꿀 수 있고 이미 공유된 사본은 결과함 삭제로 회수되지 않습니다. 민감한 정보는 넣지 마세요. SNS 자동 알림은 없습니다. 놀이용 콘텐츠이며 실제 우정·성격을 진단하지 않습니다. 닉네임·답변·결과함 열람 키는 분석 이벤트에 넣지 않습니다.</p></details>
    <nav aria-label="다른 친구 놀이" className="mt-8 grid gap-3">{socialModes.filter(item=>item!==mode).map(item=><Link key={item} href={`/tools/${item}`} className="border-b border-current/15 py-3 text-sm font-bold">{socialGames[item].title} →</Link>)}<Link href="/tools/moon-compatibility" className="border-b border-current/15 py-3 text-sm font-bold">생일 달 궁합 카드 →</Link></nav>
  </div></main>;
}
