"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import RelatedTools from "@/components/RelatedTools";

/* ── Types ─────────────────────────────────────────────────── */
interface Cell {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  adjacent: number;
}

type GameStatus = "idle" | "playing" | "won" | "lost";

interface Difficulty {
  label: string;
  rows: number;
  cols: number;
  mines: number;
}

const DIFFICULTIES: Difficulty[] = [
  { label: "초급", rows: 9, cols: 9, mines: 10 },
  { label: "중급", rows: 16, cols: 16, mines: 40 },
  { label: "고급", rows: 16, cols: 30, mines: 99 },
];

const NUMBER_COLORS: Record<number, string> = {
  1: "#2563eb",
  2: "#16a34a",
  3: "#dc2626",
  4: "#1e3a8a",
  5: "#991b1b",
  6: "#0d9488",
  7: "#000000",
  8: "#6b7280",
};

/* ── Helpers ───────────────────────────────────────────────── */
function createEmptyGrid(rows: number, cols: number): Cell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      mine: false,
      revealed: false,
      flagged: false,
      adjacent: 0,
    }))
  );
}

function getNeighbors(r: number, c: number, rows: number, cols: number) {
  const ns: [number, number][] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) ns.push([nr, nc]);
    }
  }
  return ns;
}

function placeMines(
  grid: Cell[][],
  rows: number,
  cols: number,
  mineCount: number,
  safeR: number,
  safeC: number
): Cell[][] {
  const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
  const safeSet = new Set<string>();
  safeSet.add(`${safeR},${safeC}`);
  for (const [nr, nc] of getNeighbors(safeR, safeC, rows, cols)) {
    safeSet.add(`${nr},${nc}`);
  }

  let placed = 0;
  while (placed < mineCount) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (newGrid[r][c].mine || safeSet.has(`${r},${c}`)) continue;
    newGrid[r][c].mine = true;
    placed++;
  }

  // compute adjacency
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (newGrid[r][c].mine) continue;
      let count = 0;
      for (const [nr, nc] of getNeighbors(r, c, rows, cols)) {
        if (newGrid[nr][nc].mine) count++;
      }
      newGrid[r][c].adjacent = count;
    }
  }
  return newGrid;
}

function revealCell(grid: Cell[][], r: number, c: number, rows: number, cols: number): Cell[][] {
  const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
  const stack: [number, number][] = [[r, c]];
  while (stack.length > 0) {
    const [cr, cc] = stack.pop()!;
    if (newGrid[cr][cc].revealed || newGrid[cr][cc].flagged) continue;
    newGrid[cr][cc].revealed = true;
    if (newGrid[cr][cc].adjacent === 0 && !newGrid[cr][cc].mine) {
      for (const [nr, nc] of getNeighbors(cr, cc, rows, cols)) {
        if (!newGrid[nr][nc].revealed && !newGrid[nr][nc].flagged) {
          stack.push([nr, nc]);
        }
      }
    }
  }
  return newGrid;
}

function checkWin(grid: Cell[][]): boolean {
  for (const row of grid) {
    for (const cell of row) {
      if (!cell.mine && !cell.revealed) return false;
    }
  }
  return true;
}

