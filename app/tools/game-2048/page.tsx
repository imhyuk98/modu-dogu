"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import RelatedTools from "@/components/RelatedTools";

// ── Pure game logic (unchanged) ──────────────────────────────────────────────

type Grid = number[][];

function createEmptyGrid(): Grid {
  return Array.from({ length: 4 }, () => Array(4).fill(0));
}

function addRandomTile(grid: Grid): Grid {
  const newGrid = grid.map((row) => [...row]);
  const empty: [number, number][] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (newGrid[r][c] === 0) empty.push([r, c]);
    }
  }
  if (empty.length === 0) return newGrid;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
  return newGrid;
}

function rotateGrid(grid: Grid): Grid {
  const n = 4;
  const rotated = createEmptyGrid();
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      rotated[c][n - 1 - r] = grid[r][c];
    }
  }
  return rotated;
}

function slideLeft(grid: Grid): { grid: Grid; score: number; moved: boolean } {
  let score = 0;
  let moved = false;
  const newGrid = createEmptyGrid();

  for (let r = 0; r < 4; r++) {
    const row = grid[r].filter((v) => v !== 0);
    const merged: number[] = [];
    let i = 0;
    while (i < row.length) {
      if (i + 1 < row.length && row[i] === row[i + 1]) {
        const val = row[i] * 2;
        merged.push(val);
        score += val;
        i += 2;
      } else {
        merged.push(row[i]);
        i++;
      }
    }
    for (let c = 0; c < 4; c++) {
      newGrid[r][c] = merged[c] || 0;
      if (newGrid[r][c] !== grid[r][c]) moved = true;
    }
  }

  return { grid: newGrid, score, moved };
}

function move(grid: Grid, direction: "left" | "right" | "up" | "down"): { grid: Grid; score: number; moved: boolean } {
  let rotated = grid;
  const rotations = { left: 0, down: 1, right: 2, up: 3 };
  const times = rotations[direction];

  for (let i = 0; i < times; i++) rotated = rotateGrid(rotated);

  const result = slideLeft(rotated);

  let final = result.grid;
  for (let i = 0; i < (4 - times) % 4; i++) final = rotateGrid(final);

  return { grid: final, score: result.score, moved: result.moved };
}

function canMove(grid: Grid): boolean {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) return true;
      if (c < 3 && grid[r][c] === grid[r][c + 1]) return true;
      if (r < 3 && grid[r][c] === grid[r + 1][c]) return true;
    }
  }
  return false;
}

function hasWon(grid: Grid): boolean {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 2048) return true;
    }
  }
  return false;
}

function getTileColor(value: number): string {
  const colors: Record<number, string> = {
    0: "bg-gray-200",
    2: "bg-[#eee4da] text-gray-700",
    4: "bg-[#ede0c8] text-gray-700",
    8: "bg-[#f2b179] text-white",
    16: "bg-[#f59563] text-white",
    32: "bg-[#f67c5f] text-white",
    64: "bg-[#f65e3b] text-white",
    128: "bg-[#edcf72] text-white",
    256: "bg-[#edcc61] text-white",
    512: "bg-[#edc850] text-white",
    1024: "bg-[#edc53f] text-white",
    2048: "bg-[#edc22e] text-white",
  };
  return colors[value] || "bg-[#3c3a32] text-white";
}

function getTileFontSize(value: number): string {
  if (value < 100) return "text-3xl sm:text-4xl";
  if (value < 1000) return "text-2xl sm:text-3xl";
  if (value < 10000) return "text-xl sm:text-2xl";
  return "text-lg sm:text-xl";
}

// ── Tile animation types & helpers ───────────────────────────────────────────

interface Tile {
  id: number;
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  isMerged?: boolean;
}

/**
 * Detailed slide-left that tracks per-tile movements.
 * Operates on tiles whose coords have already been rotated so
 * the desired direction maps to "left".
 */
