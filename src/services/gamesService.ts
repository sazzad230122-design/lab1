import { Game, CategoryInfo, LeaderboardEntry, WaitlistEntry, ContactSubmission } from '../types/game';
import { INITIAL_GAMES, INITIAL_CATEGORIES, INITIAL_LEADERBOARD } from '../data/seedGames';

const STORAGE_KEYS = {
  GAMES: 'playhub_games_v1',
  CATEGORIES: 'playhub_categories_v1',
  LEADERBOARD: 'playhub_leaderboard_v1',
  WAITLIST: 'playhub_waitlist_v1',
  CONTACT: 'playhub_contact_v1',
  FAVORITES: 'playhub_favorites_v1',
};

// Safe localStorage helper
const safeGet = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage`, e);
    return fallback;
  }
};

const safeSet = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing ${key} to localStorage`, e);
  }
};

class GamesService {
  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.GAMES)) {
      safeSet(STORAGE_KEYS.GAMES, INITIAL_GAMES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      safeSet(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.LEADERBOARD)) {
      safeSet(STORAGE_KEYS.LEADERBOARD, INITIAL_LEADERBOARD);
    }
  }

  // --- Games CRUD ---
  getGames(): Game[] {
    return safeGet<Game[]>(STORAGE_KEYS.GAMES, INITIAL_GAMES);
  }

  getGameBySlug(slug: string): Game | undefined {
    const games = this.getGames();
    return games.find((g) => g.slug.toLowerCase() === slug.toLowerCase());
  }

  getGameById(id: string): Game | undefined {
    const games = this.getGames();
    return games.find((g) => g.id === id);
  }

  getFeaturedGames(): Game[] {
    return this.getGames().filter((g) => g.isFeatured);
  }

  getPopularGames(limit?: number): Game[] {
    const list = this.getGames()
      .filter((g) => g.isPopular)
      .sort((a, b) => b.plays - a.plays);
    return limit ? list.slice(0, limit) : list;
  }

  getNewGames(limit?: number): Game[] {
    const list = this.getGames()
      .filter((g) => g.isNew)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return limit ? list.slice(0, limit) : list;
  }

  getGamesByCategory(categorySlug: string): Game[] {
    return this.getGames().filter(
      (g) => g.category.toLowerCase() === categorySlug.toLowerCase()
    );
  }

  getRelatedGames(game: Game, limit: number = 4): Game[] {
    return this.getGames()
      .filter((g) => g.id !== game.id && g.category === game.category)
      .slice(0, limit);
  }

  addGame(game: Omit<Game, 'id' | 'createdAt' | 'plays' | 'rating' | 'ratingCount'> & Partial<Game>): Game {
    const games = this.getGames();
    const newGame: Game = {
      ...game,
      id: `game-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
      plays: game.plays || 0,
      rating: game.rating || 5.0,
      ratingCount: game.ratingCount || 1,
      instructions: game.instructions || 'Use keyboard or mouse controls to play.',
      controls: game.controls || [{ key: 'Arrow Keys / WASD', action: 'Move / Steer' }],
      tags: game.tags || [game.category],
      isFeatured: !!game.isFeatured,
      isPopular: !!game.isPopular,
      isNew: game.isNew !== undefined ? game.isNew : true,
    } as Game;

    const updated = [newGame, ...games];
    safeSet(STORAGE_KEYS.GAMES, updated);
    return newGame;
  }

  updateGame(id: string, updates: Partial<Game>): Game | null {
    const games = this.getGames();
    const index = games.findIndex((g) => g.id === id);
    if (index === -1) return null;

    games[index] = { ...games[index], ...updates };
    safeSet(STORAGE_KEYS.GAMES, games);
    return games[index];
  }

  deleteGame(id: string): boolean {
    const games = this.getGames();
    const filtered = games.filter((g) => g.id !== id);
    if (filtered.length === games.length) return false;
    safeSet(STORAGE_KEYS.GAMES, filtered);
    return true;
  }

  reorderGames(ids: string[]): Game[] {
    const games = this.getGames();
    const map = new Map(games.map((g) => [g.id, g]));
    const reordered: Game[] = [];

    ids.forEach((id) => {
      const g = map.get(id);
      if (g) {
        reordered.push(g);
        map.delete(id);
      }
    });

    // Append any remaining games not present in ids list
    map.forEach((remainingGame) => {
      reordered.push(remainingGame);
    });

    safeSet(STORAGE_KEYS.GAMES, reordered);
    return reordered;
  }

  incrementPlays(id: string): void {
    const games = this.getGames();
    const game = games.find((g) => g.id === id);
    if (game) {
      game.plays += 1;
      safeSet(STORAGE_KEYS.GAMES, games);
    }
  }

  rateGame(id: string, userRating: number): { rating: number; ratingCount: number } | null {
    const games = this.getGames();
    const game = games.find((g) => g.id === id);
    if (!game) return null;

    const currentTotal = game.rating * game.ratingCount;
    const newCount = game.ratingCount + 1;
    const newRating = Number(((currentTotal + userRating) / newCount).toFixed(1));

    game.rating = newRating;
    game.ratingCount = newCount;
    safeSet(STORAGE_KEYS.GAMES, games);

    return { rating: newRating, ratingCount: newCount };
  }

  // --- Categories ---
  getCategories(): CategoryInfo[] {
    return safeGet<CategoryInfo[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }

  addCategory(category: CategoryInfo): CategoryInfo {
    const categories = this.getCategories();
    const updated = [...categories, category];
    safeSet(STORAGE_KEYS.CATEGORIES, updated);
    return category;
  }

  deleteCategory(id: string): boolean {
    const categories = this.getCategories();
    const filtered = categories.filter((c) => c.id !== id);
    if (filtered.length === categories.length) return false;
    safeSet(STORAGE_KEYS.CATEGORIES, filtered);
    return true;
  }

  // --- Leaderboard ---
  getLeaderboard(gameId?: string): LeaderboardEntry[] {
    const all = safeGet<LeaderboardEntry[]>(STORAGE_KEYS.LEADERBOARD, INITIAL_LEADERBOARD);
    const filtered = gameId ? all.filter((entry) => entry.gameId === gameId) : all;
    return filtered
      .sort((a, b) => b.score - a.score)
      .map((entry, idx) => ({ ...entry, rank: idx + 1 }));
  }

  addLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id' | 'date' | 'avatarColor'>): LeaderboardEntry {
    const all = safeGet<LeaderboardEntry[]>(STORAGE_KEYS.LEADERBOARD, INITIAL_LEADERBOARD);
    const avatarGradients = [
      'from-purple-500 to-indigo-600',
      'from-pink-500 to-rose-600',
      'from-orange-500 to-amber-600',
      'from-cyan-500 to-blue-600',
      'from-emerald-500 to-teal-600',
      'from-fuchsia-500 to-purple-600',
    ];
    const randomGrad = avatarGradients[Math.floor(Math.random() * avatarGradients.length)];

    const newEntry: LeaderboardEntry = {
      ...entry,
      id: `lb-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      date: new Date().toISOString(),
      avatarColor: randomGrad,
    };

    const updated = [newEntry, ...all];
    safeSet(STORAGE_KEYS.LEADERBOARD, updated);
    return newEntry;
  }

  // --- Waitlist (Premium) ---
  joinWaitlist(email: string, plan: 'monthly' | 'yearly' = 'yearly'): WaitlistEntry {
    const waitlist = safeGet<WaitlistEntry[]>(STORAGE_KEYS.WAITLIST, []);
    const newEntry: WaitlistEntry = {
      id: `wl-${Date.now()}`,
      email,
      plan,
      createdAt: new Date().toISOString(),
    };
    safeSet(STORAGE_KEYS.WAITLIST, [newEntry, ...waitlist]);
    return newEntry;
  }

  getWaitlist(): WaitlistEntry[] {
    return safeGet<WaitlistEntry[]>(STORAGE_KEYS.WAITLIST, []);
  }

  // --- Contact Submissions ---
  saveContactSubmission(submission: Omit<ContactSubmission, 'id' | 'date'>): ContactSubmission {
    const list = safeGet<ContactSubmission[]>(STORAGE_KEYS.CONTACT, []);
    const newSub: ContactSubmission = {
      ...submission,
      id: `cs-${Date.now()}`,
      date: new Date().toISOString(),
    };
    safeSet(STORAGE_KEYS.CONTACT, [newSub, ...list]);
    return newSub;
  }

  getContactSubmissions(): ContactSubmission[] {
    return safeGet<ContactSubmission[]>(STORAGE_KEYS.CONTACT, []);
  }

  // --- Favorites ---
  getFavorites(): string[] {
    return safeGet<string[]>(STORAGE_KEYS.FAVORITES, []);
  }

  toggleFavorite(gameId: string): boolean {
    const favs = this.getFavorites();
    const index = favs.indexOf(gameId);
    let isFav = false;
    if (index === -1) {
      favs.push(gameId);
      isFav = true;
    } else {
      favs.splice(index, 1);
      isFav = false;
    }
    safeSet(STORAGE_KEYS.FAVORITES, favs);
    return isFav;
  }

  // --- Reset to seed defaults ---
  resetToDefaults(): void {
    safeSet(STORAGE_KEYS.GAMES, INITIAL_GAMES);
    safeSet(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    safeSet(STORAGE_KEYS.LEADERBOARD, INITIAL_LEADERBOARD);
    safeSet(STORAGE_KEYS.WAITLIST, []);
    safeSet(STORAGE_KEYS.CONTACT, []);
    safeSet(STORAGE_KEYS.FAVORITES, []);
  }
}

export const gamesService = new GamesService();
