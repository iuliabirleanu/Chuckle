import React from 'react';
import { Sparkles, Dices, Eye, Zap } from 'lucide-react';

interface ActionControlsProps {
  onTellJoke: () => void;
  isLoading?: boolean;
  revealMode: 'instant' | 'tap';
  onToggleRevealMode: () => void;
}

export const ActionControls: React.FC<ActionControlsProps> = ({
  onTellJoke,
  isLoading = false,
  revealMode,
  onToggleRevealMode,
}) => {
  return (
    <div className="w-full flex flex-col items-center gap-3 pt-2">
      {/* Primary Hero Button: 'Tell me a joke' */}
      <button
        onClick={onTellJoke}
        disabled={isLoading}
        className="group relative w-full sm:w-auto sm:min-w-[340px] h-14 sm:h-16 px-8 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-slate-950 font-extrabold text-lg sm:text-xl shadow-xl shadow-amber-400/25 hover:shadow-amber-400/35 hover:brightness-105 active:scale-[0.97] transition-all flex items-center justify-center gap-3 cursor-pointer select-none"
      >
        <span className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-slate-950 text-amber-400">
          <Sparkles className="w-5 h-5 fill-amber-400 group-hover:rotate-12 transition-transform duration-300" />
        </span>
        <span className="tracking-tight">Tell me a joke</span>
        <Dices className="w-5 h-5 text-slate-800 ml-1 group-hover:rotate-45 transition-transform duration-300" />
      </button>

      {/* Mode Toggle & Hints */}
      <div className="flex items-center justify-between w-full max-w-sm px-2 text-xs text-slate-400">
        <button
          onClick={onToggleRevealMode}
          className="min-h-[40px] px-3 py-1.5 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 flex items-center gap-1.5 transition-colors text-slate-400 hover:text-slate-200"
          title="Toggle whether punchline appears immediately or requires a tap"
        >
          {revealMode === 'instant' ? (
            <>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Punchline: <strong className="text-slate-200">Instant</strong></span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5 text-sky-400" />
              <span>Punchline: <strong className="text-slate-200">Tap to Reveal</strong></span>
            </>
          )}
        </button>

        <span className="hidden sm:inline text-slate-600 font-mono text-[11px]">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 text-[10px]">Space</kbd>
        </span>
      </div>
    </div>
  );
};
