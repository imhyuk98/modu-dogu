"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import RelatedTools from "@/components/RelatedTools";

/* ──────────── Types ──────────── */
interface Block {
  id: number;
  row: number;
  col: number;
  length: number;
  orientation: "h" | "v";
  isTarget: boolean;
}

type Level = Block[];

/* ──────────── 10+ Hand-crafted Levels ──────────── */
const LEVELS: Level[] = [
  // Level 1 – tutorial (easy)
  [
    { id: 0, row: 2, col: 1, length: 2, orientation: "h", isTarget: true },
    { id: 1, row: 0, col: 0, length: 3, orientation: "v", isTarget: false },
    { id: 2, row: 0, col: 3, length: 2, orientation: "v", isTarget: false },
    { id: 3, row: 4, col: 1, length: 2, orientation: "h", isTarget: false },
    { id: 4, row: 0, col: 4, length: 2, orientation: "h", isTarget: false },
  ],
  // Level 2
  [
    { id: 0, row: 2, col: 0, length: 2, orientation: "h", isTarget: true },
    { id: 1, row: 0, col: 2, length: 3, orientation: "v", isTarget: false },
    { id: 2, row: 0, col: 0, length: 2, orientation: "v", isTarget: false },
    { id: 3, row: 3, col: 3, length: 2, orientation: "h", isTarget: false },
    { id: 4, row: 4, col: 0, length: 2, orientation: "v", isTarget: false },
    { id: 5, row: 5, col: 3, length: 3, orientation: "h", isTarget: false },
  ],
  // Level 3
  [
    { id: 0, row: 2, col: 1, length: 2, orientation: "h", isTarget: true },
    { id: 1, row: 0, col: 0, length: 2, orientation: "v", isTarget: false },
    { id: 2, row: 0, col: 3, length: 3, orientation: "v", isTarget: false },
    { id: 3, row: 3, col: 0, length: 2, orientation: "h", isTarget: false },
    { id: 4, row: 0, col: 1, length: 2, orientation: "h", isTarget: false },
    { id: 5, row: 4, col: 4, length: 2, orientation: "v", isTarget: false },
    { id: 6, row: 1, col: 4, length: 2, orientation: "v", isTarget: false },
  ],
  // Level 4
  [
    { id: 0, row: 2, col: 0, length: 2, orientation: "h", isTarget: true },
    { id: 1, row: 0, col: 2, length: 2, orientation: "v", isTarget: false },
    { id: 2, row: 0, col: 3, length: 2, orientation: "v", isTarget: false },
    { id: 3, row: 0, col: 5, length: 3, orientation: "v", isTarget: false },
    { id: 4, row: 3, col: 2, length: 3, orientation: "h", isTarget: false },
    { id: 5, row: 4, col: 0, length: 2, orientation: "h", isTarget: false },
    { id: 6, row: 5, col: 2, length: 2, orientation: "h", isTarget: false },
    { id: 7, row: 2, col: 4, length: 2, orientation: "v", isTarget: false },
  ],
  // Level 5
  [
    { id: 0, row: 2, col: 1, length: 2, orientation: "h", isTarget: true },
    { id: 1, row: 0, col: 0, length: 3, orientation: "v", isTarget: false },
    { id: 2, row: 0, col: 3, length: 2, orientation: "v", isTarget: false },
    { id: 3, row: 3, col: 1, length: 3, orientation: "h", isTarget: false },
    { id: 4, row: 0, col: 1, length: 2, orientation: "h", isTarget: false },
    { id: 5, row: 4, col: 4, length: 2, orientation: "v", isTarget: false },
    { id: 6, row: 1, col: 5, length: 3, orientation: "v", isTarget: false },
    { id: 7, row: 4, col: 0, length: 2, orientation: "h", isTarget: false },
    { id: 8, row: 5, col: 2, length: 2, orientation: "h", isTarget: false },
  ],
  // Level 6
  [
    { id: 0, row: 2, col: 0, length: 2, orientation: "h", isTarget: true },
    { id: 1, row: 0, col: 0, length: 2, orientation: "v", isTarget: false },
    { id: 2, row: 0, col: 2, length: 3, orientation: "v", isTarget: false },
    { id: 3, row: 0, col: 4, length: 2, orientation: "h", isTarget: false },
    { id: 4, row: 1, col: 3, length: 2, orientation: "v", isTarget: false },
    { id: 5, row: 3, col: 0, length: 2, orientation: "v", isTarget: false },
    { id: 6, row: 3, col: 3, length: 3, orientation: "h", isTarget: false },
    { id: 7, row: 4, col: 1, length: 2, orientation: "h", isTarget: false },
    { id: 8, row: 5, col: 0, length: 2, orientation: "h", isTarget: false },
    { id: 9, row: 5, col: 4, length: 2, orientation: "h", isTarget: false },
  ],
  // Level 7
  [
    { id: 0, row: 2, col: 0, length: 2, orientation: "h", isTarget: true },
    { id: 1, row: 0, col: 2, length: 3, orientation: "v", isTarget: false },
    { id: 2, row: 0, col: 4, length: 2, orientation: "v", isTarget: false },
    { id: 3, row: 0, col: 0, length: 2, orientation: "h", isTarget: false },
    { id: 4, row: 1, col: 0, length: 2, orientation: "h", isTarget: false },
    { id: 5, row: 3, col: 0, length: 2, orientation: "v", isTarget: false },
    { id: 6, row: 3, col: 3, length: 2, orientation: "v", isTarget: false },
    { id: 7, row: 4, col: 4, length: 2, orientation: "v", isTarget: false },
    { id: 8, row: 5, col: 1, length: 3, orientation: "h", isTarget: false },
    { id: 9, row: 2, col: 5, length: 3, orientation: "v", isTarget: false },
    { id: 10, row: 3, col: 1, length: 2, orientation: "h", isTarget: false },
  ],
  // Level 8
  [
    { id: 0, row: 2, col: 1, length: 2, orientation: "h", isTarget: true },
    { id: 1, row: 0, col: 0, length: 3, orientation: "v", isTarget: false },
    { id: 2, row: 0, col: 3, length: 3, orientation: "v", isTarget: false },
    { id: 3, row: 0, col: 1, length: 2, orientation: "h", isTarget: false },
    { id: 4, row: 1, col: 1, length: 2, orientation: "h", isTarget: false },
    { id: 5, row: 3, col: 1, length: 2, orientation: "h", isTarget: false },
    { id: 6, row: 0, col: 4, length: 2, orientation: "v", isTarget: false },
    { id: 7, row: 2, col: 5, length: 2, orientation: "v", isTarget: false },
    { id: 8, row: 4, col: 0, length: 2, orientation: "h", isTarget: false },
    { id: 9, row: 4, col: 4, length: 2, orientation: "v", isTarget: false },
    { id: 10, row: 5, col: 2, length: 2, orientation: "h", isTarget: false },
  ],
  // Level 9
  [
    { id: 0, row: 2, col: 0, length: 2, orientation: "h", isTarget: true },
    { id: 1, row: 0, col: 0, length: 2, orientation: "v", isTarget: false },
    { id: 2, row: 0, col: 2, length: 2, orientation: "v", isTarget: false },
    { id: 3, row: 0, col: 4, length: 3, orientation: "v", isTarget: false },
    { id: 4, row: 0, col: 5, length: 2, orientation: "v", isTarget: false },
    { id: 5, row: 2, col: 2, length: 3, orientation: "v", isTarget: false },
    { id: 6, row: 2, col: 3, length: 2, orientation: "v", isTarget: false },
    { id: 7, row: 3, col: 4, length: 2, orientation: "h", isTarget: false },
    { id: 8, row: 4, col: 0, length: 3, orientation: "h", isTarget: false },
    { id: 9, row: 5, col: 0, length: 2, orientation: "h", isTarget: false },
    { id: 10, row: 5, col: 3, length: 3, orientation: "h", isTarget: false },
    { id: 11, row: 4, col: 3, length: 2, orientation: "v", isTarget: false },
  ],
  // Level 10
  [
    { id: 0, row: 2, col: 0, length: 2, orientation: "h", isTarget: true },
    { id: 1, row: 0, col: 0, length: 2, orientation: "v", isTarget: false },
    { id: 2, row: 0, col: 2, length: 3, orientation: "v", isTarget: false },
    { id: 3, row: 0, col: 3, length: 2, orientation: "h", isTarget: false },
    { id: 4, row: 1, col: 3, length: 2, orientation: "v", isTarget: false },
    { id: 5, row: 1, col: 5, length: 3, orientation: "v", isTarget: false },
    { id: 6, row: 3, col: 0, length: 3, orientation: "v", isTarget: false },
    { id: 7, row: 3, col: 2, length: 2, orientation: "h", isTarget: false },
    { id: 8, row: 3, col: 4, length: 2, orientation: "v", isTarget: false },
    { id: 9, row: 4, col: 1, length: 2, orientation: "h", isTarget: false },
    { id: 10, row: 5, col: 1, length: 2, orientation: "h", isTarget: false },
    { id: 11, row: 5, col: 4, length: 2, orientation: "h", isTarget: false },
  ],
  // Level 11 – bonus hard
  [
    { id: 0, row: 2, col: 1, length: 2, orientation: "h", isTarget: true },
    { id: 1, row: 0, col: 0, length: 2, orientation: "v", isTarget: false },
    { id: 2, row: 0, col: 1, length: 2, orientation: "v", isTarget: false },
    { id: 3, row: 0, col: 3, length: 3, orientation: "v", isTarget: false },
    { id: 4, row: 0, col: 5, length: 2, orientation: "v", isTarget: false },
    { id: 5, row: 2, col: 0, length: 2, orientation: "v", isTarget: false },
    { id: 6, row: 3, col: 1, length: 2, orientation: "h", isTarget: false },
    { id: 7, row: 2, col: 4, length: 2, orientation: "v", isTarget: false },
    { id: 8, row: 4, col: 0, length: 2, orientation: "h", isTarget: false },
    { id: 9, row: 4, col: 3, length: 3, orientation: "h", isTarget: false },
    { id: 10, row: 5, col: 0, length: 3, orientation: "h", isTarget: false },
    { id: 11, row: 3, col: 5, length: 3, orientation: "v", isTarget: false },
  ],
  // Level 12 – hardest
  [
    { id: 0, row: 2, col: 0, length: 2, orientation: "h", isTarget: true },
    { id: 1, row: 0, col: 0, length: 2, orientation: "v", isTarget: false },
    { id: 2, row: 0, col: 2, length: 2, orientation: "v", isTarget: false },
    { id: 3, row: 0, col: 3, length: 2, orientation: "h", isTarget: false },
    { id: 4, row: 1, col: 3, length: 3, orientation: "v", isTarget: false },
    { id: 5, row: 1, col: 4, length: 2, orientation: "v", isTarget: false },
    { id: 6, row: 2, col: 5, length: 3, orientation: "v", isTarget: false },
    { id: 7, row: 3, col: 0, length: 2, orientation: "v", isTarget: false },
    { id: 8, row: 3, col: 1, length: 2, orientation: "h", isTarget: false },
    { id: 9, row: 4, col: 1, length: 2, orientation: "v", isTarget: false },
    { id: 10, row: 4, col: 3, length: 2, orientation: "h", isTarget: false },
    { id: 11, row: 5, col: 0, length: 2, orientation: "h", isTarget: false },
    { id: 12, row: 5, col: 3, length: 2, orientation: "h", isTarget: false },
  ],
];