function slideLeftDetailed(
  tiles: Tile[]
): { movedTiles: Tile[]; score: number; moved: boolean } {
  const movedTiles: Tile[] = [];
  let score = 0;
  let moved = false;

  for (let r = 0; r < 4; r++) {
    const rowTiles = tiles
      .filter((t) => t.row === r)
      .sort((a, b) => a.col - b.col);

    let writeCol = 0;
    let i = 0;
    while (i < rowTiles.length) {
      const current = rowTiles[i];
      if (i + 1 < rowTiles.length && current.value === rowTiles[i + 1].value) {
        const next = rowTiles[i + 1];
        const mergedValue = current.value * 2;
        score += mergedValue;
        // Both tiles slide to writeCol (CSS transition animates them)
        movedTiles.push({ ...current, col: writeCol });
        movedTiles.push({ ...next, col: writeCol });
        i += 2;
      } else {
        movedTiles.push({ ...current, col: writeCol });
        i++;
      }
      writeCol++;
    }
  }

  // Detect whether anything actually moved
  for (const mt of movedTiles) {
    const orig = tiles.find((t) => t.id === mt.id);
    if (orig && (orig.row !== mt.row || orig.col !== mt.col)) {
      moved = true;
      break;
    }
  }
  // Merges also count as a move
  const posCount = new Map<string, number>();
  for (const t of movedTiles) {
    const k = `${t.row},${t.col}`;
    posCount.set(k, (posCount.get(k) || 0) + 1);
  }
  for (const count of posCount.values()) {
    if (count > 1) { moved = true; break; }
  }

  return { movedTiles, score, moved };
}

/**
 * Perform a directional move on tile objects by rotating coordinates,
 * sliding left, and rotating back.
 */
function moveTiles(
  tiles: Tile[],
  direction: "left" | "right" | "up" | "down"
): { movedTiles: Tile[]; score: number; moved: boolean } {
  const rotations: Record<string, number> = { left: 0, down: 1, right: 2, up: 3 };
  const times = rotations[direction];

  const rotateCoordsForward = (t: Tile, n: number): Tile => {
    let { row, col } = t;
    for (let i = 0; i < n; i++) {
      const newRow = col;
      const newCol = 3 - row;
      row = newRow;
      col = newCol;
    }
    return { ...t, row, col };
  };

  const rotateCoordsBack = (t: Tile, n: number): Tile => {
    return rotateCoordsForward(t, (4 - n) % 4);
  };

  const rotatedTiles = tiles.map((t) => rotateCoordsForward(t, times));
  const result = slideLeftDetailed(rotatedTiles);

  return {
    movedTiles: result.movedTiles.map((t) => rotateCoordsBack(t, times)),
    score: result.score,
    moved: result.moved,
  };
}

/** Convert a Grid to Tile[], assigning fresh ids */
function gridToTiles(grid: Grid, idCounter: { current: number }): Tile[] {
  const tiles: Tile[] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] !== 0) {
        tiles.push({ id: idCounter.current++, value: grid[r][c], row: r, col: c, isNew: true });
      }
    }
  }
  return tiles;
}

/** Convert Tile[] back to Grid (for canMove / hasWon checks) */
function tilesToGrid(tiles: Tile[]): Grid {
  const grid = createEmptyGrid();
  for (const t of tiles) {
    grid[t.row][t.col] = t.value;
  }
  return grid;
}

/** Find a random empty cell and add a new tile */
function addRandomTileToList(tiles: Tile[], idCounter: { current: number }): Tile[] {
  const occupied = new Set<string>();
  for (const t of tiles) occupied.add(`${t.row},${t.col}`);

  const empty: [number, number][] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (!occupied.has(`${r},${c}`)) empty.push([r, c]);
    }
  }
  if (empty.length === 0) return tiles;

  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const value = Math.random() < 0.9 ? 2 : 4;

  return [...tiles, { id: idCounter.current++, value, row: r, col: c, isNew: true }];
}

// ── Constants ────────────────────────────────────────────────────────────────

const ANIM_DURATION = 150;
const NEW_TILE_DELAY = 100;

// ── CSS for the board ────────────────────────────────────────────────────────
// Uses a CSS custom property --g (gap) so that both the background grid
// and the absolutely-positioned tiles share the exact same spacing.
// Tile position formula: translate(col * (100% + --g) / 4, row * (100% + --g) / 4)
// Tile size formula: (100% - 3 * --g) / 4

