import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Clock,
  Trophy,
  ArrowRight,
  Puzzle,
  Swords,
  Gauge,
  Gamepad2,
  Compass,
  Brain,
  Filter,
} from 'lucide-react';
import { SeoHelmet } from '../components/common/SeoHelmet';
import { AdSlot } from '../components/common/AdSlot';
import { HeroCarousel } from '../components/games/HeroCarousel';
import { GameCard } from '../components/games/GameCard';
import { Sidebar } from '../components/home/Sidebar';
import { gamesService } from '../services/gamesService';
import { Game, CategoryInfo, LeaderboardEntry } from '../types/game';

const categoryIcons: { [key: string]: React.FC<{ className?: string }> } = {
  Puzzle,
  Swords,
  Gauge,
  Gamepad2,
  Compass,
  Brain,
};

export const HomePage: React.FC = () => {
  const [featuredGames, setFeaturedGames] = useState<Game[]>([]);
  const [popularGames, setPopularGames] = useState<Game[]>([]);
  const [newGames, setNewGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedLeaderboardGame, setSelectedLeaderboardGame] = useState<string>('all');

  useEffect(() => {
    setFeaturedGames(gamesService.getFeaturedGames());
    setPopularGames(gamesService.getPopularGames(8));
    setNewGames(gamesService.getNewGames(6));
    setCategories(gamesService.getCategories());
    setLeaderboard(gamesService.getLeaderboard());
  }, []);

  const handleLeaderboardFilter = (gameId: string) => {
    setSelectedLeaderboardGame(gameId);
    if (gameId === 'all') {
      setLeaderboard(gamesService.getLeaderboard());
    } else {
      setLeaderboard(gamesService.getLeaderboard(gameId));
    }
  };

  return (
    <div className="space-y-10 pb-16">
      <SeoHelmet
        title="Play Free Online HTML5 Games - PlayHub"
        description="Play the best free online HTML5 games on PlayHub. Instant play, no downloads. Puzzle, Action, Racing, Arcade, Adventure, and Brain Training."
      />

      {/* 1. Top Leaderboard Banner Ad (728x90) */}
      <section className="pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex justify-center">
        <AdSlot size="leaderboard" slotId="home-top-leaderboard" />
      </section>

      {/* 2. Featured Game Hero Carousel */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <HeroCarousel games={featuredGames} />
      </section>

      {/* 3. Category Chips / Cards */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
            Browse by Genre
          </h2>
          <Link
            to="/category/all"
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
          >
            All Genres <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {categories.map((cat) => {
            const IconComponent = categoryIcons[cat.iconName] || Gamepad2;
            const count = gamesService.getGamesByCategory(cat.slug).length;

            return (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-purple-500/50 hover:bg-slate-800/70 transition-all hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 text-center"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-white mb-2.5 shadow-md group-hover:scale-110 transition-transform`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="font-display text-sm font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {count} {count === 1 ? 'game' : 'games'}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Main Two-Column Layout (Content Grid + Sidebar) */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Main Content Column */}
        <main className="flex-1 min-w-0 space-y-12">
          
          {/* Section: Popular Games */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Flame className="w-4 h-4" />
                </div>
                <h2 className="font-display text-xl font-bold text-white">Popular Games</h2>
              </div>
              <Link
                to="/category/all?sort=popular"
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
              >
                View all ({popularGames.length}) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Grid of Popular Games with integrated in-grid ad slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {popularGames.slice(0, 5).map((game, idx) => (
                <GameCard key={game.id} game={game} priority={idx < 2} />
              ))}
              
              {/* In-Grid Native Ad Slot */}
              <AdSlot size="in-grid" slotId="home-ingrid-native-1" />

              {popularGames.slice(5).map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </section>

          {/* Section: New Games */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Clock className="w-4 h-4" />
                </div>
                <h2 className="font-display text-xl font-bold text-white">New Releases</h2>
              </div>
              <Link
                to="/category/all?sort=newest"
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
              >
                View all new <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {newGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </section>

          {/* Section: Leaderboard / Hall of Fame */}
          <section className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-white">Global Leaderboard</h2>
                  <p className="text-xs text-slate-400">Top 10 highest verified game scores</p>
                </div>
              </div>

              {/* Game filter dropdown */}
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedLeaderboardGame}
                  onChange={(e) => handleLeaderboardFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="all">All Games</option>
                  {gamesService.getGames().map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Leaderboard Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="pb-3 px-3 w-12 text-center">Rank</th>
                    <th className="pb-3 px-3">Player</th>
                    <th className="pb-3 px-3">Game</th>
                    <th className="pb-3 px-3 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {leaderboard.slice(0, 10).map((entry, index) => {
                    const isTop1 = index === 0;
                    const isTop2 = index === 1;
                    const isTop3 = index === 2;

                    return (
                      <tr
                        key={entry.id}
                        className="hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-lg font-bold ${
                              isTop1
                                ? 'bg-amber-400 text-slate-950 shadow'
                                : isTop2
                                ? 'bg-slate-300 text-slate-950'
                                : isTop3
                                ? 'bg-amber-700 text-white'
                                : 'text-slate-400'
                            }`}
                          >
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-100">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-6 h-6 rounded-full bg-gradient-to-r ${entry.avatarColor} flex items-center justify-center text-white text-[10px] font-bold`}
                            >
                              {entry.playerName.charAt(0).toUpperCase()}
                            </div>
                            <span>{entry.playerName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-300">
                          {entry.gameTitle}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-purple-400 text-sm tabular-nums">
                          {entry.score.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Play any game and submit your score to claim your rank!</span>
              <Link to="/leaderboard" className="text-purple-400 hover:text-purple-300 font-semibold">
                Full Standings &rarr;
              </Link>
            </div>
          </section>

        </main>

        {/* Right Sidebar (Desktop only, collapses below content on mobile) */}
        <Sidebar />

      </div>
    </div>
  );
};
