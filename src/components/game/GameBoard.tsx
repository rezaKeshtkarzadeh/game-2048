"use client";

import { useMemo } from "react";
import { GRID_SIZE } from "@/lib/game";
import type { Tile } from "@/lib/game";
import { Tile as TileComponent } from "./Tile";

type GameBoardProps = {
  grid: (Tile | null)[][];
  previousGrid: (Tile | null)[][];
  size: number;
};

const BOARD_PADDING = 12;
const CELL_GAP = 12;

export function GameBoard({ grid, previousGrid, size }: GameBoardProps) {
  const cellSize = (size - 2 * BOARD_PADDING - (GRID_SIZE - 1) * CELL_GAP) / GRID_SIZE;

  const cells = useMemo(() => {
    const currentById = new Map<string, Tile>();
    const previousById = new Map<string, Tile>();

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const current = grid[row][col];
        const previous = previousGrid[row][col];
        if (current) currentById.set(current.id, { ...current, position: { row, col } });
        if (previous) previousById.set(previous.id, { ...previous, position: { row, col } });
      }
    }

    const entries: Array<{
      tile: Tile;
      target: { row: number; col: number };
      previous: { row: number; col: number } | undefined;
      isNew: boolean;
      isMerged: boolean;
    }> = [];

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const current = grid[row][col];
        if (!current) continue;

        const previousTile = previousById.get(current.id);
        const previousPos = previousTile ? previousTile.position : undefined;

        let isMerged = false;
        if (
          previousTile &&
          previousTile.value === current.value / 2 &&
          previousTile.id === current.id
        ) {
          isMerged = true;
        }

        entries.push({
          tile: current,
          target: { row, col },
          previous: previousPos,
          isNew: !previousTile,
          isMerged,
        });
      }
    }

    return entries;
  }, [grid, previousGrid]);

  return (
    <div
      className="board relative rounded-2xl bg-[#bbada0] shadow-[0_6px_12px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.08)] box-border select-none touch-none overflow-hidden isolate"
      style={{
        width: size,
        height: size,
        padding: BOARD_PADDING,
      }}
    >
      <div
        className="grid grid-cols-4 w-full h-full"
        style={{ gap: CELL_GAP }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => (
          <div
            key={`cell-${i}`}
            className="cell rounded-xl bg-[#cdc1b4]"
            style={{
              width: cellSize,
              height: cellSize,
            }}
          />
        ))}
      </div>
      {cells.map((entry) => (
        <TileComponent
          key={entry.tile.id}
          tile={entry.tile}
          target={entry.target}
          previous={entry.previous}
          isNew={entry.isNew}
          isMerged={entry.isMerged}
          size={cellSize}
          padding={BOARD_PADDING}
          gap={CELL_GAP}
        />
      ))}
    </div>
  );
}
