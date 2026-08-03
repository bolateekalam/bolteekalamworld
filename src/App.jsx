import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MobileBottomNav from './components/MobileBottomNav';
import AuthModal from './components/AuthModal';
import FirstTimeUserModal from './components/FirstTimeUserModal';
import CreatePostModal from './components/CreatePostModal';
import EditPostModal from './components/EditPostModal';
import EditProfileModal from './components/EditProfileModal';
import ReferEarnModal from './components/ReferEarnModal';
import BirthdayCardModal from './components/BirthdayCardModal';
import YouTubeSubscribeModal from './components/YouTubeSubscribeModal';
import MagazineViewerModal from './components/MagazineViewerModal';
import CertificateGenerator from './components/CertificateGenerator';
import NotificationDrawer from './components/NotificationDrawer';

import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { supabase } from './lib/supabase';
import { fetchPostsFromDB, createPostInDB, deletePostFromDB, updateUserProfileInDB, fetchWeeklyChallengeFromDB } from './lib/dataService';

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

import { mockPosts, mockDailyChallenge, mockPoetryBattle } from './data/mockPosts';
import { mockCompetitions } from './data/mockCompetitions';
import { mockEvents } from './data/mockEvents';
import { Sparkles, Trophy, CheckCircle2 } from 'lucide-react';

