"use client";

import { RotateCcw } from "lucide-react";

type GameControlsProps = {
  onNewGame: () => void;
  onUndo: () => void;
  canUndo: boolean;
};

export function GameControls({ onNewGame, onUndo, canUndo }: GameControlsProps) {
  return (
    <div className="controls flex flex-wrap items-center justify-center gap-3">
      <button
        onClick={onNewGame}
        className="btn btn-primary flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
        aria-label="New game"
      >
        <RotateCcw className="w-4 h-4" />
        New Game
      </button>
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`btn flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors opacity-60 ${
          !canUndo ? "cursor-not-allowed" : ""
        }`}
        aria-label="Undo"
      >
        Undo
      </button>
    </div>
  );
}
