import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Sparkles, Check, ArrowRight, Zap, Crown } from 'lucide-react';
import { AdSlot } from '../common/AdSlot';
import { gamesService } from '../../services/gamesService';
import { LeaderboardEntry } from '../../types/game';

export const Sidebar: React.FC = () => {
  const [topScores, setTopScores] = useState<LeaderboardEntry[]>([]);
  const [email, setEmail] = useState('');
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Top 5 global scores
    const lb = gamesService.getLeaderboard().slice(0, 5);
    setTopScores(lb);
  }, []);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setLoading(true);
    setTimeout(() => {
      gamesService.joinWaitlist(email.trim(), 'yearly');
      setLoading(false);
      setWaitlistSuccess(true);
      setEmail('');
    }, 400);
  };

  return (
    <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
      
      {/* 1. Sidebar Ad Slot (300x250 IAB standard) */}
      <div className="flex justify-center">
        <AdSlot size="medium-rectangle" slotId="sidebar-rect-1" />
      </div>

      {/* 2. Mini "Top Players" Leaderboard */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800/80 p-4 shadow-lg">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
            <h3 className="font-display text-sm font-bold text-white">Top Champions</h3>
          </div>
          <Link
            to="/leaderboard"
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-0.5"
          >
            All Scores <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {topScores.map((entry, idx) => {
            const isFirst = idx === 0;
            const isSecond = idx === 1;
            const isThird = idx === 2;

            return (
              <div
                key={entry.id}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-950/50 hover:bg-slate-800/60 transition-colors border border-slate-800/50 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Rank Badge */}
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0 ${
                      isFirst
                        ? 'bg-amber-400 text-slate-950 shadow-sm'
                        : isSecond
                        ? 'bg-slate-300 text-slate-950'
                        : isThird
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {idx + 1}
                  </span>

                  {/* Player and Game */}
                  <div className="min-w-0">
                    <p className="font-bold text-slate-200 truncate flex items-center gap-1">
                      {entry.playerName}
                      {isFirst && <Crown className="w-3 h-3 text-amber-400 shrink-0 inline" />}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {entry.gameTitle.split(':')[0]}
                    </p>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-purple-300 tabular-nums">
                    {entry.score.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Premium Promo Card ("Go Ad-Free") */}
      <div className="relative rounded-2xl bg-gradient-to-br from-purple-950/80 via-slate-900 to-indigo-950/90 border border-purple-500/30 p-5 shadow-xl overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h3 className="font-display text-sm font-extrabold text-white">PlayHub VIP</h3>
            <p className="text-[11px] text-purple-300 font-medium">100% Ad-Free Gaming</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 mb-3.5 leading-relaxed">
          Level up your gameplay with zero banner interruptions and VIP perks.
        </p>

        {/* Benefits list */}
        <ul className="space-y-1.5 text-xs text-slate-300 mb-4">
          <li className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>100% Zero Ads & popups</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Early access to new weekly releases</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Exclusive VIP player badges</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>High-speed cloud game servers</span>
          </li>
        </ul>

        {/* Waitlist email form */}
        {!waitlistSuccess ? (
          <form onSubmit={handleWaitlistSubmit} className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs rounded-xl shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" />
              {loading ? 'Joining...' : 'Join VIP Waitlist'}
            </button>
            <p className="text-[10px] text-slate-400 text-center">
              No credit card required. Free beta access.
            </p>
          </form>
        ) : (
          <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-center">
            <Check className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
            <p className="text-xs font-bold text-emerald-300">You're on the VIP list!</p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              We'll notify you as soon as VIP invitations open.
            </p>
          </div>
        )}
      </div>

    </aside>
  );
};
