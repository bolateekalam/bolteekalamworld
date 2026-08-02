import React, { useState, useEffect } from 'react';
import { Flame, Clock, Award, Sparkles, Send, CheckCircle2, User, Heart, Trophy, Crown, Edit3, Lock, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const DailyChallengeView = ({ dailyChallenge, onOpenCertificate, requireAuth }) => {
  const { t } = useLanguage();
  const [submission, setSubmission] = useState('');
  const [submittedPoem, setSubmittedPoem] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit limit tracking (Max 5 edits allowed per weekly submission)
  const [editCount, setEditCount] = useState(0);
  const maxEditsAllowed = 5;

  const challenge = dailyChallenge || {
    id: 'wc-this-week',
    title: 'बरसात का पहला ख़त',
    prompt: 'सावन की पहली फुहार और पुराने ख़तों की यादों को समेटते हुए 4 उत्कृष्ट पंक्तियाँ लिखें।',
    endsIn: '4 दिन 14 घंटे',
    participants: 312,
    reward1st: 500,
    reward2nd: 250
  };

  const storageKey = `weekly_submission_${challenge.title.replace(/\s+/g, '_')}`;
  const editCountKey = `weekly_edit_count_${challenge.title.replace(/\s+/g, '_')}`;

  // Load persistent submission from localStorage on mount & challenge change!
  useEffect(() => {
    const savedPoem = localStorage.getItem(storageKey);
    const savedEditCount = localStorage.getItem(editCountKey);

    if (savedPoem) {
      setSubmittedPoem(savedPoem);
      setSubmitted(true);
    } else {
      setSubmittedPoem('');
      setSubmitted(false);
    }

    if (savedEditCount) {
      setEditCount(parseInt(savedEditCount, 10) || 0);
    } else {
      setEditCount(0);
    }
  }, [challenge.title]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!submission.trim()) return;

    if (requireAuth && !requireAuth()) return;

    if (submitted && isEditing) {
      // Editing existing submission
      if (editCount >= maxEditsAllowed) {
        alert('आप 5 बार संपादन (Edits) की अधिकतम सीमा पूरी कर चुके हैं!');
        return;
      }
      const newEditCount = editCount + 1;
      setSubmittedPoem(submission);
      setEditCount(newEditCount);
      setIsEditing(false);

      // Save permanently to localStorage!
      localStorage.setItem(storageKey, submission);
      localStorage.setItem(editCountKey, newEditCount.toString());
    } else {
      // First-time submission of the week
      setSubmittedPoem(submission);
      setSubmitted(true);

      // Save permanently to localStorage!
      localStorage.setItem(storageKey, submission);
      localStorage.setItem(editCountKey, '0');
    }
  };

  const handleStartEdit = () => {
    if (editCount >= maxEditsAllowed) return;
    setSubmission(submittedPoem);
    setIsEditing(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-600 via-rose-700 to-amber-900 text-white shadow-xl flex items-center justify-between flex-wrap gap-4 border border-amber-500/40">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-300 animate-bounce" />
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[10px]">
              साप्ताहिक लेखन चुनौती (Weekly Literature Challenge)
            </span>
          </div>
          <h1 className="text-2xl font-rozha text-amber-100">{challenge.title}</h1>
          <p className="text-xs text-amber-200/90 font-tiro leading-relaxed">
            "{challenge.prompt}"
          </p>

          <div className="flex items-center gap-4 text-xs font-bold text-amber-200 pt-1">
            <span className="flex items-center gap-1">🥇 1st Winner: +500 Pts</span>
            <span className="flex items-center gap-1">🥈 2nd Winner: +250 Pts</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/60 backdrop-blur-md border border-amber-400/30 text-center space-y-1">
          <span className="text-[10px] text-amber-300 block">सप्ताह परिणाम समय शेष</span>
          <span className="text-sm font-mono font-bold text-white">{challenge.endsIn}</span>
          <span className="text-[10px] text-slate-300 block pt-1">{challenge.participants} रचनाकारों की प्रविष्टियाँ दर्ज</span>
        </div>
      </div>

      {/* Submission Card & Rules */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>आपकी साप्ताहिक प्रविष्टि (Weekly Entry Limit: 1 Submission Only)</span>
          </h3>

          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[10px]">
            नियम: 1 हफ़्ते में 1 ही सबमिशन + अधिकतम 5 बार एडिट की अनुमति
          </span>
        </div>

        {submitted && !isEditing ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h4 className="font-bold text-sm">आपकी इस सप्ताह की प्रविष्टि सुरक्षित दर्ज है! (1/1 Complete)</h4>
              </div>

              {/* Edit Button with 5 Max Edits Count Display */}
              {editCount < maxEditsAllowed ? (
                <button
                  onClick={handleStartEdit}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>संपादित करें ({maxEditsAllowed - editCount}/{maxEditsAllowed} एडिट शेष)</span>
                </button>
              ) : (
                <span className="px-3 py-1 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 text-xs font-bold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>संशोधन सीमा पूर्ण (5/5 Limit Reached)</span>
                </span>
              )}
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500/20 font-tiro text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
              {submittedPoem}
            </div>

            <p className="text-[11px] text-slate-500">
              साप्ताहिक ज्यूरी रविवार को परिणाम घोषित करेगी। रिफ्रेश करने पर भी आपकी कविता सुरक्षित रहेगी!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isEditing && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>आप अपनी प्रविष्टि को संपादित कर रहे हैं (एडिट प्रयोग: {editCount + 1}/{maxEditsAllowed})</span>
              </div>
            )}

            <textarea
              value={submission}
              onChange={(e) => setSubmission(e.target.value)}
              rows={5}
              placeholder={`यहाँ विषय '${challenge.title}' पर अपनी पंक्तियाँ लिखें...`}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-tiro focus:outline-none focus:border-amber-500"
              required
            />
            
            <div className="flex justify-between items-center flex-wrap gap-2">
              <span className="text-[11px] text-slate-400 font-bold">
                * ध्यान दें: 1 हफ़्ते में केवल 1 नया सबमिशन किया जा सकता है जो पूरे सप्ताह तक बना रहेगा।
              </span>

              <div className="flex gap-2">
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                  >
                    रद्द करें
                  </button>
                )}

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md active:scale-95 transition"
                >
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>{isEditing ? 'संपादित प्रविष्टि सहेजें' : 'प्रविष्टि जमा करें (Submit Entry)'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

    </div>
  );
};

export default DailyChallengeView;
