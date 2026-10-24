import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Check,
  Zap,
  Shield,
  HelpCircle,
  Clock,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { SeoHelmet } from '../components/common/SeoHelmet';
import { gamesService } from '../services/gamesService';

export const PremiumPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setLoading(true);

    setTimeout(() => {
      gamesService.joinWaitlist(email.trim(), selectedPlan);
      setLoading(false);
      setSubmitted(true);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {}
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <SeoHelmet
        title="PlayHub VIP - 100% Ad-Free Browser Gaming"
        description="Upgrade your gaming experience with PlayHub VIP. Zero ads, early access to new HTML5 games, high-speed servers, and custom badges."
      />

      {/* Hero Showcase */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          The Ultimate Gaming Upgrade
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Game Without Limits with <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">PlayHub VIP</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Say goodbye to banner ads and enjoy lightning-fast loading, early access to weekly new games, and exclusive VIP badges.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        
        {/* Free Plan */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Free Player
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300">
                Current Tier
              </span>
            </div>
            <div className="mb-6">
              <span className="font-display text-4xl font-extrabold text-white">$0</span>
              <span className="text-slate-400 text-sm"> / forever</span>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Full access to our catalog of free HTML5 arcade, puzzle, action, and racing games with sponsor banners.
            </p>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Play all 18+ HTML5 browser games</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Submit scores to global leaderboards</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Keyboard, mouse, and touch control support</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-500">
                <span className="w-4 h-4 text-center block">&times;</span>
                <span className="line-through">Standard display ads enabled</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-500">
                <span className="w-4 h-4 text-center block">&times;</span>
                <span className="line-through">Early access to new game titles</span>
              </li>
            </ul>
          </div>

          <button
            disabled
            className="w-full mt-8 py-3 rounded-2xl bg-slate-800 text-slate-400 font-semibold text-xs cursor-default"
          >
            Included by Default
          </button>
        </div>

        {/* VIP Pass Plan */}
        <div className="rounded-3xl bg-gradient-to-br from-purple-950/80 via-slate-900 to-indigo-950/90 border-2 border-purple-500/60 p-8 flex flex-col justify-between shadow-2xl relative">
          <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
            Most Popular
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300" /> PlayHub VIP Pass
              </span>
            </div>

            {/* Plan switcher */}
            <div className="flex items-center gap-2 mb-4 p-1 rounded-xl bg-slate-950/60 border border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedPlan('monthly')}
                className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  selectedPlan === 'monthly' ? 'bg-purple-600 text-white' : 'text-slate-400'
                }`}
              >
                Monthly ($3.99/mo)
              </button>
              <button
                type="button"
                onClick={() => setSelectedPlan('yearly')}
                className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  selectedPlan === 'yearly' ? 'bg-purple-600 text-white' : 'text-slate-400'
                }`}
              >
                Yearly ($29.99/yr - Save 37%)
              </button>
            </div>

            <div className="mb-6">
              <span className="font-display text-4xl font-extrabold text-white">
                {selectedPlan === 'yearly' ? '$2.49' : '$3.99'}
              </span>
              <span className="text-slate-400 text-sm"> / month</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-200">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <strong className="text-white">100% Ad-Free Experience</strong>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero pre-roll video ads or banner slots</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>7-Day early access to all new game releases</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Exclusive VIP crown badge on global leaderboards</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Priority high-bandwidth game delivery servers</span>
              </li>
            </ul>
          </div>

          {/* Waitlist Capture Form */}
          <div className="mt-8 pt-6 border-t border-purple-500/30">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email to request beta invitation"
                  className="w-full bg-slate-950 border border-purple-500/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 shadow-inner"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs rounded-xl shadow-xl shadow-purple-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Zap className="w-4 h-4" />
                  {loading ? 'Submitting...' : 'Join VIP Waitlist (Coming Soon)'}
                </button>
                <p className="text-[10px] text-slate-400 text-center">
                  v1 Beta Preview: Early access invitations will be sent out in batches.
                </p>
              </form>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-center space-y-2">
                <Check className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-200">You are on the VIP Waitlist!</h4>
                <p className="text-xs text-slate-300">
                  We&apos;ve reserved your early bird rate. When VIP subscriptions open, you&apos;ll be the first to receive access.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Feature Comparison Matrix */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-xl max-w-4xl mx-auto">
        <h2 className="font-display text-xl font-bold text-white mb-6 text-center">
          Compare Features
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 px-3">Feature</th>
                <th className="pb-3 px-3 text-center">Free Player</th>
                <th className="pb-3 px-3 text-center text-purple-400 font-bold">PlayHub VIP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr>
                <td className="py-3 px-3 text-slate-200 font-medium">Free HTML5 Games Catalog</td>
                <td className="py-3 px-3 text-center text-emerald-400">All Games</td>
                <td className="py-3 px-3 text-center text-emerald-400 font-bold">All Games</td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-slate-200 font-medium">Advertising</td>
                <td className="py-3 px-3 text-center text-slate-400">Standard Ads</td>
                <td className="py-3 px-3 text-center text-emerald-400 font-bold">100% Ad-Free</td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-slate-200 font-medium">New Release Access</td>
                <td className="py-3 px-3 text-center text-slate-400">On Public Launch</td>
                <td className="py-3 px-3 text-center text-emerald-400 font-bold">7 Days Early Access</td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-slate-200 font-medium">Leaderboard Badges</td>
                <td className="py-3 px-3 text-center text-slate-400">Standard</td>
                <td className="py-3 px-3 text-center text-amber-400 font-bold">Golden VIP Crown</td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-slate-200 font-medium">Cloud Server Speed</td>
                <td className="py-3 px-3 text-center text-slate-400">Standard</td>
                <td className="py-3 px-3 text-center text-emerald-400 font-bold">Ultra High Speed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="max-w-3xl mx-auto space-y-4">
        <h2 className="font-display text-xl font-bold text-white text-center mb-6">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-purple-400" />
              Will games always remain free on PlayHub?
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yes! PlayHub will always offer a comprehensive collection of 100% free games supported by advertising. The VIP tier is optional for gamers who want an ad-free experience.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              When will the VIP subscription launch?
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We are currently onboarding early waitlist users. By submitting your email above, you secure early access and grandfathered pricing.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              Do I need a credit card to join the waitlist?
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No credit card is required. Joining the waitlist simply saves your spot and notifies you when registration opens.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