const boardCSS = `
.board-2048 {
  --g: 8px;
  --p: 10px;
  position: relative;
  width: 100%;
  max-width: 400px;
  background: #9ca3af;
  border-radius: 12px;
  padding: var(--p);
}
@media (min-width: 640px) {
  .board-2048 { --g: 10px; --p: 12px; }
}
.board-2048-bg {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--g);
}
.board-2048-cell {
  aspect-ratio: 1;
  background: #e5e7eb;
  border-radius: 8px;
}
.board-2048-tiles {
  position: absolute;
  inset: var(--p);
}
.tile-2048 {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 700;
  width:  calc((100% - 3 * var(--g)) / 4);
  height: calc((100% - 3 * var(--g)) / 4);
  transition: transform ${ANIM_DURATION}ms ease-in-out;
}
.tile-2048-new {
  animation: t2048pop ${NEW_TILE_DELAY}ms ease-out;
}
.tile-2048-merged {
  animation: t2048merge 150ms ease-out;
}
@keyframes t2048pop {
  0%   { opacity: 0; transform: var(--tx) scale(0); }
  100% { opacity: 1; transform: var(--tx) scale(1); }
}
@keyframes t2048merge {
  0%   { transform: var(--tx) scale(1); }
  50%  { transform: var(--tx) scale(1.15); }
  100% { transform: var(--tx) scale(1); }
}
`;

// ── Component ────────────────────────────────────────────────────────────────

