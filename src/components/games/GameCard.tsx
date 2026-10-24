import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Flame, Sparkles } from 'lucide-react';
import { Game } from '../../types/game';

interface GameCardProps {
  game: Game;
  priority?: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({ game, priority = false }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      to={`/game/${game.slug}`}
      className="group relative flex flex-col rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-purple-500/60 transition-all duration-300 hover:shadow-xl hover:shadow-purple-950/30 hover:-translate-y-1 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
        {!imgError ? (
          <img
            src={game.thumbnail}
            alt={`${game.title} thumbnail`}
            loading={priority ? 'eager' : 'lazy'}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-slate-950 via-purple-950/40 to-slate-900 flex flex-col items-center justify-center p-4 text-center">
            <span className="text-3xl mb-1">🎮</span>
            <span className="text-xs font-bold text-slate-200">{game.title}</span>
          </div>
        )}

        {/* Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 opacity-80 group-hover:opacity-40 transition-opacity" />

        {/* Feature / New Badge (Unobtrusive) */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          {game.isNew && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase bg-emerald-500 text-slate-950 shadow">
              New
            </span>
          )}
          {game.isFeatured && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase bg-purple-600 text-white shadow flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Featured
            </span>
          )}
        </div>

        {/* Rating Ribbon on thumbnail */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-sm border border-slate-700/50 text-amber-400 text-xs font-semibold">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-slate-100 text-[11px] tabular-nums">{game.rating.toFixed(1)}</span>
        </div>

        {/* Play Now Hover Action Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-purple-950/40 backdrop-blur-[2px]">
          <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-1.5">
        <div>
          <h3 className="font-display text-sm font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
            {game.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
            {game.description}
          </p>
        </div>

        {/* Clean unboxed metadata with typographic separators */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60 mt-auto">
          <span className="capitalize font-medium text-slate-300">
            {game.category.replace('-', ' ')}
          </span>
          <div className="flex items-center gap-1 text-slate-400 tabular-nums">
            <Flame className="w-3 h-3 text-orange-400" />
            <span>{game.plays.toLocaleString()} plays</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
