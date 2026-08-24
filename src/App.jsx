import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import MobileBottomNav from './components/MobileBottomNav';
import AuthModal from './components/AuthModal';
import FirstTimeUserModal from './components/FirstTimeUserModal';
import CreatePostModal from './components/CreatePostModal';
import EditPostModal from './components/EditPostModal';
import EditProfileModal from './components/EditProfileModal';
import YouTubeSubscribeModal from './components/YouTubeSubscribeModal';
import MagazineViewerModal from './components/MagazineViewerModal';
import CertificateGenerator from './components/CertificateGenerator';
import NotificationDrawer from './components/NotificationDrawer';
import PublicProfileModal from './components/PublicProfileModal';
import PoetryBattleChallengeModal from './components/PoetryBattleChallengeModal';
import LiteraryMembershipCardModal from './components/LiteraryMembershipCardModal';
import YouTubeTaskModal from './components/YouTubeTaskModal';
import ReferEarnModal from './components/ReferEarnModal';
import AdminAuthModal from './components/AdminAuthModal';
import SplashScreen from './components/SplashScreen';
import PWAInstallModal from './components/PWAInstallModal';

import { logUserActiveHeartbeat, checkAndTriggerInactivityNotification, requestNotificationPermission } from './lib/notificationService';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { supabase } from './lib/supabase';
import { fetchPostsFromDB, createPostInDB, deletePostFromDB, archivePostInDB, updateUserProfileInDB, fetchWeeklyChallengeFromDB, toggleLikeInDB, savePostToIndexedDB, uploadImageToSupabaseStorage } from './lib/dataService';

import { updatePageSEO } from './utils/seo';

import HomeFeedView from './views/HomeFeedView';
import DailyChallengeView from './views/DailyChallengeView';
import PoetryBattlesView from './views/PoetryBattlesView';
import CompetitionsView from './views/CompetitionsView';
import EventsView from './views/EventsView';
import LeaderboardView from './views/LeaderboardView';
import MagazineView from './views/MagazineView';
import ProfileView from './views/ProfileView';
import AdminDashboardView from './views/AdminDashboardView';
import SearchResultsView from './views/SearchResultsView';
import PosterStudioView from './views/PosterStudioView';
import AudioStoriesView from './views/AudioStoriesView';
import FestivalView from './views/FestivalView';

import { mockPosts, mockDailyChallenge, mockPoetryBattle } from './data/mockPosts';
import { mockCompetitions } from './data/mockCompetitions';
import { mockEvents } from './data/mockEvents';
import { FESTIVAL_THEMES, detectCurrentAutoFestivalTheme } from './data/festivalThemes';
import { Sparkles, Trophy, CheckCircle2 } from 'lucide-react';

