"use client";

import { useState, useRef, useCallback } from "react";
import RelatedTools from "@/components/RelatedTools";

const COLORS = [
  "#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF",
  "#FF6FD8", "#FFA94D", "#69DB7C", "#748FFC",
];

const DEFAULT_ITEMS = ["짜장면", "짬뽕", "볶음밥", "김밥", "떡볶이"];

export default function RandomRoulette() {
  const [items, setItems] = useState<string[]>(DEFAULT_ITEMS);
  const [newItem, setNewItem] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentRotationRef = useRef(0);

  const addItem = () => {
    const trimmed = newItem.trim();
    if (!trimmed || items.length >= 10) return;
    setItems([...items, trimmed]);
    setNewItem("");
  };

  const removeItem = (index: number) => {
    if (items.length <= 2) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") addItem();
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(items[index]);
  };

  const confirmEdit = () => {
    if (editingIndex === null) return;
    const trimmed = editValue.trim();
    if (trimmed) {
      const updated = [...items];
      updated[editingIndex] = trimmed;
      setItems(updated);
    }
    setEditingIndex(null);
    setEditValue("");
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") confirmEdit();
    if (e.key === "Escape") {
      setEditingIndex(null);
      setEditValue("");
    }
  };

  const drawRoulette = useCallback(
    (canvas: HTMLCanvasElement, currentItems: string[], angleDeg: number) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const size = canvas.width;
      const center = size / 2;
      const radius = center - 4;
      const sliceAngle = (2 * Math.PI) / currentItems.length;
      const angleRad = (angleDeg * Math.PI) / 180;

      ctx.clearRect(0, 0, size, size);

      // Draw slices
      currentItems.forEach((item, i) => {
        const startAngle = i * sliceAngle + angleRad;
        const endAngle = startAngle + sliceAngle;

        // Slice
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = COLORS[i % COLORS.length];
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Text
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#fff";
        ctx.font = `bold ${Math.max(12, Math.min(16, 200 / currentItems.length))}px sans-serif`;
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 2;
        const textRadius = radius * 0.6;
        const label = item.length > 6 ? item.slice(0, 5) + ".." : item;
        ctx.fillText(label, textRadius, 0);
        ctx.restore();
      });

      // Center circle
      ctx.beginPath();
      ctx.arc(center, center, 18, 0, 2 * Math.PI);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 2;
      ctx.stroke();
    },
    []
  );

  const spin = () => {
    if (spinning || items.length < 2) return;
    setSpinning(true);
    setResult(null);
    setShowCelebration(false);

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Random final angle: 5-8 full rotations + random offset
    const extraRotations = (5 + Math.random() * 3) * 360;
    const randomAngle = Math.random() * 360;
    const totalRotation = currentRotationRef.current + extraRotations + randomAngle;

    const duration = 3000;
    const startTime = performance.now();
    const startRotation = currentRotationRef.current;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startRotation + (totalRotation - startRotation) * eased;

      drawRoulette(canvas, items, current);
      setRotation(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        currentRotationRef.current = current;
        // Determine winner: arrow is at the top (270 degrees / -90 degrees)
        // The roulette rotates clockwise, so we need to find which slice is at the top
        const normalizedAngle = ((current % 360) + 360) % 360;
        // Arrow points right (0 degrees), items go clockwise
        // The slice at the arrow: we need to find which slice occupies angle 0 (right side)
        // Since canvas 0 is right, and arrow is at top (-90deg), adjust:
        const arrowAngle = (360 - normalizedAngle) % 360;
        const sliceAngle = 360 / items.length;
        const winnerIndex = Math.floor(arrowAngle / sliceAngle) % items.length;

        setResult(items[winnerIndex]);
        setShowCelebration(true);
        setSpinning(false);

        // Hide celebration after 3 seconds
        setTimeout(() => setShowCelebration(false), 3000);
      }
    };

    requestAnimationFrame(animate);
  };

  // Draw initial roulette
  const canvasCallback = useCallback(
    (node: HTMLCanvasElement | null) => {
      if (node) {
        (canvasRef as React.MutableRefObject<HTMLCanvasElement>).current = node;
        drawRoulette(node, items, currentRotationRef.current);
      }
    },
    [items, drawRoulette]
  );

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        랜덤 룰렛 돌리기
      </h1>
      <p className="text-gray-500 mb-8">
        항목을 추가하고 룰렛을 돌려 결정하세요! 점심 메뉴, 벌칙 뽑기, 순서 정하기 등에 활용하세요.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Item management */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">
              항목 관리 ({items.length}/10)
            </h2>

            {/* Add item */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="항목을 입력하세요"
                maxLength={20}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={items.length >= 10}
              />
              <button
                onClick={addItem}
                disabled={items.length >= 10 || !newItem.trim()}
                className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
              >
                추가
              </button>
            </div>

            {/* Item list */}
            <div className="space-y-2">
              {items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2 rounded-lg"
                  style={{ backgroundColor: COLORS[i % COLORS.length] + "20" }}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    {editingIndex === i ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={handleEditKeyDown}
                        onBlur={confirmEdit}
                        maxLength={20}
                        autoFocus
                        className="flex-1 px-2 py-0.5 text-sm border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      <span
                        className="text-sm text-gray-800 cursor-pointer hover:text-blue-600 truncate"
                        onClick={() => startEdit(i)}
                        title="클릭하여 수정"
                      >
                        {item}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    {editingIndex !== i && (
                      <button
                        onClick={() => startEdit(i)}
                        className="text-gray-400 hover:text-blue-500 transition-colors text-sm p-2 min-w-[36px] min-h-[36px] flex items-center justify-center"
                        title="수정"
                      >
                        &#9998;
                      </button>
                    )}
                    <button
                      onClick={() => removeItem(i)}
                      disabled={items.length <= 2}
                      className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-lg p-2 min-w-[36px] min-h-[36px] flex items-center justify-center"
                      title="삭제"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {items.length <= 2 && (
              <p className="text-xs text-gray-400 mt-2">
                * 최소 2개 항목이 필요합니다.
              </p>
            )}
          </div>

          {/* Quick presets */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-3">빠른 설정</h2>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "점심 메뉴", items: ["짜장면", "짬뽕", "볶음밥", "김밥", "떡볶이"] },
                { label: "카페 메뉴", items: ["아메리카노", "라떼", "카푸치노", "녹차", "스무디"] },
                { label: "운동", items: ["달리기", "자전거", "수영", "요가", "헬스"] },
                { label: "숫자 (1-6)", items: ["1", "2", "3", "4", "5", "6"] },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setItems(preset.items);
                    setResult(null);
                    setShowCelebration(false);
                    currentRotationRef.current = 0;
                  }}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Roulette wheel */}
        <div className="flex flex-col items-center">
          {/* Arrow indicator */}
          <div className="text-3xl mb-1 text-red-500 animate-bounce">
            &#9660;
          </div>

          {/* Canvas roulette */}
          <div className="relative mb-6">
            <canvas
              ref={canvasCallback}
              width={320}
              height={320}
              className="rounded-full shadow-lg max-w-full h-auto"
            />
          </div>

          {/* Spin button */}
          <button
            onClick={spin}
            disabled={spinning || items.length < 2}
            className={`px-10 py-4 text-lg font-bold rounded-full text-white transition-all transform ${
              spinning
                ? "bg-gray-400 cursor-not-allowed scale-95"
                : "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            }`}
          >
            {spinning ? "돌리는 중..." : "돌리기!"}
          </button>

          {/* Result */}
          {result && (
            <div
              className={`mt-6 text-center transition-all duration-500 ${
                showCelebration ? "animate-bounce" : ""
              }`}
            >
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-6 shadow-md">
                {showCelebration && (
                  <div className="text-3xl mb-2">
                    &#127881; &#127882; &#127881;
                  </div>
                )}
                <p className="text-sm text-gray-500 mb-1">결과</p>
                <p className="text-3xl font-bold text-gray-900">{result}</p>
                {showCelebration && (
                  <p className="text-sm text-orange-500 mt-2 font-medium">
                    축하합니다!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SEO Content */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            랜덤 룰렛이란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            랜덤 룰렛은 여러 선택지 중 하나를 무작위로 선택해주는 온라인 도구입니다.
            점심 메뉴 정하기, 벌칙 뽑기, 순서 정하기, 당번 정하기 등
            결정이 어려울 때 공정하고 재미있게 선택할 수 있습니다.
            항목을 직접 입력하여 나만의 룰렛을 만들어 보세요.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            사용 방법
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>1. 원하는 항목을 입력하고 &quot;추가&quot; 버튼을 클릭합니다. (최소 2개, 최대 10개)</p>
            <p>2. 불필요한 항목은 X 버튼으로 삭제할 수 있습니다.</p>
            <p>3. &quot;돌리기!&quot; 버튼을 클릭하면 룰렛이 회전합니다.</p>
            <p>4. 룰렛이 멈추면 선택된 항목이 표시됩니다.</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            활용 예시
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-1">점심 메뉴 정하기</h3>
              <p className="text-sm text-gray-600">오늘 뭐 먹을지 고민될 때 메뉴를 넣고 돌려보세요.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-1">벌칙 뽑기</h3>
              <p className="text-sm text-gray-600">모임, 회식에서 재미있는 벌칙을 랜덤으로 정하세요.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-1">순서/당번 정하기</h3>
              <p className="text-sm text-gray-600">공정하게 순서나 당번을 정할 수 있습니다.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-1">여행지 결정</h3>
              <p className="text-sm text-gray-600">후보 여행지를 넣고 운명에 맡겨보세요.</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">결과가 정말 랜덤인가요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                네, JavaScript의 Math.random() 함수를 사용하여 완전히 무작위로 결과가 결정됩니다. 각 항목이 선택될 확률은 동일합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">최대 몇 개까지 추가할 수 있나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                최소 2개에서 최대 10개까지 항목을 추가할 수 있습니다. 항목이 너무 많으면 룰렛이 읽기 어려워지므로 10개로 제한하고 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">모바일에서도 사용할 수 있나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                네, 모바일 브라우저에서도 완벽하게 작동합니다. 반응형 디자인으로 화면 크기에 맞춰 최적화됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="random-roulette" />
    </div>
  );
}
