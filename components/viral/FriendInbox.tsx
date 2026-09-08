"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ShareActions from "@/components/ShareActions";
import { encodeSocial, isComparison, socialGames, socialScore } from "@/lib/social-games";
import { forgetInbox, inboxConfigured, inboxRequest, inviteUrl, ownerUrl, readOwnedInboxes, rememberInbox, type InboxView, type OwnedInbox } from "@/lib/friend-inbox";
import styles from "./social.module.css";

type Capability = Pick<OwnedInbox, "id" | "ownerToken">;
export default function FriendInbox() {
  const router = useRouter();
  const [owned, setOwned] = useState<OwnedInbox[]>([]);
  const [selected, setSelected] = useState<Capability | null>(null);
  const [view, setView] = useState<InboxView | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [checkedAt, setCheckedAt] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const deletingRef = useRef(false);
  const selectedId = selected?.id, selectedToken = selected?.ownerToken;

  useEffect(() => {
    const restore = () => {
      setOwned(readOwnedInboxes()); setNotice(""); setError("");
      const raw = window.location.hash.slice(1);
      if (raw) {
        const match = raw.match(/^([a-f0-9]{32})\.([a-f0-9]{64})$/);
        if (match) setSelected({ id: match[1], ownerToken: match[2] });
        else { setSelected(null); setError("생성자 전용 주소가 올바르지 않아요. 보관한 전체 주소를 확인해 주세요."); }
      } else setSelected(null);
      setReady(true);
    };
    restore();
    window.addEventListener("hashchange", restore);
    window.addEventListener("popstate", restore);
    return () => { window.removeEventListener("hashchange", restore); window.removeEventListener("popstate", restore); };
  }, []);

  useEffect(() => {
    setView(null); setConfirmDelete(false); setCheckedAt(0);
    if (!selectedId || !selectedToken) return;
    const controller = new AbortController();
    let cancelled = false, inFlight = false;
    const load = async () => {
      if (inFlight || deletingRef.current || document.hidden) return;
      inFlight = true; setBusy(true);
      try {
        const data = await inboxRequest<InboxView>(`/inboxes/${selectedId}/owner`, { ownerToken: selectedToken, signal: controller.signal });
        if (cancelled || deletingRef.current) return;
        setView(data); setError(""); setCheckedAt(Date.now());
        if (!rememberInbox({ id: data.id, mode: data.mode, creator: data.creator, createdAt: data.createdAt, expiresAt: data.expiresAt, maxResponses: data.maxResponses, ownerToken: selectedToken })) setNotice("이 브라우저에 주소를 보관하지 못했어요. 아래 생성자 전용 주소를 따로 보관해 주세요.");
        setOwned(readOwnedInboxes());
      } catch (err) {
        if (!cancelled && !deletingRef.current) { setView(null); setError(err instanceof Error ? err.message : "결과함을 불러오지 못했어요."); }
      } finally { inFlight = false; if (!cancelled) setBusy(false); }
    };
    void load();
    const timer = window.setInterval(load, 30000);
    document.addEventListener("visibilitychange", load);
    return () => { cancelled = true; controller.abort(); clearInterval(timer); document.removeEventListener("visibilitychange", load); };
  }, [selectedId, selectedToken, refresh]);

  const open = (box: Capability) => {
    setError(""); setNotice(""); setSelected(box);
    window.history.replaceState(null, "", ownerUrl(box));
  };
  const list = () => {
    setSelected(null); setView(null); setError(""); setConfirmDelete(false);
    setOwned(readOwnedInboxes());
    window.history.replaceState(null, "", "/tools/friend-inbox");
  };
  const remove = async () => {
    if (!selected || deletingRef.current) return;
    deletingRef.current = true; setDeleting(true); setError("");
    try {
      await inboxRequest(`/inboxes/${selected.id}/owner`, { method: "DELETE", ownerToken: selected.ownerToken });
      forgetInbox(selected.id); list(); setNotice("결과함과 저장된 친구 답변을 삭제했습니다. 이미 공유된 결과 카드 사본은 회수되지 않습니다.");
    } catch (err) { setError(err instanceof Error ? err.message : "삭제를 확인하지 못했어요. 다시 시도해 주세요."); }
    finally { deletingRef.current = false; setDeleting(false); }
  };
  const copyPrivate = async () => {
    if (!selected) return;
    try { await navigator.clipboard.writeText(ownerUrl(selected)); setNotice("생성자 전용 주소를 복사했어요. 본인만 볼 수 있는 곳에 보관하세요. SNS에 공유하지 마세요."); }
    catch { setNotice("자동 복사를 사용할 수 없어요. 아래 주소를 길게 눌러 직접 복사해 주세요."); }
  };
  return <main className={styles.play}><div className={styles.wrap}>
    <header className={styles.header}><p className={styles.eyebrow}>나에게 도착한 친구들의 마음</p><h1>내 질문의 결과함</h1><p>참여 링크는 친구에게, 결과함 주소는 나만 보관해요.</p></header>
    {error && <p role="alert" className={styles.storageConsent}>{error}</p>}
    {notice && <p role="status" className={styles.storageConsent}>{notice}</p>}
    {!ready ? <p role="status">내 결과함을 확인하고 있어요…</p> : !inboxConfigured ? <section className={styles.stage}><h2 className={styles.question}>결과함 연결이 필요해요</h2><p>운영 홈페이지에서 이용하거나 관리자에게 연결 상태를 확인해 주세요.</p></section> : selected ? <>
      <div className={styles.inboxActions}><button className={styles.secondary} onClick={list} disabled={deleting}>← 내 결과함 목록</button><button className={styles.secondary} onClick={() => setRefresh(value => value + 1)} disabled={busy || deleting}>{busy ? "불러오는 중…" : "새 답변 확인"}</button></div>
      {view && <>
        <section className={`${styles.stage} mt-5`} aria-label="선택한 결과함">
          <p className={styles.eyebrow}>{socialGames[view.mode].title}</p><h2 className={styles.resultHeading}>{view.creator}님의 질문</h2>
          <div className={styles.inboxStats}><div><span>도착한 답변</span><strong>{view.responses.length}<small className="ml-1 text-sm">/ {view.maxResponses}</small></strong></div><div><span>보관 종료</span><strong className="!text-base">{new Date(view.expiresAt).toLocaleDateString("ko-KR")}</strong></div></div>
          <p className={styles.note}>화면이 열려 있으면 30초마다 새 답변을 확인합니다. 닉네임은 본인 인증 정보가 아니며, 같은 사람이 다른 닉네임으로 참여할 수 있습니다.</p>
          <p className={styles.note} role="status">{checkedAt ? `마지막 확인 ${new Date(checkedAt).toLocaleTimeString("ko-KR")}` : "답변 확인 중"}</p>
        </section>
        <section className="mt-8" aria-labelledby="inbox-responses-title"><h2 id="inbox-responses-title" className="text-xl font-bold">친구별 결과</h2>
          {!view.responses.length ? <div className={styles.inboxItem}><h3>첫 답변을 기다리고 있어요</h3><p className={styles.note}>친구에게 참여 링크를 보내주세요. 친구가 마지막 완성 버튼을 누르면 여기에 모입니다.</p></div> : <div className={styles.inboxList}>{view.responses.map(response => {
            const result = response.result;
            const score = isComparison(view.mode) ? socialScore(result.answers, result.replies ?? []) : null;
            return <article key={response.id} className={styles.inboxItem} data-inbox-response>
              <h3>{result.guest}</h3><p className={styles.note}>{new Date(response.createdAt).toLocaleString("ko-KR")}</p>
              <p className="mt-3 text-lg font-bold">{score ? view.mode === "friendship-quiz" ? `${score.matches}/${score.total}문제 정답` : `취향 일치도 ${score.percent}%` : view.mode === "friend-manual" ? "친구가 완성한 내 설명서" : "나에게 보낸 칭찬 카드"}</p>
              <details className={styles.details}><summary>문항별 답변 보기</summary>{socialGames[view.mode].questions.map((question, index) => <div key={question.prompt} className="mb-4"><h4 className="font-bold">{question.prompt}</h4>{score && <p>내 선택: {question.options[result.answers[index]]}</p>}<p>친구: {question.options[result.replies?.[index] ?? 0]}</p></div>)}</details>
              <button className={`${styles.secondary} mt-3`} onClick={() => router.push(`/tools/${view.mode}#${encodeSocial(result)}`)}>결과 카드 보기 · SNS 공유</button>
            </article>;
          })}</div>}
        </section>
        <section className={`${styles.stage} mt-6`} aria-label="친구에게 참여 링크 보내기"><h2 className="mb-4 text-lg font-bold">더 많은 친구에게 물어볼까요?</h2><ShareActions tool={view.mode} title={socialGames[view.mode].title} text={`${view.creator}님의 질문에 답해 주세요!`} url={inviteUrl(view)} /><p className={styles.note}>위 SNS 버튼은 참여 링크만 보냅니다. 생성자 전용 주소는 포함하지 않습니다.</p></section>
        <details className={styles.details}><summary>생성자 전용 주소 · 다른 기기에서 열기</summary><p>이 주소를 가진 사람은 모든 답변을 보고 결과함을 삭제할 수 있어요. 다른 사람에게 보내지 마세요. 브라우저 데이터를 지우기 전에 개인적으로 보관해 주세요.</p><input className={styles.privateLink} aria-label="생성자 전용 결과함 주소" readOnly value={ownerUrl(selected)} onFocus={event => event.target.select()} /><button className={`${styles.secondary} mt-3`} onClick={copyPrivate}>비공개 주소 복사</button></details>
        <section className={styles.details} aria-label="결과함 삭제">
          {!confirmDelete ? <button className={styles.secondary} onClick={() => setConfirmDelete(true)}>결과함 전체 삭제</button> : <><p>질문과 친구들의 저장된 답변을 모두 삭제할까요? 되돌릴 수 없으며 참여 링크도 종료됩니다. 이미 공유한 결과 카드 사본은 남습니다.</p><div className={styles.inboxActions}><button className={styles.secondary} disabled={deleting} onClick={() => setConfirmDelete(false)}>취소</button><button className={styles.primary} disabled={deleting} onClick={remove}>{deleting ? "삭제 확인 중…" : "확인 · 전체 삭제"}</button></div></>}
        </section>
      </>}
      {!view && !busy && error && <button className={`${styles.secondary} mt-4`} onClick={() => { forgetInbox(selected.id); list(); setNotice("이 기기의 목록에서만 지웠습니다. 서버에 남은 결과함을 삭제한 것은 아닙니다."); }}>이 기기 목록에서만 지우기</button>}
    </> : <section className={styles.stage}><h2 className={styles.resultHeading}>내가 만든 질문</h2><p className={styles.note}>이 브라우저에서 보관한 결과함입니다. 다른 브라우저·카카오 인앱에서는 보관해 둔 생성자 전용 주소로 열어주세요. 주소를 잃으면 로그인 없는 서비스 특성상 복구할 수 없습니다.</p>
      {owned.length ? <div className={styles.inboxList}>{owned.map(box => <button className={styles.inboxItem} key={box.id} onClick={() => open(box)}><strong>{box.creator}님의 {socialGames[box.mode].title}</strong><span className="mt-2 block text-sm">{new Date(box.createdAt).toLocaleDateString("ko-KR")} 생성 · 결과 보기 →</span></button>)}</div> : <div className={styles.inboxItem}><h3>아직 보관된 질문이 없어요</h3><p className={styles.note}>새 질문을 만들면 결과함이 함께 준비됩니다. 이전 방식으로 만든 링크의 답변은 자동으로 가져올 수 없습니다.</p></div>}
      <Link href="/tools/friendship-quiz" className={`${styles.primary} mt-6 block text-center`}>새 우정고사 만들기 →</Link>
    </section>}
    <p className={styles.note}>서버 결과함은 생성일로부터 30일간 이용할 수 있습니다. 이후 접근을 차단하고 시간 단위 정리 작업으로 삭제합니다. 실명·연락처·민감한 정보는 입력하지 마세요.</p>
  </div></main>;
}
