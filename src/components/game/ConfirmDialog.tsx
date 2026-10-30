"use client";

type ConfirmDialogProps = {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({ open, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Confirm new game"
    >
      <div
        className="confirm-backdrop absolute inset-0 backdrop-blur-sm bg-black/40"
        onClick={onCancel}
      />
      <div
        className="confirm-panel relative rounded-2xl bg-white p-6 sm:p-8 shadow-2xl flex flex-col items-center gap-4 text-center max-w-sm w-full"
      >
        <h3 className="text-xl font-bold text-[#776e65]">Start a new game?</h3>
        <p className="text-sm text-[#776e65]/70">Your current progress will be lost.</p>
        <div className="flex gap-3 w-full pt-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm bg-[#cdc1b4] hover:bg-[#bdafa2] text-white transition-all active:scale-95 cursor-pointer shadow-sm"
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm bg-[#8f7a66] hover:bg-[#9f8b76] text-white transition-all active:scale-95 cursor-pointer shadow-sm"
            aria-label="Confirm new game"
          >
            Start new
          </button>
        </div>
      </div>
    </div>
  );
}
