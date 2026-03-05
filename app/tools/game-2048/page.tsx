"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import RelatedTools from "@/components/RelatedTools";

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

function initGrid(): Grid {
  let grid = createEmptyGrid();
  grid = addRandomTile(grid);
  grid = addRandomTile(grid);
  return grid;
}

export default function Game2048() {
  const [grid, setGrid] = useState<Grid>(() => initGrid());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [keepPlaying, setKeepPlaying] = useState(false);
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
      if (gameOver) return;
      if (won && !keepPlaying) return;

      const result = move(grid, direction);
      if (!result.moved) return;

      const newGrid = addRandomTile(result.grid);
      const newScore = score + result.score;

      setGrid(newGrid);
      setScore(newScore);
      updateBestScore(newScore);

      if (!keepPlaying && hasWon(newGrid)) {
        setWon(true);
        return;
      }

      if (!canMove(newGrid)) {
        setGameOver(true);
      }
    },
    [grid, score, gameOver, won, keepPlaying, updateBestScore]
  );

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
    setGrid(initGrid());
    setScore(0);
    setGameOver(false);
    setWon(false);
    setKeepPlaying(false);
  };

  const handleKeepPlaying = () => {
    setWon(false);
    setKeepPlaying(true);
  };

  return (
    <div className="py-4">
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
        <div className="bg-gray-400 rounded-xl p-3 sm:p-4 inline-block w-full max-w-[400px]">
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {grid.flat().map((value, i) => (
              <div
                key={i}
                className={`aspect-square flex items-center justify-center rounded-lg font-bold transition-all duration-100 ${getTileColor(
                  value
                )} ${getTileFontSize(value)}`}
              >
                {value > 0 ? value : ""}
              </div>
            ))}
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
