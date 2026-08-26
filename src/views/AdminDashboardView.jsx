import React, { useState } from 'react';
import { 
  Shield, Trophy, Bell, Cake, Sparkles, CheckCircle2, XCircle, 
  Crown, RefreshCcw, PlusCircle, Send, Edit3, ShieldCheck, Megaphone,
  X, Eye, ArrowLeft, LogOut, Users, Trash2, Key, UserCheck, Lock, Mail
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { FESTIVAL_THEMES, detectCurrentAutoFestivalTheme } from '../data/festivalThemes';
import { broadcastAdminNotification } from '../lib/notificationService';

export const AdminDashboardView = ({ 
  posts = [], 
  setPosts, 
  onOpenBirthdayCard,
  userProfile,
  setUserProfile,
  weeklyChallenge,
  setWeeklyChallenge,
  patrioticBanner,
  setPatrioticBanner,
  activeFestivalTheme,
  onUpdateFestivalTheme,
  youtubeProofs = [],
  onApproveProof,
  onRejectProof,
  adminRole = 'super_admin', // 'super_admin' | 'sub_admin'
  onExitAdmin
}) => {
  const { t } = useLanguage();
  const isSuperAdmin = adminRole === 'super_admin';

  const [activeTab, setActiveTab] = useState('weeklyJury');
  const [selectedFestivalKey, setSelectedFestivalKey] = useState(activeFestivalTheme?.id || 'auto');
  const [zoomedProofImage, setZoomedProofImage] = useState(null);

  // Push Broadcaster Form State
  const [notifTitle, setNotifTitle] = useState('🔴 बोलती कलम: विशेष काव्य पाठ LIVE');
  const [notifBody, setNotifBody] = useState('बोलती कलम आधिकारिक यूट्यूब चैनल (@bolateekalam) पर विशेष काव्य सत्र शुरू हो चुका है। तुरंत जुड़ें!');
  const [notifUrl, setNotifUrl] = useState('https://www.youtube.com/@bolateekalam');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // New Weekly Topic Form State
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicPrompt, setNewTopicPrompt] = useState('');
  const [topicPublished, setTopicPublished] = useState(false);

  // Custom Birthday Card Creator Form State
  const [customName, setCustomName] = useState('');
  const [customCity, setCustomCity] = useState('');

  // Sub-Admin / Moderator Management State (Exclusive to Super Admin)
  const [moderatorList, setModeratorList] = useState(() => {
    try {
      const stored = localStorage.getItem('bolteekalam_authorized_moderators_list');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      { id: 'm1', name: 'ज्यूरी मॉडरेटर 1', email: 'jury@bolteekalam.com', password: 'jury2026', role: 'Jury & Tasks', created: '25 अगस्त 2026' },
      { id: 'm2', name: 'टास्क मॉडरेटर 2', email: 'mod@bolteekalam.com', password: 'mod2026', role: 'Tasks Only', created: '25 अगस्त 2026' }
    ];
  });

  const [newModName, setNewModName] = useState('');
  const [newModEmail, setNewModEmail] = useState('');
  const [newModPassword, setNewModPassword] = useState('');
  const [modSuccessMsg, setModSuccessMsg] = useState('');

  // Derive weekly submissions dynamically from live posts in database
  const weeklySubmissions = React.useMemo(() => {
    if (!posts || posts.length === 0) return [];
    return posts.map(p => ({
      id: p.id,
      author: p.author?.name || p.authorName || 'साहित्य साधक',
      authorId: p.author?.id || 'u-real',
      title: p.title || 'काव्य रचना',
      content: p.content || '',
      time: p.createdAt || 'हाल ही में'
    }));
  }, [posts]);

  // Winners State
  const [winner1stId, setWinner1stId] = useState(null);
  const [winner2ndId, setWinner2ndId] = useState(null);
  const [disqualifiedIds, setDisqualifiedIds] = useState([]);

  // Today's Birthday Writers List
  const [birthdayUsers] = useState([
    { id: 'b1', name: 'लोकेश शर्मा', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', city: 'जयपुर', date: 'आज का दिन 🎉' },
    { id: 'b2', name: 'अनामिका शर्मा', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', city: 'मेरठ', date: 'आज का दिन 🎉' }
  ]);

  // Winner 1st (+500 Pts)
  const handleDeclare1st = (subId, authorName) => {
    setWinner1stId(subId);
    if (authorName.includes('आप') && setUserProfile) {
      setUserProfile(prev => ({ ...prev, points: prev.points + 500 }));
    }
  };

  // Winner 2nd (+250 Pts)
  const handleDeclare2nd = (subId, authorName) => {
    setWinner2ndId(subId);
    if (authorName.includes('आप') && setUserProfile) {
      setUserProfile(prev => ({ ...prev, points: prev.points + 250 }));
    }
  };

  const handleDisqualify = (subId) => {
    setDisqualifiedIds(prev => [...prev, subId]);
  };

  const handleResetWinners = () => {
    setWinner1stId(null);
    setWinner2ndId(null);
    setDisqualifiedIds([]);
  };

  // Publish New Weekly Topic Handler
  const handlePublishNewTopic = (e) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !newTopicPrompt.trim()) return;

    if (setWeeklyChallenge) {
      setWeeklyChallenge({
        topic: newTopicTitle.trim(),
        title: newTopicTitle.trim(),
        prompt: newTopicPrompt.trim(),
        reward: 500,
        deadline: '07 दिन शेष'
      });
    }

    setTopicPublished(true);
    setNewTopicTitle('');
    setNewTopicPrompt('');
    setTimeout(() => setTopicPublished(false), 4000);
  };

  // Generate Custom Birthday Card Handler
  const handleGenerateCustomBirthday = (e) => {
    e.preventDefault();
    if (!customName.trim()) return;
    onOpenBirthdayCard({
      id: `custom-bday-${Date.now()}`,
      name: customName.trim(),
      city: customCity.trim() || 'प्रयागराज',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      date: 'आज का विशेष दिन 🎉'
    });
  };

  // Create Moderator Handler (Super Admin)
  const handleCreateModerator = (e) => {
    e.preventDefault();
    if (!newModName.trim() || !newModEmail.trim() || !newModPassword.trim()) return;

    const newMod = {
      id: `mod_${Date.now()}`,
      name: newModName.trim(),
      email: newModEmail.trim().toLowerCase(),
      password: newModPassword.trim(),
      role: 'Jury & Tasks',
      created: new Date().toLocaleDateString('hi-IN')
    };

    const updated = [newMod, ...moderatorList];
    setModeratorList(updated);
    try {
      localStorage.setItem('bolteekalam_authorized_moderators_list', JSON.stringify(updated));
    } catch (err) {}

    setNewModName('');
    setNewModEmail('');
    setNewModPassword('');
    setModSuccessMsg(`✓ नया ज्यूरी एडमिन (${newMod.name}) सफलतापूर्वक बना दिया गया!`);
    setTimeout(() => setModSuccessMsg(''), 4000);
  };

  // Delete Moderator Handler (Super Admin)
  const handleDeleteModerator = (id) => {
    if (!window.confirm('क्या आप सचमुच इस मॉडरेटर का एक्सेस हटाना चाहते हैं?')) return;
    const updated = moderatorList.filter(m => m.id !== id);
    setModeratorList(updated);
    try {
      localStorage.setItem('bolteekalam_authorized_moderators_list', JSON.stringify(updated));
    } catch (err) {}
  };

  const currentTopicDisplay = weeklyChallenge?.topic || weeklyChallenge?.title || 'साप्ताहिक काव्य चुनौती';

  // Define Clean Sub-Tabs (Strictly Filtered based on Role)
  const availableTabs = [
    { id: 'weeklyJury', label: '1. 🏆 साप्ताहिक ज्यूरी', icon: Trophy, badge: weeklySubmissions.length },
    { id: 'youtubeProofs', label: '2. 🎬 यूट्यूब टास्क सत्यापन', icon: ShieldCheck, badge: (youtubeProofs || []).filter(p => p.status === 'pending').length },
    { id: 'birthdays', label: '3. 🎂 जन्मदिन कार्ड', icon: Cake, badge: birthdayUsers.length },
    ...(isSuperAdmin ? [
      { id: 'pushNotif', label: '4. 📢 पुश ब्रॉडकास्टर', icon: Bell, badgeColor: 'bg-rose-500' },
      { id: 'moderators', label: '5. 👥 मॉडरेटर खाता प्रबंधन', icon: Users, badge: moderatorList.length },
      { id: 'festivals', label: '6. 🎨 फेस्टिवल थीम', icon: Sparkles }
    ] : [])
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* 1. Admin Header Bar */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white shadow-xl flex items-center justify-between flex-wrap gap-4 border border-rose-900/40">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-600 text-white shadow-lg shadow-rose-900/40">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-rozha text-rose-100 flex items-center gap-2 flex-wrap">
              <span>बोलती कलम एडमिन कंट्रोल सेंटर</span>
              {isSuperAdmin ? (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black flex items-center gap-1 shadow">
                  <Crown className="w-3 h-3 fill-slate-950" />
                  <span>सुपर एडमिन (पूर्ण नियंत्रण)</span>
                </span>
              ) : (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-600 text-white font-bold">
                  ज्यूरी व टास्क मॉडरेटर
                </span>
              )}
            </h1>
            <p className="text-xs text-rose-200/80 mt-0.5 font-tiro">
              {isSuperAdmin 
                ? 'सभी प्रमुख अधिकार सक्रिय: ज्यूरी परिणाम, यूट्यूब टास्क, जन्मदिन कार्ड, पुश ब्रॉडकास्ट व मॉडरेटर प्रबंधन।'
                : 'सीमित अधिकार सक्रिय: केवल साप्ताहिक ज्यूरी परिणाम, यूट्यूब सत्यापन व जन्मदिन कार्ड।'}
            </p>
          </div>
        </div>

        {onExitAdmin && (
          <button
            type="button"
            onClick={onExitAdmin}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 shadow cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>वेबसाइट पर वापस जाएं</span>
          </button>
        )}
      </div>

      {/* 2. Clean Tab Navigation Bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto p-1.5 gap-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
        {availableTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full font-extrabold text-[10px] ${
                  isActive ? 'bg-white text-rose-600' : 'bg-rose-500/10 text-rose-600'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: 🏆 WEEKLY JURY & WINNERS */}
      {/* ========================================================= */}
      {activeTab === 'weeklyJury' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs flex items-center justify-between flex-wrap gap-2">
            <div>
              <strong className="block text-sm font-rozha">वर्तमान विषय: "{currentTopicDisplay}"</strong>
              <span>🥇 1st Winner: +500 Pts | 🥈 2nd Winner: +250 Pts | विषय से बाहर रचना को अमान्य करें।</span>
            </div>
            {(winner1stId || winner2ndId) && (
              <button
                onClick={handleResetWinners}
                className="px-3 py-1.5 bg-slate-800 text-amber-400 font-bold rounded-xl text-xs flex items-center gap-1 hover:bg-slate-700 transition cursor-pointer"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>विजेता बदलें (Reset)</span>
              </button>
            )}
          </div>

          {/* New Topic Publish Form (Fast & Clean) */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3 shadow-sm">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-rose-600" />
              <span>नया साप्ताहिक विषय जारी करें (Publish Next Weekly Topic)</span>
            </h4>

            {topicPublished ? (
              <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>नया साप्ताहिक विषय सफलतापूर्वक लाइव हो गया!</span>
              </div>
            ) : (
              <form onSubmit={handlePublishNewTopic} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <input
                  type="text"
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  placeholder="विषय का नाम (उदा. आज़ादी की भोर)"
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-slate-100"
                  required
                />
                <input
                  type="text"
                  value={newTopicPrompt}
                  onChange={(e) => setNewTopicPrompt(e.target.value)}
                  placeholder="संक्षिप्त निर्देश (Prompt)..."
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow transition active:scale-95 cursor-pointer"
                >
                  विषय लाइव करें 🚀
                </button>
              </form>
            )}
          </div>

          {/* Submissions List */}
          <div className="space-y-4">
            {weeklySubmissions.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                अभी इस विषय पर कोई रचना प्राप्त नहीं हुई है।
              </div>
            ) : (
              weeklySubmissions.map((sub) => {
                const is1st = winner1stId === sub.id;
                const is2nd = winner2ndId === sub.id;
                const isDisqualified = disqualifiedIds.includes(sub.id);

                return (
                  <div 
                    key={sub.id}
                    className={`p-5 rounded-3xl border transition space-y-3 ${
                      isDisqualified
                        ? 'bg-slate-100 dark:bg-slate-800/40 border-rose-300 opacity-50'
                        : is1st 
                        ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30' 
                        : is2nd
                        ? 'bg-purple-500/10 border-purple-500 ring-2 ring-purple-500/30'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{sub.author}</span>
                        {is1st && (
                          <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 rounded-full font-bold text-[10px] flex items-center gap-1">
                            <Crown className="w-3 h-3 fill-slate-950" />
                            <span>🥇 1st Winner (+500 Pts)</span>
                          </span>
                        )}
                        {is2nd && (
                          <span className="px-2.5 py-0.5 bg-purple-600 text-white rounded-full font-bold text-[10px] flex items-center gap-1">
                            <Trophy className="w-3 h-3 text-white" />
                            <span>🥈 2nd Winner (+250 Pts)</span>
                          </span>
                        )}
                        {isDisqualified && (
                          <span className="px-2.5 py-0.5 bg-rose-600 text-white rounded-full font-bold text-[10px]">
                            ❌ विषय से बाहर
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{sub.time}</span>
                    </div>

                    <h4 className="font-rozha text-base text-rose-900 dark:text-rose-100">{sub.title}</h4>
                    <p className="font-tiro text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                      {sub.content}
                    </p>

                    <div className="flex justify-end gap-2 pt-1">
                      {!isDisqualified && (
                        <>
                          <button
                            onClick={() => handleDeclare1st(sub.id, sub.author)}
                            disabled={!!winner1stId}
                            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 shadow cursor-pointer"
                          >
                            <span>🥇 1st Winner (+500 Pts)</span>
                          </button>

                          <button
                            onClick={() => handleDeclare2nd(sub.id, sub.author)}
                            disabled={!!winner2ndId}
                            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow cursor-pointer"
                          >
                            <span>🥈 2nd Winner (+250 Pts)</span>
                          </button>

                          <button
                            onClick={() => handleDisqualify(sub.id)}
                            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs cursor-pointer"
                          >
                            <span>❌ अमान्य करें</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: 🎬 YOUTUBE TASK VERIFICATION */}
      {/* ========================================================= */}
      {activeTab === 'youtubeProofs' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-center justify-between">
            <span className="font-bold flex items-center gap-1.5">
              <span>🔴</span> यूट्यूब सब्सक्राइब स्क्रीनशॉट सत्यापन (Pending Proofs: {(youtubeProofs || []).filter(p => p.status === 'pending').length})
            </span>
          </div>

          {(youtubeProofs || []).length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
              अभी कोई नया यूट्यूब सब्सक्राइब स्क्रीनशॉट सत्यापन हेतु लंबित नहीं है।
            </div>
          ) : (
            <div className="space-y-3">
              {youtubeProofs.map((proof) => (
                <div key={proof.id} className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 flex-wrap shadow-sm">
                  <div className="flex items-center gap-3">
                    {proof.image && (
                      <img 
                        src={proof.image} 
                        alt="Proof" 
                        onClick={() => setZoomedProofImage(proof.image)}
                        className="w-14 h-14 rounded-xl object-cover ring-2 ring-red-500 cursor-pointer hover:scale-105 transition" 
                      />
                    )}
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">{proof.userName || 'लेखक'}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">{proof.time || 'हाल ही में'}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 font-bold">
                        {proof.status === 'approved' ? '✓ स्वीकृत (+25 Pts)' : proof.status === 'rejected' ? '✕ अस्वीकृत' : '⏳ सत्यापन लंबित'}
                      </span>
                    </div>
                  </div>

                  {proof.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      {onApproveProof && (
                        <button
                          onClick={() => onApproveProof(proof)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>स्वीकृत करें (+25 Pts)</span>
                        </button>
                      )}
                      {onRejectProof && (
                        <button
                          onClick={() => onRejectProof(proof)}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>अस्वीकृत</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: 🎂 BIRTHDAY CARDS */}
      {/* ========================================================= */}
      {activeTab === 'birthdays' && (
        <div className="space-y-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Cake className="w-4 h-4 text-amber-500" />
              <span>किसी भी लेखक के लिए जन्मदिन विशिंग कार्ड बनाएँ</span>
            </h3>

            <form onSubmit={handleGenerateCustomBirthday} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="लेखक का नाम (उदा. अनामिका अंबर)"
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-slate-100"
                required
              />
              <input
                type="text"
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                placeholder="शहर का नाम (उदा. मेरठ)"
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow cursor-pointer"
              >
                🎂 जन्मदिन कार्ड बनाएँ
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {birthdayUsers.map((bUser) => (
              <div 
                key={bUser.id}
                className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-between gap-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <img src={bUser.avatar} alt={bUser.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-rose-500" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">{bUser.name}</h4>
                    <span className="text-[11px] text-slate-500">{bUser.city} • {bUser.date}</span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenBirthdayCard(bUser)}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow transition active:scale-95 shrink-0 cursor-pointer"
                >
                  <Cake className="w-3.5 h-3.5" />
                  <span>जन्मदिन कार्ड बनाएँ</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: 📢 PUSH BROADCASTER (SUPER ADMIN ONLY) */}
      {/* ========================================================= */}
      {isSuperAdmin && activeTab === 'pushNotif' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-900 dark:text-rose-300 text-xs flex items-center justify-between flex-wrap gap-2">
            <div className="space-y-0.5">
              <span className="font-extrabold flex items-center gap-1.5 text-sm">
                <Megaphone className="w-4 h-4 text-rose-600" />
                <span>📢 लाइव क्लाउड पुश ब्रॉडकास्टर (Super Admin Exclusive)</span>
              </span>
              <p className="text-[11px] opacity-80">
                यहाँ से भेजा गया नोटिफिकेशन पूरे देश के सभी मोबाइल व कंप्यूटर यूज़र्स को सीधे डिवाइस पर जाता है।
              </p>
            </div>
            <span className="px-3 py-1 bg-rose-600 text-white font-black rounded-xl text-xs shadow animate-pulse">
              🔴 लाइव ब्रॉडकास्ट
            </span>
          </div>

          {/* Quick Presets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => {
                setNotifTitle('🔴 बोलती कलम: विशेष काव्य पाठ LIVE');
                setNotifBody('बोलती कलम आधिकारिक यूट्यूब चैनल (@bolateekalam) पर विशेष काव्य सत्र शुरू हो चुका है। तुरंत जुड़ें!');
                setNotifUrl('https://www.youtube.com/@bolateekalam');
              }}
              className="p-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-left transition cursor-pointer"
            >
              <span className="font-extrabold text-red-600 dark:text-red-400 text-xs block">
                🔴 यूट्यूब लाइव अलर्ट (YouTube Live)
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-1">
                यूट्यूब पर विशेष काव्य सत्र शुरू हो चुका है।
              </p>
            </button>

            <button
              onClick={() => {
                setNotifTitle('🪈 दैनिक शब्द सामर्थ्य खेल अनलॉक (+5 Pts)');
                setNotifBody('आज का नया साहित्यिक शब्द और काव्य चुनौती उपलब्ध है। अभी खेलें और रिवॉर्ड पॉइंट्स पाएं!');
                setNotifUrl(`${window.location.origin}/sahityik-chunautiyan`);
              }}
              className="p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-left transition cursor-pointer"
            >
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-xs block">
                🪈 दैनिक शब्द चुनौती (+5 Pts)
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-1">
                आज का नया साहित्यिक शब्द और काव्य चुनौती उपलब्ध है।
              </p>
            </button>
          </div>

          {/* Custom Message Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  नोटिफिकेशन शीर्षक (Title):
                </label>
                <input
                  type="text"
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 font-bold"
                  placeholder="उदा. 🔴 विशेष काव्य पाठ LIVE"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  संदेश विवरण (Body):
                </label>
                <textarea
                  rows={3}
                  value={notifBody}
                  onChange={(e) => setNotifBody(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 font-serif"
                  placeholder="मोबाइल स्क्रीन पर दिखने वाला विस्तृत संदेश..."
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  लिंक (Target URL):
                </label>
                <input
                  type="text"
                  value={notifUrl}
                  onChange={(e) => setNotifUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 font-mono text-[11px]"
                />
              </div>

              {broadcastSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>पुश नोटिफिकेशन सभी यूज़र्स के मोबाइल व ब्राउज़र पर सफलतापूर्वक ब्रॉडकास्ट हो गया!</span>
                </div>
              )}

              <button
                type="button"
                disabled={isBroadcasting}
                onClick={async () => {
                  if (!notifTitle.trim()) {
                    alert('कृपया शीर्षक दर्ज करें!');
                    return;
                  }
                  setIsBroadcasting(true);
                  await broadcastAdminNotification({
                    title: notifTitle,
                    body: notifBody,
                    url: notifUrl
                  });
                  setIsBroadcasting(false);
                  setBroadcastSuccess(true);
                  setTimeout(() => setBroadcastSuccess(false), 4000);
                }}
                className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:brightness-110 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <Megaphone className="w-4 h-4 text-amber-200" />
                <span>{isBroadcasting ? 'ब्रॉडकास्ट भेजा जा रहा है...' : '📢 अभी तुरंत सभी यूज़र्स को पुश नोटिफिकेशन भेजें'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: 👥 SUB-ADMIN & MODERATOR ACCOUNTS (SUPER ADMIN ONLY) */}
      {/* ========================================================= */}
      {isSuperAdmin && activeTab === 'moderators' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-900 dark:text-purple-300 text-xs flex items-center justify-between flex-wrap gap-2">
            <div className="space-y-0.5">
              <span className="font-extrabold flex items-center gap-1.5 text-sm">
                <Users className="w-4 h-4 text-purple-600" />
                <span>👥 ज्यूरी व सब-एडमिन खाता प्रबंधन (Sub-Admin / Moderator Credentials)</span>
              </span>
              <p className="text-[11px] opacity-80">
                सुपर एडमिन के रूप में आप यहाँ से अपने सहायकों / ज्यूरी सदस्यों के लिए नया ईमेल और पासवर्ड बना सकते हैं या हटा सकते हैं।
              </p>
            </div>
          </div>

          {/* Create New Moderator Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-rose-600" />
              <span>नया ज्यूरी / टास्क मॉडरेटर जोड़ें (Add New Sub-Admin)</span>
            </h4>

            {modSuccessMsg && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{modSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateModerator} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">मॉडरेटर का नाम:</label>
                <input
                  type="text"
                  value={newModName}
                  onChange={(e) => setNewModName(e.target.value)}
                  placeholder="उदा. राहुल वर्मा (ज्यूरी)"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">लॉगिन ईमेल ID:</label>
                <input
                  type="email"
                  value={newModEmail}
                  onChange={(e) => setNewModEmail(e.target.value)}
                  placeholder="उदा. rahul@bolteekalam.com"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">गुप्त पासवर्ड (Password):</label>
                <input
                  type="text"
                  value={newModPassword}
                  onChange={(e) => setNewModPassword(e.target.value)}
                  placeholder="उदा. rahul2026"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono"
                  required
                />
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white font-bold rounded-2xl text-xs shadow transition active:scale-95 cursor-pointer"
                >
                  ✓ नया मॉडरेटर खाता बनाएं व अधिकार दें
                </button>
              </div>
            </form>
          </div>

          {/* Active Moderators List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>सक्रिय अधिकृत मॉडरेटर्स सूची ({moderatorList.length})</span>
            </h4>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {moderatorList.map((mod) => (
                <div key={mod.id} className="py-3 flex items-center justify-between gap-3 flex-wrap">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{mod.name}</span>
                      <span className="px-2 py-0.5 bg-purple-500/10 text-purple-600 rounded-md font-bold text-[10px]">
                        {mod.role}
                      </span>
                    </div>
                    <p className="text-slate-500 font-mono text-[11px]">
                      Email: <strong className="text-slate-700 dark:text-slate-300">{mod.email}</strong> • Pass: <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{mod.password}</code>
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteModerator(mod.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition cursor-pointer"
                    title="मॉडरेटर हटाएं"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: 🎨 GLOBAL FESTIVAL THEMES (SUPER ADMIN ONLY) */}
      {/* ========================================================= */}
      {isSuperAdmin && activeTab === 'festivals' && (
        <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-xl space-y-4 text-white">
          <div className="flex items-center gap-3 border-b border-purple-500/30 pb-3">
            <Sparkles className="w-6 h-6 text-amber-300" />
            <div>
              <h3 className="font-bold text-base font-rozha text-amber-300">
                ग्लोबल त्यौहार व फेस्टिवल थीम नियंत्रक
              </h3>
              <p className="text-xs text-purple-200/80">
                15 अगस्त, रक्षाबंधन, जन्माष्टमी, दिवाली आदि के लिए पूरे देश के यूज़र्स की थीम बदलें:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <select
              value={selectedFestivalKey}
              onChange={(e) => {
                const key = e.target.value;
                setSelectedFestivalKey(key);
                const themeObj = key === 'auto' ? detectCurrentAutoFestivalTheme() : FESTIVAL_THEMES[key];
                if (themeObj && onUpdateFestivalTheme) {
                  onUpdateFestivalTheme(themeObj);
                }
              }}
              className="w-full p-3.5 rounded-2xl bg-slate-950 border border-amber-500/60 font-bold text-amber-300 text-xs shadow-inner cursor-pointer"
            >
              {Object.values(FESTIVAL_THEMES).map((thm) => (
                <option key={thm.id} value={thm.id}>
                  {thm.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                const themeObj = selectedFestivalKey === 'auto' ? detectCurrentAutoFestivalTheme() : FESTIVAL_THEMES[selectedFestivalKey];
                if (onUpdateFestivalTheme) {
                  onUpdateFestivalTheme(themeObj || FESTIVAL_THEMES.default);
                }
                alert(`🎉 फेस्टिवल थीम लागू हो गई! पूरी वेबसाइट पर "${themeObj?.name || 'चयनित थीम'}" थीम और बैनर लाइव हो गया है।`);
              }}
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-600 hover:brightness-110 text-slate-950 font-black rounded-2xl text-xs shadow-xl transition active:scale-95 cursor-pointer"
            >
              🚀 पूरी वेबसाइट पर थीम लागू करें
            </button>
          </div>
        </div>
      )}

      {/* Screenshot Lightbox Modal */}
      {zoomedProofImage && (
        <div 
          onClick={() => setZoomedProofImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in"
        >
          <div className="relative max-w-xl w-full max-h-[85vh] bg-slate-900 rounded-3xl overflow-hidden p-2 flex flex-col items-center">
            <button 
              onClick={() => setZoomedProofImage(null)}
              className="absolute top-4 right-4 p-2 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={zoomedProofImage} 
              alt="Zoomed Screenshot Proof" 
              className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboardView;