/* ──────────── Block colors ──────────── */
const BLOCK_COLORS = [
  "#ef4444", // red — target always gets index 0 in render
  "#3b82f6", // blue
  "#22c55e", // green
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f97316", // orange
  "#6366f1", // indigo
  "#06b6d4", // cyan
  "#84cc16", // lime
  "#e11d48", // rose
  "#0ea5e9", // sky
  "#a855f7", // purple
];

const GRID = 6;
const EXIT_ROW = 2; // 0-indexed row where the exit is

function colorForBlock(block: Block, idx: number): string {
  if (block.isTarget) return BLOCK_COLORS[0];
  return BLOCK_COLORS[((idx % (BLOCK_COLORS.length - 1)) + 1)];
}

/* ──────────── Build grid occupancy ──────────── */
function buildGrid(blocks: Block[]): (number | null)[][] {
  const grid: (number | null)[][] = Array.from({ length: GRID }, () =>
    Array(GRID).fill(null)
  );
  for (const b of blocks) {
    for (let i = 0; i < b.length; i++) {
      const r = b.orientation === "v" ? b.row + i : b.row;
      const c = b.orientation === "h" ? b.col + i : b.col;
      if (r >= 0 && r < GRID && c >= 0 && c < GRID) {
        grid[r][c] = b.id;
      }
    }
  }
  return grid;
}

