"use client";

import { useState, useMemo, useEffect } from "react";
import { calculateSavings, type SavingsResult, type SavingsType } from "@/lib/calculations";
import RelatedTools from "@/components/RelatedTools";

interface SavingsRatesData {
  updatedAt: string;
  dataMonth: string;
  baseRate: number;
  savings: number;
}

function formatDataMonth(dataMonth: string): string {
  const year = dataMonth.slice(0, 4);
  const month = parseInt(dataMonth.slice(4, 6), 10);
  return `${year}년 ${month}월 기준`;
}

export default function SavingsCalculator() {
  const [monthly, setMonthly] = useState("500,000");
  const [rate, setRate] = useState("4.0");
  const [months, setMonths] = useState("12");
  const [type, setType] = useState<SavingsType>("simple");
  const [taxRate, setTaxRate] = useState("15.4");
  const [copied, setCopied] = useState(false);
  const [ratesData, setRatesData] = useState<SavingsRatesData | null>(null);

  useEffect(() => {
    fetch("/interest-rates.json")
      .then((res) => res.json())
      .then((data: SavingsRatesData) => {
        setRatesData(data);
        setRate(data.savings.toString());
      })
      .catch(() => {});
  }, []);

  const result = useMemo(() => {
    const m = parseInt(monthly.replace(/,/g, ""), 10);
    const r = parseFloat(rate);
    const mo = parseInt(months, 10);
    const t = parseFloat(taxRate);
    if (!m || m <= 0 || !r || r <= 0 || !mo || mo <= 0) return null;
    return calculateSavings(m, r, mo, type, t);
  }, [monthly, rate, months, type, taxRate]);

  const handleReset = () => {
    setMonthly("500,000");
    setRate(ratesData ? ratesData.savings.toString() : "4.0");
    setMonths("12");
    setType("simple");
    setTaxRate("15.4");
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(`만기 수령액: ${fmt(result.totalAmount)}원`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fmt = (n: number) => n.toLocaleString("ko-KR");

  const handleMonthlyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setMonthly(raw ? parseInt(raw, 10).toLocaleString("ko-KR") : "");
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">적금 이자 계산기</h1>
      <p className="text-gray-500 mb-8">월 납입금과 이자율로 적금 만기 수령액을 계산합니다.</p>

      {ratesData && (
        <div className="calc-card p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900">
              시중 평균 적금금리
            </h2>
            <span className="text-xs text-gray-400">
              {formatDataMonth(ratesData.dataMonth)}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              기준금리 {ratesData.baseRate}%
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
              저축성수신 {ratesData.savings}%
            </span>
          </div>
        </div>
      )}

      <div className="calc-card p-6 mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">월 납입금</label>
          <div className="relative">
            <input type="text" value={monthly} onChange={handleMonthlyChange} placeholder="예: 500,000"
              className="calc-input calc-input-lg" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">원</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">연 이자율</label>
            <div className="relative">
              <input type="number" step="0.01" value={rate} onChange={(e) => { setRate(e.target.value); }} placeholder="4.0"
                className="calc-input calc-input-lg" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">적금 기간</label>
            <div className="relative">
              <input type="number" value={months} onChange={(e) => { setMonths(e.target.value); }} placeholder="12"
                className="calc-input calc-input-lg" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">개월</span>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">이자 방식</label>
          <div className="flex gap-3">
            {([["simple", "단리"], ["compound", "복리"]] as const).map(([v, l]) => (
              <button key={v} onClick={() => setType(v)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${type === v ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">세율</label>
          <div className="flex gap-3">
            {[["15.4", "일반과세 (15.4%)"], ["9.5", "세금우대 (9.5%)"], ["0", "비과세 (0%)"]].map(([v, l]) => (
              <button key={v} onClick={() => setTaxRate(v)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${taxRate === v ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handleReset}
            className="calc-btn-secondary">
            초기화
          </button>
        </div>
      </div>

      {result && (
        <div className="calc-card overflow-hidden">
          <div className="bg-blue-600 text-white p-6 text-center">
            <p className="text-blue-100 text-sm mb-1">만기 수령액 (세후)</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-3xl font-bold">{fmt(result.totalAmount)}원</p>
              <button onClick={handleCopy} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors" title="결과 복사" aria-label="결과 복사">
                {copied ? <span className="text-xs font-medium">복사됨!</span> : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
              </button>
            </div>
          </div>
          <div className="p-6 space-y-2">
            {[
              ["총 납입금", fmt(result.totalDeposit)],
              ["세전 이자", fmt(result.totalInterest)],
              ["이자 과세", `-${fmt(result.taxAmount)}`],
              ["세후 이자", fmt(result.netInterest)],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between py-1">
                <span className="text-sm text-gray-600">{l}</span>
                <span className="text-sm font-medium text-gray-900">{v}원</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <section className="mt-12 prose prose-gray max-w-none">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">단리 vs 복리</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>단리(Simple Interest)</strong>는 최초 원금에 대해서만 이자가 계산되는 방식입니다.
              매월 납입한 금액 각각에 대해 남은 기간만큼 이자가 붙으므로, 먼저 납입한 금액이 더 많은 이자를 받습니다.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>복리(Compound Interest)</strong>는 원금에 이자가 붙고, 그 이자에 다시 이자가 붙는 방식입니다.
              이자가 재투자되는 효과가 있어 기간이 길수록 단리 대비 수익이 크게 늘어납니다.
            </p>
            <p className="text-gray-600 leading-relaxed">
              대부분의 시중 은행 적금은 <strong>단리</strong> 방식을 적용합니다. 복리 적금은 일부 저축은행이나
              특판 상품에서 제공되며, 같은 금리라도 복리가 단리보다 수령액이 높습니다.
              다만 적금 기간이 1년 이하로 짧은 경우에는 단리와 복리의 차이가 크지 않습니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">적금 이자 계산 공식</h2>
            <div className="bg-gray-50 rounded-lg p-4 mb-3">
              <p className="text-gray-800 font-medium mb-2">단리 이자 계산</p>
              <p className="text-gray-600 text-sm">
                월 이자 = 월 납입금 x (연이율 / 12) x 잔여 개월 수<br />
                총 이자 = 월 납입금 x (연이율 / 12) x (기간 x (기간 + 1) / 2)
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-3">
              <p className="text-gray-800 font-medium mb-2">복리 이자 계산</p>
              <p className="text-gray-600 text-sm">
                월 복리 이율 = 연이율 / 12<br />
                만기 수령액 = 월 납입금 x ((1 + 월 복리 이율)^기간 - 1) / 월 복리 이율<br />
                총 이자 = 만기 수령액 - 총 납입금
              </p>
            </div>
            <p className="text-gray-600 leading-relaxed">
              세후 이자는 위에서 계산된 세전 이자에서 이자소득세를 차감하여 산출됩니다.
              일반과세 기준 이자소득세 14% + 지방소득세 1.4% = 총 15.4%가 원천징수됩니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">적금 가입 팁</h2>
            <ul className="text-gray-600 space-y-2">
              <li><strong>우대금리 조건 확인:</strong> 급여이체, 카드 실적, 자동이체 설정 등 우대금리 조건을 충족하면 기본 금리에 0.1~1.0%p를 추가로 받을 수 있습니다. 가입 전 우대 조건을 꼼꼼히 확인하세요.</li>
              <li><strong>세금우대 저축 활용:</strong> 비과세종합저축(만 65세 이상, 장애인 등)은 이자소득세가 면제되고, 조합 출자금 등은 9.5% 저율과세가 적용됩니다. 해당 조건을 충족한다면 세금 혜택을 꼭 활용하세요.</li>
              <li><strong>청년 적금 상품:</strong> 청년도약계좌, 청년내일저축계좌 등 정부 지원 상품은 높은 금리와 정부 매칭 지원금을 제공합니다. 만 19~34세 청년이라면 가입 조건을 확인해보세요.</li>
              <li><strong>분산 가입 전략:</strong> 한 상품에 큰 금액을 넣기보다 여러 적금에 분산 가입하면 중도해지 시 손실을 줄일 수 있습니다. 자유적금을 활용하는 것도 좋은 방법입니다.</li>
              <li><strong>만기 자동해지 설정:</strong> 만기 후 자동 해지되지 않으면 보통 이자가 거의 붙지 않는 만기 후 이율이 적용됩니다. 만기 일정을 캘린더에 등록하거나 자동해지를 설정하세요.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">자주 묻는 질문 (FAQ)</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-gray-800">Q. 적금과 예금의 차이는 무엇인가요?</h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  적금은 매월 일정 금액을 납입하는 상품이고, 예금(정기예금)은 목돈을 한 번에 예치하는 상품입니다.
                  같은 금리라면 예금의 이자가 더 많습니다. 적금은 목돈을 모으는 과정에, 예금은 이미 모은 돈을 운용할 때 적합합니다.
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800">Q. 중도해지하면 어떻게 되나요?</h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  중도해지 시에는 약정 금리가 아닌 중도해지 이율이 적용됩니다. 보통 가입 기간에 따라 약정 금리의
                  10~70% 수준으로 크게 낮아집니다. 가능하면 만기까지 유지하는 것이 유리합니다.
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800">Q. 적금 이자에 세금이 얼마나 붙나요?</h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  일반과세 기준으로 이자소득세 14%와 지방소득세 1.4%를 합한 15.4%가 원천징수됩니다.
                  비과세종합저축 대상이면 세금이 면제되고, 농협/수협/신협 등 조합 예탁금은 9.5% 저율과세가 적용됩니다.
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800">Q. 금리가 높은 적금을 찾는 방법이 있나요?</h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  금융감독원의 금융상품 한눈에 사이트나 뱅크샐러드, 토스 등의 핀테크 앱에서 적금 금리를 비교할 수 있습니다.
                  저축은행이나 인터넷전문은행이 시중은행보다 높은 금리를 제공하는 경우가 많습니다. 특판 상품도 수시로 확인해보세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
          <RelatedTools current="savings" />

      {result && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-[var(--card-bg)] border-t border-[var(--card-border)] px-4 py-3 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-[var(--muted)]">만기 수령액 (세후)</p>
              <p className="text-lg font-extrabold text-blue-600">{fmt(result.totalAmount)}원</p>
            </div>
            <button onClick={handleCopy} className="calc-btn-primary text-xs px-3 py-2">
              {copied ? "복사됨!" : "복사"}
            </button>
          </div>
        </div>
      )}
</div>
  );
}
