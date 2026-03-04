"use client";

import { useState } from "react";
import { convertJeonseToMonthly, convertMonthlyToJeonse } from "@/lib/calculations";
import RelatedTools from "@/components/RelatedTools";

type Mode = "toMonthly" | "toJeonse";

export default function RentConversionCalculator() {
  const [mode, setMode] = useState<Mode>("toMonthly");
  const [jeonse, setJeonse] = useState("");
  const [newDeposit, setNewDeposit] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [currentDeposit, setCurrentDeposit] = useState("");
  const [convRate, setConvRate] = useState("4.5");
  const [result, setResult] = useState<{ monthlyRent: number; deposit: number } | null>(null);

  const fmt = (n: number) => n.toLocaleString("ko-KR");
  const parseNum = (s: string) => parseInt(s.replace(/,/g, ""), 10) || 0;
  const fmtInput = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: string) => void) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setter(raw ? parseInt(raw, 10).toLocaleString("ko-KR") : "");
  };

  const handleCalculate = () => {
    const rate = parseFloat(convRate);
    if (!rate || rate <= 0) return;
    if (mode === "toMonthly") {
      const j = parseNum(jeonse);
      const d = parseNum(newDeposit);
      if (!j || j <= d) return;
      setResult(convertJeonseToMonthly(j, d, rate));
    } else {
      const d = parseNum(currentDeposit);
      const r = parseNum(monthlyRent);
      if (!r) return;
      setResult(convertMonthlyToJeonse(d, r, rate));
    }
  };

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">전월세 전환 계산기</h1>
      <p className="text-gray-500 mb-8">전세를 월세로, 월세를 전세로 전환할 때 적정 금액을 계산합니다.</p>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">전환 방향</label>
          <div className="flex gap-3">
            {([["toMonthly", "전세 → 월세"], ["toJeonse", "월세 → 전세"]] as const).map(([v, l]) => (
              <button key={v} onClick={() => { setMode(v); setResult(null); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${mode === v ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {mode === "toMonthly" ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">전세 보증금</label>
              <div className="relative">
                <input type="text" value={jeonse} onChange={(e) => fmtInput(e, setJeonse)} placeholder="예: 300,000,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">원</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">변경 후 보증금</label>
              <div className="relative">
                <input type="text" value={newDeposit} onChange={(e) => fmtInput(e, setNewDeposit)} placeholder="예: 50,000,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">원</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">현재 보증금</label>
              <div className="relative">
                <input type="text" value={currentDeposit} onChange={(e) => fmtInput(e, setCurrentDeposit)} placeholder="예: 50,000,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">원</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">현재 월세</label>
              <div className="relative">
                <input type="text" value={monthlyRent} onChange={(e) => fmtInput(e, setMonthlyRent)} placeholder="예: 800,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">원</span>
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">전월세 전환율</label>
          <div className="relative">
            <input type="number" step="0.1" value={convRate} onChange={(e) => setConvRate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">2024년 법정 전환율 상한: 한국은행 기준금리 + 2%</p>
        </div>

        <button onClick={handleCalculate}
          className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
          계산하기
        </button>
      </div>

      {result && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-blue-600 text-white p-6 text-center">
            {mode === "toMonthly" ? (
              <>
                <p className="text-blue-100 text-sm mb-1">전환 후 월세</p>
                <p className="text-3xl font-bold">{fmt(result.monthlyRent)}원 / 월</p>
                <p className="text-blue-200 text-sm mt-2">보증금 {fmt(result.deposit)}원</p>
              </>
            ) : (
              <>
                <p className="text-blue-100 text-sm mb-1">전환 후 전세 보증금</p>
                <p className="text-3xl font-bold">{fmt(result.deposit)}원</p>
              </>
            )}
          </div>
        </div>
      )}

      <section className="mt-12 prose prose-gray max-w-none">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">전월세 전환율이란?</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              전월세 전환율은 전세 보증금을 월세로 전환하거나, 반대로 월세를 전세로 전환할 때 적용하는 이율입니다.
              주택임대차보호법 제7조의2에 따라 전환율의 상한은 <strong>한국은행 기준금리 + 2%</strong>로 제한됩니다.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              전환 공식은 다음과 같습니다:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-3">
              <p className="text-gray-600 text-sm">
                <strong>전세 → 월세:</strong> 월세 = (전세보증금 - 월세보증금) x 전환율 / 12<br />
                <strong>월세 → 전세:</strong> 전세보증금 = 월세보증금 + (월세 x 12 / 전환율)
              </p>
            </div>
            <p className="text-gray-600 leading-relaxed">
              예를 들어 전세 3억 원인 주택을 보증금 5,000만 원에 월세로 전환하고 전환율이 4.5%라면,
              월세는 (3억 - 5,000만) x 4.5% / 12 = 93.75만 원이 됩니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">전세 vs 월세 장단점 비교</h2>
            <div className="overflow-x-auto">
              <div className="overflow-x-auto"><table className="w-full text-sm text-gray-600 border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-800">구분</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-800">전세</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-800">월세</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 font-medium">초기 자금</td>
                    <td className="border border-gray-200 px-4 py-2">큰 목돈 필요</td>
                    <td className="border border-gray-200 px-4 py-2">상대적으로 적은 보증금</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 font-medium">월 지출</td>
                    <td className="border border-gray-200 px-4 py-2">월 지출 없음 (관리비 제외)</td>
                    <td className="border border-gray-200 px-4 py-2">매월 월세 지출 발생</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 font-medium">자산 활용</td>
                    <td className="border border-gray-200 px-4 py-2">보증금이 묶여 투자 기회비용 발생</td>
                    <td className="border border-gray-200 px-4 py-2">여유 자금으로 투자 가능</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 font-medium">세금 혜택</td>
                    <td className="border border-gray-200 px-4 py-2">주택 관련 공제 제한적</td>
                    <td className="border border-gray-200 px-4 py-2">월세 세액공제 가능 (총급여 8천만 원 이하)</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 font-medium">리스크</td>
                    <td className="border border-gray-200 px-4 py-2">전세사기, 보증금 미반환 위험</td>
                    <td className="border border-gray-200 px-4 py-2">월세 연체 시 계약 해지 위험</td>
                  </tr>
                </tbody>
              </table></div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">전월세 전환 시 주의사항</h2>
            <ul className="text-gray-600 space-y-2">
              <li><strong>법정 전환율 상한 준수:</strong> 전환율은 한국은행 기준금리 + 2%를 초과할 수 없습니다. 이를 초과하는 부분은 무효이며, 임차인은 초과 지급한 월세의 반환을 청구할 수 있습니다.</li>
              <li><strong>임대인 동의 필요:</strong> 전월세 전환은 임대인과 임차인 양측의 합의가 필요합니다. 임차인이 일방적으로 전환을 요구할 수 없으며, 계약 갱신 시 협의를 통해 진행합니다.</li>
              <li><strong>계약서 변경:</strong> 전월세 전환 시 반드시 변경된 내용으로 계약서를 새로 작성하거나 특약을 추가해야 합니다. 구두 합의만으로는 분쟁 시 보호받기 어렵습니다.</li>
              <li><strong>전입신고 및 확정일자:</strong> 보증금이 변경되면 확정일자를 다시 받아야 우선변제권이 유지됩니다. 전입신고도 변경사항이 있으면 갱신하세요.</li>
              <li><strong>보증보험 확인:</strong> 전세보증금반환보증에 가입한 경우, 전환 후 보증 조건이 변경될 수 있으므로 보증기관(HUG, SGI 등)에 확인하세요.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">자주 묻는 질문 (FAQ)</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-gray-800">Q. 전환율이 법정 상한을 초과하면 어떻게 되나요?</h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  법정 상한(기준금리 + 2%)을 초과하는 전환율은 그 초과 부분이 무효입니다.
                  임차인은 초과 지급한 차임(월세)의 반환을 청구할 수 있으며, 향후 월세도 법정 상한 기준으로 감액을 요구할 수 있습니다.
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800">Q. 반전세란 무엇인가요?</h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  반전세는 전세와 월세의 중간 형태로, 전세보다 낮은 보증금에 소액의 월세를 내는 방식입니다.
                  법적 용어는 아니며 관행적으로 사용되는 표현입니다. 보증금 비중이 높고 월세가 적은 것이 특징이며,
                  전세 시장이 불안정할 때 많이 나타납니다.
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800">Q. 월세 세액공제는 어떻게 받나요?</h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  총급여 8,000만 원 이하(종합소득 7,000만 원 이하) 무주택 세대주 근로자가 대상입니다.
                  연간 월세 납입액(최대 1,000만 원)의 15~17%를 세액공제받을 수 있습니다.
                  임대차계약서, 주민등록등본, 월세 이체 내역을 준비하여 연말정산 시 신청하세요.
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-800">Q. 계약 갱신 시 전환율은 어떻게 적용되나요?</h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  계약갱신청구권(2+2년)을 행사할 때 차임 인상은 기존 차임의 5% 이내로 제한됩니다.
                  전월세 전환 시에도 이 인상 상한이 적용되므로, 전환 후 임차인의 부담이 기존 대비 5%를 초과할 수 없습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
          <RelatedTools current="rent-conversion" />
</div>
  );
}
