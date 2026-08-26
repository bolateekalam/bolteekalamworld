import React, { useState, useEffect } from 'react';
import { 
  User, ShieldCheck, Flame, BookOpen, Bookmark, Award, Trophy,
  Eye, Heart, Sparkles, MapPin, Calendar, Share2, Copy, Check, 
  Gift, Lock, Package, Edit3, Send, Phone, Mail, UserPlus, UserCheck, Archive,
  ArrowUpRight, ArrowDownRight, History, ExternalLink, AlertCircle, ChevronRight, Wallet, Download, Clock, CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PostCard from '../components/PostCard';
import PointsExplanationModal from '../components/PointsExplanationModal';
import LiteraryMembershipCardModal from '../components/LiteraryMembershipCardModal';
import CertificateGenerator from '../components/CertificateGenerator';
import { getUserStreakData, logActiveTime, getNextMilestone } from '../lib/streakService';
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
  const [activeTab, setActiveTab] = useState(initialTab); // 'works' | 'certificates' | 'wallet' | 'archived' | 'bookmarks'
  const [copiedPortfolio, setCopiedPortfolio] = useState(false);
  const [copiedWalletUrl, setCopiedWalletUrl] = useState(false);
  const [copiedCertUrl, setCopiedCertUrl] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [selectedCertToView, setSelectedCertToView] = useState(null);

  // Sync active tab when navigated from outside (e.g. Certificates sidebar/widget)
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const profile = userProfile || {
    name: 'साहित्य साधक',
    email: 'writer@bolteekalam.com',
    phone: '',
    username: '@writer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    cover: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1200',
    badge: 'verifiedAuthor',
    bio: 'हिंदी साहित्य एवं काव्य का साधक। बोलती वर्ल्ड मंच पर नियमित रचनाकार।',
    city: 'प्रयागराज',
    joined: 'अगस्त 2026',
    points: 30,
    followers: 12,
    following: 5,
    streak: 3
  };

  const userEmail = profile.email || 'user';
  const cleanUser = (profile.username || 'writer').replace(/^[@#]/, '');
  const displayPoints = (typeof profile.points === 'number' && profile.points <= 250 && profile.points >= 0) ? profile.points : 50;
  const walletShareUrl = `https://www.bolateeworld.in/${cleanUser}/wallet`;
  const certificateShareUrl = `https://www.bolateeworld.in/${cleanUser}/certificate`;

  const [streakData, setStreakData] = useState(() => getUserStreakData(userEmail));

  // 15-second active engagement session heartbeat
  useEffect(() => {
    const timer = setInterval(() => {
      const updated = logActiveTime(userEmail, 15);
      setStreakData(updated);
    }, 15000);

    return () => clearInterval(timer);
  }, [userEmail]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const myPostsCount = posts.filter(p => !p.isArchived).length;
  const currentStreak = streakData?.streak || profile.streak || 1;
  const activeSeconds = streakData?.todayActiveSeconds || 60;
  const is5MinReached = activeSeconds >= 300;

  // Complete Continuous Streak Milestones & Creation Certificates
  const milestoneCertificates = [
    {
      id: 'cert-welcome',
      title: 'प्रथम साहित्यिक पदार्पण सम्मान पत्र',
      type: 'प्रथम साहित्यिक पदार्पण सम्मान पत्र',
      description: 'बोलती वर्ल्ड में नया खाता बनने पर आपकी साहित्यिक यात्रा के शुभारंभ हेतु मानद स्वागत सम्मान।',
      category: 'साहित्यिक पदार्पण (Day 0)',
      requiredStreak: 0,
      requiredPosts: 0,
      requiredPoints: 0,
      isUnlocked: true,
      badgeText: '✓ खाता बनने पर प्राप्त (UNLOCKED)',
      certificateId: `BW-JOIN-${cleanUser.toUpperCase()}-01`
    },
    {
      id: 'cert-streak-30',
      title: 'मासिक काव्य साधना सम्मान पत्र (30 Days Active Streak)',
      type: 'मासिक काव्य साधना सम्मान पत्र',
      description: 'लगातार 30 दिन तक रोज़ाना 5 मिनट बोलती वर्ल्ड मंच पर अखंड उपस्थिति व काव्य साधना पूर्ण करने पर।',
      category: '30 दिन निरंतर सक्रियता',
      requiredStreak: 30,
      requiredPosts: 0,
      requiredPoints: 0,
      isUnlocked: currentStreak >= 30,
      badgeText: currentStreak >= 30 ? '✓ अनलॉक हो चुका है!' : `🔒 प्रगति: ${currentStreak}/30 दिन स्ट्रीक`,
      certificateId: `BW-STREAK-30D-${cleanUser.toUpperCase()}`
    },
    {
      id: 'cert-streak-60',
      title: 'द्वि-मासिक साहित्य अनुरागी सम्मान पत्र (60 Days Active Streak)',
      type: 'द्वि-मासिक साहित्य अनुरागी सम्मान पत्र',
      description: 'लगातार 60 दिन तक बोलती वर्ल्ड मंच पर साहित्य सृजन व सक्रिय सहभागिता निभाने के उपलक्ष्य में।',
      category: '60 दिन निरंतर सक्रियता',
      requiredStreak: 60,
      requiredPosts: 0,
      requiredPoints: 0,
      isUnlocked: currentStreak >= 60,
      badgeText: currentStreak >= 60 ? '✓ अनलॉक हो चुका है!' : `🔒 प्रगति: ${currentStreak}/60 दिन स्ट्रीक`,
      certificateId: `BW-STREAK-60D-${cleanUser.toUpperCase()}`
    },
    {
      id: 'cert-streak-90',
      title: 'त्रैमासिक काव्य गौरव सम्मान पत्र (90 Days Active Streak)',
      type: 'त्रैमासिक काव्य गौरव सम्मान पत्र',
      description: '3 माह (90 दिन) तक अनवरत साहित्यिक साधना एवं सृजनात्मक योगदान हेतु राष्ट्रीय सम्मान पत्र।',
      category: '90 दिन निरंतर सक्रियता',
      requiredStreak: 90,
      requiredPosts: 0,
      requiredPoints: 0,
      isUnlocked: currentStreak >= 90,
      badgeText: currentStreak >= 90 ? '✓ अनलॉक हो चुका है!' : `🔒 प्रगति: ${currentStreak}/90 दिन स्ट्रीक`,
      certificateId: `BW-STREAK-90D-${cleanUser.toUpperCase()}`
    },
    {
      id: 'cert-streak-120',
      title: 'चतुर्मासिक साहित्य रत्न सम्मान पत्र (120 Days Active Streak)',
      type: 'चतुर्मासिक साहित्य रत्न सम्मान पत्र',
      description: '120 दिनों की निरंतर निष्ठा और उत्कृष्ट काव्य सक्रियता हेतु विशिष्ट मानद प्रशस्ति पत्र।',
      category: '120 दिन निरंतर सक्रियता',
      requiredStreak: 120,
      requiredPosts: 0,
      requiredPoints: 0,
      isUnlocked: currentStreak >= 120,
      badgeText: currentStreak >= 120 ? '✓ अनलॉक हो चुका है!' : `🔒 प्रगति: ${currentStreak}/120 दिन स्ट्रीक`,
      certificateId: `BW-STREAK-120D-${cleanUser.toUpperCase()}`
    },
    {
      id: 'cert-streak-150',
      title: 'पंच-मासिक काव्य विभूति सम्मान पत्र (150 Days Active Streak)',
      type: 'पंच-मासिक काव्य विभूति सम्मान पत्र',
      description: '150 दिन निरंतर मंच पर उपस्थिति दर्ज कराकर साहित्य संवर्धन में अनुपम योगदान देने पर।',
      category: '150 दिन निरंतर सक्रियता',
      requiredStreak: 150,
      requiredPosts: 0,
      requiredPoints: 0,
      isUnlocked: currentStreak >= 150,
      badgeText: currentStreak >= 150 ? '✓ अनलॉक हो चुका है!' : `🔒 प्रगति: ${currentStreak}/150 दिन स्ट्रीक`,
      certificateId: `BW-STREAK-150D-${cleanUser.toUpperCase()}`
    },
    {
      id: 'cert-streak-180',
      title: 'अर्ध-वार्षिक साहित्य शिरोमणि सम्मान पत्र (180 Days Active Streak)',
      type: 'अर्ध-वार्षिक साहित्य शिरोमणि सम्मान पत्र',
      description: '6 माह (180 दिन) की अटूट साहित्यिक तपस्या और अखंड उपस्थिति हेतु सर्वोच्च अर्ध-वार्षिक सम्मान।',
      category: '180 दिन (6 माह) सक्रियता',
      requiredStreak: 180,
      requiredPosts: 0,
      requiredPoints: 0,
      isUnlocked: currentStreak >= 180,
      badgeText: currentStreak >= 180 ? '✓ अनलॉक हो चुका है!' : `🔒 प्रगति: ${currentStreak}/180 दिन स्ट्रीक`,
      certificateId: `BW-STREAK-180D-${cleanUser.toUpperCase()}`
    },
    {
      id: 'cert-streak-210',
      title: 'सप्त-मासिक काव्य भास्कर सम्मान पत्र (210 Days Active Streak)',
      type: 'सप्त-मासिक काव्य भास्कर सम्मान पत्र',
      description: '210 दिनों की लगातार सृजनात्मक निष्ठा और शब्दों की निरंतर सेवा हेतु।',
      category: '210 दिन निरंतर सक्रियता',
      requiredStreak: 210,
      requiredPosts: 0,
      requiredPoints: 0,
      isUnlocked: currentStreak >= 210,
      badgeText: currentStreak >= 210 ? '✓ अनलॉक हो चुका है!' : `🔒 प्रगति: ${currentStreak}/210 दिन स्ट्रीक`,
      certificateId: `BW-STREAK-210D-${cleanUser.toUpperCase()}`
    },
    {
      id: 'cert-streak-240',
      title: 'अष्ट-मासिक साहित्य मार्तंड सम्मान पत्र (240 Days Active Streak)',
      type: 'अष्ट-मासिक साहित्य मार्तंड सम्मान पत्र',
      description: '8 माह (240 दिन) की अखण्ड साहित्य साधना व काव्य संवर्धन हेतु विशेष सम्मान पत्र।',
      category: '240 दिन निरंतर सक्रियता',
      requiredStreak: 240,
      requiredPosts: 0,
      requiredPoints: 0,
      isUnlocked: currentStreak >= 240,
      badgeText: currentStreak >= 240 ? '✓ अनलॉक हो चुका है!' : `🔒 प्रगति: ${currentStreak}/240 दिन स्ट्रीक`,
      certificateId: `BW-STREAK-240D-${cleanUser.toUpperCase()}`
    },
    {
      id: 'cert-streak-270',
      title: 'नव-मासिक काव्य महर्षि सम्मान पत्र (270 Days Active Streak)',
      type: 'नव-मासिक काव्य महर्षि सम्मान पत्र',
      description: '270 दिनों तक निरंतर मंच पर अपनी साहित्यिक उपस्थिति दर्ज कराकर गौरव बढ़ाने पर।',
      category: '270 दिन निरंतर सक्रियता',
      requiredStreak: 270,
      requiredPosts: 0,
      requiredPoints: 0,
      isUnlocked: currentStreak >= 270,
      badgeText: currentStreak >= 270 ? '✓ अनलॉक हो चुका है!' : `🔒 प्रगति: ${currentStreak}/270 दिन स्ट्रीक`,
      certificateId: `BW-STREAK-270D-${cleanUser.toUpperCase()}`
    },
    {
      id: 'cert-streak-300',
      title: 'दश-मासिक साहित्य सरस्वती सम्मान पत्र (300 Days Active Streak)',
      type: 'दश-मासिक साहित्य सरस्वती सम्मान पत्र',
      description: '300 दिनों की अखंड साधना से मां सरस्वती की काव्य सेवा करने पर सादर समर्पित सम्मान पत्र।',
      category: '300 दिन निरंतर सक्रियता',
      requiredStreak: 300,
      requiredPosts: 0,
      requiredPoints: 0,
      isUnlocked: currentStreak >= 300,
      badgeText: currentStreak >= 300 ? '✓ अनलॉक हो चुका है!' : `🔒 प्रगति: ${currentStreak}/300 दिन स्ट्रीक`,
      certificateId: `BW-STREAK-300D-${cleanUser.toUpperCase()}`
    },
    {
      id: 'cert-streak-330',
      title: 'एकादश-मासिक काव्य शिखर सम्मान पत्र (330 Days Active Streak)',
      type: 'एकादश-मासिक काव्य शिखर सम्मान पत्र',
      description: '11 माह (330 दिन) तक अविराम साहित्यिक रचनाशीलता एवं सक्रियता हेतु शिखर सम्मान।',
      category: '330 दिन निरंतर सक्रियता',
      requiredStreak: 330,
      requiredPosts: 0,
      requiredPoints: 0,
      isUnlocked: currentStreak >= 330,
      badgeText: currentStreak >= 330 ? '✓ अनलॉक हो चुका है!' : `🔒 प्रगति: ${currentStreak}/330 दिन स्ट्रीक`,
      certificateId: `BW-STREAK-330D-${cleanUser.toUpperCase()}`
    },
    {
      id: 'cert-streak-360',
      title: 'राष्ट्रीय वार्षिक साहित्य मनीषी एवं तपस्वी महा-सम्मान पत्र (360 Days / 1 Year Streak)',
      type: 'राष्ट्रीय वार्षिक साहित्य मनीषी महा-सम्मान पत्र',
      description: 'संपूर्ण 1 वर्ष (360 दिन) तक निरंतर दैनिक 5-मिनट सक्रियता व अखंड साधना पूर्ण करने पर बोलती वर्ल्ड का सर्वोच्च सम्मान।',
      category: '1 वर्ष पूर्ण अखंड साधना',
      requiredStreak: 360,
      requiredPosts: 0,
      requiredPoints: 0,
      isUnlocked: currentStreak >= 360,
      badgeText: currentStreak >= 360 ? '✓ अनलॉक हो चुका है!' : `🔒 प्रगति: ${currentStreak}/360 दिन स्ट्रीक`,
      certificateId: `BW-STREAK-360D-${cleanUser.toUpperCase()}`
    },
    {
      id: 'cert-50-posts',
      title: 'अर्ध-शतक काव्य श्री सम्मान पत्र (50 Posts Milestone)',
      type: 'अर्ध-शतक काव्य श्री सम्मान पत्र',
      description: 'बोलती वर्ल्ड मंच पर 50 उत्कृष्ट काव्य रचनाएँ पूर्ण करने पर विशिष्ट राष्ट्रीय सम्मान।',
      category: '50 काव्य रचनाएँ',
      requiredStreak: 0,
      requiredPosts: 50,
      requiredPoints: 0,
      isUnlocked: myPostsCount >= 50,
      badgeText: myPostsCount >= 50 ? '✓ अनलॉक हो चुका है!' : `🔒 प्रगति: ${myPostsCount}/50 कविताएं`,
      certificateId: `BW-50POSTS-${cleanUser.toUpperCase()}`
    }
  ];

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

  const handleCopyCertLink = () => {
    navigator.clipboard.writeText(certificateShareUrl);
    setCopiedCertUrl(true);
    setTimeout(() => setCopiedCertUrl(false), 2000);
  };

  const handleOpenCertificatesTab = () => {
    setActiveTab('certificates');
    try {
      window.history.pushState(null, '', '/certificates');
    } catch (e) {}
  };

  const handleOpenFullWalletTab = () => {
    setActiveTab('wallet');
    try {
      window.history.pushState(null, '', `/${cleanUser}/wallet`);
    } catch (e) {}
  };

  // Fallback default ledger entries
  const effectiveTransactions = walletTransactions && walletTransactions.length > 0 ? walletTransactions : [
    { id: 1, type: 'credit', amount: 30, reason: '✍️ नया खाता बनाने पर (Welcome Bonus)', time: 'आरंभ' },
    { id: 2, type: 'credit', amount: 25, reason: '🔴 यूट्यूब चैनल विजिट करने पर', time: 'आरंभ' }
  ];

  const last5Transactions = effectiveTransactions.slice(0, 5);

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      
      {/* 1. Author Royal Header Banner Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-lg w-full">
        
        {/* Cover Photo */}
        <div className="h-36 sm:h-52 bg-slate-800 relative w-full">
          <img 
            src={profile.cover || '/profile_cover_banner.png'} 
            alt="Cover" 
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <button
            onClick={onOpenEditProfile}
            aria-label="प्रोफ़ाइल संपादित करें"
            className="absolute top-3 right-3 sm:top-4 sm:right-4 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-bold backdrop-blur-md border border-white/20 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            <span>प्रोफ़ाइल बदलें</span>
          </button>
        </div>

        {/* Profile Details Container */}
        <div className="px-4 sm:px-6 pb-6 pt-0 relative">
          
          {/* Avatar & Badges */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-14 sm:-mt-20 gap-3 sm:gap-4 mb-4">
            <div className="relative">
              <img 
                src={profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'} 
                alt={profile.name} 
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-white dark:ring-slate-900 shadow-2xl bg-white"
              />
              <div className="absolute -bottom-2 -right-2 p-1.5 bg-rose-600 text-white rounded-xl shadow-lg ring-2 ring-white dark:ring-slate-900">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              <button
                onClick={onOpenMembershipCard}
                className="flex-1 sm:flex-initial px-3.5 py-2 bg-gradient-to-r from-amber-500 to-rose-600 text-white rounded-2xl text-xs font-extrabold shadow-md hover:brightness-105 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 fill-white" />
                <span>6-माह डिजिटल कार्ड</span>
              </button>

              <button
                onClick={handleOpenCertificatesTab}
                className="flex-1 sm:flex-initial px-3.5 py-2 bg-gradient-to-r from-[#0e2238] to-slate-900 text-amber-300 border border-amber-500/40 rounded-2xl text-xs font-extrabold shadow hover:brightness-110 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>📜 सम्मान पत्र ({milestoneCertificates.filter(c => c.isUnlocked).length})</span>
              </button>

              <button
                onClick={handleCopyPortfolioLink}
                className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
              >
                {copiedPortfolio ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPortfolio ? 'कॉपी हुआ!' : 'लिंक'}</span>
              </button>
            </div>
          </div>

          {/* Name & Bio */}
          <div className="space-y-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black font-rozha text-slate-900 dark:text-slate-100">
                  {profile.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-[10px] font-extrabold">
                  ✓ सत्यापित लेखक
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-500 dark:text-slate-400 font-semibold pt-0.5 flex-wrap">
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
              {profile.bio || 'हिंदी साहित्य एवं काव्य का नया साधक। बोलती वर्ल्ड मंच पर नियमित रचनाकार।'}
            </p>

            {/* Email & Phone */}
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400 pt-1 flex-wrap">
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
          <div className="grid grid-cols-4 gap-1.5 sm:gap-4 mt-5 p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center">
            
            <div 
              onClick={handleOpenFullWalletTab}
              className="space-y-0.5 cursor-pointer p-1 rounded-xl hover:bg-amber-500/10 transition group"
            >
              <div className="flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400 font-bold text-sm sm:text-base group-hover:scale-105 transition">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
                <span>{displayPoints}</span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold underline decoration-dotted truncate">
                पॉइंट्स पासबुक ℹ️
              </p>
            </div>

            <div className="space-y-0.5">
              <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                {myPostsCount}
              </div>
              <p className="text-[10px] text-slate-500 font-semibold">रचनाएँ</p>
            </div>

            <div className="space-y-0.5">
              <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                {profile.followers || 0}
              </div>
              <p className="text-[10px] text-slate-500 font-semibold">फ़ॉलोअर्स</p>
            </div>

            <div 
              onClick={handleOpenCertificatesTab}
              className="space-y-0.5 cursor-pointer p-1 rounded-xl hover:bg-orange-500/10 transition group"
            >
              <div className="flex items-center justify-center gap-1 text-orange-600 dark:text-orange-400 font-bold text-sm sm:text-base group-hover:scale-105 transition">
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 fill-orange-500" />
                <span>{currentStreak} दिन</span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold underline decoration-dotted truncate">
                स्ट्रीक ट्रैकर 🔥
              </p>
            </div>
          </div>

        </div>

        {/* Profile Tabs Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-3 sm:gap-6 text-xs font-bold px-4 sm:px-6 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('works')}
            aria-label="प्रकाशित रचनाएँ देखें"
            className={`py-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'works' 
                ? 'border-rose-600 text-rose-600 dark:text-rose-400 font-bold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>प्रकाशित रचनाएँ ({myPostsCount})</span>
          </button>

          <button
            onClick={handleOpenCertificatesTab}
            aria-label="मेरे सम्मान पत्र देखें"
            className={`py-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'certificates' 
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-bold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>📜 मेरे सम्मान पत्र ({milestoneCertificates.filter(c => c.isUnlocked).length}/{milestoneCertificates.length})</span>
          </button>

          <button
            onClick={handleOpenFullWalletTab}
            aria-label="साहित्य वॉलेट देखें"
            className={`py-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'wallet' 
                ? 'border-purple-500 text-purple-600 dark:text-purple-400 font-bold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-purple-500" />
            <span>🪙 पॉइंट्स पासबुक ({displayPoints} Pts)</span>
          </button>

          <button
            onClick={() => setActiveTab('archived')}
            aria-label="आर्काइव की गई रचनाएँ देखें"
            className={`py-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === 'archived' 
                ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-bold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>📦 आर्काइव ({posts.filter(p => p.isArchived).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bookmarks')}
            aria-label="सहेजी गई रचनाएँ देखें"
            className={`py-3 border-b-2 transition whitespace-nowrap shrink-0 ${
              activeTab === 'bookmarks' 
                ? 'border-rose-600 text-rose-600 dark:text-rose-400 font-bold' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>सहेजी गई ({posts.filter(p => p.isBookmarked).length})</span>
          </button>
        </div>

      </div>

      {/* 2. Last 5 Points Summary Widget */}
      {activeTab === 'works' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                रिवॉर्ड पॉइंट्स पासबुक (अंतिम 5 लेन-देन)
              </h3>
            </div>
            <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-300 dark:border-amber-700">
              कुल बैलेंस: {displayPoints} Pts
            </span>
          </div>

          <div className="space-y-2">
            {last5Transactions.map((tx, idx) => (
              <div 
                key={tx.id || idx} 
                className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs gap-2"
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

          <div className="pt-1 flex items-center justify-between text-xs flex-wrap gap-2">
            <span className="text-[11px] text-slate-500">
              दैनिक सक्रियता व रचनाओं से पॉइंट्स अर्जित करें
            </span>
            <button
              onClick={handleOpenFullWalletTab}
              className="text-rose-600 hover:text-rose-700 dark:text-rose-400 font-bold flex items-center gap-1 transition cursor-pointer"
            >
              <span>विस्तृत पासबुक (Full Statement) →</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="space-y-4">
        {(() => {
          // 📜 TAB: Milestone Certificates & Continuous Streak Showcase
          if (activeTab === 'certificates') {
            const nextMilestone = getNextMilestone(currentStreak);
            const daysRemaining = Math.max(0, nextMilestone - currentStreak);
            const unlockedCerts = milestoneCertificates.filter(c => c.isUnlocked);
            const lockedCerts = milestoneCertificates.filter(c => !c.isUnlocked);

            return (
              <div className="space-y-5 animate-in fade-in duration-200">
                
                {/* 1. Dedicated Shareable URL & Live Streak Dashboard */}
                <div className="bg-gradient-to-br from-[#0e2238] via-slate-900 to-[#0e2238] text-white border-2 border-amber-500/40 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-500/30 pb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Award className="w-6 h-6 text-amber-400" />
                        <h2 className="text-base sm:text-xl font-bold font-rozha text-amber-200">
                          साहित्यिक सम्मान पत्र गैलरी (E-Certificates Gallery)
                        </h2>
                      </div>
                      <p className="text-xs text-slate-300">
                        लेखक: <strong>{profile.name}</strong> (@{cleanUser}) • bolateeworld.in
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={handleCopyCertLink}
                        className="flex-1 sm:flex-initial px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow cursor-pointer"
                      >
                        {copiedCertUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCertUrl ? 'URL कॉपी हुआ!' : '📜 सम्मान पत्र URL कॉपी करें'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Shareable Link Box */}
                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-amber-500/20 flex items-center justify-between gap-2 text-xs">
                    <span className="font-mono text-amber-300 truncate">
                      {certificateShareUrl}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      सार्वजनिक लिंक
                    </span>
                  </div>

                  {/* Daily 5-Minute Active Session & Streak Progress */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    
                    {/* Streak Counter */}
                    <div className="p-3 bg-slate-800/80 rounded-2xl border border-amber-500/30 space-y-1">
                      <span className="text-[11px] text-amber-400 font-bold block flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                        <span>वर्तमान सक्रिय स्ट्रीक</span>
                      </span>
                      <div className="text-2xl font-black text-white">
                        {currentStreak} दिन
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        अगला सम्मान: {nextMilestone} दिन पर ({daysRemaining} दिन शेष)
                      </span>
                    </div>

                    {/* Today 5-Min Timer */}
                    <div className="p-3 bg-slate-800/80 rounded-2xl border border-amber-500/30 space-y-1">
                      <span className="text-[11px] text-emerald-400 font-bold block flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>आज की 5-मिनट सक्रियता</span>
                      </span>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{Math.min(300, activeSeconds)}/300 सेकंड</span>
                        {is5MinReached ? (
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] rounded border border-emerald-500/40">✓ पूर्ण</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] rounded border border-amber-500/40">प्रगति पर</span>
                        )}
                      </div>
                      <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-300"
                          style={{ width: `${Math.min(100, (activeSeconds / 300) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Reset Rule Notice */}
                    <div className="p-3 bg-red-950/40 rounded-2xl border border-red-500/30 space-y-0.5 text-xs text-red-200 flex flex-col justify-center">
                      <span className="font-bold flex items-center gap-1 text-red-400 text-[11px]">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>स्ट्रीक नियम:</span>
                      </span>
                      <p className="text-[10px] text-red-300 leading-tight">
                        यदि 1 दिन भी अनुपस्थित रहते हैं, तो स्ट्रीक रीस्टार्ट (1-2) हो जाएगी। लगातार बने रहें!
                      </p>
                    </div>

                  </div>

                </div>

                {/* 2. SECTION 1: Unlocked Certificates (Top Section) */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 space-y-5 shadow-lg w-full">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap gap-2">
                    <h3 className="text-base sm:text-lg font-bold font-rozha text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                      <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <span>🏆 आपके प्राप्त मानद सम्मान पत्र ({unlockedCerts.length})</span>
                    </h3>
                    <span className="px-3.5 py-1 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-bold text-xs rounded-full border border-emerald-300 dark:border-emerald-700">
                      ✓ तुरंत डाउनलोड हेतु उपलब्ध
                    </span>
                  </div>

                  <div className={`grid ${unlockedCerts.length === 1 ? 'grid-cols-1 max-w-2xl' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-4 sm:gap-6`}>
                    {unlockedCerts.map((cert) => (
                      <div 
                        key={cert.id}
                        className="rounded-3xl p-5 sm:p-6 border-2 border-[#0e2238] dark:border-amber-500/50 bg-[#fdfbf7] dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 transition flex flex-col justify-between gap-4 shadow-md hover:shadow-xl relative overflow-hidden"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-400 flex items-center gap-1.5 shadow-sm">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              <span>{cert.badgeText}</span>
                            </span>
                            <span className="text-2xl">📜</span>
                          </div>

                          <h4 className="font-bold text-base sm:text-lg font-rozha text-[#0e2238] dark:text-amber-200 leading-snug">
                            {cert.title}
                          </h4>

                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-serif leading-relaxed">
                            {cert.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                          <span className="text-xs text-slate-500 font-mono font-bold">
                            {cert.certificateId}
                          </span>

                          <button
                            onClick={() => setSelectedCertToView(cert)}
                            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-black bg-[#0e2238] hover:bg-slate-900 text-amber-300 shadow-md flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer border border-amber-500/30"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>देखें व डाउनलोड करें</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. SECTION 2: Upcoming / Locked Milestone Certificates (Bottom Section) */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 space-y-5 shadow-lg w-full">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap gap-2">
                    <h3 className="text-base sm:text-lg font-bold font-rozha text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-500" />
                      <span>🔒 आगामी सम्मान पत्र ({lockedCerts.length})</span>
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">
                      सक्रियता बढ़ाते ही अनलॉक होंगे
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {lockedCerts.map((cert) => (
                      <div 
                        key={cert.id}
                        className="rounded-3xl p-4 sm:p-5 border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 opacity-85 transition flex flex-col justify-between gap-3 shadow-sm hover:opacity-100"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                              <Lock className="w-3 h-3 text-amber-500" />
                              <span>{cert.badgeText}</span>
                            </span>
                            <span className="text-xl opacity-60">📜</span>
                          </div>

                          <h4 className="font-bold text-sm sm:text-base font-rozha text-slate-800 dark:text-slate-200">
                            {cert.title}
                          </h4>

                          <p className="text-xs text-slate-500 dark:text-slate-400 font-serif leading-relaxed">
                            {cert.description}
                          </p>
                        </div>

                        <div className="pt-2.5 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                          <span className="text-[11px] text-slate-400 font-mono font-semibold">
                            {cert.category}
                          </span>

                          <button
                            onClick={() => setSelectedCertToView(cert)}
                            className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Lock className="w-3 h-3" />
                            <span>शर्तें देखें</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            );
          }

          // 💰 TAB: Full Wallet Passbook
          if (activeTab === 'wallet') {
            return (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 space-y-5 shadow-lg">
                  
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

                    <div className="bg-gradient-to-r from-amber-500 to-rose-600 text-white px-4 py-2.5 rounded-2xl text-center shadow w-full sm:w-auto">
                      <span className="text-[10px] uppercase font-bold block opacity-90">कुल उपलब्ध बैलेंस</span>
                      <span className="text-xl font-black">{displayPoints} Points</span>
                    </div>
                  </div>


                  {/* Summary Metric Cards */}
                  {(() => {
                    const totalFree = effectiveTransactions
                      .filter(t => t.type === 'credit' && !t.reason?.toLowerCase().includes('रीचार्ज') && !t.reason?.toLowerCase().includes('recharge'))
                      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

                    const totalPaid = effectiveTransactions
                      .filter(t => t.type === 'credit' && (t.reason?.toLowerCase().includes('रीचार्ज') || t.reason?.toLowerCase().includes('recharge')))
                      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

                    const totalSpent = effectiveTransactions
                      .filter(t => t.type === 'debit')
                      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                          <span className="text-[10px] font-extrabold uppercase block opacity-80">🎁 कुल फ्री कमाए गए</span>
                          <span className="text-lg font-black font-rozha">+{totalFree} Pts</span>
                          <p className="text-[10px] opacity-75 mt-0.5">वेलकम बोनस व दैनिक गतिविधियाँ</p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-800 dark:text-blue-300">
                          <span className="text-[10px] font-extrabold uppercase block opacity-80">💳 कुल रीचार्ज किए गए</span>
                          <span className="text-lg font-black font-rozha">+{totalPaid} Pts</span>
                          <p className="text-[10px] opacity-75 mt-0.5">₹10/₹20/₹30 UPI रीचार्ज पैक</p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300">
                          <span className="text-[10px] font-extrabold uppercase block opacity-80">📤 कुल खर्च / बर्न हुए</span>
                          <span className="text-lg font-black font-rozha">-{totalSpent} Pts</span>
                          <p className="text-[10px] opacity-75 mt-0.5">HD पोस्टर्स व मंच प्रकाशन</p>
                        </div>
                      </div>
                    );
                  })()}

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
              onDeductPoints={onRechargePoints}
            />
          ));
        })()}
      </div>

      {/* Points Explanation Modal */}
      <PointsExplanationModal
        isOpen={showPointsModal}
        onClose={() => setShowPointsModal(false)}
        points={displayPoints}
      />

      {/* 6-Month Literary Membership Card Modal */}
      <LiteraryMembershipCardModal
        isOpen={showMembershipModal}
        onClose={() => setShowMembershipModal(false)}
        userProfile={{ ...profile, points: displayPoints }}
      />

      {/* Certificate Viewer / Generator Modal */}
      {selectedCertToView && (
        <CertificateGenerator
          isOpen={true}
          onClose={() => setSelectedCertToView(null)}
          certificateData={selectedCertToView}
          userPoints={displayPoints}
          userProfile={{ ...profile, points: displayPoints }}
          totalUserPosts={myPostsCount}
          userStreak={currentStreak}
        />
      )}

    </div>
  );
};

export default ProfileView;
