"use client";

import { useState, useCallback, useRef } from "react";
import RelatedTools from "@/components/RelatedTools";

function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
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
  return { copied, handleCopy };
}

interface Subject {
  id: number;
  name: string;
  credits: number;
  grade: string;
  isPF: boolean;
}

const GRADES_45: Record<string, number> = {
  "A+": 4.5,
  "A0": 4.0,
  "B+": 3.5,
  "B0": 3.0,
  "C+": 2.5,
  "C0": 2.0,
  "D+": 1.5,
  "D0": 1.0,
  "F": 0.0,
};

const GRADES_43: Record<string, number> = {
  "A+": 4.3,
  "A0": 4.0,
  "A-": 3.7,
  "B+": 3.3,
  "B0": 3.0,
  "B-": 2.7,
  "C+": 2.3,
  "C0": 2.0,
  "C-": 1.7,
  "D+": 1.3,
  "D0": 1.0,
  "D-": 0.7,
  "F": 0.0,
};

function createSubject(idRef: React.MutableRefObject<number>): Subject {
  return { id: idRef.current++, name: "", credits: 3, grade: "A+", isPF: false };
}

function initialSubjects(): Subject[] {
  return Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    name: "",
    credits: 3,
    grade: "A+",
    isPF: false,
  }));
}

