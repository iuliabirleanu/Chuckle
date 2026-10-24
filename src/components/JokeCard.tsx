import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  Square, 
  Copy, 
  Check, 
  Share2, 
  Bookmark, 
  BookmarkCheck, 
  Eye, 
  Sparkles,
  SmilePlus
} from 'lucide-react';
import { Joke, ReactionType } from '../types';
import { speakJoke, stopSpeaking } from '../utils/speech';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface JokeCardProps {
  joke: Joke | null;
  isSaved: boolean;
  onToggleSave: (joke: Joke) => void;
  revealMode: 'instant' | 'tap';
  isRevealed: boolean;
  onReveal: () => void;
  jokeIndex: number;
  totalJokes: number;
}

export const JokeCard: React.FC<JokeCardProps> = ({
  joke,
  isSaved,
  onToggleSave,
  revealMode,
  isRevealed,
  onReveal,
  jokeIndex,
  totalJokes,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [reactions, setReactions] = useState<Record<ReactionType, number>>({
    laugh: 12,
    skull: 4,
    dad: 7,
    fire: 9,
  });
  const [userReaction, setUserReaction] = useState<ReactionType | null>(null);

  // Reset states when joke changes
  useEffect(() => {
    stopSpeaking();
    setIsSpeaking(false);
    setCopied(false);
    setUserReaction(null);
    // Pseudo-random initial community reaction count for novelty
    if (joke) {
      const hash = joke.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      setReactions({
        laugh: (hash % 20) + 8,
        skull: (hash % 12) + 2,
        dad: (hash % 15) + 3,
        fire: (hash % 18) + 5,
      });
    }
  }, [joke?.id]);

  if (!joke) {
    return (
      <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 sm:p-12 text-center text-slate-400">
        <p>No joke selected. Press &quot;Tell me a joke&quot; to begin!</p>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      const text = `${joke.setup}\n\n${joke.punchline}\n(via Chuckle app)`;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      sound.playTap();
      sound.triggerHaptic(20);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleShare = async () => {
    sound.playTap();
    sound.triggerHaptic(20);
    const shareData = {
      title: 'Chuckle - Here is a joke for you!',
      text: `${joke.setup}\n\n${joke.punchline}`,
      url: window.location.href,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or not supported
      }
    } else {
      // Fallback to copy
      handleCopy();
    }
  };

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    sound.playTap();
    sound.triggerHaptic(15);
    speakJoke(
      joke.setup,
      joke.punchline,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const handleReaction = (type: ReactionType) => {
    sound.playTap();
    sound.triggerHaptic(25);
    if (userReaction === type) {
      setUserReaction(null);
      setReactions((prev) => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }));
    } else {
      setReactions((prev) => {
        const next = { ...prev };
        if (userReaction) {
          next[userReaction] = Math.max(0, next[userReaction] - 1);
        }
        next[type] += 1;
        return next;
      });
      setUserReaction(type);

      // Mini celebration on reaction
      try {
        confetti({
          particleCount: 20,
          spread: 45,
          origin: { y: 0.7 },
          colors: ['#fbbf24', '#f59e0b', '#38bdf8'],
          disableForReducedMotion: true,
        });
      } catch {
        // Ignore
      }
    }
  };

  const showPunchline = revealMode === 'instant' || isRevealed;

  return (
    <motion.div
      key={joke.id}
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.98 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="w-full bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between"
    >
      {/* Subtle background ambient light */}
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-sky-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Metadata Row: Zero-Pill Discipline */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-5 pb-3 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-amber-400 uppercase tracking-wider text-[11px]">
            {joke.category === 'dad' ? 'Dad Groaner' : joke.category.toUpperCase()}
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Joke {jokeIndex} of {totalJokes}</span>
          {joke.tags && joke.tags[0] && (
            <>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>#{joke.tags[0]}</span>
            </>
          )}
        </div>

        {/* Quick Save Bookmark */}
        <button
          onClick={() => {
            sound.playTap();
            sound.triggerHaptic(20);
            onToggleSave(joke);
          }}
          aria-label={isSaved ? 'Remove from saved jokes' : 'Save joke to favorites'}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2 text-slate-400 hover:text-amber-400 active:scale-90 transition-all"
        >
          {isSaved ? (
            <BookmarkCheck className="w-5 h-5 text-amber-400 fill-amber-400/20" />
          ) : (
            <Bookmark className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Setup / The Hook */}
      <div className="py-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white leading-relaxed text-balance">
          &ldquo;{joke.setup}&rdquo;
        </h2>
      </div>

      {/* Punchline Section */}
      <div className="my-6">
        <AnimatePresence mode="wait">
          {showPunchline ? (
            <motion.div
              key="punchline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-amber-400/10 border border-amber-400/30 rounded-2xl p-4 sm:p-5 relative overflow-hidden"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 w-6 h-6 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
                </div>
                <div className="flex-1">
                  <span className="block text-xs uppercase tracking-wider font-bold text-amber-400/80 mb-1">
                    The Punchline
                  </span>
                  <p className="text-lg sm:text-xl font-bold text-amber-200 leading-snug">
                    {joke.punchline}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="tap-reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <button
                onClick={() => {
                  sound.playReveal();
                  sound.triggerHaptic([30, 40]);
                  onReveal();
                }}
                className="w-full py-4 px-5 rounded-2xl border border-dashed border-slate-700 hover:border-amber-400/50 bg-slate-950/40 hover:bg-slate-950/70 text-slate-300 hover:text-amber-300 font-medium text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] min-h-[52px]"
              >
                <Eye className="w-4 h-4 text-amber-400" />
                <span>Tap to reveal punchline</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tactile Utility Row (Audio recitation, copy, share, reactions) */}
      <div className="pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Left: Functional Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={handleToggleSpeak}
            aria-label={isSpeaking ? 'Stop speaking joke' : 'Read joke out loud'}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 ${
              isSpeaking
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/50'
            }`}
          >
            {isSpeaking ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span>Read Out Loud</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopy}
            aria-label="Copy joke text"
            className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95"
            title="Copy Joke"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleShare}
            aria-label="Share joke with friends"
            className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95"
            title="Share with friends"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Share</span>
          </button>
        </div>

        {/* Right: Quick Reactions */}
        <div className="flex items-center gap-1 justify-end">
          <span className="text-[11px] text-slate-500 mr-1 hidden xs:inline">Rate:</span>
          {(['laugh', 'skull', 'dad', 'fire'] as ReactionType[]).map((type) => {
            const emojis: Record<ReactionType, string> = {
              laugh: '😂',
              skull: '💀',
              dad: '🤦',
              fire: '🔥',
            };
            const isSelected = userReaction === type;
            return (
              <button
                key={type}
                onClick={() => handleReaction(type)}
                className={`min-h-[40px] px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all active:scale-90 ${
                  isSelected
                    ? 'bg-amber-400/20 border border-amber-400/50 text-amber-300 shadow-sm'
                    : 'bg-slate-800/40 hover:bg-slate-800 border border-slate-800 text-slate-400'
                }`}
              >
                <span>{emojis[type]}</span>
                <span className="tabular-nums text-[11px] font-mono">{reactions[type]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
