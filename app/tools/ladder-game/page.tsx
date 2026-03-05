"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import RelatedTools from "@/components/RelatedTools";

/* ─── Types ─── */
interface Rung {
  row: number;
  col: number; // connects col and col+1
}

type Density = "low" | "medium" | "high";

const COLORS = [
  "#6366f1", "#ec4899", "#f59e0b", "#10b981",
  "#3b82f6", "#ef4444", "#8b5cf6", "#14b8a6",
];

export default function LadderGamePage() {
  const [participants, setParticipants] = useState<string[]>(["참가자1", "참가자2"]);
  const [results, setResults] = useState<string[]>(["당첨", "꽝"]);
  const [density, setDensity] = useState<Density>("medium");
  const [rungs, setRungs] = useState<Rung[]>([]);
  const [ladderReady, setLadderReady] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [animPath, setAnimPath] = useState<{ x: number; y: number }[]>([]);
  const [animIdx, setAnimIdx] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const [allResults, setAllResults] = useState<Record<number, number> | null>(null);
  const [showAllPaths, setShowAllPaths] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  const n = participants.length;
  const totalRows = density === "low" ? 6 : density === "medium" ? 10 : 15;

  /* ─── Input Handlers ─── */
  const addParticipant = () => {
    if (participants.length >= 8) return;
    setParticipants([...participants, `참가자${participants.length + 1}`]);
    setResults([...results, ""]);
    resetLadder();
  };

  const removeParticipant = (idx: number) => {
    if (participants.length <= 2) return;
    setParticipants(participants.filter((_, i) => i !== idx));
    setResults(results.filter((_, i) => i !== idx));
    resetLadder();
  };

  const updateParticipant = (idx: number, val: string) => {
    const arr = [...participants];
    arr[idx] = val;
    setParticipants(arr);
  };

  const updateResult = (idx: number, val: string) => {
    const arr = [...results];
    arr[idx] = val;
    setResults(arr);
  };

  const resetLadder = () => {
    setLadderReady(false);
    setRungs([]);
    setAnimPath([]);
    setAnimIdx(0);
    setSelectedPlayer(null);
    setAllResults(null);
    setShowAllPaths(false);
    setAnimating(false);
  };

  /* ─── Generate Ladder ─── */
  const generateLadder = useCallback(() => {
    const newRungs: Rung[] = [];
    const cols = participants.length;

    for (let row = 0; row < totalRows; row++) {
      // For each row, decide which columns get a rung
      // Ensure no two adjacent rungs on the same row
      const available: number[] = [];
      for (let col = 0; col < cols - 1; col++) {
        available.push(col);
      }

      // Shuffle and pick
      const shuffled = [...available].sort(() => Math.random() - 0.5);
      const placed = new Set<number>();

      for (const col of shuffled) {
        // density probability
        const prob = density === "low" ? 0.25 : density === "medium" ? 0.4 : 0.55;
        if (Math.random() > prob) continue;
        // no adjacent
        if (placed.has(col - 1) || placed.has(col + 1)) continue;
        placed.add(col);
        newRungs.push({ row, col });
      }
    }

    setRungs(newRungs);
    setLadderReady(true);
    setAnimPath([]);
    setAnimIdx(0);
    setSelectedPlayer(null);
    setAllResults(null);
    setShowAllPaths(false);
    setAnimating(false);
  }, [participants.length, totalRows, density]);

  /* ─── Trace path ─── */
  const tracePath = useCallback(
    (startCol: number): { path: { x: number; y: number }[]; endCol: number } => {
      const colWidth = 1;
      const rowHeight = 1;
      let col = startCol;
      const path: { x: number; y: number }[] = [{ x: col * colWidth, y: 0 }];

      for (let row = 0; row < totalRows; row++) {
        // Check for rung at this row from current col to right
        const rungRight = rungs.find((r) => r.row === row && r.col === col);
        const rungLeft = rungs.find((r) => r.row === row && r.col === col - 1);

        // Move down to this row
        const y = (row + 0.5) * rowHeight;
        path.push({ x: col * colWidth, y });

        if (rungRight) {
          // Move right
          col = col + 1;
          path.push({ x: col * colWidth, y });
        } else if (rungLeft) {
          // Move left
          col = col - 1;
          path.push({ x: col * colWidth, y });
        }
      }

      // Move to bottom
      path.push({ x: col * colWidth, y: totalRows * rowHeight });

      return { path, endCol: col };
    },
    [rungs, totalRows]
  );

  /* ─── Draw Canvas ─── */
  const drawLadder = useCallback(
    (
      highlightPaths?: { path: { x: number; y: number }[]; color: string; upTo?: number }[]
    ) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const cols = participants.length;
      const padding = 40;
      const topPad = 10;
      const bottomPad = 10;
      const w = canvas.width;
      const h = canvas.height;
      const drawW = w - padding * 2;
      const drawH = h - topPad - bottomPad;
      const colSpacing = drawW / (cols - 1 || 1);
      const rowSpacing = drawH / totalRows;

      ctx.clearRect(0, 0, w, h);

      // scale helpers
      const sx = (x: number) => padding + x * colSpacing;
      const sy = (y: number) => topPad + y * rowSpacing;

      // Draw vertical lines
      ctx.strokeStyle = "#d1d5db";
      ctx.lineWidth = 3;
      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        ctx.moveTo(sx(c), sy(0));
        ctx.lineTo(sx(c), sy(totalRows));
        ctx.stroke();
      }

      // Draw rungs
      ctx.strokeStyle = "#9ca3af";
      ctx.lineWidth = 3;
      for (const rung of rungs) {
        const y = sy((rung.row + 0.5));
        ctx.beginPath();
        ctx.moveTo(sx(rung.col), y);
        ctx.lineTo(sx(rung.col + 1), y);
        ctx.stroke();
      }

      // Draw highlighted paths
      if (highlightPaths) {
        for (const hp of highlightPaths) {
          ctx.strokeStyle = hp.color;
          ctx.lineWidth = 4;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.beginPath();
          const limit = hp.upTo !== undefined ? hp.upTo + 1 : hp.path.length;
          for (let i = 0; i < Math.min(limit, hp.path.length); i++) {
            const px = sx(hp.path[i].x);
            const py = sy(hp.path[i].y);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();

          // Draw current dot
          if (limit > 0 && limit <= hp.path.length) {
            const last = hp.path[Math.min(limit - 1, hp.path.length - 1)];
            ctx.fillStyle = hp.color;
            ctx.beginPath();
            ctx.arc(sx(last.x), sy(last.y), 6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    },
    [participants.length, rungs, totalRows]
  );

  /* ─── Animate single path ─── */
  const animatePath = useCallback(
    (playerIdx: number) => {
      if (animating) return;
      const { path, endCol } = tracePath(playerIdx);
      setSelectedPlayer(playerIdx);
      setAnimPath(path);
      setAnimIdx(0);
      setAnimating(true);
      setAllResults(null);
      setShowAllPaths(false);

      let frame = 0;
      const speed = 2; // points per frame

      const step = () => {
        frame += 1;
        const currentIdx = Math.min(frame * speed, path.length - 1);
        setAnimIdx(currentIdx);

        drawLadder([
          { path, color: COLORS[playerIdx % COLORS.length], upTo: currentIdx },
        ]);

        if (currentIdx < path.length - 1) {
          animFrameRef.current = requestAnimationFrame(step);
        } else {
          setAnimating(false);
          // Show result
          setAllResults({ [playerIdx]: endCol });
        }
      };

      animFrameRef.current = requestAnimationFrame(step);
    },
    [animating, tracePath, drawLadder]
  );

  /* ─── Show all results ─── */
  const showAll = useCallback(() => {
    if (animating) return;
    const mapping: Record<number, number> = {};
    const paths: { path: { x: number; y: number }[]; color: string }[] = [];

    for (let i = 0; i < participants.length; i++) {
      const { path, endCol } = tracePath(i);
      mapping[i] = endCol;
      paths.push({ path, color: COLORS[i % COLORS.length] });
    }

    setAllResults(mapping);
    setShowAllPaths(true);
    setSelectedPlayer(null);
    drawLadder(paths);
  }, [animating, participants.length, tracePath, drawLadder]);

  /* ─── Canvas sizing ─── */
  useEffect(() => {
    if (!ladderReady) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = Math.max(400, totalRows * 35 + 40);
    }
    drawLadder();
  }, [ladderReady, drawLadder, totalRows, participants.length]);

  /* ─── Cleanup animation on unmount ─── */
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        사다리 타기
      </h1>
      <p className="text-gray-500 mb-8">
        참가자와 결과를 입력하고 사다리를 타보세요!
      </p>

      {/* ─── Setup ─── */}
      {!ladderReady && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Participants */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">
              참가자 입력 (최소 2명, 최대 8명)
            </h2>
            <div className="space-y-3">
              {participants.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  >
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={p}
                    onChange={(e) => updateParticipant(idx, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    placeholder={`참가자${idx + 1}`}
                    maxLength={10}
                  />
                  {participants.length > 2 && (
                    <button
                      onClick={() => removeParticipant(idx)}
                      className="text-red-400 hover:text-red-600 transition-colors text-lg p-2 min-w-[36px] min-h-[36px] flex items-center justify-center"
                    >
                      &#x2715;
                    </button>
                  )}
                </div>
              ))}
            </div>
            {participants.length < 8 && (
              <button
                onClick={addParticipant}
                className="mt-3 text-sm text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
              >
                + 참가자 추가
              </button>
            )}
          </div>

          {/* Results */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">
              결과 입력 (참가자 수와 동일)
            </h2>
            <div className="space-y-3">
              {results.map((r, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-sm text-gray-400 w-6 text-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={r}
                    onChange={(e) => updateResult(idx, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    placeholder={`결과${idx + 1} (예: 당첨, 꽝, 벌칙)`}
                    maxLength={10}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Density */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">
              가로선 수
            </h2>
            <div className="flex gap-3">
              {(["low", "medium", "high"] as Density[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDensity(d)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    density === d
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {d === "low" ? "적음" : d === "medium" ? "보통" : "많음"}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={generateLadder}
            className="w-full py-4 bg-indigo-500 text-white font-bold text-lg rounded-xl hover:bg-indigo-600 transition-colors shadow-md"
          >
            사다리 만들기
          </button>
        </div>
      )}

      {/* ─── Ladder View ─── */}
      {ladderReady && (
        <div className="max-w-2xl mx-auto">
          {/* Player names at top */}
          <div className="flex justify-between px-6 mb-2">
            {participants.map((p, idx) => (
              <button
                key={idx}
                onClick={() => !animating && animatePath(idx)}
                disabled={animating}
                className={`text-xs sm:text-sm font-bold px-2 py-1 rounded-lg transition-all ${
                  animating
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-110 cursor-pointer"
                } ${
                  selectedPlayer === idx
                    ? "ring-2 ring-offset-1"
                    : ""
                }`}
                style={{
                  color: COLORS[idx % COLORS.length],
                  borderColor: COLORS[idx % COLORS.length],
                  ...(selectedPlayer === idx
                    ? { ringColor: COLORS[idx % COLORS.length] }
                    : {}),
                }}
              >
                {p || `참가자${idx + 1}`}
              </button>
            ))}
          </div>

          {/* Canvas */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4 mb-2">
            <canvas ref={canvasRef} className="w-full" />
          </div>

          {/* Results at bottom (hidden until revealed) */}
          <div className="flex justify-between px-6 mb-4">
            {results.map((r, idx) => {
              // Find which player ended at this position
              let playerAtThisCol: number | null = null;
              if (allResults) {
                for (const [playerStr, endCol] of Object.entries(allResults)) {
                  if (endCol === idx) {
                    playerAtThisCol = parseInt(playerStr);
                  }
                }
              }

              return (
                <div key={idx} className="text-center">
                  <span
                    className={`text-xs sm:text-sm font-bold px-2 py-1 rounded-lg inline-block ${
                      allResults && playerAtThisCol !== null
                        ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                        : "text-gray-400"
                    }`}
                  >
                    {allResults && playerAtThisCol !== null ? (
                      <>
                        {r || `결과${idx + 1}`}
                      </>
                    ) : (
                      "?"
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Result summary */}
          {allResults && (
            <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-5 mb-4">
              <h3 className="font-semibold text-yellow-800 mb-3">
                &#x1F3AF; 결과
              </h3>
              <div className="space-y-2">
                {Object.entries(allResults).map(([playerStr, endCol]) => {
                  const playerIdx = parseInt(playerStr);
                  return (
                    <div
                      key={playerIdx}
                      className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg"
                    >
                      <span
                        className="w-5 h-5 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: COLORS[playerIdx % COLORS.length],
                        }}
                      />
                      <span className="font-medium text-gray-800">
                        {participants[playerIdx] || `참가자${playerIdx + 1}`}
                      </span>
                      <span className="text-gray-400">&#x2192;</span>
                      <span className="font-bold text-yellow-700">
                        {results[endCol] || `결과${endCol + 1}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => !animating && showAll()}
              disabled={animating}
              className={`flex-1 py-3 font-medium rounded-lg transition-colors ${
                animating
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-indigo-500 text-white hover:bg-indigo-600"
              }`}
            >
              &#x1F50D; 전체 결과 보기
            </button>
            <button
              onClick={generateLadder}
              disabled={animating}
              className={`flex-1 py-3 font-medium rounded-lg transition-colors ${
                animating
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              &#x1F504; 사다리 다시 만들기
            </button>
          </div>

          <button
            onClick={resetLadder}
            className="w-full py-3 bg-gray-50 text-gray-500 font-medium rounded-lg hover:bg-gray-100 transition-colors text-sm"
          >
            &#x2190; 처음부터 다시 설정
          </button>

          <p className="text-center text-xs text-gray-400 mt-3">
            참가자 이름을 클릭하면 해당 참가자의 경로를 애니메이션으로 확인할 수 있습니다.
          </p>
        </div>
      )}

      {/* SEO Content */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            사다리 타기란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            사다리 타기는 한국에서 널리 사용되는 공정한 결정 방법입니다.
            세로선과 가로선으로 구성된 사다리를 따라 내려가며, 가로선을
            만나면 옆으로 이동하여 최종 결과에 도달합니다. 역할 분배,
            순서 정하기, 벌칙 정하기 등 다양한 상황에서 활용됩니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            사용 방법
          </h2>
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900">1. 참가자 입력</h3>
              <p className="text-gray-600 text-sm mt-1">
                최소 2명에서 최대 8명까지 참가자 이름을 입력합니다.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900">2. 결과 입력</h3>
              <p className="text-gray-600 text-sm mt-1">
                참가자 수와 동일한 수의 결과를 입력합니다. 예: 당첨, 꽝, 벌칙 등
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900">3. 사다리 타기</h3>
              <p className="text-gray-600 text-sm mt-1">
                참가자 이름을 클릭하면 해당 경로를 애니메이션으로 확인하거나,
                &quot;전체 결과 보기&quot;로 모든 결과를 한번에 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            활용 예시
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li>&#x2022; 회식 장소 정하기</li>
            <li>&#x2022; 발표 순서 정하기</li>
            <li>&#x2022; 벌칙 정하기</li>
            <li>&#x2022; 선물 교환 매칭</li>
            <li>&#x2022; 팀 나누기</li>
            <li>&#x2022; 역할 분배</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            자주 묻는 질문 (FAQ)
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">
                사다리 결과가 공정한가요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                가로선은 완전히 랜덤으로 배치되므로 공정한 결과를 보장합니다.
                같은 높이에 연속된 가로선이 배치되지 않도록 하여 정상적인
                사다리 구조를 유지합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                가로선 수는 어떻게 다른가요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                &quot;적음&quot;은 6단, &quot;보통&quot;은 10단, &quot;많음&quot;은 15단의 가로선 구간을
                생성합니다. 가로선이 많을수록 예측이 어려워집니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="ladder-game" />
    </div>
  );
}
