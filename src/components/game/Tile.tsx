"use client";

import { useMemo } from "react";
import type { Tile } from "@/lib/game";

type TileProps = {
  tile: Tile;
  target: { row: number; col: number };
  previous?: { row: number; col: number };
  isNew: boolean;
  isMerged: boolean;
  size: number;
  padding: number;
  gap: number;
};

const TILE_COLORS: Record<number, { bg: string; text: string }> = {
  2: { bg: "bg-[#eee4da]", text: "text-[#776e65]" },
  4: { bg: "bg-[#ede0c8]", text: "text-[#776e65]" },
  8: { bg: "bg-[#f2b179]", text: "text-[#f9f6f2]" },
  16: { bg: "bg-[#f59563]", text: "text-[#f9f6f2]" },
  32: { bg: "bg-[#f67c5f]", text: "text-[#f9f6f2]" },
  64: { bg: "bg-[#f65e3b]", text: "text-[#f9f6f2]" },
  128: { bg: "bg-[#edcf72]", text: "text-[#f9f6f2]" },
  256: { bg: "bg-[#edcc61]", text: "text-[#f9f6f2]" },
  512: { bg: "bg-[#edc850]", text: "text-[#f9f6f2]" },
  1024: { bg: "bg-[#edc53f]", text: "text-[#f9f6f2]" },
  2048: { bg: "bg-[#edc22e]", text: "text-[#f9f6f2]" },
};

const getTileStyle = (value: number) => {
  return TILE_COLORS[value] ?? { bg: "bg-[#3c3a32]", text: "text-[#f9f6f2]" };
};

const fontSizeFor = (value: number) => {
  if (value >= 1024) return "text-2xl";
  if (value >= 256) return "text-3xl";
  return "text-4xl";
};

export function Tile({
  tile,
  target,
  isNew,
  isMerged,
  size,
  padding,
  gap,
}: TileProps) {
  const x = padding + target.col * (size + gap);
  const y = padding + target.row * (size + gap);

  const style = getTileStyle(tile.value);

  const animationClass = useMemo(() => {
    if (isMerged) {
      return "animate-tile-merge";
    }
    if (isNew) {
      return "animate-tile-new";
    }
    return "";
  }, [isNew, isMerged]);

  // Constrain tile z-index so it stays between 1-20 and never competes with dialogs (z-50+)
  const tileZIndex = isMerged
    ? 20
    : Math.min(Math.max(1, Math.round(Math.log2(tile.value || 2))), 15);

  return (
    <div
      className="tile absolute top-0 left-0 transition-transform duration-100 ease-in-out pointer-events-none will-change-transform"
      style={{
        width: size,
        height: size,
        transform: `translate3d(${x}px, ${y}px, 0)`,
        zIndex: tileZIndex,
      }}
    >
      <div
        className={`w-full h-full rounded-xl flex items-center justify-center font-bold select-none shadow-[0_2px_4px_rgba(0,0,0,0.1)] ${
          style.bg
        } ${style.text} ${fontSizeFor(tile.value)} ${animationClass}`}
      >
        {tile.value}
      </div>
    </div>
  );
}
