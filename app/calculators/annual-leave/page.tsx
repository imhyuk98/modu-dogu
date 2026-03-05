"use client";

import { useState, useMemo } from "react";
import { calculateAnnualLeave, type AnnualLeaveResult } from "@/lib/calculations";
import RelatedTools from "@/components/RelatedTools";

function getDefaultStartDate(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 3);
  return d.toISOString().split("T")[0];
}

export default function AnnualLeaveCalculator() {
  const [startDate, setStartDate] = useState(getDefaultStartDate);
  const [copied, setCopied] = useState(false);

  const result = useMemo<AnnualLeaveResult | null>(() => {
    if (!startDate) return null;
    const start = new Date(startDate);
    const today = new Date();
    if (start > today) return null;
    return calculateAnnualLeave(start, today);
  }, [startDate]);

  const handleReset = () => {
    setStartDate("");
    setCopied(false);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">연차 계산기</h1>
      <p className="text-gray-500 mb-8">
        입사일을 입력하면 근로기준법에 따라 발생한 총 연차 일수를 계산합니다.
      </p>

      <div className="calc-card p-6 mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">입사일</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            className="calc-input calc-input-lg" />
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
            <p className="text-blue-100 text-sm mb-1">총 발생 연차</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-4xl font-bold">{result.totalLeave}일</p>
              <button
                onClick={() => handleCopy(`총 발생 연차: ${result.totalLeave}일 (근속기간: ${result.usedYears}년 ${result.usedMonths}개월)`)}
                className="text-sm text-blue-200 hover:text-white transition-colors"
                title="복사"
              >
                {copied ? "복사됨!" : "복사"}
              </button>
            </div>
            <p className="text-blue-200 text-sm mt-2">
              근속기간: {result.usedYears}년 {result.usedMonths}개월
            </p>
          </div>

          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3">연도별 연차 내역</h3>
            <div className="space-y-3">
              {result.details.map((d, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{d.period}</p>
                    <p className="text-xs text-gray-400">{d.description}</p>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">{d.days}일</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between">
              <span className="text-sm font-semibold text-gray-900">총 발생 연차</span>
              <span className="text-sm font-semibold text-blue-600">{result.totalLeave}일</span>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-[var(--card-bg)] border-t border-[var(--card-border)] px-4 py-3 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-[var(--muted)]">총 발생 연차</p>
              <p className="text-lg font-extrabold text-blue-600">{result.totalLeave}일</p>
            </div>
            <button onClick={() => handleCopy(`총 발생 연차: ${result.totalLeave}일`)} className="calc-btn-primary text-xs px-3 py-2">{copied ? "복사됨!" : "복사"}</button>
          </div>
        </div>
      )}

      <section className="mt-12 prose prose-gray max-w-none">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">연차 발생 기준 (근로기준법)</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              연차 유급휴가는 근로기준법 제60조에 의해 모든 상시근로자에게 보장되는 법정 휴가입니다.
              5인 이상 사업장에 적용되며, 근속 기간에 따라 발생 일수가 달라집니다.
            </p>
            <ul className="text-gray-600 space-y-2 mb-3">
              <li><strong>입사 후 1년 미만:</strong> 1개월 개근 시 1일의 유급휴가가 발생합니다. 최대 11일까지 발생하며, 1년 근무 후에도 미사용분은 소멸되지 않습니다.</li>
              <li><strong>1년 이상 근무:</strong> 1년간 80% 이상 출근한 경우 15일의 유급휴가가 부여됩니다. 80% 미만 출근 시에는 연차가 발생하지 않습니다.</li>
              <li><strong>3년 이상 근무:</strong> 최초 1년 초과 후 매 2년마다 1일씩 가산됩니다. 즉, 3년차 16일, 5년차 17일, 7년차 18일... 최대 25일까지 늘어납니다.</li>
            </ul>
            <p className="text-gray-600 leading-relaxed">
              본 계산기는 개근(80% 이상 출근)을 기준으로 산정하며, 실제 연차 일수는 결근 및 휴직 여부에 따라 달라질 수 있습니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">연차 사용 촉진제도</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              연차 사용 촉진제도는 근로기준법 제61조에 규정된 제도로, 사용자가 근로자에게 미사용 연차를
              사용하도록 촉진 절차를 밟으면 미사용 연차수당 지급 의무를 면제받을 수 있는 제도입니다.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              <strong>촉진 절차:</strong>
            </p>
            <ul className="text-gray-600 space-y-2">
              <li><strong>1차 촉구 (연차 사용기간 만료 6개월 전):</strong> 사용자가 근로자에게 미사용 연차 일수를 알리고, 사용 시기를 정하여 서면으로 통보하도록 촉구합니다.</li>
              <li><strong>2차 촉구 (1차 촉구 후 10일 이내 미지정 시):</strong> 근로자가 사용 시기를 정하지 않으면 사용자가 직접 사용 시기를 지정하여 서면으로 통보합니다.</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              이 절차를 모두 이행했음에도 근로자가 연차를 사용하지 않으면, 사용자는 미사용 연차수당을
              지급하지 않아도 됩니다. 단, 절차를 밟지 않았다면 미사용 연차에 대해 반드시 수당을 지급해야 합니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">연차 관련 팁</h2>
            <ul className="text-gray-600 space-y-2">
              <li><strong>연차 사용 계획:</strong> 연초에 미리 연차 사용 계획을 세우면 업무 조율이 수월합니다. 분기별로 나누어 사용하면 소멸을 방지할 수 있습니다.</li>
              <li><strong>반차 사용:</strong> 법적으로 반차(0.5일) 사용 의무는 없으나, 취업규칙이나 단체협약에 반차 사용이 규정되어 있으면 사용할 수 있습니다. 대부분의 회사에서 반차 제도를 운영합니다.</li>
              <li><strong>연차수당 계산:</strong> 미사용 연차수당은 통상임금 또는 평균임금을 기준으로 1일분씩 지급됩니다. 통상임금에는 기본급과 고정적으로 지급되는 수당이 포함됩니다.</li>
              <li><strong>연차 소멸 시효:</strong> 연차 유급휴가 청구권은 1년간 행사하지 않으면 소멸됩니다. 미사용 연차수당 청구권은 3년의 소멸시효가 적용됩니다.</li>
              <li><strong>공휴일과 연차:</strong> 2022년부터 5인 이상 사업장은 관공서 공휴일과 대체공휴일을 유급휴일로 보장해야 합니다. 공휴일에 연차를 사용할 필요가 없습니다.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">자주 묻는 질문 (FAQ)</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-gray-800">Q. 퇴사 시 미사용 연차는 어떻게 되나요?</h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  퇴사 시 미사용 연차에 대해서는 연차수당을 지급받을 수 있습니다. 퇴직 정산 시 통상임금 기준으로
                  미사용 일수만큼 금액이 산정됩니다. 연차 사용 촉진 절차와 관계없이 퇴직 시에는 반드시 수당이 지급됩니다.
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800">Q. 수습기간에도 연차가 발생하나요?</h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  네, 발생합니다. 수습기간은 근로계약 기간에 포함되므로 입사 첫 달부터 1개월 개근 시 연차가 발생합니다.
                  수습기간 중 연차 사용을 제한하는 것은 위법입니다.
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800">Q. 5인 미만 사업장에서도 연차가 있나요?</h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  근로기준법상 연차 유급휴가 규정은 5인 이상 사업장에 적용됩니다. 5인 미만 사업장에서는 법적 의무는 없으나,
                  취업규칙이나 근로계약에서 별도로 정한 경우 그에 따릅니다.
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800">Q. 육아휴직 기간은 출근으로 인정되나요?</h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  네, 육아휴직 기간은 출근한 것으로 간주됩니다. 따라서 육아휴직 기간이 포함된 연도에도
                  80% 출근율 산정 시 출근으로 인정되어 연차가 정상적으로 발생합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
          <RelatedTools current="annual-leave" />
</div>
  );
}
