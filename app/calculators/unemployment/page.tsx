"use client";

import { useState } from "react";
import { calculateUnemployment, type UnemploymentResult } from "@/lib/calculations";
import RelatedTools from "@/components/RelatedTools";

export default function UnemploymentCalculator() {
  const [age, setAge] = useState("");
  const [years, setYears] = useState("");
  const [pay, setPay] = useState("");
  const [result, setResult] = useState<UnemploymentResult | null>(null);

  const handleCalculate = () => {
    const a = parseInt(age, 10);
    const y = parseInt(years, 10);
    const p = parseInt(pay.replace(/,/g, ""), 10);
    if (!a || !p || a <= 0 || p <= 0 || y < 0) return;
    setResult(calculateUnemployment(a, y || 0, p));
  };

  const fmt = (n: number) => n.toLocaleString("ko-KR");

  const handlePayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setPay(raw ? parseInt(raw, 10).toLocaleString("ko-KR") : "");
  };

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">실업급여 계산기</h1>
      <p className="text-gray-500 mb-8">나이, 근속연수, 평균 월급을 입력하면 예상 실업급여를 계산합니다.</p>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">나이</label>
            <div className="relative">
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="35"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">세</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">근속연수</label>
            <div className="relative">
              <input type="number" value={years} onChange={(e) => setYears(e.target.value)} placeholder="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">년</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">퇴직 전 3개월 평균 월급 (세전)</label>
          <div className="relative">
            <input type="text" value={pay} onChange={handlePayChange} placeholder="예: 3,000,000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">원</span>
          </div>
        </div>

        <button onClick={handleCalculate}
          className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
          계산하기
        </button>
      </div>

      {result && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-blue-600 text-white p-6 text-center">
            <p className="text-blue-100 text-sm mb-1">예상 총 수급액</p>
            <p className="text-3xl font-bold">{fmt(result.totalAmount)}원</p>
            <p className="text-blue-200 text-sm mt-2">약 {result.durationMonths}개월간 수급</p>
          </div>
          <div className="p-6 space-y-2">
            {[
              ["1일 구직급여액", `${fmt(result.dailyAmount)}원`],
              ["월 예상 수급액", `${fmt(result.monthlyAmount)}원`],
              ["소정급여일수", `${fmt(result.totalDays)}일`],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between py-1">
                <span className="text-sm text-gray-600">{l}</span>
                <span className="text-sm font-medium text-gray-900">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <section className="mt-12 prose prose-gray max-w-none">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">실업급여 수급 조건</h2>
            <p className="text-gray-600 leading-relaxed">
              실업급여(구직급여)를 받으려면 다음 조건을 모두 충족해야 합니다.
            </p>
            <ul className="text-gray-600 space-y-2 mt-3">
              <li><strong>고용보험 가입기간:</strong> 퇴직 전 18개월 동안 고용보험 피보험단위기간이 합산하여 180일 이상이어야 합니다.</li>
              <li><strong>비자발적 퇴직:</strong> 권고사직, 계약만료, 정리해고 등 본인의 의사와 관계없이 퇴직한 경우에 해당합니다. 회사의 휴업, 임금체불, 근로조건 위반 등의 사유가 있는 경우 자발적 퇴직도 인정될 수 있습니다.</li>
              <li><strong>적극적 구직활동 의사:</strong> 근로능력이 있으며, 적극적으로 재취업 활동을 할 의사가 있어야 합니다.</li>
              <li><strong>구직등록:</strong> 고용센터에 구직등록을 하고, 수급자격 인정 신청을 해야 합니다.</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              구직급여 일액은 퇴직 전 3개월 평균임금의 60%이며, 상한액은 1일 66,000원, 하한액은 최저임금의 80% x 1일 소정근로시간(8시간)입니다. 2025년 기준 하한액은 약 63,104원입니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">실업급여 신청 절차</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              실업급여 신청은 다음 순서로 진행됩니다.
            </p>
            <ol className="text-gray-600 space-y-3">
              <li><strong>1단계 - 퇴직:</strong> 회사에서 이직확인서를 고용센터에 제출합니다. 퇴직 후 회사가 10일 이내에 처리해야 합니다.</li>
              <li><strong>2단계 - 구직등록:</strong> 워크넷(www.work.go.kr)에 구직등록을 합니다. 온라인으로 간편하게 할 수 있습니다.</li>
              <li><strong>3단계 - 수급자격 교육:</strong> 고용센터에서 실시하는 수급자격 인정 온라인 교육을 이수합니다. 약 1시간 정도 소요됩니다.</li>
              <li><strong>4단계 - 수급자격 인정 신청:</strong> 관할 고용센터를 방문하여 수급자격 인정 신청을 합니다. 신분증과 통장 사본을 준비하세요.</li>
              <li><strong>5단계 - 구직활동 및 실업인정:</strong> 1~4주마다 고용센터에 출석하여 구직활동을 보고하고 실업인정을 받습니다.</li>
              <li><strong>6단계 - 급여 수급:</strong> 실업인정 후 약 2주 이내에 지정 계좌로 구직급여가 입금됩니다.</li>
            </ol>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">소정급여일수 표</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              소정급여일수는 퇴직 당시 나이와 고용보험 피보험기간(근속연수)에 따라 결정됩니다. (단위: 일)
            </p>
            <div className="overflow-x-auto">
              <div className="overflow-x-auto"><table className="w-full text-sm text-gray-600 border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-3 py-2 text-left font-medium text-gray-800">구분</th>
                    <th className="border border-gray-200 px-3 py-2 text-center font-medium text-gray-800">1년 미만</th>
                    <th className="border border-gray-200 px-3 py-2 text-center font-medium text-gray-800">1~3년</th>
                    <th className="border border-gray-200 px-3 py-2 text-center font-medium text-gray-800">3~5년</th>
                    <th className="border border-gray-200 px-3 py-2 text-center font-medium text-gray-800">5~10년</th>
                    <th className="border border-gray-200 px-3 py-2 text-center font-medium text-gray-800">10년 이상</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2 font-medium">50세 미만</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">120일</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">150일</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">180일</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">210일</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">240일</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-3 py-2 font-medium">50세 이상 및 장애인</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">120일</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">180일</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">210일</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">240일</td>
                    <td className="border border-gray-200 px-3 py-2 text-center">270일</td>
                  </tr>
                </tbody>
              </table></div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">실업급여 수급 시 주의사항</h2>
            <ul className="text-gray-600 space-y-2">
              <li><strong>구직활동 요건:</strong> 실업인정일 사이에 최소 1회 이상의 구직활동(입사지원, 면접, 직업훈련 등)을 해야 합니다. 구직활동이 없으면 해당 기간의 급여가 지급되지 않습니다.</li>
              <li><strong>실업인정 출석:</strong> 지정된 실업인정일에 고용센터를 방문하거나 온라인으로 실업인정을 받아야 합니다. 미출석 시 해당 기간 급여가 미지급됩니다.</li>
              <li><strong>부정수급 주의:</strong> 취업 사실을 숨기거나, 허위 구직활동을 보고하면 부정수급에 해당합니다. 적발 시 받은 급여의 최대 5배를 반환해야 하며, 형사처벌도 가능합니다.</li>
              <li><strong>소득 발생 시 신고:</strong> 수급 기간 중 일용직, 아르바이트 등으로 소득이 발생하면 반드시 신고해야 합니다. 소득 금액에 따라 급여가 감액되거나 지급이 정지될 수 있습니다.</li>
              <li><strong>수급 기한:</strong> 실업급여는 퇴직 다음 날부터 12개월 이내에만 받을 수 있습니다. 신청이 늦어지면 수급 가능 기간이 줄어들 수 있으므로, 퇴직 후 가능한 빨리 신청하세요.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">자주 묻는 질문 (FAQ)</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-medium text-gray-800">자발적으로 퇴직해도 실업급여를 받을 수 있나요?</h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  원칙적으로 자발적 퇴직(자진 사직)은 실업급여 대상이 아닙니다. 다만, 다음과 같은 정당한 사유가 있는 경우 예외적으로 인정될 수 있습니다: 임금 체불(2개월 이상), 최저임금 미달, 근로조건 불이행, 직장 내 괴롭힘/성희롱, 사업장 이전으로 통근 곤란(왕복 3시간 이상), 본인 질병/부상, 가족 간호 등. 퇴직 전에 고용센터에 상담하여 수급 가능 여부를 확인하세요.
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-800">아르바이트(단시간 근로자)도 실업급여 대상인가요?</h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  네, 주 15시간 이상 근무하며 고용보험에 가입되어 있었다면 실업급여 대상입니다. 2024년부터는 주 15시간 미만 초단시간 근로자도 고용보험 적용 대상이 확대되었습니다. 피보험단위기간 180일 이상 등 기본 수급 조건을 충족하면 됩니다.
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-800">실업급여를 받으면서 직업훈련을 받을 수 있나요?</h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  네, 가능합니다. 오히려 권장됩니다. 고용센터에서 인정하는 직업훈련 과정을 수강하면 구직활동으로 인정되며, 훈련 기간 동안 훈련연장급여를 추가로 받을 수도 있습니다. 내일배움카드를 발급받아 국비지원 훈련을 무료 또는 저렴하게 이용할 수 있습니다.
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-800">실업급여 수급 중 창업하면 어떻게 되나요?</h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  실업급여 수급 중 창업을 하면 잔여 급여일수의 일부를 조기재취업수당으로 일시에 받을 수 있습니다. 소정급여일수의 1/2 이상을 남기고 재취업(자영업 포함)하면, 남은 급여일수의 1/2에 해당하는 금액을 조기재취업수당으로 지급받습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
          <RelatedTools current="unemployment" />
</div>
  );
}
