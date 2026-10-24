import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, ChevronLeft, ChevronRight, Star, Flame, Sparkles, Info } from 'lucide-react';
import { Game } from '../../types/game';

interface HeroCarouselProps {
  games: Game[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ games }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto rotate every 6 seconds
  useEffect(() => {
    if (games.length <= 1 || isHovered) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % games.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [games.length, isHovered]);

  if (!games || games.length === 0) return null;

  const currentGame = games[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? games.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % games.length);
  };

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Featured Games Carousel"
    >
      {/* Background Image with Cinematic Scrim */}
      <div className="relative w-full h-[380px] sm:h-[440px] md:h-[480px] overflow-hidden">
        <img
          src={currentGame.thumbnail}
          alt={currentGame.title}
          className="w-full h-full object-cover transition-all duration-700 transform scale-100 group-hover:scale-105"
        />

        {/* Multi-layered dark & colorful gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent w-full md:w-3/4 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-purple-950/20 mix-blend-color-dodge z-10" />

        {/* Hero Content Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-10 md:p-12 max-w-2xl">
          {/* Kicker badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-600/90 text-white backdrop-blur-md flex items-center gap-1.5 shadow-lg shadow-purple-900/50">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Featured Spotlight
            </span>
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider capitalize">
              {currentGame.category}
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3"
            style={{ textWrap: 'balance' }}
          >
            {currentGame.title}
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-300 line-clamp-2 sm:line-clamp-3 mb-6 max-w-xl leading-relaxed">
            {currentGame.description}
          </p>

          {/* Metadata Row */}
          <div className="flex items-center gap-4 text-xs text-slate-300 mb-6 font-medium">
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span className="text-white text-sm tabular-nums">{currentGame.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({currentGame.ratingCount} reviews)</span>
            </div>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <div className="flex items-center gap-1.5 tabular-nums">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>{currentGame.plays.toLocaleString()} plays</span>
            </div>
            {currentGame.developer && (
              <>
                <span className="text-slate-600 hidden sm:inline" aria-hidden="true">·</span>
                <span className="text-slate-400 hidden sm:inline">{currentGame.developer}</span>
              </>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-4">
            <Link
              to={`/game/${currentGame.slug}`}
              className="px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-purple-600/40 hover:shadow-purple-500/60 transition-all transform hover:-translate-y-0.5 flex items-center gap-2.5"
            >
              <Play className="w-5 h-5 fill-white ml-0.5" />
              <span>Play Now</span>
            </Link>

            <Link
              to={`/game/${currentGame.slug}`}
              className="px-5 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700/80 backdrop-blur-md transition-colors flex items-center gap-2"
            >
              <Info className="w-4 h-4 text-purple-400" />
              <span>How to Play</span>
            </Link>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          aria-label="Previous featured game"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-950/60 hover:bg-purple-600 text-white backdrop-blur-md border border-slate-700/60 hover:border-purple-500 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next featured game"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-950/60 hover:bg-purple-600 text-white backdrop-blur-md border border-slate-700/60 hover:border-purple-500 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 right-6 z-30 flex items-center gap-2">
          {games.map((g, idx) => (
            <button
              key={g.id}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}: ${g.title}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-8 bg-purple-500 shadow-sm shadow-purple-400'
                  : 'w-2 bg-slate-600/70 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
