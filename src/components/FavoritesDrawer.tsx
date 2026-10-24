import React from 'react';
import { X, Trash2, Volume2, Copy, Bookmark, ArrowRight, Share2 } from 'lucide-react';
import { Joke, SavedJoke } from '../types';
import { sound } from '../utils/audio';
import { speakJoke } from '../utils/speech';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedJokes: SavedJoke[];
  onSelectJoke: (joke: Joke) => void;
  onRemoveSaved: (jokeId: string) => void;
  onClearAll: () => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  savedJokes,
  onSelectJoke,
  onRemoveSaved,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container (Bottom Sheet on mobile, modal on tablet/desktop) */}
      <div className="relative w-full sm:max-w-xl max-h-[85vh] sm:max-h-[80vh] bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden pb-safe">
        {/* Mobile Grab Handle */}
        <div className="sm:hidden w-12 h-1.5 bg-slate-700 rounded-full mx-auto my-3" />

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400 fill-amber-400/20" />
            <h3 className="text-base sm:text-lg font-bold text-white">Saved Favorites</h3>
            <span className="text-xs text-slate-400 tabular-nums">({savedJokes.length})</span>
          </div>

          <div className="flex items-center gap-2">
            {savedJokes.length > 0 && (
              <button
                onClick={() => {
                  sound.playTap();
                  if (confirm('Clear all saved jokes?')) {
                    onClearAll();
                  }
                }}
                className="text-xs text-slate-400 hover:text-rose-400 p-2 min-h-[44px] flex items-center gap-1 transition-colors"
                title="Clear all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Clear</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              aria-label="Close saved jokes"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Jokes List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {savedJokes.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-3">
              <Bookmark className="w-10 h-10 mx-auto text-slate-600 stroke-1" />
              <p className="text-sm font-medium text-slate-300">No saved jokes yet</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Whenever a joke makes you laugh, tap the bookmark icon on the card to save it for later!
              </p>
            </div>
          ) : (
            savedJokes.map((joke) => (
              <div
                key={joke.id}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all group flex flex-col gap-2"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="text-amber-400 font-semibold uppercase tracking-wider">
                    {joke.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        sound.playTap();
                        speakJoke(joke.setup, joke.punchline);
                      }}
                      className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors"
                      title="Read aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={async () => {
                        sound.playTap();
                        await navigator.clipboard.writeText(`${joke.setup}\n\n${joke.punchline}`);
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
                      title="Copy"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        sound.playTap();
                        onRemoveSaved(joke.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-sm font-semibold text-slate-200 line-clamp-2">
                  &ldquo;{joke.setup}&rdquo;
                </p>
                <p className="text-xs font-medium text-amber-300/90 line-clamp-2">
                  👉 {joke.punchline}
                </p>

                <button
                  onClick={() => {
                    sound.playTap();
                    onSelectJoke(joke);
                    onClose();
                  }}
                  className="mt-1 pt-2 border-t border-slate-900 text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 self-start"
                >
                  <span>Open in main view</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
