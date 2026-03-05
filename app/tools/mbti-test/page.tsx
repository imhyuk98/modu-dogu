"use client";

import { useState } from "react";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";

/* ─── Questions ─── */
interface Question {
  question: string;
  axis: "EI" | "SN" | "TF" | "JP";
  a: { text: string; type: string };
  b: { text: string; type: string };
}

const questions: Question[] = [
  // E/I (외향/내향) 5문항
  {
    question: "주말에 에너지를 충전하는 방법은?",
    axis: "EI",
    a: { text: "사람들과 만나서 수다 떨기", type: "E" },
    b: { text: "혼자만의 시간 보내기", type: "I" },
  },
  {
    question: "새로운 모임에서 나는?",
    axis: "EI",
    a: { text: "먼저 다가가서 말을 건다", type: "E" },
    b: { text: "누가 다가오길 기다린다", type: "I" },
  },
  {
    question: "연락 방식 중 편한 것은?",
    axis: "EI",
    a: { text: "전화 통화가 편하다", type: "E" },
    b: { text: "문자나 메시지가 편하다", type: "I" },
  },
  {
    question: "생각을 정리할 때 나는?",
    axis: "EI",
    a: { text: "말하면서 정리한다", type: "E" },
    b: { text: "혼자 조용히 생각한다", type: "I" },
  },
  {
    question: "파티나 큰 모임에서 나는?",
    axis: "EI",
    a: { text: "여러 그룹을 돌아다니며 어울린다", type: "E" },
    b: { text: "소수의 사람과 깊은 대화를 한다", type: "I" },
  },

  // S/N (감각/직관) 5문항
  {
    question: "여행 계획을 세울 때 나는?",
    axis: "SN",
    a: { text: "구체적인 일정과 맛집을 검색한다", type: "S" },
    b: { text: "대략적인 방향만 정하고 즉흥적으로 다닌다", type: "N" },
  },
  {
    question: "새로운 것을 배울 때 나는?",
    axis: "SN",
    a: { text: "실제 사례나 경험을 통해 배운다", type: "S" },
    b: { text: "이론과 원리를 먼저 이해하려 한다", type: "N" },
  },
  {
    question: "대화할 때 주로 하는 이야기는?",
    axis: "SN",
    a: { text: "실제 있었던 일이나 사실 기반의 이야기", type: "S" },
    b: { text: "미래 가능성이나 상상에 대한 이야기", type: "N" },
  },
  {
    question: "문제가 생겼을 때 나는?",
    axis: "SN",
    a: { text: "검증된 방법으로 해결한다", type: "S" },
    b: { text: "새로운 방법을 시도해본다", type: "N" },
  },
  {
    question: "나를 더 잘 표현하는 말은?",
    axis: "SN",
    a: { text: "현실적이고 실용적이다", type: "S" },
    b: { text: "상상력이 풍부하고 창의적이다", type: "N" },
  },

  // T/F (사고/감정) 5문항
  {
    question: "친구가 고민을 이야기할 때 나는?",
    axis: "TF",
    a: { text: "해결 방법을 찾아 조언해준다", type: "T" },
    b: { text: "먼저 공감하고 위로해준다", type: "F" },
  },
  {
    question: "중요한 결정을 내릴 때 나는?",
    axis: "TF",
    a: { text: "장단점을 논리적으로 분석한다", type: "T" },
    b: { text: "마음이 가는 쪽을 선택한다", type: "F" },
  },
  {
    question: "영화를 볼 때 주로 느끼는 것은?",
    axis: "TF",
    a: { text: "스토리의 논리와 구성을 평가한다", type: "T" },
    b: { text: "등장인물의 감정에 몰입한다", type: "F" },
  },
  {
    question: "팀 프로젝트에서 갈등이 생기면?",
    axis: "TF",
    a: { text: "사실 기반으로 옳고 그름을 따진다", type: "T" },
    b: { text: "팀원들의 기분을 먼저 살핀다", type: "F" },
  },
  {
    question: "칭찬을 받을 때 더 기분 좋은 말은?",
    axis: "TF",
    a: { text: "\"일 처리가 정확하고 유능하다\"", type: "T" },
    b: { text: "\"배려심 깊고 따뜻한 사람이다\"", type: "F" },
  },

  // J/P (판단/인식) 5문항
  {
    question: "일을 할 때 나의 스타일은?",
    axis: "JP",
    a: { text: "계획을 세우고 순서대로 진행한다", type: "J" },
    b: { text: "일단 시작하고 유연하게 대응한다", type: "P" },
  },
  {
    question: "마감 기한에 대한 나의 태도는?",
    axis: "JP",
    a: { text: "미리미리 끝내야 마음이 편하다", type: "J" },
    b: { text: "마감 직전에 집중력이 폭발한다", type: "P" },
  },
  {
    question: "책상이나 방 정리는?",
    axis: "JP",
    a: { text: "항상 정리된 상태를 유지한다", type: "J" },
    b: { text: "나만의 규칙이 있는 자유로운 상태", type: "P" },
  },
  {
    question: "약속을 잡을 때 나는?",
    axis: "JP",
    a: { text: "날짜, 시간, 장소를 확실히 정한다", type: "J" },
    b: { text: "\"그때 봐서 정하자\"가 편하다", type: "P" },
  },
  {
    question: "예상치 못한 변화가 생기면?",
    axis: "JP",
    a: { text: "스트레스를 받고 계획을 다시 세운다", type: "J" },
    b: { text: "오히려 신선하고 재미있다", type: "P" },
  },
];

