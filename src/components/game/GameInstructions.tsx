"use client";

export function GameInstructions() {
  return (
    <div className="instructions mt-6 text-center max-w-md mx-auto space-y-1.5 px-4 text-[#776e65]/75">
      <p className="text-xs sm:text-sm font-medium">Use arrow keys or WASD to move.</p>
      <p className="text-xs sm:text-sm font-medium">Combine matching tiles to reach 2048.</p>
      <p className="text-xs sm:text-sm font-medium">On mobile, swipe to move tiles.</p>
      <div className="my-3 border-t border-[#d8d0c7]" />
      <p className="text-[11px] text-[#776e65]/60 font-medium">
        2048 — Built with Next.js and Tailwind CSS
      </p>
    </div>
  );
}
