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

export const PostCard = ({ 
  post, 
  onOpenCertificate, 
  onEditPost, 
  onDeletePost, 
  onToggleArchivePost, 
  onOpenAuthorProfile, 
  onOpenPoetryChallenge, 
  onLikePost, 
  onAddComment, 
  onFollowAuthor, 
  isAuthorView, 
  requireAuth, 
  userProfile, 
  currentUser,
  authorProfileMap,
  onDeductPoints
}) => {
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

  const authorKeyEmail = post.author?.email ? post.author.email.toLowerCase().trim() : null;
  const authorKeyUsername = post.author?.username ? post.author.username.toLowerCase().replace(/^[@#]/, '').trim() : null;
  const authorKeyName = post.author?.name ? post.author.name.toLowerCase().trim() : null;

  const matchedAuthorData = (authorProfileMap && (
    (authorKeyEmail && authorProfileMap[authorKeyEmail]) ||
    (authorKeyUsername && authorProfileMap[authorKeyUsername]) ||
    (authorKeyName && authorProfileMap[authorKeyName])
  ));

  const displayAuthorAvatar = isUserOwnPost 
    ? (userProfile?.avatar || currentUser?.avatar || post.author?.avatar)
    : (matchedAuthorData?.avatar || post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300');

  const displayAuthorName = isUserOwnPost
    ? (userProfile?.name || currentUser?.name || post.author?.name)
    : (matchedAuthorData?.name || post.author?.name || 'साहित्य साधक');

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
      onLikePost(post, nextState, nextCount);
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

  const [isExpanded, setIsExpanded] = useState(false);

  // Line splitting for poem preview
  const contentLines = post.content ? post.content.split('\n') : [];
  const needsExpansion = contentLines.length > 4 || (post.content && post.content.length > 180);
  
  const displayedContent = (!isExpanded && needsExpansion)
    ? contentLines.slice(0, 3).join('\n') + '...'
    : post.content;

  return (
    <article className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
      
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
              alt={displayAuthorName} 
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
                {displayAuthorName}
              </h3>
              {post.author?.badge && (
                <span className="text-[9px] sm:text-[10px] px-2 py-0.2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold shrink-0">
                  {getBadgeLabel(post.author.badge)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 truncate font-medium">
              <span>{post.author?.username || '@writer'}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{post.createdAt}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls Header */}
        <div className="flex items-center gap-1 shrink-0">
          {!isUserOwnPost && (
            <button
              onClick={handleFollowToggle}
              className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1 shadow-sm ${
                isFollowing 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200' 
                  : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/80 hover:bg-rose-100'
              }`}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{t('actions.following') !== 'actions.following' ? t('actions.following') : 'फॉलो कर रहे हैं'}</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{t('actions.follow') !== 'actions.follow' ? t('actions.follow') : 'फॉलो करें'}</span>
                </>
              )}
            </button>
          )}

          {!isUserOwnPost && onOpenPoetryChallenge && (
            <button
              onClick={() => onOpenPoetryChallenge(post.author)}
              className="p-1.5 rounded-full text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition"
              title="काव्य दंगल चुनौती भेजें"
            >
              <Swords className="w-4 h-4" />
            </button>
          )}

          {isUserOwnPost && onEditPost && (
            <button
              onClick={() => onEditPost(post)}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="रचना एडिट करें"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}

          {isUserOwnPost && onDeletePost && (
            <button
              onClick={handleDeleteClick}
              className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
              title="रचना डिलीट करें"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Post Title */}
      <h2 className="text-base sm:text-lg font-bold font-rozha text-rose-900 dark:text-rose-300 mb-2 leading-snug">
        {post.title}
      </h2>

      {/* Meta Bar */}
      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium flex-wrap">
        <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[10px] font-bold">
          {post.category || 'कविता'}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{post.readingTime || '2 मिनट'}</span>
        </span>
        {post.views > 0 && (
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{post.views} पाठकों ने पढ़ा</span>
          </span>
        )}
      </div>

      {/* Post Text Content Box */}
      <div className="relative p-4 sm:p-5 rounded-2xl bg-amber-50/40 dark:bg-slate-800/40 border border-amber-200/50 dark:border-slate-800 mb-4">
        <Quote className="absolute top-3 right-3 w-8 h-8 text-amber-500/10 dark:text-slate-700/20 pointer-events-none" />
        <p className="text-sm sm:text-base font-tiro text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
          {displayedContent}
        </p>
        
        {/* See More (और देखें) / Show Less (कम दिखाएँ) Toggle */}
        {needsExpansion && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 inline-flex items-center gap-1 text-xs font-extrabold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
          >
            {isExpanded ? (
              <>
                <span>कम दिखाएँ (Show Less)</span>
                <span className="text-[10px]">▲</span>
              </>
            ) : (
              <>
                <span>और देखें / पूरी कविता पढ़ें (See More)</span>
                <span className="text-[10px]">▼</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Post Image Attachment (Full Aspect Ratio - 100% visible, no top/bottom cut-off) */}
      {(post.imageUrl || post.image) && (
        <div className="mb-4 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-slate-950/5 dark:bg-slate-950/50 flex justify-center items-center p-1">
          <img 
            src={post.imageUrl || post.image} 
            alt={post.title || 'काव्य पोस्टर'} 
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            className="w-full h-auto max-h-[750px] object-contain rounded-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer" 
            onClick={() => window.open(post.imageUrl || post.image, '_blank')}
          />
        </div>
      )}

      {/* Hashtags Row */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          {post.tags.map((tag, idx) => (
            <span key={idx} className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer">
              #{tag.replace(/^#/, '')}
            </span>
          ))}
        </div>
      )}

      {/* Bottom Engagement Action Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold">
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={handleLikeToggle}
            className={`flex items-center gap-1.5 transition active:scale-95 ${
              isLiked ? 'text-rose-600 font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600 stroke-rose-600' : ''}`} />
            <span>{likesCount} पसंद</span>
          </button>

          <button
            onClick={handleCommentToggle}
            className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-emerald-600 transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{(post.comments?.length || 0)} टिप्पणियाँ</span>
          </button>

          <button
            onClick={handleShareToggle}
            className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-amber-600 transition"
          >
            <Share2 className="w-4 h-4" />
            <span>शेयर</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBookmarkToggle}
            className={`p-2 rounded-xl transition ${
              isBookmarked 
                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title="बुकमार्क करें"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
          </button>

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
      </div>

      {/* Expandable Comment Section */}
      {showComments && (
        <CommentSection
          postId={post.id}
          comments={post.comments || []}
          onAddComment={(commentObj) => onAddComment && onAddComment(post.id, commentObj)}
          requireAuth={requireAuth}
          currentUser={currentUser}
          userProfile={userProfile}
          authorProfileMap={authorProfileMap}
        />
      )}

      {/* Share Card Modal */}
      {showShareModal && (
        <PoemCardShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          post={post}
          isUserOwnPost={isUserOwnPost}
          userPoints={userProfile?.points || 0}
          onDeductPoints={onDeductPoints}
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
