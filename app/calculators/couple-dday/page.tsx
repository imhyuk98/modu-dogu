"use client";

import { useState } from "react";
import RelatedTools from "@/components/RelatedTools";

interface Anniversary {
  label: string;
  date: Date;
  daysFromStart: number;
  daysLeft: number;
  passed: boolean;
  isThisMonth: boolean;
  isNearest: boolean;
}

function getAnniversaries(startDate: Date, today: Date): Anniversary[] {
  const diffMs = today.getTime() - startDate.getTime();
  const daysTogether = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const dayMilestones = [100, 200, 300, 500, 1000];
  const yearMilestones = [1, 2, 3, 4, 5, 10];

  const list: Anniversary[] = [];

  for (const d of dayMilestones) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + d - 1); // D-day counting: 사귄 날 = 1일
    const daysLeft = Math.ceil(
      (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    list.push({
      label: `${d}일`,
      date,
      daysFromStart: d,
      daysLeft,
      passed: daysLeft < 0,
      isThisMonth:
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear(),
      isNearest: false,
    });
  }

  for (const y of yearMilestones) {
    const date = new Date(startDate);
    date.setFullYear(date.getFullYear() + y);
    const daysLeft = Math.ceil(
      (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    const daysFromStart = Math.ceil(
      (date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    list.push({
      label: `${y}주년`,
      date,
      daysFromStart,
      daysLeft,
      passed: daysLeft < 0,
      isThisMonth:
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear(),
      isNearest: false,
    });
  }

  list.sort((a, b) => a.daysFromStart - b.daysFromStart);

  // Find nearest upcoming
  let nearestIdx = -1;
  let nearestDays = Infinity;
  for (let i = 0; i < list.length; i++) {
    if (!list[i].passed && list[i].daysLeft < nearestDays) {
      nearestDays = list[i].daysLeft;
      nearestIdx = i;
    }
  }
  if (nearestIdx >= 0) {
    list[nearestIdx].isNearest = true;
  }

  return list;
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
}

function formatDayOfWeek(date: Date): string {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return days[date.getDay()];
}

function getDuration(startDate: Date, today: Date) {
  let years = today.getFullYear() - startDate.getFullYear();
  let months = today.getMonth() - startDate.getMonth();
  let days = today.getDate() - startDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

export default function CoupleDdayCalculator() {
  const [startDateStr, setStartDateStr] = useState("");
  const [calculated, setCalculated] = useState(false);
  const [copied, setCopied] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = startDateStr ? new Date(startDateStr) : null;
  const isValid = startDate && !isNaN(startDate.getTime()) && startDate <= today;

  const daysTogether = isValid
    ? Math.floor(
        (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1
    : 0;

  const duration = isValid ? getDuration(startDate, today) : null;
  const anniversaries = isValid ? getAnniversaries(startDate, today) : [];

  const handleCalculate = () => {
    if (isValid) setCalculated(true);
  };

  const handleReset = () => {
    setStartDateStr("");
    setCalculated(false);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!isValid || !calculated) return;
    const durationText = duration
      ? `${duration.years > 0 ? `${duration.years}년 ` : ""}${duration.months > 0 ? `${duration.months}개월 ` : ""}${duration.days}일`
      : "";
    const text = `함께한 지 ${daysTogether.toLocaleString()}일 (${durationText})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCalculate();
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        <span className="text-pink-500">&#x1F497;</span> 커플 D-day 계산기
      </h1>
      <p className="text-gray-500 mb-8">
        사귄 날짜를 입력하면 함께한 일수와 다가오는 기념일을 알려드려요.
      </p>

      {/* 입력 영역 */}
      <div className="bg-white rounded-xl border-2 border-pink-200 p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <span className="text-pink-500">&#x1F495;</span> 사귄 날짜
        </label>
        <div className="flex gap-3">
          <input
            type="date"
            value={startDateStr}
            max={today.toISOString().split("T")[0]}
            onChange={(e) => {
              setStartDateStr(e.target.value);
              setCalculated(false);
            }}
            onKeyDown={handleKeyDown}
            className="calc-input calc-input-lg"
          />
          <button
            onClick={handleCalculate}
            disabled={!isValid}
            className="px-6 py-3 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            계산하기
          </button>
          <button
            onClick={handleReset}
            className="calc-btn-secondary"
          >
            초기화
          </button>
        </div>
        {startDateStr && !isValid && (
          <p className="text-red-400 text-sm mt-2">
            오늘 이전의 날짜를 선택해 주세요.
          </p>
        )}
      </div>

      {/* 결과 영역 */}
      {calculated && isValid && (
        <>
          {/* 메인 카드 - 함께한 일수 */}
          <div className="bg-gradient-to-br from-pink-500 to-red-500 rounded-xl p-8 mb-6 text-center text-white shadow-lg">
            <div className="text-6xl mb-4">&#x1F497;</div>
            <p className="text-pink-100 text-sm mb-1">함께한 지</p>
            <div className="flex items-center justify-center gap-2 mb-2">
              <p className="text-5xl font-extrabold">
                {daysTogether.toLocaleString()}일
              </p>
              <button
                onClick={handleCopy}
                className="text-xs px-2 py-1 border border-pink-200 rounded hover:bg-white/20 transition-colors text-pink-100"
              >
                {copied ? "복사됨!" : "복사"}
              </button>
            </div>
            {duration && (
              <p className="text-pink-100 text-lg">
                {duration.years > 0 && `${duration.years}년 `}
                {duration.months > 0 && `${duration.months}개월 `}
                {duration.days}일
              </p>
            )}
            <p className="text-pink-200 text-sm mt-3">
              {formatDate(startDate)} ({formatDayOfWeek(startDate)}) ~{" "}
              {formatDate(today)} ({formatDayOfWeek(today)})
            </p>
          </div>

          {/* 기념일 타임라인 */}
          <div className="bg-white rounded-xl border-2 border-pink-200 overflow-hidden mb-6">
            <div className="bg-pink-50 px-6 py-4 border-b border-pink-200">
              <h2 className="text-lg font-semibold text-pink-700">
                <span>&#x1F389;</span> 기념일 타임라인
              </h2>
            </div>
            <div className="divide-y divide-pink-100">
              {anniversaries.map((a) => (
                <div
                  key={a.label}
                  className={`flex items-center px-6 py-4 transition-colors ${
                    a.isNearest
                      ? "bg-pink-50 border-l-4 border-pink-500"
                      : a.isThisMonth && !a.passed
                      ? "bg-yellow-50 border-l-4 border-yellow-400"
                      : a.passed
                      ? "opacity-60"
                      : ""
                  }`}
                >
                  {/* 상태 아이콘 */}
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    {a.passed ? (
                      <span className="text-2xl">&#x2705;</span>
                    ) : a.isNearest ? (
                      <span className="text-2xl animate-pulse">&#x1F496;</span>
                    ) : (
                      <span className="text-2xl">&#x1F90D;</span>
                    )}
                  </div>

                  {/* 기념일 정보 */}
                  <div className="flex-1 ml-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold ${
                          a.isNearest
                            ? "text-pink-600 text-lg"
                            : "text-gray-800"
                        }`}
                      >
                        {a.label}
                      </span>
                      {a.isNearest && (
                        <span className="text-xs bg-pink-500 text-white px-2 py-0.5 rounded-full">
                          가장 가까운 기념일
                        </span>
                      )}
                      {a.isThisMonth && !a.passed && !a.isNearest && (
                        <span className="text-xs bg-yellow-400 text-white px-2 py-0.5 rounded-full">
                          이번 달
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {formatDate(a.date)} ({formatDayOfWeek(a.date)})
                    </p>
                  </div>

                  {/* 남은 일수 */}
                  <div className="text-right flex-shrink-0">
                    {a.passed ? (
                      <span className="text-sm text-gray-400 font-medium">
                        지남
                      </span>
                    ) : a.daysLeft === 0 ? (
                      <span className="text-lg font-bold text-pink-500">
                        &#x1F389; 오늘!
                      </span>
                    ) : (
                      <div>
                        <span
                          className={`text-lg font-bold ${
                            a.isNearest ? "text-pink-500" : "text-gray-700"
                          }`}
                        >
                          D-{a.daysLeft}
                        </span>
                        <p className="text-xs text-gray-400">
                          {a.daysLeft}일 남음
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 안내 문구 */}
          <div className="bg-pink-50 rounded-xl p-6 text-center">
            <p className="text-pink-400 text-sm">
              <span>&#x1F493;</span> 소중한 사람과의 모든 순간이 기념일이에요!{" "}
              <span>&#x1F493;</span>
            </p>
          </div>
        </>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            커플 D-day 계산기란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            커플 D-day 계산기는 연인과 사귄 날짜를 입력하면 오늘까지 함께한
            일수와 다가오는 기념일(100일, 200일, 300일, 500일, 1000일, 1주년~10주년)을
            자동으로 계산해주는 도구입니다. 각 기념일의 정확한 날짜와 요일, 남은
            일수를 한눈에 확인할 수 있습니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            커플 기념일은 어떻게 세나요?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            한국에서 커플 기념일은 사귄 날을 1일째로 세는 것이 일반적입니다.
            예를 들어 1월 1일에 사귀기 시작했다면, 1월 1일이 1일째이고 4월 10일이
            100일째가 됩니다. 본 계산기도 이 방식으로 계산합니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            주요 커플 기념일
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-pink-50">
                  <th className="text-left py-2 px-3 border border-pink-200">
                    기념일
                  </th>
                  <th className="text-left py-2 px-3 border border-pink-200">
                    의미
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="py-2 px-3 border border-pink-100">100일</td>
                  <td className="py-2 px-3 border border-pink-100">
                    한국에서 가장 중요한 커플 기념일. 반지나 선물 교환이 일반적
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-pink-100">200일</td>
                  <td className="py-2 px-3 border border-pink-100">
                    함께한 시간이 쌓여가는 의미 있는 날
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-pink-100">300일</td>
                  <td className="py-2 px-3 border border-pink-100">
                    거의 1년에 가까운 시간을 함께한 기념일
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-pink-100">1주년</td>
                  <td className="py-2 px-3 border border-pink-100">
                    1년을 함께 보낸 특별한 날. 여행이나 이벤트 준비
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-pink-100">500일</td>
                  <td className="py-2 px-3 border border-pink-100">
                    장기 연애의 시작. 깊어진 사랑을 확인하는 날
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-pink-100">1000일</td>
                  <td className="py-2 px-3 border border-pink-100">
                    약 2년 9개월. &quot;천일&quot;의 상징적인 의미
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            자주 묻는 질문 (FAQ)
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">
                100일은 사귄 날 포함인가요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                네, 사귄 날을 1일째로 카운트합니다. 따라서 100일째 되는 날은
                사귄 날로부터 99일 후입니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                주년 기념일은 어떻게 계산하나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                주년 기념일은 사귄 날짜의 연도만 바뀌는 날입니다. 예를 들어
                2024년 3월 1일에 사귀었다면 1주년은 2025년 3월 1일입니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                데이터는 어디에 저장되나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                입력하신 날짜는 서버에 전송되지 않으며, 브라우저에서만 처리됩니다.
                개인정보가 외부에 저장되지 않으니 안심하고 사용하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="couple-dday" />
    </div>
  );
}
