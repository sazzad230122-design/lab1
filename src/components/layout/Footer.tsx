import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Heart, Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-sm transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-white">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white">
                <Gamepad2 className="w-4 h-4 text-purple-200" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                PlayHub
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              PlayHub is a free online HTML5 gaming portal delivering instant browser entertainment.
              No downloads, no installations—just click and play across desktop, tablet, and mobile devices.
            </p>
            <div className="flex items-center gap-3 text-slate-400 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                100% Safe & Sandboxed
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Instant Play
              </span>
            </div>
          </div>

          {/* Game Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/category/puzzle" className="hover:text-purple-400 transition-colors">
                  Puzzle & Logic
                </Link>
              </li>
              <li>
                <Link to="/category/action" className="hover:text-purple-400 transition-colors">
                  Action & Combat
                </Link>
              </li>
              <li>
                <Link to="/category/racing" className="hover:text-purple-400 transition-colors">
                  Racing & Speed
                </Link>
              </li>
              <li>
                <Link to="/category/arcade" className="hover:text-purple-400 transition-colors">
                  Retro Arcade
                </Link>
              </li>
              <li>
                <Link to="/category/adventure" className="hover:text-purple-400 transition-colors">
                  Adventure & RPG
                </Link>
              </li>
              <li>
                <Link to="/category/brain-training" className="hover:text-purple-400 transition-colors">
                  Brain Training
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/category/all?sort=popular" className="hover:text-purple-400 transition-colors">
                  Most Popular
                </Link>
              </li>
              <li>
                <Link to="/category/all?sort=newest" className="hover:text-purple-400 transition-colors">
                  New Releases
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-purple-400 transition-colors">
                  Global Leaderboards
                </Link>
              </li>
              <li>
                <Link to="/premium" className="hover:text-purple-400 transition-colors">
                  Go Ad-Free (VIP)
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-purple-400 transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Legal & Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-purple-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-purple-400 transition-colors">
                  Contact & Inquiries
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-purple-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-purple-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Socials and Copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="flex items-center gap-1">
            &copy; {new Date().getFullYear()} PlayHub. Built with{' '}
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for web gamers worldwide.
          </p>

          <div className="flex items-center gap-6">
            <span className="text-slate-400 hover:text-slate-200 cursor-pointer transition-colors" title="Discord Community">
              Discord
            </span>
            <span className="text-slate-400 hover:text-slate-200 cursor-pointer transition-colors" title="Twitch Stream">
              Twitch
            </span>
            <span className="text-slate-400 hover:text-slate-200 cursor-pointer transition-colors" title="X / Twitter">
              X (Twitter)
            </span>
            <span className="text-slate-400 hover:text-slate-200 cursor-pointer transition-colors" title="YouTube Gaming">
              YouTube
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
