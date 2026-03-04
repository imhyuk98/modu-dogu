"use client";

import { useState } from "react";
import { calculateDday, calculateDateDiff, type DdayResult, type DateDiffResult } from "@/lib/calculations";
import RelatedTools from "@/components/RelatedTools";

type Mode = "dday" | "diff";

export default function DdayCalculator() {
  const [mode, setMode] = useState<Mode>("dday");
  const [targetDate, setTargetDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [ddayResult, setDdayResult] = useState<DdayResult | null>(null);
  const [diffResult, setDiffResult] = useState<DateDiffResult | null>(null);

  const handleDday = () => {
    if (!targetDate) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setDdayResult(calculateDday(new Date(targetDate), today));
  };

  const handleDiff = () => {
    if (!startDate || !endDate) return;
    setDiffResult(calculateDateDiff(new Date(startDate), new Date(endDate)));
  };

  const fmt = (n: number) => n.toLocaleString("ko-KR");

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">날짜 계산기</h1>
      <p className="text-gray-500 mb-8">D-day 카운트다운 또는 두 날짜 사이의 차이를 계산합니다.</p>

      <div className="flex gap-3 mb-6">
        {([["dday", "D-day 계산"], ["diff", "날짜 차이 계산"]] as const).map(([v, l]) => (
          <button key={v} onClick={() => { setMode(v); setDdayResult(null); setDiffResult(null); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${mode === v ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}>
            {l}
          </button>
        ))}
      </div>

      {mode === "dday" ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">목표 날짜</label>
            <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button onClick={handleDday}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            계산하기
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">시작 날짜</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">종료 날짜</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <button onClick={handleDiff}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            계산하기
          </button>
        </div>
      )}

      {ddayResult && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-blue-600 text-white p-6 text-center">
            <p className="text-blue-100 text-sm mb-1">{ddayResult.isPast ? "지난 날" : "남은 날"}</p>
            <p className="text-4xl font-bold">
              D{ddayResult.diffDays === 0 ? "-Day" : ddayResult.diffDays > 0 ? `-${ddayResult.diffDays}` : `+${Math.abs(ddayResult.diffDays)}`}
            </p>
          </div>
          <div className="p-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{fmt(Math.abs(ddayResult.diffDays))}</p>
              <p className="text-sm text-gray-500">일</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{fmt(ddayResult.diffWeeks)}</p>
              <p className="text-sm text-gray-500">주</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{fmt(ddayResult.diffMonths)}</p>
              <p className="text-sm text-gray-500">개월</p>
            </div>
          </div>
        </div>
      )}

      {diffResult && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-blue-600 text-white p-6 text-center">
            <p className="text-blue-100 text-sm mb-1">두 날짜 사이</p>
            <p className="text-3xl font-bold">{fmt(diffResult.totalDays)}일</p>
          </div>
          <div className="p-6 text-center">
            <p className="text-gray-600">
              {diffResult.years}년 {diffResult.months}개월 {diffResult.days}일
            </p>
          </div>
        </div>
      )}

      <section className="mt-12 prose prose-gray max-w-none">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">날짜 계산 활용법</h2>
            <p className="text-gray-600 leading-relaxed">
              날짜 계산기는 일상생활에서 다양하게 활용할 수 있습니다. 아래는 대표적인 사용 사례입니다.
            </p>
            <ul className="text-gray-600 space-y-2 mt-3">
              <li><strong>시험 준비:</strong> 수능, 공무원 시험, 자격증 시험까지 남은 일수를 계산하여 학습 계획을 세울 수 있습니다. 예를 들어 시험까지 100일이 남았다면, 과목별로 하루 학습 분량을 배분할 수 있습니다.</li>
              <li><strong>기념일 관리:</strong> 연인과의 100일, 200일, 1000일 등 기념일을 미리 확인하고 준비할 수 있습니다. 결혼기념일, 입사일 등도 D-day로 관리하면 편리합니다.</li>
              <li><strong>출산 예정일:</strong> 마지막 생리일로부터 280일(40주)을 더하면 출산 예정일을 계산할 수 있습니다. 남은 일수를 확인하며 출산 준비를 할 수 있습니다.</li>
              <li><strong>프로젝트 마감일:</strong> 업무 프로젝트의 마감까지 남은 일수를 확인하고, 주 단위 또는 월 단위로 마일스톤을 설정할 수 있습니다.</li>
              <li><strong>여행 카운트다운:</strong> 여행 출발일까지 남은 날을 세며 준비물을 체크하고 일정을 계획할 수 있습니다.</li>
              <li><strong>계약 만료일:</strong> 임대차 계약, 보험 만기, 구독 서비스 갱신일 등을 미리 파악하여 대비할 수 있습니다.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">윤년과 날짜 계산</h2>
            <p className="text-gray-600 leading-relaxed">
              날짜 계산에서 윤년(leap year)은 중요한 변수입니다. 윤년에는 2월이 29일까지 있어 1년이 366일이 됩니다.
            </p>
            <ul className="text-gray-600 space-y-2 mt-3">
              <li><strong>기본 규칙:</strong> 서력 연도가 4로 나누어 떨어지는 해는 윤년입니다. (예: 2024년, 2028년)</li>
              <li><strong>100년 단위 예외:</strong> 100으로 나누어 떨어지는 해는 윤년이 아닙니다. (예: 1900년, 2100년은 평년)</li>
              <li><strong>400년 단위 재포함:</strong> 400으로 나누어 떨어지는 해는 다시 윤년입니다. (예: 2000년, 2400년은 윤년)</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-3">
              이 규칙 때문에 장기간 날짜 계산 시 단순히 365일을 곱하면 오차가 발생합니다. 본 계산기는 윤년을 자동으로 반영하여 정확한 결과를 제공합니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">자주 묻는 질문 (FAQ)</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-medium text-gray-800">D+1은 당일인가요, 다음 날인가요?</h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  D-day는 목표일 당일을 의미합니다. D+1은 목표일 다음 날이고, D-1은 목표일 하루 전입니다. 군대에서 &quot;입대 D+1&quot;이라고 하면 입대한 다음 날을 뜻합니다. 다만, 일부에서는 D+1을 당일로 세는 경우도 있으므로 문맥에 따라 확인이 필요합니다.
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-800">주말과 공휴일을 제외한 영업일 계산은 어떻게 하나요?</h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  본 계산기는 토요일, 일요일, 공휴일 구분 없이 모든 날짜를 포함하여 계산합니다. 영업일(근무일)만 계산하려면 전체 일수에서 주말 수를 빼야 합니다. 대략적으로 전체 일수의 5/7이 영업일에 해당합니다.
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-800">음력 날짜도 계산할 수 있나요?</h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  본 계산기는 양력(그레고리력) 기준으로 동작합니다. 음력 생일이나 명절(설날, 추석)의 양력 날짜를 알고 싶다면, 음력-양력 변환 후 본 계산기를 이용해 주세요.
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-800">날짜 차이 계산 시 시작일과 종료일이 포함되나요?</h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  날짜 차이 계산은 시작일부터 종료일 전날까지의 일수를 셉니다. 예를 들어 1월 1일과 1월 3일의 차이는 2일입니다. 시작일과 종료일을 모두 포함하려면 결과에 1을 더하면 됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
          <RelatedTools current="dday" />
</div>
  );
}
