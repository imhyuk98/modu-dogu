"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import RelatedTools from "@/components/RelatedTools";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };
type GameState = "ready" | "playing" | "paused" | "gameover";

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;
const INITIAL_SPEED = 150;
const SPEED_DECREASE = 2;
const MIN_SPEED = 80;
const SCORE_PER_APPLE = 10;

function getInitialSnake(): Position[] {
  return [
    { x: 4, y: 10 },
    { x: 3, y: 10 },
    { x: 2, y: 10 },
  ];
}

function getRandomApple(snake: Position[]): Position {
  const occupied = new Set(snake.map((s) => `${s.x},${s.y}`));
  const empty: Position[] = [];
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      if (!occupied.has(`${x},${y}`)) {
        empty.push({ x, y });
      }
    }
  }
  return empty[Math.floor(Math.random() * empty.length)];
}

export default function SnakeGamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>("ready");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  const snakeRef = useRef<Position[]>(getInitialSnake());
  const directionRef = useRef<Direction>("RIGHT");
  const nextDirectionRef = useRef<Direction>("RIGHT");
  const appleRef = useRef<Position>(getRandomApple(getInitialSnake()));
  const speedRef = useRef(INITIAL_SPEED);
  const scoreRef = useRef(0);
  const gameStateRef = useRef<GameState>("ready");
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync gameState to ref
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // Load best score
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bestSnake");
      if (saved) setBestScore(parseInt(saved, 10));
    } catch {}
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Apple
    const apple = appleRef.current;
    ctx.fillStyle = "#EF4444";
    ctx.beginPath();
    ctx.arc(
      apple.x * CELL_SIZE + CELL_SIZE / 2,
      apple.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Snake
    const snake = snakeRef.current;
    snake.forEach((seg, i) => {
      const radius = 3;
      const x = seg.x * CELL_SIZE + 1;
      const y = seg.y * CELL_SIZE + 1;
      const w = CELL_SIZE - 2;
      const h = CELL_SIZE - 2;

      ctx.fillStyle = i === 0 ? "#22C55E" : "#4ADE80";
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, radius);
      ctx.fill();
    });

    // Eyes on head
    if (snake.length > 0) {
      const head = snake[0];
      const cx = head.x * CELL_SIZE + CELL_SIZE / 2;
      const cy = head.y * CELL_SIZE + CELL_SIZE / 2;
      ctx.fillStyle = "#fff";
      const dir = directionRef.current;
      let ex1: number, ey1: number, ex2: number, ey2: number;
      if (dir === "RIGHT") { ex1 = cx + 3; ey1 = cy - 3; ex2 = cx + 3; ey2 = cy + 3; }
      else if (dir === "LEFT") { ex1 = cx - 3; ey1 = cy - 3; ex2 = cx - 3; ey2 = cy + 3; }
      else if (dir === "UP") { ex1 = cx - 3; ey1 = cy - 3; ex2 = cx + 3; ey2 = cy - 3; }
      else { ex1 = cx - 3; ey1 = cy + 3; ex2 = cx + 3; ey2 = cy + 3; }
      ctx.beginPath();
      ctx.arc(ex1, ey1, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(ex2, ey2, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const gameOver = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setGameState("gameover");
    const s = scoreRef.current;
    try {
      const prev = parseInt(localStorage.getItem("bestSnake") || "0", 10);
      if (s > prev) {
        localStorage.setItem("bestSnake", String(s));
        setBestScore(s);
      }
    } catch {}
  }, []);

  const tick = useCallback(() => {
    if (gameStateRef.current !== "playing") return;

    directionRef.current = nextDirectionRef.current;
    const snake = [...snakeRef.current];
    const head = { ...snake[0] };
    const dir = directionRef.current;

    if (dir === "UP") head.y -= 1;
    else if (dir === "DOWN") head.y += 1;
    else if (dir === "LEFT") head.x -= 1;
    else if (dir === "RIGHT") head.x += 1;

    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      gameOver();
      return;
    }

    // Self collision
    if (snake.some((s) => s.x === head.x && s.y === head.y)) {
      gameOver();
      return;
    }

    snake.unshift(head);

    // Apple collision
    const apple = appleRef.current;
    if (head.x === apple.x && head.y === apple.y) {
      scoreRef.current += SCORE_PER_APPLE;
      setScore(scoreRef.current);
      appleRef.current = getRandomApple(snake);

      // Speed up
      speedRef.current = Math.max(MIN_SPEED, speedRef.current - SPEED_DECREASE);
      // Restart interval with new speed
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(tick, speedRef.current);
    } else {
      snake.pop();
    }

    snakeRef.current = snake;
    draw();
  }, [draw, gameOver]);

  const startGame = useCallback(() => {
    snakeRef.current = getInitialSnake();
    directionRef.current = "RIGHT";
    nextDirectionRef.current = "RIGHT";
    appleRef.current = getRandomApple(getInitialSnake());
    speedRef.current = INITIAL_SPEED;
    scoreRef.current = 0;
    setScore(0);
    setGameState("playing");

    draw();

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, speedRef.current);
  }, [draw, tick]);

  const togglePause = useCallback(() => {
    if (gameStateRef.current === "playing") {
      setGameState("paused");
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else if (gameStateRef.current === "paused") {
      setGameState("playing");
      intervalRef.current = setInterval(tick, speedRef.current);
    }
  }, [tick]);

  const changeDirection = useCallback((newDir: Direction) => {
    const cur = directionRef.current;
    if (
      (newDir === "UP" && cur === "DOWN") ||
      (newDir === "DOWN" && cur === "UP") ||
      (newDir === "LEFT" && cur === "RIGHT") ||
      (newDir === "RIGHT" && cur === "LEFT")
    )
      return;
    nextDirectionRef.current = newDir;
  }, []);

  // Keyboard handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (gameStateRef.current === "playing" || gameStateRef.current === "paused") {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
          e.preventDefault();
        }
      }

      if (e.key === " ") {
        e.preventDefault();
        if (gameStateRef.current === "playing" || gameStateRef.current === "paused") {
          togglePause();
        }
        return;
      }

      if (gameStateRef.current !== "playing") return;

      switch (e.key) {
        case "ArrowUp":
          changeDirection("UP");
          break;
        case "ArrowDown":
          changeDirection("DOWN");
          break;
        case "ArrowLeft":
          changeDirection("LEFT");
          break;
        case "ArrowRight":
          changeDirection("RIGHT");
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [changeDirection, togglePause]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Draw initial canvas on ready
  useEffect(() => {
    if (gameState === "ready") draw();
  }, [gameState, draw]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-900 mb-2 tracking-tight">
        🐍 스네이크 게임
      </h1>
      <p className="text-center text-gray-500 mb-6">
        사과를 먹고 뱀을 성장시키세요!
      </p>

      {/* Score */}
      <div className="flex justify-center gap-8 mb-4 text-lg font-semibold">
        <span className="text-gray-700">
          점수: <span className="text-green-600">{score}</span>
        </span>
        <span className="text-gray-700">
          최고: <span className="text-amber-600">{bestScore}</span>
        </span>
      </div>

      {/* Canvas container */}
      <div className="relative flex justify-center mb-4">
        <div className="relative border-2 border-gray-700 rounded-lg overflow-hidden shadow-lg">
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="block"
            style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
          />

          {/* Start overlay */}
          {gameState === "ready" && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-4">
              <p className="text-white text-lg font-medium">
                방향키로 뱀을 조종하세요
              </p>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white text-lg font-bold rounded-lg transition-colors"
              >
                게임 시작
              </button>
            </div>
          )}

          {/* Paused overlay */}
          {gameState === "paused" && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
              <p className="text-white text-2xl font-bold">일시정지</p>
              <p className="text-gray-300 text-sm">
                스페이스바를 눌러 계속하기
              </p>
            </div>
          )}

          {/* Game over overlay */}
          {gameState === "gameover" && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3">
              <p className="text-red-400 text-2xl font-bold">게임 오버</p>
              <p className="text-white text-lg">점수: {score}</p>
              <p className="text-amber-400 text-sm">최고 점수: {bestScore}</p>
              <button
                onClick={startGame}
                className="mt-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white text-lg font-bold rounded-lg transition-colors"
              >
                다시 하기
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Pause hint */}
      {gameState === "playing" && (
        <p className="text-center text-gray-400 text-sm mb-4">
          스페이스바: 일시정지
        </p>
      )}

      {/* Mobile D-pad */}
      <div className="flex justify-center mb-8">
        <div className="grid grid-cols-3 gap-1" style={{ width: 160, height: 160 }}>
          <div />
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              changeDirection("UP");
            }}
            onClick={() => changeDirection("UP")}
            className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white rounded-lg text-2xl select-none"
            style={{ minWidth: 48, minHeight: 48 }}
            aria-label="위"
          >
            ▲
          </button>
          <div />
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              changeDirection("LEFT");
            }}
            onClick={() => changeDirection("LEFT")}
            className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white rounded-lg text-2xl select-none"
            style={{ minWidth: 48, minHeight: 48 }}
            aria-label="왼쪽"
          >
            ◀
          </button>
          <div className="flex items-center justify-center bg-gray-800 rounded-lg">
            <span className="text-gray-500 text-xs">D-pad</span>
          </div>
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              changeDirection("RIGHT");
            }}
            onClick={() => changeDirection("RIGHT")}
            className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white rounded-lg text-2xl select-none"
            style={{ minWidth: 48, minHeight: 48 }}
            aria-label="오른쪽"
          >
            ▶
          </button>
          <div />
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              changeDirection("DOWN");
            }}
            onClick={() => changeDirection("DOWN")}
            className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white rounded-lg text-2xl select-none"
            style={{ minWidth: 48, minHeight: 48 }}
            aria-label="아래"
          >
            ▼
          </button>
          <div />
        </div>
      </div>

      {/* SEO Content */}
      <section className="mt-12 space-y-6 text-gray-700">
        <h2 className="text-2xl font-bold text-gray-900">
          스네이크 게임이란?
        </h2>
        <p>
          스네이크 게임은 1976년 아케이드 게임 &quot;Blockade&quot;에서
          시작된 클래식 게임입니다. 1990년대 노키아 휴대폰에 탑재되면서
          전 세계적으로 유명해졌습니다. 플레이어는 뱀을 조종하여 먹이를
          먹으며, 뱀의 몸이 점점 길어지는 단순하면서도 중독성 있는
          게임입니다.
        </p>

        <h2 className="text-2xl font-bold text-gray-900">게임 규칙</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>방향키(PC) 또는 화면의 방향 버튼(모바일)으로 뱀을 조종합니다.</li>
          <li>빨간 사과를 먹으면 점수가 10점 올라가고, 뱀의 길이가 1칸 늘어납니다.</li>
          <li>사과를 먹을수록 뱀의 이동 속도가 점점 빨라집니다.</li>
          <li>벽이나 자신의 몸에 부딪히면 게임이 종료됩니다.</li>
          <li>스페이스바를 눌러 게임을 일시정지할 수 있습니다.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900">공략 팁</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>벽 근처를 피하세요:</strong> 가장자리에서는 회전할 공간이
            줄어들어 위험합니다. 가능하면 중앙 영역에서 플레이하세요.
          </li>
          <li>
            <strong>계획적으로 이동하세요:</strong> 사과를 향해 직진하기보다
            경로를 미리 생각하고 안전한 루트를 확보하세요.
          </li>
          <li>
            <strong>자신의 꼬리를 따라가세요:</strong> 뱀이 길어지면 자신의
            꼬리를 따라가는 패턴이 안전합니다.
          </li>
          <li>
            <strong>속도에 적응하세요:</strong> 점수가 올라갈수록 속도가
            빨라지므로, 미리 방향을 입력하는 습관을 들이세요.
          </li>
          <li>
            <strong>지그재그 패턴:</strong> 넓은 영역을 체계적으로 훑는
            지그재그 패턴은 긴 뱀을 관리하는 데 효과적입니다.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900">조작 방법</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-left">입력</th>
                <th className="border border-gray-300 px-4 py-2 text-left">동작</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">↑ / ▲ 버튼</td>
                <td className="border border-gray-300 px-4 py-2">위로 이동</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">↓ / ▼ 버튼</td>
                <td className="border border-gray-300 px-4 py-2">아래로 이동</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">← / ◀ 버튼</td>
                <td className="border border-gray-300 px-4 py-2">왼쪽으로 이동</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">→ / ▶ 버튼</td>
                <td className="border border-gray-300 px-4 py-2">오른쪽으로 이동</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">스페이스바</td>
                <td className="border border-gray-300 px-4 py-2">일시정지 / 재개</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <RelatedTools current="snake-game" />
    </div>
  );
}
