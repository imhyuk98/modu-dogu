"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import RelatedTools from "@/components/RelatedTools";
import DailyChallenge from "@/components/viral/DailyChallenge";

const APPLE_CHALLENGES = [
  { label: "제한 시간 안에 50점 만들기", target: 50 },
  { label: "오늘은 70점 벽 넘기", target: 70 },
  { label: "사과 90개 지우기에 도전", target: 90 },
];

// ── Constants ─────────────────────────────────────────────────────────────────
const COLS = 17;
const ROWS = 10;
const TOTAL_TIME = 120;
const TARGET_SUM = 10;

// ── Types ─────────────────────────────────────────────────────────────────────
interface Cell {
  value: number;
  removed: boolean;
}

interface SelectionRect {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

type GameState = "idle" | "playing" | "over";

// ── Helpers ───────────────────────────────────────────────────────────────────
function createGrid(): Cell[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      value: Math.floor(Math.random() * 9) + 1,
      removed: false,
    }))
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AppleGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [gameState, setGameState] = useState<GameState>("idle");
  const [grid, setGrid] = useState<Cell[][]>(() => createGrid());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [selectionRect, setSelectionRect] = useState<SelectionRect | null>(null);
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([]);
  const [selectionSum, setSelectionSum] = useState(0);
  const [scorePopups, setScorePopups] = useState<{ id: number; x: number; y: number; points: number }[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const popupId = useRef(0);
  const gridRef = useRef(grid);

  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  // Load best score
  useEffect(() => {
    const stored = localStorage.getItem("bestAppleGame");
    // Restore the browser-only high score after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setBestScore(parseInt(stored, 10));
  }, []);

  // Compute cell size based on canvas
  const getCellSize = useCallback(() => {
    if (canvasSize.width === 0) return { cellW: 0, cellH: 0, offsetX: 0, offsetY: 0 };
    const cellW = Math.floor(canvasSize.width / COLS);
    const cellH = Math.floor(canvasSize.height / ROWS);
    const size = Math.min(cellW, cellH);
    const offsetX = Math.floor((canvasSize.width - size * COLS) / 2);
    const offsetY = Math.floor((canvasSize.height - size * ROWS) / 2);
    return { cellW: size, cellH: size, offsetX, offsetY };
  }, [canvasSize]);

  // Resize canvas to fit container
  useEffect(() => {
    const updateSize = () => {
      const container = containerRef.current;
      if (!container) return;
      const w = container.clientWidth;
      // Aspect ratio: COLS:ROWS
      const h = Math.floor((w * ROWS) / COLS);
      setCanvasSize({ width: w, height: h });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Get selected cells from selection rectangle
  const getSelectedCells = useCallback(
    (rect: SelectionRect): [number, number][] => {
      const { cellW, cellH, offsetX, offsetY } = getCellSize();
      if (cellW === 0) return [];

      const left = Math.min(rect.startX, rect.endX);
      const right = Math.max(rect.startX, rect.endX);
      const top = Math.min(rect.startY, rect.endY);
      const bottom = Math.max(rect.startY, rect.endY);

      const cells: [number, number][] = [];
      const currentGrid = gridRef.current;

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (currentGrid[r][c].removed) continue;
          const cx = offsetX + c * cellW + cellW / 2;
          const cy = offsetY + r * cellH + cellH / 2;
          if (cx >= left && cx <= right && cy >= top && cy <= bottom) {
            cells.push([r, c]);
          }
        }
      }
      return cells;
    },
    [getCellSize]
  );

  // Timer
  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("over");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { cellW, cellH, offsetX, offsetY } = getCellSize();
    if (cellW === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasSize.width * dpr;
    canvas.height = canvasSize.height * dpr;
    canvas.style.width = `${canvasSize.width}px`;
    canvas.style.height = `${canvasSize.height}px`;
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = "#fef3c7"; // warm yellow
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

    // Selected cells set
    const selectedSet = new Set(selectedCells.map(([r, c]) => `${r},${c}`));
    const isValid = selectionSum === TARGET_SUM && selectedCells.length > 0;
    const isInvalid = selectionSum > TARGET_SUM && selectedCells.length > 0;

    // Draw cells
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = grid[r][c];
        if (cell.removed) continue;

        const x = offsetX + c * cellW;
        const y = offsetY + r * cellH;
        const padding = Math.max(1, cellW * 0.08);
        const radius = (cellW - padding * 2) / 2;
        const cx = x + cellW / 2;
        const cy = y + cellH / 2;

        const isSelected = selectedSet.has(`${r},${c}`);

        // Apple circle
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);

        if (isSelected) {
          if (isValid) {
            ctx.fillStyle = "#22c55e"; // green
          } else if (isInvalid) {
            ctx.fillStyle = "#ef4444"; // red
          } else {
            ctx.fillStyle = "#fbbf24"; // yellow highlight
          }
        } else {
          ctx.fillStyle = "#dc2626"; // red apple
        }
        ctx.fill();

        // Apple shine
        ctx.beginPath();
        ctx.arc(cx - radius * 0.25, cy - radius * 0.25, radius * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = isSelected
          ? "rgba(255,255,255,0.3)"
          : "rgba(255,255,255,0.25)";
        ctx.fill();

        // Stem
        ctx.beginPath();
        ctx.moveTo(cx, cy - radius);
        ctx.quadraticCurveTo(cx + radius * 0.3, cy - radius - radius * 0.4, cx + radius * 0.15, cy - radius - radius * 0.15);
        ctx.strokeStyle = "#92400e";
        ctx.lineWidth = Math.max(1, cellW * 0.04);
        ctx.stroke();

        // Leaf
        ctx.beginPath();
        ctx.ellipse(cx + radius * 0.3, cy - radius - radius * 0.05, radius * 0.22, radius * 0.1, Math.PI / 6, 0, Math.PI * 2);
        ctx.fillStyle = "#16a34a";
        ctx.fill();

        // Number
        const fontSize = Math.max(10, cellW * 0.4);
        ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(cell.value), cx, cy + 1);
      }
    }

    // Draw selection rectangle
    if (selectionRect && isDragging.current) {
      const left = Math.min(selectionRect.startX, selectionRect.endX);
      const top = Math.min(selectionRect.startY, selectionRect.endY);
      const w = Math.abs(selectionRect.endX - selectionRect.startX);
      const h = Math.abs(selectionRect.endY - selectionRect.startY);

      ctx.fillStyle = "rgba(59, 130, 246, 0.15)";
      ctx.fillRect(left, top, w, h);
      ctx.strokeStyle = "rgba(59, 130, 246, 0.6)";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 3]);
      ctx.strokeRect(left, top, w, h);
      ctx.setLineDash([]);
    }

    // Draw sum indicator if selecting
    if (selectedCells.length > 0 && selectionRect) {
      const indicatorX = Math.max(selectionRect.startX, selectionRect.endX) + 8;
      const indicatorY = Math.min(selectionRect.startY, selectionRect.endY) - 4;
      const text = `${selectionSum}`;
      const fontSize = Math.max(14, cellW * 0.5);
      ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

      const textWidth = ctx.measureText(text).width;
      const px = 6;
      const py = 4;

      // Clamp position
      const drawX = Math.min(indicatorX, canvasSize.width - textWidth - px * 2);
      const drawY = Math.max(fontSize + py * 2, indicatorY);

      ctx.fillStyle = isValid ? "#22c55e" : isInvalid ? "#ef4444" : "#3b82f6";
      ctx.beginPath();
      const rr = 6;
      const bx = drawX;
      const by = drawY - fontSize - py;
      const bw = textWidth + px * 2;
      const bh = fontSize + py * 2;
      ctx.moveTo(bx + rr, by);
      ctx.lineTo(bx + bw - rr, by);
      ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + rr);
      ctx.lineTo(bx + bw, by + bh - rr);
      ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - rr, by + bh);
      ctx.lineTo(bx + rr, by + bh);
      ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - rr);
      ctx.lineTo(bx, by + rr);
      ctx.quadraticCurveTo(bx, by, bx + rr, by);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(text, drawX + px, drawY - fontSize / 2);
    }
  }, [grid, canvasSize, getCellSize, selectionRect, selectedCells, selectionSum]);

  // Get position from mouse/touch event
  const getCanvasPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0]?.clientX ?? (e as React.TouchEvent).changedTouches[0]?.clientX ?? 0 : e.clientX;
    const clientY = "touches" in e ? e.touches[0]?.clientY ?? (e as React.TouchEvent).changedTouches[0]?.clientY ?? 0 : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  // Handle drag start
  const handleDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (gameState !== "playing") return;
      e.preventDefault();
      const pos = getCanvasPos(e);
      isDragging.current = true;
      dragStart.current = pos;
      setSelectionRect({ startX: pos.x, startY: pos.y, endX: pos.x, endY: pos.y });
      setSelectedCells([]);
      setSelectionSum(0);
    },
    [gameState, getCanvasPos]
  );

  // Handle drag move
  const handleDragMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDragging.current || gameState !== "playing") return;
      e.preventDefault();
      const pos = getCanvasPos(e);
      const rect: SelectionRect = {
        startX: dragStart.current.x,
        startY: dragStart.current.y,
        endX: pos.x,
        endY: pos.y,
      };
      setSelectionRect(rect);
      const cells = getSelectedCells(rect);
      setSelectedCells(cells);
      const sum = cells.reduce((acc, [r, c]) => acc + gridRef.current[r][c].value, 0);
      setSelectionSum(sum);
    },
    [gameState, getCanvasPos, getSelectedCells]
  );

  // Handle drag end
  const handleDragEnd = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDragging.current || gameState !== "playing") return;
      e.preventDefault();
      isDragging.current = false;

      const pos = getCanvasPos(e);
      const rect: SelectionRect = {
        startX: dragStart.current.x,
        startY: dragStart.current.y,
        endX: pos.x,
        endY: pos.y,
      };
      const cells = getSelectedCells(rect);
      const sum = cells.reduce((acc, [r, c]) => acc + gridRef.current[r][c].value, 0);

      if (sum === TARGET_SUM && cells.length > 0) {
        // 제거한 사과 1개당 1점 (원본 규칙)
        const points = cells.length;
        const newScore = score + points;
        setScore(newScore);

        if (newScore > bestScore) {
          setBestScore(newScore);
          localStorage.setItem("bestAppleGame", String(newScore));
        }

        // Score popup
        const avgX = cells.reduce((acc, [, c]) => {
          const { cellW, offsetX } = getCellSize();
          return acc + offsetX + c * cellW + cellW / 2;
        }, 0) / cells.length;
        const avgY = cells.reduce((acc, [r]) => {
          const { cellH, offsetY } = getCellSize();
          return acc + offsetY + r * cellH + cellH / 2;
        }, 0) / cells.length;

        const id = popupId.current++;
        setScorePopups((prev) => [...prev, { id, x: avgX, y: avgY, points }]);
        setTimeout(() => {
          setScorePopups((prev) => prev.filter((p) => p.id !== id));
        }, 800);

        // Mark cells as removed (stay in place, no gravity)
        setGrid((prev) => {
          const g = prev.map((row) => row.map((cell) => ({ ...cell })));
          cells.forEach(([r, c]) => {
            g[r][c].removed = true;
          });
          return g;
        });
      }

      setSelectionRect(null);
      setSelectedCells([]);
      setSelectionSum(0);
    },
    [gameState, getCanvasPos, getSelectedCells, score, bestScore, getCellSize]
  );

  // Remaining apples count
  const remaining = grid.reduce(
    (acc, row) => acc + row.filter((c) => !c.removed).length,
    0
  );

  const startGame = () => {
    setGrid(createGrid());
    setScore(0);
    setTimeLeft(TOTAL_TIME);
    setGameState("playing");
    setSelectionRect(null);
    setSelectedCells([]);
    setSelectionSum(0);
    setScorePopups([]);
  };

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        {"\uD83C\uDF4E"} 사과 게임
      </h1>
      <p className="text-gray-500 mb-6">
        드래그로 숫자를 선택하여 합이 10이 되면 제거! 제한 시간 안에 최대한 많이 제거하세요.
      </p>

      <DailyChallenge id="apple-game" challenges={APPLE_CHALLENGES} currentValue={score} unit="점" />

      {/* Score & Controls */}
      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        <div className="flex gap-2 sm:gap-3">
          <div className="bg-gray-700 text-white rounded-lg px-3 sm:px-4 py-2 text-center min-w-[70px]">
            <div className="text-[10px] uppercase tracking-wider text-gray-300">점수</div>
            <div className="text-lg font-bold">{score}</div>
          </div>
          <div className="bg-gray-700 text-white rounded-lg px-3 sm:px-4 py-2 text-center min-w-[70px]">
            <div className="text-[10px] uppercase tracking-wider text-gray-300">최고</div>
            <div className="text-lg font-bold">{bestScore}</div>
          </div>
          <div className={`rounded-lg px-3 sm:px-4 py-2 text-center min-w-[70px] ${
            timeLeft <= 10 && gameState === "playing" ? "bg-red-600 text-white" : "bg-gray-700 text-white"
          }`}>
            <div className="text-[10px] uppercase tracking-wider text-gray-300">시간</div>
            <div className="text-lg font-bold">{formatTime(timeLeft)}</div>
          </div>
          <div className="bg-gray-700 text-white rounded-lg px-3 sm:px-4 py-2 text-center min-w-[70px]">
            <div className="text-[10px] uppercase tracking-wider text-gray-300">남은 사과</div>
            <div className="text-lg font-bold">{remaining}</div>
          </div>
        </div>
        <button
          onClick={startGame}
          className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
        >
          {gameState === "idle" ? "게임 시작" : "다시 시작"}
        </button>
      </div>

      {/* Game Board */}
      <div className="relative" ref={containerRef}>
        <canvas
          ref={canvasRef}
          style={{ width: canvasSize.width, height: canvasSize.height, touchAction: "none" }}
          className="rounded-xl border-2 border-amber-300 cursor-crosshair"
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={(e) => { if (isDragging.current) handleDragEnd(e); }}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        />

        {/* Score popups */}
        {scorePopups.map((popup) => (
          <div
            key={popup.id}
            className="absolute pointer-events-none font-bold text-green-600 text-xl"
            style={{
              left: popup.x,
              top: popup.y,
              transform: "translate(-50%, -50%)",
              animation: "appleScoreFloat 0.8s ease-out forwards",
            }}
          >
            +{popup.points}
          </div>
        ))}

        {/* Idle overlay */}
        {gameState === "idle" && (
          <div className="absolute inset-0 bg-white/80 rounded-xl flex flex-col items-center justify-center">
            <p className="text-3xl mb-3">{"\uD83C\uDF4E"}</p>
            <p className="text-xl font-bold text-gray-800 mb-2">사과 게임</p>
            <p className="text-gray-500 text-sm mb-4 text-center px-4">
              드래그하여 숫자의 합이 10이 되는 사과를 선택하세요
            </p>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors text-lg"
            >
              게임 시작
            </button>
          </div>
        )}

        {/* Game Over overlay */}
        {gameState === "over" && (
          <div className="absolute inset-0 bg-white/80 rounded-xl flex flex-col items-center justify-center">
            <p className="text-3xl mb-2">{"\u23F0"}</p>
            <p className="text-2xl font-bold text-gray-800 mb-2">시간 종료!</p>
            <p className="text-gray-600 mb-1">최종 점수: <strong className="text-red-600">{score}점</strong></p>
            <p className="text-gray-500 text-sm mb-4">제거한 사과: {ROWS * COLS - remaining}개</p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              다시 시작
            </button>
          </div>
        )}
      </div>

      {/* How to play */}
      <div className="mt-4 p-4 bg-amber-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>조작법:</strong> 마우스 드래그(PC) 또는 터치 드래그(모바일)로 사과를 선택하세요.
          선택한 숫자의 합이 정확히 <strong>10</strong>이 되면 사과가 제거되고 점수를 얻습니다.
          선택 중 합이 <span className="text-green-600 font-semibold">초록색</span>이면 정확히 10,
          <span className="text-red-600 font-semibold"> 빨간색</span>이면 10 초과입니다.
        </p>
      </div>

      {/* SEO Content */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            사과 게임이란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            사과 게임은 격자판에 놓인 숫자 사과들 중에서 합이 10이 되는 조합을 찾아
            제거하는 중독성 있는 숫자 퍼즐 게임입니다. 17x10 격자판에 1부터 9까지의
            숫자가 랜덤으로 배치되며, 드래그로 영역을 선택하여 그 안의 숫자 합이
            정확히 10이 되면 해당 사과들이 제거됩니다. 제한 시간 120초 안에 최대한
            많은 사과를 제거하여 높은 점수를 노려보세요!
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            게임 규칙
          </h2>
          <ul className="text-gray-600 leading-relaxed space-y-2 list-disc list-inside">
            <li>17열 x 10행 격자판에 1~9 사이의 숫자가 랜덤으로 배치됩니다.</li>
            <li>마우스 또는 터치로 드래그하여 사과들을 선택합니다.</li>
            <li>선택한 숫자의 합이 정확히 10이 되면 사과가 제거됩니다.</li>
            <li>제거된 사과 1개당 1점을 획득합니다.</li>
            <li>사과가 제거되면 위의 사과가 아래로 떨어지고 빈 자리는 새 사과로 채워집니다.</li>
            <li>120초 제한 시간이 지나면 게임이 종료됩니다.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            공략 팁
          </h2>
          <ul className="text-gray-600 leading-relaxed space-y-2 list-disc list-inside">
            <li>
              <strong>큰 숫자 우선:</strong> 8+2, 9+1 같은 2개 조합을 먼저 찾으면 빠르게 점수를 올릴 수 있습니다.
            </li>
            <li>
              <strong>여러 개 조합:</strong> 1+2+3+4나 2+3+5 같이 여러 사과를 한번에 제거하면 더 많은 점수를 얻습니다.
            </li>
            <li>
              <strong>시간 관리:</strong> 너무 오래 고민하지 말고 보이는 조합부터 빠르게 제거하세요.
            </li>
            <li>
              <strong>색상 확인:</strong> 드래그 중 합계가 초록색이면 바로 손을 떼세요!
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            자주 묻는 질문 (FAQ)
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">
                사과를 하나만 선택해도 되나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                숫자가 10인 사과는 없으므로(1~9) 최소 2개 이상의 사과를 선택해야 합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                최고 점수는 저장되나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                네, 최고 점수는 브라우저의 로컬 스토리지에 자동으로 저장됩니다.
                같은 브라우저에서 다시 방문하면 이전 최고 점수를 확인할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                모바일에서도 플레이할 수 있나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                네, 모바일 기기에서 손가락으로 터치 드래그하여 플레이할 수 있습니다.
                화면을 드래그하여 사과를 선택하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Score float animation */}
      <style>{`
        @keyframes appleScoreFloat {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -150%) scale(1.5); }
        }
      `}</style>

      <RelatedTools current="apple-game" />
    </div>
  );
}
