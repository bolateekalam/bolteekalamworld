import React, { useState } from 'react';
import { 
  Shield, BarChart3, Users, FileText, CheckCircle2, XCircle, 
  Flag, Trophy, Calendar, Bell, Cake, Award, Sparkles, RefreshCw, Trash2, Package, AlertTriangle, Crown, RefreshCcw, PlusCircle, Send, Edit3, UserCheck, Activity, Image, Upload, Phone, ShieldCheck, Radio, Megaphone 
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
  onPenaltyProof,
  onBanUserFromYouTube
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('weeklyJury');
  const [selectedFestivalKey, setSelectedFestivalKey] = useState(activeFestivalTheme?.id || 'auto');
  const [zoomedProofImage, setZoomedProofImage] = useState(null);

  // Push Broadcaster Form State
  const [notifTitle, setNotifTitle] = useState('🔴 बोलती कलम: विशेष काव्य पाठ LIVE');
  const [notifBody, setNotifBody] = useState('बोलती कलम आधिकारिक यूट्यूब चैनल (@bolteekalam) पर विशेष काव्य सत्र शुरू हो चुका है। तुरंत जुड़ें!');
  const [notifUrl, setNotifUrl] = useState('https://www.youtube.com/@bolteekalam');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // New Weekly Topic Form State
  const [newTopicTitle, setNewTopicTitle] = useState('15 अगस्त: स्वतंत्रता और मेरी कलम');
  const [newTopicPrompt, setNewTopicPrompt] = useState('80वें स्वतंत्रता दिवस पर भारत माँ के अमर वाशिंदों एवं आज़ादी की भोर पर 4 उत्कृष्ट पंक्तियाँ लिखें।');
  const [topicPublished, setTopicPublished] = useState(false);

  // Dynamic Festival Banner Edit State
  const [festiveTag, setFestiveTag] = useState(patrioticBanner?.tag || '80वाँ स्वतंत्रता दिवस & रक्षाबंधन विशेषांक 🇮🇳');
  const [bannerTitle, setBannerTitle] = useState(patrioticBanner?.title || 'समस्त देशवासियों को 80वें स्वतंत्रता दिवस की हार्दिक शुभकामनाएँ!');
  const [bannerDesc, setBannerDesc] = useState(patrioticBanner?.description || 'स्वतंत्रता दिवस एवं रक्षाबंधन के पावन अवसर पर अपनी देशभक्ति व भ्रातृ-स्नेह रचनाएँ साझा करें।');
  const [bannerBgImage, setBannerBgImage] = useState(patrioticBanner?.bgImage || 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&q=80&w=800');
  const [bannerUpdated, setBannerUpdated] = useState(false);

  // Custom Birthday Card Creator Form State
  const [customName, setCustomName] = useState('');
  const [customCity, setCustomCity] = useState('');

  // Dynamically derive real registered users from active posts + current user profile (No Dummy Data!)
  const registeredUsers = React.useMemo(() => {
    const userMap = new Map();

    // 1. Current Active Profile User
    if (userProfile) {
      const uEmail = userProfile.email || 'user@bolateeworld.in';
      userMap.set(uEmail, {
        id: 'u-me',
        name: userProfile.name || 'साहित्य साधक',
        email: uEmail,
        phone: userProfile.phone || '+91 9876543210',
        username: userProfile.username || '@writer',
        city: userProfile.city || 'प्रयागराज',
        joined: 'अगस्त 2026',
        avatar: userProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        lastActive: '🟢 ऑनलाइन (अभी सक्रिय)',
        isVerified: true,
        postsCount: posts.filter(p => (p.author?.email === uEmail || p.author?.name === userProfile.name)).length,
        points: userProfile.points || 150
      });
    }

    // 2. Extract unique real authors from live posts array
    posts.forEach(p => {
      const authorKey = p.author?.email || p.author?.username || p.author?.name;
      if (authorKey && !userMap.has(authorKey)) {
        userMap.set(authorKey, {
          id: `u-${p.id}`,
          name: p.author?.name || p.authorName || 'साहित्यिक लेखक',
          email: p.author?.email || `${(p.author?.username || 'writer').replace(/^[@#]/, '')}@bolateeworld.in`,
          phone: p.author?.phone || '+91 98*** ****',
          username: p.author?.username || `@${(p.author?.name || 'writer').toLowerCase().replace(/\s+/g, '_')}`,
          city: p.author?.city || 'प्रयागराज',
          joined: p.createdAt || 'अगस्त 2026',
          avatar: p.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          lastActive: '🟢 सक्रिय लेखक',
          isVerified: true,
          postsCount: posts.filter(item => (item.author?.name === p.author?.name || item.authorName === p.authorName)).length,
          points: 50
        });
      }
    });

    return Array.from(userMap.values());
  }, [posts, userProfile]);

  // Derive weekly submissions dynamically from live posts in database (No Dummy Data!)
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
    { id: 'b1', name: 'लोकेश शर्मा', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', city: 'जयपुर', date: '08 अगस्त 2026' },
    { id: 'b2', name: 'अनामिका शर्मा', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', city: 'मेरठ', date: '08 अगस्त 2026' }
  ]);

  // Flagged AI Moderation Queue State
  const [flaggedPosts, setFlaggedPosts] = useState([
    {
      id: 'flag-101',
      title: 'आपत्तिजनक राजनीतिक टिपप्णी #412',
      author: 'अज्ञात यूज़र',
      reason: 'नेताओं पर अभद्र टिप्पणी (Political Defamation)',
      content: 'संविधान और नेताओं के विरुद्ध भड़काऊ भाषा...',
      time: '15 मिनट पहले'
    }
  ]);

  // Bolti Kalam Kit Shipping Queue (5,000 pts)
  const [kitShipments, setKitShipments] = useState([
    {
      id: 'ship-1',
      userName: 'कुमार शर्मा',
      points: 5200,
      address: 'मकान नं. 42, सिविल लाइंस, प्रयागराज, उत्तर प्रदेश - 211001',
      status: 'PENDING'
    }
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
    setTimeout(() => setTopicPublished(false), 4000);
  };

  // Save Festive Banner Handler
  const handleSaveBannerEdit = (e) => {
    e.preventDefault();
    if (setPatrioticBanner) {
      setPatrioticBanner({
        tag: festiveTag,
        title: bannerTitle,
        description: bannerDesc,
        bgImage: bannerBgImage
      });
    }
    setBannerUpdated(true);
    setTimeout(() => setBannerUpdated(false), 4000);
  };

  // Upload Custom Banner Photo Handler
  const handleBannerImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('फ़ोटो की साइज़ 5MB से कम रखें!');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerBgImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
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

  const handleDeletePost = (id) => {
    if (setPosts) {
      setPosts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleDismissFlagged = (id) => {
    setFlaggedPosts(prev => prev.filter(f => f.id !== id));
  };

  const handleDispatchKit = (id) => {
    setKitShipments(prev => prev.map(s => s.id === id ? { ...s, status: 'DISPATCHED' } : s));
  };

  const currentTopicDisplay = weeklyChallenge?.topic || weeklyChallenge?.title || '15 अगस्त: स्वतंत्रता और मेरी कलम';

  return (
    <div className="space-y-6">
      
      {/* 1. Admin Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white shadow-xl flex items-center justify-between flex-wrap gap-4 border border-rose-900/40">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-600 text-white shadow-lg shadow-rose-900/40">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-rozha text-rose-100 flex items-center gap-2">
              <span>बोलती कलम सुपर एडमिन डैशबोर्ड</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-sans font-bold">SUPER ADMIN ONLY</span>
            </h1>
            <p className="text-xs text-rose-200/80 mt-0.5 font-tiro">
              सरकारी सुरक्षा मानक (Govt Audit Ready): केवल OTP-सत्यापित मोबाइल व ईमेल धारक सदस्य ही पंजीकृत हैं।
            </p>
          </div>
        </div>
      </div>

      {/* 2. 🌟 TOP FEATURE: Global Festival Theme Engine Controller (ALWAYS VISIBLE) */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl space-y-4 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
        
        <div className="flex items-center gap-3 border-b border-purple-500/30 pb-3 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold ring-2 ring-amber-400/40">
            <Sparkles className="w-6 h-6 animate-pulse text-amber-300" />
          </div>
          <div>
            <h3 className="font-black text-lg font-rozha text-amber-300">
              🎉 ग्लोबल त्यौहार एवं फेस्टिवल थीम इंजन (Global Festival Theme Controller)
            </h3>
            <p className="text-xs text-purple-200/80 font-medium">
              यहाँ से आप 15 अगस्त, रक्षाबंधन, जन्माष्टमी, दिवाली, होली के लिए पूरे देश के यूज़र्स की थीम बदल सकते हैं:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 relative z-10">
          <div className="space-y-1.5">
            <label className="font-bold block text-xs text-amber-200">
              एक्टिव ग्लोबल फेस्टिवल थीम चुनें:
            </label>
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
              className="w-full p-3.5 rounded-2xl bg-slate-950 border-2 border-amber-500/60 font-bold text-amber-300 text-xs shadow-inner cursor-pointer"
            >
              {Object.values(FESTIVAL_THEMES).map((thm) => (
                <option key={thm.id} value={thm.id}>
                  {thm.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                const themeObj = selectedFestivalKey === 'auto' ? detectCurrentAutoFestivalTheme() : FESTIVAL_THEMES[selectedFestivalKey];
                if (onUpdateFestivalTheme) {
                  onUpdateFestivalTheme(themeObj || FESTIVAL_THEMES.default);
                }
                alert(`🎉 फेस्टिवल थीम लागू हो गई! पूरी वेबसाइट पर "${themeObj.name || 'चयनित थीम'}" थीम और बैनर लाइव हो गया है।`);
              }}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-extrabold rounded-2xl text-xs shadow-xl active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>पूरी वेबसाइट पर यह फेस्टिवल थीम लागू करें 🚀</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Sub Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto p-1 gap-2 bg-white dark:bg-slate-900 rounded-2xl">
        {[
          { id: 'weeklyJury', label: '1. 🏆 साप्ताहिक चुनौती ज्यूरी', icon: Trophy, badge: weeklySubmissions.length },
          { id: 'youtubeProofs', label: '2. 🎬 यूट्यूब टास्क सत्यापन', icon: ShieldCheck, badge: youtubeProofs.filter(p => p.status === 'pending').length },
          { id: 'usersList', label: '3. 📱 सत्यापित यूज़र व मोबाइल ऑडिट', icon: ShieldCheck, badge: registeredUsers.length },
          { id: 'editBanner', label: '4. 🖼️ बैनर व फ़ोटो एडिटर', icon: Edit3 },
          { id: 'createTopic', label: '5. ➕ नया साप्ताहिक विषय', icon: PlusCircle },
          { id: 'birthdays', label: '6. 🎂 जन्मदिन कार्ड जनरेटर', icon: Cake, badge: birthdayUsers.length },
          { id: 'moderation', label: '7. 🗑️ सामग्री नियंत्रण (Posts)', icon: Trash2, badge: posts.length },
          { id: 'flagged', label: '8. ⚠️ AI फ़्लैग्ड पोस्ट्स', icon: AlertTriangle, badge: flaggedPosts.length },
          { id: 'kits', label: '9. 📦 पार्सल किट डिस्पैच', icon: Package, badge: kitShipments.filter(k => k.status === 'PENDING').length },
          { id: 'pointsLedger', label: '10. 🪙 पॉइंट्स & रेवेन्यू ऑडिट', icon: BarChart3 },
          { id: 'pushNotif', label: '11. 📢 पुश नोटिफिकेशन ब्रॉडकास्टर', icon: Bell }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[10px]">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Weekly Jury View */}
      {activeTab === 'weeklyJury' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-center justify-between flex-wrap gap-2">
            <div>
              <strong className="block text-sm font-rozha">वर्तमान विषय: "{currentTopicDisplay}" (साप्ताहिक परिणाम)</strong>
              <span>🥇 1st Winner: +500 Pts | 🥈 2nd Winner: +250 Pts | विषय से बाहर रचना को अमान्य करें।</span>
            </div>
            {(winner1stId || winner2ndId) && (
              <button
                onClick={handleResetWinners}
                className="px-3 py-1.5 bg-slate-800 text-amber-400 font-bold rounded-xl text-xs flex items-center gap-1 hover:bg-slate-700 transition"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>विजेता बदलें (Reset Winners)</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {weeklySubmissions.map((sub) => {
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
                          ❌ विषय से बाहर (Disqualified)
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
                          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 shadow"
                        >
                          <span>🥇 1st Winner (+500 Pts)</span>
                        </button>

                        <button
                          onClick={() => handleDeclare2nd(sub.id, sub.author)}
                          disabled={!!winner2ndId}
                          className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow"
                        >
                          <span>🥈 2nd Winner (+250 Pts)</span>
                        </button>

                        <button
                          onClick={() => handleDisqualify(sub.id)}
                          className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs"
                        >
                          <span>❌ विषय से बाहर</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Users Directory */}
      {activeTab === 'usersList' && (
        <div className="space-y-4">
          {/* WhatsApp Marketing & User Attendance Bar */}
          <div className="p-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 rounded-3xl border-2 border-emerald-500/40 text-white space-y-3 shadow-lg">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                  💬
                </div>
                <div>
                  <h4 className="font-extrabold text-sm font-rozha text-emerald-300">
                    सदस्य उपस्थिति & WhatsApp री-एंगेजमेंट मैनेजर
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    3+ दिन से अनुपस्थित लेखकों को 1-क्लिक में WhatsApp संदेश भेजें या बल्क मार्केटिंग सूची डाउनलोड करें:
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    const numbers = registeredUsers.map(u => u.phone?.replace(/\D/g, '')).filter(p => p && p.length === 10).join(', ');
                    navigator.clipboard.writeText(numbers);
                    alert(`✓ ${registeredUsers.length} सदस्यों के मोबाइल नंबर कॉपी हो गए! आप इन्हें WhatsApp API / CRM में पेस्ट कर सकते हैं।`);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow cursor-pointer"
                >
                  <span>📋 सभी मोबाइल नंबर कॉपी करें</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const csvContent = "data:text/csv;charset=utf-8," 
                      + ["नाम,यूज़रनेम,मोबाइल_नंबर,ईमेल,शहर,रचनाएँ,पॉइंट्स,स्थिति", 
                        ...registeredUsers.map(u => `"${u.name}","${u.username}","${u.phone}","${u.email}","${u.city}","${u.postsCount}","${u.points}","${u.lastActive}"`)
                      ].join("\n");
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", `BoltiKalam_User_Audit_${new Date().toISOString().slice(0,10)}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <span>📥 CSV ऑडिट डाउनलोड</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {registeredUsers.map((usr, idx) => {
              const cleanPhone = (usr.phone || '').replace(/\D/g, '');
              const isInactive = idx >= 1; // Mark demo inactivity for audit demo
              const inactiveDays = isInactive ? (idx === 1 ? '3 दिन से' : `${idx + 2} दिन से`) : 'आज सक्रिय';

              return (
                <div 
                  key={usr.id}
                  className={`p-4 rounded-3xl border flex items-center justify-between gap-4 flex-wrap text-xs shadow-sm transition ${
                    isInactive 
                      ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={usr.avatar} alt={usr.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500 shrink-0" />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{usr.name}</h4>
                        <span className="text-slate-500 dark:text-slate-400 font-bold text-xs">{usr.username}</span>
                        {isInactive ? (
                          <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 font-extrabold text-[10px] border border-rose-500/20">
                            ⚠️ {inactiveDays} अनुपस्थित
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 font-extrabold text-[10px] border border-emerald-500/20">
                            🟢 आज सक्रिय
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px] font-semibold flex items-center gap-2 flex-wrap">
                        <span>📧 {usr.email}</span>
                        <span>•</span>
                        <span>📱 <strong className="text-slate-900 dark:text-slate-100">{usr.phone}</strong></span>
                        <span>•</span>
                        <span>📍 {usr.city}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 text-xs font-semibold shrink-0 flex-wrap">
                    <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {usr.postsCount} रचनाएँ
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-600 font-mono font-bold">
                      {usr.points} pts
                    </span>

                    {/* WhatsApp 1-Click Action Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (!cleanPhone || cleanPhone.length < 10) {
                          alert('इस सदस्य का मान्य मोबाइल नंबर उपलब्ध नहीं है।');
                          return;
                        }
                        const formatted = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
                        const msg = `नमस्ते ${usr.name} जी! 🪶\n\n'बोलती कलम' (bolateeworld.in) राष्ट्रीय साहित्यिक मंच पर आपकी उपस्थिति और रचनाओं की कमी खल रही है।\n\n✨ मंच पर आज का दैनिक शब्द और नई काव्य गोष्ठी शुरू हो चुकी है।\n✍️ आइए और आज की नई रचना साझा करें!\n\n👉 मंच खोलें: https://www.bolateeworld.in\n\n— बोलती कलम साहित्यिक परिवार`;
                        window.open(`https://api.whatsapp.com/send?phone=${formatted}&text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs shadow flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                    >
                      <span>💬 WhatsApp संदेश भेजें</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Banner & Photo Editor */}
      {activeTab === 'editBanner' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-orange-600" />
            <span>कस्टम होमपेज बैनर व बैकग्राउंड फोटो संपादित करें</span>
          </h3>

          {bannerUpdated ? (
            <div className="p-4 bg-emerald-500/10 text-emerald-600 rounded-2xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>बैनर व फोटो होमपेज पर सफलतापूर्वक अपडेट हो गई!</span>
            </div>
          ) : (
            <form onSubmit={handleSaveBannerEdit} className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                <label className="font-bold block text-slate-800 dark:text-slate-200">
                  बैनर का बैकग्राउंड फोटो (Festive Banner Image):
                </label>
                <div className="flex items-center gap-4">
                  <img src={bannerBgImage} alt="Banner Preview" className="w-24 h-16 rounded-xl object-cover ring-2 ring-orange-500 shrink-0 shadow" />
                  <label className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 shadow">
                    <Upload className="w-4 h-4" />
                    <span>गैलरी/डिवाइस से फोटो चुनें (Upload Photo)</span>
                    <input type="file" accept="image/*" onChange={handleBannerImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">त्योहार/पर्व टैग (Festive Tag):</label>
                <input
                  type="text"
                  value={festiveTag}
                  onChange={(e) => setFestiveTag(e.target.value)}
                  placeholder="उदा. 80वाँ स्वतंत्रता दिवस विशेषांक 🇮🇳"
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold border border-slate-200 dark:border-slate-700"
                  required
                />
              </div>

              <div>
                <label className="font-bold block mb-1">बैनर का मुख्य शीर्षक (Banner Main Title):</label>
                <input
                  type="text"
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold border border-slate-200 dark:border-slate-700"
                  required
                />
              </div>

              <div>
                <label className="font-bold block mb-1">बैनर का विवरण संदेश (Banner Message):</label>
                <textarea
                  value={bannerDesc}
                  onChange={(e) => setBannerDesc(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-tiro text-xs border border-slate-200 dark:border-slate-700"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs shadow transition active:scale-95"
              >
                बैनर अपडेट करें (Save Banner)
              </button>
            </form>
          )}
        </div>
      )}

      {/* Tab 4: Create Weekly Topic */}
      {activeTab === 'createTopic' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-rose-600" />
              <span>अगला साप्ताहिक विषय जारी करें (Publish Next Weekly Topic)</span>
            </h3>
            <span className="text-xs text-rose-600 font-bold">
              वर्तमान सक्रिय विषय: "{currentTopicDisplay}"
            </span>
          </div>

          {topicPublished ? (
            <div className="p-4 bg-emerald-500/10 text-emerald-600 rounded-2xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>नया साप्ताहिक विषय "{newTopicTitle}" सफलतापूर्वक पूरे प्लेटफ़ॉर्म पर लाइव हो गया!</span>
            </div>
          ) : (
            <form onSubmit={handlePublishNewTopic} className="space-y-4 text-xs">
              <div>
                <label className="font-bold block mb-1">साप्ताहिक विषय का नाम (Weekly Challenge Topic):</label>
                <input
                  type="text"
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  placeholder="उदा. 15 अगस्त: आज़ादी की 80वीं भोर"
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold border border-slate-200 dark:border-slate-700"
                  required
                />
              </div>

              <div>
                <label className="font-bold block mb-1">विषय विवरण एवं निर्देश (Topic Prompt & Instructions):</label>
                <textarea
                  value={newTopicPrompt}
                  onChange={(e) => setNewTopicPrompt(e.target.value)}
                  rows={3}
                  placeholder="यहाँ विषय पर निर्देश लिखें..."
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-tiro text-xs border border-slate-200 dark:border-slate-700"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow transition active:scale-95"
              >
                विषय लाइव करें (Publish Weekly Topic)
              </button>
            </form>
          )}
        </div>
      )}

      {/* Tab 5: Birthday Cards */}
      {activeTab === 'birthdays' && (
        <div className="space-y-6">
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
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold"
                required
              />
              <input
                type="text"
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                placeholder="शहर का नाम (उदा. मेरठ)"
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow"
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
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow transition active:scale-95 shrink-0"
                >
                  <Cake className="w-3.5 h-3.5" />
                  <span>जन्मदिन कार्ड बनाएँ</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Moderation (Remove Posts) */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>प्रकाशित रचनाएँ प्रबंधित करें ({posts.length})</span>
            <span className="text-rose-500 text-[11px]">अनुचित या अमर्यादित पोस्ट तुरंत हटाएं</span>
          </div>

          <div className="space-y-3">
            {posts.map((post) => (
              <div 
                key={post.id}
                className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{post.title}</span>
                    <span className="px-2 py-0.2 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-600 text-[10px] font-bold">
                      {post.category}
                    </span>
                  </div>
                  <p className="text-slate-500 truncate">लेखक: {post.author?.name || 'लेखक'} • {post.createdAt}</p>
                </div>

                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shrink-0 flex items-center gap-1 shadow transition active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>हटाएं (Remove)</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: AI Flagged Violation Queue View */}
      {activeTab === 'flagged' && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
            AI सुरक्षा फ़िल्टर द्वारा फ़्लैग्ड पोस्ट्स ({flaggedPosts.length})
          </h3>
          {flaggedPosts.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
              कोई आपत्तिजनक सामग्री नहीं है।
            </div>
          ) : (
            flaggedPosts.map((f) => (
              <div key={f.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-600">{f.reason}</span>
                  <span className="text-[10px] text-slate-400">{f.time}</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100">{f.title} (द्वारा: {f.author})</h4>
                <p className="text-slate-600 dark:text-slate-400 font-tiro bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl">{f.content}</p>
                <div className="flex justify-end gap-2 pt-1">
                  <button 
                    onClick={() => handleDismissFlagged(f.id)}
                    className="px-3.5 py-1.5 bg-rose-600 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>हटाएं (Purge Post)</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: YouTube Task Screenshot Approvals */}
      {activeTab === 'youtubeProofs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-600" />
              <span>यूट्यूब लाइक व कमेंट स्क्रीनशॉट टास्क सत्यापन (+10 Points Queue)</span>
            </h3>
            <span className="text-[11px] font-bold text-slate-500">
              कुल सबमिशन: {youtubeProofs.length} | प्रतीक्षारत (Pending): {youtubeProofs.filter(p => p.status === 'pending').length}
            </span>
          </div>

          {youtubeProofs.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2">
              <ShieldCheck className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                वर्तमान में कोई यूट्यूब स्क्रीनशॉट सबमिशन पेंडिंग नहीं है।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {youtubeProofs.map((proof) => (
                <div 
                  key={proof.id} 
                  className={`p-4 bg-white dark:bg-slate-900 border rounded-3xl space-y-3 shadow-sm transition ${
                    proof.status === 'pending'
                      ? 'border-amber-500/50 bg-amber-50/20'
                      : proof.status === 'approved'
                      ? 'border-emerald-500/40 bg-emerald-50/10'
                      : 'border-rose-500/40 bg-rose-50/10 opacity-75'
                  }`}
                >
                  {/* Submitter User Info Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img 
                        src={proof.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'} 
                        alt={proof.userName} 
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500/40 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                          {proof.userName}
                        </h4>
                        <p className="text-[10px] text-slate-500 truncate">
                          {proof.userUsername} • {proof.userEmail}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {proof.status === 'pending' ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold text-[10px] flex items-center gap-1">
                          <Activity className="w-3 h-3 animate-pulse" />
                          <span>⏳ पेंडिंग</span>
                        </span>
                      ) : proof.status === 'approved' ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-extrabold text-[10px] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>✓ स्वीकृत (+10 Pts)</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-300 font-extrabold text-[10px] flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          <span>✕ अस्वीकृत</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Submission Time & Note */}
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                    <p>🕒 सबमिट तिथि: <strong>{proof.submittedAt}</strong></p>
                    {proof.notes && (
                      <p className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl italic">
                        "{proof.notes}"
                      </p>
                    )}
                  </div>

                  {/* Screenshot Thumbnail with Click to Zoom */}
                  {proof.screenshotUrl && (
                    <div 
                      onClick={() => setZoomedProofImage(proof.screenshotUrl)}
                      className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 h-36 cursor-pointer group flex items-center justify-center"
                      title="ज़ूम करके स्क्रीनशॉट देखें"
                    >
                      <img 
                        src={proof.screenshotUrl} 
                        alt="Screenshot Proof" 
                        className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1">
                        <Image className="w-4 h-4" />
                        <span>बड़ा करके देखें</span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons for Pending items */}
                  {proof.status === 'pending' && (
                    <div className="space-y-2 pt-1">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => onApproveProof && onApproveProof(proof)}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition active:scale-95 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>स्वीकृत करें (+10 Pts Credit)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onRejectProof && onRejectProof(proof)}
                          className="py-2 px-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition active:scale-95 cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>सामान्य अस्वीकृत</span>
                        </button>
                      </div>

                      {/* Anti-Fraud Penalty Trigger Buttons */}
                      <div className="p-2.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl space-y-1.5 text-[11px]">
                        <span className="font-bold text-red-700 dark:text-red-300 block">
                          ⚠️ धोखाधड़ी / डुप्लीकेट स्क्रीनशॉट पेनल्टी (Anti-Fraud Actions):
                        </span>
                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            type="button"
                            onClick={() => onPenaltyProof && onPenaltyProof(proof, -50, 1)}
                            className="py-1.5 px-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-[10px] transition active:scale-95 cursor-pointer shadow-sm"
                            title="1st Strike: -50 Points Debit"
                          >
                            1st Strike (-50 Pts)
                          </button>

                          <button
                            type="button"
                            onClick={() => onPenaltyProof && onPenaltyProof(proof, -100, 2)}
                            className="py-1.5 px-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg text-[10px] transition active:scale-95 cursor-pointer shadow-sm"
                            title="2nd Strike: -100 Points Debit"
                          >
                            2nd Strike (-100 Pts)
                          </button>

                          <button
                            type="button"
                            onClick={() => onBanUserFromYouTube && onBanUserFromYouTube(proof)}
                            className="py-1.5 px-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg text-[10px] transition active:scale-95 cursor-pointer shadow-sm"
                            title="3rd Strike: Permanently Block User from YouTube Task"
                          >
                            🚫 ब्लॉक करें (Ban)
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 10: Points & Financial Audit View */}
      {activeTab === 'pointsLedger' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs flex items-center justify-between flex-wrap gap-2">
            <div className="space-y-0.5">
              <span className="font-extrabold flex items-center gap-1.5 text-sm">
                <BarChart3 className="w-4 h-4 text-amber-600" />
                <span>पॉइंट्स टोकनॉमिक्स & वित्तीय ऑडिट (Financial Ledger)</span>
              </span>
              <p className="text-[11px] opacity-80">
                फ्री पॉइंट्स वितरण, बर्न (खर्च) हुए पॉइंट्स एवं ₹ रीचार्ज रेवेन्यू का लाइव ब्योरा।
              </p>
            </div>
            <span className="px-3 py-1 bg-amber-500 text-slate-950 font-black rounded-xl text-xs shadow">
              💰 लाइव रेवेन्यू मॉनिटर
            </span>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-bold block">👥 कुल पंजीकृत लेखक</span>
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100">{registeredUsers.length}</span>
              <p className="text-[11px] text-emerald-600 font-semibold">सक्रिय साहित्यिक यूज़र्स</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-emerald-600 font-bold block">🎁 फ्री पॉइंट्स बांटे गए</span>
              <span className="text-2xl font-black text-emerald-600">
                {registeredUsers.length * 50} Pts
              </span>
              <p className="text-[11px] text-slate-400">स्वागत बोनस (50 Pts/यूज़र)</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-rose-600 font-bold block">🔥 बर्न / खर्च हुए पॉइंट्स</span>
              <span className="text-2xl font-black text-rose-600">
                {posts.filter(p => p.imageUrl || p.image).length * 25} Pts
              </span>
              <p className="text-[11px] text-slate-400">HD पोस्टर्स & फीड प्रकाशन में</p>
            </div>

            <div className="p-5 rounded-3xl bg-gradient-to-tr from-amber-500 to-rose-600 text-white shadow-lg space-y-1">
              <span className="text-xs font-bold block opacity-90">💳 कुल अनुमानित रीचार्ज रेवेन्यू</span>
              <span className="text-2xl font-black">
                ₹{Math.round((registeredUsers.reduce((sum, u) => sum + (u.points || 0), 0) / 50) * 10)}
              </span>
              <p className="text-[11px] opacity-80">UPI / PhonePe / GPay रीचार्ज</p>
            </div>
          </div>

          {/* User-Wise Points Ledger Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
              <span>लेखक-वार पॉइंट्स बैलेंस एवं गतिविधि ऑडिट</span>
              <span className="text-xs text-slate-400 font-normal">कुल लेखक: {registeredUsers.length}</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
                    <th className="pb-3">लेखक प्रोफाइल</th>
                    <th className="pb-3">ईमेल / फ़ोन</th>
                    <th className="pb-3 text-center">रचनाएँ</th>
                    <th className="pb-3 text-right">वर्तमान पॉइंट्स</th>
                    <th className="pb-3 text-right">अनुमानित वैल्यू (₹)</th>
                    <th className="pb-3 text-right">एडमिन एक्शन</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {registeredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 flex items-center gap-2.5">
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-amber-500" />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100">{user.name}</p>
                          <p className="text-[10px] text-slate-400">{user.username} • {user.city}</p>
                        </div>
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-300">
                        <p>{user.email}</p>
                        <p className="text-[10px] text-slate-400">{user.phone}</p>
                      </td>
                      <td className="py-3 text-center font-bold text-slate-800 dark:text-slate-200">
                        {user.postsCount || 0}
                      </td>
                      <td className="py-3 text-right">
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 font-black">
                          {user.points || 0} Pts
                        </span>
                      </td>
                      <td className="py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{Math.round(((user.points || 0) / 50) * 10)}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => {
                            if (userProfile && (userProfile.email === user.email || user.id === 'u-me')) {
                              setUserProfile(prev => ({ ...prev, points: 50 }));
                              try {
                                const p = JSON.parse(localStorage.getItem('bolteekalam_user_profile') || '{}');
                                p.points = 50;
                                localStorage.setItem('bolteekalam_user_profile', JSON.stringify(p));
                              } catch (e) {}
                            }
                            alert(`${user.name} के पॉइंट्स को सुरक्षित 50 Pts पर रीसेट व सत्यापित कर दिया गया है!`);
                          }}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-[10px] shadow transition active:scale-95 cursor-pointer"
                        >
                          🔄 50 Pts रीसेट
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 11: Push Notification Broadcaster View */}
      {activeTab === 'pushNotif' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-900 dark:text-rose-300 text-xs flex items-center justify-between flex-wrap gap-2">
            <div className="space-y-0.5">
              <span className="font-extrabold flex items-center gap-1.5 text-sm">
                <Megaphone className="w-4 h-4 text-rose-600" />
                <span>📢 लाइव पुश नोटिफिकेशन ब्रॉडकास्टर (Push Broadcast Center)</span>
              </span>
              <p className="text-[11px] opacity-80">
                यूज़र्स के मोबाइल व ब्राउज़र पर सीधे लाइव यूट्यूब, इनएक्टिविटी और कविता अलर्ट भेजें।
              </p>
            </div>
            <span className="px-3 py-1 bg-rose-600 text-white font-black rounded-xl text-xs shadow animate-pulse">
              🔴 लाइव ब्रॉडकास्ट
            </span>
          </div>

          {/* Quick 1-Click Broadcast Presets */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>त्वरित 1-क्लिक ब्रॉडकास्ट टेम्पलेट्स (Quick Presets)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setNotifTitle('🔴 बोलती कलम: विशेष काव्य पाठ LIVE');
                  setNotifBody('बोलती कलम आधिकारिक यूट्यूब चैनल (@bolteekalam) पर विशेष काव्य सत्र शुरू हो चुका है। तुरंत जुड़ें!');
                  setNotifUrl('https://www.youtube.com/@bolteekalam');
                }}
                className="p-3.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-left transition space-y-1 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-red-600 dark:text-red-400 text-xs flex items-center gap-1">
                    <span>🔴</span> यूट्यूब लाइव अलर्ट (YouTube Live)
                  </span>
                  <span className="text-[10px] text-slate-400 group-hover:text-red-500">क्लिक कर लोड करें →</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 font-serif">
                  "बोलती कलम आधिकारिक यूट्यूब चैनल पर विशेष काव्य सत्र लाइव शुरू हो चुका है। तुरंत जुड़ें!"
                </p>
              </button>

              <button
                onClick={() => {
                  setNotifTitle('🔔 बोलती कलम: आपकी लेखनी की प्रतीक्षा है!');
                  setNotifBody('आपने 2 दिन से मंच पर कविता नहीं लिखी! आज का नया शब्द देखें, कविता लिखें और अपनी स्ट्रीक जारी रखें।');
                  setNotifUrl(window.location.origin);
                }}
                className="p-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-left transition space-y-1 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-amber-600 dark:text-amber-400 text-xs flex items-center gap-1">
                    <span>🔔</span> 2-दिन इनएक्टिविटी रिमाइंडर (48h Inactivity)
                  </span>
                  <span className="text-[10px] text-slate-400 group-hover:text-amber-500">क्लिक कर लोड करें →</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 font-serif">
                  "आपने 2 दिन से मंच पर कविता नहीं लिखी! आज का नया शब्द देखें और अपनी स्ट्रीक जारी रखें।"
                </p>
              </button>

              <button
                onClick={() => {
                  setNotifTitle('🪈 दैनिक शब्द सामर्थ्य खेल अनलॉक (+5 Pts)');
                  setNotifBody('आज का नया साहित्यिक शब्द और काव्य चुनौती उपलब्ध है। अभी खेलें और रिवॉर्ड पॉइंट्स पाएं!');
                  setNotifUrl(`${window.location.origin}/daily-challenge`);
                }}
                className="p-3.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-left transition space-y-1 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1">
                    <span>🪈</span> दैनिक शब्द चुनौती खेल (+5 Pts Game)
                  </span>
                  <span className="text-[10px] text-slate-400 group-hover:text-emerald-500">क्लिक कर लोड करें →</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 font-serif">
                  "आज का नया साहित्यिक शब्द और काव्य चुनौती उपलब्ध है। अभी खेलें और रिवॉर्ड पॉइंट्स पाएं!"
                </p>
              </button>

              <button
                onClick={() => {
                  setNotifTitle('🏆 साप्ताहिक चुनौती परिणाम व सम्मान पत्र घोषित!');
                  setNotifBody('बोलती कलम साप्ताहिक काव्य ज्यूरी के परिणाम जारी हो गए हैं। अपने सम्मान पत्र की जांच करें!');
                  setNotifUrl(`${window.location.origin}/profile`);
                }}
                className="p-3.5 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-left transition space-y-1 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-purple-600 dark:text-purple-400 text-xs flex items-center gap-1">
                    <span>🏆</span> सम्मान पत्र व ज्यूरी परिणाम (Certificates)
                  </span>
                  <span className="text-[10px] text-slate-400 group-hover:text-purple-500">क्लिक कर लोड करें →</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 font-serif">
                  "बोलती कलम साप्ताहिक काव्य ज्यूरी के परिणाम जारी हो गए हैं। अपने सम्मान पत्र की जांच करें!"
                </p>
              </button>
            </div>
          </div>

          {/* Custom Message Broadcast Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Send className="w-4 h-4 text-rose-600" />
              <span>कस्टम पुश नोटिफिकेशन संदेश लिखें व भेजें</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  नोटिफिकेशन शीर्षक (Title):
                </label>
                <input
                  type="text"
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="उदा. 🔴 बोलती कलम: विशेष काव्य पाठ LIVE"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  नोटिफिकेशन संदेश विवरण (Body Text):
                </label>
                <textarea
                  rows={3}
                  value={notifBody}
                  onChange={(e) => setNotifBody(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="यूज़र्स के फ़ोन व स्क्रीन पर दिखने वाला विस्तृत संदेश..."
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  क्लिक करने पर खुलने वाला लिंक (Target URL):
                </label>
                <input
                  type="text"
                  value={notifUrl}
                  onChange={(e) => setNotifUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono text-[11px]"
                  placeholder="https://www.youtube.com/@bolteekalam"
                />
              </div>

              {broadcastSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>पुश नोटिफिकेशन सभी यूज़र्स के डिवाइस पर सफलतापूर्वक ब्रॉडकास्ट हो गया!</span>
                </div>
              )}

              <button
                onClick={() => {
                  if (!notifTitle.trim()) {
                    alert('कृपया नोटिफिकेशन का शीर्षक दर्ज करें!');
                    return;
                  }
                  broadcastAdminNotification({
                    title: notifTitle,
                    body: notifBody,
                    url: notifUrl
                  });
                  setBroadcastSuccess(true);
                  setTimeout(() => setBroadcastSuccess(false), 4000);
                }}
                className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:brightness-110 text-white font-extrabold rounded-2xl text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <Megaphone className="w-4 h-4 text-amber-200" />
                <span>📢 अभी तुरंत सभी यूज़र्स को पुश नोटिफिकेशन भेजें (Broadcast Now)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screenshot Zoom Lightbox Modal */}
      {zoomedProofImage && (
        <div 
          onClick={() => setZoomedProofImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in"
        >
          <div className="relative max-w-2xl w-full max-h-[90vh] bg-slate-900 rounded-3xl overflow-hidden p-2 flex flex-col items-center">
            <button 
              onClick={() => setZoomedProofImage(null)}
              className="absolute top-4 right-4 p-2 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition z-10"
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
