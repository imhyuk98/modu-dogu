"use client";
import { useToolMeasurement } from "@/lib/useToolMeasurement";

import { useState, useMemo } from "react";
import RelatedTools from "@/components/RelatedTools";

const HOMELESS_OPTIONS = [
  { label: "만 30세 미만 미혼", score: 0 },
  { label: "1년 미만", score: 2 },
  { label: "1년 ~ 2년 미만", score: 4 },
  { label: "2년 ~ 3년 미만", score: 6 },
  { label: "3년 ~ 4년 미만", score: 8 },
  { label: "4년 ~ 5년 미만", score: 10 },
  { label: "5년 ~ 6년 미만", score: 12 },
  { label: "6년 ~ 7년 미만", score: 14 },
  { label: "7년 ~ 8년 미만", score: 16 },
  { label: "8년 ~ 9년 미만", score: 18 },
  { label: "9년 ~ 10년 미만", score: 20 },
  { label: "10년 ~ 11년 미만", score: 22 },
  { label: "11년 ~ 12년 미만", score: 24 },
  { label: "12년 ~ 13년 미만", score: 26 },
  { label: "13년 ~ 14년 미만", score: 28 },
  { label: "14년 ~ 15년 미만", score: 30 },
  { label: "15년 이상", score: 32 },
];

const DEPENDENTS_OPTIONS = [
  { label: "0명", score: 5 },
  { label: "1명", score: 10 },
  { label: "2명", score: 15 },
  { label: "3명", score: 20 },
  { label: "4명", score: 25 },
  { label: "5명", score: 30 },
  { label: "6명 이상", score: 35 },
];

const ACCOUNT_OPTIONS = [
  { label: "6개월 미만", score: 1 },
  { label: "6개월 ~ 1년 미만", score: 2 },
  { label: "1년 ~ 2년 미만", score: 3 },
  { label: "2년 ~ 3년 미만", score: 4 },
  { label: "3년 ~ 4년 미만", score: 5 },
  { label: "4년 ~ 5년 미만", score: 6 },
  { label: "5년 ~ 6년 미만", score: 7 },
  { label: "6년 ~ 7년 미만", score: 8 },
  { label: "7년 ~ 8년 미만", score: 9 },
  { label: "8년 ~ 9년 미만", score: 10 },
  { label: "9년 ~ 10년 미만", score: 11 },
  { label: "10년 ~ 11년 미만", score: 12 },
  { label: "11년 ~ 12년 미만", score: 13 },
  { label: "12년 ~ 13년 미만", score: 14 },
  { label: "13년 ~ 14년 미만", score: 15 },
  { label: "14년 ~ 15년 미만", score: 16 },
  { label: "15년 이상", score: 17 },
];

const SPOUSE_ACCOUNT_OPTIONS = [
  { label: "배우자 없음 또는 통장 미가입", score: 0 },
  { label: "1년 미만", score: 1 },
  { label: "1년 이상 ~ 2년 미만", score: 2 },
  { label: "2년 이상", score: 3 },
];

