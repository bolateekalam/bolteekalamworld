import React, { useState } from 'react';
import { 
  User, ShieldCheck, Flame, BookOpen, Bookmark, Award, Trophy,
  Eye, Heart, Sparkles, MapPin, Calendar, Share2, Copy, Check, 
  Gift, Lock, Package, Edit3, Send, Phone, Mail, UserPlus, UserCheck 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PostCard from '../components/PostCard';
import PointsExplanationModal from '../components/PointsExplanationModal';

export const ProfileView = ({ 
  posts = [], 
  userProfile, 
  onOpenCertificate, 
  onOpenEditProfile, 
  onOpenReferEarn,
  onEditPost,
  onDeletePost
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('works');
  const [copiedPortfolio, setCopiedPortfolio] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [isKitRequested, setIsKitRequested] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [isFollowingProfile, setIsFollowingProfile] = useState(false);
  const [followerCount, setFollowerCount] = useState(userProfile?.followers || 0);

  const profile = userProfile || {
    name: 'साहित्य साधक',
    email: 'user@bolteekalam.com',
    phone: '+91 9876543210',
    username: '@writer_user',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    cover: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1200',
    badge: 'verifiedAuthor',
    bio: 'काव्य-रसिक, लेखक एवं हिंदी साहित्य प्रेमी। शब्दों के माध्यम से अंतर्मन की वेदना और समाज की चेतना को उजागर करने का विनम्र प्रयास।',
    city: 'प्रयागराज',
    joined: 'जनवरी 2026',
    birthday: '03 अगस्त 2026',
    followers: 0,
    following: 0,
    streak: 0,
    points: 0,
    badges: ['Verified Author', 'साहित्य साधक']
  };

  const handleToggleFollow = () => {
    if (isFollowingProfile) {
      setIsFollowingProfile(false);
      setFollowerCount(prev => Math.max(0, prev - 1));
    } else {
      setIsFollowingProfile(true);
      setFollowerCount(prev => prev + 1);
    }
  };

  const handleSharePortfolio = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedPortfolio(true);
    setTimeout(() => setCopiedPortfolio(false), 2000);
  };

  const handleRequestKit = (e) => {
    e.preventDefault();
    if (!shippingAddress.trim()) return;
    setIsKitRequested(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Profile Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        
        {/* Cover Photo */}
        <div className="h-44 w-full bg-rose-900 relative">
          <img src={profile.cover} alt="Cover" className="w-full h-full object-cover opacity-70" />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={onOpenEditProfile}
              aria-label="प्रोफ़ाइल संपादित करें"
              className="px-3.5 py-1.5 rounded-full bg-slate-950/80 text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 hover:bg-slate-950"
            >
              <Edit3 className="w-3.5 h-3.5 text-rose-400" />
              <span>{t('profile.editProfile')}</span>
            </button>

            <button
              onClick={handleSharePortfolio}
              aria-label="प्रोफ़ाइल लिंक शेयर करें"
              className="px-3.5 py-1.5 rounded-full bg-slate-950/80 text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 hover:bg-slate-950"
            >
              {copiedPortfolio ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-amber-400" />}
              <span>{copiedPortfolio ? 'कॉपी हुआ!' : 'शेयर'}</span>
            </button>
          </div>
        </div>

        {/* Profile Details Bar */}
        <div className="p-6 relative pt-0">
          <div className="flex items-end justify-between -mt-14 mb-4 flex-wrap gap-3">
            
            <div className="relative">
              <img 
                src={profile.avatar} 
                alt={profile.name} 
                className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 object-cover shadow-xl"
              />
              <span className="absolute bottom-1 right-1 p-1 bg-amber-500 text-slate-950 rounded-full" title={profile.badge}>
                <ShieldCheck className="w-4 h-4 fill-amber-400" />
              </span>
            </div>

            {/* Stats & Action Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              
              {/* Follow Button */}
              <button
                onClick={handleToggleFollow}
                aria-label={isFollowingProfile ? "अनफ़ॉलो करें" : "फ़ॉलो करें"}
                className={`px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow transition active:scale-95 ${
                  isFollowingProfile
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                }`}
              >
                {isFollowingProfile ? (
                  <>
                    <UserCheck className="w-4 h-4 text-emerald-500" />
                    <span>फ़ॉलो कर रहे हैं</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>+ फॉलो (Follow)</span>
                  </>
                )}
              </button>

              <button
                onClick={onOpenReferEarn}
                aria-label="मित्र को आमंत्रित करें"
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition"
              >
                <Gift className="w-4 h-4 text-slate-950 animate-bounce" />
                <span>{t('nav.referEarn')} (+100 Pts)</span>
              </button>

              <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold text-xs flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{profile.streak || 0} दिन Streak</span>
              </div>

              {/* Clickable Points Badge Opening PointsExplanationModal */}
              <button
                onClick={() => setShowPointsModal(true)}
                aria-label="पॉइंट्स नियम व विवरण देखें"
                className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold text-xs flex items-center gap-1.5 font-outfit border border-rose-500/30 transition active:scale-95 cursor-pointer"
                title="पॉइंट्स नियम व विवरण देखने हेतु क्लिक करें"
              >
                <Award className="w-4 h-4 text-rose-500" />
                <span>{(profile.points || 0).toLocaleString()} पॉइंट्स ℹ️</span>
              </button>
            </div>

          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-rozha text-slate-900 dark:text-slate-100">
                {profile.name}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 text-[10px] font-bold">
                {t('badges.verifiedAuthor')}
              </span>
              <span className="text-xs text-slate-400">({profile.email})</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 font-tiro max-w-2xl leading-relaxed">
              {profile.bio}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
              {profile.phone && (
                <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{profile.phone}</span>
                </span>
              )}
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>{profile.city}</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>जन्मदिन: {profile.birthday || '03 अगस्त 2026'}</span>
              </span>
              <span><strong>{followerCount.toLocaleString()}</strong> फ़ॉलोअर्स</span>
              <span><strong>{profile.following || 0}</strong> फ़ॉलोइंग</span>
            </div>

            {/* Achievement Badges Showcase */}
            <div className="flex flex-wrap gap-1.5 pt-3">
              {profile.badges.map((b, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>{b}</span>
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Milestone Unlocks & Bolti Kalam Kit System */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 space-y-4 bg-slate-50/50 dark:bg-slate-800/20">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>{t('profile.milestoneTitle')}</span>
            </h3>
            <button 
              onClick={() => setShowPointsModal(true)}
              className="text-xs font-mono font-bold text-amber-500 underline"
            >
              वर्तमान पॉइंट्स: {profile.points || 0} pts (नियम देखें)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            
            {/* Milestone 1: 1,000 Pts */}
            <div 
              onClick={() => onOpenCertificate({
                recipientName: profile.name,
                title: 'साहित्य साधक सम्मान',
                category: '1,000 Points Milestone Award',
                type: 'Milestone Cert Level 1',
                date: new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
                certificateId: 'BK-MS-1000',
                requiredPoints: 1000
              })}
              className={`p-4 rounded-2xl border cursor-pointer transition ${
                profile.points >= 1000
                  ? 'bg-white dark:bg-slate-900 border-amber-500/50 shadow-sm hover:border-amber-500'
                  : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-rose-600">1,000 Points</span>
                {profile.points >= 1000 ? <Check className="w-4 h-4 text-emerald-500" /> : <Lock className="w-4 h-4 text-slate-400" />}
              </div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100">साहित्य साधक प्रमाण-पत्र</h4>
              <p className="text-[11px] text-slate-500 mt-1">अनलॉक: डिजिटल सर्टिफिकेट 🎓</p>
            </div>

            {/* Milestone 2: 2,500 Pts */}
            <div 
              onClick={() => onOpenCertificate({
                recipientName: profile.name,
                title: 'वरिष्ठ रचनाकार सम्मान',
                category: '2,500 Points Senior Milestone',
                type: 'Milestone Cert Level 2',
                date: new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
                certificateId: 'BK-MS-2500',
                requiredPoints: 2500
              })}
              className={`p-4 rounded-2xl border cursor-pointer transition ${
                profile.points >= 2500
                  ? 'bg-white dark:bg-slate-900 border-amber-500/50 shadow-sm hover:border-amber-500'
                  : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-rose-600">2,500 Points</span>
                {profile.points >= 2500 ? <Check className="w-4 h-4 text-emerald-500" /> : <Lock className="w-4 h-4 text-slate-400" />}
              </div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100">वरिष्ठ रचनाकार प्रमाण-पत्र</h4>
              <p className="text-[11px] text-slate-500 mt-1">अनलॉक: मास्टर सर्टिफिकेट 📜</p>
            </div>

            {/* Milestone 3: 5,000 Pts Bolti Kalam Kit */}
            <div 
              onClick={() => onOpenCertificate({
                recipientName: profile.name,
                title: 'महाकवि सम्मान & बोलती कलम किट',
                category: '5,000 Points Grand Master Milestone',
                type: 'Bolti Kalam Kit Award',
                date: new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
                certificateId: 'BK-MS-5000',
                requiredPoints: 5000
              })}
              className={`p-4 rounded-2xl border cursor-pointer transition ${
                profile.points >= 5000
                  ? 'bg-amber-500/10 border-amber-500 shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-amber-500 flex items-center gap-1">
                  <Package className="w-3.5 h-3.5" />
                  <span>5,000 Points</span>
                </span>
                {profile.points >= 5000 ? <Check className="w-4 h-4 text-emerald-500" /> : <Lock className="w-4 h-4 text-slate-400" />}
              </div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100">बोलती कलम किट + मेडल</h4>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-semibold">अनलॉक: बुक + किट होम डिलीवरी 📦</p>
            </div>

          </div>

          {/* Bolti Kalam Kit Shipment Claim Form */}
          {profile.points >= 4000 && (
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-500/40 space-y-2">
              <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Package className="w-4 h-4" />
                <span>बोलती कलम किट (Bolti Kalam Kit) होम डिलीवरी मँगवाएँ</span>
              </h4>
              {isKitRequested ? (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>किट डिलीवरी की रिक्वेस्ट दर्ज हो गई है! एडमिन जल्द डिस्पैच करेगा।</span>
                </div>
              ) : (
                <form onSubmit={handleRequestKit} className="flex gap-2">
                  <input
                    type="text"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder={t('profile.kitAddressPlaceholder')}
                    className="flex-1 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs focus:outline-none focus:border-amber-500"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>किट भेजें</span>
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Portfolio View Tabs */}
        <div className="flex border-t border-slate-200 dark:border-slate-800 px-6 gap-6 bg-slate-50/50 dark:bg-slate-800/40 text-xs font-bold">
          <button
            onClick={() => setActiveTab('works')}
            aria-label="प्रकाशित रचनाएँ देखें"
            className={`py-3 border-b-2 transition ${
              activeTab === 'works' 
                ? 'border-rose-600 text-rose-600 dark:text-rose-400 font-bold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            प्रकाशित रचनाएँ ({posts.length})
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
            सहेजी गई सूची (Reading List)
          </button>
        </div>

      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            onOpenCertificate={onOpenCertificate} 
            onEditPost={onEditPost}
            onDeletePost={onDeletePost}
          />
        ))}
      </div>

      {/* Points Explanation Modal */}
      <PointsExplanationModal
        isOpen={showPointsModal}
        onClose={() => setShowPointsModal(false)}
        points={profile.points || 0}
      />

    </div>
  );
};

export default ProfileView;
