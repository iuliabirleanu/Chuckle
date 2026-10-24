import React from 'react';
import { Volume2, VolumeX, BookmarkCheck, Sparkles } from 'lucide-react';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  savedCount: number;
  onOpenFavorites: () => void;
  activeTab: 'joke' | 'favorites';
  setActiveTab: (tab: 'joke' | 'favorites') => void;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  savedCount,
  onOpenFavorites,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 pt-safe">
      <div className="max-w-4xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single Brand Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-400/20">
            <Sparkles className="w-4 h-4 fill-slate-950" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            Chuckle
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-400">
          <span className="text-slate-200">Daily Chuckle</span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span>Instant Wit</span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <span>Mobile Ready</span>
        </nav>

        {/* Zone 3: Actions (Sound & Saved Drawer) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className="min-h-[44px] min-w-[44px] px-2.5 py-1.5 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95 transition-all text-xs font-medium"
            title={soundEnabled ? 'Sound On' : 'Sound Muted'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
            <span className="ml-1.5 hidden xs:inline">{soundEnabled ? 'Audio On' : 'Muted'}</span>
          </button>

          <button
            onClick={onOpenFavorites}
            aria-label="View saved jokes"
            className="min-h-[44px] min-w-[44px] px-3 py-1.5 flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95 transition-all text-xs font-medium relative"
          >
            <BookmarkCheck className={`w-4 h-4 ${savedCount > 0 ? 'text-amber-400' : 'text-slate-400'}`} />
            <span className="hidden xs:inline">Saved</span>
            {savedCount > 0 && (
              <span className="bg-amber-400 text-slate-950 font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center tabular-nums">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
