import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, Gamepad2, X } from 'lucide-react';
import { SeoHelmet } from '../components/common/SeoHelmet';
import { GameCard } from '../components/games/GameCard';
import { AdSlot } from '../components/common/AdSlot';
import { gamesService } from '../services/gamesService';
import { Game, CategoryInfo } from '../types/game';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [query, setQuery] = useState(queryParam);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'popular' | 'rating' | 'newest'>('relevance');
  const [categories, setCategories] = useState<CategoryInfo[]>([]);

  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    setCategories(gamesService.getCategories());
  }, []);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setSearchParams(val ? { q: val } : {});
  };

  const allGames = useMemo(() => gamesService.getGames(), []);

  // Filtered and sorted results
  const results = useMemo(() => {
    let filtered = allGames;

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          g.tags.some((t) => t.toLowerCase().includes(q)) ||
          (g.developer && g.developer.toLowerCase().includes(q))
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((g) => g.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    // Sort
    const clone = [...filtered];
    switch (sortBy) {
      case 'popular':
        return clone.sort((a, b) => b.plays - a.plays);
      case 'rating':
        return clone.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return clone.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'relevance':
      default:
        return clone;
    }
  }, [allGames, query, categoryFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SeoHelmet
        title={query ? `Search results for "${query}" - PlayHub` : 'Search Free HTML5 Games - PlayHub'}
        description={`Find free online games on PlayHub matching ${query || 'your favorite genres'}.`}
      />

      {/* Search Header Banner */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-4">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
          Game Library Search
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Find games by title, genre, mechanics, tags, or developer keywords.
        </p>

        {/* Live Search Input */}
        <div className="relative max-w-2xl">
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Type game name, genre (e.g. racing, space, puzzle)..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl px-4 py-3 pl-11 pr-10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 shadow-inner"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          {query && (
            <button
              onClick={() => handleQueryChange('')}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Chips & Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-800">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Genre:
            </span>
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                categoryFilter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoryFilter(c.slug)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                  categoryFilter === c.slug
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'relevance' | 'popular' | 'rating' | 'newest')}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-medium"
            >
              <option value="relevance">Relevance</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Releases</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count Summary */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>
          Found <strong className="text-white">{results.length}</strong> {results.length === 1 ? 'game' : 'games'}
          {query ? ` for "${query}"` : ''}
        </span>
      </div>

      {/* Search Results Grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-3xl bg-slate-900/40 border border-slate-800 p-8 space-y-4">
          <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h2 className="text-xl font-bold text-white">No Matching Games Found</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            We couldn&apos;t find any games matching your search query. Try searching for different keywords or explore our popular categories below.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/category/${c.slug}`}
                className="px-3 py-1.5 bg-slate-800 hover:bg-purple-600 text-slate-200 hover:text-white rounded-xl text-xs font-semibold transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Ad Slot */}
      <div className="pt-8 flex justify-center">
        <AdSlot size="leaderboard" slotId="search-bottom-banner" />
      </div>
    </div>
  );
};