/* ─── MBTI Data ─── */
interface MbtiInfo {
  nickname: string;
  description: string;
  bestMatch: string[];
  worstMatch: string[];
}

const mbtiData: Record<string, MbtiInfo> = {
  ISTJ: {
    nickname: "청렴결백한 논리주의자",
    description:
      "책임감이 강하고 신뢰할 수 있는 사람입니다. 체계적이고 꼼꼼하며, 맡은 일은 반드시 완수합니다. 전통과 규칙을 중시하고 실용적인 접근을 선호합니다.",
    bestMatch: ["ESFP", "ESTP"],
    worstMatch: ["ENFP", "INFP"],
  },
  ISFJ: {
    nickname: "용감한 수호자",
    description:
      "헌신적이고 따뜻한 마음의 소유자입니다. 주변 사람들을 세심하게 챙기며, 겸손하고 성실합니다. 안정적인 환경에서 능력을 발휘합니다.",
    bestMatch: ["ESFP", "ESTP"],
    worstMatch: ["ENTP", "INTP"],
  },
  INFJ: {
    nickname: "선의의 옹호자",
    description:
      "이상주의적이면서도 결단력 있는 성격입니다. 깊은 통찰력과 직관으로 사람들의 마음을 잘 이해하며, 의미 있는 일에 열정을 쏟습니다.",
    bestMatch: ["ENFP", "ENTP"],
    worstMatch: ["ESTP", "ISTP"],
  },
  INTJ: {
    nickname: "용의주도한 전략가",
    description:
      "독립적이고 전략적인 사고를 가진 당신! 높은 기준과 분석력으로 목표를 달성합니다. 지적 호기심이 강하고 효율성을 중시합니다.",
    bestMatch: ["ENFP", "ENTP"],
    worstMatch: ["ESFP", "ISFP"],
  },
  ISTP: {
    nickname: "만능 재주꾼",
    description:
      "논리적이면서도 실용적인 문제 해결사입니다. 호기심이 많고 손재주가 뛰어나며, 위기 상황에서 침착하게 대처하는 능력이 있습니다.",
    bestMatch: ["ESTJ", "ESFJ"],
    worstMatch: ["ENFJ", "INFJ"],
  },
  ISFP: {
    nickname: "호기심 많은 예술가",
    description:
      "감성적이고 자유로운 영혼의 소유자입니다. 아름다움을 추구하며 현재를 즐기는 사람으로, 조화로운 관계를 소중히 여깁니다.",
    bestMatch: ["ESTJ", "ESFJ"],
    worstMatch: ["ENTJ", "INTJ"],
  },
  INFP: {
    nickname: "열정적인 중재자",
    description:
      "이상적인 세상을 꿈꾸는 낭만주의자입니다. 깊은 감성과 창의력을 가지고 있으며, 진정성 있는 관계를 추구합니다. 공감 능력이 뛰어납니다.",
    bestMatch: ["ENFJ", "ENTJ"],
    worstMatch: ["ESTJ", "ISTJ"],
  },
  INTP: {
    nickname: "논리적인 사색가",
    description:
      "호기심이 넘치는 지식 탐구자입니다. 복잡한 문제를 분석하고 패턴을 찾아내는 데 탁월하며, 독창적인 아이디어를 끊임없이 생산합니다.",
    bestMatch: ["ENTJ", "ESTJ"],
    worstMatch: ["ESFJ", "ISFJ"],
  },
  ESTP: {
    nickname: "모험을 즐기는 사업가",
    description:
      "에너지 넘치고 행동력이 강한 현실주의자입니다. 즉흥적이고 적응력이 뛰어나며, 위험을 감수하면서도 성과를 만들어냅니다.",
    bestMatch: ["ISFJ", "ISTJ"],
    worstMatch: ["INFJ", "INTJ"],
  },
  ESFP: {
    nickname: "자유로운 연예인",
    description:
      "사교적이고 즐거움을 추구하는 당신! 주변 사람들에게 활력을 불어넣고 현재의 순간을 최대한 즐기며, 긍정적인 에너지의 원천입니다.",
    bestMatch: ["ISFJ", "ISTJ"],
    worstMatch: ["INTJ", "INFJ"],
  },
  ENFP: {
    nickname: "재기발랄한 활동가",
    description:
      "열정적이고 창의적인 영혼의 소유자입니다. 새로운 가능성에 끊임없이 도전하며, 사람들에게 영감을 주는 능력이 있습니다.",
    bestMatch: ["INFJ", "INTJ"],
    worstMatch: ["ISTJ", "ISFJ"],
  },
  ENTP: {
    nickname: "뜨거운 논쟁을 즐기는 변론가",
    description:
      "지적 호기심이 왕성하고 토론을 즐기는 발명가입니다. 기존의 틀을 깨는 혁신적인 아이디어를 만들어내며, 도전을 두려워하지 않습니다.",
    bestMatch: ["INFJ", "INTJ"],
    worstMatch: ["ISFJ", "ISTJ"],
  },
  ESTJ: {
    nickname: "엄격한 관리자",
    description:
      "체계적이고 책임감 있는 리더입니다. 규칙과 질서를 중시하며, 목표 달성을 위해 사람들을 이끄는 능력이 뛰어납니다.",
    bestMatch: ["ISFP", "ISTP"],
    worstMatch: ["INFP", "ENFP"],
  },
  ESFJ: {
    nickname: "사교적인 외교관",
    description:
      "따뜻하고 사교적인 당신! 다른 사람들의 필요를 잘 파악하며 조화로운 관계를 만들어갑니다. 협력적이고 헌신적인 성격의 소유자입니다.",
    bestMatch: ["ISFP", "ISTP"],
    worstMatch: ["INTP", "ENTP"],
  },
  ENFJ: {
    nickname: "정의로운 사회운동가",
    description:
      "카리스마와 공감 능력을 겸비한 리더입니다. 사람들의 잠재력을 이끌어내는 데 탁월하며, 더 나은 세상을 위해 헌신합니다.",
    bestMatch: ["INFP", "ISFP"],
    worstMatch: ["ISTP", "ESTP"],
  },
  ENTJ: {
    nickname: "대담한 통솔자",
    description:
      "강한 리더십과 결단력을 가진 전략가입니다. 장기적인 비전을 제시하고 목표를 향해 효율적으로 나아가며, 도전적인 환경에서 빛을 발합니다.",
    bestMatch: ["INFP", "INTP"],
    worstMatch: ["ISFP", "ESFP"],
  },
};