/* ── Component ─────────────────────────────────────────────── */
export default function MinesweeperPage() {
  const [diffIdx, setDiffIdx] = useState(0);
  const diff = DIFFICULTIES[diffIdx];

  const [grid, setGrid] = useState<Cell[][]>(() => createEmptyGrid(diff.rows, diff.cols));
  const [status, setStatus] = useState<GameStatus>("idle");
  const [time, setTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressFired = useRef(false);

  const flagCount = grid.flat().filter((c) => c.flagged).length;
  const mineDisplay = diff.mines - flagCount;

  // Timer
  useEffect(() => {
    if (status === "playing") {
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  const resetGame = useCallback(
    (idx?: number) => {
      const d = idx !== undefined ? DIFFICULTIES[idx] : diff;
      if (idx !== undefined) setDiffIdx(idx);
      setGrid(createEmptyGrid(d.rows, d.cols));
      setStatus("idle");
      setTime(0);
      if (timerRef.current) clearInterval(timerRef.current);
    },
    [diff]
  );

  const handleClick = useCallback(
    (r: number, c: number) => {
      if (status === "won" || status === "lost") return;
      const cell = grid[r][c];
      if (cell.flagged || cell.revealed) return;

      let currentGrid = grid;

      if (status === "idle") {
        // First click — place mines, start timer
        currentGrid = placeMines(currentGrid, diff.rows, diff.cols, diff.mines, r, c);
        setStatus("playing");
      }

      if (currentGrid[r][c].mine) {
        // Game over
        const lostGrid = currentGrid.map((row) =>
          row.map((cl) => ({
            ...cl,
            revealed: cl.mine ? true : cl.revealed,
          }))
        );
        lostGrid[r][c] = { ...lostGrid[r][c], revealed: true };
        setGrid(lostGrid);
        setStatus("lost");
        if (timerRef.current) clearInterval(timerRef.current);
        return;
      }

      const newGrid = revealCell(currentGrid, r, c, diff.rows, diff.cols);
      setGrid(newGrid);

      if (checkWin(newGrid)) {
        setStatus("won");
        if (timerRef.current) clearInterval(timerRef.current);
        // Auto-flag remaining mines
        setGrid(
          newGrid.map((row) =>
            row.map((cl) => (cl.mine && !cl.flagged ? { ...cl, flagged: true } : cl))
          )
        );
      }
    },
    [grid, status, diff]
  );

  const handleRightClick = useCallback(
    (e: React.MouseEvent, r: number, c: number) => {
      e.preventDefault();
      if (status === "won" || status === "lost" || status === "idle") return;
      const cell = grid[r][c];
      if (cell.revealed) return;
      setGrid((prev) => {
        const ng = prev.map((row) => row.map((cl) => ({ ...cl })));
        ng[r][c].flagged = !ng[r][c].flagged;
        return ng;
      });
    },
    [status, grid]
  );

  // Long press for mobile flagging
  const handleTouchStart = useCallback(
    (r: number, c: number) => {
      longPressFired.current = false;
      longPressRef.current = setTimeout(() => {
        longPressFired.current = true;
        if (status === "won" || status === "lost" || status === "idle") return;
        const cell = grid[r][c];
        if (cell.revealed) return;
        setGrid((prev) => {
          const ng = prev.map((row) => row.map((cl) => ({ ...cl })));
          ng[r][c].flagged = !ng[r][c].flagged;
          return ng;
        });
      }, 400);
    },
    [status, grid]
  );

  const handleTouchEnd = useCallback(() => {
    if (longPressRef.current) clearTimeout(longPressRef.current);
  }, []);

  const smiley = status === "lost" ? "😵" : status === "won" ? "😎" : "😊";

  const cellSize = diffIdx === 2 ? "min-w-[28px] min-h-[28px]" : "min-w-[32px] min-h-[32px] sm:min-w-[36px] sm:min-h-[36px]";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-1">💣 지뢰찾기</h1>
      <p className="text-center text-gray-500 mb-6">클래식 지뢰찾기를 온라인으로 즐기세요!</p>

      {/* Difficulty selector */}
      <div className="flex justify-center gap-2 mb-4">
        {DIFFICULTIES.map((d, i) => (
          <button
            key={d.label}
            onClick={() => resetGame(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              diffIdx === i
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {d.label} ({d.rows}×{d.cols})
          </button>
        ))}
      </div>

      {/* Control bar */}
      <div className="flex items-center justify-center gap-4 mb-4">
        {/* Mine counter */}
        <div className="bg-black text-red-500 font-mono text-xl px-3 py-1 rounded min-w-[60px] text-center select-none">
          {String(mineDisplay).padStart(3, "0")}
        </div>

        {/* Smiley restart */}
        <button
          onClick={() => resetGame()}
          className="text-2xl w-10 h-10 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300 active:bg-gray-400 transition-colors"
          title="새 게임"
        >
          {smiley}
        </button>

        {/* Timer */}
        <div className="bg-black text-red-500 font-mono text-xl px-3 py-1 rounded min-w-[60px] text-center select-none">
          {String(Math.min(time, 999)).padStart(3, "0")}
        </div>
      </div>

      {/* Game grid */}
      <div className={`flex justify-center mb-6 ${diffIdx === 2 ? "overflow-x-auto" : ""}`}>
        <div
          className="inline-grid border-2 border-gray-400 bg-gray-300"
          style={{
            gridTemplateColumns: `repeat(${diff.cols}, minmax(0, 1fr))`,
            gap: "1px",
          }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              let content: React.ReactNode = null;
              let bgClass = "bg-gray-200 hover:bg-gray-300 cursor-pointer";
              let textStyle: React.CSSProperties = {};
              let borderStyle =
                "border-t-2 border-l-2 border-t-white border-l-white border-b-2 border-r-2 border-b-gray-400 border-r-gray-400";

              if (cell.revealed) {
                bgClass = "bg-white";
                borderStyle = "border border-gray-300";
                if (cell.mine) {
                  content = "💣";
                  if (status === "lost") bgClass = "bg-red-200";
                } else if (cell.adjacent > 0) {
                  content = cell.adjacent;
                  textStyle = { color: NUMBER_COLORS[cell.adjacent], fontWeight: 700 };
                }
              } else if (cell.flagged) {
                content = "🚩";
                // If game lost and flag was wrong
                if (status === "lost" && !cell.mine) {
                  content = (
                    <span className="relative">
                      🚩
                      <span className="absolute inset-0 flex items-center justify-center text-red-600 font-bold text-lg">
                        ✕
                      </span>
                    </span>
                  );
                }
              }

              return (
                <button
                  key={`${r}-${c}`}
                  className={`${cellSize} ${bgClass} ${borderStyle} flex items-center justify-center text-sm sm:text-base select-none leading-none`}
                  style={textStyle}
                  onClick={() => {
                    if (longPressFired.current) return;
                    handleClick(r, c);
                  }}
                  onContextMenu={(e) => handleRightClick(e, r, c)}
                  onTouchStart={() => handleTouchStart(r, c)}
                  onTouchEnd={handleTouchEnd}
                  onTouchMove={handleTouchEnd}
                  aria-label={`Cell ${r},${c}`}
                >
                  {content}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Game result message */}
      {status === "won" && (
        <div className="text-center mb-6">
          <p className="text-xl font-bold text-green-600">🎉 축하합니다! 클리어!</p>
          <p className="text-gray-500 mt-1">시간: {time}초</p>
        </div>
      )}
      {status === "lost" && (
        <div className="text-center mb-6">
          <p className="text-xl font-bold text-red-600">💥 지뢰를 밟았습니다!</p>
          <p className="text-gray-500 mt-1">다시 도전해보세요!</p>
        </div>
      )}

      {/* SEO Content */}
      <section className="mt-10 pt-8 border-t border-gray-200 prose prose-gray max-w-none">
        <h2 className="text-xl font-bold text-gray-800 mb-4">🎮 지뢰찾기란?</h2>
        <p className="text-gray-600 mb-4">
          지뢰찾기(Minesweeper)는 1990년 Windows 3.1에 처음 탑재된 이후 전 세계적으로 사랑받는
          클래식 퍼즐 게임입니다. 숨겨진 지뢰를 피하면서 안전한 칸을 모두 열어야 합니다.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mb-2">📋 게임 규칙</h3>
        <ul className="text-gray-600 mb-4 list-disc list-inside space-y-1">
          <li>칸을 클릭하면 해당 칸이 열립니다.</li>
          <li>숫자는 주변 8칸에 있는 지뢰의 개수를 나타냅니다.</li>
          <li>빈 칸(숫자 0)을 열면 주변 빈 칸이 자동으로 열립니다.</li>
          <li>지뢰가 있다고 생각되는 칸에 우클릭(모바일: 길게 누르기)으로 깃발을 세웁니다.</li>
          <li>지뢰가 아닌 모든 칸을 열면 승리합니다.</li>
          <li>첫 번째 클릭은 항상 안전합니다.</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mb-2">💡 공략 팁</h3>
        <ul className="text-gray-600 mb-4 list-disc list-inside space-y-1">
          <li>
            <strong>1-1 패턴:</strong> 숫자 1이 나란히 있으면 지뢰는 한쪽 끝에 있습니다.
          </li>
          <li>
            <strong>1-2 패턴:</strong> 숫자 1 옆에 2가 있으면 2 바깥쪽에 지뢰가 있을 확률이 높습니다.
          </li>
          <li>
            <strong>모서리 활용:</strong> 모서리와 가장자리 칸은 주변 칸이 적어 추론이 쉽습니다.
          </li>
          <li>
            <strong>깃발 활용:</strong> 확실한 지뢰 위치에 깃발을 세워 실수를 방지하세요.
          </li>
          <li>
            <strong>소거법:</strong> 이미 찾은 지뢰를 빼고 남은 숫자로 추론합니다.
          </li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mb-2">📊 난이도별 정보</h3>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full text-sm text-gray-600">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-2 pr-4 font-semibold">난이도</th>
                <th className="text-left py-2 pr-4 font-semibold">크기</th>
                <th className="text-left py-2 pr-4 font-semibold">지뢰 수</th>
                <th className="text-left py-2 font-semibold">지뢰 비율</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-2 pr-4">초급</td>
                <td className="py-2 pr-4">9 × 9</td>
                <td className="py-2 pr-4">10개</td>
                <td className="py-2">12.3%</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 pr-4">중급</td>
                <td className="py-2 pr-4">16 × 16</td>
                <td className="py-2 pr-4">40개</td>
                <td className="py-2">15.6%</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">고급</td>
                <td className="py-2 pr-4">16 × 30</td>
                <td className="py-2 pr-4">99개</td>
                <td className="py-2">20.6%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-2">📱 모바일 조작법</h3>
        <p className="text-gray-600 mb-4">
          모바일에서는 칸을 <strong>탭</strong>하면 열리고, <strong>길게 누르면</strong> 깃발이
          세워집니다. 고급 모드에서는 좌우 스크롤로 전체 맵을 확인할 수 있습니다.
        </p>
      </section>

      <RelatedTools current="minesweeper" />
    </div>
  );
}
