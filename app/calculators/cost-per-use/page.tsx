"use client";

import { useMemo, useState } from "react";
import RelatedTools from "@/components/RelatedTools";
import ShareResultCard from "@/components/ShareResultCard";

function number(value: string) { return Number(value.replaceAll(",", "")) || 0; }
function won(value: number) { return `${Math.round(value).toLocaleString("ko-KR")}원`; }

export default function CostPerUsePage() {
  const [item, setItem] = useState("운동화");
  const [price, setPrice] = useState("180000");
  const [uses, setUses] = useState("8");
  const [months, setMonths] = useState("18");
  const [extra, setExtra] = useState("0");
  const [resale, setResale] = useState("0");
  const [limit, setLimit] = useState("1500");

  const result = useMemo(() => {
    const totalUses = Math.max(0, number(uses) * number(months));
    const net = Math.max(0, number(price) + number(extra) - number(resale));
    const perUse = totalUses > 0 ? net / totalUses : 0;
    const target = number(limit);
    const verdict = totalUses <= 0
      ? { title: "사용 횟수를 확인하세요", note: "월 사용 횟수와 기간은 1 이상이어야 합니다.", color: "#6b7280" }
      : perUse <= target * 0.7
        ? { title: "충분히 자주 쓸 선택", note: "설정한 납득 가격보다 여유가 있습니다.", color: "#47725e" }
        : perUse <= target
          ? { title: "계획대로 쓰면 납득 가능", note: "예상 사용 횟수를 지킬 수 있는지 한 번 더 보세요.", color: "#a66b2b" }
          : { title: "24시간만 더 고민", note: "1회당 비용이 내가 정한 기준보다 높습니다.", color: "#a93d28" };
    return { totalUses, net, perUse, target, verdict, saveNeeded: target > 0 ? Math.max(0, Math.ceil(net / target) - totalUses) : 0 };
  }, [extra, limit, months, price, resale, uses]);

  const fields = [
    { label: "구매 가격", value: price, set: setPrice, suffix: "원" },
    { label: "한 달 사용 횟수", value: uses, set: setUses, suffix: "회" },
    { label: "사용할 기간", value: months, set: setMonths, suffix: "개월" },
    { label: "관리·소모품 비용", value: extra, set: setExtra, suffix: "원" },
    { label: "예상 중고 판매가", value: resale, set: setResale, suffix: "원" },
    { label: "납득 가능한 1회 가격", value: limit, set: setLimit, suffix: "원" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-10 sm:py-14">
      <div className="mx-auto max-w-4xl px-4">
        <header className="mb-8"><p className="text-sm font-bold text-[#a93d28]">SPENDING CHECK</p><h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-950">1회당 비용 계산기</h1><p className="mt-4 leading-7 text-gray-600">가격표 대신 실제로 한 번 쓸 때 얼마인지 계산해 충동구매와 무지출 챌린지의 기준을 만들어보세요.</p></header>
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <section className="calc-card p-6 sm:p-7">
            <label className="block text-sm font-bold text-gray-700">무엇을 살까요?<input value={item} onChange={(event) => setItem(event.target.value)} className="mt-2 min-h-12 w-full rounded-lg border border-gray-300 px-3 font-bold outline-none focus:border-[#a93d28]" /></label>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {fields.map((field) => <label key={field.label} className="text-sm font-bold text-gray-700">{field.label}<span className="relative mt-2 block"><input type="number" min="0" inputMode="numeric" value={field.value} onChange={(event) => field.set(event.target.value)} className="min-h-12 w-full rounded-lg border border-gray-300 px-3 pr-12 text-right font-bold outline-none focus:border-[#a93d28]" /><span className="absolute right-3 top-3.5 text-xs text-gray-400">{field.suffix}</span></span></label>)}
            </div>
          </section>
          <section className="calc-card overflow-hidden" aria-live="polite">
            <div className="p-7 text-white sm:p-8" style={{ background: result.verdict.color }}><p className="font-mono text-xs font-bold tracking-[0.16em] text-white/70">COST PER USE</p><p className="mt-5 text-5xl font-black">{won(result.perUse)}<span className="ml-2 text-lg text-white/60">/회</span></p><h2 className="mt-7 text-2xl font-extrabold">{result.verdict.title}</h2><p className="mt-2 text-sm leading-6 text-white/75">{result.verdict.note}</p></div>
            <dl className="grid grid-cols-2 gap-px bg-gray-200"><div className="bg-white p-5"><dt className="text-xs text-gray-500">실질 총비용</dt><dd className="mt-1 font-extrabold text-gray-950">{won(result.net)}</dd></div><div className="bg-white p-5"><dt className="text-xs text-gray-500">예상 사용</dt><dd className="mt-1 font-extrabold text-gray-950">{result.totalUses.toLocaleString()}회</dd></div><div className="col-span-2 bg-white p-5"><dt className="text-xs text-gray-500">기준 가격에 도달하려면</dt><dd className="mt-1 font-extrabold text-gray-950">{result.saveNeeded > 0 ? `${result.saveNeeded}회 더 사용` : "이미 기준 안쪽이에요"}</dd></div></dl>
          </section>
        </div>
        {result.totalUses > 0 && <div className="mt-5"><ShareResultCard kicker="SPENDING RECEIPT" title={`${item || "이 물건"} · 1회 ${won(result.perUse)}`} subtitle={result.verdict.title} highlights={[{ label: "구매가", value: won(number(price)) }, { label: "실질비용", value: won(result.net) }, { label: "예상사용", value: `${result.totalUses}회` }, { label: "1회당", value: won(result.perUse) }]} shareText={`${item || "이 물건"}, 한 번 쓸 때 ${won(result.perUse)}. ${result.verdict.title}`} fileName="cost-per-use-receipt" accent={result.verdict.color} /></div>}
        <section className="calc-seo-card mt-8"><h2 className="calc-seo-title">1회당 비용(Cost Per Use)이란?</h2><p className="text-sm leading-7 text-gray-600">구매비와 관리비에서 예상 판매 금액을 뺀 뒤 총 사용 횟수로 나눈 값입니다. 저렴한 물건도 거의 쓰지 않으면 비싸고, 가격이 높아도 오래 자주 쓰면 1회당 부담은 낮아질 수 있습니다. 계산 결과는 소비를 대신 결정하는 정답이 아니라 비교 기준입니다.</p></section>
        <RelatedTools current="cost-per-use" />
      </div>
    </main>
  );
}
