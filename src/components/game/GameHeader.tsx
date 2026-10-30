"use client";

import { RotateCcw, Undo2 } from "lucide-react";

export function GameHeader({
  score,
  bestScore,
  onNewGame,
  onUndo,
  canUndo,
}: {
  score: number;
  bestScore: number;
  onNewGame: () => void;
  onUndo: () => void;
  canUndo: boolean;
}) {
  return (
    <header className="header mb-6 space-y-3">
      {/* Top row: Title and Scores */}
      <div className="flex items-center justify-between">
        <h1 className="text-5xl font-extrabold tracking-tight text-[#776e65] leading-none">
          2048
        </h1>
        <div className="scores flex items-center gap-2">
          <ScoreCardInline label="Score" value={score} />
          <ScoreCardInline label="Best" value={bestScore} />
        </div>
      </div>

      {/* Second row: Subtitle and Actions */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <p className="text-sm font-medium text-[#776e65]/80 leading-snug">
          Join the numbers to get to <strong className="font-bold text-[#776e65]">2048</strong>!
        </p>
        <GameControlsInline onNewGame={onNewGame} onUndo={onUndo} canUndo={canUndo} />
      </div>
    </header>
  );
}

function ScoreCardInline({ label, value }: { label: string; value: number }) {
  return (
    <div className="score-card rounded-xl bg-[#bbada0] px-3.5 py-2 flex flex-col items-center justify-center min-w-[76px] shadow-sm">
      <span className="text-[10px] font-bold tracking-wider uppercase text-[#eee4da]">
        {label}
      </span>
      <span className="text-lg font-extrabold text-white leading-tight">
        {value}
      </span>
    </div>
  );
}

function GameControlsInline({
  onNewGame,
  onUndo,
  canUndo,
}: {
  onNewGame: () => void;
  onUndo: () => void;
  canUndo: boolean;
}) {
  return (
    <div className="controls flex items-center gap-2 shrink-0">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`btn bg-[#8f7a66] text-white flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-all shadow-sm ${
          !canUndo
            ? "opacity-40 cursor-not-allowed"
            : "hover:bg-[#9f8b76] active:scale-95 cursor-pointer"
        }`}
        aria-label="Undo move"
        title="Undo move"
      >
        <Undo2 className="w-3.5 h-3.5" />
        Undo
      </button>
      <button
        onClick={onNewGame}
        className="btn bg-[#8f7a66] hover:bg-[#9f8b76] active:scale-95 text-white flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-all shadow-sm cursor-pointer"
        aria-label="New game"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        New
      </button>
    </div>
  );
}
