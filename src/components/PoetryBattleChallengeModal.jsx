import React, { useState } from 'react';
import { X, Swords, Send, UserPlus, Share2, Sparkles, CheckCircle2, Copy } from 'lucide-react';

export const PoetryBattleChallengeModal = ({ isOpen, onClose, onSubmitChallenge }) => {
  const [targetOpponent, setTargetOpponent] = useState('अमित वर्मा (@amit_writer)');
  const [customOpponent, setCustomOpponent] = useState('');
  const [battleTopic, setBattleTopic] = useState('सावन और विरह की वेदना');
  const [poemTitle, setPoemTitle] = useState('');
  const [poemContent, setPoemContent] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const sampleOpponents = [
    { id: 'o1', name: 'अमित वर्मा', username: '@amit_writer' },
    { id: 'o2', name: 'प्रिया सिंह', username: '@priya_poetry' },
    { id: 'o3', name: 'शैलेंद्र मिश्र', username: '@shailendra_kavi' }
  ];

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!poemTitle.trim() || !poemContent.trim()) return;

    const opponentName = customOpponent.trim() ? customOpponent : targetOpponent;

    onSubmitChallenge({
      id: `battle-${Date.now()}`,
      topic: battleTopic,
      opponent: opponentName,
      myPoem: {
        title: poemTitle,
        content: poemContent
      },
      time: 'अभी-अभी शुरू हुआ',
      status: 'LIVE'
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(`https://bolteekalam.com/battles/invite?id=${Date.now()}`);
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
                कवि संग्राम 1-on-1 द्वंद्व चुनौती
              </h3>
              <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold block">
                प्रतिद्वंद्वी को आमंत्रित करें एवं अपनी रचना प्रस्तुत करें (+50 Pts)
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/30">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">चुनौती सफलतापूर्वक भेज दी गई है!</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              आपकी रचना कवि संग्राम मंच पर 1-on-1 बैटल में लाइव हो गई है। (+50 पॉइंट्स आपके खाते में जोड़े गए)
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
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold border border-slate-200 dark:border-slate-700"
                required
              />
            </div>

            {/* Select Opponent or Invite via WhatsApp */}
            <div className="space-y-2">
              <label className="font-bold block text-slate-700 dark:text-slate-300">प्रतिद्वंद्वी चुनें या व्हाट्सएप/लिंक से इनवाइट करें:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <select
                  value={targetOpponent}
                  onChange={(e) => setTargetOpponent(e.target.value)}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold border border-slate-200 dark:border-slate-700"
                >
                  {sampleOpponents.map(op => (
                    <option key={op.id} value={`${op.name} (${op.username})`}>
                      {op.name} ({op.username})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleCopyInviteLink}
                  className="p-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 font-bold rounded-xl flex items-center justify-center gap-1.5 border border-emerald-500/30 transition"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copiedLink ? 'इनवाइट लिंक कॉपी हुआ!' : 'मित्र को इनवाइट लिंक भेजें'}</span>
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
                placeholder="उदा. विरह की पहली भोर"
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

            <button
              type="submit"
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-rose-900/20 flex items-center justify-center gap-2 transition active:scale-95 mt-2"
            >
              <Swords className="w-4 h-4" />
              <span>चुनौती भेजें एवं बैटल में भाग लें (+50 Pts)</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default PoetryBattleChallengeModal;