/* ──────────── Movement logic ──────────── */
function canMove(
  block: Block,
  delta: number,
  blocks: Block[]
): boolean {
  const grid = buildGrid(blocks);
  // Clear own cells
  for (let i = 0; i < block.length; i++) {
    const r = block.orientation === "v" ? block.row + i : block.row;
    const c = block.orientation === "h" ? block.col + i : block.col;
    grid[r][c] = null;
  }

  if (block.orientation === "h") {
    const newCol = block.col + delta;
    if (newCol < 0 || newCol + block.length > GRID) return false;
    for (let i = 0; i < block.length; i++) {
      if (grid[block.row][newCol + i] !== null) return false;
    }
  } else {
    const newRow = block.row + delta;
    if (newRow < 0 || newRow + block.length > GRID) return false;
    for (let i = 0; i < block.length; i++) {
      if (grid[newRow + i][block.col] !== null) return false;
    }
  }
  return true;
}

function moveBlock(blocks: Block[], blockId: number, delta: number): Block[] {
  return blocks.map((b) => {
    if (b.id !== blockId) return b;
    if (b.orientation === "h") return { ...b, col: b.col + delta };
    return { ...b, row: b.row + delta };
  });
}

function checkWin(blocks: Block[]): boolean {
  const target = blocks.find((b) => b.isTarget);
  if (!target) return false;
  // Target must reach right edge: col + length === GRID
  return target.col + target.length === GRID;
}

