import React, { useState } from 'react';
import { 
  User, ShieldCheck, Flame, BookOpen, Bookmark, Award, Trophy,
  Eye, Heart, Sparkles, MapPin, Calendar, Share2, Copy, Check, 
  Gift, Lock, Package, Edit3, Send, Phone, Mail, UserPlus, UserCheck, Archive,
  ArrowUpRight, ArrowDownRight, History, ExternalLink, AlertCircle, ChevronRight, Wallet
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PostCard from '../components/PostCard';
import PointsExplanationModal from '../components/PointsExplanationModal';
import LiteraryMembershipCardModal from '../components/LiteraryMembershipCardModal';
import { initiateRazorpayCheckout } from '../lib/razorpayService';

export const ProfileView = ({ 
  posts = [], 
  userProfile, 
  onOpenCertificate, 
  onOpenEditProfile, 
  onOpenReferEarn,
  onEditPost,
  onDeletePost,
  onToggleArchivePost,
  onLikePost,
  onAddComment,
  onFollowAuthor,
  requireAuth,
  onOpenMembershipCard,
  walletTransactions = [],
  onRechargePoints,
  initialTab = 'works'
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(initialTab); // 'works' | 'archived' | 'bookmarks' | 'wallet'
  const [copiedPortfolio, setCopiedPortfolio] = useState(false);
  const [copiedWalletUrl, setCopiedWalletUrl] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [isKitRequested, setIsKitRequested] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [showMembershipModal, setShowMembershipModal] = useState(false);

  const profile = userProfile || {
    name: 'साहित्य साधक',
    email: 'writer@bolteekalam.com',
    phone: '',
    username: '@writer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    cover: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1200',
    badge: 'verifiedAuthor',
    bio: 'हिंदी साहित्य एवं काव्य का साधक। बोलती कलम मंच पर नियमित रचनाकार।',
    city: 'प्रयागराज',
    joined: 'अगस्त 2026',
    points: 20,
    followers: 12,
    following: 5,
    streak: 3
  };

  const cleanUser = (profile.username || 'writer').replace(/^[@#]/, '');
  const walletShareUrl = `https://www.bolateeworld.in/${cleanUser}/wallet`;

  const handleCopyPortfolioLink = () => {
    const link = `https://www.bolateeworld.in/profile/${cleanUser}`;
    navigator.clipboard.writeText(link);
    setCopiedPortfolio(true);
    setTimeout(() => setCopiedPortfolio(false), 2000);
  };

  const handleCopyWalletLink = () => {
    navigator.clipboard.writeText(walletShareUrl);
    setCopiedWalletUrl(true);
    setTimeout(() => setCopiedWalletUrl(false), 2000);
  };

  const handleOpenFullWalletTab = () => {
    setActiveTab('wallet');
    try {
      window.history.pushState(null, '', `/${cleanUser}/wallet`);
    } catch (e) {}
  };

  // Fallback default ledger entries if no transactions exist yet
  const effectiveTransactions = walletTransactions && walletTransactions.length > 0 ? walletTransactions : [
    { id: 1, type: 'credit', amount: 20, reason: '✍️ नया खाता बनाने पर (Welcome Bonus)', time: 'आरंभ' },
    { id: 2, type: 'credit', amount: 25, reason: '🔴 यूट्यूब चैनल विजिट करने पर', time: 'आरंभ' }
  ];

  const last5Transactions = effectiveTransactions.slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* 1. Author Royal Header Banner Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-lg">
        
        {/* Cover Photo */}
        <div className="h-44 sm:h-52 bg-slate-800 relative">
          <img 
            src={profile.cover || '/profile_cover_banner.png'} 
            alt="Cover" 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <button
            onClick={onOpenEditProfile}
            aria-label="प्रोफ़ाइल संपादित करें"
            className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold backdrop-blur-md border border-white/20 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            <span>प्रोफ़ाइल बदलें</span>
          </button>
        </div>

        {/* Profile Details Container */}
        <div className="px-6 pb-6 pt-0 relative">
          
          {/* Avatar & Badges */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
            <div className="relative">
              <img 
                src={profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'} 
                alt={profile.name} 
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-white dark:ring-slate-900 shadow-2xl bg-white"
              />
              <div className="absolute -bottom-2 -right-2 p-1.5 bg-rose-600 text-white rounded-xl shadow-lg ring-2 ring-white dark:ring-slate-900">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={onOpenMembershipCard}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-600 text-white rounded-2xl text-xs font-extrabold shadow-md hover:brightness-105 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-white" />
                <span>6-माह डिजिटल सदस्यता कार्ड</span>
              </button>

              <button
                onClick={handleCopyPortfolioLink}
                className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                {copiedPortfolio ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copiedPortfolio ? 'कॉपी हुआ!' : 'लिंक कॉपी'}</span>
              </button>
            </div>
          </div>

          {/* Name & Bio */}
          <div className="space-y-2">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black font-rozha text-slate-900 dark:text-slate-100">
                  {profile.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-[10px] font-extrabold">
                  ✓ सत्यापित लेखक
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-semibold pt-0.5">
                <span>@{cleanUser}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  {profile.city || 'प्रयागराज'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  सदस्य: {profile.joined || 'अगस्त 2026'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-tiro max-w-2xl">
              {profile.bio || 'हिंदी साहित्य एवं काव्य का नया साधक। बोलती कलम मंच पर नियमित रचनाकार।'}
            </p>

            {/* Email & Phone */}
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-1 flex-wrap">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>फोन: {profile.phone ? profile.phone : '+91 XXXXX XXXXX (ऐच्छिक)'}</span>
              </span>
              {profile.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{profile.email}</span>
                </span>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center">
            
            <div 
              onClick={handleOpenFullWalletTab}
              className="space-y-0.5 cursor-pointer p-1 rounded-xl hover:bg-amber-500/10 transition group"
            >
              <div className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400 font-bold text-sm sm:text-base group-hover:scale-105 transition">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{profile.points || 0}</span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold underline decoration-dotted">
                रिवॉर्ड पॉइंट्स पासबुक ℹ️
              </p>
            </div>

            <div className="space-y-0.5">
              <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                {posts.filter(p => !p.isArchived).length}
              </div>
              <p className="text-[10px] text-slate-500 font-semibold">रचनाएँ</p>
            </div>

            <div className="space-y-0.5">
              <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                {profile.followers || 0}
              </div>
              <p className="text-[10px] text-slate-500 font-semibold">फ़ॉलोअर्स</p>
            </div>

            <div className="space-y-0.5">
              <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                {profile.streak || 1} दिन
              </div>
              <p className="text-[10px] text-slate-500 font-semibold">लगातार सक्रिय</p>
            </div>
          </div>

        </div>

        {/* Profile Tabs Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-bold px-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('works')}
            aria-label="प्रकाशित रचनाएँ देखें"
            className={`py-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'works' 
                ? 'border-rose-600 text-rose-600 dark:text-rose-400 font-bold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>प्रकाशित रचनाएँ ({posts.filter(p => !p.isArchived).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('archived')}
            aria-label="आर्काइव की गई रचनाएँ देखें"
            className={`py-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'archived' 
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-bold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>📦 आर्काइव सूची ({posts.filter(p => p.isArchived).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bookmarks')}
            aria-label="सहेजी गई रचनाएँ देखें"
            className={`py-3 border-b-2 transition whitespace-nowrap ${
              activeTab === 'bookmarks' 
                ? 'border-rose-600 text-rose-600 dark:text-rose-400 font-bold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>सहेजी गई सूची ({posts.filter(p => p.isBookmarked).length})</span>
          </button>

          <button
            onClick={handleOpenFullWalletTab}
            aria-label="साहित्य वॉलेट देखें"
            className={`py-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'wallet' 
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-bold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-amber-500" />
            <span>🪙 पॉइंट्स पासबुक व वॉलेट ({profile.points || 0} Pts)</span>
          </button>
        </div>

      </div>

      {/* 2. Last 5 Points Summary Widget (Displayed on works tab for instant visibility) */}
      {activeTab === 'works' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                रिवॉर्ड पॉइंट्स पासबुक (अंतिम 5 लेन-देन)
              </h3>
            </div>
            <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-300 dark:border-amber-700">
              कुल बैलेंस: {profile.points || 0} Pts
            </span>
          </div>

          <div className="space-y-2">
            {last5Transactions.map((tx, idx) => (
              <div 
                key={tx.id || idx} 
                className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {tx.type === 'credit' ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
                      <ArrowDownRight className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-600 flex items-center justify-center shrink-0">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="font-semibold block truncate text-slate-800 dark:text-slate-200">
                      {tx.reason}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {tx.time}
                    </span>
                  </div>
                </div>

                <span className={`font-extrabold shrink-0 ${tx.type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {tx.type === 'credit' ? `+${tx.amount}` : `-${tx.amount}`} Pts
                </span>
              </div>
            ))}
          </div>

          <div className="pt-1 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500">
              यूआरएल: <strong>bolateeworld.in/{cleanUser}/wallet</strong>
            </span>
            <button
              onClick={handleOpenFullWalletTab}
              className="text-rose-600 hover:text-rose-700 dark:text-rose-400 font-bold flex items-center gap-1 transition cursor-pointer"
            >
              <span>सी मोर (See More) →</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="space-y-4">
        {(() => {
          if (activeTab === 'wallet') {
            return (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Full Passbook Statement View */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-lg">
                  
                  {/* Wallet Header & Share Link Box */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-amber-500" />
                        <h2 className="text-base sm:text-lg font-bold font-rozha text-slate-900 dark:text-slate-100">
                          साहित्य रिवॉर्ड पॉइंट्स पासबुक (Passbook Statement)
                        </h2>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        लेखक: <strong>{profile.name}</strong> (@{cleanUser})
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-amber-500 to-rose-600 text-white px-4 py-2.5 rounded-2xl text-center shadow">
                      <span className="text-[10px] uppercase font-bold block opacity-90">कुल उपलब्ध बैलेंस</span>
                      <span className="text-xl font-black">{profile.points || 0} Points</span>
                    </div>
                  </div>

                  {/* Shareable Wallet URL Box */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-mono text-slate-600 dark:text-slate-300 truncate">
                        {walletShareUrl}
                      </span>
                    </div>
                    <button
                      onClick={handleCopyWalletLink}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shrink-0 transition active:scale-95 cursor-pointer"
                    >
                      {copiedWalletUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedWalletUrl ? 'कॉपी हुआ!' : 'लिंक कॉपी'}</span>
                    </button>
                  </div>

                  {/* Points Earning & Deduction Transparency Info */}
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800 rounded-2xl text-xs text-amber-900 dark:text-amber-200 space-y-1">
                    <p className="font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>पॉइंट्स नियम एवं पारदर्शिता:</span>
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] list-disc list-inside text-amber-800 dark:text-amber-300">
                      <li>नया खाता बनाने पर: <strong>+20 Pts</strong></li>
                      <li>यूट्यूब चैनल विजिट करने पर: <strong>+25 Pts</strong></li>
                      <li>यूट्यूब टास्क स्क्रीनशॉट पर: <strong>+10 Pts</strong></li>
                      <li>रचना लाइक / कमेंट पर: <strong>+1 Pt</strong></li>
                      <li>डुप्लीकेट/फेक स्क्रीनशॉट पेनल्टी: <strong>-50 Pts / -100 Pts</strong></li>
                    </ul>
                  </div>

                  {/* Full Ledger Transactions List */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <History className="w-4 h-4 text-rose-500" />
                      <span>सम्पूर्ण ट्रांजेक्शन इतिहास ({effectiveTransactions.length}):</span>
                    </h4>

                    <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                      {effectiveTransactions.map((tx, idx) => (
                        <div 
                          key={tx.id || idx}
                          className="p-3.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {tx.type === 'credit' ? (
                              <div className="w-8 h-8 rounded-2xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
                                <ArrowDownRight className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-2xl bg-red-500/20 text-red-600 flex items-center justify-center shrink-0">
                                <ArrowUpRight className="w-4 h-4" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <h5 className="font-bold text-slate-900 dark:text-slate-100 truncate">
                                {tx.reason}
                              </h5>
                              <p className="text-[10px] text-slate-400">
                                🕒 {tx.time}
                              </p>
                            </div>
                          </div>

                          <span className={`text-sm font-black shrink-0 ${tx.type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                            {tx.type === 'credit' ? `+${tx.amount}` : `-${tx.amount}`} Pts
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            );
          }

          const displayPosts = activeTab === 'works'
            ? posts.filter(p => !p.isArchived)
            : activeTab === 'archived'
            ? posts.filter(p => p.isArchived)
            : posts.filter(p => p.isBookmarked);

          if (displayPosts.length === 0) {
            return (
              <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2">
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                  {activeTab === 'archived' ? 'कोई आर्काइव की गई रचना नहीं है।' : activeTab === 'bookmarks' ? 'कोई सहेजी गई रचना नहीं है।' : 'अभी तक कोई रचना प्रकाशित नहीं की गई है।'}
                </p>
              </div>
            );
          }

          return displayPosts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              onOpenCertificate={onOpenCertificate} 
              onEditPost={onEditPost}
              onDeletePost={onDeletePost}
              onToggleArchivePost={onToggleArchivePost}
              onLikePost={onLikePost}
              onAddComment={onAddComment}
              onFollowAuthor={onFollowAuthor}
              userProfile={userProfile}
              requireAuth={requireAuth}
              isAuthorView={true}
            />
          ));
        })()}
      </div>

      {/* Points Explanation Modal */}
      <PointsExplanationModal
        isOpen={showPointsModal}
        onClose={() => setShowPointsModal(false)}
        points={profile.points || 0}
      />

      {/* 6-Month Literary Membership Card Modal */}
      <LiteraryMembershipCardModal
        isOpen={showMembershipModal}
        onClose={() => setShowMembershipModal(false)}
        userProfile={profile}
      />

    </div>
  );
};

export default ProfileView;
