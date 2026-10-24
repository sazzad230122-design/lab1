import React, { useState, useEffect } from 'react';
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Lock,
  Unlock,
  Check,
  RotateCcw,
  Star,
  Flame,
  Clock,
  Sparkles,
  Layers,
  Users,
  Search,
} from 'lucide-react';
import { SeoHelmet } from '../components/common/SeoHelmet';
import { gamesService } from '../services/gamesService';
import { Game, CategoryInfo, GameCategory, WaitlistEntry, ContactSubmission } from '../types/game';

/**
 * DEMO ADMIN AUTHENTICATION
 * =========================================================================
 * NOTE FOR DEVELOPER / CLIENT:
 * This uses a client-side demo password ('playhub2025').
 * In production, replace this with a secure backend session, Firebase Auth,
 * Supabase Auth, or OAuth 2.0 with role-based access control (RBAC).
 * =========================================================================
 */
const DEMO_ADMIN_PASSWORD = 'playhub2025';

export const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('playhub_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Admin tabs: 'games' | 'categories' | 'waitlist' | 'contacts'
  const [activeTab, setActiveTab] = useState<'games' | 'categories' | 'waitlist' | 'contacts'>('games');

  // Games state
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal / Form state for Add or Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGameId, setEditingGameId] = useState<string | null>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCategory, setFormCategory] = useState<GameCategory>('arcade');
  const [formDescription, setFormDescription] = useState('');
  const [formThumbnail, setFormThumbnail] = useState('');
  const [formEmbedUrl, setFormEmbedUrl] = useState('');
  const [formInstructions, setFormInstructions] = useState('');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsPopular, setFormIsPopular] = useState(false);
  const [formIsNew, setFormIsNew] = useState(true);

  // Category creation
  const [newCatName, setNewCatName] = useState('');
  const [newCatDescription, setNewCatDescription] = useState('');

  // Waitlist and contact data
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);

  // Toast / notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const loadData = () => {
    setGames(gamesService.getGames());
    setCategories(gamesService.getCategories());
    setWaitlist(gamesService.getWaitlist());
    setContacts(gamesService.getContactSubmissions());
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Auth Submit
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === DEMO_ADMIN_PASSWORD) {
      sessionStorage.setItem('playhub_admin_auth', 'true');
      setIsAuthenticated(true);
      setAuthError('');
      loadData();
    } else {
      setAuthError('Incorrect password. Demo password is: playhub2025');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('playhub_admin_auth');
    setIsAuthenticated(false);
  };

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!editingGameId) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormSlug(generated);
    }
  };

  // Open modal for Create
  const handleOpenCreateModal = () => {
    setEditingGameId(null);
    setFormTitle('');
    setFormSlug('');
    setFormCategory('arcade');
    setFormDescription('');
    setFormThumbnail('https://picsum.photos/640/360?random=' + Math.floor(Math.random() * 100));
    setFormEmbedUrl('https://play.famobi.com/snake');
    setFormInstructions('Use Arrow Keys or WASD to control your character.');
    setFormIsFeatured(false);
    setFormIsPopular(false);
    setFormIsNew(true);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (game: Game) => {
    setEditingGameId(game.id);
    setFormTitle(game.title);
    setFormSlug(game.slug);
    setFormCategory(game.category);
    setFormDescription(game.description);
    setFormThumbnail(game.thumbnail);
    setFormEmbedUrl(game.embedUrl);
    setFormInstructions(game.instructions);
    setFormIsFeatured(game.isFeatured);
    setFormIsPopular(game.isPopular);
    setFormIsNew(game.isNew);
    setIsModalOpen(true);
  };

  // Save game (Create or Update)
  const handleSaveGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formSlug.trim()) return;

    if (editingGameId) {
      gamesService.updateGame(editingGameId, {
        title: formTitle.trim(),
        slug: formSlug.trim(),
        category: formCategory,
        description: formDescription.trim(),
        thumbnail: formThumbnail.trim(),
        embedUrl: formEmbedUrl.trim(),
        instructions: formInstructions.trim(),
        isFeatured: formIsFeatured,
        isPopular: formIsPopular,
        isNew: formIsNew,
      });
      showToast(`Updated "${formTitle}" successfully!`);
    } else {
      gamesService.addGame({
        title: formTitle.trim(),
        slug: formSlug.trim(),
        category: formCategory,
        description: formDescription.trim(),
        thumbnail: formThumbnail.trim(),
        embedUrl: formEmbedUrl.trim(),
        instructions: formInstructions.trim(),
        isFeatured: formIsFeatured,
        isPopular: formIsPopular,
        isNew: formIsNew,
        rating: 5.0,
        ratingCount: 1,
        plays: 0,
        tags: [formCategory, 'HTML5', 'Arcade'],
        controls: [{ key: 'Arrow Keys / WASD', action: 'Move / Steer' }],
      });
      showToast(`Added "${formTitle}" to game library!`);
    }

    setIsModalOpen(false);
    loadData();
  };

  // Delete Game
  const handleDeleteGame = (game: Game) => {
    if (window.confirm(`Are you sure you want to delete "${game.title}"?`)) {
      gamesService.deleteGame(game.id);
      showToast(`Deleted "${game.title}".`);
      loadData();
    }
  };

  // Reorder Games
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= games.length) return;

    const reordered = [...games];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIdx, 0, moved);

    const ids = reordered.map((g) => g.id);
    gamesService.reorderGames(ids);
    setGames(reordered);
    showToast('Game list order updated.');
  };

  // Add Category
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const slug = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat: CategoryInfo = {
      id: slug as GameCategory,
      name: newCatName.trim(),
      slug,
      description: newCatDescription.trim() || `${newCatName} free games collection.`,
      iconName: 'Gamepad2',
      color: '#8b5cf6',
      gradient: 'from-purple-600 to-indigo-600',
    };

    gamesService.addCategory(newCat);
    setNewCatName('');
    setNewCatDescription('');
    showToast(`Category "${newCat.name}" added!`);
    loadData();
  };

  // Reset to default seed
  const handleResetDefaults = () => {
    if (
      window.confirm(
        'Warning: This will restore the original 18 seed games, categories, and reset test data. Proceed?'
      )
    ) {
      gamesService.resetToDefaults();
      loadData();
      showToast('Game catalog restored to default seeds!');
    }
  };

  // Filtered games in admin
  const filteredGames = games.filter((g) => {
    const matchesQuery =
      g.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      g.slug.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesCat = selectedCategory === 'all' || g.category === selectedCategory;
    return matchesQuery && matchesCat;
  });

  // If not logged in, show login form
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-24">
        <SeoHelmet title="Admin Login - PlayHub" />
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-purple-600/30">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h1 className="font-display text-2xl font-bold text-white">PlayHub Admin Portal</h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage games, categories, and submissions without code edits.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <span className="text-[11px] text-purple-400 mt-1 block">
                Demo password: <strong className="font-mono">playhub2025</strong>
              </span>
            </div>

            {authError && (
              <p className="text-xs text-rose-400 font-semibold">{authError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" /> Unlock Dashboard
            </button>
          </form>

          <p className="text-[10px] text-slate-500">
            Client Note: Replace hardcoded authentication in production with Firebase/Supabase Auth or OAuth.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <SeoHelmet title="Admin Management Console - PlayHub" />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-white">
              PlayHub Content Manager
            </h1>
            <p className="text-xs text-slate-400">
              {games.length} total games in catalog · Persisted in LocalStorage
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleResetDefaults}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Restore default sample games"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Demo Seeds</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/40 text-xs font-semibold transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('games')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'games'
              ? 'bg-purple-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" /> Games Catalog ({games.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'categories'
              ? 'bg-purple-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Categories ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab('waitlist')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'waitlist'
              ? 'bg-purple-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" /> VIP Waitlist ({waitlist.length})
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'contacts'
              ? 'bg-purple-600 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Inquiries ({contacts.length})
        </button>
      </div>

      {/* TAB 1: GAMES MANAGEMENT */}
      {activeTab === 'games' && (
        <div className="space-y-4">
          {/* Controls: Search, Category Filter, and Add Game Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-3 flex-1 max-w-lg">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter games by title or slug..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-1.5 pl-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2 pointer-events-none" />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
              >
                <option value="all">All Genres</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" /> Add New Game
            </button>
          </div>

          {/* Games Table */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-3 w-14 text-center">Order</th>
                    <th className="py-3 px-4">Game</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3 text-center">Status Flags</th>
                    <th className="py-3 px-3 text-right">Plays / Rating</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredGames.map((game, index) => (
                    <tr key={game.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Order Controls */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <button
                            onClick={() => handleMove(index, 'up')}
                            disabled={index === 0}
                            className="p-0.5 text-slate-500 hover:text-white disabled:opacity-20"
                            title="Move up in order"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMove(index, 'down')}
                            disabled={index === games.length - 1}
                            className="p-0.5 text-slate-500 hover:text-white disabled:opacity-20"
                            title="Move down in order"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Game Info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={game.thumbnail}
                            alt=""
                            className="w-12 h-8 rounded-lg object-cover bg-slate-950 shrink-0 border border-slate-800"
                          />
                          <div>
                            <p className="font-bold text-white text-xs">{game.title}</p>
                            <p className="text-[11px] text-slate-400 font-mono">/game/{game.slug}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3">
                        <span className="capitalize font-semibold text-slate-300">
                          {game.category}
                        </span>
                      </td>

                      {/* Status Badges */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          {game.isFeatured && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-500/40">
                              Featured
                            </span>
                          )}
                          {game.isPopular && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-950 text-orange-300 border border-orange-500/40">
                              Popular
                            </span>
                          )}
                          {game.isNew && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                              New
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Plays / Rating */}
                      <td className="py-3 px-3 text-right">
                        <p className="font-mono text-slate-200 tabular-nums">
                          {game.plays.toLocaleString()} plays
                        </p>
                        <p className="text-[11px] text-amber-400 tabular-nums font-semibold">
                          ★ {game.rating.toFixed(1)} ({game.ratingCount})
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(game)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white transition-colors"
                            title="Edit Game"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteGame(game)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
                            title="Delete Game"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORIES MANAGEMENT */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-3">
            <h3 className="font-display text-base font-bold text-white">Active Categories</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat) => {
                const count = gamesService.getGamesByCategory(cat.slug).length;
                return (
                  <div
                    key={cat.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-white text-sm">{cat.name}</h4>
                      <p className="text-xs text-slate-400">{cat.description}</p>
                      <span className="text-[10px] text-purple-400 font-mono mt-1 block">
                        {count} games assigned
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Category Form */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
            <h3 className="font-display text-sm font-bold text-white">Add New Category</h3>
            <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Simulation"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  value={newCatDescription}
                  onChange={(e) => setNewCatDescription(e.target.value)}
                  placeholder="Short genre summary..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl"
              >
                Create Category
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: VIP WAITLIST */}
      {activeTab === 'waitlist' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-white">VIP Waitlist Subscribers</h3>
            <span className="text-xs text-purple-400 font-mono">{waitlist.length} subscribers</span>
          </div>

          {waitlist.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No waitlist subscribers recorded yet. Sign up from the VIP page or homepage sidebar!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase">
                    <th className="py-2.5 px-3">Email Address</th>
                    <th className="py-2.5 px-3">Plan Preference</th>
                    <th className="py-2.5 px-3 text-right">Signed Up</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {waitlist.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 font-semibold text-white">{w.email}</td>
                      <td className="py-2.5 px-3 capitalize text-purple-300">{w.plan}</td>
                      <td className="py-2.5 px-3 text-right text-slate-400">
                        {new Date(w.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CONTACT INQUIRIES */}
      {activeTab === 'contacts' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-white">Contact Form Inquiries</h3>
            <span className="text-xs text-purple-400 font-mono">{contacts.length} submissions</span>
          </div>

          {contacts.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No contact inquiries submitted yet.
            </p>
          ) : (
            <div className="space-y-3">
              {contacts.map((c) => (
                <div key={c.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{c.name} ({c.email})</span>
                    <span className="text-slate-400 text-[10px]">{new Date(c.date).toLocaleString()}</span>
                  </div>
                  <p className="font-semibold text-purple-300">{c.subject}</p>
                  <p className="text-slate-300 whitespace-pre-wrap">{c.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ADD / EDIT GAME MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-display text-lg font-bold text-white">
                {editingGameId ? 'Edit Game' : 'Add New Game'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveGame} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Cyber Speed Turbo"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Slug *</label>
                  <input
                    type="text"
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="e.g. cyber-speed-turbo"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as GameCategory)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white capitalize"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Thumbnail URL</label>
                  <input
                    type="text"
                    value={formThumbnail}
                    onChange={(e) => setFormThumbnail(e.target.value)}
                    placeholder="URL to cover image..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">HTML5 Embed URL (iframe source) *</label>
                <input
                  type="text"
                  required
                  value={formEmbedUrl}
                  onChange={(e) => setFormEmbedUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Supports GameDistribution, Famobi, itch.io, or self-hosted HTML5 game URLs.
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={2}
                  placeholder="Short game synopsis..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">How to Play / Instructions</label>
                <textarea
                  value={formInstructions}
                  onChange={(e) => setFormInstructions(e.target.value)}
                  rows={2}
                  placeholder="Instructions for the user..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              {/* Status Toggles */}
              <div className="flex items-center gap-6 pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-slate-300 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Featured Banner
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsPopular}
                    onChange={(e) => setFormIsPopular(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-slate-300 font-semibold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-400" /> Popular List
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsNew}
                    onChange={(e) => setFormIsNew(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-slate-300 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" /> New Release
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg"
                >
                  {editingGameId ? 'Update Game' : 'Save Game'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
