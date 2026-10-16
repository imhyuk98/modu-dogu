"use client";

import { useState } from "react";
import RelatedTools from "@/components/RelatedTools";
import { trackEvent } from "@/lib/analytics";

type Template = "profile" | "receipt" | "award" | "headline";
type Format = "square" | "story";

const templates: Record<Template, { label: string; kicker: string; bg: string; ink: string; accent: string }> = {
  profile: { label: "요즘 나 프로필", kicker: "CURRENT STATUS", bg: "#eee8dc", ink: "#1e1c18", accent: "#a23f2b" },
  receipt: { label: "감정 영수증", kicker: "EMOTION RECEIPT", bg: "#f5f1e8", ink: "#22201c", accent: "#246a5c" },
  award: { label: "셀프 상장", kicker: "CERTIFICATE", bg: "#efe4c9", ink: "#2a241b", accent: "#9a6a19" },
  headline: { label: "속보 카드", kicker: "BREAKING NEWS", bg: "#f2eee7", ink: "#171717", accent: "#c52e2e" },
};

function wrap(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = [];
  let line = "";
  for (const char of text) {
    const next = line + char;
    if (line && context.measureText(next).width > maxWidth) { lines.push(line); line = char; } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

export default function MemeCardPage() {
  const [template, setTemplate] = useState<Template>("profile");
  const [format, setFormat] = useState<Format>("square");
  const [title, setTitle] = useState("할 일은 많은데\n일단 분위기는 좋음");
  const [subtitle, setSubtitle] = useState("오늘의 나를 한 장으로 저장했습니다.");
  const [signature, setSignature] = useState("익명의 나");
  const [status, setStatus] = useState("");
  const style = templates[template];

  const createImage = async () => {
    await document.fonts.ready;
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = format === "square" ? 1080 : 1920;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("canvas unavailable");
    const height = canvas.height;
    context.fillStyle = style.bg;
    context.fillRect(0, 0, 1080, height);
    context.strokeStyle = style.ink;
    context.lineWidth = 3;
    context.strokeRect(54, 54, 972, height - 108);
    context.fillStyle = style.accent;
    context.fillRect(54, 54, template === "headline" ? 972 : 18, template === "headline" ? 82 : height - 108);
    context.fillStyle = template === "headline" ? "#fff" : style.accent;
    context.font = '800 30px "Noto Sans KR", sans-serif';
    context.fillText(style.kicker, template === "headline" ? 88 : 104, template === "headline" ? 108 : 154);
    context.fillStyle = style.ink;
    context.font = `900 ${format === "square" ? 72 : 86}px "Noto Sans KR", sans-serif`;
    const titleLines = title.split("\n").flatMap((line) => wrap(context, line, 850));
    const titleY = format === "square" ? 320 : 540;
    titleLines.slice(0, 5).forEach((line, index) => context.fillText(line, 104, titleY + index * (format === "square" ? 94 : 112)));
    const lineBottom = titleY + Math.min(titleLines.length, 5) * (format === "square" ? 94 : 112);
    context.strokeStyle = style.accent;
    context.lineWidth = 5;
    context.beginPath(); context.moveTo(104, lineBottom + 42); context.lineTo(976, lineBottom + 42); context.stroke();
    context.fillStyle = style.ink;
    context.font = '500 32px "Noto Sans KR", sans-serif';
    wrap(context, subtitle, 820).slice(0, 3).forEach((line, index) => context.fillText(line, 104, lineBottom + 110 + index * 48));
    context.fillStyle = style.accent;
    context.font = '750 28px "Noto Sans KR", sans-serif';
    context.fillText(signature, 104, height - 126);
    context.textAlign = "right";
    context.fillStyle = style.ink;
    context.font = '600 24px "Geist Mono", monospace';
    context.fillText("modu-dogu.pages.dev", 974, height - 126);
    return await new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("image unavailable")), "image/png"));
  };

  const save = async () => {
    try { const blob = await createImage(); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `meme-card-${template}-${format}.png`; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); setStatus("이미지를 저장했습니다."); trackEvent("meme_card_save", { tool: "meme-card", template, format }); } catch { setStatus("이미지를 만들지 못했습니다."); }
  };

  const share = async () => {
    try {
      const blob = await createImage();
      const file = new File([blob], `meme-card-${template}.png`, { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) { await navigator.share({ title: style.label, text: title.replaceAll("\n", " "), files: [file] }); setStatus("공유 메뉴를 열었습니다."); trackEvent("meme_card_share", { tool: "meme-card", template, format }); return; }
      await save();
    } catch (error) { if (!(error instanceof DOMException && error.name === "AbortError")) setStatus("공유하지 못했습니다."); }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4">
        <header className="mb-8"><p className="text-sm font-bold text-[#a93d28]">SOCIAL CARD MAKER</p><h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-950">밈 카드 만들기</h1><p className="mt-4 leading-7 text-gray-600">요즘 내 상태, 감정 영수증, 셀프 상장, 한 줄 속보를 입력해 바로 공유 가능한 카드로 만드세요.</p></header>
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="calc-card p-6 sm:p-7">
            <h2 className="text-lg font-extrabold text-gray-900">카드 편집</h2>
            <div className="mt-5 grid grid-cols-2 gap-2">{(Object.keys(templates) as Template[]).map((key) => <button key={key} type="button" onClick={() => setTemplate(key)} aria-pressed={template === key} className={`min-h-11 rounded-lg border px-3 text-sm font-bold ${template === key ? "border-gray-900 bg-gray-900 text-white" : "border-gray-300 text-gray-600"}`}>{templates[key].label}</button>)}</div>
            <label className="mt-6 block text-sm font-bold text-gray-700">메인 문구<textarea value={title} maxLength={70} rows={3} onChange={(event) => setTitle(event.target.value)} className="mt-2 w-full resize-none rounded-lg border border-gray-300 p-3 text-lg font-extrabold outline-none focus:border-[#a93d28]" /></label>
            <label className="mt-4 block text-sm font-bold text-gray-700">설명<input value={subtitle} maxLength={80} onChange={(event) => setSubtitle(event.target.value)} className="mt-2 min-h-12 w-full rounded-lg border border-gray-300 px-3 outline-none focus:border-[#a93d28]" /></label>
            <label className="mt-4 block text-sm font-bold text-gray-700">서명<input value={signature} maxLength={24} onChange={(event) => setSignature(event.target.value)} className="mt-2 min-h-12 w-full rounded-lg border border-gray-300 px-3 outline-none focus:border-[#a93d28]" /></label>
            <div className="mt-5 flex gap-2">{(["square", "story"] as Format[]).map((key) => <button key={key} type="button" onClick={() => setFormat(key)} aria-pressed={format === key} className={`min-h-10 rounded-full border px-4 text-xs font-bold ${format === key ? "border-[#a93d28] bg-[#a93d28] text-white" : "border-gray-300 text-gray-600"}`}>{key === "square" ? "1:1 피드" : "9:16 스토리"}</button>)}</div>
          </section>
          <section className="calc-card flex items-center justify-center overflow-hidden p-6 sm:p-8">
            <div className={`relative w-full max-w-[410px] overflow-hidden border-2 p-7 shadow-xl transition-all ${format === "square" ? "aspect-square" : "aspect-[9/16] max-w-[280px]"}`} style={{ backgroundColor: style.bg, color: style.ink, borderColor: style.ink }}>
              <div className="absolute inset-y-0 left-0 w-2" style={{ backgroundColor: style.accent }} />
              <p className="font-mono text-[10px] font-black tracking-[0.15em]" style={{ color: style.accent }}>{style.kicker}</p>
              <div className={`flex h-full flex-col ${format === "story" ? "pt-24" : "pt-12"}`}><h2 className={`whitespace-pre-line break-keep font-black leading-[1.12] ${format === "story" ? "text-3xl" : "text-3xl sm:text-4xl"}`}>{title || "메인 문구"}</h2><div className="mt-7 h-1 w-full" style={{ backgroundColor: style.accent }} /><p className="mt-5 text-sm leading-6 opacity-70">{subtitle}</p><div className="mt-auto flex items-end justify-between gap-3 text-[10px] font-bold"><span style={{ color: style.accent }}>{signature}</span><span className="font-mono opacity-60">modu-dogu</span></div></div>
            </div>
          </section>
        </div>
        <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={share} className="min-h-12 rounded-lg bg-[#a93d28] px-6 font-bold text-white">SNS로 공유</button><button type="button" onClick={save} className="min-h-12 rounded-lg border border-gray-300 bg-white px-6 font-bold text-gray-700">PNG 저장</button><p className="self-center text-sm text-gray-500" role="status">{status}</p></div>
        <section className="calc-seo-card mt-8"><h2 className="calc-seo-title">내 문구로 만드는 안전한 밈</h2><p className="text-sm leading-7 text-gray-600">유명 캐릭터나 방송 캡처 대신 텍스트와 기본 도형만 사용해 카드를 생성합니다. 입력 내용은 서버로 보내지지 않으며 브라우저에서 바로 PNG로 변환됩니다.</p></section>
        <section className="calc-seo-card mt-8"><h2 className="calc-seo-title">이용 방법</h2><ol className="list-decimal space-y-1 pl-5 text-sm leading-7 text-gray-600"><li>요즘 나 프로필, 감정 영수증, 셀프 상장, 속보 카드 중 템플릿을 고릅니다.</li><li>메인 문구(최대 70자), 설명(최대 80자), 서명(최대 24자)을 입력합니다. 메인 문구는 줄바꿈을 넣을 수 있고 미리보기에 바로 반영됩니다.</li><li>인스타그램 피드용 1:1 또는 스토리용 9:16 비율을 고릅니다.</li><li>&apos;PNG 저장&apos;으로 이미지를 내려받거나, &apos;SNS로 공유&apos;로 휴대폰 공유 메뉴를 엽니다. 이미지 공유를 지원하지 않는 브라우저에서는 PNG 저장으로 대신합니다.</li></ol></section>
        <section className="calc-seo-card mt-8"><h2 className="calc-seo-title">템플릿별 활용 예시</h2><div className="space-y-2 text-sm leading-7 text-gray-600"><p><strong className="text-gray-900">요즘 나 프로필</strong> — &apos;할 일은 많은데 일단 분위기는 좋음&apos;처럼 지금 상태를 한 줄로 소개할 때.</p><p><strong className="text-gray-900">감정 영수증</strong> — 오늘 쓴 감정이나 한 주를 정산하듯 정리하고 싶을 때.</p><p><strong className="text-gray-900">셀프 상장</strong> — 시험 끝, 운동 한 달 달성처럼 스스로를 칭찬하고 싶을 때.</p><p><strong className="text-gray-900">속보 카드</strong> — 뉴스 속보 형식으로 소소한 일상 소식을 과장해서 알리고 싶을 때.</p></div></section>
        <section className="calc-seo-card mt-8"><h2 className="calc-seo-title">자주 묻는 질문</h2><div className="space-y-4 text-sm leading-7 text-gray-600"><div><h3 className="font-bold text-gray-900">만든 카드에 워터마크가 있나요?</h3><p>카드 오른쪽 아래에 사이트 주소가 작게 들어갑니다. 그 외 로고나 광고 문구는 넣지 않습니다.</p></div><div><h3 className="font-bold text-gray-900">긴 문구는 어떻게 되나요?</h3><p>메인 문구는 카드 폭에 맞춰 자동으로 줄이 바뀌며 이미지에는 최대 5줄, 설명은 최대 3줄까지 들어갑니다. 넘치는 부분은 잘리므로 미리보기를 확인한 뒤 저장해 주세요.</p></div><div><h3 className="font-bold text-gray-900">다른 사람 사진이나 캐릭터를 넣을 수 있나요?</h3><p>이미지 업로드 기능은 없습니다. 저작권과 초상권 문제를 피하기 위해 텍스트와 기본 도형만으로 카드를 만듭니다.</p></div></div></section>
        <RelatedTools current="meme-card" />
      </div>
    </main>
  );
}
