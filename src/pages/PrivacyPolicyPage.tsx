import React from 'react';
import { Shield } from 'lucide-react';
import { SeoHelmet } from '../components/common/SeoHelmet';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <SeoHelmet
        title="Privacy Policy - PlayHub"
        description="Read the official Privacy Policy for PlayHub regarding cookies, advertising partners, analytics, and browser data storage."
      />

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
          <Shield className="w-4 h-4" /> Legal Documentation
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400">
          Last updated: October 2026
        </p>
      </div>

      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-white">1. Introduction</h2>
          <p>
            Welcome to PlayHub (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). We respect your privacy and are committed to protecting the personal information you may provide while playing HTML5 games on our portal. This Privacy Policy describes how we collect, handle, and safeguard your data when using our website.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-white">2. Information We Collect</h2>
          <p>
            PlayHub does not require mandatory account registration to play games. We collect information only in the following contexts:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li><strong>Local Browser Data:</strong> High scores, game settings, dark/light theme preferences, and favorite games are stored locally on your device via HTML5 LocalStorage.</li>
            <li><strong>Waitlist & Inquiries:</strong> When you voluntarily submit your email for our VIP waitlist or submit a message via our Contact form.</li>
            <li><strong>Technical Analytics:</strong> Non-personally identifiable metrics such as browser type, operating system, device screen resolution, and aggregated game play counts.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-white">3. Third-Party Game Embeds & Sandboxing</h2>
          <p>
            Some games hosted on PlayHub are provided by verified third-party HTML5 game developers (such as GameDistribution, Famobi, or indie creators). These games run inside isolated, sandboxed iframes. While in-game progress may be stored by the game engine, iframes are restricted from accessing your primary browser session without permission.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-white">4. Advertising & Cookie Disclosures</h2>
          <p>
            PlayHub displays advertising from certified ad networks (such as Google AdSense or programmatic partners) to maintain free access for all users. These partners may utilize standard HTTP cookies or web beacons to deliver contextually relevant advertisements compliant with standard industry privacy regulations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-white">5. Children&apos;s Online Privacy (COPPA Compliance)</h2>
          <p>
            PlayHub provides family-friendly casual games and does not knowingly collect personally identifiable information from children under the age of 13.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-white">6. Updates & Inquiries</h2>
          <p>
            We may update this policy periodically to reflect platform enhancements. If you have questions regarding privacy practices, please contact us via our Contact page.
          </p>
        </section>
      </div>
    </div>
  );
};
