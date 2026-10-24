import React from 'react';
import { JokeCategory } from '../types';
import { CATEGORIES } from '../data/jokes';

interface CategoryPillsProps {
  activeCategory: JokeCategory;
  onSelectCategory: (cat: JokeCategory) => void;
  jokeCounts: Record<JokeCategory, number>;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  activeCategory,
  onSelectCategory,
  jokeCounts,
}) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-2 min-w-max">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95 ${
                isActive
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-md shadow-amber-400/20'
                  : 'bg-slate-900/90 text-slate-300 border border-slate-800/80 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span
                className={`text-[11px] tabular-nums px-1.5 py-0.5 rounded-md ${
                  isActive ? 'bg-slate-950/20 text-slate-900 font-bold' : 'text-slate-400'
                }`}
              >
                {jokeCounts[cat.id] ?? 0}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
