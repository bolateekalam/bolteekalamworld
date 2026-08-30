import React, { useState, useMemo } from 'react';
import { X, Swords, Send, UserPlus, Share2, Sparkles, CheckCircle2, Copy, AlertTriangle } from 'lucide-react';

export const PoetryBattleChallengeModal = ({ 
  isOpen, 
  onClose, 
  onSubmitChallenge, 
  onCreateChallenge, 
  targetAuthor,
  registeredUsers = [],
  posts = [],
  currentUser,
  activeBattles = []
}) => {
  // Extract real registered users from platform (No Dummy Names!)
  const realUsersList = useMemo(() => {
    const list = new Map();
    
    // Add active logged in users
    if (registeredUsers && registeredUsers.length > 0) {
      registeredUsers.forEach(u => {
        if (u.name) list.set(u.name, { name: u.name, username: u.username || '@writer' });
      });
    }

    // Add unique authors from posts
    if (posts && posts.length > 0) {
      posts.forEach(p => {
        if (p.author?.name && p.author.name !== currentUser?.name) {
          list.set(p.author.name, {
            name: p.author.name,
            username: p.author.username || `@${p.author.name.toLowerCase().replace(/\s+/g, '_')}`
          });
        }
      });
    }

    // Default fallback real authors if list empty
    if (list.size === 0) {
      list.set('संजय राय (संस्थापक)', { name: 'संजय राय (संस्थापक)', username: '@sanjayrai_founder' });
      list.set('अनामिका अंबर (कवयित्री)', { name: 'अनामिका अंबर (कवयित्री)', username: '@anamika_amber' });
    }

    return Array.from(list.values());
  }, [registeredUsers, posts, currentUser]);

  const [selectedOpponentName, setSelectedOpponentName] = useState(
    targetAuthor?.name || realUsersList[0]?.name || 'संजय राय (संस्थापक)'
  );
  const [battleTopic, setBattleTopic] = useState('80वाँ स्वतंत्रता दिवस — 1-on-1 काव्य संग्राम');
  const [poemTitle, setPoemTitle] = useState('');
  const [poemContent, setPoemContent] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [customError, setCustomError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!poemTitle.trim() || !poemContent.trim()) return;

    // Check if target opponent is already in an active battle!
    const isOpponentInBattle = activeBattles.some(b => {
      const u1Name = b.user1?.name || '';
      const u2Name = b.user2?.name || '';
      return u1Name.includes(selectedOpponentName) || u2Name.includes(selectedOpponentName);
    });

    if (isOpponentInBattle) {
      setCustomError(`'${selectedOpponentName}' इस समय पहले से एक सक्रिय काव्य संग्राम में भाग ले रहे हैं। वह अभी नया संग्राम स्वीकार नहीं कर सकते। कृपया किसी अन्य साहित्यकार को चुनौती दें!`);
      return;
    }

    const challengeData = {
      id: `battle-${Date.now()}`,
      topic: battleTopic,
      opponent: selectedOpponentName,
      myPoem: {
        title: poemTitle,
        content: poemContent
      },
      time: '3 घंटे',
      status: 'LIVE'
    };

    if (onSubmitChallenge) onSubmitChallenge(challengeData);
    if (onCreateChallenge) onCreateChallenge(challengeData);

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(`https://www.bolateeworld.in/#battles/invite?id=${Date.now()}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-900/30">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-rozha text-slate-900 dark:text-slate-100">
                काव्य संग्राम 1-on-1 द्वंद्व चुनौती
              </h3>
              <span className="text-[10px] text-rose-600 font-bold block">
                पंजीकृत कवि को चुनें • चुनौती भेजने पर (-15 Pts)
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            aria-label="चैलेंज मॉडल बंद करें"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {customError && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-600 text-xs font-bold space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{customError}</span>
            </div>
            <button
              onClick={() => setCustomError('')}
              className="w-full py-1.5 bg-rose-600 text-white rounded-xl text-[11px] font-bold"
            >
              समझ गया, अन्य कवि चुनें
            </button>
          </div>
        )}

        {submitted ? (
          <div className="p-6 text-center space-y-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/30">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">चुनौती सफलतापूर्वक भेज दी गई है!</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              आपकी रचना कवि संग्राम मंच पर 3 घंटे के 1-on-1 बैटल में लाइव हो गई है। (-15 Pts)
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Battle Topic Selection */}
            <div>
              <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">संग्राम का विषय (Battle Topic):</label>
              <input
                type="text"
                value={battleTopic}
                onChange={(e) => setBattleTopic(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                required
              />
            </div>

            {/* Select Opponent from Real Registered Platform Users Only */}
            <div className="space-y-2">
              <label className="font-bold block text-slate-700 dark:text-slate-300">प्रतिद्वंद्वी पंजीकृत कवि को चुनें:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <select
                  value={selectedOpponentName}
                  onChange={(e) => {
                    setSelectedOpponentName(e.target.value);
                    setCustomError('');
                  }}
                  aria-label="प्रतिद्वंद्वी कवि चुनें"
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                >
                  {realUsersList.map((op, idx) => (
                    <option key={idx} value={op.name}>
                      {op.name} ({op.username})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleCopyInviteLink}
                  aria-label="इनवाइट लिंक कॉपी करें"
                  className="p-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 font-bold rounded-xl flex items-center justify-center gap-1.5 border border-emerald-500/30 transition"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copiedLink ? 'इनवाइट लिंक कॉपी हुआ!' : 'मित्र को इनवाइट भेजें'}</span>
                </button>
              </div>
            </div>

            {/* Write Poem Title */}
            <div>
              <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">आपकी कविता का शीर्षक (Poem Title): *</label>
              <input
                type="text"
                value={poemTitle}
                onChange={(e) => setPoemTitle(e.target.value)}
                placeholder="उदा. 80वाँ स्वतंत्रता दिवस हुंकार"
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                required
              />
            </div>

            {/* Write Poem Content */}
            <div>
              <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">आपकी कविता की पंक्तियाँ (Poem Content): *</label>
              <textarea
                value={poemContent}
                onChange={(e) => setPoemContent(e.target.value)}
                rows={4}
                placeholder="यहाँ अपनी रचना की 4 उत्कृष्ट पंक्तियाँ दर्ज करें..."
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-tiro text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                required
              />
            </div>

            {/* Submit Challenge Button with Prominent RED -15 Pts Badge */}
            <button
              type="submit"
              aria-label="चुनौती भेजें (-15 Pts)"
              className="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-extrabold rounded-xl text-xs shadow-lg flex items-center justify-center gap-2 transition active:scale-95 mt-2"
            >
              <Swords className="w-4 h-4" />
              <span>चुनौती भेजें एवं बैटल में भाग लें</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-200 text-[10px] font-mono font-black border border-rose-500/40">
                -15 Pts
              </span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default PoetryBattleChallengeModal;
