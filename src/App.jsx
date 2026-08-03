import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { supabase } from './lib/supabase';
import { updateUserProfileInDB, deletePostFromDB, createPostInDB, fetchPostsFromDB } from './lib/dataService';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MobileBottomNav from './components/MobileBottomNav';
import CertificateGenerator from './components/CertificateGenerator';
import CreatePostModal from './components/CreatePostModal';
import MagazineViewerModal from './components/MagazineViewerModal';
import EditProfileModal from './components/EditProfileModal';
import EditPostModal from './components/EditPostModal';
import ReferEarnModal from './components/ReferEarnModal';
import BirthdayCardModal from './components/BirthdayCardModal';
import YouTubeSubscribeModal from './components/YouTubeSubscribeModal';
import AuthModal from './components/AuthModal';
import FirstTimeUserModal from './components/FirstTimeUserModal';

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

function AppContent() {
  const [activeView, setActiveView] = useState('feed');
  
  // Strict Role & Auth Control
  const [userRole, setUserRole] = useState('user');
  const [currentUser, setCurrentUser] = useState(null); // Current Logged In User State

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

  const [posts, setPosts] = useState(mockPosts);
  
  // Weekly Challenge Global State
  const [weeklyChallenge, setWeeklyChallenge] = useState({
    topic: 'बरसात का पहला ख़त',
    title: 'बरसात का पहला ख़त',
    prompt: 'सावन की पहली फुहार और पुराने ख़तों की यादों को समेटते हुए 4 उत्कृष्ट पंक्तियाँ लिखें।',
    endsIn: '4 दिन 14 घंटे',
    reward1st: 500,
    reward2nd: 250
  });

  // Dynamic Festive Banner Global State (Admin Editable with Tag, Title, Description, Image)
  const [patrioticBanner, setPatrioticBanner] = useState({
    tag: '79वाँ स्वतंत्रता दिवस & रक्षाबंधन विशेषांक 🇮🇳',
    title: 'समस्त देशवासियों को 79वें स्वतंत्रता दिवस की हार्दिक शुभकामनाएँ!',
    description: 'स्वतंत्रता दिवस एवं रक्षाबंधन के पावन अवसर पर अपनी देशभक्ति व भ्रातृ-स्नेह रचनाएँ साझा करें।',
    bgImage: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&q=80&w=800'
  });

  // User Profile State (Default Clean State for New Registered Users)
  const [userProfile, setUserProfile] = useState({
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
    birthday: '2000-08-15',
    followers: 0,
    following: 0,
    streak: 0,
    points: 0,
    badges: ['नया साहित्य साधक ✒️']
  });

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');

  // Notifications State
  const [unreadNotifications, setUnreadNotifications] = useState(2);

  // Load Posts from Supabase PostgreSQL Database on Mount
  useEffect(() => {
    fetchPostsFromDB().then(dbPosts => {
      if (dbPosts && dbPosts.length > 0) {
        setPosts(dbPosts);
      }
    });
  }, []);

  // 1. Supabase OAuth Session Listener for Instant Google Login Restore
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const gUser = session.user;
        const userEmail = gUser.email || '';
        
        // Check if user has ALREADY completed 1-time onboarding!
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

  // 2. Strict Auth Gatekeeper Helper for Like, Comment, Share, Post, & Voting Actions
  const requireAuth = (actionCallback) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return false;
    }
    if (actionCallback) actionCallback();
    return true;
  };

  // 3. Real-time Points & Notification Ledger System
  const handleRewardPoints = (amount, reason) => {
    setUserProfile(prev => ({
      ...prev,
      points: prev.points + amount
    }));

    setUnreadNotifications(prev => prev + 1);

    setPointsToast({ amount, reason });
    setTimeout(() => {
      setPointsToast(null);
    }, 3500);
  };

  // 🔴 Login Success Handler: ONLY trigger 1-Time Onboarding if user has NEVER done it before!
  const handleLoginSuccess = (userObj, isAlreadyOnboarded = false) => {
    setCurrentUser(userObj);
    const userEmail = userObj.email || '';

    if (userObj.role === 'admin') {
      setUserRole('admin');
      setUserProfile(prev => ({
        ...prev,
        name: 'बोलती कलम वर्ल्ड',
        username: '@bolteekalamworld',
        email: 'admin@bolteekalam.com'
      }));
      setActiveView('admin');
    } else {
      setUserRole('user');
      const storedPhone = localStorage.getItem(`user_phone_${userEmail}`) || userObj.phone || '';

      setUserProfile(prev => ({
        ...prev,
        name: userObj.name || prev.name,
        email: userObj.email || prev.email,
        phone: storedPhone || prev.phone,
        username: userObj.username || prev.username,
        avatar: userObj.avatar || prev.avatar,
        city: userObj.city || prev.city,
        points: userObj.points !== undefined ? userObj.points : 0
      }));

      // Check 1-time permanent onboarding status
      const hasCompletedOnboarding = isAlreadyOnboarded || localStorage.getItem(`onboarding_completed_${userEmail}`);

      // 🔴 ONLY show popup if user is FIRST-TIME (No record & never completed onboarding)
      if (!hasCompletedOnboarding && (!storedPhone || storedPhone.length < 10)) {
        setPendingFirstTimeUser(userObj);
        setShowFirstTimeModal(true);
      } else {
        // Second time user: NEVER show popup, navigate straight to profile!
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

  // 🔴 Complete 1-Time Onboarding: Store permanent flag in localStorage so popup NEVER re-appears!
  const handleCompleteFirstTimeProfile = (completedUser) => {
    setCurrentUser(completedUser);
    setUserRole('user');
    const userEmail = completedUser.email || '';

    // Mark permanent 1-time onboarding completed flag!
    localStorage.setItem(`onboarding_completed_${userEmail}`, 'true');
    if (completedUser.phone) {
      localStorage.setItem(`user_phone_${userEmail}`, completedUser.phone);
    }

    const updated = {
      ...userProfile,
      name: completedUser.name,
      email: completedUser.email,
      phone: completedUser.phone,
      city: completedUser.city,
      avatar: completedUser.avatar,
      username: completedUser.username || `@${completedUser.name.toLowerCase().replace(/\s+/g, '_')}`,
      points: 0,
      followers: 0,
      following: 0,
      streak: 0
    };

    setUserProfile(updated);
    updateUserProfileInDB(updated, userEmail);

    setShowFirstTimeModal(false);
    setPendingFirstTimeUser(null);
    setActiveView('profile');

    handleRewardPoints(50, 'प्रथम प्रोफ़ाइल पूर्ण करने पर (Welcome Bonus)');
  };

  const handleSaveProfileAndSyncDB = (updatedProfile) => {
    setUserProfile(updatedProfile);
    if (updatedProfile.phone && currentUser?.email) {
      localStorage.setItem(`user_phone_${currentUser.email}`, updatedProfile.phone);
    }
    if (currentUser) {
      updateUserProfileInDB(updatedProfile, currentUser.email || currentUser.id);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setUserRole('user');
    setActiveView('feed');
  };

  const handleOpenCreatePostProtected = () => {
    requireAuth(() => setShowCreateModal(true));
  };

  const handlePostCreated = async (newPost) => {
    setPosts(prev => [newPost, ...prev]);
    handleRewardPoints(10, 'नई साहित्य रचना पोस्ट करने पर');

    await createPostInDB({
      title: newPost.title,
      category: newPost.category,
      content: newPost.content,
      tags: newPost.tags
    }, currentUser?.email || 'user-anon');
  };

  const handleSavePost = (updatedPost) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  const handleDeletePost = (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    deletePostFromDB(postId);
  };

  const handleSimulateReferral = (bonusPoints = 50) => {
    handleRewardPoints(bonusPoints, 'मित्र को आमंत्रण (Refer & Earn) करने पर');
  };

  const handleSubscribeYouTube = () => {
    handleRewardPoints(100, 'YouTube सब्सक्राइब करने पर');
  };

  const openCertificateModal = (data) => {
    setCertificateData(data);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-inter transition-colors duration-200 pb-16 md:pb-0">
      
      {/* Real-time Incremental Points Reward Toast */}
      {pointsToast && (
        <div className="fixed top-20 right-4 z-50 p-4 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/40 animate-in slide-in-from-top-4 duration-300">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg">
            🎉
          </div>
          <div>
            <h4 className="font-bold text-xs">+{pointsToast.amount} पॉइंट्स प्राप्त हुए!</h4>
            <p className="text-[11px] text-emerald-100">{pointsToast.reason}</p>
          </div>
        </div>
      )}

      {/* Top Navbar Header */}
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

      {/* Main Body Layout */}
      <div className="max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex gap-6 flex-1">
        
        {/* Left Sidebar Navigation (Desktop) */}
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          userRole={userRole}
          onOpenBirthdayCard={(bUser) => setBirthdayUser(bUser)}
        />

        {/* Center Main Viewport Content */}
        <main className="flex-1 min-w-0">
          {activeView === 'feed' && (
            <HomeFeedView
              posts={posts}
              dailyChallenge={weeklyChallenge}
              poetryBattle={mockPoetryBattle}
              onOpenCertificate={openCertificateModal}
              setActiveView={setActiveView}
              onEditPost={(post) => setEditingPost(post)}
              onDeletePost={handleDeletePost}
              onOpenBirthdayCard={(bUser) => setBirthdayUser(bUser)}
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
              posts={posts}
              userProfile={userProfile}
              onOpenCertificate={openCertificateModal}
              onOpenEditProfile={() => setShowEditProfileModal(true)}
              onOpenReferEarn={() => setShowReferEarnModal(true)}
              onEditPost={(post) => setEditingPost(post)}
              onDeletePost={handleDeletePost}
            />
          )}

          {activeView === 'admin' && userRole === 'admin' && (
            <AdminDashboardView 
              posts={posts} 
              setPosts={setPosts} 
              onOpenBirthdayCard={(bUser) => setBirthdayUser(bUser)}
              userProfile={userProfile}
              setUserProfile={setUserProfile}
              weeklyChallenge={weeklyChallenge}
              setWeeklyChallenge={setWeeklyChallenge}
              patrioticBanner={patrioticBanner}
              setPatrioticBanner={setPatrioticBanner}
            />
          )}

          {activeView === 'search' && (
            <SearchResultsView
              searchQuery={searchQuery}
              searchType={searchType}
              posts={posts}
              onOpenCertificate={openCertificateModal}
              onEditPost={(post) => setEditingPost(post)}
              onDeletePost={handleDeletePost}
            />
          )}
        </main>

      </div>

      {/* Mobile Bottom Floating Navigation Bar */}
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
