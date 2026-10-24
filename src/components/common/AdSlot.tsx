import React, { useState } from 'react';
import { ExternalLink, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export type AdSize = 'leaderboard' | 'medium-rectangle' | 'in-grid' | 'game-banner';

interface AdSlotProps {
  size: AdSize;
  className?: string;
  slotId?: string;
}

/**
 * Reusable AdSlot Component
 * 
 * =========================================================================
 * HOW TO CONNECT AN AD PROVIDER (Google AdSense, Adthrive, Mediavine, NitroPay):
 * =========================================================================
 * 1. Insert your publisher script in `index.html`:
 *    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
 * 
 * 2. In this component, replace the placeholder box with your ad tag:
 *    <ins className="adsbygoogle"
 *         style={{ display: 'block' }}
 *         data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
 *         data-ad-slot={slotId || "1234567890"}
 *         data-ad-format="auto"
 *         data-full-width-responsive="true"></ins>
 * 
 * 3. Trigger ads push on mount:
 *    useEffect(() => {
 *      try {
 *        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
 *      } catch (e) {
 *        console.error(e);
 *      }
 *    }, []);
 * =========================================================================
 */
export const AdSlot: React.FC<AdSlotProps> = ({ size, className = '', slotId = 'default-slot' }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  // Render sizing and aesthetic based on ad unit specification
  const getSizeStyles = () => {
    switch (size) {
      case 'leaderboard':
        // 728x90 standard IAB leaderboard (responsive on mobile)
        return 'w-full max-w-[728px] h-[90px] mx-auto';
      case 'medium-rectangle':
        // 300x250 standard medium rectangle IAB unit
        return 'w-[300px] h-[250px] mx-auto';
      case 'in-grid':
        // Native card ad matching game thumbnail dimensions
        return 'w-full h-full min-h-[280px]';
      case 'game-banner':
        // Wide responsive banner above or below game player
        return 'w-full h-[70px] sm:h-[90px]';
      default:
        return 'w-full h-[90px]';
    }
  };

  return (
    <div
      data-ad-slot-id={slotId}
      className={`relative rounded-xl overflow-hidden border border-slate-700/50 dark:border-slate-800/80 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-purple-950/30 dark:bg-gradient-to-br dark:from-slate-900/90 dark:via-slate-900 dark:to-indigo-950/40 p-3 shadow-inner flex flex-col justify-between transition-all group ${getSizeStyles()} ${className}`}
      aria-label="Advertisement Sponsor Slot"
    >
      {/* Ad Label and VIP Link */}
      <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-400 font-medium">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400/80"></span>
          Sponsored Ad
        </span>
        <div className="flex items-center gap-2">
          <Link
            to="/premium"
            className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-0.5 normal-case tracking-normal hover:underline"
            title="Remove ads with PlayHub VIP"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            Go Ad-Free
          </Link>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Close ad"
            className="p-0.5 text-slate-400 hover:text-slate-200 transition-colors"
            title="Dismiss ad preview"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* AD PROVIDER SCRIPT HOOK: In production, inject AdSense/GAM code inside this container */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-1">
        {size === 'medium-rectangle' ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-100">PlayHub VIP Pass</p>
              <p className="text-[11px] text-slate-400">Zero banner interruptions. High speed servers.</p>
            </div>
            <Link
              to="/premium"
              className="mt-1 px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-semibold rounded-md shadow transition-colors flex items-center gap-1"
            >
              Learn More <ExternalLink className="w-2.5 h-2.5" />
            </Link>
          </div>
        ) : size === 'in-grid' ? (
          <div className="flex flex-col items-center justify-center gap-2 h-full text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-200">Ad Space Available</p>
              <p className="text-xs text-slate-400 max-w-[200px]">Reach thousands of active HTML5 gamers every day.</p>
            </div>
            <Link
              to="/contact"
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 hover:underline mt-1"
            >
              Advertise with PlayHub &rarr;
            </Link>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full px-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                PH
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-200">Tired of ads? Upgrade to PlayHub VIP</p>
                <p className="text-[11px] text-slate-400 hidden sm:block">Enjoy pure distraction-free gameplay & early access to new releases.</p>
              </div>
            </div>
            <Link
              to="/premium"
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shrink-0 transition-colors shadow-sm"
            >
              Upgrade Now
            </Link>
          </div>
        )}
      </div>

      {/* Dimensions marker */}
      <div className="text-[9px] text-slate-400 text-right font-mono">
        {size === 'leaderboard' ? '728×90' : size === 'medium-rectangle' ? '300×250' : 'RESPONSIVE AD'}
      </div>
    </div>
  );
};
