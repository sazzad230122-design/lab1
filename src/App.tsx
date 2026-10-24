/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * =========================================================================================
 * PLAYHUB - MODERN BROWSER GAMING PORTAL
 * =========================================================================================
 * 
 * 1. SITEMAP & ROBOTS.TXT GUIDANCE:
 * -----------------------------------------------------------------------------------------
 * When deploying to production (e.g. Vercel, Cloudflare, Netlify, Cloud Run), place a
 * `robots.txt` in the `/public` root:
 * 
 *   User-agent: *
 *   Allow: /
 *   Disallow: /admin
 *   Sitemap: https://yourdomain.com/sitemap.xml
 * 
 * Dynamic sitemap entries should include:
 *   - / (daily, 1.0)
 *   - /category/puzzle, /category/action, etc. (daily, 0.9)
 *   - /game/:slug for all games returned by `gamesService.getGames()` (weekly, 0.8)
 *   - /leaderboard, /premium, /about, /contact (monthly, 0.5)
 * 
 * -----------------------------------------------------------------------------------------
 * 2. HOW TO EXTEND THIS APPLICATION:
 * -----------------------------------------------------------------------------------------
 * - ADDING GAMES & CATEGORIES:
 *   Admins can navigate to `/admin` (password: `playhub2025`) and add, update, reorder,
 *   or delete games and categories instantly without writing code.
 * 
 * - CONNECTING AN AD PROVIDER:
 *   Inspect `src/components/common/AdSlot.tsx`. Replace the placeholder containers with
 *   your Google AdSense publisher tags (`<ins class="adsbygoogle" ...>`) or Prebid tags.
 * 
 * - CONNECTING REAL BACKENDS (FIREBASE / SUPABASE):
 *   Replace `localStorage` calls in `src/services/gamesService.ts` with Firestore collections
 *   or Supabase client calls. The service interface (`getGames()`, `addGame()`, etc.) is
 *   already abstracted so UI components need zero changes.
 * 
 * - REAL USER ACCOUNTS & SUBSCRIPTIONS:
 *   Replace the local waitlist in `src/pages/PremiumPage.tsx` with Stripe Checkout /
 *   Paddle sessions and Firebase Auth / Supabase Auth.
 * =========================================================================================
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { GamePage } from './pages/GamePage';
import { CategoryPage } from './pages/CategoryPage';
import { SearchPage } from './pages/SearchPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { PremiumPage } from './pages/PremiumPage';
import { AdminPage } from './pages/AdminPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 transition-colors">
          <Header />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/game/:slug" element={<GamePage />} />
              <Route path="/category/:name" element={<CategoryPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/premium" element={<PremiumPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
