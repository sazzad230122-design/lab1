import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Gamepad2,
  Search,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
  Sparkles,
  Trophy,
  Flame,
  Clock,
  Shield,
  Puzzle,
  Swords,
  Gauge,
  Compass,
  Brain,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { gamesService } from '../../services/gamesService';
import { CategoryInfo } from '../../types/game';

const categoryIcons: { [key: string]: React.FC<{ className?: string }> } = {
  Puzzle,
  Swords,
  Gauge,
  Gamepad2,
  Compass,
  Brain,
};

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCategories(gamesService.getCategories());
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoryDropdownOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-950/90 dark:bg-slate-950/90 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        
        {/* Zone 1: Brand Wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-lg"
          aria-label="PlayHub Homepage"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 p-0.5 shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full bg-slate-950/70 rounded-[10px] flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-purple-400 group-hover:rotate-6 transition-transform" />
            </div>
          </div>
          <span className="font-display font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-400 bg-clip-text text-transparent">
            Play<span className="text-purple-400">Hub</span>
          </span>
        </Link>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link
            to="/"
            className={`transition-colors hover:text-white whitespace-nowrap shrink-0 ${
              isActive('/') ? 'text-purple-400 font-semibold' : ''
            }`}
          >
            Home
          </Link>

          {/* Categories Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className="flex items-center gap-1.5 transition-colors hover:text-white whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded px-1"
              aria-expanded={categoryDropdownOpen}
            >
              Categories
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  categoryDropdownOpen ? 'rotate-180 text-purple-400' : ''
                }`}
              />
            </button>

            {categoryDropdownOpen && (
              <div className="absolute top-full left-0 mt-3 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="text-[11px] font-semibold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                  Browse Genres
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {categories.map((cat) => {
                    const IconComponent = categoryIcons[cat.iconName] || Gamepad2;
                    return (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.slug}`}
                        onClick={() => setCategoryDropdownOpen(false)}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800/80 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs"
                            style={{ backgroundColor: cat.color }}
                          >
                            <IconComponent className="w-3.5 h-3.5" />
                          </span>
                          <span className="text-xs font-semibold">{cat.name}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 group-hover:text-purple-400">
                          Explore &rarr;
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <Link
            to="/category/all?sort=popular"
            className={`flex items-center gap-1 transition-colors hover:text-white whitespace-nowrap shrink-0 ${
              location.search.includes('popular') ? 'text-purple-400 font-semibold' : ''
            }`}
          >
            <Flame className="w-4 h-4 text-orange-400" />
            Popular
          </Link>

          <Link
            to="/category/all?sort=newest"
            className={`flex items-center gap-1 transition-colors hover:text-white whitespace-nowrap shrink-0 ${
              location.search.includes('newest') ? 'text-purple-400 font-semibold' : ''
            }`}
          >
            <Clock className="w-4 h-4 text-cyan-400" />
            New Games
          </Link>

          <Link
            to="/leaderboard"
            className={`flex items-center gap-1 transition-colors hover:text-white whitespace-nowrap shrink-0 ${
              isActive('/leaderboard') ? 'text-purple-400 font-semibold' : ''
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            Leaderboard
          </Link>

          <Link
            to="/premium"
            className={`flex items-center gap-1 transition-colors hover:text-purple-300 whitespace-nowrap shrink-0 ${
              isActive('/premium') ? 'text-purple-400 font-semibold' : ''
            }`}
          >
            <Sparkles className="w-4 h-4 text-pink-400" />
            Premium
          </Link>
        </nav>

        {/* Zone 3: Search Bar, Actions & Theme Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-48 lg:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search games..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-1.5 pl-9 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
          </form>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-400" />}
          </button>

          {/* Admin Portal Button */}
          <Link
            to="/admin"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 border border-slate-700/80 hover:border-purple-500/80 text-slate-300 hover:text-white transition-colors"
            title="Manage games, categories, and submissions"
          >
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>Admin</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800/80 bg-slate-950 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          {/* Mobile Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search games..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 pl-9 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-purple-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          </form>

          {/* Mobile Links */}
          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <Link
              to="/"
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 text-slate-200 hover:bg-slate-800"
            >
              <Gamepad2 className="w-4 h-4 text-purple-400" /> Home
            </Link>
            <Link
              to="/category/all?sort=popular"
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 text-slate-200 hover:bg-slate-800"
            >
              <Flame className="w-4 h-4 text-orange-400" /> Popular
            </Link>
            <Link
              to="/category/all?sort=newest"
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 text-slate-200 hover:bg-slate-800"
            >
              <Clock className="w-4 h-4 text-cyan-400" /> New Games
            </Link>
            <Link
              to="/leaderboard"
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 text-slate-200 hover:bg-slate-800"
            >
              <Trophy className="w-4 h-4 text-amber-400" /> Leaderboard
            </Link>
            <Link
              to="/premium"
              className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 hover:bg-purple-900/40"
            >
              <Sparkles className="w-4 h-4 text-pink-400" /> VIP Pass
            </Link>
            <Link
              to="/admin"
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 text-slate-200 hover:bg-slate-800"
            >
              <Shield className="w-4 h-4 text-purple-400" /> Admin
            </Link>
          </div>

          {/* Mobile Categories Accordion */}
          <div className="pt-2 border-t border-slate-800">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Game Categories
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {categories.map((cat) => {
                const IconComponent = categoryIcons[cat.iconName] || Gamepad2;
                return (
                  <Link
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className="flex items-center gap-2 p-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-900"
                  >
                    <IconComponent className="w-3.5 h-3.5 text-purple-400" />
                    <span>{cat.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
