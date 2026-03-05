"use client";

import { useState, useCallback, useRef } from "react";
import RelatedTools from "@/components/RelatedTools";

const BOARD_SIZE = 15;

type Stone = 0 | 1 | 2; // 0=empty, 1=black, 2=white
type Board = Stone[][];
type Mode = "2p" | "ai";

const STAR_POINTS = [
  [3, 3], [3, 7], [3, 11],
  [7, 3], [7, 7], [7, 11],
  [11, 3], [11, 7], [11, 11],
];

const DIRECTIONS = [
  [0, 1], [1, 0], [1, 1], [1, -1],
];

function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
}

function inBounds(r: number, c: number) {
  return r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE;
}

function checkWin(board: Board, row: number, col: number, stone: Stone): [number, number][] | null {
  for (const [dr, dc] of DIRECTIONS) {
    const line: [number, number][] = [[row, col]];
    for (let i = 1; i < 5; i++) {
      const r = row + dr * i, c = col + dc * i;
      if (inBounds(r, c) && board[r][c] === stone) line.push([r, c]);
      else break;
    }
    for (let i = 1; i < 5; i++) {
      const r = row - dr * i, c = col - dc * i;
      if (inBounds(r, c) && board[r][c] === stone) line.push([r, c]);
      else break;
    }
    if (line.length >= 5) return line;
  }
  return null;
}

function findWinningLine(board: Board): { stone: Stone; line: [number, number][] } | null {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] !== 0) {
        const line = checkWin(board, r, c, board[r][c]);
        if (line) return { stone: board[r][c], line };
      }
    }
  }
  return null;
}

// AI scoring heuristic
function evaluatePosition(board: Board, row: number, col: number, aiStone: Stone): number {
  const playerStone: Stone = aiStone === 1 ? 2 : 1;
  let score = 0;

  // Slight center preference
  const centerDist = Math.abs(row - 7) + Math.abs(col - 7);
  score += Math.max(0, 14 - centerDist);

  for (const stone of [aiStone, playerStone]) {
    const multiplier = stone === aiStone ? 1 : 1.1; // slightly prioritize blocking

    for (const [dr, dc] of DIRECTIONS) {
      let count = 1;
      let openEnds = 0;
      let blockedByEdge = false;

      // Forward
      let blocked = false;
      for (let i = 1; i <= 4; i++) {
        const r = row + dr * i, c = col + dc * i;
        if (!inBounds(r, c)) { blockedByEdge = true; blocked = true; break; }
        if (board[r][c] === stone) count++;
        else if (board[r][c] === 0) { openEnds++; break; }
        else { blocked = true; break; }
      }
      if (!blocked && !blockedByEdge) { /* openEnds already incremented */ }

      // Backward
      blocked = false;
      for (let i = 1; i <= 4; i++) {
        const r = row - dr * i, c = col - dc * i;
        if (!inBounds(r, c)) { blockedByEdge = true; blocked = true; break; }
        if (board[r][c] === stone) count++;
        else if (board[r][c] === 0) { openEnds++; break; }
        else { blocked = true; break; }
      }

      // Score based on pattern
      if (count >= 5) score += 1000000 * multiplier;
      else if (count === 4) {
        if (openEnds >= 2) score += 50000 * multiplier;
        else if (openEnds === 1) score += 5000 * multiplier;
      } else if (count === 3) {
        if (openEnds >= 2) score += 3000 * multiplier;
        else if (openEnds === 1) score += 300 * multiplier;
      } else if (count === 2) {
        if (openEnds >= 2) score += 100 * multiplier;
        else if (openEnds === 1) score += 10 * multiplier;
      }
    }
  }

  return score;
}

function getAIMove(board: Board): [number, number] | null {
  const aiStone: Stone = 2; // white
  let bestScore = -1;
  let bestMoves: [number, number][] = [];

  // Only consider positions near existing stones
  const candidates = new Set<string>();
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] !== 0) {
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const nr = r + dr, nc = c + dc;
            if (inBounds(nr, nc) && board[nr][nc] === 0) {
              candidates.add(`${nr},${nc}`);
            }
          }
        }
      }
    }
  }

  if (candidates.size === 0) {
    // First move: play near center
    return [7, 7];
  }

  for (const key of candidates) {
    const [r, c] = key.split(",").map(Number);
    const score = evaluatePosition(board, r, c, aiStone);
    if (score > bestScore) {
      bestScore = score;
      bestMoves = [[r, c]];
    } else if (score === bestScore) {
      bestMoves.push([r, c]);
    }
  }

  return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

