/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { CategoryPills } from './components/CategoryPills';
import { JokeCard } from './components/JokeCard';
import { ActionControls } from './components/ActionControls';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { JOKES } from './data/jokes';
import { Joke, JokeCategory, SavedJoke } from './types';
import { sound } from './utils/audio';
import confetti from 'canvas-confetti';
import { Smartphone, Monitor, Laugh } from 'lucide-react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<JokeCategory>('all');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => sound.isEnabled());
  const [revealMode, setRevealMode] = useState<'instant' | 'tap'>('instant');
  const [isRevealed, setIsRevealed] = useState<boolean>(true);
  const [savedJokes, setSavedJokes] = useState<SavedJoke[]>(() => {
    try {
      const stored = localStorage.getItem('chuckle_saved_jokes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [phoneFrameMode, setPhoneFrameMode] = useState(false);

  // Filter jokes based on active category
  const filteredJokes = useMemo(() => {
    if (activeCategory === 'all') return JOKES;
    return JOKES.filter((j) => j.category === activeCategory);
  }, [activeCategory]);

  // Joke counts by category
  const jokeCounts = useMemo(() => {
    const counts: Record<JokeCategory, number> = {
      all: JOKES.length,
      dad: 0,
      tech: 0,
      clever: 0,
      oneliners: 0,
      animals: 0,
    };
    JOKES.forEach((j) => {
      if (counts[j.category] !== undefined) {
        counts[j.category]++;
      }
    });
    return counts;
  }, []);

  // Shuffled index tracker to avoid repeating jokes too quickly
  const [currentIndex, setCurrentIndex] = useState(0);
  const [historyIds, setHistoryIds] = useState<string[]>([]);

  // Current active joke
  const currentJoke = filteredJokes[currentIndex % filteredJokes.length] || JOKES[0];

  // Save jokes to local storage
  useEffect(() => {
    try {
      localStorage.setItem('chuckle_saved_jokes', JSON.stringify(savedJokes));
    } catch {
      // Ignore
    }
  }, [savedJokes]);

  // Main action: Tell me a joke!
  const handleTellJoke = useCallback(() => {
    sound.playTap();
    sound.triggerHaptic([20, 25]);

    // Choose next joke index
    let nextIdx = (currentIndex + 1) % filteredJokes.length;
    // If there are multiple jokes, ensure we pick a different one
    if (filteredJokes.length > 1 && nextIdx === currentIndex) {
      nextIdx = (nextIdx + 1) % filteredJokes.length;
    }

    setCurrentIndex(nextIdx);
    setIsRevealed(revealMode === 'instant');

    // Confetti effect
    try {
      confetti({
        particleCount: 28,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#f59e0b', '#38bdf8', '#10b981', '#f43f5e'],
        disableForReducedMotion: true,
      });
    } catch {
      // Safe fallback
    }

    // Play reveal sound if instant mode
    if (revealMode === 'instant') {
      setTimeout(() => sound.playReveal(), 120);
    }
  }, [currentIndex, filteredJokes.length, revealMode]);

  // Handle category change
  const handleSelectCategory = (cat: JokeCategory) => {
    sound.playTap();
    sound.triggerHaptic(15);
    setActiveCategory(cat);
    setCurrentIndex(0);
    setIsRevealed(revealMode === 'instant');
  };

  // Toggle favorite
  const handleToggleSave = (joke: Joke) => {
    setSavedJokes((prev) => {
      const exists = prev.some((j) => j.id === joke.id);
      if (exists) {
        return prev.filter((j) => j.id !== joke.id);
      } else {
        return [{ ...joke, savedAt: Date.now() }, ...prev];
      }
    });
  };

  const handleRemoveSaved = (jokeId: string) => {
    setSavedJokes((prev) => prev.filter((j) => j.id !== jokeId));
  };

  const handleClearSaved = () => {
    setSavedJokes([]);
  };

  const handleSelectSavedJoke = (joke: Joke) => {
    const idx = filteredJokes.findIndex((j) => j.id === joke.id);
    if (idx !== -1) {
      setCurrentIndex(idx);
    } else {
      setActiveCategory('all');
      const allIdx = JOKES.findIndex((j) => j.id === joke.id);
      if (allIdx !== -1) setCurrentIndex(allIdx);
    }
    setIsRevealed(true);
  };

  // Sound toggle
  const handleToggleSound = () => {
    const nextState = sound.toggleSound();
    setSoundEnabled(nextState);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        handleTellJoke();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTellJoke]);

  const isCurrentSaved = savedJokes.some((j) => j.id === currentJoke?.id);

  return (
    <div className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Header */}
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        savedCount={savedJokes.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        activeTab="joke"
        setActiveTab={() => {}}
      />

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-between p-4 sm:p-6 md:p-8 max-w-4xl mx-auto w-full">
        {/* Responsive Content Wrapper / Optional Phone View Toggle */}
        <div
          className={`w-full transition-all duration-300 flex flex-col items-center gap-5 sm:gap-6 ${
            phoneFrameMode
              ? 'max-w-[400px] border-4 border-slate-800 rounded-[44px] p-5 shadow-2xl bg-slate-950 relative my-2'
              : 'max-w-xl'
          }`}
        >
          {/* Subtle Dynamic Island Notch in Phone Preview Mode */}
          {phoneFrameMode && (
            <div className="w-28 h-5 bg-black rounded-full mb-1 flex items-center justify-end px-3">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
            </div>
          )}

          {/* Subheader / Welcome Kicker */}
          <div className="text-center w-full">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400/90 mb-1">
              <Laugh className="w-3.5 h-3.5" />
              <span>Tap below anytime for instant humor</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-balance">
              Need a Good Laugh?
            </h1>
          </div>

          {/* Category Tabs */}
          <CategoryPills
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
            jokeCounts={jokeCounts}
          />

          {/* Focal Joke Card */}
          <div className="w-full">
            <JokeCard
              joke={currentJoke}
              isSaved={isCurrentSaved}
              onToggleSave={handleToggleSave}
              revealMode={revealMode}
              isRevealed={isRevealed}
              onReveal={() => setIsRevealed(true)}
              jokeIndex={(currentIndex % filteredJokes.length) + 1}
              totalJokes={filteredJokes.length}
            />
          </div>

          {/* Natural Thumb Zone Action: 'Tell me a joke' */}
          <div className="w-full pb-safe">
            <ActionControls
              onTellJoke={handleTellJoke}
              revealMode={revealMode}
              onToggleRevealMode={() => {
                sound.playTap();
                sound.triggerHaptic(15);
                setRevealMode((prev) => {
                  const next = prev === 'instant' ? 'tap' : 'instant';
                  if (next === 'instant') setIsRevealed(true);
                  return next;
                });
              }}
            />
          </div>
        </div>

        {/* Desktop View Switcher & Footer */}
        <footer className="mt-8 pt-4 border-t border-slate-900 w-full flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-2">
            <span>Optimized for iPhone &amp; Android Touch</span>
            <span aria-hidden="true">·</span>
            <span>Zero-latency offline ready</span>
          </div>

          {/* Desktop Simulator Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPhoneFrameMode(!phoneFrameMode)}
              className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 flex items-center gap-1.5 transition-colors text-[11px]"
              title="Toggle Phone Simulator preview frame"
            >
              {phoneFrameMode ? (
                <>
                  <Monitor className="w-3 h-3" />
                  <span>Responsive View</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3 h-3" />
                  <span>Phone Frame Mode</span>
                </>
              )}
            </button>
          </div>
        </footer>
      </main>

      {/* Saved Favorites Drawer / Sheet */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        savedJokes={savedJokes}
        onSelectJoke={handleSelectSavedJoke}
        onRemoveSaved={handleRemoveSaved}
        onClearAll={handleClearSaved}
      />
    </div>
  );
}
