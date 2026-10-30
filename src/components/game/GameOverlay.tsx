"use client";

import { RotateCcw, Crown, X } from "lucide-react";

type GameOverlayProps = {
  status: "playing" | "won" | "gameover";
  score: number;
  bestScore: number;
  onContinue: () => void;
  onNewGame: () => void;
};

export function GameOverlay({
  status,
  score,
  bestScore,
  onContinue,
  onNewGame,
}: GameOverlayProps) {
  if (status === "playing") return null;

  const isWon = status === "won";

  return (
    <div
      className="overlay fixed inset-0 z-[100] flex flex-col items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label={isWon ? "You win" : "Game over"}
    >
      <div className="overlay-backdrop absolute inset-0 backdrop-blur-sm bg-black/40" />
      <div className="overlay-panel relative rounded-2xl bg-white p-8 shadow-2xl flex flex-col items-center gap-4 text-center max-w-sm w-full">
        <div className="flex items-center gap-2">
          {isWon ? (
            <Crown className="w-8 h-8 text-amber-500" />
          ) : (
            <X className="w-8 h-8 text-rose-500" />
          )}
          <h2 className="text-3xl font-extrabold text-[#776e65]">
            {isWon ? "You win!" : "Game over!"}
          </h2>
        </div>
        <div className="flex gap-4 text-sm text-[#776e65]/80 py-1">
          <div className="flex items-center gap-1.5">
            <span>Score:</span>
            <span className="font-extrabold text-[#776e65] text-base">{score}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Best:</span>
            <span className="font-extrabold text-[#776e65] text-base">{bestScore}</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
          {isWon ? (
            <button
              onClick={onContinue}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-[#cdc1b4] hover:bg-[#bdafa2] text-white transition-all active:scale-95 cursor-pointer shadow-sm"
              aria-label="Keep playing"
            >
              Keep playing
            </button>
          ) : null}
          <button
            onClick={onNewGame}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-[#8f7a66] hover:bg-[#9f8b76] text-white transition-all active:scale-95 cursor-pointer shadow-sm"
            aria-label="Try again"
          >
            <RotateCcw className="w-4 h-4" />
            {isWon ? "New game" : "Try again"}
          </button>
        </div>
      </div>
    </div>
  );
}