/* ─── Component ─── */
type Phase = "intro" | "testing" | "result";

export default function MbtiTestPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const startTest = () => {
    setCurrentQ(0);
    setAnswers([]);
    setPhase("testing");
  };

  const selectAnswer = (type: string) => {
    const newAnswers = [...answers, type];
    setAnswers(newAnswers);
    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setPhase("result");
    }
  };

  /* ─── Calculate result ─── */
  const getResult = () => {
    const counts: Record<string, number> = {
      E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0,
    };
    answers.forEach((a) => {
      counts[a] = (counts[a] || 0) + 1;
    });

    const ei = { e: counts.E, i: counts.I };
    const sn = { s: counts.S, n: counts.N };
    const tf = { t: counts.T, f: counts.F };
    const jp = { j: counts.J, p: counts.P };

    const type = [
      ei.e >= ei.i ? "E" : "I",
      sn.s >= sn.n ? "S" : "N",
      tf.t >= tf.f ? "T" : "F",
      jp.j >= jp.p ? "J" : "P",
    ].join("");

    const axes = [
      {
        label: "외향 (E)",
        labelAlt: "내향 (I)",
        left: ei.e,
        right: ei.i,
        leftPct: Math.round((ei.e / 5) * 100),
        rightPct: Math.round((ei.i / 5) * 100),
        winner: ei.e >= ei.i ? "E" : "I",
      },
      {
        label: "감각 (S)",
        labelAlt: "직관 (N)",
        left: sn.s,
        right: sn.n,
        leftPct: Math.round((sn.s / 5) * 100),
        rightPct: Math.round((sn.n / 5) * 100),
        winner: sn.s >= sn.n ? "S" : "N",
      },
      {
        label: "사고 (T)",
        labelAlt: "감정 (F)",
        left: tf.t,
        right: tf.f,
        leftPct: Math.round((tf.t / 5) * 100),
        rightPct: Math.round((tf.f / 5) * 100),
        winner: tf.t >= tf.f ? "T" : "F",
      },
      {
        label: "판단 (J)",
        labelAlt: "인식 (P)",
        left: jp.j,
        right: jp.p,
        leftPct: Math.round((jp.j / 5) * 100),
        rightPct: Math.round((jp.p / 5) * 100),
        winner: jp.j >= jp.p ? "J" : "P",
      },
    ];

    return { type, axes, info: mbtiData[type] };
  };

  const progress = ((currentQ + 1) / questions.length) * 100;

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        MBTI 성격유형 검사
      </h1>
      <p className="text-gray-500 mb-8">
        20개의 질문에 답하고 나의 MBTI 성격유형을 알아보세요.
      </p>

      {/* ─── Intro ─── */}
      {phase === "intro" && (
        <div className="max-w-xl mx-auto text-center">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg mb-6">
            <div className="text-6xl mb-4">&#x1F9E0;</div>
            <h2 className="text-2xl font-bold mb-3">나의 MBTI는 뭘까?</h2>
            <p className="text-white/90 leading-relaxed mb-2">
              20개의 간단한 질문에 답하면
            </p>
            <p className="text-white/90 leading-relaxed">
              나의 MBTI 성격유형을 알 수 있어요!
            </p>
          </div>

          <div className="calc-card p-6 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-3">검사 안내</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>&#x2022; 총 20문항 (약 3~5분 소요)</li>
              <li>&#x2022; 각 질문에 A 또는 B 중 하나를 선택하세요</li>
              <li>&#x2022; 너무 고민하지 말고 평소 행동에 가까운 것을 고르세요</li>
              <li>&#x2022; 모든 답변은 브라우저에서만 처리됩니다</li>
            </ul>
          </div>

          <button
            onClick={startTest}
            className="w-full py-4 bg-indigo-500 text-white font-bold text-lg rounded-xl hover:bg-indigo-600 transition-colors shadow-md"
          >
            검사 시작하기
          </button>
        </div>
      )}

      {/* ─── Testing ─── */}
      {phase === "testing" && (
        <div className="max-w-xl mx-auto">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Q{currentQ + 1}</span>
              <span>
                {currentQ + 1} / {questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-indigo-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question card */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-4">
            <p className="text-xs text-indigo-500 font-medium mb-2">
              Q{currentQ + 1}.{" "}
              <span className="text-gray-400">
                (
                {questions[currentQ].axis === "EI"
                  ? "외향/내향"
                  : questions[currentQ].axis === "SN"
                  ? "감각/직관"
                  : questions[currentQ].axis === "TF"
                  ? "사고/감정"
                  : "판단/인식"}
                )
              </span>
            </p>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {questions[currentQ].question}
            </h2>

            <div className="space-y-3">
              <button
                onClick={() => selectAnswer(questions[currentQ].a.type)}
                className="w-full text-left px-5 py-4 rounded-lg border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-gray-700 hover:font-medium"
              >
                <span className="text-gray-400 mr-3 font-mono text-sm">
                  A.
                </span>
                {questions[currentQ].a.text}
              </button>
              <button
                onClick={() => selectAnswer(questions[currentQ].b.type)}
                className="w-full text-left px-5 py-4 rounded-lg border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-gray-700 hover:font-medium"
              >
                <span className="text-gray-400 mr-3 font-mono text-sm">
                  B.
                </span>
                {questions[currentQ].b.text}
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              setPhase("intro");
              setCurrentQ(0);
              setAnswers([]);
            }}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            &#x2190; 처음으로
          </button>
        </div>
      )}

      {/* ─── Result ─── */}
      {phase === "result" && (() => {
        const { type, axes, info } = getResult();
        return (
          <div className="max-w-xl mx-auto">
            {/* Main result card */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-center text-white shadow-lg mb-6">
              <p className="text-white/70 text-sm mb-2">당신의 MBTI는...</p>
              <h2 className="text-6xl font-black tracking-wider mb-3">
                {type}
              </h2>
              <p className="text-2xl font-bold mb-3">{info.nickname}</p>
              <p className="text-white/90 leading-relaxed text-sm">
                {info.description}
              </p>
            </div>

            {/* Axes breakdown */}
            <div className="calc-card p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                축별 분석 결과
              </h3>
              <div className="space-y-5">
                {axes.map((axis, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span
                        className={
                          axis.leftPct >= axis.rightPct
                            ? "font-bold text-indigo-600"
                            : "text-gray-500"
                        }
                      >
                        {axis.label} {axis.leftPct}%
                      </span>
                      <span
                        className={
                          axis.rightPct > axis.leftPct
                            ? "font-bold text-purple-600"
                            : "text-gray-500"
                        }
                      >
                        {axis.rightPct}% {axis.labelAlt}
                      </span>
                    </div>
                    <div className="flex h-4 rounded-full overflow-hidden bg-gray-100">
                      <div
                        className="bg-indigo-400 transition-all duration-700"
                        style={{ width: `${axis.leftPct}%` }}
                      />
                      <div
                        className="bg-purple-400 transition-all duration-700"
                        style={{ width: `${axis.rightPct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compatibility */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 rounded-xl p-5">
                <h3 className="font-semibold text-green-700 mb-3">
                  &#x1F49A; 잘 맞는 유형
                </h3>
                <div className="space-y-2">
                  {info.bestMatch.map((m) => (
                    <div
                      key={m}
                      className="bg-white px-3 py-2 rounded-lg text-center"
                    >
                      <span className="font-bold text-green-600">{m}</span>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {mbtiData[m]?.nickname}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-red-50 rounded-xl p-5">
                <h3 className="font-semibold text-red-600 mb-3">
                  &#x1F494; 안 맞는 유형
                </h3>
                <div className="space-y-2">
                  {info.worstMatch.map((m) => (
                    <div
                      key={m}
                      className="bg-white px-3 py-2 rounded-lg text-center"
                    >
                      <span className="font-bold text-red-500">{m}</span>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {mbtiData[m]?.nickname}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA link */}
            <Link
              href="/calculators/mbti-compatibility"
              className="block w-full py-4 bg-pink-500 text-white font-bold text-center rounded-xl hover:bg-pink-600 transition-colors shadow-md mb-4"
            >
              &#x1F495; 궁합 테스트 해보기
            </Link>

            {/* Retry */}
            <div className="flex gap-3">
              <button
                onClick={startTest}
                className="flex-1 py-3 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 transition-colors"
              >
                &#x1F504; 다시 검사하기
              </button>
              <button
                onClick={() => setPhase("intro")}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                &#x1F3E0; 처음으로
              </button>
            </div>
          </div>
        );
      })()}

      {/* SEO Content */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            MBTI 성격유형 검사란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            MBTI(Myers-Briggs Type Indicator)는 4가지 선호 지표(외향/내향,
            감각/직관, 사고/감정, 판단/인식)의 조합으로 16가지 성격유형을
            분류하는 성격유형 검사입니다. 본 테스트는 간이 버전으로 20개의
            질문을 통해 자신의 MBTI 유형을 추정해볼 수 있습니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            4가지 선호 지표
          </h2>
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900">
                외향(E) vs 내향(I)
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                에너지의 방향 - 외부 활동에서 에너지를 얻는지, 내면의 시간에서 에너지를 얻는지를 나타냅니다.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900">
                감각(S) vs 직관(N)
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                인식의 방식 - 현재의 사실과 경험에 집중하는지, 미래의 가능성과 의미에 집중하는지를 나타냅니다.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900">
                사고(T) vs 감정(F)
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                판단의 기준 - 논리와 객관적 사실을 기준으로 하는지, 가치와 감정을 기준으로 하는지를 나타냅니다.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900">
                판단(J) vs 인식(P)
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                생활 방식 - 계획적이고 체계적인 생활을 선호하는지, 유연하고 자율적인 생활을 선호하는지를 나타냅니다.
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
                이 검사가 공식 MBTI 검사인가요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                본 검사는 간이 자가진단 테스트로, 공인된 MBTI 검사와는
                다릅니다. 정확한 결과를 원하시면 전문 기관에서 공식 검사를
                받으시길 권장합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                MBTI는 변할 수 있나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                MBTI는 타고난 선호 경향을 나타내는 것이지만, 환경과 경험에 따라
                결과가 달라질 수 있습니다. 시간을 두고 여러 번 검사해보는 것을
                추천합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                데이터가 저장되나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                모든 답변과 결과는 브라우저에서만 처리되며, 서버에 전송되거나
                저장되지 않습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="mbti-test" />
    </div>
  );
}
