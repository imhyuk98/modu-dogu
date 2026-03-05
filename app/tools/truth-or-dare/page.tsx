"use client";

import { useState, useCallback } from "react";
import RelatedTools from "@/components/RelatedTools";

const TRUTH_QUESTIONS = [
  "가장 부끄러웠던 순간은?",
  "첫사랑은 언제였나요?",
  "가장 큰 거짓말은?",
  "SNS에서 누군가를 몰래 스토킹한 적 있나요?",
  "가장 후회되는 일은?",
  "지금까지 받은 최고의 선물은?",
  "이 자리에서 가장 호감인 사람은?",
  "가장 최근에 운 적은 언제인가요?",
  "부모님께 숨기고 있는 비밀은?",
  "가장 창피했던 실수는?",
  "첫 키스는 언제였나요?",
  "가장 무서웠던 경험은?",
  "지금 핸드폰에서 가장 부끄러운 사진은?",
  "가장 좋아하는 신체 부위는?",
  "가장 이상한 습관은?",
  "전 연인에게 하고 싶은 말은?",
  "가장 최근 검색 기록은?",
  "가장 많이 먹었던 때는?",
  "인생에서 가장 행복했던 순간은?",
  "몰래 좋아했던 사람이 있나요?",
  "가장 창피한 닉네임은?",
  "술 마시고 가장 큰 실수는?",
  "연락처에서 삭제하고 싶은 사람은?",
  "가장 비싼 충동구매는?",
  "꿈에서 가장 이상한 꿈은?",
  "가장 많이 본 영화나 드라마는?",
  "이성에게 가장 끌리는 포인트는?",
  "지금 통장 잔액은?",
  "가장 오래된 카톡 대화방은?",
  "이 자리에서 가장 관심 없는 사람은?",
  "SNS 프로필 사진이 아닌 실제 사진 공개!",
  "가장 최근 좋아요 누른 게시물은?",
  "부모님 몰래 한 가장 나쁜 짓은?",
  "술자리에서 가장 민망했던 순간은?",
  "가장 오래 사귄 연인과의 기간은?",
  "가장 최근 거짓말은?",
  "이상형의 조건 3가지는?",
  "가장 많이 질투했던 적은?",
  "인생 최악의 데이트는?",
  "가장 좋아하는 칭찬은?",
  "10년 후 나는 뭘 하고 있을까?",
  "가장 자신 없는 부분은?",
  "전생에 나는 무엇이었을까?",
  "가장 최근 저장한 짤은?",
  "지금 가장 하고 싶은 것은?",
  "인생 버킷리스트 1위는?",
  "가장 아끼는 물건은?",
  "살면서 가장 감동받은 순간은?",
  "가장 싫어하는 음식과 이유는?",
  "지금 이 순간 고백하고 싶은 사람은?",
];

