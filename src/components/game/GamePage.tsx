"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  applyMove,
  INITIAL_GAME_STATE,
  loadGame,
  newGame,
  saveGame,
  undoMove,
  type GameState,
} from "@/lib/game";
import { GameBoard } from "./GameBoard";
import { GameHeader } from "./GameHeader";
import { GameOverlay } from "./GameOverlay";
import { GameInstructions } from "./GameInstructions";
import { ConfirmDialog } from "./ConfirmDialog";

const MAX_BOARD_SIZE = 400;

export default function GamePage() {
  const [state, setState] = useState<GameState>(() => INITIAL_GAME_STATE);
  const [previous, setPrevious] = useState<GameState | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [boardSize, setBoardSize] = useState(MAX_BOARD_SIZE);

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const updateSize = () => {
      const available = window.innerWidth - 32;
      setBoardSize(Math.min(MAX_BOARD_SIZE, Math.max(280, available)));
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = loadGame();
      const hasSavedData = saved.grid.some((row) => row.some(Boolean));
      setState(hasSavedData ? saved : newGame());
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    saveGame(state);
  }, [state]);

  const handleMove = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      if (state.status === "gameover") return;
      setPrevious(state);
      setState((current) => applyMove(current, direction));
    },
    [state]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      let direction: "up" | "down" | "left" | "right" | null = null;

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          direction = "up";
          break;
        case "ArrowDown":
        case "s":
        case "S":
          direction = "down";
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          direction = "left";
          break;
        case "ArrowRight":
        case "d":
        case "D":
          direction = "right";
          break;
      }

      if (direction) {
        e.preventDefault();
        handleMove(direction);
      }
    },
    [handleMove]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleNewGame = useCallback(() => {
    setPrevious(null);
    setState(newGame());
  }, []);

  const handleUndo = useCallback(() => {
    if (!previous) return;
    setState((current) => undoMove(current, previous));
    setPrevious(null);
  }, [previous]);

  const handleConfirmNewGame = useCallback(() => {
    setConfirmOpen(false);
    handleNewGame();
  }, [handleNewGame]);

  const canUndo = !!previous && state.status !== "gameover";

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const dx = endX - touchStartRef.current.x;
    const dy = endY - touchStartRef.current.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > 30) {
        handleMove(dx > 0 ? "right" : "left");
      }
    } else {
      if (Math.abs(dy) > 30) {
        handleMove(dy > 0 ? "down" : "up");
      }
    }
    touchStartRef.current = null;
  };

  return (
    <div className="game-page min-h-screen flex flex-col items-center justify-center bg-[#faf8ef] px-4 py-8">
      <main className="w-full flex flex-col items-center" style={{ maxWidth: boardSize }}>
        <div className="w-full">
          <GameHeader
            score={state.score}
            bestScore={state.bestScore}
            onNewGame={() => {
              if (state.status === "playing") {
                setConfirmOpen(true);
              } else {
                handleNewGame();
              }
            }}
            onUndo={handleUndo}
            canUndo={canUndo}
          />
        </div>
        <div
          className="board-wrapper relative mb-4 select-none touch-none flex justify-center"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={(e) => {
            if (touchStartRef.current) e.preventDefault();
          }}
          style={{ touchAction: "none" }}
        >
          <GameBoard
            grid={state.grid}
            previousGrid={previous?.grid ?? state.grid}
            size={boardSize}
          />
        </div>
        <GameOverlay
          status={state.status}
          score={state.score}
          bestScore={state.bestScore}
          onContinue={() => {
            setState((current) => ({ ...current, status: "playing", hasWon: false }));
          }}
          onNewGame={handleNewGame}
        />
        <GameInstructions />
        <ConfirmDialog
          open={confirmOpen}
          onConfirm={handleConfirmNewGame}
          onCancel={() => setConfirmOpen(false)}
        />
      </main>
    </div>
  );
}
