import React, { useState } from 'react';
import { Mail, Send, Check, MessageSquare, AlertCircle } from 'lucide-react';
import { SeoHelmet } from '../components/common/SeoHelmet';
import { gamesService } from '../services/gamesService';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Game Submission');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setLoading(true);
    setTimeout(() => {
      gamesService.saveContactSubmission({
        name: name.trim(),
        email: email.trim(),
        subject,
        message: message.trim(),
      });
      setLoading(false);
      setSubmitted(true);
    }, 400);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <SeoHelmet
        title="Contact PlayHub - Developer Submissions & Support"
        description="Get in touch with the PlayHub team for game submissions, bug reports, advertising, and partnership inquiries."
      />

      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center mx-auto">
          <Mail className="w-7 h-7" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
          Contact & Inquiries
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Are you a game developer wanting to showcase your HTML5 title? Have a bug report or advertising proposal? Send us a message below.
        </p>
      </div>

      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider">
                Topic / Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Game Submission">Game Developer Submission (HTML5)</option>
                <option value="Bug Report">Technical Issue / Bug Report</option>
                <option value="Advertising">Advertising / Sponsorship Proposal</option>
                <option value="Feedback">General Feedback & Suggestions</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5 uppercase tracking-wider">
                Message *
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share the details of your inquiry, embed link, or feedback..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Sending message...' : 'Send Inquiry'}
            </button>
          </form>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white">Message Received!</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              Thank you for contacting PlayHub. Our team reviews game submissions and feedback regularly and will follow up shortly.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setMessage('');
              }}
              className="px-5 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold"
            >
              Send Another Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