export default function OmokPage() {
  const [board, setBoard] = useState<Board>(createEmptyBoard);
  const [history, setHistory] = useState<{ board: Board; lastMove: [number, number] | null }[]>([]);
  const [currentTurn, setCurrentTurn] = useState<Stone>(1); // 1=black first
  const [lastMove, setLastMove] = useState<[number, number] | null>(null);
  const [winResult, setWinResult] = useState<{ stone: Stone; line: [number, number][] } | null>(null);
  const [mode, setMode] = useState<Mode>("2p");
  const [gameStarted, setGameStarted] = useState(false);
  const aiThinking = useRef(false);

  const isWinCell = useCallback(
    (r: number, c: number) => {
      if (!winResult) return false;
      return winResult.line.some(([wr, wc]) => wr === r && wc === c);
    },
    [winResult]
  );

  const placeStone = useCallback(
    (row: number, col: number) => {
      if (board[row][col] !== 0 || winResult || aiThinking.current) return;

      const newBoard = board.map((r) => [...r]) as Board;
      newBoard[row][col] = currentTurn;

      // Save state for undo
      setHistory((prev) => [...prev, { board: board.map((r) => [...r]) as Board, lastMove }]);

      setBoard(newBoard);
      setLastMove([row, col]);

      const win = checkWin(newBoard, row, col, currentTurn);
      if (win) {
        setWinResult({ stone: currentTurn, line: win });
        return;
      }

      // Check draw
      const hasEmpty = newBoard.some((r) => r.some((c) => c === 0));
      if (!hasEmpty) return;

      const nextTurn: Stone = currentTurn === 1 ? 2 : 1;
      setCurrentTurn(nextTurn);

      // AI move
      if (mode === "ai" && nextTurn === 2) {
        aiThinking.current = true;
        setTimeout(() => {
          const aiMove = getAIMove(newBoard);
          if (aiMove) {
            const aiBoard = newBoard.map((r) => [...r]) as Board;
            aiBoard[aiMove[0]][aiMove[1]] = 2;

            setHistory((prev) => [...prev, { board: newBoard.map((r) => [...r]) as Board, lastMove: [row, col] }]);
            setBoard(aiBoard);
            setLastMove(aiMove);

            const aiWin = checkWin(aiBoard, aiMove[0], aiMove[1], 2);
            if (aiWin) {
              setWinResult({ stone: 2, line: aiWin });
            } else {
              setCurrentTurn(1);
            }
          }
          aiThinking.current = false;
        }, 150);
      }
    },
    [board, currentTurn, winResult, lastMove, mode]
  );

  const handleUndo = () => {
    if (history.length === 0 || winResult) return;

    if (mode === "ai" && history.length >= 2) {
      // Undo both AI and player move
      const prevState = history[history.length - 2];
      setBoard(prevState.board);
      setLastMove(prevState.lastMove);
      setHistory((prev) => prev.slice(0, -2));
      setCurrentTurn(1);
    } else {
      const prevState = history[history.length - 1];
      setBoard(prevState.board);
      setLastMove(prevState.lastMove);
      setHistory((prev) => prev.slice(0, -1));
      setCurrentTurn(currentTurn === 1 ? 2 : 1);
    }
  };

  const startNewGame = (newMode: Mode) => {
    setBoard(createEmptyBoard());
    setHistory([]);
    setCurrentTurn(1);
    setLastMove(null);
    setWinResult(null);
    setMode(newMode);
    setGameStarted(true);
    aiThinking.current = false;
  };

  const moveCount = history.length + (board.some((r) => r.some((c) => c !== 0)) ? 1 : 0);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">
        <span role="img" aria-label="black circle">&#x26AB;</span> 오목
      </h1>
      <p className="text-gray-500 text-center mb-6">
        가로, 세로, 대각선으로 5개를 먼저 놓으면 승리!
      </p>

      {/* Mode Selection / Controls */}
      {!gameStarted ? (
        <div className="flex flex-col items-center gap-4 mb-8">
          <p className="text-gray-700 font-medium">게임 모드를 선택하세요</p>
          <div className="flex gap-3">
            <button
              onClick={() => startNewGame("2p")}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              2인 대전
            </button>
            <button
              onClick={() => startNewGame("ai")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors"
            >
              AI 대전
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Status Bar */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              {winResult ? (
                <span className="text-lg font-bold text-green-600">
                  {winResult.stone === 1 ? "흑" : "백"} 승리!
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                  <span
                    className="inline-block w-4 h-4 rounded-full border"
                    style={{
                      background: currentTurn === 1
                        ? "radial-gradient(circle at 35% 35%, #555, #000)"
                        : "radial-gradient(circle at 35% 35%, #fff, #ddd)",
                      borderColor: currentTurn === 1 ? "#000" : "#aaa",
                    }}
                  />
                  {currentTurn === 1 ? "흑" : "백"}의 차례
                  {mode === "ai" && currentTurn === 2 && " (AI 생각중...)"}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleUndo}
                disabled={history.length === 0 || !!winResult}
                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                무르기
              </button>
              <button
                onClick={() => {
                  setGameStarted(false);
                  setBoard(createEmptyBoard());
                  setHistory([]);
                  setCurrentTurn(1);
                  setLastMove(null);
                  setWinResult(null);
                  aiThinking.current = false;
                }}
                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                새 게임
              </button>
            </div>
          </div>

          {/* Board */}
          <div className="flex justify-center mb-6">
            <div
              className="relative"
              style={{
                width: "min(100%, 560px)",
                aspectRatio: "1 / 1",
                background: "#dcb35c",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                padding: "3.33%",
              }}
            >
              {/* Grid Lines */}
              <svg
                viewBox={`0 0 ${BOARD_SIZE - 1} ${BOARD_SIZE - 1}`}
                className="absolute"
                style={{
                  left: "3.33%",
                  top: "3.33%",
                  width: "93.34%",
                  height: "93.34%",
                }}
                preserveAspectRatio="none"
              >
                {/* Horizontal lines */}
                {Array.from({ length: BOARD_SIZE }, (_, i) => (
                  <line
                    key={`h${i}`}
                    x1={0}
                    y1={i}
                    x2={BOARD_SIZE - 1}
                    y2={i}
                    stroke="#333"
                    strokeWidth="0.06"
                  />
                ))}
                {/* Vertical lines */}
                {Array.from({ length: BOARD_SIZE }, (_, i) => (
                  <line
                    key={`v${i}`}
                    x1={i}
                    y1={0}
                    x2={i}
                    y2={BOARD_SIZE - 1}
                    stroke="#333"
                    strokeWidth="0.06"
                  />
                ))}
                {/* Star points */}
                {STAR_POINTS.map(([r, c]) => (
                  <circle
                    key={`star${r}${c}`}
                    cx={c}
                    cy={r}
                    r={0.15}
                    fill="#333"
                  />
                ))}
              </svg>

              {/* Clickable intersections & stones */}
              <div
                className="relative w-full h-full"
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
                  gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
                }}
              >
                {Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, idx) => {
                  const r = Math.floor(idx / BOARD_SIZE);
                  const c = idx % BOARD_SIZE;
                  const stone = board[r][c];
                  const isLast = lastMove && lastMove[0] === r && lastMove[1] === c;
                  const isWin = isWinCell(r, c);

                  return (
                    <button
                      key={idx}
                      onClick={() => placeStone(r, c)}
                      className="relative flex items-center justify-center"
                      style={{
                        cursor: stone === 0 && !winResult ? "pointer" : "default",
                        zIndex: stone !== 0 ? 2 : 1,
                      }}
                      aria-label={`${r + 1}행 ${c + 1}열${stone === 1 ? " 흑돌" : stone === 2 ? " 백돌" : " 빈칸"}`}
                    >
                      {stone !== 0 && (
                        <span
                          className="block rounded-full"
                          style={{
                            width: "88%",
                            height: "88%",
                            background:
                              stone === 1
                                ? "radial-gradient(circle at 35% 35%, #666, #111)"
                                : "radial-gradient(circle at 35% 35%, #fff, #ccc)",
                            border: stone === 2 ? "1px solid #aaa" : "1px solid #000",
                            boxShadow: isWin
                              ? stone === 1
                                ? "0 0 8px 3px rgba(255,0,0,0.6)"
                                : "0 0 8px 3px rgba(255,0,0,0.6)"
                              : "0 2px 4px rgba(0,0,0,0.3)",
                            position: "relative",
                          }}
                        >
                          {/* Last move indicator */}
                          {isLast && (
                            <span
                              className="absolute rounded-full"
                              style={{
                                width: "28%",
                                height: "28%",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                background: stone === 1 ? "#e44" : "#e44",
                                opacity: 0.9,
                              }}
                            />
                          )}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Win overlay */}
          {winResult && (
            <div className="text-center mb-6">
              <div className="inline-flex flex-col items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-8 py-4">
                <span className="text-xl font-bold text-green-700">
                  {winResult.stone === 1 ? "흑돌" : "백돌"}{" "}
                  {mode === "ai"
                    ? winResult.stone === 1
                      ? "(플레이어) 승리!"
                      : "(AI) 승리!"
                    : "승리!"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => startNewGame(mode)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-500 transition-colors"
                  >
                    다시하기
                  </button>
                  <button
                    onClick={() => {
                      setGameStarted(false);
                      setBoard(createEmptyBoard());
                      setHistory([]);
                      setCurrentTurn(1);
                      setLastMove(null);
                      setWinResult(null);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    모드 선택
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* SEO Content */}
      <section className="mt-10 pt-8 border-t border-gray-200 space-y-6 text-gray-700 text-sm leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">오목이란?</h2>
          <p>
            오목(五目, Gomoku)은 두 명의 플레이어가 바둑판 위에 번갈아 돌을 놓아
            가로, 세로, 대각선 중 한 방향으로 5개의 돌을 연속으로 먼저 놓는 사람이
            이기는 전략 보드게임입니다. 동아시아에서 오랜 역사를 가진 게임으로,
            일본에서는 &quot;렌주(連珠)&quot;라는 이름으로도 알려져 있습니다.
            15&times;15 크기의 바둑판을 사용하며, 흑돌이 먼저 시작합니다.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">기본 규칙</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>흑돌이 먼저 시작하며, 두 플레이어가 번갈아 돌을 놓습니다.</li>
            <li>돌은 바둑판의 교차점(선이 만나는 곳)에 놓습니다.</li>
            <li>한 번 놓은 돌은 움직이거나 제거할 수 없습니다.</li>
            <li>가로, 세로, 대각선 어느 방향이든 연속 5개를 먼저 완성하면 승리입니다.</li>
            <li>빈 자리가 모두 차면 무승부입니다.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">전략 팁</h2>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>중앙을 선점하세요:</strong> 중앙에 가까울수록 사방으로 뻗어나갈 수 있어 유리합니다.</li>
            <li><strong>열린 3(양쪽이 열린 3개 연속)을 만드세요:</strong> 상대가 양쪽을 동시에 막기 어렵습니다.</li>
            <li><strong>4-3 공격:</strong> 열린 4와 열린 3을 동시에 만들면 상대가 막을 수 없습니다.</li>
            <li><strong>수비도 중요합니다:</strong> 상대의 3개 연속을 빨리 발견하고 차단하세요.</li>
            <li><strong>양쪽을 모두 열어두세요:</strong> 한쪽이 벽이나 상대 돌로 막혀 있으면 위협이 줄어듭니다.</li>
            <li><strong>대각선을 활용하세요:</strong> 가로/세로보다 대각선 공격이 상대가 인지하기 어렵습니다.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">이 도구의 기능</h2>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>2인 대전:</strong> 한 기기에서 두 명이 번갈아 플레이할 수 있습니다.</li>
            <li><strong>AI 대전:</strong> 컴퓨터 상대와 대결합니다. AI는 백돌로 플레이합니다.</li>
            <li><strong>무르기:</strong> 마지막 수를 취소할 수 있습니다 (AI 모드에서는 AI 수까지 함께 취소).</li>
            <li><strong>승리 표시:</strong> 5개를 완성하면 해당 돌이 하이라이트로 표시됩니다.</li>
            <li><strong>마지막 수 표시:</strong> 가장 최근에 놓은 돌에 빨간 점이 표시됩니다.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">오목의 역사</h2>
          <p>
            오목의 기원은 고대 동아시아로 거슬러 올라갑니다. 바둑에서 파생된 것으로
            추정되며, 일본에서는 에도 시대부터 대중적인 게임으로 자리잡았습니다.
            1899년 일본에서 &quot;렌주&quot;라는 정식 명칭이 붙여졌고, 국제 렌주
            연맹(RIF)이 설립되어 세계 대회가 개최되고 있습니다. 한국에서는
            &quot;오목&quot;이라는 이름으로 널리 사랑받고 있으며, 학교와 가정에서
            쉽게 즐길 수 있는 대표적인 보드게임입니다.
          </p>
        </div>
      </section>

      <RelatedTools current="omok" />
    </div>
  );
}
