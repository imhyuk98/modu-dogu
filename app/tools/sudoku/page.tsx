"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import RelatedTools from "@/components/RelatedTools";

type Difficulty = "easy" | "medium" | "hard";
type Board = number[][];
type NotesBoard = Set<number>[][];

interface CellState {
  value: number;
  isFixed: boolean;
  isError: boolean;
  notes: Set<number>;
}

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; empty: number }> = {
  easy: { label: "쉬움", empty: 35 },
  medium: { label: "보통", empty: 45 },
  hard: { label: "어려움", empty: 55 },
};

// ── Sudoku Generator ──

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function isValidPlacement(board: Board, row: number, col: number, num: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;
  }
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }
  return true;
}

function solveSudoku(board: Board): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0) {
        const nums = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (const num of nums) {
          if (isValidPlacement(board, r, c, num)) {
            board[r][c] = num;
            if (solveSudoku(board)) return true;
            board[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function generateCompleteBoard(): Board {
  const board: Board = Array.from({ length: 9 }, () => Array(9).fill(0));
  solveSudoku(board);
  return board;
}

function generatePuzzle(difficulty: Difficulty): { puzzle: Board; solution: Board } {
  const solution = generateCompleteBoard();
  const puzzle = solution.map((row) => [...row]);
  const { empty } = DIFFICULTY_CONFIG[difficulty];

  const positions = shuffleArray(
    Array.from({ length: 81 }, (_, i) => [Math.floor(i / 9), i % 9] as [number, number])
  );

  let removed = 0;
  for (const [r, c] of positions) {
    if (removed >= empty) break;
    puzzle[r][c] = 0;
    removed++;
  }

  return { puzzle, solution };
}

// ── Component ──

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function SudokuPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [cells, setCells] = useState<CellState[][]>([]);
  const [solution, setSolution] = useState<Board>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [notesMode, setNotesMode] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const MAX_MISTAKES = 3;

  const initGame = useCallback((diff: Difficulty) => {
    const { puzzle, solution: sol } = generatePuzzle(diff);
    const newCells: CellState[][] = puzzle.map((row) =>
      row.map((val) => ({
        value: val,
        isFixed: val !== 0,
        isError: false,
        notes: new Set<number>(),
      }))
    );
    setCells(newCells);
    setSolution(sol);
    setSelectedCell(null);
    setMistakes(0);
    setTimer(0);
    setIsRunning(true);
    setIsGameOver(false);
    setIsWon(false);
    setNotesMode(false);
  }, []);

  useEffect(() => {
    initGame(difficulty);
  }, []);

  // Timer
  useEffect(() => {
    if (isRunning && !isGameOver && !isWon) {
      intervalRef.current = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isGameOver, isWon]);

  const checkWin = useCallback(
    (currentCells: CellState[][]) => {
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (currentCells[r][c].value !== solution[r]?.[c]) return false;
        }
      }
      return true;
    },
    [solution]
  );

  const handleNumberInput = useCallback(
    (num: number) => {
      if (!selectedCell || isGameOver || isWon) return;
      const [r, c] = selectedCell;
      if (cells[r][c].isFixed) return;

      setCells((prev) => {
        const next = prev.map((row) => row.map((cell) => ({ ...cell, notes: new Set(cell.notes) })));

        if (notesMode) {
          const notes = next[r][c].notes;
          if (notes.has(num)) {
            notes.delete(num);
          } else {
            notes.add(num);
          }
          next[r][c].value = 0;
          next[r][c].isError = false;
          return next;
        }

        // Normal mode
        next[r][c].notes = new Set();
        if (num === solution[r]?.[c]) {
          next[r][c].value = num;
          next[r][c].isError = false;

          // Remove this number from notes in same row, col, box
          for (let i = 0; i < 9; i++) {
            next[r][i].notes.delete(num);
            next[i][c].notes.delete(num);
          }
          const boxR = Math.floor(r / 3) * 3;
          const boxC = Math.floor(c / 3) * 3;
          for (let br = boxR; br < boxR + 3; br++) {
            for (let bc = boxC; bc < boxC + 3; bc++) {
              next[br][bc].notes.delete(num);
            }
          }

          if (checkWin(next)) {
            setIsWon(true);
            setIsRunning(false);
          }
        } else {
          next[r][c].value = num;
          next[r][c].isError = true;
          setMistakes((m) => {
            const newM = m + 1;
            if (newM >= MAX_MISTAKES) {
              setIsGameOver(true);
              setIsRunning(false);
            }
            return newM;
          });
        }
        return next;
      });
    },
    [selectedCell, isGameOver, isWon, cells, notesMode, solution, checkWin]
  );

  const handleErase = useCallback(() => {
    if (!selectedCell || isGameOver || isWon) return;
    const [r, c] = selectedCell;
    if (cells[r][c].isFixed) return;

    setCells((prev) => {
      const next = prev.map((row) => row.map((cell) => ({ ...cell, notes: new Set(cell.notes) })));
      next[r][c].value = 0;
      next[r][c].isError = false;
      next[r][c].notes = new Set();
      return next;
    });
  }, [selectedCell, isGameOver, isWon, cells]);

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const num = parseInt(e.key);
      if (num >= 1 && num <= 9) {
        handleNumberInput(num);
      }
      if (e.key === "Backspace" || e.key === "Delete") {
        handleErase();
      }
      if (!selectedCell) return;
      const [r, c] = selectedCell;
      if (e.key === "ArrowUp" && r > 0) setSelectedCell([r - 1, c]);
      if (e.key === "ArrowDown" && r < 8) setSelectedCell([r + 1, c]);
      if (e.key === "ArrowLeft" && c > 0) setSelectedCell([r, c - 1]);
      if (e.key === "ArrowRight" && c < 8) setSelectedCell([r, c + 1]);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleNumberInput, handleErase, selectedCell]);

  const selectedValue =
    selectedCell && cells[selectedCell[0]]?.[selectedCell[1]]?.value
      ? cells[selectedCell[0]][selectedCell[1]].value
      : null;

  const getCellClasses = (r: number, c: number): string => {
    const cell = cells[r]?.[c];
    if (!cell) return "";

    const classes: string[] = [
      "w-full aspect-square flex items-center justify-center text-sm sm:text-base md:text-lg cursor-pointer select-none transition-colors relative",
    ];

    // Borders for 3x3 boxes
    if (c % 3 === 0 && c !== 0) classes.push("border-l-2 border-l-gray-800");
    if (r % 3 === 0 && r !== 0) classes.push("border-t-2 border-t-gray-800");

    // Background
    let bg = "bg-white";
    const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
    const inRow = selectedCell?.[0] === r;
    const inCol = selectedCell?.[1] === c;
    const inBox =
      selectedCell &&
      Math.floor(selectedCell[0] / 3) === Math.floor(r / 3) &&
      Math.floor(selectedCell[1] / 3) === Math.floor(c / 3);
    const sameNumber = selectedValue && cell.value === selectedValue && cell.value !== 0;

    if (cell.isError) {
      bg = "bg-red-100";
    } else if (isSelected) {
      bg = "bg-blue-200";
    } else if (sameNumber) {
      bg = "bg-blue-100";
    } else if (inRow || inCol || inBox) {
      bg = "bg-blue-50";
    }
    classes.push(bg);

    // Text color
    if (cell.isError) {
      classes.push("text-red-600 font-semibold");
    } else if (cell.isFixed) {
      classes.push("text-gray-900 font-bold");
    } else {
      classes.push("text-blue-600 font-semibold");
    }

    return classes.join(" ");
  };

  // Count remaining numbers
  const getNumberCount = (num: number): number => {
    let count = 0;
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (cells[r]?.[c]?.value === num && !cells[r][c].isError) count++;
      }
    }
    return count;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-800 mb-1 tracking-tight">
        🧩 스도쿠
      </h1>
      <p className="text-center text-gray-500 mb-6">
        숫자 퍼즐의 클래식! 9×9 그리드를 완성하세요.
      </p>

      {/* Difficulty & Controls */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((d) => (
          <button
            key={d}
            onClick={() => {
              setDifficulty(d);
              initGame(d);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              difficulty === d
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {DIFFICULTY_CONFIG[d].label}
          </button>
        ))}
        <button
          onClick={() => initGame(difficulty)}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
        >
          새 게임
        </button>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="text-sm text-gray-600">
          실수:{" "}
          {Array.from({ length: MAX_MISTAKES }, (_, i) => (
            <span key={i} className={i < mistakes ? "text-red-500" : "text-gray-300"}>
              ✕
            </span>
          ))}
          <span className="ml-1 text-gray-400">
            {mistakes}/{MAX_MISTAKES}
          </span>
        </div>
        <div className="text-sm font-mono text-gray-600">⏱ {formatTime(timer)}</div>
      </div>

      {/* Game Over / Win overlay message */}
      {(isGameOver || isWon) && (
        <div
          className={`mb-4 p-4 rounded-xl text-center font-semibold ${
            isWon ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {isWon ? (
            <>
              🎉 축하합니다! {formatTime(timer)}만에 완성했습니다!
            </>
          ) : (
            <>
              😢 게임 오버! 실수 {MAX_MISTAKES}회를 초과했습니다.
            </>
          )}
          <button
            onClick={() => initGame(difficulty)}
            className="mt-2 block mx-auto px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
          >
            다시 시작
          </button>
        </div>
      )}

      {/* Sudoku Grid */}
      <div className="border-2 border-gray-800 rounded-lg overflow-hidden mx-auto max-w-[400px]">
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(9, 1fr)",
            gap: "0",
          }}
        >
          {cells.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className={getCellClasses(r, c)}
                style={{
                  borderRight: c < 8 ? (c % 3 === 2 ? "2px solid #1f2937" : "1px solid #d1d5db") : "none",
                  borderBottom: r < 8 ? (r % 3 === 2 ? "2px solid #1f2937" : "1px solid #d1d5db") : "none",
                }}
                onClick={() => {
                  if (!isGameOver && !isWon) setSelectedCell([r, c]);
                }}
              >
                {cell.value !== 0 ? (
                  cell.value
                ) : cell.notes.size > 0 ? (
                  <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-px">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                      <span
                        key={n}
                        className="flex items-center justify-center text-[7px] sm:text-[8px] text-gray-400 leading-none"
                      >
                        {cell.notes.has(n) ? n : ""}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Number Buttons */}
      <div className="mt-4 flex justify-center gap-1 sm:gap-2 flex-wrap max-w-[400px] mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
          const count = getNumberCount(num);
          const isDone = count >= 9;
          return (
            <button
              key={num}
              onClick={() => handleNumberInput(num)}
              disabled={isDone || isGameOver || isWon}
              className={`w-9 h-12 sm:w-10 sm:h-14 rounded-lg font-bold text-lg transition-colors flex flex-col items-center justify-center ${
                isDone
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100 active:bg-blue-200"
              }`}
            >
              <span>{num}</span>
              <span className="text-[10px] text-gray-400 font-normal">{9 - count}</span>
            </button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="mt-3 flex justify-center gap-3 max-w-[400px] mx-auto">
        <button
          onClick={handleErase}
          disabled={isGameOver || isWon}
          className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-40"
        >
          🧹 지우기
        </button>
        <button
          onClick={() => setNotesMode((p) => !p)}
          disabled={isGameOver || isWon}
          className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 ${
            notesMode
              ? "bg-yellow-100 text-yellow-700 ring-2 ring-yellow-400"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          ✏️ 메모 {notesMode ? "ON" : "OFF"}
        </button>
      </div>

      {/* SEO Content */}
      <section className="mt-12 prose prose-gray max-w-none">
        <h2 className="text-xl font-bold text-gray-800 mb-4">스도쿠(Sudoku)란?</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          스도쿠는 9×9 격자에 1부터 9까지의 숫자를 채워 넣는 논리 퍼즐입니다.
          각 행(가로줄), 각 열(세로줄), 그리고 9개의 3×3 박스에 1~9 숫자가
          하나씩만 들어가야 합니다. 1986년 일본에서 &quot;수독&quot;(数独, 숫자는 하나만)이라는
          이름으로 대중화되었으며, 현재 전 세계에서 가장 인기 있는 퍼즐 게임 중 하나입니다.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mb-3">기본 규칙</h3>
        <ul className="text-gray-600 space-y-2 mb-4 list-disc pl-5">
          <li>각 <strong>가로줄</strong>(행)에 1~9가 한 번씩만 들어갑니다.</li>
          <li>각 <strong>세로줄</strong>(열)에 1~9가 한 번씩만 들어갑니다.</li>
          <li>각 <strong>3×3 박스</strong>에 1~9가 한 번씩만 들어갑니다.</li>
          <li>이미 주어진 숫자(힌트)는 변경할 수 없습니다.</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mb-3">풀이 팁</h3>
        <ul className="text-gray-600 space-y-2 mb-4 list-disc pl-5">
          <li>
            <strong>스캐닝</strong>: 행과 열을 훑어보며 특정 숫자가 들어갈 수 있는
            위치를 찾습니다.
          </li>
          <li>
            <strong>후보 제거법</strong>: 메모 기능을 활용해 각 칸에 가능한 숫자를
            적어두고 하나씩 제거합니다.
          </li>
          <li>
            <strong>유일 후보</strong>: 특정 칸에 들어갈 수 있는 숫자가 하나뿐이라면
            그 숫자를 채웁니다.
          </li>
          <li>
            <strong>숨은 외톨이</strong>: 행·열·박스 내에서 특정 숫자가 한 칸에서만
            가능하면 그곳에 배치합니다.
          </li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mb-3">난이도별 특징</h3>
        <ul className="text-gray-600 space-y-2 mb-4 list-disc pl-5">
          <li>
            <strong>쉬움</strong>: 빈 칸 약 35개. 기본 스캐닝만으로 대부분 풀 수
            있어 초보자에게 적합합니다.
          </li>
          <li>
            <strong>보통</strong>: 빈 칸 약 45개. 후보 제거법과 메모 기능이 도움이
            됩니다.
          </li>
          <li>
            <strong>어려움</strong>: 빈 칸 약 55개. 고급 테크닉(네이키드 페어, X-Wing
            등)이 필요할 수 있습니다.
          </li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mb-3">스도쿠의 효과</h3>
        <p className="text-gray-600 leading-relaxed">
          스도쿠를 꾸준히 풀면 논리적 사고력, 집중력, 기억력이 향상됩니다.
          두뇌 훈련에 효과적이며, 스트레스 해소와 성취감을 동시에 얻을 수 있는
          건강한 취미 활동입니다. 하루 한 문제씩 도전해 보세요!
        </p>
      </section>

      <RelatedTools current="sudoku" />
    </div>
  );
}