function AppContent() {
  const [activeView, setActiveView] = useState('feed');
  
  // Splash Screen State (shown on fresh launch)
  const [showSplash, setShowSplash] = useState(() => {
    const hasSeen = sessionStorage.getItem('bolteekalam_splash_shown');
    return !hasSeen;
  });

  // PWA Install Prompt State
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Restore Active User Session from localStorage to prevent sudden logout on refresh!
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('bolteekalam_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // Admin Security Modal State
  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);

  // Official Authorized Super Admin Email Accounts
  const AUTHORIZED_ADMIN_EMAILS = [
    'bolateeworld@gmail.com',
    'admin@bolateeworld.in',
    'bolteekalam@gmail.com',
    'sanjayrai@gmail.com',
    'akashsingh@gmail.com'
  ];

  const [userRole, setUserRole] = useState(() => {
    try {
      const isSessionAuth = sessionStorage.getItem('bolteekalam_admin_authenticated') === 'true';
      if (isSessionAuth) return 'admin';
      const savedUser = localStorage.getItem('bolteekalam_active_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.email && AUTHORIZED_ADMIN_EMAILS.includes(parsed.email.toLowerCase())) {
          return 'admin';
        }
      }
    } catch (e) {}
    return 'user';
  });

  // First-Time User Onboarding State
  const [showFirstTimeModal, setShowFirstTimeModal] = useState(false);
  const [pendingFirstTimeUser, setPendingFirstTimeUser] = useState(null);

  // Floating Points Reward Toast Notification State
  const [pointsToast, setPointsToast] = useState(null);

  // Modals State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMagazineModal, setShowMagazineModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showReferEarnModal, setShowReferEarnModal] = useState(false);
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [certificateData, setCertificateData] = useState(null);

  // Posts State Initialized with Saved Local Public Feed Posts + User Posts + Mock Posts
  const [posts, setPosts] = useState(() => {
    try {
      const savedGlobal = localStorage.getItem('bolteekalam_global_shared_public_posts_v2');
      const savedUserPosts = localStorage.getItem('bolteekalam_user_created_posts');
      const globalParsed = savedGlobal ? JSON.parse(savedGlobal) : [];
      const userParsed = savedUserPosts ? JSON.parse(savedUserPosts) : [];
      
      if (globalParsed.length > 0 || userParsed.length > 0) {
        const combined = [...globalParsed, ...userParsed, ...mockPosts];
        const seenIds = new Set();
        return combined.filter(p => {
          if (!p || !p.id) return false;
          const pId = String(p.id);
          if (seenIds.has(pId)) return false;
          seenIds.add(pId);
          return true;
        });
      }
    } catch (e) {}
    return mockPosts;
  });

  // Weekly Challenge Global State
  const [weeklyChallenge, setWeeklyChallenge] = useState({
    topic: 'बरसात का पहला ख़त',
    title: 'बरसात का पहला ख़त',
    prompt: 'सावन की पहली फुहार और पुराने ख़तों की यादों को समेटते हुए 4 उत्कृष्ट पंक्तियाँ लिखें।',
    endsIn: '4 दिन 14 घंटे',
    reward1st: 500,
    reward2nd: 250
  });

  // Dynamic Festive Banner Global State
  const [patrioticBanner, setPatrioticBanner] = useState({
    tag: 'राष्ट्रीय डिजिटल साहित्यिक मंच ✍️',
    title: 'बोलती कलम में आपका स्वागत है!',
    description: 'अपनी कविताएँ, ग़ज़लें, विचार साझा करें और डिजिटल साहित्यिक समुदाय से जुड़ें।',
    bgImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800'
  });

  // User Profile State (Persisted in localStorage across refreshes)
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const savedActiveUser = localStorage.getItem('bolteekalam_active_user');
      const activeObj = savedActiveUser ? JSON.parse(savedActiveUser) : null;
      const savedProf = localStorage.getItem('bolteekalam_user_profile');
      const profObj = savedProf ? JSON.parse(savedProf) : null;

      if (profObj || activeObj) {
        let cleanPoints = profObj?.points !== undefined ? profObj.points : (activeObj?.points !== undefined ? activeObj.points : 50);
        // Security Sanity: If points are abnormally inflated (>250) from old buggy mock data, reset to valid 50 points
        if (typeof cleanPoints !== 'number' || cleanPoints > 250 || cleanPoints < 0) {
          cleanPoints = 50;
        }

        const sanitized = {
          ...profObj,
          ...activeObj,
          points: cleanPoints,
          avatar: activeObj?.avatar || profObj?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
          name: activeObj?.name || profObj?.name || 'साहित्य साधक',
          username: activeObj?.username || profObj?.username || '@writer',
          city: activeObj?.city || profObj?.city || 'प्रयागराज',
          bio: activeObj?.bio || profObj?.bio || 'हिंदी साहित्य एवं काव्य का नया साधक।'
        };

        try {
          localStorage.setItem('bolteekalam_user_profile', JSON.stringify(sanitized));
          if (activeObj) {
            localStorage.setItem('bolteekalam_active_user', JSON.stringify({ ...activeObj, points: cleanPoints }));
          }
        } catch (e) {}

        return sanitized;
      }
    } catch (e) {}

    return {
      name: 'नया साहित्य साधक',
      email: 'newuser@bolteekalam.com',
      phone: '',
      username: '@new_writer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      cover: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1200',
      badge: 'verifiedAuthor',
      bio: 'हिंदी साहित्य एवं काव्य का नया साधक। अभी अपनी पहली कविता पोस्ट करने जा रहा हूँ।',
      city: 'प्रयागराज',
      joined: 'अगस्त 2026',
      points: 50,
      followers: 12,
      following: 5,
      streak: 3
    };
  });

  // Author Public Profile Modal State
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [showPublicProfileModal, setShowPublicProfileModal] = useState(false);

  // Poetry Battle Challenge Modal State
  const [poetryChallengeTarget, setPoetryChallengeTarget] = useState(null);
  const [showPoetryChallengeModal, setShowPoetryChallengeModal] = useState(false);

  // Global 6-Month Membership Card Modal State
  const [showGlobalMembershipModal, setShowGlobalMembershipModal] = useState(false);

  // YouTube Task Modal & Proofs State
  const [showYouTubeTaskModal, setShowYouTubeTaskModal] = useState(false);
  const [youtubeProofs, setYoutubeProofs] = useState(() => {
    try {
      const saved = localStorage.getItem('bolteekalam_youtube_proofs_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Global Festival Ambient Theme Engine State
  const [activeFestivalTheme, setActiveFestivalTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('bolteekalam_active_festival_theme');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.id === 'auto') return detectCurrentAutoFestivalTheme();
        return parsed;
      }
    } catch (e) {}
    return detectCurrentAutoFestivalTheme();
  });

  const handleUpdateFestivalTheme = (newThemeObj) => {
    setActiveFestivalTheme(newThemeObj);
    try {
      localStorage.setItem('bolteekalam_active_festival_theme', JSON.stringify(newThemeObj));
    } catch (e) {}
  };

  const [profileInitialTab, setProfileInitialTab] = useState('works');

  // Notifications List State (Persisted in localStorage)
  const [notificationsList, setNotificationsList] = useState(() => {
    try {
      const saved = localStorage.getItem('bolteekalam_notifications_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 101,
        type: 'like',
        title: 'सरस्वती पाठक ने आपकी कविता को लाइक किया',
        desc: 'आपकी रचना पर नई लाइक मिली। (+5 Pts)',
        time: '10 मिनट पहले',
        isUnread: true
      },
      {
        id: 102,
        type: 'comment',
        title: 'संजय राय: "अद्भुत रचना!"',
        desc: 'आपकी पोस्ट पर नया कमेंट प्राप्त हुआ।',
        time: '25 मिनट पहले',
        isUnread: true
      }
    ];
  });
  const [unreadNotifications, setUnreadNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('bolteekalam_unread_notifications_v1');
      if (saved !== null) return parseInt(saved, 10);
    } catch (e) {}
    return 2;
  });

  // Wallet Transactions History Ledger State (Cleaned & Deduplicated)
  const [walletTransactions, setWalletTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('bolteekalam_wallet_transactions');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: 1, type: 'debit', amount: 15, reason: 'मंच पर डायरेक्ट इमेज़ पोस्टर पोस्ट करने पर', time: '1 घंटे पहले' },
      { id: 2, type: 'debit', amount: 25, reason: 'AI इमेज़ पोस्टर जनरेट करने पर', time: '3 घंटे पहले' },
      { id: 3, type: 'credit', amount: 10, reason: 'नई साहित्य रचना पोस्ट करने पर', time: '1 दिन पहले' },
      { id: 4, type: 'credit', amount: 5, reason: 'दैनिक उपस्थिति (Daily Login Bonus)', time: '1 दिन पहले' },
      { id: 5, type: 'credit', amount: 100, reason: '₹10 रीचार्ज पैक (100 Points Credit)', time: '2 दिन पहले' }
    ];
  });
  const authorProfileMap = React.useMemo(() => {
    const map = {};

    map['sanjayrai'] = { name: 'संजय राय (संस्थापक)', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300' };
    map['sanjayrai_founder'] = { name: 'संजय राय (संस्थापक)', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300' };
    map['akash_cofounder'] = { name: 'आकाश कुमार सिंह', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300' };

    (posts || []).forEach(p => {
      const emailKey = p.author?.email ? p.author.email.toLowerCase().trim() : null;
      const userKey = p.author?.username ? p.author.username.toLowerCase().replace(/^[@#]/, '').trim() : null;
      const nameKey = p.author?.name ? p.author.name.toLowerCase().trim() : null;

      const profileData = {
        name: p.author?.name || p.authorName,
        avatar: p.author?.avatar || p.authorAvatar || p.avatar
      };

      if (profileData.avatar && !profileData.avatar.includes('placeholder')) {
        if (emailKey) map[emailKey] = profileData;
        if (userKey) map[userKey] = profileData;
        if (nameKey) map[nameKey] = profileData;
      }
    });

    const activeEmail = (userProfile?.email || currentUser?.email || '').toLowerCase().trim();
    const activeUser = (userProfile?.username || currentUser?.username || '').toLowerCase().replace(/^[@#]/, '').trim();
    const activeName = (userProfile?.name || currentUser?.name || '').toLowerCase().trim();

    const activeProfileData = {
      name: userProfile?.name || currentUser?.name || 'साहित्य साधक',
      avatar: userProfile?.avatar || currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
    };

    if (activeEmail) map[activeEmail] = activeProfileData;
    if (activeUser) map[activeUser] = activeProfileData;
    if (activeName) map[activeName] = activeProfileData;

    return map;
  }, [posts, userProfile, currentUser]);

  // Load Posts from Supabase PostgreSQL Database on Mount & Listen to Supabase Realtime WebSocket
  useEffect(() => {
    const syncPosts = () => {
      fetchPostsFromDB().then(dbPosts => {
        if (dbPosts && dbPosts.length > 0) {
          let likedIds = new Set();
          let savedLikeCounts = {};
          let savedCommentsMap = {};
          try {
            const storedLikes = localStorage.getItem('bolteekalam_user_liked_posts');
            if (storedLikes) likedIds = new Set(JSON.parse(storedLikes));
            const storedCounts = localStorage.getItem('bolteekalam_post_like_counts_v1');
            if (storedCounts) savedLikeCounts = JSON.parse(storedCounts);
            const storedComments = localStorage.getItem('bolteekalam_saved_comments_v1');
            if (storedComments) savedCommentsMap = JSON.parse(storedComments);
          } catch (e) {}

          setPosts(prev => {
            const prevMap = new Map();
            const prevFingerprintMap = new Map();

            prev.forEach(p => {
              if (p && p.id) {
                const pIdStr = String(p.id);
                const cleanId = pIdStr.replace(/^post-/, '');
                prevMap.set(pIdStr, p);
                prevMap.set(cleanId, p);
                const fp = `${(p.title || '').trim().toLowerCase()}::${(p.content || '').trim().slice(0, 40).toLowerCase()}`;
                if (fp) prevFingerprintMap.set(fp, p);
              }
            });

            const dbIds = new Set(dbPosts.map(p => String(p.id)));

            const mergedDbPosts = dbPosts.map(p => {
              const pIdStr = String(p.id);
              const cleanId = pIdStr.replace(/^post-/, '');
              const fp = `${(p.title || '').trim().toLowerCase()}::${(p.content || '').trim().slice(0, 40).toLowerCase()}`;
              const prevPost = prevMap.get(pIdStr) || prevMap.get(cleanId) || prevFingerprintMap.get(fp);

              const isLiked = likedIds.has(pIdStr) || likedIds.has(cleanId) || (prevPost && prevPost.isLiked);
              
              const localComments = savedCommentsMap[pIdStr] || savedCommentsMap[cleanId] || [];
              const prevComments = prevPost?.comments || [];
              const dbComments = p.comments || [];

              const commentSeen = new Set();
              const combinedComments = [...localComments, ...prevComments, ...dbComments].filter(c => {
                if (!c) return false;
                const key = c.id || c.content;
                if (commentSeen.has(key)) return false;
                commentSeen.add(key);
                return true;
              });

              const posterImg = p.imageUrl || p.image || prevPost?.imageUrl || prevPost?.image || null;
              const maxLikes = Math.max(p.likes || 0, prevPost?.likes || 0, savedLikeCounts[pIdStr] || 0, savedLikeCounts[cleanId] || 0);

              return {
                ...p,
                imageUrl: posterImg,
                image: posterImg,
                isLiked: !!isLiked,
                likes: maxLikes,
                comments: combinedComments
              };
            });

            const mergedDbFingerprints = new Set(mergedDbPosts.map(p => `${(p.title || '').trim().toLowerCase()}::${(p.content || '').trim().slice(0, 40).toLowerCase()}`));

            const unsyncedLocalPosts = prev.filter(p => {
              if (!p || !p.id) return false;
              const pIdStr = String(p.id);
              const cleanId = pIdStr.replace(/^post-/, '');
              const fp = `${(p.title || '').trim().toLowerCase()}::${(p.content || '').trim().slice(0, 40).toLowerCase()}`;
              return !dbIds.has(pIdStr) && !dbIds.has(cleanId) && !mergedDbFingerprints.has(fp);
            });

            const finalPosts = [...unsyncedLocalPosts, ...mergedDbPosts];
            try {
              localStorage.setItem('bolteekalam_global_shared_public_posts_v2', JSON.stringify(finalPosts));
            } catch (e) {}
            return finalPosts;
          });
        }
      });
    };

    syncPosts();

    // Supabase Realtime Channel Listener
    const postsChannel = supabase
      .channel('public:posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, () => {
        syncPosts();
      })
      .subscribe();

    const interval = setInterval(syncPosts, 15000);

    return () => {
      supabase.removeChannel(postsChannel);
      clearInterval(interval);
    };
  }, []);

  // PWA Install Prompt, Inactivity Notification & Points Sanity Enforcement Effect
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Heartbeat & 2-Day Inactivity Notification Check
    logUserActiveHeartbeat();
    checkAndTriggerInactivityNotification();

    // Auto-request notification permission after 4 seconds of engagement
    const permTimer = setTimeout(() => {
      requestNotificationPermission();
    }, 4000);

    // Hard Sanity Check: If localStorage has legacy points > 100, force reset to 50
    try {
      const storedProf = localStorage.getItem('bolteekalam_user_profile');
      if (storedProf) {
        const p = JSON.parse(storedProf);
        if (p && (typeof p.points !== 'number' || p.points > 100 || p.points < 0)) {
          p.points = 50;
          localStorage.setItem('bolteekalam_user_profile', JSON.stringify(p));
          setUserProfile(prev => ({ ...prev, points: 50 }));
        }
      }
    } catch (e) {}

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      clearTimeout(permTimer);
    };
  }, []);

  // 1. Supabase OAuth Session Listener for Instant Google Login Restore & Profile Preservation
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const userEmail = session.user.email || '';

        let savedProf = null;
        try {
          const stored = localStorage.getItem('bolteekalam_user_profile');
          if (stored) savedProf = JSON.parse(stored);
        } catch (e) {}

        const existingPoints = savedProf?.points !== undefined ? savedProf.points : 20;
        const preservedAvatar = savedProf?.avatar || session.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
        const rawGoogleName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || userEmail.split('@')[0];
        const preservedName = savedProf?.name && savedProf.name !== 'साहित्य साधक' ? savedProf.name : (rawGoogleName || 'साहित्यिक लेखक');
        const preservedUsername = savedProf?.username || `@${(rawGoogleName || 'writer').toLowerCase().replace(/\s+/g, '_')}`;
        const accountCreatedIso = savedProf?.createdAt || localStorage.getItem(`bw_account_created_${userEmail}`) || new Date().toISOString();
        try { localStorage.setItem(`bw_account_created_${userEmail}`, accountCreatedIso); } catch (e) {}

        const googleProfile = {
          name: preservedName,
          username: preservedUsername,
          email: userEmail,
          avatar: preservedAvatar,
          role: savedProf?.role || 'user',
          city: savedProf?.city || 'प्रयागराज',
          bio: savedProf?.bio || '',
          isVerified: true,
          points: existingPoints,
          phone: savedProf?.phone || localStorage.getItem(`user_phone_${userEmail}`) || '',
          birthday: savedProf?.birthday || localStorage.getItem(`user_dob_${userEmail}`) || '',
          createdAt: accountCreatedIso
        };

        handleLoginSuccess(googleProfile, !savedProf);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // View Navigation Handler with Clean URL PushState & Admin Role Gatekeeper
  const handleNavigateView = (viewId) => {
    if (viewId === 'admin') {
      const isAuth = userRole === 'admin' || sessionStorage.getItem('bolteekalam_admin_authenticated') === 'true';
      if (!isAuth) {
        setShowAdminAuthModal(true);
        return;
      }
    }
    setActiveView(viewId);
    try {
      if (viewId === 'admin') {
        history.pushState(null, '', '/admin');
        document.title = 'बोलती कलम सुपर एडमिन डैशबोर्ड | bolateeworld.in';
      } else if (viewId === 'profile') {
        history.pushState(null, '', '/profile');
        document.title = 'मेरी साहित्य प्रोफ़ाइल — बोलती कलम | bolateeworld.in';
      } else if (viewId === 'feed') {
        history.pushState(null, '', '/');
        document.title = 'बोलती कलम (bolateeworld.in) — राष्ट्रीय डिजिटल साहित्यिक मंच';
      } else if (viewId === 'battles') {
        history.pushState(null, '', '/poetry-battle');
        document.title = 'काव्य संग्राम — बोलती कलम | bolateeworld.in';
      } else if (viewId === 'daily') {
        history.pushState(null, '', '/sahityik-chunautiyan');
        document.title = 'साहित्यिक चुनौतियाँ — बोलती कलम | bolateeworld.in';
      } else if (viewId === 'competitions') {
        history.pushState(null, '', '/sahityik-darpan');
        document.title = 'साहित्यिक दर्पण — बोलती कलम | bolateeworld.in';
      } else if (viewId === 'events') {
        history.pushState(null, '', '/events');
        document.title = 'साहित्यिक कार्यक्रम — बोलती कलम | bolateeworld.in';
      } else if (viewId === 'leaderboard') {
        history.pushState(null, '', '/leaderboard');
        document.title = 'लीडरबोर्ड — बोलती कलम | bolateeworld.in';
      } else if (viewId === 'magazine') {
        history.pushState(null, '', '/magazine');
        document.title = 'साहित्यिक पत्रिका — बोलती कलम | bolateeworld.in';
      } else if (viewId === 'posterStudio') {
        history.pushState(null, '', '/studio');
        document.title = 'कवि इमेज़ पोस्टर Studio — बोलती कलम | bolateeworld.in';
      } else if (viewId === 'festival') {
        history.pushState(null, '', '/festival');
        document.title = 'साहित्यिक पर्व विशेषांक — बोलती कलम | bolateeworld.in';
      }
    } catch (e) {}
  };

  const handleOpenAuthorProfile = (author) => {
    if (!author) return;
    const cleanUsername = author.username ? author.username.replace(/^@/, '') : author.name.toLowerCase().replace(/\s+/g, '_');
    
    // Set clean URL without showing '#' symbol
    try {
      history.pushState(null, '', `/${cleanUsername}`);
    } catch (e) {
      window.location.hash = `${cleanUsername}`;
    }
    document.title = `${author.name || 'लेखक'} (@${cleanUsername}) — बोलती कलम | bolateeworld.in`;
    setSelectedAuthor(author);
    setShowPublicProfileModal(true);
  };

  const handleCloseAuthorProfile = () => {
    setShowPublicProfileModal(false);
    try {
      history.pushState(null, '', '/');
    } catch (e) {
      if (window.location.hash) history.replaceState(null, '', window.location.pathname);
    }
    document.title = 'बोलती कलम (bolateeworld.in) — राष्ट्रीय डिजिटल साहित्यिक मंच';
  };

  // URL Pathname & Hash Listener for Resilient SPA Navigation & Deep-linking
  useEffect(() => {
    const handleHashRoute = () => {
      try {
        const rawPath = (window.location.pathname || '/').toLowerCase();
        const rawHash = (window.location.hash || '').toLowerCase();

        // 0. Direct Admin Route Check
        if (rawPath.includes('/admin') || rawHash.includes('admin') || window.location.search.includes('admin')) {
          const isAuth = userRole === 'admin' || sessionStorage.getItem('bolteekalam_admin_authenticated') === 'true';
          if (isAuth) {
            setUserRole('admin');
            setActiveView('admin');
          } else {
            setShowAdminAuthModal(true);
          }
          return;
        }

        // 1. Direct Page Views Navigation Mapping
        if (rawPath.includes('/poetry-battle') || rawHash.includes('poetry-battle')) {
          setActiveView('battles');
          return;
        }
        if (rawPath.includes('/sahityik-chunautiyan') || rawHash.includes('sahityik-chunautiyan')) {
          setActiveView('daily');
          return;
        }
        if (rawPath.includes('/sahityik-darpan') || rawHash.includes('sahityik-darpan')) {
          setActiveView('competitions');
          return;
        }
        if (rawPath.includes('/events') || rawHash.includes('events')) {
          setActiveView('events');
          return;
        }
        if (rawPath.includes('/leaderboard') || rawHash.includes('leaderboard')) {
          setActiveView('leaderboard');
          return;
        }
        if (rawPath.includes('/magazine') || rawHash.includes('magazine')) {
          setActiveView('magazine');
          return;
        }
        if (rawPath.includes('/studio') || rawHash.includes('studio')) {
          setActiveView('posterStudio');
          document.title = 'कवि इमेज़ पोस्टर Studio — बोलती कलम | bolateeworld.in';
          return;
        }
        if (rawPath.includes('/wallet') || rawHash.includes('wallet')) {
          setActiveView('profile');
          setProfileInitialTab('wallet');
          document.title = 'साहित्य रिवॉर्ड पॉइंट्स पासबुक — बोलती वर्ल्ड | bolateeworld.in';
          return;
        }
        if (rawPath.includes('/certificate') || rawHash.includes('certificate')) {
          setActiveView('certificates');
          setProfileInitialTab('certificates');
          document.title = 'मेरे साहित्यिक सम्मान पत्र (E-Certificates) — बोलती वर्ल्ड | bolateeworld.in';
          return;
        }
        if (rawPath === '/profile' || rawHash === '#/profile') {
          setActiveView('profile');
          setProfileInitialTab('works');
          document.title = 'मेरी साहित्य प्रोफ़ाइल — बोलती वर्ल्ड | bolateeworld.in';
          return;
        }

        // 2. Profile Deep Links: /profile/username or /username
        let usernameQuery = '';
        if (rawPath.startsWith('/profile/')) {
          usernameQuery = rawPath.replace('/profile/', '').replace(/^@/, '').trim();
        } else if (rawPath && rawPath.length > 1 && rawPath !== '/') {
          usernameQuery = decodeURIComponent(rawPath.replace(/^\/@?/, '')).trim();
        } else if (rawHash && rawHash.length > 1) {
          usernameQuery = decodeURIComponent(rawHash.replace(/^#\/?@?/, '')).trim();
        }

        if (usernameQuery) {
          const matchedPost = posts.find(p => {
            const authorUser = p.author?.username?.toLowerCase().replace(/^@/, '');
            return authorUser === usernameQuery;
          });

          if (matchedPost) {
            setSelectedAuthor(matchedPost.author);
            setShowPublicProfileModal(true);
            document.title = `${matchedPost.author.name} (@${usernameQuery}) — बोलती कलम`;
          } else {
            const mockWritersByUsername = {
              'sanjayrai': {
                name: 'संजय राय (संस्थापक)',
                username: '@sanjayrai',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
                city: 'प्रयागराज',
                bio: 'बोलती कलम साहित्य मंच के संस्थापक एवं वरिष्ठ साहित्यकार।'
              },
              'akash_cofounder': {
                name: 'आकाश कुमार सिंह',
                username: '@akash_cofounder',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
                city: 'नई दिल्ली',
                bio: 'बोलती कलम डिजिटल मीडिया प्रमुख एवं युवा कवि।'
              },
              'bolateeworld': {
                name: 'बोलती कलम (आधिकारिक)',
                username: '@bolateeworld',
                avatar: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=300',
                city: 'प्रयागराज',
                bio: 'बोलती कलम आधिकारिक मंच - हिंदी साहित्य एवं काव्य मंच।'
              }
            };

            const matchedMockWriter = mockWritersByUsername[usernameQuery];
            if (matchedMockWriter) {
              setSelectedAuthor(matchedMockWriter);
              setShowPublicProfileModal(true);
              document.title = `${matchedMockWriter.name} (${matchedMockWriter.username}) — बोलती कलम`;
            }
          }
        }
      } catch (e) {
        console.error("Router error:", e);
      }
    };

    handleHashRoute();
    window.addEventListener('popstate', handleHashRoute);
    window.addEventListener('hashchange', handleHashRoute);
    return () => {
      window.removeEventListener('popstate', handleHashRoute);
      window.removeEventListener('hashchange', handleHashRoute);
    };
  }, [posts]);

  const handleOpenPoetryChallenge = (targetAuthor) => {
    setPoetryChallengeTarget(targetAuthor);
    setShowPoetryChallengeModal(true);
  };

  const handleLikePost = (post, isLikedState, likesCountState) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    if (!post) return;
    const newIsLiked = isLikedState !== undefined ? isLikedState : !post.isLiked;
    const newLikesCount = likesCountState !== undefined ? likesCountState : (newIsLiked ? (post.likes || 0) + 1 : Math.max(0, (post.likes || 0) - 1));

    // Save liked post IDs in localStorage for user session persistence
    try {
      const storedLikes = localStorage.getItem('bolteekalam_user_liked_posts');
      let likedIds = storedLikes ? JSON.parse(storedLikes) : [];
      if (newIsLiked) {
        if (!likedIds.includes(String(post.id))) likedIds.push(String(post.id));
      } else {
        likedIds = likedIds.filter(id => id !== String(post.id));
      }
      localStorage.setItem('bolteekalam_user_liked_posts', JSON.stringify(likedIds));
    } catch (e) {}

    // 1. Update posts array state dynamically & persist to localStorage
    setPosts(prevPosts => {
      const updatedPosts = prevPosts.map(p => {
        if (p.id === post.id || String(p.id) === String(post.id)) {
          return {
            ...p,
            likes: newLikesCount,
            isLiked: newIsLiked
          };
        }
        return p;
      });

      try {
        localStorage.setItem('bolteekalam_global_shared_public_posts_v2', JSON.stringify(updatedPosts));
      } catch (e) {}

      return updatedPosts;
    });

    // 2. Sync like count with Supabase DB
    toggleLikeInDB(post.id, newLikesCount);

    // 3. Points & Targeted notification
    if (newIsLiked) {
      const isSelfLike = currentUser && (
        (currentUser.email && post.author?.email === currentUser.email) ||
        (currentUser.username && post.author?.username === currentUser.username) ||
        (currentUser.name && post.author?.name === currentUser.name)
      );

      if (!isSelfLike) {
        handleRewardPoints(1, 'अन्य रचनाकार की पोस्ट लाइक करने पर');
      }

      const actorName = currentUser?.name || 'आप';
      const actorUsername = currentUser?.username || '@writer';

      const newNotif = {
        id: Date.now(),
        type: 'like',
        actorName,
        actorUsername,
        actorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        title: `आपने ${post.author?.name || 'लेखक'} की रचना '${post.title}' को लाइक किया! ❤️`,
        desc: `रचना पर नई लाइक दर्ज की गई। (+1 Pt)`,
        time: 'अभी-अभी',
        isUnread: true
      };

      setNotificationsList(prev => {
        const updated = [newNotif, ...prev];
        try { localStorage.setItem('bolteekalam_notifications_v1', JSON.stringify(updated)); } catch(e){}
        return updated;
      });
      setUnreadNotifications(prev => {
        const updated = prev + 1;
        try { localStorage.setItem('bolteekalam_unread_notifications_v1', String(updated)); } catch(e){}
        return updated;
      });
    }
  };

  const handleAddCommentToPost = (postId, commentObj) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    // Save to persistent localStorage comments map
    try {
      const storedCommentsMap = localStorage.getItem('bolteekalam_saved_comments_v1');
      let commentsMap = storedCommentsMap ? JSON.parse(storedCommentsMap) : {};
      const pIdStr = String(postId);
      const cleanId = pIdStr.replace(/^post-/, '');
      const existing = commentsMap[pIdStr] || commentsMap[cleanId] || [];
      const updatedList = [commentObj, ...existing];
      commentsMap[pIdStr] = updatedList;
      commentsMap[cleanId] = updatedList;
      localStorage.setItem('bolteekalam_saved_comments_v1', JSON.stringify(commentsMap));
    } catch (e) {}

    setPosts(prevPosts => {
      const updatedPosts = prevPosts.map(p => {
        if (p.id === postId || String(p.id) === String(postId)) {
          const currentComments = p.comments || [];
          return {
            ...p,
            comments: [commentObj, ...currentComments]
          };
        }
        return p;
      });

      try {
        localStorage.setItem('bolteekalam_global_shared_public_posts_v2', JSON.stringify(updatedPosts));
      } catch (e) {}

      return updatedPosts;
    });

    handleRewardPoints(1, 'टिप्पणी (Comment) करने पर');

    const actorName = currentUser?.name || 'आप';
    const actorUsername = currentUser?.username || '@writer';

    const commentNotif = {
      id: Date.now(),
      type: 'comment',
      actorName,
      actorUsername,
      actorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      title: `आपने रचना पर टिप्पणी की! 💬`,
      desc: `"${commentObj.content || 'नई टिप्पणी'}" (+1 Pt)`,
      time: 'अभी-अभी',
      isUnread: true
    };

    setNotificationsList(prev => {
      const updated = [commentNotif, ...prev];
      try { localStorage.setItem('bolteekalam_notifications_v1', JSON.stringify(updated)); } catch(e){}
      return updated;
    });
    setUnreadNotifications(prev => {
      const updated = prev + 1;
      try { localStorage.setItem('bolteekalam_unread_notifications_v1', String(updated)); } catch(e){}
      return updated;
    });
  };

  // Safe Membership Card Trigger (Requires Auth)
  const handleOpenMembershipCard = () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    setShowGlobalMembershipModal(true);
  };

  // YouTube Task Modal & Handlers
  const handleOpenYouTubeTask = () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    setShowYouTubeTaskModal(true);
  };

  const handleSubmitYouTubeProof = (proofData) => {
    setYoutubeProofs(prev => {
      const updated = [proofData, ...prev];
      try {
        localStorage.setItem('bolteekalam_youtube_proofs_v1', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleApproveYouTubeProof = (proof) => {
    setYoutubeProofs(prev => {
      const updated = prev.map(p => p.id === proof.id ? { ...p, status: 'approved' } : p);
      try {
        localStorage.setItem('bolteekalam_youtube_proofs_v1', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    handleRewardPoints(10, 'यूट्यूब लाइक/कमेंट टास्क अप्रूव होने पर (+10 Pts)');
    alert(`🎉 टास्क स्वीकृत! ${proof.userName} को 10 रिवॉर्ड पॉइंट्स क्रेडिट कर दिए गए हैं।`);
  };

  const handleRejectYouTubeProof = (proof) => {
    setYoutubeProofs(prev => {
      const updated = prev.map(p => p.id === proof.id ? { ...p, status: 'rejected' } : p);
      try {
        localStorage.setItem('bolteekalam_youtube_proofs_v1', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    alert(`टास्क अस्वीकृत कर दिया गया है।`);
  };

  const handlePenaltyYouTubeProof = (proof, penaltyAmount, strikeNum) => {
    const statusKey = penaltyAmount === -50 ? 'penalty50' : 'penalty100';
    setYoutubeProofs(prev => {
      const updated = prev.map(p => p.id === proof.id ? { ...p, status: statusKey } : p);
      try {
        localStorage.setItem('bolteekalam_youtube_proofs_v1', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      localStorage.setItem(`bw_yt_strikes_${proof.userEmail}`, String(strikeNum));
    } catch (e) {}

    handleRewardPoints(penaltyAmount, `यूट्यूब फेक/डुप्लीकेट स्क्रीनशॉट पेनल्टी (${penaltyAmount} Pts) • Strike ${strikeNum}`);
    alert(`⚠️ पेनल्टी लागू! ${proof.userName} के वॉलेट से ${Math.abs(penaltyAmount)} पॉइंट्स माइनस कर दिए गए हैं (Strike ${strikeNum}/3)।`);
  };

  const handleBanUserFromYouTube = (proof) => {
    setYoutubeProofs(prev => {
      const updated = prev.map(p => p.id === proof.id ? { ...p, status: 'banned' } : p);
      try {
        localStorage.setItem('bolteekalam_youtube_proofs_v1', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      localStorage.setItem(`bw_yt_banned_${proof.userEmail}`, 'true');
      localStorage.setItem(`bw_yt_strikes_${proof.userEmail}`, '3');
    } catch (e) {}

    alert(`🚫 ब्लॉक सफल! ${proof.userName} को यूट्यूब टास्क से स्थायी रूप से ब्लॉक कर दिया गया है।`);
  };

  const handleYouTubeVisit = () => {
    window.open('https://www.youtube.com/@bolteekalam', '_blank');
    if (currentUser) {
      const visitedKey = `yt_visited_${currentUser.email || 'user'}`;
      if (!localStorage.getItem(visitedKey)) {
        localStorage.setItem(visitedKey, 'true');
        handleRewardPoints(25, 'यूट्यूब चैनल विजिट करने पर (+25 Pts)');
      }
    }
  };

  // 2. Strict Auth Gatekeeper Helper
  const requireAuth = (actionCallback) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return false;
    }
    if (actionCallback) actionCallback();
    return true;
  };

  // 3. Real-time Points Ledger System, Passbook Logging & Toast Notification
  const handleRewardPoints = (amount, reason) => {
    setUserProfile(prev => {
      const currentPts = prev.points || 0;
      const updated = {
        ...prev,
        points: Math.max(0, currentPts + amount)
      };
      localStorage.setItem('bolteekalam_user_profile', JSON.stringify(updated));
      return updated;
    });

    const isDebit = amount < 0;
    const txObj = {
      id: Date.now(),
      type: isDebit ? 'debit' : 'credit',
      amount: Math.abs(amount),
      reason: reason || (isDebit ? 'पॉइंट्स उपयोग' : 'रिवॉर्ड पॉइंट्स प्राप्त'),
      time: 'अभी-अभी'
    };

    setWalletTransactions(prev => {
      const updatedList = [txObj, ...(prev || [])].slice(0, 50);
      try {
        localStorage.setItem('bolteekalam_wallet_transactions', JSON.stringify(updatedList));
      } catch (e) {}
      return updatedList;
    });

    setUnreadNotifications(prev => prev + 1);

    setPointsToast({ amount, reason });
    setTimeout(() => {
      setPointsToast(null);
    }, 4000);
  };

  // Buy Points Recharge Store Handler with Razorpay Payment Verification
  const handleRechargePoints = (rupees, points, paymentId) => {
    const payRef = paymentId ? ` (Razorpay: ${paymentId})` : '';
    handleRewardPoints(points, `₹${rupees} रीचार्ज पैक - ${points} Points Credit${payRef}`);
    alert(`🎉 भुगतान सफल! ₹${rupees} का पेमेंट रेजरपे द्वारा सत्यापित हुआ। आपके वॉलेट में ${points} रिवॉर्ड पॉइंट्स क्रेडिट कर दिए गए हैं!`);
  };

  // 4. Handle Successful Login & Store Session Permanently
  const handleLoginSuccess = (userObj, isDirectLogin = false) => {
    setCurrentUser(userObj);
    localStorage.setItem('bolteekalam_active_user', JSON.stringify(userObj));

    const userEmail = userObj.email || '';
    const storedPhone = localStorage.getItem(`user_phone_${userEmail}`);
    const storedDob = localStorage.getItem(`user_dob_${userEmail}`);

    let currentSavedPoints = 50;
    try {
      const savedProf = localStorage.getItem('bolteekalam_user_profile');
      if (savedProf) {
        const parsed = JSON.parse(savedProf);
        if (parsed.points !== undefined) currentSavedPoints = parsed.points;
      }
    } catch (e) {}

    const targetPoints = Math.max(currentSavedPoints, userObj.points || 0);

    const updatedProf = {
      ...userProfile,
      name: userObj.name || userProfile.name,
      email: userEmail,
      phone: storedPhone || userObj.phone || userProfile.phone,
      birthday: storedDob || userObj.birthday || userProfile.birthday || '03 अगस्त 2026',
      username: userObj.username || userProfile.username,
      avatar: userObj.avatar || userProfile.avatar,
      city: userObj.city || userProfile.city,
      points: targetPoints
    };

    setUserProfile(updatedProf);
    localStorage.setItem('bolteekalam_user_profile', JSON.stringify(updatedProf));

    setShowAuthModal(false);
    setShowFirstTimeModal(false);

    // If new account signup, open the 6-Month Membership Card immediately!
    if (isDirectLogin === true) {
      setShowGlobalMembershipModal(true);
      const bonusKey = `welcome_bonus_given_${userEmail}`;
      const hasGottenBonus = localStorage.getItem(bonusKey) === 'true';
      if (!hasGottenBonus) {
        localStorage.setItem(bonusKey, 'true');
        handleRewardPoints(50, '🎁 नया खाता बनाने पर (Welcome Bonus)');
      }
    } else {
      const currentPath = (window.location.pathname || '/').toLowerCase();
      if (currentPath === '/profile' || window.location.hash === '#/profile') {
        handleNavigateView('profile');
      }
    }
  };

  const handleFirstTimeUserTrigger = (draftUser) => {
    const userEmail = draftUser.email || '';
    const hasCompletedOnboarding = localStorage.getItem(`onboarding_completed_${userEmail}`);

    if (!hasCompletedOnboarding) {
      setPendingFirstTimeUser(draftUser);
      setShowFirstTimeModal(true);
    } else {
      handleLoginSuccess(draftUser, true);
    }
  };

  const handleCompleteFirstTimeProfile = (completedUser) => {
    setCurrentUser(completedUser);
    localStorage.setItem('bolteekalam_active_user', JSON.stringify(completedUser));

    setUserRole('user');
    const userEmail = completedUser.email || '';

    localStorage.setItem('onboarding_completed_global', 'true');
    localStorage.setItem(`onboarding_completed_${userEmail}`, 'true');
    if (completedUser.phone) {
      localStorage.setItem(`user_phone_${userEmail}`, completedUser.phone);
    }
    if (completedUser.birthday) {
      localStorage.setItem(`user_dob_${userEmail}`, completedUser.birthday);
    }

    let currentSavedPoints = 50;
    try {
      const savedProf = localStorage.getItem('bolteekalam_user_profile');
      if (savedProf) {
        const parsed = JSON.parse(savedProf);
        if (parsed.points !== undefined) currentSavedPoints = parsed.points;
      }
    } catch (e) {}

    const updated = {
      ...userProfile,
      name: completedUser.name,
      email: completedUser.email,
      phone: completedUser.phone,
      birthday: completedUser.birthday || userProfile.birthday || '03 अगस्त 2026',
      city: completedUser.city,
      avatar: completedUser.avatar,
      username: completedUser.username || `@${completedUser.name.toLowerCase().replace(/\s+/g, '_')}`,
      points: Math.max(currentSavedPoints + 50, 150),
      followers: 0,
      following: 0,
      streak: 1
    };

    setUserProfile(updated);
    localStorage.setItem('bolteekalam_user_profile', JSON.stringify(updated));
    updateUserProfileInDB(updated, userEmail);

    if (updated.avatar) {
      localStorage.setItem(`custom_avatar_${userEmail}`, updated.avatar);
      localStorage.setItem('custom_avatar_global', updated.avatar);
    }

    // Dynamic Cascade Update across published posts & comments
    setPosts(prevPosts => {
      return prevPosts.map(p => {
        const isUserPost = Boolean(
          (userEmail && p.author?.email && p.author.email.toLowerCase() === userEmail.toLowerCase()) ||
          p.author?.id === 'user-me' ||
          (p.author?.name && updated.name && p.author.name.trim().toLowerCase() === updated.name.trim().toLowerCase()) ||
          (p.author?.username && updated.username && p.author.username.trim().toLowerCase() === updated.username.trim().toLowerCase()) ||
          (p.author?.name && p.author.name.includes('आप'))
        );

        const updatedComments = (p.comments || []).map(c => {
          const isUserComment = Boolean(
            (userEmail && c.authorEmail && c.authorEmail.toLowerCase() === userEmail.toLowerCase()) ||
            (c.authorId === 'user-me') ||
            (c.author && updated.name && c.author.trim().toLowerCase() === updated.name.trim().toLowerCase()) ||
            (c.author && c.author.includes('आप'))
          );

          if (isUserComment) {
            return {
              ...c,
              author: updated.name || c.author,
              authorUsername: updated.username || c.authorUsername,
              avatar: updated.avatar || c.avatar
            };
          }
          return c;
        });

        if (isUserPost) {
          return {
            ...p,
            author: {
              ...p.author,
              name: updated.name || p.author?.name,
              username: updated.username || p.author?.username,
              avatar: updated.avatar || p.author?.avatar,
              email: userEmail
            },
            comments: updatedComments
          };
        }

        return {
          ...p,
          comments: updatedComments
        };
      });
    });

    setShowFirstTimeModal(false);
    setShowAuthModal(false);
    setPendingFirstTimeUser(null);

    // Auto-trigger 6-Month Membership Card popup immediately upon registration completion!
    setShowGlobalMembershipModal(true);

    handleRewardPoints(50, 'प्रथम प्रोफ़ाइल पूर्ण करने पर (Welcome Bonus)');
  };

  const handleSaveProfileAndSyncDB = (updatedProfile) => {
    const userEmail = updatedProfile.email || currentUser?.email || 'user';

    if (updatedProfile.avatar) {
      localStorage.setItem(`custom_avatar_${userEmail}`, updatedProfile.avatar);
      localStorage.setItem('custom_avatar_global', updatedProfile.avatar);
    }

    // 1. Update userProfile state & localStorage
    setUserProfile(updatedProfile);
    localStorage.setItem('bolteekalam_user_profile', JSON.stringify(updatedProfile));

    // 2. Update currentUser state & active user session in localStorage
    const updatedUserObj = {
      ...(currentUser || {}),
      name: updatedProfile.name || currentUser?.name,
      username: updatedProfile.username || currentUser?.username,
      avatar: updatedProfile.avatar || currentUser?.avatar,
      city: updatedProfile.city || currentUser?.city,
      bio: updatedProfile.bio || currentUser?.bio,
      email: userEmail
    };
    setCurrentUser(updatedUserObj);
    localStorage.setItem('bolteekalam_active_user', JSON.stringify(updatedUserObj));

    // 3. Universal Cascade Update across ALL published posts AND nested comments
    setPosts(prevPosts => {
      const updatedPosts = prevPosts.map(p => {
        const isUserPost = Boolean(
          (userEmail && p.author?.email === userEmail) ||
          p.author?.id === 'user-me' ||
          (p.author?.name && updatedProfile.name && p.author.name.trim().toLowerCase() === updatedProfile.name.trim().toLowerCase()) ||
          (p.author?.username && updatedProfile.username && p.author.username.trim().toLowerCase() === updatedProfile.username.trim().toLowerCase()) ||
          (p.author?.name && p.author.name.includes('आप'))
        );

        const updatedComments = (p.comments || []).map(c => {
          const isUserComment = Boolean(
            (userEmail && c.authorEmail === userEmail) ||
            (c.authorId === 'user-me') ||
            (c.author && updatedProfile.name && c.author.trim().toLowerCase() === updatedProfile.name.trim().toLowerCase()) ||
            (c.author && currentUser?.name && c.author.trim().toLowerCase() === currentUser.name.trim().toLowerCase()) ||
            (c.author && c.author.includes('आप'))
          );

          if (isUserComment) {
            return {
              ...c,
              author: updatedProfile.name || c.author,
              authorEmail: userEmail,
              avatar: updatedProfile.avatar || c.avatar
            };
          }
          return c;
        });

        if (isUserPost) {
          return {
            ...p,
            authorName: updatedProfile.name || p.authorName || p.author?.name,
            authorAvatar: updatedProfile.avatar || p.authorAvatar || p.author?.avatar,
            avatar: updatedProfile.avatar || p.avatar || p.author?.avatar,
            author: {
              ...p.author,
              name: updatedProfile.name || p.author?.name,
              username: updatedProfile.username || p.author?.username,
              avatar: updatedProfile.avatar || p.author?.avatar,
              city: updatedProfile.city || p.author?.city
            },
            comments: updatedComments
          };
        }

        return {
          ...p,
          comments: updatedComments
        };
      });

      try {
        localStorage.setItem('bolteekalam_user_created_posts', JSON.stringify(updatedPosts.filter(p => p.author?.id === 'user-me' || p.author?.email === userEmail)));
        localStorage.setItem('bolteekalam_global_shared_posts', JSON.stringify(updatedPosts));
        localStorage.setItem('bolteekalam_global_shared_public_posts_v2', JSON.stringify(updatedPosts));
      } catch (e) {}

      return updatedPosts;
    });

    if (userEmail) {
      if (updatedProfile.phone) {
        localStorage.setItem(`user_phone_${userEmail}`, updatedProfile.phone);
      }
      if (updatedProfile.birthday) {
        localStorage.setItem(`user_dob_${userEmail}`, updatedProfile.birthday);
      }
      updateUserProfileInDB(updatedProfile, userEmail);
    }
  };

  const handleOpenCreatePostProtected = () => {
    setShowCreateModal(true);
  };

  // Single Unified Post Creation Pipeline
  const handlePostCreated = async (newPost) => {
    const authorEmail = currentUser?.email || 'user-anon';
    const authorName = userProfile?.name || 'साहित्य साधक';

    // Verify 5 poems per day limit
    const todayDateStr = new Date().toDateString();
    const todayUserPosts = (posts || []).filter(p => {
      const isMine = p.author?.id === authorEmail || 
                     p.author?.email === authorEmail || 
                     (p.author?.name && userProfile?.name && p.author.name.trim().toLowerCase() === userProfile.name.trim().toLowerCase());
      if (!isMine) return false;
      const postDate = p.timestamp ? new Date(p.timestamp).toDateString() : (p.date ? new Date(p.date).toDateString() : null);
      return postDate === todayDateStr;
    });

    if (todayUserPosts.length >= 5) {
      alert('⚠️ दैनिक सीमा पूर्ण! आप एक दिन में अधिकतम 5 कविताएं ही पोस्ट कर सकते हैं। कृपया कल नई रचना साझा करें।');
      return;
    }

    const authorUsername = userProfile?.username || `@${authorName.toLowerCase().replace(/\s+/g, '_')}`;
    const authorAvatar = userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';
    const authorCity = userProfile?.city || 'प्रयागराज';

    handleRewardPoints(10, 'नई साहित्य रचना पोस्ट करने पर');

    // 1. Process / Upload Image to Supabase Storage CDN first if available
    let cdnImageUrl = newPost.imageUrl || newPost.image || null;
    if (cdnImageUrl && cdnImageUrl.startsWith('data:image')) {
      try {
        cdnImageUrl = await uploadImageToSupabaseStorage(cdnImageUrl, `poster_${Date.now()}`);
      } catch (e) {
        console.warn('Storage upload error fallback:', e);
      }
    }

    // 2. Save Post into DB with image URL attached
    const createdDBPost = await createPostInDB({
      id: newPost.id,
      title: newPost.title,
      category: newPost.category,
      content: newPost.content,
      imageUrl: cdnImageUrl,
      image: cdnImageUrl,
      tags: newPost.tags,
      authorName,
      authorUsername,
      authorAvatar,
      authorEmail
    }, authorEmail);

    const postToSave = {
      ...newPost,
      ...(createdDBPost || {}),
      imageUrl: cdnImageUrl || newPost.imageUrl || newPost.image || createdDBPost?.imageUrl || createdDBPost?.image || null,
      image: cdnImageUrl || newPost.imageUrl || newPost.image || createdDBPost?.imageUrl || createdDBPost?.image || null,
      author: {
        id: authorEmail,
        email: authorEmail,
        name: authorName,
        username: authorUsername,
        avatar: authorAvatar,
        badge: 'verifiedAuthor',
        city: authorCity
      }
    };

    // Save to IndexedDB (Unlimited Browser Storage - Solves 5MB localStorage limit)
    savePostToIndexedDB(postToSave);

    setPosts(prev => {
      const filtered = prev.filter(p => 
        String(p.id) !== String(postToSave.id) && 
        String(p.id) !== String(newPost.id) &&
        !(p.title === postToSave.title && p.content === postToSave.content)
      );
      return [postToSave, ...filtered];
    });

    try {
      const savedGlobal = localStorage.getItem('bolteekalam_global_shared_public_posts_v2') || localStorage.getItem('bolteekalam_global_shared_posts');
      const existingGlobal = savedGlobal ? JSON.parse(savedGlobal) : [];
      const filteredGlobal = existingGlobal.filter(p => String(p.id) !== String(postToSave.id) && !(p.title === postToSave.title && p.content === postToSave.content));
      const updatedGlobalList = [postToSave, ...filteredGlobal];
      localStorage.setItem('bolteekalam_global_shared_public_posts_v2', JSON.stringify(updatedGlobalList));
      localStorage.setItem('bolteekalam_global_shared_posts', JSON.stringify(updatedGlobalList));
    } catch (e) {
      console.error("Global storage save error:", e);
    }

    try {
      const savedUserPosts = localStorage.getItem('bolteekalam_user_created_posts');
      const existingUserPosts = savedUserPosts ? JSON.parse(savedUserPosts) : [];
      const filteredUser = existingUserPosts.filter(p => String(p.id) !== String(postToSave.id) && !(p.title === postToSave.title && p.content === postToSave.content));
      const updatedUserList = [postToSave, ...filteredUser];
      localStorage.setItem('bolteekalam_user_created_posts', JSON.stringify(updatedUserList));
    } catch (e) {
      console.error("User storage save error:", e);
    }
  };

  const handleSavePost = (updatedPost) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));

    try {
      const savedUserPosts = localStorage.getItem('bolteekalam_user_created_posts');
      if (savedUserPosts) {
        const existingUserPosts = JSON.parse(savedUserPosts);
        const updatedUserPosts = existingUserPosts.map(p => p.id === updatedPost.id ? updatedPost : p);
        localStorage.setItem('bolteekalam_user_created_posts', JSON.stringify(updatedUserPosts));
      }
    } catch (e) {}
  };

  const handleDeletePost = (postId) => {
    const pIdStr = String(postId);

    try {
      const storedDeleted = localStorage.getItem('bolteekalam_deleted_post_ids');
      const deletedList = storedDeleted ? JSON.parse(storedDeleted) : [];
      if (!deletedList.includes(pIdStr)) {
        deletedList.push(pIdStr);
        localStorage.setItem('bolteekalam_deleted_post_ids', JSON.stringify(deletedList));
      }
    } catch (e) {}

    setPosts(prev => prev.filter(p => String(p.id) !== pIdStr));
    deletePostFromDB(postId);
  };

  const handleFollowAuthor = (authorObj, isFollowingState, newFollowersCount) => {
    if (!authorObj) return;
    const authorKey = authorObj.email || authorObj.username || authorObj.name;
    
    try {
      const storedFollowed = localStorage.getItem('bolteekalam_user_followed_authors');
      let followedList = storedFollowed ? JSON.parse(storedFollowed) : [];
      if (isFollowingState) {
        if (!followedList.includes(authorKey)) followedList.push(authorKey);
      } else {
        followedList = followedList.filter(k => k !== authorKey);
      }
      localStorage.setItem('bolteekalam_user_followed_authors', JSON.stringify(followedList));
    } catch (e) {}

    setPosts(prevPosts => {
      const updatedPosts = prevPosts.map(p => {
        const isMatch = (authorObj.email && p.author?.email === authorObj.email) ||
          (authorObj.username && p.author?.username === authorObj.username) ||
          (authorObj.name && p.author?.name === authorObj.name);

        if (isMatch) {
          return {
            ...p,
            author: {
              ...p.author,
              isFollowing: isFollowingState,
              followers: newFollowersCount
            }
          };
        }
        return p;
      });

      try {
        localStorage.setItem('bolteekalam_global_shared_public_posts_v2', JSON.stringify(updatedPosts));
      } catch (e) {}

      return updatedPosts;
    });

    if (isFollowingState) {
      handleRewardPoints(5, `${authorObj.name || 'लेखक'} को फ़ॉलो करने पर`);

      const followNotif = {
        id: Date.now(),
        type: 'follow',
        title: `आपने ${authorObj.name || 'कवि'} को फ़ॉलो किया! 👤`,
        desc: `नई साहित्यिक रचनाएँ आपकी टाइमलाइन में दिखने लगेंगी। (+5 Pts)`,
        time: 'अभी-अभी',
        isUnread: true
      };

      setNotificationsList(prev => {
        const updated = [followNotif, ...prev];
        try { localStorage.setItem('bolteekalam_notifications_v1', JSON.stringify(updated)); } catch(e){}
        return updated;
      });
      setUnreadNotifications(prev => {
        const updated = prev + 1;
        try { localStorage.setItem('bolteekalam_unread_notifications_v1', String(updated)); } catch(e){}
        return updated;
      });
    }
  };

  const handleToggleArchivePost = (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const updatedArchived = !p.isArchived;
        archivePostInDB(p.id, p.content, p.author, updatedArchived);
        return { ...p, isArchived: updatedArchived };
      }
      return p;
    }));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserRole('user');
    localStorage.removeItem('bolteekalam_active_user');
    handleNavigateView('feed');
  };

  const openCertificateModal = (type, titleStr = 'काव्य शिरोमणि सम्मान 2026') => {
    setCertificateData({
      userName: userProfile.name,
      awardType: type === 'battle' ? 'काव्य संग्राम विजेता' : type === 'challenge' ? 'साप्ताहिक चुनौती विजेता' : 'वर्ष का श्रेष्ठ कवि',
      title: titleStr,
      points: userProfile.points || 500,
      issueDate: '03 अगस्त 2026'
    });
  };

  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
    setActiveView('search');
  };

  const handleSubscribeYouTube = () => {
    handleRewardPoints(20, 'यूट्यूब चैनल सब्सक्राइब करने पर');
    window.open('https://www.youtube.com/@bolteekalam', '_blank');
  };

  const handlePublishPosterPost = (posterData) => {
    handleRewardPoints(-15, 'मंच पर इमेज़ पोस्टर पोस्ट करने पर');

    const postPayload = {
      title: posterData.title || 'कवि इमेज़ पोस्टर',
      category: 'कविता',
      content: posterData.content || '',
      imageUrl: posterData.imageUrl || null,
      authorName: userProfile?.name || 'साहित्य साधक',
      authorUsername: userProfile?.username || '@writer',
      authorAvatar: userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      authorEmail: currentUser?.email || userProfile?.email || ''
    };

    handlePostCreated(postPayload);
    handleNavigateView('feed');
    alert('🎉 आपकी इमेज़ पोस्टर पोस्ट सफलतापूर्वक मंच पर लाइव हो गई है! (-15 Points)');
  };

  return (
    <div className={`min-h-screen ${activeFestivalTheme?.pageBgClass || 'bg-slate-50 dark:bg-slate-950'} text-slate-900 dark:text-slate-100 flex flex-col font-inter transition-colors duration-500 relative overflow-hidden`}>
      
      {/* 🎈 Floating Tricolor Balloons & Ambient Overlay for 15 August Special */}
      {activeFestivalTheme?.id === 'independenceDay' && (
        <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden opacity-80 select-none">
          {/* Left Side Floating Balloons */}
          <div className="absolute top-24 left-4 flex flex-col items-center animate-bounce duration-1000">
            <span className="text-3xl filter drop-shadow">🟠</span>
            <span className="text-2xl filter drop-shadow -mt-2">⚪</span>
            <span className="text-3xl filter drop-shadow -mt-2">🟢</span>
            <div className="w-0.5 h-12 bg-slate-400/40" />
          </div>

          {/* Right Side Floating Balloons */}
          <div className="absolute top-36 right-4 flex flex-col items-center animate-bounce duration-700">
            <span className="text-3xl filter drop-shadow">🟠</span>
            <span className="text-2xl filter drop-shadow -mt-2">⚪</span>
            <span className="text-3xl filter drop-shadow -mt-2">🟢</span>
            <div className="w-0.5 h-16 bg-slate-400/40" />
          </div>

          {/* Bottom Floating Balloons */}
          <div className="absolute bottom-16 left-8 flex flex-col items-center animate-pulse">
            <span className="text-2xl filter drop-shadow">🎈</span>
          </div>
          <div className="absolute bottom-24 right-8 flex flex-col items-center animate-pulse">
            <span className="text-2xl filter drop-shadow">🎈</span>
          </div>
        </div>
      )}
      
      {/* Top Floating Toast Notification for Points Reward */}
      {pointsToast && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top duration-300 border border-emerald-400">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
            🎁
          </div>
          <div>
            <div className="font-extrabold text-sm flex items-center gap-1">
              <span>+{pointsToast.amount} Pts अर्जित!</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div className="text-[11px] text-emerald-100 font-semibold">
              {pointsToast.reason}
            </div>
          </div>
        </div>
      )}

      {/* Top Main Navigation Bar */}
      <Navbar
        onOpenCreatePost={handleOpenCreatePostProtected}
        currentUser={currentUser}
        userRole={userRole}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        activeView={activeView}
        setActiveView={handleNavigateView}
        notificationsList={notificationsList}
        unreadNotifications={unreadNotifications}
        setUnreadNotifications={setUnreadNotifications}
        onSearchSubmit={handleSearchSubmit}
        userPoints={userProfile?.points || 0}
        onOpenMembershipCard={handleOpenMembershipCard}
        onOpenYouTube={handleYouTubeVisit}
        onOpenInstallApp={() => setShowInstallModal(true)}
      />

      {/* Main Layout Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 flex gap-6 pb-24 md:pb-6">
        
        {/* Left Sidebar Navigation (Desktop) */}
        <Sidebar
          activeView={activeView}
          setActiveView={handleNavigateView}
          userRole={userRole}
          setUserRole={setUserRole}
          onOpenCreatePost={handleOpenCreatePostProtected}
          onOpenReferEarn={() => requireAuth(() => setShowReferEarnModal(true))}
          onOpenYouTube={handleYouTubeVisit}
          userPoints={userProfile?.points || 0}
          currentUser={currentUser}
          userProfile={userProfile}
          onOpenAuthModal={() => setShowAuthModal(true)}
          onOpenInstallApp={() => setShowInstallModal(true)}
        />

        {/* Middle Main Content View Area */}
        <main className="flex-1 min-w-0">
          {/* Top Battlefield Invitation Notification Strip */}
          {(() => {
            try {
              const pending = JSON.parse(localStorage.getItem('bolteekalam_pending_challenges_v2') || '[]');
              if (Array.isArray(pending) && pending.length > 0) {
                const latestCh = pending[0];
                return (
                  <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-600 via-rose-600 to-rose-800 text-white shadow-lg flex items-center justify-between flex-wrap gap-3 border border-amber-400/40 animate-pulse">
                    <div className="flex items-center gap-2.5">
                      <Swords className="w-5 h-5 text-amber-300 shrink-0" />
                      <span className="text-xs font-bold font-tiro">
                        ⚔️ <strong>{latestCh.challengerName}</strong> ने आपको 1-on-1 काव्य संग्राम बैटलफील्ड के लिए आमंत्रित किया है! [विषय: {latestCh.topic}]
                      </span>
                    </div>
                    <button
                      onClick={() => handleNavigateView('battles')}
                      className="px-3.5 py-1.5 rounded-xl bg-white text-rose-900 font-extrabold text-[11px] hover:bg-amber-100 shadow transition active:scale-95 shrink-0"
                    >
                      बैटलफील्ड देखें (View Invitation)
                    </button>
                  </div>
                );
              }
            } catch (e) {}
            return null;
          })()}
          {activeView === 'feed' && (
            <HomeFeedView
              posts={posts}
              weeklyChallenge={weeklyChallenge}
              patrioticBanner={patrioticBanner}
              onOpenCreatePost={handleOpenCreatePostProtected}
              onOpenCertificate={openCertificateModal}
              onRewardPoints={handleRewardPoints}
              onOpenAuthorProfile={handleOpenAuthorProfile}
              onOpenPoetryChallenge={handleOpenPoetryChallenge}
              onLikePost={handleLikePost}
              onAddComment={handleAddCommentToPost}
              onFollowAuthor={handleFollowAuthor}
              onOpenMembershipCard={handleOpenMembershipCard}
              onOpenYouTubeTask={handleOpenYouTubeTask}
              onYouTubeVisit={handleYouTubeVisit}
              userProfile={userProfile}
              requireAuth={requireAuth}
              setActiveView={handleNavigateView}
              activeFestivalTheme={activeFestivalTheme}
              authorProfileMap={authorProfileMap}
            />
          )}

          {activeView === 'daily' && (
            <DailyChallengeView
              weeklyChallenge={weeklyChallenge}
              onOpenCreatePost={handleOpenCreatePostProtected}
              onRewardPoints={handleRewardPoints}
              requireAuth={requireAuth}
            />
          )}

          {activeView === 'battles' && (
            <PoetryBattlesView
              onRewardPoints={handleRewardPoints}
              onOpenCreatePost={handleOpenCreatePostProtected}
              onOpenPoetryChallenge={handleOpenPoetryChallenge}
              currentUser={currentUser}
              userProfile={userProfile}
              posts={posts}
              registeredUsers={posts.map(p => ({
                id: p.author?.id || p.id,
                name: p.author?.name || p.authorName || 'साहित्यिक लेखक',
                username: p.author?.username || '@writer',
                avatar: p.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
              }))}
              requireAuth={requireAuth}
            />
          )}

          {activeView === 'competitions' && (
            <CompetitionsView 
              competitions={mockCompetitions} 
              onRewardPoints={handleRewardPoints}
            />
          )}

          {activeView === 'events' && (
            <EventsView 
              events={mockEvents}
              onOpenCertificate={openCertificateModal}
              onSubscribeYouTube={() => requireAuth(handleSubscribeYouTube)}
            />
          )}

          {activeView === 'leaderboard' && (
            <LeaderboardView />
          )}

          {activeView === 'posterStudio' && (
            <PosterStudioView
              userProfile={userProfile}
              onRewardPoints={handleRewardPoints}
              onPublishPosterPost={handlePublishPosterPost}
              requireAuth={requireAuth}
              setActiveView={handleNavigateView}
            />
          )}

          {activeView === 'magazine' && (
            <MagazineView onOpenMagazine={() => setShowMagazineModal(true)} />
          )}

          {activeView === 'audioStories' && (
            <AudioStoriesView setActiveView={handleNavigateView} />
          )}

          {(activeView === 'profile' || activeView === 'certificates') && (
            <ProfileView
              posts={posts.filter(p => 
                p.author?.id === currentUser?.email || 
                p.author?.email === currentUser?.email ||
                p.author?.id === 'user-me' ||
                (p.author?.name && userProfile?.name && p.author.name.trim().toLowerCase() === userProfile.name.trim().toLowerCase()) ||
                (p.author?.username && userProfile?.username && p.author.username.trim().toLowerCase() === userProfile.username.trim().toLowerCase()) ||
                p.author?.name?.includes('आप')
              )}
              userProfile={userProfile}
              walletTransactions={walletTransactions}
              initialTab={activeView === 'certificates' ? 'certificates' : profileInitialTab}
              onOpenMembershipCard={handleOpenMembershipCard}
              onRechargePoints={handleRechargePoints}
              onOpenCertificate={openCertificateModal}
              onOpenEditProfile={() => setShowEditProfileModal(true)}
              onOpenReferEarn={() => setShowReferEarnModal(true)}
              onEditPost={(p) => setEditingPost(p)}
              onDeletePost={handleDeletePost}
              onToggleArchivePost={handleToggleArchivePost}
              onLikePost={handleLikePost}
              onAddComment={handleAddCommentToPost}
              onFollowAuthor={handleFollowAuthor}
              requireAuth={requireAuth}
            />
          )}

          {activeView === 'admin' && (
            <AdminDashboardView
              posts={posts}
              setPosts={setPosts}
              userProfile={userProfile}
              setUserProfile={setUserProfile}
              weeklyChallenge={weeklyChallenge}
              setWeeklyChallenge={setWeeklyChallenge}
              patrioticBanner={patrioticBanner}
              setPatrioticBanner={setPatrioticBanner}
              activeFestivalTheme={activeFestivalTheme}
              onUpdateFestivalTheme={handleUpdateFestivalTheme}
              youtubeProofs={youtubeProofs}
              onApproveProof={handleApproveYouTubeProof}
              onRejectProof={handleRejectYouTubeProof}
              onPenaltyProof={handlePenaltyYouTubeProof}
              onBanUserFromYouTube={handleBanUserFromYouTube}
            />
          )}

          {activeView === 'search' && (
            <SearchResultsView
              query={searchQuery}
              posts={posts}
              onOpenCertificate={openCertificateModal}
            />
          )}

          {activeView === 'festival' && (
            <FestivalView
              setActiveView={handleNavigateView}
              activeFestivalTheme={activeFestivalTheme}
            />
          )}
        </main>

        {/* Right Sidebar Column (Dynamic real authors & posts) */}
        <RightSidebar
          posts={posts}
          currentUser={currentUser}
          userProfile={userProfile}
          onOpenCreatePost={handleOpenCreatePostProtected}
          setActiveView={handleNavigateView}
        />
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeView={activeView}
        setActiveView={handleNavigateView}
        onOpenCreatePost={handleOpenCreatePostProtected}
      />

      {/* Modals & Dialogs */}
      <AdminAuthModal
        isOpen={showAdminAuthModal}
        onClose={() => setShowAdminAuthModal(false)}
        onAdminLoginSuccess={() => {
          setUserRole('admin');
          try { sessionStorage.setItem('bolteekalam_admin_authenticated', 'true'); } catch (e) {}
          setActiveView('admin');
          try { history.pushState(null, '', '/admin'); } catch (e) {}
        }}
      />
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
        onFirstTimeUser={handleFirstTimeUserTrigger}
      />

      <FirstTimeUserModal
        isOpen={showFirstTimeModal}
        onClose={() => setShowFirstTimeModal(false)}
        onSaveProfile={handleCompleteFirstTimeProfile}
        initialData={pendingFirstTimeUser}
      />

      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPostCreated={handlePostCreated}
        userProfile={userProfile}
        posts={posts}
      />

      {editingPost && (
        <EditPostModal
          isOpen={true}
          onClose={() => setEditingPost(null)}
          post={editingPost}
          onSave={handleSavePost}
        />
      )}

      {showEditProfileModal && (
        <EditProfileModal
          isOpen={true}
          onClose={() => setShowEditProfileModal(false)}
          userProfile={userProfile}
          onSaveProfile={handleSaveProfileAndSyncDB}
        />
      )}

      {showGlobalMembershipModal && (
        <LiteraryMembershipCardModal
          isOpen={true}
          onClose={() => setShowGlobalMembershipModal(false)}
          userProfile={userProfile}
        />
      )}

      {showYouTubeTaskModal && (
        <YouTubeTaskModal
          isOpen={true}
          onClose={() => setShowYouTubeTaskModal(false)}
          currentUser={currentUser}
          userProfile={userProfile}
          onSubmitProof={handleSubmitYouTubeProof}
          allProofs={youtubeProofs}
        />
      )}

      {showReferEarnModal && (
        <ReferEarnModal
          isOpen={true}
          onClose={() => setShowReferEarnModal(false)}
          userProfile={userProfile}
          onRewardPoints={handleRewardPoints}
        />
      )}

      {showYouTubeModal && (
        <YouTubeSubscribeModal
          isOpen={true}
          onClose={() => setShowYouTubeModal(false)}
          onSubscribeSuccess={handleSubscribeYouTube}
        />
      )}

      {showMagazineModal && (
        <MagazineViewerModal
          isOpen={true}
          onClose={() => setShowMagazineModal(false)}
        />
      )}

      {certificateData && (
        <CertificateGenerator
          isOpen={true}
          onClose={() => setCertificateData(null)}
          certificateData={certificateData}
          onOpenCreatePost={handleOpenCreatePostProtected}
          userPoints={userProfile?.points || 0}
        />
      )}

      {/* 🔴 Author Public Profile Modal */}
      {showPublicProfileModal && selectedAuthor && (
        <PublicProfileModal
          isOpen={true}
          onClose={handleCloseAuthorProfile}
          author={selectedAuthor}
          authorPosts={posts.filter(p => 
            (p.author?.name && selectedAuthor?.name && p.author.name.trim().toLowerCase() === selectedAuthor.name.trim().toLowerCase()) ||
            (p.author?.username && selectedAuthor?.username && p.author.username.trim().toLowerCase() === selectedAuthor.username.trim().toLowerCase())
          )}
          onOpenCertificate={openCertificateModal}
        />
      )}

      {/* 🔴 Poetry Battle Challenge Modal */}
      {showPoetryChallengeModal && (
        <PoetryBattleChallengeModal
          isOpen={true}
          onClose={() => setShowPoetryChallengeModal(false)}
          targetAuthor={poetryChallengeTarget}
          onSubmitChallenge={(challengeData) => {
            handleRewardPoints(15, 'कवि को चुनौती भेजने पर');
            setShowPoetryChallengeModal(false);
            setPointsToast({ amount: 15, reason: 'कवि को चुनौती भेजी गई! 🔥' });
          }}
          onCreateChallenge={(challengeData) => {
            handleRewardPoints(15, 'कवि को चुनौती भेजने पर');
            setShowPoetryChallengeModal(false);
            setPointsToast({ amount: 15, reason: 'कवि को चुनौती भेजी गई! 🔥' });
          }}
        />
      )}

      {/* PWA Mobile App Download & Install Modal */}
      <PWAInstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        deferredPrompt={deferredPrompt}
      />

      {/* Startup Animated Logo Splash Screen */}
      {showSplash && (
        <SplashScreen 
          onFinish={() => {
            setShowSplash(false);
            try { sessionStorage.setItem('bolteekalam_splash_shown', 'true'); } catch (e) {}
          }} 
          duration={2500}
        />
      )}

    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React ErrorBoundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-950 text-white text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-600/20 border border-rose-500 flex items-center justify-center text-rose-500 text-2xl font-bold">
            ⚠️
          </div>
          <h1 className="text-xl font-bold font-rozha text-amber-300">
            बोलती कलम (bolateeworld.in)
          </h1>
          <p className="text-sm text-slate-300 max-w-md">
            वेबसाइट लोड करने में समस्या आई है।
          </p>

          {this.state.error && (
            <div className="p-3 rounded-xl bg-slate-900 border border-rose-500/30 text-rose-300 text-xs font-mono max-w-lg overflow-x-auto text-left">
              {this.state.error.toString()}
            </div>
          )}

          <button
            onClick={() => {
              try {
                localStorage.clear();
              } catch (e) {}
              window.location.href = '/';
            }}
            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-lg transition active:scale-95"
          >
            🔄 रीफ्रेश करें (Clear Local Storage & Reset App)
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
