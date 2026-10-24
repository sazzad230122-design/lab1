import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Flame, Filter, Calendar } from 'lucide-react';
import { SeoHelmet } from '../components/common/SeoHelmet';
import { AdSlot } from '../components/common/AdSlot';
import { gamesService } from '../services/gamesService';
import { LeaderboardEntry, Game } from '../types/game';

export const LeaderboardPage: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<string>('all');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    setGames(gamesService.getGames());
    updateLeaderboard('all');
  }, []);

  const updateLeaderboard = (gameId: string) => {
    setSelectedGame(gameId);
    if (gameId === 'all') {
      setLeaderboard(gamesService.getLeaderboard());
    } else {
      setLeaderboard(gamesService.getLeaderboard(gameId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <SeoHelmet
        title="Global Leaderboards & High Scores - PlayHub"
        description="Check out the verified top players and all-time record high scores across all HTML5 arcade games on PlayHub."
      />

      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/90 border border-purple-500/30 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Crown className="w-3.5 h-3.5" />
            Hall of Fame
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
            Global High Score Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Honor the top-performing gamers across the PlayHub universe. Submit your scores after playing any arcade title to claim your spot on the podium!
          </p>
        </div>

        {/* Decorative Trophy glow */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20 hidden md:block">
          <Trophy className="w-48 h-48 text-amber-400" />
        </div>
      </div>

      {/* Filter and Top 3 Podium Cards */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Filter className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-white">Filter Leaderboard by Title:</span>
          </div>

          <select
            value={selectedGame}
            onChange={(e) => updateLeaderboard(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-medium"
          >
            <option value="all">All Games Combined</option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.title}
              </option>
            ))}
          </select>
        </div>

        {/* Top 3 Podium Displays (when at least 3 players exist) */}
        {leaderboard.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            {/* Rank 2 (Silver) */}
            <div className="order-2 md:order-1 rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col items-center text-center shadow-lg relative">
              <div className="w-12 h-12 rounded-full bg-slate-300 text-slate-950 font-extrabold flex items-center justify-center text-lg mb-3 shadow">
                2
              </div>
              <h3 className="font-display font-bold text-base text-white truncate max-w-[200px]">
                {leaderboard[1].playerName}
              </h3>
              <p className="text-xs text-slate-400 truncate max-w-[200px] mb-2">
                {leaderboard[1].gameTitle}
              </p>
              <div className="text-lg font-mono font-bold text-slate-200 tabular-nums">
                {leaderboard[1].score.toLocaleString()} pts
              </div>
            </div>

            {/* Rank 1 (Gold) */}
            <div className="order-1 md:order-2 rounded-2xl bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 p-6 flex flex-col items-center text-center shadow-xl relative -mt-2">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 font-extrabold flex items-center justify-center text-xl mb-3 shadow-lg shadow-amber-500/30">
                <Crown className="w-7 h-7 text-slate-950" />
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-amber-400 mb-1">
                Grand Champion
              </span>
              <h3 className="font-display font-extrabold text-lg text-white truncate max-w-[220px]">
                {leaderboard[0].playerName}
              </h3>
              <p className="text-xs text-slate-300 truncate max-w-[220px] mb-3">
                {leaderboard[0].gameTitle}
              </p>
              <div className="text-2xl font-mono font-extrabold text-amber-400 tabular-nums">
                {leaderboard[0].score.toLocaleString()} pts
              </div>
            </div>

            {/* Rank 3 (Bronze) */}
            <div className="order-3 md:order-3 rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col items-center text-center shadow-lg relative">
              <div className="w-12 h-12 rounded-full bg-amber-700 text-white font-extrabold flex items-center justify-center text-lg mb-3 shadow">
                3
              </div>
              <h3 className="font-display font-bold text-base text-white truncate max-w-[200px]">
                {leaderboard[2].playerName}
              </h3>
              <p className="text-xs text-slate-400 truncate max-w-[200px] mb-2">
                {leaderboard[2].gameTitle}
              </p>
              <div className="text-lg font-mono font-bold text-amber-600 tabular-nums">
                {leaderboard[2].score.toLocaleString()} pts
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" /> Standings
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              {leaderboard.length} verified submissions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-950/50 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4 w-16 text-center">Rank</th>
                  <th className="py-3 px-4">Player</th>
                  <th className="py-3 px-4">Game Title</th>
                  <th className="py-3 px-4">Date Recorded</th>
                  <th className="py-3 px-4 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {leaderboard.map((entry, idx) => (
                  <tr key={entry.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg font-bold text-slate-300">
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full bg-gradient-to-r ${entry.avatarColor} flex items-center justify-center text-white text-xs font-bold`}
                        >
                          {entry.playerName.charAt(0).toUpperCase()}
                        </div>
                        <span>{entry.playerName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{entry.gameTitle}</td>
                    <td className="py-3.5 px-4 text-slate-400">
                      <span className="flex items-center gap-1.5 text-[11px]">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-purple-400 text-sm tabular-nums">
                      {entry.score.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Ad slot */}
      <div className="pt-4 flex justify-center">
        <AdSlot size="leaderboard" slotId="leaderboard-bottom-banner" />
      </div>
    </div>
  );
};
