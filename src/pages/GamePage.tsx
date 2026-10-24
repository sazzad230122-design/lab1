import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Maximize2,
  Minimize2,
  Star,
  Flame,
  Share2,
  Check,
  Send,
  Trophy,
  Info,
  Sparkles,
  Gamepad2,
  ChevronRight,
  Heart,
} from 'lucide-react';
import { SeoHelmet } from '../components/common/SeoHelmet';
import { AdSlot } from '../components/common/AdSlot';
import { BuiltinGameEngine } from '../components/games/BuiltinGameEngines';
import { GameCard } from '../components/games/GameCard';
import { gamesService } from '../services/gamesService';
import { Game, LeaderboardEntry } from '../types/game';

export const GamePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [relatedGames, setRelatedGames] = useState<Game[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [hasRated, setHasRated] = useState(false);

  // Score submission form state
  const [playerName, setPlayerName] = useState('');
  const [submittedScore, setSubmittedScore] = useState<number | string>('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [gameLeaderboard, setGameLeaderboard] = useState<LeaderboardEntry[]>([]);

  const gameAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slug) return;
    const found = gamesService.getGameBySlug(slug);
    if (found) {
      setGame(found);
      setRelatedGames(gamesService.getRelatedGames(found, 4));
      setGameLeaderboard(gamesService.getLeaderboard(found.id));
      // Increment play count
      gamesService.incrementPlays(found.id);
      setIsFavorite(gamesService.getFavorites().includes(found.id));
    } else {
      setGame(null);
    }
    // Reset submission state
    setSubmitSuccess(false);
    setHasRated(false);
    setUserRating(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Handle Fullscreen
  const toggleFullscreen = () => {
    if (!gameAreaRef.current) return;
    if (!document.fullscreenElement) {
      gameAreaRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Handle Favorite Toggle
  const handleToggleFavorite = () => {
    if (!game) return;
    const fav = gamesService.toggleFavorite(game.id);
    setIsFavorite(fav);
  };

  // Handle User Star Rating
  const handleRate = (rating: number) => {
    if (!game || hasRated) return;
    const res = gamesService.rateGame(game.id, rating);
    if (res) {
      setGame({ ...game, rating: res.rating, ratingCount: res.ratingCount });
      setUserRating(rating);
      setHasRated(true);
    }
  };

  // Handle Score Submission
  const handleScoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!game || !playerName.trim() || !submittedScore) return;

    const numScore = Number(submittedScore);
    if (isNaN(numScore) || numScore <= 0) return;

    gamesService.addLeaderboardEntry({
      gameId: game.id,
      gameTitle: game.title,
      playerName: playerName.trim(),
      score: numScore,
    });

    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}

    setSubmitSuccess(true);
    setGameLeaderboard(gamesService.getLeaderboard(game.id));
    setPlayerName('');
    setSubmittedScore('');
  };

  // Share game URL
  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: game?.title || 'Play on PlayHub',
        text: `Play ${game?.title} for free on PlayHub!`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  if (!game) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-white mb-3">Game Not Found</h1>
        <p className="text-sm text-slate-400 mb-6">
          The game you requested doesn't exist or may have been updated.
        </p>
        <Link
          to="/"
          className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-sm hover:bg-purple-500 transition-colors"
        >
          Return to PlayHub Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Dynamic SEO Meta */}
      <SeoHelmet
        title={`${game.title} - Play Free Online HTML5 Game`}
        description={game.description}
        image={game.thumbnail}
        type="game"
        canonicalUrl={window.location.href}
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-400" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-purple-400 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link
          to={`/category/${game.category}`}
          className="capitalize hover:text-purple-400 transition-colors"
        >
          {game.category.replace('-', ' ')}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-slate-200 font-medium truncate max-w-xs">{game.title}</span>
      </nav>

      {/* Top Ad Slot (728x90) */}
      <div className="flex justify-center">
        <AdSlot size="leaderboard" slotId={`game-top-${game.id}`} />
      </div>

      {/* Main Game Stage Area & Controls */}
      <div className="space-y-4">
        {/* Playable Game Window (16:9 ratio) */}
        <div
          ref={gameAreaRef}
          className={`relative w-full aspect-[16/9] bg-slate-950 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-800 shadow-2xl ${
            isFullscreen ? 'rounded-none border-0' : ''
          }`}
        >
          <BuiltinGameEngine
            engineId={game.builtinEngineId}
            embedUrl={game.embedUrl}
            gameTitle={game.title}
            onScoreAchieved={(achievedScore) => {
              setSubmittedScore(achievedScore);
            }}
          />

          {/* Fullscreen Button in Game Window */}
          <div className="absolute top-3 left-3 z-30">
            <button
              onClick={toggleFullscreen}
              className="p-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-200 hover:text-white hover:bg-slate-800 shadow transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
            </button>
          </div>
        </div>

        {/* Game Title, Metrics, and Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                {game.category.replace('-', ' ')}
              </span>
              {game.developer && (
                <>
                  <span className="text-slate-600" aria-hidden="true">·</span>
                  <span className="text-xs text-slate-400 font-medium">By {game.developer}</span>
                </>
              )}
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              {game.title}
            </h1>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {/* Plays Metric */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 tabular-nums">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>{game.plays.toLocaleString()} plays</span>
            </div>

            {/* Favorite Button */}
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                isFavorite
                  ? 'bg-rose-950/60 border-rose-500/50 text-rose-400'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-400' : ''}`} />
              <span className="hidden sm:inline">{isFavorite ? 'Saved' : 'Save'}</span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Share this game"
            >
              {copiedShare ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-purple-400" />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Two Columns: Game Details & Instructions + Score Submission & Mini Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols): Instructions, Description, Controls */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Instructions and Controls */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-md space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <h2 className="font-display text-lg font-bold text-white">How to Play & Controls</h2>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {game.instructions}
            </p>

            {/* Keybindings Table */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Keybindings & Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {game.controls.map((ctrl, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs"
                  >
                    <span className="text-slate-400">{ctrl.action}</span>
                    <kbd className="px-2 py-1 rounded-md bg-slate-900 border border-slate-700 text-purple-300 font-mono text-[11px] font-bold shadow-sm">
                      {ctrl.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>

            {/* Description & Game Tags */}
            <div className="pt-4 border-t border-slate-800/80 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                About {game.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {game.description}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs text-slate-400 font-medium">Tags:</span>
                {game.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-slate-300 font-medium hover:text-purple-300 cursor-default"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive User Rating */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-300">Rate this game</p>
                <p className="text-[11px] text-slate-400">
                  Current: {game.rating.toFixed(1)} / 5 ({game.ratingCount} ratings)
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRate(star)}
                    disabled={hasRated}
                    className={`p-1 rounded transition-transform hover:scale-110 ${
                      (userRating || Math.round(game.rating)) >= star
                        ? 'text-amber-400'
                        : 'text-slate-600'
                    }`}
                    title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    <Star className="w-5 h-5 fill-current" />
                  </button>
                ))}
                {hasRated && (
                  <span className="text-xs text-emerald-400 font-medium ml-2">Thanks!</span>
                )}
              </div>
            </div>
          </div>

          {/* Related Games Shelf */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-white">Related Games</h2>
              <Link
                to={`/category/${game.category}`}
                className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
              >
                More in {game.category} &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {relatedGames.map((rel) => (
                <GameCard key={rel.id} game={rel} />
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Submit Score & Game Specific Leaderboard */}
        <div className="space-y-6">
          
          {/* Submit Your Score Card */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-purple-950/40 border border-purple-500/30 p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white shadow-md">
                <Trophy className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h3 className="font-display text-sm font-bold text-white">Submit High Score</h3>
                <p className="text-[11px] text-purple-300">Compete on the global board</p>
              </div>
            </div>

            {!submitSuccess ? (
              <form onSubmit={handleScoreSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Player Name / Gamer Tag
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={18}
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="e.g. CyberKnight"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Score Achieved
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={submittedScore}
                    onChange={(e) => setSubmittedScore(e.target.value)}
                    placeholder="Enter your final score"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Tip: Playing the native version auto-fills your real score!
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Post to Leaderboard
                </button>
              </form>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-emerald-300">Score Recorded!</h4>
                <p className="text-[11px] text-slate-300">
                  Great run! Your score has been added to {game.title}&apos;s leaderboard.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="mt-2 text-xs text-purple-400 hover:underline font-semibold"
                >
                  Submit another score
                </button>
              </div>
            )}
          </div>

          {/* Game-specific Leaderboard */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-lg">
            <h3 className="font-display text-sm font-bold text-white mb-3 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              {game.title.split(':')[0]} High Scores
            </h3>

            {gameLeaderboard.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">
                No scores recorded for this game yet. Be the first to claim #1!
              </p>
            ) : (
              <div className="space-y-2">
                {gameLeaderboard.slice(0, 5).map((entry, idx) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-950/50 border border-slate-800/60 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] bg-slate-800 text-slate-300">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-200 truncate max-w-[120px]">
                        {entry.playerName}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-purple-400 tabular-nums">
                      {entry.score.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Game Page Sidebar Ad Slot (300x250) */}
          <div className="flex justify-center">
            <AdSlot size="medium-rectangle" slotId={`game-sidebar-${game.id}`} />
          </div>

        </div>

      </div>
    </div>
  );
};