export default function Game2048() {
  const idCounterRef = useRef(1);
  const [tiles, setTiles] = useState<Tile[]>(() => {
    const grid = addRandomTile(addRandomTile(createEmptyGrid()));
    return gridToTiles(grid, idCounterRef);
  });
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [keepPlaying, setKeepPlaying] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("best2048");
    if (stored) setBestScore(parseInt(stored, 10));
  }, []);

  const updateBestScore = useCallback(
    (newScore: number) => {
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem("best2048", String(newScore));
      }
    },
    [bestScore]
  );

  const handleMove = useCallback(
    (direction: "left" | "right" | "up" | "down") => {
      if (gameOver || isAnimating) return;
      if (won && !keepPlaying) return;

      const currentTiles = tiles.map((t) => ({ ...t, isNew: false, isMerged: false }));
      const result = moveTiles(currentTiles, direction);
      if (!result.moved) return;

      setIsAnimating(true);

      // Phase 1: Update tile positions -- CSS transition slides them over ANIM_DURATION ms.
      // Both tiles in a merge pair slide to the same cell; they overlap briefly.
      setTiles(result.movedTiles.map((t) => ({ ...t, isNew: false, isMerged: false })));

      // Phase 2: After the slide finishes, resolve merges and spawn a new tile.
      setTimeout(() => {
        const posMap = new Map<string, Tile[]>();
        for (const t of result.movedTiles) {
          const key = `${t.row},${t.col}`;
          if (!posMap.has(key)) posMap.set(key, []);
          posMap.get(key)!.push(t);
        }

        const survivors: Tile[] = [];
        for (const [, group] of posMap) {
          if (group.length === 2) {
            // Two tiles merged: replace with one tile of doubled value
            survivors.push({
              id: idCounterRef.current++,
              value: group[0].value * 2,
              row: group[0].row,
              col: group[0].col,
              isNew: false,
              isMerged: true,
            });
          } else {
            survivors.push({ ...group[0], isNew: false, isMerged: false });
          }
        }

        const withNew = addRandomTileToList(survivors, idCounterRef);
        const newScore = score + result.score;

        setTiles(withNew);
        setScore(newScore);
        updateBestScore(newScore);

        const grid = tilesToGrid(withNew);
        if (!keepPlaying && hasWon(grid)) {
          setWon(true);
          setIsAnimating(false);
          return;
        }
        if (!canMove(grid)) {
          setGameOver(true);
        }

        setTimeout(() => setIsAnimating(false), NEW_TILE_DELAY);
      }, ANIM_DURATION);
    },
    [tiles, score, gameOver, won, keepPlaying, isAnimating, updateBestScore]
  );

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const dirMap: Record<string, "left" | "right" | "up" | "down"> = {
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowUp: "up",
        ArrowDown: "down",
      };
      const dir = dirMap[e.key];
      if (dir) {
        e.preventDefault();
        handleMove(dir);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleMove]);

  // Touch / swipe controls
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStart.current.x;
      const dy = touch.clientY - touchStart.current.y;
      const minSwipe = 30;

      if (Math.abs(dx) < minSwipe && Math.abs(dy) < minSwipe) {
        touchStart.current = null;
        return;
      }

      let dir: "left" | "right" | "up" | "down";
      if (Math.abs(dx) > Math.abs(dy)) {
        dir = dx > 0 ? "right" : "left";
      } else {
        dir = dy > 0 ? "down" : "up";
      }
      handleMove(dir);
      touchStart.current = null;
    };

    board.addEventListener("touchstart", handleTouchStart, { passive: true });
    board.addEventListener("touchmove", handleTouchMove, { passive: false });
    board.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      board.removeEventListener("touchstart", handleTouchStart);
      board.removeEventListener("touchmove", handleTouchMove);
      board.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleMove]);

  const newGame = () => {
    idCounterRef.current = 1;
    const grid = addRandomTile(addRandomTile(createEmptyGrid()));
    setTiles(gridToTiles(grid, idCounterRef));
    setScore(0);
    setGameOver(false);
    setWon(false);
    setKeepPlaying(false);
    setIsAnimating(false);
  };

  const handleKeepPlaying = () => {
    setWon(false);
    setKeepPlaying(true);
  };

  return (
    <div className="py-4">
      <style>{boardCSS}</style>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {"\uD83C\uDFAE"} 2048 게임
      </h1>
      <p className="text-gray-500 mb-6">
        같은 숫자 타일을 합쳐 2048을 만드세요!
      </p>

      {/* Score & Controls */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex gap-3">
          <div className="bg-gray-700 text-white rounded-lg px-4 py-2 text-center min-w-[80px]">
            <div className="text-[10px] uppercase tracking-wider text-gray-300">
              점수
            </div>
            <div className="text-lg font-bold">{score.toLocaleString()}</div>
          </div>
          <div className="bg-gray-700 text-white rounded-lg px-4 py-2 text-center min-w-[80px]">
            <div className="text-[10px] uppercase tracking-wider text-gray-300">
              최고
            </div>
            <div className="text-lg font-bold">
              {bestScore.toLocaleString()}
            </div>
          </div>
        </div>
        <button
          onClick={newGame}
          className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          새 게임
        </button>
      </div>

      {/* Game Board */}
      <div className="relative" ref={boardRef}>
        <div className="board-2048">
          {/* Background: 4x4 empty gray cells */}
          <div className="board-2048-bg">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="board-2048-cell" />
            ))}
          </div>

          {/* Tile layer: absolutely positioned, animated tiles */}
          <div className="board-2048-tiles">
            {tiles.map((tile) => {
              // Position: col * (100% + gap) / 4, row * (100% + gap) / 4
              // Uses CSS var(--g) so it stays in sync with the background grid gap.
              const tx = `calc(${tile.col} * (100% + var(--g)) / 4)`;
              const ty = `calc(${tile.row} * (100% + var(--g)) / 4)`;
              const transform = `translate(${tx}, ${ty})`;

              const colorClass = getTileColor(tile.value);
              const fontClass = getTileFontSize(tile.value);
              let animClass = "";
              if (tile.isNew) animClass = "tile-2048-new";
              else if (tile.isMerged) animClass = "tile-2048-merged";

              return (
                <div
                  key={tile.id}
                  className={`tile-2048 ${colorClass} ${fontClass} ${animClass}`}
                  style={{
                    transform,
                    "--tx": transform,
                    zIndex: tile.isMerged ? 2 : 1,
                  } as React.CSSProperties}
                >
                  {tile.value}
                </div>
              );
            })}
          </div>
        </div>

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-white/70 rounded-xl flex flex-col items-center justify-center max-w-[400px]">
            <p className="text-2xl font-bold text-gray-800 mb-2">
              게임 오버!
            </p>
            <p className="text-gray-600 mb-4">
              최종 점수: {score.toLocaleString()}점
            </p>
            <button
              onClick={newGame}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              다시 시작
            </button>
          </div>
        )}

        {/* Win Overlay */}
        {won && !keepPlaying && (
          <div className="absolute inset-0 bg-yellow-400/70 rounded-xl flex flex-col items-center justify-center max-w-[400px]">
            <p className="text-3xl font-bold text-white mb-2">
              {"\uD83C\uDF89"} 축하합니다!
            </p>
            <p className="text-white text-lg mb-4">2048을 만들었습니다!</p>
            <div className="flex gap-3">
              <button
                onClick={handleKeepPlaying}
                className="px-5 py-2.5 bg-white text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                계속 하기
              </button>
              <button
                onClick={newGame}
                className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                새 게임
              </button>
            </div>
          </div>
        )}
      </div>

      {/* How to play */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg max-w-[400px]">
        <p className="text-sm text-gray-600">
          <strong>조작법:</strong> 방향키(PC) 또는 스와이프(모바일)로 타일을
          이동하세요. 같은 숫자의 타일이 만나면 합쳐집니다.
        </p>
      </div>

      {/* SEO Content */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            2048 게임이란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            2048은 이탈리아 개발자 가브리엘레 치룰리(Gabriele Cirulli)가 2014년에
            만든 인기 퍼즐 게임입니다. 4x4 격자판에서 숫자 타일을 상하좌우로
            이동하여 같은 숫자끼리 합치는 방식으로 진행됩니다. 최종 목표는 2048
            타일을 만드는 것이지만, 그 이후로도 계속 플레이하며 더 높은 점수를
            노릴 수 있습니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            게임 규칙
          </h2>
          <ul className="text-gray-600 leading-relaxed space-y-2 list-disc list-inside">
            <li>
              방향키 또는 스와이프로 모든 타일을 한 방향으로 이동시킵니다.
            </li>
            <li>
              같은 숫자의 두 타일이 충돌하면 하나로 합쳐지며 숫자가 두 배가
              됩니다.
            </li>
            <li>매 턴마다 빈 칸에 2 또는 4 타일이 무작위로 추가됩니다.</li>
            <li>
              더 이상 이동할 수 없으면 게임이 종료됩니다.
            </li>
            <li>2048 타일을 만들면 승리하며, 원하면 계속 플레이할 수 있습니다.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            2048 게임 공략 팁
          </h2>
          <ul className="text-gray-600 leading-relaxed space-y-2 list-disc list-inside">
            <li>
              <strong>코너 전략:</strong> 가장 큰 숫자를 한쪽 코너에 고정시키세요.
              보통 왼쪽 아래 또는 오른쪽 아래 코너가 좋습니다.
            </li>
            <li>
              <strong>방향 제한:</strong> 가능하면 두 방향(예: 아래, 왼쪽)만
              주로 사용하고, 나머지 방향은 최소한으로 사용하세요.
            </li>
            <li>
              <strong>큰 수 유지:</strong> 큰 숫자 타일은 가장자리에 유지하고,
              작은 숫자 타일은 안쪽에서 합치세요.
            </li>
            <li>
              <strong>연쇄 합치기:</strong> 한 번의 이동으로 여러 타일이 합쳐지도록
              배열하면 높은 점수를 얻을 수 있습니다.
            </li>
            <li>
              <strong>빈 칸 확보:</strong> 항상 빈 칸을 충분히 유지하세요.
              빈 칸이 없으면 게임이 빨리 끝납니다.
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
                2048을 만든 후에도 계속 할 수 있나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                네, 2048 타일을 만들면 승리 화면이 나타나지만 &quot;계속 하기&quot;
                버튼을 눌러 더 높은 점수를 목표로 계속 플레이할 수 있습니다.
                4096, 8192 등 더 큰 타일도 만들어 보세요.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                최고 점수는 저장되나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                네, 최고 점수는 브라우저의 로컬 스토리지에 자동으로 저장됩니다.
                같은 브라우저에서 다시 방문하면 이전 최고 점수를 확인할 수
                있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                모바일에서도 플레이할 수 있나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                네, 모바일 기기에서 화면을 스와이프하여 플레이할 수 있습니다.
                게임 영역에서 상하좌우로 손가락을 밀어 타일을 이동하세요.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                2048을 만드는 것이 가능한가요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                충분히 가능합니다! 코너 전략을 꾸준히 사용하면 대부분의 경우
                2048 타일을 만들 수 있습니다. 핵심은 가장 큰 타일을 코너에
                고정하고, 주로 두 방향만 사용하는 것입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="game-2048" />
    </div>
  );
}
