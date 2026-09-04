"use client";

import { useMemo, useState } from "react";
import RelatedTools from "@/components/RelatedTools";

interface GasResult {
  usage: number;
  unitPrice: number;
  basicFee: number;
  usageFee: number;
  subtotal: number;
  vat: number;
  total: number;
}

function calculateGasBill(
  usage: number,
  unitPrice: number,
  basicFee: number
): GasResult {
  const usageFee = Math.round(usage * unitPrice);
  const subtotal = basicFee + usageFee;
  const vat = Math.round(subtotal * 0.1);
  const total = Math.floor((subtotal + vat) / 10) * 10;

  return { usage, unitPrice, basicFee, usageFee, subtotal, vat, total };
}

export default function GasBillCalculator() {
  const [usage, setUsage] = useState("30");
  const [unitPrice, setUnitPrice] = useState("1,000");
  const [basicFee, setBasicFee] = useState("1,000");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const parseNumber = (value: string) =>
    Number.parseFloat(value.replace(/,/g, "")) || 0;
  const formatNumber = (value: number) => value.toLocaleString("ko-KR");

  const result = useMemo<GasResult | null>(() => {
    const parsedUsage = parseNumber(usage);
    const parsedUnitPrice = parseNumber(unitPrice);
    const parsedBasicFee = parseNumber(basicFee);
    if (parsedUsage <= 0 || parsedUnitPrice <= 0 || parsedBasicFee < 0) {
      return null;
    }
    return calculateGasBill(parsedUsage, parsedUnitPrice, parsedBasicFee);
  }, [usage, unitPrice, basicFee]);

  const handleAmountChange = (
    value: string,
    setter: (next: string) => void,
    allowDecimal = false
  ) => {
    const raw = value.replace(allowDecimal ? /[^0-9.]/g : /[^0-9]/g, "");
    if (!raw) {
      setter("");
      return;
    }
    if (allowDecimal) {
      setter(raw);
      return;
    }
    setter(Number.parseInt(raw, 10).toLocaleString("ko-KR"));
  };

  const handleReset = () => {
    setUsage("30");
    setUnitPrice("1,000");
    setBasicFee("1,000");
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(`${formatNumber(result.total)}원`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqItems = [
    {
      q: "도시가스는 사용량이 많으면 누진제가 붙나요?",
      a: "주택용 도시가스는 전기요금처럼 임의의 사용량 구간별 누진단가를 적용해 계산하면 안 됩니다. 지역 공급사와 용도별 승인요금, 열량·온압 보정 방식으로 청구되므로 고지서의 단가를 기준으로 비교하세요.",
    },
    {
      q: "m³당 환산 사용단가는 어디서 구하나요?",
      a: "최근 고지서의 사용요금을 사용량(m³)으로 나누면 비교용 환산단가를 구할 수 있습니다. 고지서가 MJ 기준이면 공급사가 표시한 사용량과 단가를 우선 확인하세요.",
    },
    {
      q: "지역별로 도시가스 요금이 다른가요?",
      a: "네. 도시가스 소매요금과 기본요금은 지역, 공급사, 용도와 적용 시점에 따라 달라집니다. 이 계산기는 사용자가 입력한 고지서 단가로만 계산합니다.",
    },
    {
      q: "계산 결과가 고지서와 다른 이유는 무엇인가요?",
      a: "열량·온압 보정, 검침기간, 원료비 정산, 할인, 연체료와 공급사별 반올림 방식이 반영되지 않기 때문입니다. 최종 납부액은 공급사 고지서를 기준으로 확인하세요.",
    },
  ];

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        도시가스 요금 계산기
      </h1>
      <p className="text-gray-500 mb-8">
        내 고지서의 사용량·환산단가·기본요금으로 다음 요금을 간이 계산합니다.
      </p>

      <div className="calc-card p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              월간 가스 사용량
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={usage}
                onChange={(event) =>
                  handleAmountChange(event.target.value, setUsage, true)
                }
                placeholder="예: 30"
                className="calc-input calc-input-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                m&sup3;
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              m³당 환산 사용단가
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={unitPrice}
                onChange={(event) =>
                  handleAmountChange(event.target.value, setUnitPrice)
                }
                placeholder="최근 고지서 기준"
                className="calc-input calc-input-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                원
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              최근 고지서 사용요금 ÷ 사용량으로 구한 비교용 단가
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              월 기본요금
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={basicFee}
                onChange={(event) =>
                  handleAmountChange(event.target.value, setBasicFee)
                }
                placeholder="고지서 기본요금"
                className="calc-input calc-input-lg"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                원
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {[10, 20, 30, 40, 50, 80].map((amount) => (
            <button
              key={amount}
              onClick={() => setUsage(String(amount))}
              className="calc-preset"
            >
              {amount}m&sup3;
            </button>
          ))}
        </div>
        <button onClick={handleReset} className="calc-btn-secondary mt-6">
          초기화
        </button>
      </div>

      {result && (
        <div className="calc-card overflow-hidden mb-6">
          <div className="calc-result-header">
            <p className="text-blue-100 text-sm mb-1 relative z-10">
              예상 가스요금
            </p>
            <div className="flex items-center justify-center gap-2 relative z-10">
              <p className="text-3xl font-bold">
                {formatNumber(result.total)}원
              </p>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-md bg-blue-500 hover:bg-blue-400 transition-colors"
                aria-label="결과 복사"
              >
                {copied ? (
                  <span className="text-xs text-white font-medium px-1">
                    복사됨!
                  </span>
                ) : (
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-blue-200 text-sm mt-2 relative z-10">
              월 {result.usage}m&sup3; · 환산단가 {formatNumber(result.unitPrice)}원 기준
            </p>
          </div>
          <div className="p-6 space-y-3">
            <Row label="기본요금" value={result.basicFee} />
            <Row label="사용요금" value={result.usageFee} />
            <div className="border-t border-gray-100 pt-3">
              <Row label="소계 (세전)" value={result.subtotal} />
              <Row label="부가가치세 (10%)" value={result.vat} />
            </div>
            <div className="border-t border-gray-200 pt-3">
              <Row label="예상 합계" value={result.total} bold />
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-[var(--card-bg)] border-t border-[var(--card-border)] px-4 py-3 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-[var(--muted)]">예상 가스요금</p>
              <p className="text-lg font-extrabold text-blue-600">
                {formatNumber(result.total)}원
              </p>
            </div>
            <button onClick={handleCopy} className="calc-btn-primary text-xs px-3 py-2">
              {copied ? "복사됨!" : "복사"}
            </button>
          </div>
        </div>
      )}

      <section className="mt-12 space-y-8">
        <div className="calc-seo-card">
          <h2 className="calc-seo-title">왜 고지서 단가를 직접 입력하나요?</h2>
          <p className="text-gray-600 leading-relaxed text-sm">
            도시가스 소매요금은 지역 공급사와 용도, 적용 월에 따라 달라지고 실제 청구에는 열량·온압 보정이 들어갑니다. 따라서 전국 공통 누진표를 가정하지 않고 최근 고지서의 환산단가로 다음 달 비용을 비교하는 방식이 더 안전합니다.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            계산 방법
          </h2>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm text-gray-700">
            <p>환산 사용단가 = 최근 고지서 사용요금 ÷ 사용량(m³)</p>
            <p>예상 사용요금 = 예상 사용량 × 환산 사용단가</p>
            <p>예상 합계 = 기본요금 + 사용요금 + 부가가치세 10%</p>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            자주 묻는 질문 (FAQ)
          </h2>
          <div className="calc-faq">
            {faqItems.map((item, index) => (
              <div key={item.q} className="calc-faq-item">
                <button
                  className="calc-faq-q"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  aria-expanded={openFaq === index}
                >
                  <span>Q. {item.q}</span>
                  <svg className={`w-4 h-4 shrink-0 transition-transform ${openFaq === index ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === index && <div className="calc-faq-a">{item.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
      <p className="mt-6 text-xs text-gray-400 leading-relaxed">
        기본값 1,000원은 입력 예시이며 공인 요금이 아닙니다. 최종 청구액은 지역 도시가스 공급사의 최신 고지서와 요금표를 기준으로 확인하세요.
      </p>
      <RelatedTools current="gas-bill" />
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className="flex justify-between items-center py-1 gap-4">
      <span className={`text-sm ${bold ? "font-semibold text-gray-900" : "text-gray-600"}`}>
        {label}
      </span>
      <span className={`text-sm whitespace-nowrap ${bold ? "font-semibold text-gray-900" : "text-gray-900"}`}>
        {value.toLocaleString("ko-KR")}원
      </span>
    </div>
  );
}
