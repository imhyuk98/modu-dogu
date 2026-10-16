"use client";

import { useState } from "react";
import RelatedTools from "@/components/RelatedTools";

export default function UpDownGamePage() {
  const [answer, setAnswer] = useState(0);
  const [low, setLow] = useState(1);
  const [high, setHigh] = useState(100);
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [found, setFound] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [started, setStarted] = useState(false);

  const startGame = () => {
    setAnswer(Math.floor(Math.random() * 100) + 1);
    setLow(1);
    setHigh(100);
    setGuess("");
    setMessage("");
    setFound(false);
    setAttempts(0);
    setStarted(true);
  };

  const handleGuess = () => {
    const num = parseInt(guess, 10);
    if (isNaN(num) || num < low || num > high) {
      setMessage(`${low}~${high} 사이의 숫자를 입력하세요!`);
      return;
    }
    setAttempts((a) => a + 1);
    if (num === answer) {
      setFound(true);
      setMessage("");
    } else if (num < answer) {
      setLow(num + 1);
      setMessage("UP! ⬆️");
    } else {
      setHigh(num - 1);
      setMessage("DOWN! ⬇️");
    }
    setGuess("");
  };

  return (
    <div className="py-6 max-w-2xl mx-auto px-4">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">🔢 업다운 게임</h1>
      <p className="text-gray-500 mb-6">
        1~100 사이의 숫자를 맞춰라! 맞추는 사람이 벌칙!
      </p>

      <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-2xl p-6 text-white min-h-[400px]">
        {!started ? (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">🔢</div>
            <p className="text-lg text-purple-200">
              1~100 사이의 숫자를 맞춰보세요!<br />
              맞추는 사람이 벌칙!
            </p>
            <button
              onClick={startGame}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-lg font-bold hover:from-pink-400 hover:to-purple-400 transition-all"
            >
              게임 시작!
            </button>
          </div>
        ) : found ? (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-yellow-300">정답!</h3>
            <div className="bg-yellow-500/20 border-2 border-yellow-500 rounded-2xl p-6">
              <p className="text-4xl font-bold text-yellow-300">{answer}</p>
              <p className="text-purple-200 mt-2">{attempts}번 만에 맞췄습니다!</p>
              <p className="text-lg font-bold text-red-400 mt-3">벌칙 당첨! 🍺</p>
            </div>
            <button
              onClick={startGame}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-lg font-bold hover:from-pink-400 hover:to-purple-400 transition-all"
            >
              다시 하기
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="bg-gray-800 rounded-2xl p-6 mb-4">
                <p className="text-sm text-purple-300 mb-2">범위</p>
                <p className="text-3xl font-bold">
                  <span className="text-blue-400">{low}</span>
                  <span className="text-gray-500 mx-3">~</span>
                  <span className="text-red-400">{high}</span>
                </p>
              </div>
              {message && (
                <div
                  className={`text-3xl font-bold mb-4 animate-bounce ${
                    message.includes("UP") ? "text-blue-400" : message.includes("DOWN") ? "text-red-400" : "text-yellow-400"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGuess()}
                placeholder="숫자 입력"
                min={low}
                max={high}
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-center text-xl placeholder-gray-500 focus:outline-none focus:border-pink-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button onClick={handleGuess} className="px-6 py-3 bg-pink-500 hover:bg-pink-400 rounded-lg font-bold transition-colors">확인</button>
            </div>
            <p className="text-center text-gray-400 text-sm">시도 횟수: {attempts}</p>
            <button onClick={startGame} className="w-full py-2 text-gray-400 hover:text-gray-200 text-sm transition-colors">새 게임</button>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
        <p className="text-amber-700 text-sm">🍺 음주는 적당히! 건강한 음주 문화를 만들어 갑시다.</p>
        <p className="text-amber-500 text-xs mt-1">19세 미만 음주는 법으로 금지되어 있습니다.</p>
      </div>

      <section className="mt-10 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">업다운 게임이란?</h2>
          <p className="text-gray-600 leading-relaxed">
            업다운 게임은 1부터 100 사이에 숨겨진 숫자를 맞추는 추리 게임입니다.
            숫자를 입력하면 정답보다 큰지(DOWN) 작은지(UP) 알려주어 범위를 좁혀나갑니다.
            술자리에서는 정답을 맞추는 사람이 벌칙을 받는 것이 일반적인 규칙입니다.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">게임 규칙</h2>
          <ol className="text-gray-600 text-sm leading-relaxed space-y-2 list-decimal list-inside">
            <li>게임이 시작되면 1~100 사이 랜덤 숫자가 숨겨집니다.</li>
            <li>참가자가 번갈아 숫자를 추측합니다.</li>
            <li>정답보다 작으면 UP, 크면 DOWN이 표시됩니다.</li>
            <li>범위가 점점 좁아지며, 정답을 맞추는 사람이 벌칙!</li>
          </ol>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">이용 방법</h2>
          <ol className="text-gray-600 text-sm leading-relaxed space-y-2 list-decimal list-inside">
            <li>&apos;게임 시작&apos;을 누르면 1~100 중 하나가 무작위로 정해집니다. 정답은 맞힐 때까지 화면에 나오지 않습니다.</li>
            <li>차례가 된 사람이 숫자를 입력하고 &apos;확인&apos;이나 Enter를 누릅니다.</li>
            <li>UP 또는 DOWN 결과에 따라 화면의 남은 범위가 자동으로 줄어듭니다.</li>
            <li>남은 범위 밖의 숫자를 입력하면 안내 문구만 나오고 시도 횟수에는 들어가지 않습니다.</li>
            <li>정답이 나오면 몇 번 만에 맞혔는지 표시됩니다. &apos;새 게임&apos;으로 언제든 새 숫자를 뽑을 수 있습니다.</li>
          </ol>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">전략 팁</h2>
          <p className="text-gray-600 leading-relaxed">
            혼자 빨리 맞히는 것이 목표라면 남은 범위의 한가운데 숫자를 고르는 것이 가장 효율적입니다.
            매번 범위가 절반씩 줄어들기 때문에 1~100에서는 최대 7번 안에 반드시 정답에 도달할 수 있습니다.
            반대로 이 게임처럼 정답을 맞힌 사람이 벌칙을 받는 규칙이라면, 범위를 조금씩만 줄이는 숫자를 골라 정답을 다음 사람에게 미루는 것이 유리합니다.
            범위가 좁아질수록 누구도 피하기 어려워져 마지막 몇 차례가 가장 긴장됩니다.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">정답은 어떻게 정해지나요?</h3>
              <p className="text-gray-600 text-sm leading-relaxed mt-1">
                게임을 시작할 때마다 브라우저의 난수로 1부터 100까지의 정수 중 하나를 고릅니다. 모든 숫자가 뽑힐 확률은 같습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">기록이 저장되나요?</h3>
              <p className="text-gray-600 text-sm leading-relaxed mt-1">
                아니요. 시도 횟수와 정답은 현재 판에서만 보이며, 새 게임을 시작하거나 페이지를 새로고침하면 초기화됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="updown-game" />
    </div>
  );
}
