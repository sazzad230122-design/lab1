import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, ShieldCheck, Zap, Globe, Sparkles, Heart } from 'lucide-react';
import { SeoHelmet } from '../components/common/SeoHelmet';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SeoHelmet
        title="About PlayHub - Free Browser Games Platform"
        description="Learn about PlayHub's mission to provide instant, safe, high-performance HTML5 games directly in your browser without downloads."
      />

      {/* Header Banner */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-purple-600/30">
          <Gamepad2 className="w-8 h-8" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
          About PlayHub
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          PlayHub is an independent gaming platform committed to bringing high-quality, frictionless browser entertainment to players worldwide.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-white">Zero Friction</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            No massive downloads, no account setup barriers, no slow app store approvals. Click any game and start playing within 2 seconds.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-white">Sandboxed & Safe</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            All HTML5 titles execute inside secure, isolated sandboxes. Clean gaming suitable for casual gamers, school breaks, and family leisure.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="font-display font-bold text-base text-white">Play Anywhere</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Engineered with modern responsive standards that adapt seamlessly to smartphones, tablets, Chromebooks, and high-res desktop monitors.
          </p>
        </div>
      </div>

      {/* Story & Developer Section */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <h2 className="font-display text-xl font-bold text-white mb-2">Our Mission</h2>
        <p>
          Since our inception, our focus has been simple: eliminate the friction in casual gaming. As native app stores become increasingly bloated with aggressive paywalls and gigabyte downloads, browser games continue to represent the purest form of digital play.
        </p>
        <p>
          We curate titles from talented independent game studios, open-source creators, and licensed HTML5 game distributors. Every game on PlayHub is tested for responsive layout integrity, audio fidelity, and keyboard or touch input accuracy.
        </p>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-400 text-xs">
            Built with <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> for the HTML5 gaming community
          </span>
          <Link to="/contact" className="text-purple-400 hover:text-purple-300 font-semibold text-xs">
            Submit Your Game &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