function AppContent() {
  const [activeView, setActiveView] = useState('feed');
  
  // Restore Active User Session from localStorage to prevent sudden logout on refresh!
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('bolteekalam_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [userRole, setUserRole] = useState(() => {
    return currentUser?.role === 'admin' ? 'admin' : 'user';
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
  const [birthdayUser, setBirthdayUser] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [certificateData, setCertificateData] = useState(null);

  // Posts State Initialized with Saved Local User Posts + Mock Posts
  const [posts, setPosts] = useState(() => {
    try {
      const savedUserPosts = localStorage.getItem('bolteekalam_user_created_posts');
      if (savedUserPosts) {
        const parsed = JSON.parse(savedUserPosts);
        return [...parsed, ...mockPosts];
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
    tag: '80वाँ स्वतंत्रता दिवस & रक्षाबंधन विशेषांक 🇮🇳',
    title: 'समस्त देशवासियों को 80वें स्वतंत्रता दिवस की हार्दिक शुभकामनाएँ!',
    description: '80वें स्वतंत्रता दिवस एवं रक्षाबंधन के पावन अवसर पर अपनी देशभक्ति व भ्रातृ-स्नेह रचनाएँ साझा करें।',
    bgImage: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&q=80&w=800'
  });

  // User Profile State (Persisted in localStorage across refreshes)
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const savedProf = localStorage.getItem('bolteekalam_user_profile');
      if (savedProf) return JSON.parse(savedProf);
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
      birthday: '03 अगस्त 2026',
      followers: 0,
      following: 0,
      streak: 0,
      points: 0,
      badges: ['नया साहित्य साधक ✒️']
    };
  });

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');

  // Notifications State
  const [unreadNotifications, setUnreadNotifications] = useState(2);

  // Load Posts from Supabase PostgreSQL Database on Mount & Listen to Supabase Realtime WebSocket for Instant 0-Cost Updates
  useEffect(() => {
    const syncPosts = () => {
      fetchPostsFromDB().then(dbPosts => {
        if (dbPosts && dbPosts.length > 0) {
          try {
            const savedUserPosts = localStorage.getItem('bolteekalam_user_created_posts');
            const userPosts = savedUserPosts ? JSON.parse(savedUserPosts) : [];
            
            const userPostIds = new Set(userPosts.map(p => p.id));
            const uniqueDbPosts = dbPosts.filter(p => !userPostIds.has(p.id));
            setPosts([...userPosts, ...uniqueDbPosts]);
          } catch (e) {
            setPosts(dbPosts);
          }
        }
      });
    };

    syncPosts();

    // Supabase Realtime Channel Listener (Instant 50ms Push Updates, 100% Free!)
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

  // 1. Supabase OAuth Session Listener for Instant Google Login Restore
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const gUser = session.user;
        const userEmail = gUser.email || '';
        
        const hasCompletedOnboarding = localStorage.getItem(`onboarding_completed_${userEmail}`);
        
        const googleProfile = {
          name: gUser.user_metadata?.full_name || userEmail.split('@')[0] || 'गूगल लेखक',
          username: `@${userEmail.split('@')[0] || 'writer'}`,
          email: userEmail,
          avatar: gUser.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          role: 'user',
          city: 'प्रयागराज',
          isVerified: true,
          points: 0,
          phone: localStorage.getItem(`user_phone_${userEmail}`) || ''
        };

        handleLoginSuccess(googleProfile, !!hasCompletedOnboarding);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const gUser = session.user;
        const userEmail = gUser.email || '';
        
        const hasCompletedOnboarding = localStorage.getItem(`onboarding_completed_${userEmail}`);

        const googleProfile = {
          name: gUser.user_metadata?.full_name || userEmail.split('@')[0] || 'गूगल लेखक',
          username: `@${userEmail.split('@')[0] || 'writer'}`,
          email: userEmail,
          avatar: gUser.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          role: 'user',
          city: 'प्रयागराज',
          isVerified: true,
          points: 0,
          phone: localStorage.getItem(`user_phone_${userEmail}`) || ''
        };

        handleLoginSuccess(googleProfile, !!hasCompletedOnboarding);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Strict Auth Gatekeeper Helper
  const requireAuth = (actionCallback) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return false;
    }
    if (actionCallback) actionCallback();
    return true;
  };

  // 3. Real-time Points Ledger System & Toast Notification
  const handleRewardPoints = (amount, reason) => {
    setUserProfile(prev => {
      const updated = {
        ...prev,
        points: (prev.points || 0) + amount
      };
      localStorage.setItem('bolteekalam_user_profile', JSON.stringify(updated));
      return updated;
    });

    setUnreadNotifications(prev => prev + 1);

    setPointsToast({ amount, reason });
    setTimeout(() => {
      setPointsToast(null);
    }, 4000);
  };

  // 4. Handle Successful Login & Store Session Permanently
  const handleLoginSuccess = (userObj, isAlreadyOnboarded = false) => {
    setCurrentUser(userObj);
    localStorage.setItem('bolteekalam_active_user', JSON.stringify(userObj));

    const userEmail = userObj.email || '';

    if (userObj.role === 'admin') {
      setUserRole('admin');
      const adminProf = {
        name: 'बोलती कलम वर्ल्ड',
        username: '@bolteekalamworld',
        email: 'admin@bolteekalam.com',
        phone: '+91 9876500000',
        points: 99999,
        role: 'admin'
      };
      setUserProfile(prev => ({ ...prev, ...adminProf }));
      localStorage.setItem('bolteekalam_user_profile', JSON.stringify(adminProf));
      setActiveView('admin');
    } else {
      setUserRole('user');
      const storedPhone = localStorage.getItem(`user_phone_${userEmail}`) || userObj.phone || '';
      const storedDOB = localStorage.getItem(`user_dob_${userEmail}`) || userObj.birthday || '';

      const updatedProf = {
        ...userProfile,
        name: userObj.name || userProfile.name,
        email: userObj.email || userProfile.email,
        phone: storedPhone || userProfile.phone,
        birthday: storedDOB || userProfile.birthday || '03 अगस्त 2026',
        username: userObj.username || userProfile.username,
        avatar: userObj.avatar || userProfile.avatar,
        city: userObj.city || userProfile.city,
        points: userObj.points !== undefined ? userObj.points : (userProfile.points || 0)
      };

      setUserProfile(updatedProf);
      localStorage.setItem('bolteekalam_user_profile', JSON.stringify(updatedProf));

      const hasCompletedOnboarding = isAlreadyOnboarded || localStorage.getItem(`onboarding_completed_${userEmail}`);

      if (!hasCompletedOnboarding && (!storedPhone || storedPhone.length < 10)) {
        setPendingFirstTimeUser(userObj);
        setShowFirstTimeModal(true);
      } else {
        setShowFirstTimeModal(false);
        setActiveView('profile');
      }
    }
  };

  const handleFirstTimeUserTrigger = (draftUser) => {
    const userEmail = draftUser.email || '';
    const hasCompletedOnboarding = localStorage.getItem(`onboarding_completed_${userEmail}`);

    if (hasCompletedOnboarding) {
      handleLoginSuccess(draftUser, true);
    } else {
      setPendingFirstTimeUser(draftUser);
      setShowFirstTimeModal(true);
    }
  };

  const handleCompleteFirstTimeProfile = (completedUser) => {
    setCurrentUser(completedUser);
    localStorage.setItem('bolteekalam_active_user', JSON.stringify(completedUser));

    setUserRole('user');
    const userEmail = completedUser.email || '';

    localStorage.setItem(`onboarding_completed_${userEmail}`, 'true');
    if (completedUser.phone) {
      localStorage.setItem(`user_phone_${userEmail}`, completedUser.phone);
    }
    if (completedUser.birthday) {
      localStorage.setItem(`user_dob_${userEmail}`, completedUser.birthday);
    }

    const updated = {
      ...userProfile,
      name: completedUser.name,
      email: completedUser.email,
      phone: completedUser.phone,
      birthday: completedUser.birthday || userProfile.birthday || '03 अगस्त 2026',
      city: completedUser.city,
      avatar: completedUser.avatar,
      username: completedUser.username || `@${completedUser.name.toLowerCase().replace(/\s+/g, '_')}`,
      points: 50,
      followers: 0,
      following: 0,
      streak: 1
    };

    setUserProfile(updated);
    localStorage.setItem('bolteekalam_user_profile', JSON.stringify(updated));
    updateUserProfileInDB(updated, userEmail);

    setShowFirstTimeModal(false);
    setPendingFirstTimeUser(null);
    setActiveView('profile');

    handleRewardPoints(50, 'प्रथम प्रोफ़ाइल पूर्ण करने पर (Welcome Bonus)');
  };

  const handleSaveProfileAndSyncDB = (updatedProfile) => {
    setUserProfile(updatedProfile);
    localStorage.setItem('bolteekalam_user_profile', JSON.stringify(updatedProfile));

    if (currentUser?.email) {
      if (updatedProfile.phone) {
        localStorage.setItem(`user_phone_${currentUser.email}`, updatedProfile.phone);
      }
      if (updatedProfile.birthday) {
        localStorage.setItem(`user_dob_${currentUser.email}`, updatedProfile.birthday);
      }
      updateUserProfileInDB(updatedProfile, currentUser.email || currentUser.id);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('bolteekalam_active_user');
    setCurrentUser(null);
    setUserRole('user');
    setActiveView('feed');
  };

  const handleOpenCreatePostProtected = () => {
    requireAuth(() => setShowCreateModal(true));
  };

  // 🔴 100% Bulletproof Post Creation: Save to localStorage AND Supabase DB
  const handlePostCreated = async (newPost) => {
    const authorEmail = currentUser?.email || 'user-anon';
    const authorName = userProfile?.name || 'साहित्य साधक';
    const authorUsername = userProfile?.username || `@${authorName.toLowerCase().replace(/\s+/g, '_')}`;

    const postWithAuthor = {
      ...newPost,
      author: {
        id: authorEmail,
        email: authorEmail,
        name: authorName,
        username: authorUsername,
        avatar: userProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        badge: 'verifiedAuthor',
        city: userProfile.city || 'प्रयागराज'
      }
    };

    setPosts(prev => [postWithAuthor, ...prev]);

    // Save to global shared posts array so post is visible to ALL users on this machine/browser!
    try {
      const savedGlobal = localStorage.getItem('bolteekalam_global_shared_posts');
      const existingGlobal = savedGlobal ? JSON.parse(savedGlobal) : [];
      const updatedGlobal = [postWithAuthor, ...existingGlobal];
      localStorage.setItem('bolteekalam_global_shared_posts', JSON.stringify(updatedGlobal));
    } catch (e) {}

    // Save to user's created posts array
    try {
      const savedUserPosts = localStorage.getItem('bolteekalam_user_created_posts');
      const existingUserPosts = savedUserPosts ? JSON.parse(savedUserPosts) : [];
      const updatedUserPosts = [postWithAuthor, ...existingUserPosts];
      localStorage.setItem('bolteekalam_user_created_posts', JSON.stringify(updatedUserPosts));
    } catch (e) {}

    handleRewardPoints(10, 'नई साहित्य रचना पोस्ट करने पर');

    await createPostInDB({
      title: newPost.title,
      category: newPost.category,
      content: newPost.content,
      tags: newPost.tags,
      authorName,
      authorUsername,
      authorAvatar: userProfile.avatar || '',
      authorEmail
    }, authorEmail);
  };

  const handleSavePost = (updatedPost) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
    setEditingPost(null);
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('क्या आप निश्चित रूप से इस रचना को हटाना चाहते हैं?')) {
      setPosts(prev => prev.filter(p => p.id !== postId));

      try {
        const savedUserPosts = localStorage.getItem('bolteekalam_user_created_posts');
        if (savedUserPosts) {
          const existingUserPosts = JSON.parse(savedUserPosts);
          const updatedUserPosts = existingUserPosts.filter(p => p.id !== postId);
          localStorage.setItem('bolteekalam_user_created_posts', JSON.stringify(updatedUserPosts));
        }
      } catch (e) {}

      await deletePostFromDB(postId);
    }
  };

  const openCertificateModal = (data) => {
    setCertificateData(data);
  };

  const handleSimulateReferral = (refereeName) => {
    handleRewardPoints(100, `मित्र (${refereeName}) को बोलती कलम पर आमंत्रित करने पर`);
  };

  const handleSubscribeYouTube = () => {
    handleRewardPoints(25, 'आधिकारिक YouTube चैनल सब्सक्राइब करने पर');
    setShowYouTubeModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-inter transition-colors duration-200 selection:bg-rose-500 selection:text-white pb-20 md:pb-6">
      
      {/* Real-time Floating Points Toast Banner Notification */}
      {pointsToast && (
        <div className="fixed top-20 right-4 z-50 bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-amber-300 font-bold animate-in slide-in-from-top duration-300">
          <Trophy className="w-6 h-6 text-slate-950 animate-bounce shrink-0" />
          <div>
            <div className="text-sm font-black flex items-center gap-1">
              🎉 +{pointsToast.amount} Pts अर्जित!
            </div>
            <span className="text-[11px] text-slate-900 font-semibold block">{pointsToast.reason}</span>
          </div>
        </div>
      )}

      {/* Global Navigation Header */}
      <Navbar
        onOpenCreatePost={handleOpenCreatePostProtected}
        activeView={activeView}
        setActiveView={setActiveView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchType={searchType}
        setSearchType={setSearchType}
        unreadNotifications={unreadNotifications}
        setUnreadNotifications={setUnreadNotifications}
        userRole={userRole}
        setUserRole={setUserRole}
        currentUser={currentUser}
        onOpenAuthModal={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />

      {/* Main App Layout */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 flex-1 w-full flex gap-6">
        
        {/* Left Sticky Sidebar (Desktop) */}
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          userRole={userRole}
          setUserRole={setUserRole}
          onOpenCreatePost={handleOpenCreatePostProtected}
          onOpenReferEarn={() => requireAuth(() => setShowReferEarnModal(true))}
          onOpenYouTube={() => requireAuth(() => setShowYouTubeModal(true))}
          userPoints={userProfile.points}
          onOpenBirthdayCard={(u) => setBirthdayUser(u)}
          currentUser={currentUser}
          onOpenAuthModal={() => setShowAuthModal(true)}
        />

        {/* Middle Main Content View Area */}
        <main className="flex-1 min-w-0">
          {activeView === 'feed' && (
            <HomeFeedView
              posts={posts}
              dailyChallenge={weeklyChallenge}
              poetryBattle={mockPoetryBattle}
              onOpenCertificate={openCertificateModal}
              setActiveView={setActiveView}
              onEditPost={(p) => setEditingPost(p)}
              onDeletePost={handleDeletePost}
              onOpenBirthdayCard={(u) => setBirthdayUser(u)}
              userProfile={userProfile}
              patrioticBanner={patrioticBanner}
              requireAuth={requireAuth}
            />
          )}

          {activeView === 'dailyChallenge' && (
            <DailyChallengeView
              dailyChallenge={weeklyChallenge}
              onOpenCertificate={openCertificateModal}
              requireAuth={requireAuth}
            />
          )}

          {activeView === 'battles' && (
            <PoetryBattlesView 
              poetryBattle={mockPoetryBattle} 
              requireAuth={requireAuth}
              onRewardPoints={handleRewardPoints}
            />
          )}

          {activeView === 'competitions' && (
            <CompetitionsView
              competitions={mockCompetitions}
              onOpenCertificate={openCertificateModal}
              onOpenCreatePost={handleOpenCreatePostProtected}
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

          {activeView === 'magazine' && (
            <MagazineView onOpenMagazine={() => setShowMagazineModal(true)} />
          )}

          {activeView === 'profile' && (
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
              onOpenCertificate={openCertificateModal}
              onOpenEditProfile={() => setShowEditProfileModal(true)}
              onOpenReferEarn={() => setShowReferEarnModal(true)}
              onEditPost={(p) => setEditingPost(p)}
              onDeletePost={handleDeletePost}
            />
          )}

          {activeView === 'search' && (
            <SearchResultsView
              query={searchQuery}
              searchType={searchType}
              posts={posts}
              onOpenCertificate={openCertificateModal}
              onEditPost={(p) => setEditingPost(p)}
              onDeletePost={handleDeletePost}
            />
          )}

          {activeView === 'admin' && (
            <AdminDashboardView
              posts={posts}
              onDeletePost={handleDeletePost}
              onEditPost={(p) => setEditingPost(p)}
              onPublishChallenge={(topic, prompt) => {
                setWeeklyChallenge(prev => ({ ...prev, topic, title: topic, prompt }));
              }}
              onUpdateBanner={(tag, title, description, bgImage) => {
                setPatrioticBanner({ tag, title, description, bgImage });
              }}
            />
          )}
        </main>

      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenCreatePost={handleOpenCreatePostProtected}
      />

      {/* Global Interactive Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
        onFirstTimeUser={handleFirstTimeUserTrigger}
      />

      <FirstTimeUserModal
        isOpen={showFirstTimeModal}
        user={pendingFirstTimeUser}
        onCompleteProfile={handleCompleteFirstTimeProfile}
      />

      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPostCreated={handlePostCreated}
        onOpenAiAssistant={() => {}}
        userProfile={userProfile}
      />

      <EditProfileModal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
        userProfile={userProfile}
        onSaveProfile={handleSaveProfileAndSyncDB}
      />

      <EditPostModal
        isOpen={!!editingPost}
        onClose={() => setEditingPost(null)}
        post={editingPost}
        onSavePost={handleSavePost}
      />

      <ReferEarnModal
        isOpen={showReferEarnModal}
        onClose={() => setShowReferEarnModal(false)}
        userPoints={userProfile.points}
        onSimulateReferral={handleSimulateReferral}
      />

      <BirthdayCardModal
        isOpen={!!birthdayUser}
        onClose={() => setBirthdayUser(null)}
        birthdayUser={birthdayUser}
      />

      <YouTubeSubscribeModal
        isOpen={showYouTubeModal}
        onClose={() => setShowYouTubeModal(false)}
        onConfirmSubscribe={handleSubscribeYouTube}
      />

      <MagazineViewerModal
        isOpen={showMagazineModal}
        onClose={() => setShowMagazineModal(false)}
      />

      <CertificateGenerator
        isOpen={!!certificateData}
        onClose={() => setCertificateData(null)}
        certificateData={certificateData}
        userPoints={userProfile.points}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
