"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { trackEvent } from "@/lib/analytics";

export interface ShareHighlight {
  label: string;
  value: string;
}

interface ShareResultCardProps {
  kicker: string;
  title: string;
  subtitle: string;
  highlights: ShareHighlight[];
  shareText: string;
  fileName: string;
  url?: string;
  accent?: string;
}

function getWrappedLines(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const lines: string[] = [];

  for (const paragraph of text.split("\n")) {
    let line = "";
    for (const character of paragraph) {
      const candidate = line + character;
      if (line && context.measureText(candidate).width > maxWidth) {
        lines.push(line.trim());
        line = character.trimStart();
      } else {
        line = candidate;
      }
    }
    if (line) lines.push(line.trim());
  }

  return lines;
}

function drawWrappedText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const lines = getWrappedLines(context, text, maxWidth);
  lines.forEach((line, index) => context.fillText(line, x, y + index * lineHeight));
  return y + lines.length * lineHeight;
}

async function dataUrlToImage(dataUrl: string) {
  const image = new Image();
  image.src = dataUrl;
  await image.decode();
  return image;
}

export default function ShareResultCard({
  kicker,
  title,
  subtitle,
  highlights,
  shareText,
  fileName,
  url,
  accent = "#a93d28",
}: ShareResultCardProps) {
  const [status, setStatus] = useState("");
  const [working, setWorking] = useState(false);
  const [format, setFormat] = useState<"story" | "square">("story");

  const createImage = async () => {
    setWorking(true);
    await document.fonts.ready;

    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = format === "story" ? 1920 : 1080;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas is not supported");

    const destination = new URL(url ?? window.location.href, window.location.origin).href;
    context.fillStyle = "#f4f0e8";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = "#d8d1c5";
    context.lineWidth = 2;
    const height = canvas.height;
    context.strokeRect(48, 48, 984, height - 96);
    context.beginPath();
    context.moveTo(540, 48);
    context.lineTo(540, height - 48);
    context.strokeStyle = "rgba(216, 209, 197, 0.55)";
    context.stroke();

    context.fillStyle = "#1d1c19";
    context.font = '700 48px "Noto Sans KR", sans-serif';
    context.fillText("모두의도구", 92, 138);
    const brandWidth = context.measureText("모두의도구").width;
    context.fillStyle = accent;
    context.fillText(".", 92 + brandWidth, 138);

    context.fillStyle = accent;
    context.font = '700 30px "Geist Mono", "Noto Sans KR", monospace';
    context.fillText(kicker, 92, format === "story" ? 306 : 220);

    context.fillStyle = "#1d1c19";
    context.font = '800 92px "Noto Sans KR", sans-serif';
    const titleBottom = drawWrappedText(
      context,
      title,
      92,
      format === "story" ? 430 : 318,
      896,
      108,
    );

    context.fillStyle = "#5e5a52";
    context.font = '400 36px "Noto Sans KR", sans-serif';
    const subtitleBottom = drawWrappedText(
      context,
      subtitle,
      92,
      titleBottom + 46,
      860,
      56,
    );

    const cardTop = format === "story"
      ? Math.max(890, subtitleBottom + 90)
      : Math.max(585, subtitleBottom + 48);
    const cardWidth = 430;
    const cardHeight = format === "story" ? 190 : 126;
    const columnGap = 36;
    const rowGap = 34;

    highlights.slice(0, 4).forEach((highlight, index) => {
      const column = index % 2;
      const row = Math.floor(index / 2);
      const x = 92 + column * (cardWidth + columnGap);
      const y = cardTop + row * (cardHeight + rowGap);

      context.fillStyle = "#fffcf7";
      context.strokeStyle = "#d8d1c5";
      context.lineWidth = 2;
      context.beginPath();
      context.roundRect(x, y, cardWidth, cardHeight, 20);
      context.fill();
      context.stroke();

      context.fillStyle = "#5e5a52";
      context.font = '600 26px "Noto Sans KR", sans-serif';
      context.fillText(highlight.label, x + 30, y + (format === "story" ? 55 : 42));
      context.fillStyle = index === 0 ? accent : "#1d1c19";
      context.font = `${format === "story" ? 750 : 700} ${format === "story" ? 40 : 31}px "Noto Sans KR", sans-serif`;
      drawWrappedText(
        context,
        highlight.value,
        x + 30,
        y + (format === "story" ? 122 : 88),
        cardWidth - 60,
        format === "story" ? 48 : 36,
      );
    });

    context.fillStyle = accent;
    const footerTop = format === "story" ? 1538 : 922;
    context.fillRect(92, footerTop, 896, 4);
    context.fillStyle = "#1d1c19";
    context.font = '700 32px "Noto Sans KR", sans-serif';
    context.fillText("내 결과도 확인해보기", 92, footerTop + 66);
    context.fillStyle = "#5e5a52";
    context.font = '400 25px "Noto Sans KR", sans-serif';
    if (format === "story") {
      context.fillText("재미로 보는 결과이며 중요한 결정의 근거로 사용하지 마세요.", 92, 1672);
      context.fillText("modu-dogu.pages.dev", 92, 1810);
    } else {
      context.fillText("modu-dogu.pages.dev", 92, 1030);
    }

    try {
      const qrDataUrl = await QRCode.toDataURL(destination, {
        width: 180,
        margin: 1,
        color: { dark: "#1d1c19", light: "#fffcf7" },
      });
      const qrImage = await dataUrlToImage(qrDataUrl);
      if (format === "story") {
        context.drawImage(qrImage, 808, 1670, 180, 180);
      } else {
        context.drawImage(qrImage, 875, 937, 106, 106);
      }
    } catch {
      // The share image still works if QR rendering is unavailable.
    }

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((value) => {
        if (value) resolve(value);
        else reject(new Error("Unable to create image"));
      }, "image/png");
    });
    setWorking(false);
    return { blob, destination };
  };

  const saveImage = async () => {
    try {
      const { blob } = await createImage();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `${fileName}-${format === "story" ? "story" : "square"}.png`;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      setStatus(`${format === "story" ? "9:16" : "1:1"} 결과 이미지를 저장했습니다.`);
      trackEvent("result_image_save", { tool: fileName, format });
    } catch {
      setWorking(false);
      setStatus("이미지를 만들지 못했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  const shareResult = async () => {
    try {
      const { blob, destination } = await createImage();
      const file = new File(
        [blob],
        `${fileName}-${format === "story" ? "story" : "square"}.png`,
        { type: "image/png" },
      );

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title,
          text: shareText,
          url: destination,
          files: [file],
        });
        setStatus("공유 메뉴를 열었습니다.");
        trackEvent("result_share", { tool: fileName, format, method: "native_file" });
        return;
      }

      if (navigator.share) {
        await navigator.share({ title, text: shareText, url: destination });
        setStatus("공유 메뉴를 열었습니다.");
        trackEvent("result_share", { tool: fileName, format, method: "native_link" });
        return;
      }

      await navigator.clipboard.writeText(`${shareText}\n${destination}`);
      setStatus("결과와 링크를 복사했습니다.");
      trackEvent("result_share", { tool: fileName, format, method: "clipboard" });
    } catch (error) {
      setWorking(false);
      if (error instanceof DOMException && error.name === "AbortError") {
        setStatus("공유를 취소했습니다.");
      } else {
        setStatus("공유하지 못했습니다. 이미지 저장을 이용해 주세요.");
      }
    }
  };

  return (
    <section className="calc-card overflow-hidden" aria-labelledby={`${fileName}-share-title`}>
      <div className="grid sm:grid-cols-[170px_minmax(0,1fr)]">
        <div
          className="min-h-56 p-5 text-[#1d1c19] flex flex-col justify-between border-b sm:border-b-0 sm:border-r border-[#d8d1c5]"
          style={{ backgroundColor: "#f4f0e8" }}
          aria-hidden="true"
        >
          <div>
            <p className="text-[0.65rem] font-mono font-bold" style={{ color: accent }}>{kicker}</p>
            <p className="mt-4 text-xl font-extrabold leading-tight whitespace-pre-line">{title}</p>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {highlights.slice(0, 4).map((highlight) => (
              <div key={highlight.label} className="border border-[#d8d1c5] bg-[#fffcf7] p-2">
                <small className="block text-[0.55rem] text-[#5e5a52]">{highlight.label}</small>
                <strong className="block mt-0.5 text-[0.65rem] truncate">{highlight.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-6 flex flex-col justify-center">
          <p className="text-xs font-semibold mb-2" style={{ color: accent }}>SNS 공유용 카드</p>
          <h3 id={`${fileName}-share-title`} className="text-lg font-bold text-gray-900">
            결과를 공유 이미지로 남겨보세요
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            스토리용 9:16과 피드용 1:1 중 고를 수 있습니다. QR 코드가 함께 들어가 친구도 같은 테스트를 해볼 수 있습니다.
          </p>
          <div className="mt-4 flex gap-2" role="group" aria-label="이미지 비율">
            {(["story", "square"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setFormat(value)}
                aria-pressed={format === value}
                className={`min-h-9 rounded-full border px-3 text-xs font-bold transition-colors ${
                  format === value
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-300 text-gray-600 hover:border-gray-500"
                }`}
              >
                {value === "story" ? "9:16 스토리" : "1:1 피드"}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={shareResult}
              disabled={working}
              className="min-h-11 px-4 rounded-lg text-sm font-bold text-white disabled:opacity-60"
              style={{ backgroundColor: accent }}
            >
              {working ? "카드 만드는 중…" : "SNS로 공유"}
            </button>
            <button
              type="button"
              onClick={saveImage}
              disabled={working}
              className="min-h-11 px-4 rounded-lg border border-gray-300 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
            >
              이미지 저장
            </button>
          </div>
          <p className="mt-3 min-h-5 text-xs text-gray-500" role="status" aria-live="polite">
            {status}
          </p>
        </div>
      </div>
    </section>
  );
}
