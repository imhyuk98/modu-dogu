"use client";

import { useId, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { kakaoShareConfigured, loadKakaoShare, sendKakaoShare } from "@/lib/kakao-share";
import { socialShareLink, type SocialNetwork } from "@/lib/social-share-links";
import SocialBrandIcon from "@/components/SocialBrandIcon";

interface ShareActionsProps {
  tool: string;
  title: string;
  text: string;
  url?: string;
  compact?: boolean;
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("Copy unavailable");
}

export default function ShareActions({ tool, title, text, url, compact = false }: ShareActionsProps) {
  const [status, setStatus] = useState("");
  const [instagram, setInstagram] = useState(false);
  const [instagramUrl, setInstagramUrl] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const instagramId = useId();
  const [kakaoState, setKakaoState] = useState<"idle"|"loading"|"ready">("idle");
  const destination = () => new URL(url ?? window.location.href, window.location.origin).href;

  const report = (method: string) => trackEvent("result_share", { tool, method });
  const requestShare = (method: "kakao" | "x" | "line" | "native" | "sms") => {
    trackEvent("share_request", { tool, method });
    // Named events allow channel reports without GA4 custom-dimension setup.
    trackEvent(`share_request_${method}`, { tool });
  };
  const social = (network: SocialNetwork) => {
    try {
      const link = socialShareLink(network, text, destination());
      setExternalLink(link);
      window.open(link, "_blank", "noopener,noreferrer");
      requestShare(network);
      setStatus(`${network === "x" ? "X" : "LINE"} 공유 화면을 요청했어요. 로그인 후 내용을 확인하고 직접 보내주세요.`);
    } catch { setStatus("공유 화면을 열지 못했어요. 링크 복사를 이용해 주세요."); }
  };
  const prepareInstagram = () => {
    setInstagram(value => !value);
    setInstagramUrl(destination());
    if (!instagram) trackEvent("instagram_guide_open", { tool });
  };
  const copyInstagram = async () => {
    try {
      await copyText(destination());
      setStatus("링크만 복사했어요. 인스타그램 스토리의 링크 스티커 또는 DM에 붙여주세요.");
      trackEvent("instagram_link_copy", { tool });
    } catch { setStatus("복사 권한이 없어요. 인스타그램 안내 안의 주소를 길게 눌러 직접 복사해 주세요."); }
  };
  const kakao = async () => {
    if (kakaoState === "loading") return;
    if (kakaoState !== "ready") {
      setKakaoState("loading");
      try { await loadKakaoShare(); setKakaoState("ready"); setStatus("카카오톡 공유가 준비됐어요. 카카오톡으로 보내기를 눌러주세요."); }
      catch { setKakaoState("idle"); setStatus("카카오톡 연결을 준비하지 못했어요. 링크 복사 또는 앱 공유를 이용해 주세요."); }
      return;
    }
    try { sendKakaoShare({tool,title,text,url:destination()}); setStatus("카카오톡 공유를 요청했어요. 선택한 대화방에서 확인해 주세요."); requestShare("kakao"); }
    catch { setStatus("카카오톡 공유를 열지 못했어요. 링크 복사를 이용해 주세요."); }
  };

  const share = async () => {
    const shareUrl = destination();
    try {
      if (navigator.share) {
        requestShare("native");
        await navigator.share({ title, text, url: shareUrl });
        setStatus("공유 메뉴를 열었습니다.");
        report("native");
        return;
      }
      await copyText(`${text}\n${shareUrl}`);
      setStatus("결과와 링크를 복사했습니다.");
      report("clipboard_fallback");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") setStatus("공유를 취소했습니다.");
      else setStatus("공유하지 못했습니다. 링크 복사를 이용해 주세요.");
    }
  };

  const copy = async () => {
    try {
      await copyText(`${text}\n${destination()}`);
      setStatus("결과와 링크를 복사했습니다.");
      report("clipboard");
      trackEvent("share_link_copy", { tool });
    } catch {
      setStatus("복사 권한이 없어요. 브라우저 주소 또는 표시된 초대 주소를 직접 복사해 주세요.");
    }
  };

  const sms = () => {
    const body = encodeURIComponent(`${text}\n${destination()}`);
    window.location.href = `sms:?&body=${body}`;
    setStatus("문자 앱 열기를 요청했어요. 내용을 확인하고 직접 보내주세요.");
    requestShare("sms");
  };

  return (
    <div className={compact ? "space-y-2" : "rounded-2xl border border-gray-200 bg-white p-4"}>
      {!compact && <p className="mb-3 text-sm font-bold text-gray-800">링크로 함께하기</p>}
      <div className="mb-3 grid grid-cols-2 gap-2" role="group" aria-label="SNS별 공유">
        {kakaoShareConfigured && <button type="button" onClick={kakao} disabled={kakaoState === "loading"} className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl bg-[#fee500] px-3 py-3 text-sm font-bold text-[#191919] disabled:opacity-50"><SocialBrandIcon brand="kakao" /><span>{kakaoState === "loading" ? "카카오톡 연결 준비 중…" : kakaoState === "ready" ? "카카오톡으로 보내기" : "카카오톡 공유 준비"}</span></button>}
        <button type="button" onClick={() => social("x")} className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl bg-[#171717] px-3 py-3 text-sm font-bold text-white"><SocialBrandIcon brand="x" /><span>X (트위터)</span></button>
        <button type="button" onClick={() => social("line")} className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-bold text-gray-900"><span className="text-[#06c755]"><SocialBrandIcon brand="line" /></span><span>LINE</span></button>
        <button type="button" onClick={prepareInstagram} aria-expanded={instagram} aria-controls={instagramId} className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-bold text-gray-900"><span className="text-[#d62976]"><SocialBrandIcon brand="instagram" /></span><span>인스타그램<span className="block text-xs font-normal text-gray-600">이미지·링크로 공유</span></span></button>
      </div>
      {externalLink && <p className="mb-3 text-xs leading-5 text-gray-600">공유 화면이 열리지 않으면 <button type="button" onClick={() => window.location.assign(externalLink)} className="min-h-11 underline">공유 화면 다시 열기</button>를 누르세요. 현재 탭에서 열립니다.</p>}
      {instagram && <section id={instagramId} className="mb-3 rounded-xl border border-gray-300 p-4" aria-label="인스타그램 공유 안내">
        <h3 className="text-sm font-bold text-gray-800">인스타그램에 보내는 방법</h3>
        <ol className="my-3 list-inside list-decimal space-y-2 text-sm leading-6 text-gray-600"><li>결과 이미지가 있으면 ‘이미지 저장’을 누르세요. 없으면 화면을 캡처하세요.</li><li>아래 버튼으로 링크를 복사하세요.</li><li>인스타그램에서 이미지를 올리고 스토리 링크 스티커에 붙이거나, DM으로 링크를 보내세요.</li></ol>
        <button type="button" onClick={copyInstagram} className="min-h-11 rounded-lg bg-[#26231e] px-3 text-sm font-bold text-white">인스타그램용 링크 복사</button>
        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex min-h-11 items-center text-sm text-gray-700 underline">인스타그램 열기 ↗</a>
        <label className="mt-3 block text-xs text-gray-600">직접 복사할 주소<input readOnly value={instagramUrl} onFocus={event => event.currentTarget.select()} className="mt-2 block min-h-11 w-full min-w-0 rounded-lg border border-gray-300 bg-white p-2 text-sm text-gray-800" /></label>
        <p className="mt-2 text-xs leading-5 text-gray-600">이미지 첨부나 게시는 자동으로 되지 않습니다. 링크에 닉네임·결과가 포함될 수 있으니 공개 범위를 확인해 주세요.</p>
      </section>}
      <div className="grid grid-cols-2 gap-2 min-[480px]:grid-cols-3">
        <button type="button" onClick={share} className="min-h-11 rounded-xl bg-[#a93d28] px-3 text-sm font-bold text-white">앱으로 공유</button>
        <button type="button" onClick={sms} className="min-h-11 rounded-xl border border-gray-300 bg-white px-3 text-sm font-bold text-gray-700">문자로 보내기</button>
        <button type="button" onClick={copy} className="col-span-2 min-h-11 rounded-xl border border-gray-300 bg-white px-3 text-sm font-bold text-gray-700 min-[480px]:col-span-1">링크 복사</button>
      </div>
      <p className="mt-2 text-xs leading-5 text-gray-500">앱 공유 메뉴는 기기와 설치된 앱에 따라 달라요. 링크 복사는 상대에게 자동 전송되지 않습니다.</p>
      <p className="mt-2 min-h-5 text-xs text-gray-500" role="status" aria-live="polite">{status}</p>
    </div>
  );
}