export default function GpaCalculator() {
  const nextIdRef = useRef(6);
  const [scale, setScale] = useState<"4.5" | "4.3">("4.5");
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const { copied, handleCopy } = useCopyToClipboard();

  const grades = scale === "4.5" ? GRADES_45 : GRADES_43;

  const updateSubject = useCallback(
    (id: number, field: keyof Subject, value: string | number | boolean) => {
      setSubjects((prev) =>
        prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
      );
    },
    []
  );

  const addSubject = () => {
    setSubjects((prev) => [...prev, createSubject(nextIdRef)]);
  };

  const removeSubject = (id: number) => {
    setSubjects((prev) => (prev.length > 1 ? prev.filter((s) => s.id !== id) : prev));
  };

  const resetAll = () => {
    nextIdRef.current = 6;
    setSubjects(initialSubjects());
    setScale("4.5");
  };

  // GPA calculation
  const calcSubjects = subjects.filter((s) => !s.isPF);
  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
  const gpaCredits = calcSubjects.reduce((sum, s) => sum + s.credits, 0);
  const totalPoints = calcSubjects.reduce(
    (sum, s) => sum + s.credits * (grades[s.grade] ?? 0),
    0
  );
  const earnedCredits = calcSubjects
    .filter((s) => s.grade !== "F")
    .reduce((sum, s) => sum + s.credits, 0);
  const pfCredits = subjects
    .filter((s) => s.isPF)
    .reduce((sum, s) => sum + s.credits, 0);
  const gpa = gpaCredits > 0 ? totalPoints / gpaCredits : 0;
  const maxScale = scale === "4.5" ? 4.5 : 4.3;

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">학점 계산기</h1>
      <p className="text-gray-500 mb-8">
        대학교 평균 학점(GPA)을 4.5 또는 4.3 만점 기준으로 계산합니다.
      </p>

      {/* 만점 기준 선택 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          만점 기준
        </label>
        <div className="flex gap-3">
          {(["4.5", "4.3"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setScale(s)}
              className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                scale === s
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s} 만점
            </button>
          ))}
        </div>
      </div>

      {/* 과목 입력 영역 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-sm font-medium text-gray-700 mb-4">과목 입력</h2>

        {/* 헤더 - 모바일에서는 숨김 */}
        <div className="hidden sm:grid sm:grid-cols-[1fr_80px_100px_50px_40px] gap-2 mb-2 text-xs text-gray-400 px-1">
          <span>과목명</span>
          <span>학점</span>
          <span>성적</span>
          <span className="text-center">P/F</span>
          <span></span>
        </div>

        <div className="space-y-2">
          {subjects.map((subject, idx) => (
            <div
              key={subject.id}
              className="grid grid-cols-[1fr_80px_100px_50px_40px] gap-2 items-center"
            >
              <input
                type="text"
                value={subject.name}
                onChange={(e) =>
                  updateSubject(subject.id, "name", e.target.value)
                }
                placeholder={`과목 ${idx + 1}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={subject.credits}
                onChange={(e) =>
                  updateSubject(subject.id, "credits", Number(e.target.value))
                }
                className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value={1}>1학점</option>
                <option value={2}>2학점</option>
                <option value={3}>3학점</option>
                <option value={4}>4학점</option>
                <option value={5}>5학점</option>
              </select>
              <select
                value={subject.grade}
                onChange={(e) =>
                  updateSubject(subject.id, "grade", e.target.value)
                }
                disabled={subject.isPF}
                className={`w-full px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
                  subject.isPF ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {Object.entries(grades).map(([g, p]) => (
                  <option key={g} value={g}>
                    {g} ({p.toFixed(1)})
                  </option>
                ))}
              </select>
              <label className="flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={subject.isPF}
                  onChange={(e) =>
                    updateSubject(subject.id, "isPF", e.target.checked)
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
              <button
                onClick={() => removeSubject(subject.id)}
                className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="과목 삭제"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* 모바일 P/F 안내 */}
        <p className="text-xs text-gray-400 mt-2 sm:hidden">
          * 체크박스: P/F (Pass/Fail) 과목
        </p>

        <div className="flex gap-3 mt-4">
          <button
            onClick={addSubject}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            + 과목 추가
          </button>
          <button
            onClick={resetAll}
            className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            초기화
          </button>
        </div>
      </div>

      {/* 결과 영역 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-blue-600 text-white p-6 text-center">
          <p className="text-blue-100 text-sm mb-1">평균 학점 (GPA)</p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-4xl font-bold">
              {gpa.toFixed(2)}{" "}
              <span className="text-lg font-normal text-blue-200">
                / {maxScale}
              </span>
            </p>
            <button
              onClick={() => handleCopy(`GPA: ${gpa.toFixed(2)} / ${maxScale}`)}
              className="text-sm text-blue-200 hover:text-white transition-colors"
              title="복사"
            >
              {copied ? "복사됨!" : "복사"}
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">총 이수 학점</p>
              <p className="text-xl font-semibold text-gray-900">
                {totalCredits}학점
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">취득 학점 (F 제외)</p>
              <p className="text-xl font-semibold text-gray-900">
                {earnedCredits + pfCredits}학점
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">GPA 산출 학점</p>
              <p className="text-xl font-semibold text-gray-900">
                {gpaCredits}학점
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">총 성적 포인트</p>
              <p className="text-xl font-semibold text-gray-900">
                {totalPoints.toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            학점(GPA)이란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            GPA(Grade Point Average)는 대학에서 수강한 과목들의 성적을
            학점(이수단위) 가중치를 반영하여 산출한 평점평균입니다. 한국
            대학교에서는 주로 4.5 만점과 4.3 만점 두 가지 체계를 사용합니다. 4.5
            만점은 A+를 4.5로, 4.3 만점은 A+를 4.3으로 환산하며, 4.3 만점
            체계에서는 A-, B-, C-, D- 등 마이너스 등급이 추가됩니다. 일반적으로
            서울 소재 대학은 4.3 만점, 지방 대학은 4.5 만점을 많이 사용하지만
            학교마다 다를 수 있으므로 본인 학교의 기준을 확인하는 것이 좋습니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            학점 등급표
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2 text-sm">
                4.5 만점 기준
              </h3>
              <div className="overflow-x-auto">
                <div className="overflow-x-auto"><table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left py-2 px-3 border border-gray-200">
                        등급
                      </th>
                      <th className="text-right py-2 px-3 border border-gray-200">
                        점수
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    {Object.entries(GRADES_45).map(([g, p]) => (
                      <tr key={g}>
                        <td className="py-2 px-3 border border-gray-200">{g}</td>
                        <td className="text-right py-2 px-3 border border-gray-200">
                          {p.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table></div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2 text-sm">
                4.3 만점 기준
              </h3>
              <div className="overflow-x-auto">
                <div className="overflow-x-auto"><table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left py-2 px-3 border border-gray-200">
                        등급
                      </th>
                      <th className="text-right py-2 px-3 border border-gray-200">
                        점수
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    {Object.entries(GRADES_43).map(([g, p]) => (
                      <tr key={g}>
                        <td className="py-2 px-3 border border-gray-200">{g}</td>
                        <td className="text-right py-2 px-3 border border-gray-200">
                          {p.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table></div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            학점 관리 팁
          </h2>
          <div className="space-y-3 text-gray-600 leading-relaxed">
            <div>
              <h3 className="font-medium text-gray-900">
                1. 학기별 목표 설정
              </h3>
              <p className="text-sm mt-1">
                매 학기 목표 학점을 설정하고 중간고사 이후 현재 학점을 점검하세요.
                목표와 현실의 차이를 파악하면 기말고사 전략을 세우기 쉽습니다.
                장학금 기준 학점보다 0.1~0.2점 높게 목표를 잡는 것을 추천합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">2. 재수강 전략</h3>
              <p className="text-sm mt-1">
                대부분의 대학에서 C+ 이하 과목은 재수강이 가능합니다. 재수강 시
                이전 성적은 삭제되고 새 성적으로 대체되므로, 학점이 낮은 핵심 전공
                과목 위주로 재수강을 계획하세요. 단, 재수강 최대 학점 제한이 있는
                학교가 많으므로 학칙을 꼭 확인하세요.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                3. 전공/교양 밸런스
              </h3>
              <p className="text-sm mt-1">
                전공 과목만 과도하게 수강하면 학점 관리가 어려울 수 있습니다. 비교적
                학점 취득이 수월한 교양 과목을 적절히 배치하여 학기별 학점 밸런스를
                유지하세요. 또한 P/F 과목을 전략적으로 활용하면 GPA에 부담 없이
                학점을 이수할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">4. 장학금 기준</h3>
              <p className="text-sm mt-1">
                대부분의 대학 성적 장학금은 직전 학기 학점을 기준으로 합니다.
                일반적으로 3.5 이상이면 성적 장학금 지원 자격이 되며, 4.0 이상이면
                최우수 장학금을 노릴 수 있습니다. 국가장학금은 B학점(3.0) 이상이면
                유지 가능합니다.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            자주 묻는 질문 (FAQ)
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">
                재수강 시 학점은 어떻게 계산되나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                재수강 시 이전 성적은 GPA 계산에서 제외되고, 새로 받은 성적으로
                대체됩니다. 단, 일부 대학에서는 재수강으로 받을 수 있는 최대 성적을
                A0로 제한하는 경우가 있으며, 성적표에 재수강 표시가 남을 수
                있습니다. 학교별 재수강 정책을 반드시 확인하세요.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                P/F 과목은 학점에 어떤 영향을 주나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                P/F(Pass/Fail) 과목은 GPA 계산에 포함되지 않습니다. Pass를 받으면
                해당 학점은 이수 학점으로 인정되지만 평점 산출에는 반영되지 않고,
                Fail을 받으면 학점이 인정되지 않습니다. 따라서 자신 없는 과목을
                P/F로 수강하면 GPA를 보호할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                졸업에 필요한 최소 학점은 얼마인가요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                일반적으로 4년제 대학은 130~140학점, 전문대학(2~3년제)은
                80~120학점이 졸업 이수 학점입니다. 또한 대부분의 대학에서 졸업을
                위한 최소 평균 학점(보통 2.0 이상)을 요구합니다. 학과별로 전공
                필수, 교양 필수 학점 요건이 다르므로 졸업 요건을 미리 확인하세요.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                해외 대학 지원 시 GPA 변환은 어떻게 하나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                해외 대학(특히 미국)은 주로 4.0 만점 GPA를 사용합니다. 한국의 4.5
                만점 학점을 4.0 만점으로 변환하려면 (한국 GPA / 4.5) * 4.0으로
                계산할 수 있습니다. 단, WES(World Education Services) 등 공인
                학점 변환 기관을 통해 변환하는 것이 공식적으로 인정받는 방법입니다.
                대학원 지원 시에는 해당 학교에서 요구하는 변환 방식을 따르세요.
              </p>
            </div>
          </div>
        </div>
      </section>
          <RelatedTools current="gpa" />
</div>
  );
}