/* ──────────── Component ──────────── */
export default function BlockEscapePage() {
  const [levelIdx, setLevelIdx] = useState(0);
  const [blocks, setBlocks] = useState<Block[]>(() =>
    LEVELS[0].map((b) => ({ ...b }))
  );
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [showWin, setShowWin] = useState(false);

  // Drag state
  const dragRef = useRef<{
    blockId: number;
    startX: number;
    startY: number;
    origCol: number;
    origRow: number;
    orientation: "h" | "v";
    cellSize: number;
    lastAppliedDelta: number;
  } | null>(null);

  const boardRef = useRef<HTMLDivElement>(null);

  const loadLevel = useCallback((idx: number) => {
    setLevelIdx(idx);
    setBlocks(LEVELS[idx].map((b) => ({ ...b })));
    setMoves(0);
    setWon(false);
    setShowWin(false);
  }, []);

  // Check win after blocks change
  useEffect(() => {
    if (!won && checkWin(blocks)) {
      setWon(true);
      setTimeout(() => setShowWin(true), 100);
    }
  }, [blocks, won]);

  const handleNextLevel = useCallback(() => {
    const next = levelIdx + 1;
    if (next < LEVELS.length) {
      loadLevel(next);
    }
  }, [levelIdx, loadLevel]);

  /* ──────── Pointer handlers ──────── */
  const getCellSize = useCallback(() => {
    if (!boardRef.current) return 60;
    return boardRef.current.clientWidth / GRID;
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, block: Block) => {
      if (won) return;
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      dragRef.current = {
        blockId: block.id,
        startX: e.clientX,
        startY: e.clientY,
        origCol: block.col,
        origRow: block.row,
        orientation: block.orientation,
        cellSize: getCellSize(),
        lastAppliedDelta: 0,
      };
    },
    [won, getCellSize]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      e.preventDefault();

      const diffPx =
        d.orientation === "h"
          ? e.clientX - d.startX
          : e.clientY - d.startY;

      const rawDelta = Math.round(diffPx / d.cellSize);
      if (rawDelta === d.lastAppliedDelta) return;

      // Compute step-by-step from original position
      setBlocks((prev) => {
        // Start from orig position
        let current = prev.map((b) =>
          b.id === d.blockId
            ? {
                ...b,
                col: d.orientation === "h" ? d.origCol : b.col,
                row: d.orientation === "v" ? d.origRow : b.row,
              }
            : b
        );

        const dir = rawDelta > 0 ? 1 : -1;
        const steps = Math.abs(rawDelta);
        let applied = 0;

        for (let s = 0; s < steps; s++) {
          const blk = current.find((b) => b.id === d.blockId)!;
          if (canMove(blk, dir, current)) {
            current = moveBlock(current, d.blockId, dir);
            applied++;
          } else {
            break;
          }
        }

        const actualDelta = dir * applied;
        if (actualDelta !== d.lastAppliedDelta) {
          d.lastAppliedDelta = actualDelta;
        }

        return current;
      });
    },
    []
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      if (d.lastAppliedDelta !== 0) {
        setMoves((m) => m + 1);
      }
      dragRef.current = null;
    },
    []
  );

  /* ──────── Render ──────── */
  const cellSize = typeof window !== "undefined" ? getCellSize() : 60;

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      {/* Title */}
      <h1 className="text-2xl font-bold text-center mb-1">
        <span role="img" aria-label="car">🚗</span> 블록 탈출
      </h1>
      <p className="text-center text-gray-500 mb-6">
        블록을 밀어서 빨간 블록을 탈출시키세요!
      </p>

      {/* Level selector & controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
        <label className="text-sm font-medium text-gray-700">레벨:</label>
        <div className="flex flex-wrap gap-1">
          {LEVELS.map((_, i) => (
            <button
              key={i}
              onClick={() => loadLevel(i)}
              className={`w-8 h-8 rounded text-sm font-bold transition-colors ${
                i === levelIdx
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-600">
          이동 횟수: <span className="font-bold text-blue-600">{moves}</span>
        </div>
        <button
          onClick={() => loadLevel(levelIdx)}
          className="px-4 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-medium"
        >
          다시 시작
        </button>
      </div>

      {/* Board */}
      <div className="relative mx-auto" style={{ maxWidth: 420 }}>
        <div
          ref={boardRef}
          className="relative w-full bg-gray-800 rounded-lg overflow-visible"
          style={{
            aspectRatio: "1 / 1",
            touchAction: "none",
          }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Grid lines */}
          {Array.from({ length: GRID }).map((_, r) =>
            Array.from({ length: GRID }).map((_, c) => (
              <div
                key={`cell-${r}-${c}`}
                className="absolute border border-gray-700 rounded-sm"
                style={{
                  left: `${(c / GRID) * 100}%`,
                  top: `${(r / GRID) * 100}%`,
                  width: `${(1 / GRID) * 100}%`,
                  height: `${(1 / GRID) * 100}%`,
                }}
              />
            ))
          )}

          {/* Exit indicator */}
          <div
            className="absolute flex items-center justify-center"
            style={{
              right: "-24px",
              top: `${(EXIT_ROW / GRID) * 100}%`,
              height: `${(1 / GRID) * 100}%`,
              width: "24px",
            }}
          >
            <div className="text-green-400 text-2xl font-bold animate-pulse">
              ➡
            </div>
          </div>

          {/* Blocks */}
          {blocks.map((block, idx) => {
            const w =
              block.orientation === "h"
                ? (block.length / GRID) * 100
                : (1 / GRID) * 100;
            const h =
              block.orientation === "v"
                ? (block.length / GRID) * 100
                : (1 / GRID) * 100;
            const left = (block.col / GRID) * 100;
            const top = (block.row / GRID) * 100;
            const color = colorForBlock(block, idx);

            return (
              <div
                key={block.id}
                onPointerDown={(e) => handlePointerDown(e, block)}
                className="absolute rounded-md cursor-grab active:cursor-grabbing select-none flex items-center justify-center transition-none"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${w}%`,
                  height: `${h}%`,
                  backgroundColor: color,
                  border: "2px solid rgba(255,255,255,0.3)",
                  boxShadow: block.isTarget
                    ? "0 0 12px rgba(239,68,68,0.6)"
                    : "0 2px 4px rgba(0,0,0,0.3)",
                  zIndex: block.isTarget ? 10 : 5,
                  padding: "2px",
                }}
              >
                {block.isTarget && (
                  <span className="text-white text-lg font-bold drop-shadow">
                    🚗
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Win overlay */}
      {showWin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 mx-4 text-center shadow-2xl max-w-sm animate-bounce-once">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              레벨 {levelIdx + 1} 클리어!
            </h2>
            <p className="text-gray-500 mb-1">
              이동 횟수: <span className="font-bold text-blue-600">{moves}</span>
            </p>
            <p className="text-sm text-gray-400 mb-6">
              {moves <= 10
                ? "놀라운 실력이에요! 🌟"
                : moves <= 20
                ? "잘하셨어요! 👏"
                : "클리어했어요! 💪"}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => loadLevel(levelIdx)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
              >
                다시 하기
              </button>
              {levelIdx + 1 < LEVELS.length ? (
                <button
                  onClick={handleNextLevel}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  다음 레벨 →
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowWin(false);
                  }}
                  className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  모든 레벨 클리어! 🏆
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SEO Content */}
      <section className="mt-12 space-y-6 text-sm text-gray-600 leading-relaxed">
        <h2 className="text-lg font-semibold text-gray-800">
          블록 탈출 게임이란?
        </h2>
        <p>
          블록 탈출(슬라이딩 블록 퍼즐)은 격자판 위에 놓인 블록들을 밀어서 빨간
          블록을 출구로 탈출시키는 논리 퍼즐 게임입니다. &quot;러시아워(Rush
          Hour)&quot;라는 이름으로도 널리 알려진 이 게임은 공간 추론 능력과 논리적
          사고력을 키우는 데 탁월한 두뇌 훈련 게임입니다.
        </p>

        <h2 className="text-lg font-semibold text-gray-800">게임 규칙</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>6×6 격자판 위에 다양한 크기의 블록이 배치되어 있습니다.</li>
          <li>
            가로 블록은 좌우로만, 세로 블록은 상하로만 이동할 수 있습니다.
          </li>
          <li>블록은 다른 블록을 통과할 수 없습니다.</li>
          <li>
            빨간색 블록(🚗)을 오른쪽 출구(→)로 이동시키면 레벨 클리어!
          </li>
          <li>가능한 적은 이동 횟수로 클리어하는 것이 목표입니다.</li>
        </ul>

        <h2 className="text-lg font-semibold text-gray-800">공략 팁</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            빨간 블록이 출구에 도달하기까지 경로를 먼저 파악하세요.
          </li>
          <li>
            경로를 막고 있는 블록부터 우선적으로 치워야 합니다.
          </li>
          <li>
            블록을 치울 때 다른 블록의 이동 경로까지 함께 고려하세요.
          </li>
          <li>
            막혔다면 &quot;다시 시작&quot; 버튼으로 처음부터 다시 도전하세요.
          </li>
          <li>
            높은 레벨일수록 여러 블록을 연쇄적으로 이동시켜야 합니다.
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-gray-800">
          블록 탈출 게임의 효과
        </h2>
        <p>
          슬라이딩 블록 퍼즐은 공간 지각력, 논리적 사고력, 문제 해결 능력을
          향상시키는 데 도움이 됩니다. 특히 어린이의 두뇌 발달에 효과적이며,
          성인에게도 두뇌 활성화와 집중력 향상에 좋은 훈련이 됩니다. 레벨이
          올라갈수록 더 많은 단계의 사고가 필요하므로, 꾸준히 도전하면
          논리력이 크게 향상될 수 있습니다.
        </p>
      </section>

      <RelatedTools current="block-escape" />
    </main>
  );
}