function getScoreGuide(total: number) {
  if (total >= 70) return { label: "70점대 이상", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", desc: "높은 가점 구간입니다. 실제 경쟁 결과는 해당 단지의 모집공고와 신청자 분포를 확인하세요." };
  if (total >= 60) return { label: "60점대", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", desc: "60점대 가점 구간입니다. 지역·주택형·공급유형별 과거 커트라인을 함께 확인하세요." };
  if (total >= 50) return { label: "50점대", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", desc: "50점대 가점 구간입니다. 모집공고의 가점제·추첨제 비율과 지원 자격을 함께 확인하세요." };
  return { label: "50점 미만", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", desc: "50점 미만 가점 구간입니다. 점수만으로 당첨 가능성을 판단할 수 없으니 추첨제·특별공급 자격도 확인하세요." };
}

export default function HousingSubscriptionCalculator() {
  const [homelessIdx, setHomelessIdx] = useState(0);
  const [dependentsIdx, setDependentsIdx] = useState(0);
  const [accountIdx, setAccountIdx] = useState(0);
  const [spouseAccountIdx, setSpouseAccountIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const homelessScore = HOMELESS_OPTIONS[homelessIdx].score;
    const dependentsScore = DEPENDENTS_OPTIONS[dependentsIdx].score;
    const applicantAccountScore = ACCOUNT_OPTIONS[accountIdx].score;
    const spouseAccountScore = SPOUSE_ACCOUNT_OPTIONS[spouseAccountIdx].score;
    const accountScore = Math.min(17, applicantAccountScore + spouseAccountScore);
    const total = homelessScore + dependentsScore + accountScore;
    return { homelessScore, dependentsScore, applicantAccountScore, spouseAccountScore, accountScore, total };
  }, [homelessIdx, dependentsIdx, accountIdx, spouseAccountIdx]);
  const measurement = useToolMeasurement("housing-subscription", JSON.stringify([homelessIdx, dependentsIdx, accountIdx, spouseAccountIdx]));

  const scoreGuide = useMemo(() => getScoreGuide(result.total), [result.total]);

  const handleReset = () => {
    setHomelessIdx(0);
    setDependentsIdx(0);
    setAccountIdx(0);
    setSpouseAccountIdx(0);
    setCopied(false);
  };

  const handleCopy = async () => {
    const text = `청약 가점: ${result.total}점/84점\n- 무주택기간: ${result.homelessScore}점 (${HOMELESS_OPTIONS[homelessIdx].label})\n- 부양가족수: ${result.dependentsScore}점 (${DEPENDENTS_OPTIONS[dependentsIdx].label})\n- 청약통장 가입기간: ${result.accountScore}점 (신청자 ${result.applicantAccountScore}점 + 배우자 ${result.spouseAccountScore}점, 합산 최대 17점)\n- 점수 구간: ${scoreGuide.label}`;
    try {
      await navigator.clipboard.writeText(text);
      measurement.share();
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      const copiedSuccessfully = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (copiedSuccessfully) measurement.share();
      setCopied(copiedSuccessfully);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const gaugePercent = (result.total / 84) * 100;

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">청약 점수 계산기</h1>
      <p className="text-gray-500 mb-8">
        무주택기간, 부양가족수, 본인·배우자 청약통장 가입기간을 선택하면 민영주택 일반공급 가점(최대 84점)을 계산합니다.
      </p>

      {/* 입력 폼 */}
      <div className="calc-card p-6 mb-6 space-y-5">
        {/* 무주택기간 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            무주택기간 <span className="text-gray-400">(최대 32점)</span>
          </label>
          <select
            aria-label="무주택기간"
            value={homelessIdx}
            onChange={(e) => { measurement.start(); setHomelessIdx(Number(e.target.value)); }}
            className="calc-input"
          >
            {HOMELESS_OPTIONS.map((opt, i) => (
              <option key={i} value={i}>
                {opt.label} ({opt.score}점)
              </option>
            ))}
          </select>
        </div>

        {/* 부양가족수 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            부양가족수 <span className="text-gray-400">(최대 35점)</span>
          </label>
          <select
            aria-label="부양가족수"
            value={dependentsIdx}
            onChange={(e) => { measurement.start(); setDependentsIdx(Number(e.target.value)); }}
            className="calc-input"
          >
            {DEPENDENTS_OPTIONS.map((opt, i) => (
              <option key={i} value={i}>
                {opt.label} ({opt.score}점)
              </option>
            ))}
          </select>
        </div>

        {/* 청약통장 가입기간 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            신청자 청약통장 가입기간 <span className="text-gray-400">(배우자와 합산 최대 17점)</span>
          </label>
          <select
            aria-label="신청자 청약통장 가입기간"
            value={accountIdx}
            onChange={(e) => { measurement.start(); setAccountIdx(Number(e.target.value)); }}
            className="calc-input"
          >
            {ACCOUNT_OPTIONS.map((opt, i) => (
              <option key={i} value={i}>
                {opt.label} ({opt.score}점)
              </option>
            ))}
          </select>
        </div>

        {/* 배우자 청약통장 가입기간 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            배우자 청약통장 가입기간 <span className="text-gray-400">(최대 3점 합산)</span>
          </label>
          <select
            aria-label="배우자 청약통장 가입기간"
            value={spouseAccountIdx}
            onChange={(e) => { measurement.start(); setSpouseAccountIdx(Number(e.target.value)); }}
            className="calc-input"
          >
            {SPOUSE_ACCOUNT_OPTIONS.map((opt, i) => (
              <option key={i} value={i}>
                {opt.label} ({opt.score}점)
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">배우자 보유기간의 50%를 환산한 공식 점수표 기준입니다.</p>
        </div>

        <div className="flex gap-3">
          <button onClick={handleReset} className="calc-btn-secondary">
            초기화
          </button>
        </div>
      </div>

      {/* 결과 - 총점 히어로 카드 */}
      <div className="calc-card overflow-hidden mb-6">
        <div className="bg-blue-600 text-white p-6 text-center">
          <p className="text-blue-100 text-sm mb-1">나의 청약 가점</p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-5xl font-bold">{result.total}</p>
            <p className="text-2xl text-blue-200">/ 84점</p>
          </div>
          <div className={`mt-3 inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${scoreGuide.bg} ${scoreGuide.color}`}>
            점수 구간: {scoreGuide.label}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* 게이지 미터 */}
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>0점</span>
              <span>84점</span>
            </div>
            <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${gaugePercent}%`,
                  background: gaugePercent >= 83 ? "#16a34a" : gaugePercent >= 70 ? "#2563eb" : gaugePercent >= 60 ? "#ca8a04" : gaugePercent >= 50 ? "#ea580c" : "#dc2626",
                }}
              />
              <div
                className="absolute top-0 h-full flex items-center transition-all duration-500 ease-out"
                style={{ left: `${Math.min(gaugePercent, 95)}%` }}
              >
                <span className="text-xs font-bold text-gray-700 ml-2">{result.total}점</span>
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>0점</span>
              <span>60점</span>
              <span>65점</span>
              <span>70점</span>
              <span>만점</span>
            </div>
          </div>

          {/* 점수 항목별 바 차트 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">항목별 점수</h3>

            {/* 무주택기간 */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">무주택기간</span>
                <span className="font-semibold text-gray-900">{result.homelessScore}점 / 32점</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${(result.homelessScore / 32) * 100}%` }}
                />
              </div>
            </div>

            {/* 부양가족수 */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">부양가족수</span>
                <span className="font-semibold text-gray-900">{result.dependentsScore}점 / 35점</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${(result.dependentsScore / 35) * 100}%` }}
                />
              </div>
            </div>

            {/* 청약통장 가입기간 */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">청약통장 가입기간</span>
                <span className="font-semibold text-gray-900">{result.accountScore}점 / 17점</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${(result.accountScore / 17) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* 점수 구간 안내 */}
          <div className={`p-4 rounded-lg border ${scoreGuide.bg} ${scoreGuide.border}`}>
            <p className={`font-semibold ${scoreGuide.color} mb-1`}>점수 구간: {scoreGuide.label}</p>
            <p className="text-sm text-gray-600">{scoreGuide.desc}</p>
          </div>
        </div>
      </div>

      {/* 점수 올리기 팁 */}
      <div className="calc-card p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">청약 가점 올리기 팁</h3>
        <ul className="text-gray-600 space-y-3 text-sm">
          <li className="flex gap-2">
            <span className="text-blue-500 font-bold shrink-0">1.</span>
            <span>
              <strong>청약통장 가입기간 확인하기</strong> - 가입 기간이 길수록 점수가 높고 배우자 가입기간도 최대 3점까지 합산됩니다.
              청약홈의 가입확인용 순위확인서로 인정 기간을 확인하세요.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-500 font-bold shrink-0">2.</span>
            <span>
              <strong>무주택 기간 유지하기</strong> - 만 30세부터 무주택기간이 산정됩니다.
              기혼자는 혼인신고일부터 계산되며, 배우자도 무주택이어야 합니다.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-500 font-bold shrink-0">3.</span>
            <span>
              <strong>부양가족 등록 확인</strong> - 배우자, 직계존속(3년 이상 동일 주민등록), 직계비속이 부양가족으로 인정됩니다.
              주민등록등본상 세대 구성을 미리 확인하세요.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-500 font-bold shrink-0">4.</span>
            <span>
              <strong>추첨제 물량 확인</strong> - 가점이 낮다면 해당 입주자모집공고의 추첨제 공급 비율과 자격을 함께 확인하세요.
              적용 비율은 지역·규제 여부·주택형에 따라 달라집니다.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-500 font-bold shrink-0">5.</span>
            <span>
              <strong>특별공급 확인</strong> - 신혼부부, 생애최초, 다자녀 등 특별공급 자격이 되는지 먼저 확인하세요.
              공급유형마다 소득·자산·세대 요건이 다르므로 모집공고를 기준으로 판단해야 합니다.
            </span>
          </li>
        </ul>
      </div>

      {/* 가점 기준표 */}
      <div className="calc-card p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">청약 가점 기준표</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-2 px-3 border border-gray-200">항목</th>
                <th className="text-center py-2 px-3 border border-gray-200">배점</th>
                <th className="text-center py-2 px-3 border border-gray-200">최고점</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              <tr>
                <td className="py-2 px-3 border border-gray-200 font-medium">무주택기간</td>
                <td className="text-center py-2 px-3 border border-gray-200">0 ~ 32점</td>
                <td className="text-center py-2 px-3 border border-gray-200 font-semibold">32점</td>
              </tr>
              <tr>
                <td className="py-2 px-3 border border-gray-200 font-medium">부양가족수</td>
                <td className="text-center py-2 px-3 border border-gray-200">5 ~ 35점</td>
                <td className="text-center py-2 px-3 border border-gray-200 font-semibold">35점</td>
              </tr>
              <tr>
                <td className="py-2 px-3 border border-gray-200 font-medium">청약통장 가입기간 (배우자 점수 포함)</td>
                <td className="text-center py-2 px-3 border border-gray-200">1 ~ 17점</td>
                <td className="text-center py-2 px-3 border border-gray-200 font-semibold">17점</td>
              </tr>
              <tr className="bg-blue-50 font-semibold">
                <td className="py-2 px-3 border border-gray-200">합계</td>
                <td className="text-center py-2 px-3 border border-gray-200">6 ~ 84점</td>
                <td className="text-center py-2 px-3 border border-gray-200 text-blue-600">84점</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-gray-500">
          배우자 점수는 없음·미가입 0점, 1년 미만 1점, 1년 이상~2년 미만 2점, 2년 이상 3점이며 신청자 점수와 합쳐 최대 17점입니다.
        </p>
      </div>

      {/* 복사/초기화 버튼 고정 바 (모바일) */}
      <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-[var(--card-bg)] border-t border-[var(--card-border)] px-4 py-3 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-[var(--muted)]">청약 가점</p>
            <p className="text-lg font-extrabold text-blue-600">{result.total}점 / 84점</p>
          </div>
          <button onClick={handleCopy} className="calc-btn-primary text-xs px-3 py-2">
            {copied ? "복사됨!" : "복사"}
          </button>
        </div>
      </div>

      {/* 데스크톱 복사 버튼 */}
      <div className="hidden sm:flex gap-3 mb-6">
        <button onClick={handleCopy} className="calc-btn-primary">
          {copied ? "복사됨!" : "결과 복사"}
        </button>
        <button onClick={handleReset} className="calc-btn-secondary">
          초기화
        </button>
      </div>

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">청약 가점제란?</h2>
          <p className="text-gray-600 leading-relaxed">
            청약 가점제는 무주택기간, 부양가족수, 청약통장 가입기간 3가지 항목의 점수를 합산해
            높은 점수 순서대로 당첨자를 선정하는 방식입니다. 최대 84점이며 이 계산기는 민영주택
            일반공급 가점 산정을 돕습니다. 실제 적용 여부와 비율은 입주자모집공고를 확인해야 합니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">무주택기간 산정 기준</h2>
          <ul className="text-gray-600 space-y-2 text-sm">
            <li><strong>산정 시작일</strong> - 만 30세가 되는 날부터 산정됩니다. 단, 만 30세 이전에 혼인한 경우 혼인신고일부터 산정합니다.</li>
            <li><strong>배우자 포함</strong> - 본인뿐 아니라 배우자도 무주택이어야 합니다. 배우자가 주택을 소유하면 0점입니다.</li>
            <li><strong>주택 소유 이력</strong> - 과거에 주택을 소유한 적이 있다면, 해당 주택을 처분한 날부터 무주택기간이 다시 산정됩니다.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">부양가족수 인정 기준</h2>
          <ul className="text-gray-600 space-y-2 text-sm">
            <li><strong>배우자</strong> - 주민등록 분리 여부와 관계없이 부양가족으로 인정됩니다.</li>
            <li><strong>직계존속</strong> - 신청자 또는 배우자의 부모/조부모로, 3년 이상 같은 주민등록등본에 등재되어야 합니다.</li>
            <li><strong>직계비속</strong> - 만 30세 미만의 미혼 자녀가 해당됩니다. 주민등록등본상 세대 분리 시 인정되지 않습니다.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">가점제 vs 추첨제</h2>
          <p className="text-gray-600 leading-relaxed">
            민영주택의 가점제·추첨제 적용 비율은 지역, 규제지역 여부, 전용면적과 모집공고 조건에 따라
            달라집니다. 가점이 낮다면 해당 공고의 추첨제 물량과 특별공급(신혼부부, 생애최초, 다자녀 등)
            자격을 함께 비교하세요. 이 점수만으로 청약 자격이나 당첨 가능성을 판단할 수 없습니다.
          </p>
        </div>
        <p className="rounded-lg bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
          계산 결과는 입력값에 따른 참고용 가점입니다. 주택 소유 예외, 세대원·부양가족 인정 여부와
          동점자 처리 등은 청약홈 및 해당 단지 입주자모집공고를 반드시 확인하세요.
        </p>
      </section>

      <RelatedTools current="housing-subscription" />
    </div>
  );
}
