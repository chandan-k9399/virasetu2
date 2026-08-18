'use client';

import React from 'react';

interface ConfusionNudgeProps {
  onSimplify: () => void;
  onDismiss: () => void;
}

export const ConfusionNudge: React.FC<ConfusionNudgeProps> = ({ onSimplify, onDismiss }) => {
  return (
    <div className="bg-[#FFF9F0] dark:bg-slate-800 border-2 border-[#c9a74d] rounded-2xl p-4 shadow-lg flex items-center justify-between gap-4 animate-fade-in my-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#c9a74d]/20 text-[#503d00] dark:text-amber-300 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-xl">help_outline</span>
        </div>
        <div>
          <h4 className="font-serif font-bold text-sm text-[#5B3A29] dark:text-indigo-200">
            Need a simpler summary?
          </h4>
          <p className="font-sans text-xs text-[#5B3A29]/80 dark:text-slate-300">
            Would you like Virasetu to explain this landmark in story format?
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onSimplify}
          className="px-4 py-2 rounded-full bg-[#5B3A29] text-[#FFF9F0] text-xs font-semibold hover:bg-[#4A2E20] transition-colors shadow-sm"
        >
          Yes, Simplify
        </button>
        <button
          onClick={onDismiss}
          className="w-8 h-8 rounded-full text-[#5B3A29]/60 dark:text-slate-400 hover:bg-[#5B3A29]/10 flex items-center justify-center transition-colors"
          aria-label="Dismiss nudge"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </div>
  );
};
