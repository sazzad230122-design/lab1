import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import {
  ChevronRight,
  Filter,
  ArrowUpDown,
  Gamepad2,
  Puzzle,
  Swords,
  Gauge,
  Compass,
  Brain,
} from 'lucide-react';
import { SeoHelmet } from '../components/common/SeoHelmet';
import { GameCard } from '../components/games/GameCard';
import { AdSlot } from '../components/common/AdSlot';
import { gamesService } from '../services/gamesService';
import { Game, CategoryInfo } from '../types/game';

const categoryIcons: { [key: string]: React.FC<{ className?: string }> } = {
  Puzzle,
  Swords,
  Gauge,
  Gamepad2,
  Compass,
  Brain,
};

type SortOption = 'popular' | 'newest' | 'rating' | 'az';

export const CategoryPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [games, setGames] = useState<Game[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<CategoryInfo | null>(null);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get('sort') as SortOption) || 'popular'
  );
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const isAll = !name || name === 'all';

  useEffect(() => {
    const allCats = gamesService.getCategories();
    setCategories(allCats);

    if (isAll) {
      setGames(gamesService.getGames());
      setCategoryInfo(null);
    } else {
      const found = allCats.find((c) => c.slug.toLowerCase() === name.toLowerCase());
      setCategoryInfo(found || null);
      setGames(gamesService.getGamesByCategory(name));
    }

    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [name, isAll]);

  // Handle Sort Change
  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setSearchParams({ sort: newSort });
  };

  // Sorted and Paginated Games
  const sortedGames = useMemo(() => {
    const clone = [...games];
    switch (sortBy) {
      case 'popular':
        return clone.sort((a, b) => b.plays - a.plays);
      case 'newest':
        return clone.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'rating':
        return clone.sort((a, b) => b.rating - a.rating);
      case 'az':
        return clone.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return clone;
    }
  }, [games, sortBy]);

  const totalPages = Math.ceil(sortedGames.length / pageSize);
  const paginatedGames = sortedGames.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const IconComponent = categoryInfo
    ? categoryIcons[categoryInfo.iconName] || Gamepad2
    : Gamepad2;

  const title = categoryInfo ? `${categoryInfo.name} Games` : 'All Online Games';
  const description = categoryInfo
    ? `Play the best free ${categoryInfo.name.toLowerCase()} HTML5 games online on PlayHub. ${categoryInfo.description}`
    : 'Browse all free online browser games on PlayHub. Instant play, no downloads.';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SeoHelmet title={`${title} - Free Play on PlayHub`} description={description} />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-purple-400 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link to="/category/all" className="hover:text-purple-400 transition-colors">
          Categories
        </Link>
        {categoryInfo && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-200 font-medium">{categoryInfo.name}</span>
          </>
        )}
      </nav>

      {/* Category Hero Header Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg ${
                categoryInfo ? `bg-gradient-to-br ${categoryInfo.gradient}` : 'bg-gradient-to-br from-purple-600 to-indigo-600'
              }`}
            >
              <IconComponent className="w-8 h-8" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-1">
                {title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                {description}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-2 font-mono">
                <span>{games.length} total games available</span>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            <Link
              to="/category/all"
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                isAll
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/category/${c.slug}`}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  name === c.slug
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Controls Bar: Sort, View Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Filter className="w-4 h-4 text-purple-400" />
          <span>
            Showing <strong className="text-white">{paginatedGames.length}</strong> of{' '}
            <strong className="text-white">{games.length}</strong> games
          </span>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-medium"
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest Releases</option>
            <option value="rating">Highest Rated</option>
            <option value="az">Alphabetical (A–Z)</option>
          </select>
        </div>
      </div>

      {/* Games Grid */}
      {paginatedGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-2xl bg-slate-900/40 border border-slate-800 p-8">
          <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Games Found</h3>
          <p className="text-xs text-slate-400 mb-4">
            No games are listed under this genre yet. Check back soon!
          </p>
          <Link
            to="/category/all"
            className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold"
          >
            Explore All Games
          </Link>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-colors ${
                currentPage === idx + 1
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {idx + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Bottom Ad Slot */}
      <div className="pt-8 flex justify-center">
        <AdSlot size="leaderboard" slotId="category-bottom-banner" />
      </div>
    </div>
  );
};