const DARE_MISSIONS = [
  "옆 사람에게 눈 안 마주치고 칭찬하기",
  "방금 먹은 거 표정으로 표현하기",
  "가장 최근 통화기록 공개",
  "10초간 섹시한 표정 짓기",
  "옆 사람 손잡고 10초 눈 마주치기",
  "지금 바로 셀카 찍어서 SNS 올리기",
  "개구리 소리로 노래 한 소절 부르기",
  "3분 동안 반말 금지",
  "옆 사람에게 프러포즈하기",
  "현재 잠금화면 공개하기",
  "10초간 복근 자랑하기",
  "가장 좋아하는 사람 이름 소리쳐 부르기",
  "일어나서 댄스 한 곡 추기",
  "옆 사람과 셀카 찍기",
  "사투리로 고백하기",
  "10초간 아기 흉내 내기",
  "맨날 하는 표정 보여주기",
  "가장 잘하는 성대모사 보여주기",
  "지금 갤러리 세 번째 사진 공개",
  "옆 사람 어깨 마사지 30초",
  "방귀 소리 내기",
  "10초간 원숭이 흉내 내기",
  "카톡 프로필 사진 변경하기",
  "랩으로 자기소개하기",
  "코로 음식 먹는 시늉하기",
  "3바퀴 돌고 한 발로 5초 서기",
  "옆 사람에게 하트 보내기",
  "윙크 10번 하기",
  "가장 웃긴 표정 짓기 대결",
  "10초간 무표정 유지하기",
  "포즈 3개 연속으로 잡기",
  "가장 최근 이모티콘 보여주기",
  "목소리 한 톤 높여서 1분간 대화하기",
  "옆 사람 칭찬 릴레이 3개",
  "30초간 고양이 흉내 내기",
  "벌떡 일어나서 만세 세 번",
  "지금 기분을 몸으로 표현하기",
  "아이유 노래 한 소절 부르기",
  "한 손으로 박수 소리 내기 도전",
  "옆 사람과 하이파이브 10번",
  "혀 말기 도전",
  "양쪽 눈썹 따로 움직이기 도전",
  "30초간 웃음 참기 (다른 사람이 웃기기)",
  "가위바위보 져서 벌칙 대신 받기",
  "인생 좌우명을 외치기",
  "지금 머릿속에 떠오르는 노래 부르기",
  "옆 사람 흉내 내기",
  "드라마 명대사 재현하기",
  "가장 못하는 것 도전하기",
  "지금 바로 스쿼트 10개 하기",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function TruthOrDarePage() {
  const [mode, setMode] = useState<"select" | "truth" | "dare">("select");
  const [current, setCurrent] = useState("");
  const [usedTruth, setUsedTruth] = useState<Set<number>>(new Set());
  const [usedDare, setUsedDare] = useState<Set<number>>(new Set());

  const pickTruth = useCallback(() => {
    const available = TRUTH_QUESTIONS.map((_, i) => i).filter((i) => !usedTruth.has(i));
    if (available.length === 0) {
      setUsedTruth(new Set());
      setCurrent(pickRandom(TRUTH_QUESTIONS));
    } else {
      const idx = pickRandom(available);
      setUsedTruth((s) => new Set(s).add(idx));
      setCurrent(TRUTH_QUESTIONS[idx]);
    }
    setMode("truth");
  }, [usedTruth]);

  const pickDare = useCallback(() => {
    const available = DARE_MISSIONS.map((_, i) => i).filter((i) => !usedDare.has(i));
    if (available.length === 0) {
      setUsedDare(new Set());
      setCurrent(pickRandom(DARE_MISSIONS));
    } else {
      const idx = pickRandom(available);
      setUsedDare((s) => new Set(s).add(idx));
      setCurrent(DARE_MISSIONS[idx]);
    }
    setMode("dare");
  }, [usedDare]);

  return (
    <div className="py-6 max-w-2xl mx-auto px-4">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">🎯 진실 or 도전</h1>
      <p className="text-gray-500 mb-6">
        진실을 말할까, 도전을 받을까? 50개 이상의 질문과 미션!
      </p>

      <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-2xl p-6 text-white min-h-[400px]">
        {mode === "select" ? (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-lg text-purple-200">무엇을 선택하시겠습니까?</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={pickTruth}
                className="py-6 bg-gradient-to-b from-blue-500 to-blue-700 rounded-2xl text-lg font-bold hover:from-blue-400 hover:to-blue-600 transition-all"
              >
                <span className="text-3xl block mb-2">💬</span>
                진실
              </button>
              <button
                onClick={pickDare}
                className="py-6 bg-gradient-to-b from-red-500 to-red-700 rounded-2xl text-lg font-bold hover:from-red-400 hover:to-red-600 transition-all"
              >
                <span className="text-3xl block mb-2">🔥</span>
                도전
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="text-5xl mb-2">{mode === "truth" ? "💬" : "🔥"}</div>
            <div
              className={`rounded-2xl p-6 border-2 ${
                mode === "truth"
                  ? "bg-blue-500/20 border-blue-500"
                  : "bg-red-500/20 border-red-500"
              }`}
            >
              <p
                className={`text-sm font-medium mb-2 ${
                  mode === "truth" ? "text-blue-300" : "text-red-300"
                }`}
              >
                {mode === "truth" ? "진실" : "도전"}
              </p>
              <p className="text-xl font-bold leading-relaxed">{current}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={pickTruth}
                className="py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-colors"
              >
                💬 진실
              </button>
              <button
                onClick={pickDare}
                className="py-3 bg-red-600 hover:bg-red-500 rounded-xl font-bold transition-colors"
              >
                🔥 도전
              </button>
            </div>
            <button
              onClick={() => setMode("select")}
              className="w-full py-2 text-gray-400 hover:text-gray-200 text-sm transition-colors"
            >
              처음으로
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
        <p className="text-amber-700 text-sm">🍺 음주는 적당히! 건강한 음주 문화를 만들어 갑시다.</p>
        <p className="text-amber-500 text-xs mt-1">19세 미만 음주는 법으로 금지되어 있습니다.</p>
      </div>

      <section className="mt-10 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">진실 or 도전이란?</h2>
          <p className="text-gray-600 leading-relaxed">
            진실 or 도전(Truth or Dare)은 전 세계적으로 사랑받는 파티 게임입니다.
            참가자는 &apos;진실&apos;을 선택해 질문에 솔직하게 답하거나,
            &apos;도전&apos;을 선택해 주어진 미션을 수행합니다.
            거부하면 벌칙을 받게 됩니다!
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">게임 규칙</h2>
          <ol className="text-gray-600 text-sm leading-relaxed space-y-2 list-decimal list-inside">
            <li>차례가 된 사람이 &apos;진실&apos; 또는 &apos;도전&apos;을 선택합니다.</li>
            <li>진실을 선택하면 화면에 나오는 질문에 솔직하게 답해야 합니다.</li>
            <li>도전을 선택하면 화면에 나오는 미션을 수행해야 합니다.</li>
            <li>거부하면 벌칙! 술자리에서는 한 잔 마시기가 기본 벌칙입니다.</li>
          </ol>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-medium text-gray-900">질문이 얼마나 있나요?</h3>
              <p className="text-gray-600 text-sm mt-1">진실 질문 50개, 도전 미션 50개로 총 100개의 컨텐츠가 준비되어 있습니다.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">같은 질문이 반복되나요?</h3>
              <p className="text-gray-600 text-sm mt-1">아닙니다! 이미 나온 질문은 모두 소진될 때까지 다시 나오지 않습니다.</p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="truth-or-dare" />
    </div>
  );
}
