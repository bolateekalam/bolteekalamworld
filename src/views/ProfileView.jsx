import React, { useState } from 'react';
import { 
  User, ShieldCheck, Flame, BookOpen, Bookmark, Award, Trophy,
  Eye, Heart, Sparkles, MapPin, Calendar, Share2, Copy, Check, 
  Gift, Lock, Package, Edit3, Send, Phone, Mail, UserPlus, UserCheck, Archive
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PostCard from '../components/PostCard';
import PointsExplanationModal from '../components/PointsExplanationModal';
import LiteraryMembershipCardModal from '../components/LiteraryMembershipCardModal';

export const ProfileView = ({ 
  posts = [], 
  userProfile, 
  onOpenCertificate, 
  onOpenEditProfile, 
  onOpenReferEarn,
  onEditPost,
  onDeletePost,
  onToggleArchivePost
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('works');
  const [copiedPortfolio, setCopiedPortfolio] = useState(false);
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
    points: 100,
    followers: 12,
    following: 5,
    streak: 3
  };

  const handleCopyPortfolioLink = () => {
    const link = `https://www.bolateeworld.in/#profile/${profile.username.replace(/^@/, '')}`;
    navigator.clipboard.writeText(link);
    setCopiedPortfolio(true);
    setTimeout(() => setCopiedPortfolio(false), 2000);
  };

  const handleKitSubmit = (e) => {
    e.preventDefault();
    if (!shippingAddress.trim()) return;
    setIsKitRequested(true);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Author Royal Header Banner Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-lg">
        
        {/* Cover Photo */}
        <div className="h-44 sm:h-52 bg-slate-800 relative">
          <img 
            src={profile.cover || 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1200'} 
            alt="Cover" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <button
            onClick={onOpenEditProfile}
            aria-label="प्रोफ़ाइल संपादित करें"
            className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold backdrop-blur-md border border-white/20 flex items-center gap-1.5 transition active:scale-95"
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
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-white dark:border-slate-900 shadow">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            {/* Quick Actions & Share Link */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowMembershipModal(true)}
                aria-label="मेरा 1-वर्षीय साहित्यिक सदस्यता कार्ड देखें व डाउनलोड करें"
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition active:scale-95 border border-amber-400/40"
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>🪪 मेरा 6-माह सदस्यता कार्ड (नि:शुल्क)</span>
              </button>

              <button
                onClick={handleCopyPortfolioLink}
                aria-label="पोर्टफ़ोलियो लिंक कॉपी करें"
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 border border-slate-200 dark:border-slate-700"
              >
                {copiedPortfolio ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copiedPortfolio ? 'लिंक कॉपी हो गया!' : 'प्रोफ़ाइल लिंक शेयर करें'}</span>
              </button>

              <button
                onClick={onOpenReferEarn}
                aria-label="मित्रों को आमंत्रित करें और पॉइंट्स पाएँ"
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow transition active:scale-95"
              >
                <Gift className="w-4 h-4" />
                <span>मित्रों को जोड़ें (+100 Pts)</span>
              </button>
            </div>
          </div>

          {/* Name & Bio Details */}
          <div className="space-y-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-rozha">
                  {profile.name}
                </h2>
                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold border border-rose-500/20">
                  सत्यापित लेखक
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-semibold pt-0.5">
                <span>{(profile.username || 'writer').replace(/^[@#]/, '')}</span>
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
              {profile.bio || 'हिंदी साहित्य एवं काव्य का नया साधक। अभी अपनी पहली कविता पोस्ट करने जा रहा हूँ।'}
            </p>

            {/* Email & Verified Phone Badge */}
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-1">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>फोन: {profile.phone || 'ऑथराइज्ड यूज़र (+91 9812345678)'}</span>
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
            
            {/* Interactive Points Modal Trigger */}
            <div 
              onClick={() => setShowPointsModal(true)}
              className="space-y-0.5 cursor-pointer p-1 rounded-xl hover:bg-amber-500/10 transition group"
            >
              <div className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400 font-bold text-sm sm:text-base group-hover:scale-105 transition">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{profile.points || 0}</span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold underline decoration-dotted">
                अर्जित पॉइंट्स (नियम देखें) ℹ️
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
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-bold px-6">
          <button
            onClick={() => setActiveTab('works')}
            aria-label="प्रकाशित रचनाएँ देखें"
            className={`py-3 border-b-2 transition flex items-center gap-1.5 ${
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
            className={`py-3 border-b-2 transition flex items-center gap-1.5 ${
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
            className={`py-3 border-b-2 transition ${
              activeTab === 'bookmarks' 
                ? 'border-rose-600 text-rose-600 dark:text-rose-400 font-bold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>सहेजी गई सूची ({posts.filter(p => p.isBookmarked).length})</span>
          </button>
        </div>

      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {(() => {
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

      {/* 1-Year Literary Membership Card Modal */}
      <LiteraryMembershipCardModal
        isOpen={showMembershipModal}
        onClose={() => setShowMembershipModal(false)}
        userProfile={profile}
      />

    </div>
  );
};

export default ProfileView;
