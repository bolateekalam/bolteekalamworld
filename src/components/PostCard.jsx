import React, { useState } from 'react';
import { 
  Heart, Bookmark, Share2, MessageCircle, Play, Pause, 
  Eye, Clock, CheckCircle2, ShieldCheck, Flag, Copy, 
  Send, Sparkles, UserPlus, UserCheck, Volume2, Music, Quote, Edit3, Trash2, Archive, Swords
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import CommentSection from './CommentSection';
import ReportModal from './ReportModal';
import PoemCardShareModal from './PoemCardShareModal';

export const PostCard = ({ post, onOpenCertificate, onEditPost, onDeletePost, onToggleArchivePost, onOpenAuthorProfile, onOpenPoetryChallenge, onLikePost, onAddComment, onFollowAuthor, isAuthorView, requireAuth, userProfile, currentUser }) => {
  const { t } = useLanguage();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [isFollowing, setIsFollowing] = useState(post.author?.isFollowing || false);
  const [followersCount, setFollowersCount] = useState(post.author?.followers || 0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isUserOwnPost = isAuthorView || Boolean(
    post.author?.id === 'user-me' ||
    post.author?.name?.includes('आप') ||
    (userProfile?.email && post.author?.email === userProfile.email) ||
    (userProfile?.username && post.author?.username === userProfile.username) ||
    (userProfile?.name && post.author?.name && post.author.name.trim().toLowerCase() === userProfile.name.trim().toLowerCase())
  );

  const displayAuthorAvatar = (isUserOwnPost && (userProfile?.avatar || currentUser?.avatar)) 
    ? (userProfile?.avatar || currentUser?.avatar) 
    : (post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300');

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDeleteAction = () => {
    setShowDeleteModal(false);
    if (onDeletePost) onDeletePost(post.id);
  };

  const handleLikeToggle = () => {
    if (requireAuth && !requireAuth()) return;
    const nextState = !isLiked;
    const nextCount = nextState ? likesCount + 1 : Math.max(0, likesCount - 1);
    setIsLiked(nextState);
    setLikesCount(nextCount);
    if (onLikePost) {
      onLikePost({ ...post, isLiked: nextState, likes: nextCount });
    }
  };

  const handleFollowToggle = () => {
    if (requireAuth && !requireAuth()) return;
    const nextState = !isFollowing;
    const nextCount = nextState ? followersCount + 1 : Math.max(0, followersCount - 1);
    setIsFollowing(nextState);
    setFollowersCount(nextCount);
    if (onFollowAuthor) {
      onFollowAuthor(post.author, nextState, nextCount);
    }
  };

  const handleBookmarkToggle = () => {
    if (requireAuth && !requireAuth()) return;
    setIsBookmarked(!isBookmarked);
  };

  const handleCommentToggle = () => {
    if (requireAuth && !requireAuth()) return;
    setShowComments(!showComments);
  };

  const handleShareToggle = () => {
    if (requireAuth && !requireAuth()) return;
    setShowShareModal(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getBadgeLabel = (badgeKey) => {
    if (badgeKey === 'verifiedAuthor') return t('badges.verifiedAuthor');
    if (badgeKey === 'officialOrg') return t('badges.officialOrg');
    if (badgeKey === 'publisher') return t('badges.publisher');
    if (badgeKey === 'judge') return t('badges.judge');
    return null;
  };

  return (
    <article className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
      
      {/* Top Gold Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-700 opacity-80" />

      {/* Editorial Pick Ribbon */}
      {post.isEditorialPick && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-slate-950 font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-bl-2xl flex items-center gap-1 shadow-md z-10">
          <Sparkles className="w-3 h-3 fill-slate-950" />
          <span className="hidden sm:inline">संपादकीय पसंद</span>
          <span className="sm:hidden">Editorial</span>
        </div>
      )}

      {/* Author Header Row */}
      <div className="flex items-start justify-between gap-3 mb-4 pt-1">
        <div 
          onClick={() => onOpenAuthorProfile && onOpenAuthorProfile(post.author)}
          className="flex items-center gap-3 min-w-0 cursor-pointer group/author"
        >
          <div className="relative shrink-0">
            <img 
              src={displayAuthorAvatar} 
              alt={post.author?.name || 'लेखक'} 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-rose-500/30 group-hover/author:ring-rose-500 transition"
            />
            {post.author?.badge && (
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 rounded-full p-0.5 shadow" title={getBadgeLabel(post.author.badge)}>
                <ShieldCheck className="w-3.5 h-3.5 fill-amber-400" />
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover/author:text-rose-600 cursor-pointer truncate transition">
                {isUserOwnPost && userProfile?.name ? userProfile.name : (post.author?.name || 'साहित्य साधक')}
              </h3>
              {post.author?.badge && (
                <span className="text-[9px] sm:text-[10px] px-2 py-0.2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold shrink-0">
                  {getBadgeLabel(post.author.badge)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 truncate font-medium">
              <span className="group-hover/author:text-rose-500">
                @{(isUserOwnPost && userProfile?.username ? userProfile.username : (post.author?.username || 'writer')).replace(/^[@#]/, '')}
              </span>
              <span>•</span>
              <span>{post.createdAt}</span>
            </div>
          </div>
        </div>

        {/* Right Actions: Author Edit/Delete or Follow Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isUserOwnPost ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEditPost && onEditPost(post)}
                aria-label="रचना संपादित करें"
                className="px-2.5 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-bold flex items-center gap-1 transition"
                title="रचना संपादित करें"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">संपादित करें</span>
              </button>

              <button
                onClick={() => onToggleArchivePost && onToggleArchivePost(post.id)}
                aria-label="आर्काइव करें"
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition"
                title="आर्काइव करें"
              >
                <Archive className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleDeleteClick}
                aria-label="रचना हमेशा के लिए डिलीट करें"
                className="p-1.5 rounded-full bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 transition"
                title="डिलीट करें"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleFollowToggle}
              aria-label={isFollowing ? "कवि को अनफ़ॉलो करें" : "कवि को फ़ॉलो करें"}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition active:scale-95 ${
                isFollowing
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100'
              }`}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('follow.following')}</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{t('follow.follow')}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Post Title */}
      <h2 className="text-base sm:text-xl font-rozha text-rose-900 dark:text-rose-100 mb-2 leading-snug">
        {post.title}
      </h2>

      {/* Category Tag & Reading Stats Bar */}
      <div className="flex items-center gap-2 sm:gap-4 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 font-medium mb-3 flex-wrap">
        <span className="px-2.5 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 font-bold text-rose-600 dark:text-rose-400 border border-rose-200/40 dark:border-rose-900/40">
          {post.category}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-rose-500" />
          <span>{post.readingTime}</span>
        </span>
        <span className="flex items-center gap-1">
          <Eye className="w-3.5 h-3.5 text-amber-500" />
          <span>{(post.views || 0).toLocaleString()} व्यूज़</span>
        </span>

        {/* Audio Recite Player Button */}
        <button
          onClick={() => setIsPlayingAudio(!isPlayingAudio)}
          aria-label={isPlayingAudio ? 'कविता पाठ रोकें' : 'कविता पाठ सुनें'}
          className={`ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
            isPlayingAudio 
              ? 'bg-rose-600 text-white animate-pulse shadow-md' 
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/30'
          }`}
        >
          {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          <span>{isPlayingAudio ? 'पाठ हो रहा है...' : 'कविता सुनें'}</span>
        </button>
      </div>

      {/* Audio Wave Visualizer Simulation Bar */}
      {isPlayingAudio && (
        <div className="mb-4 p-3 rounded-2xl bg-slate-900 text-white flex items-center gap-3 animate-in fade-in">
          <Music className="w-4 h-4 text-amber-400 animate-spin" />
          <div className="flex-1 flex items-center gap-1 h-4">
            {[40, 80, 60, 100, 70, 90, 50, 80, 100, 60, 40, 80, 90].map((h, idx) => (
              <div key={idx} style={{ height: `${h}%` }} className="flex-1 bg-amber-400 rounded-full animate-pulse" />
            ))}
          </div>
          <span className="text-[10px] font-mono text-amber-300">01:24</span>
        </div>
      )}

      {/* Attached Full Poster Canvas Image (e.g. Generated from Poster Studio) */}
      {(post.imageUrl || post.image) && (
        <div className="mb-4 rounded-3xl overflow-hidden shadow-xl border-2 border-rose-500/30 max-w-lg mx-auto bg-slate-950">
          <img 
            src={post.imageUrl || post.image} 
            alt={post.title}
            className="w-full h-auto object-contain max-h-[650px] rounded-3xl" 
          />
        </div>
      )}

      {/* Composition Body (Royal Parchment Styling) - Rendered ONLY if NOT a poster image post */}
      {post.content && !(post.imageUrl || post.image) && (
        <div className="relative p-4 sm:p-5 rounded-2xl bg-amber-50/50 dark:bg-slate-800/40 border border-amber-200/50 dark:border-slate-800 mb-4 select-text">
          <Quote className="w-6 h-6 text-amber-500/30 absolute top-2 right-2 rotate-180 pointer-events-none" />
          <div className="font-tiro text-sm sm:text-base md:text-lg text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
            {post.content}
          </div>
        </div>
      )}

      {/* Hashtags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map((tag, idx) => (
            <span key={idx} className="text-xs text-rose-600 dark:text-rose-400 hover:underline cursor-pointer font-medium">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Action Toolbar */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Like Button */}
          <button
            onClick={handleLikeToggle}
            aria-label={`रचना पसंद करें (${likesCount} लाइक्स)`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold transition active:scale-95 ${
              isLiked
                ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/60'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600' : ''}`} />
            <span>{likesCount}</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={handleCommentToggle}
            aria-label={`टिप्पणियाँ देखें (${post.comments?.length || 0})`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95"
          >
            <MessageCircle className="w-4 h-4 text-emerald-500" />
            <span>{post.comments?.length || 0}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShareToggle}
            aria-label="रचना शेयर करें"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95"
          >
            <Share2 className="w-4 h-4 text-sky-500" />
            <span className="hidden sm:inline">शेयर</span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkToggle}
            aria-label={isBookmarked ? "सेव की गई लिस्ट से हटाएँ" : "रचना सेव करें"}
            className={`p-1.5 rounded-full transition active:scale-95 ${
              isBookmarked ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
          </button>

        </div>

        {/* Flag/Report Option for non-authors */}
        {!isUserOwnPost && (
          <button
            onClick={() => setShowReportModal(true)}
            aria-label="रचना की रिपोर्ट करें"
            className="p-1.5 rounded-full text-slate-400 hover:text-rose-500 transition"
            title="रिपोर्ट करें"
          >
            <Flag className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Expandable Comment Section */}
      {showComments && (
        <CommentSection
          postId={post.id}
          comments={post.comments || []}
          onAddComment={onAddComment}
          requireAuth={requireAuth}
          currentUser={currentUser}
        />
      )}

      {/* Share Card Modal */}
      {showShareModal && (
        <PoemCardShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          post={post}
        />
      )}

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          postId={post.id}
        />
      )}

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-rose-500/30 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto ring-4 ring-rose-500/20">
              <Trash2 className="w-7 h-7" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                रचना डिलीट करें?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                क्या आप निश्चित ही इस रचना को डिलीट करना चाहते हैं? यह हमेशा के लिए हट जाएगी।
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-xs transition"
              >
                रद्द करें (Cancel)
              </button>

              <button
                onClick={handleConfirmDeleteAction}
                className="py-2.5 px-4 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-extrabold rounded-2xl text-xs shadow-md transition active:scale-95"
              >
                हाँ, डिलीट करें
              </button>
            </div>
          </div>
        </div>
      )}

    </article>
  );
};

export default PostCard;
