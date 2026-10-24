import React from 'react';
import { FileText } from 'lucide-react';
import { SeoHelmet } from '../components/common/SeoHelmet';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <SeoHelmet
        title="Terms of Service - PlayHub"
        description="Review the terms and conditions governing game play, submissions, and website usage on PlayHub."
      />

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
          <FileText className="w-4 h-4" /> Legal Documentation
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-400">
          Last revised: October 2026
        </p>
      </div>

      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-white">1. Agreement to Terms</h2>
          <p>
            By accessing or playing games on PlayHub, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you disagree with any portion of these terms, you are prohibited from utilizing this gaming portal.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-white">2. Intellectual Property & Game Rights</h2>
          <p>
            All titles, artwork, codebases, and audio displayed on PlayHub are either proprietary assets of PlayHub, licensed under open-source agreements, or utilized under explicit authorization from respective developer partners. Users may not decompile, reverse engineer, or redistribute games without prior written consent.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-white">3. Fair Play & Leaderboard Integrity</h2>
          <p>
            When submitting gamer tags and scores to our public leaderboards, players agree to refrain from manipulating memory values, exploiting automated bots, or submitting defamatory player usernames. We reserve the right to remove illegitimate score submissions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-white">4. Disclaimer & Limitation of Liability</h2>
          <p>
            PlayHub is provided &quot;as is&quot; without warranties of any kind. We do not warrant that gameplay will be uninterrupted or error-free. PlayHub shall not be liable for any indirect damages resulting from portal downtime or third-party iframe embed availability.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-lg font-bold text-white">5. Governing Law</h2>
          <p>
            These terms are governed in accordance with international web standards and jurisdiction guidelines. Any inquiries regarding compliance can be submitted through our Contact portal.
          </p>
        </section>
      </div>
    </div>
  );
};
