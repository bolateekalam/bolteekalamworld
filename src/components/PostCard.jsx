import React, { useState } from 'react';
import { 
  Heart, Bookmark, Share2, MessageCircle, Play, Pause, 
  Eye, Clock, CheckCircle2, ShieldCheck, Flag, Copy, 
  Send, Sparkles, UserPlus, UserCheck, Volume2, Music, Quote, Edit3, Trash2, Archive
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import CommentSection from './CommentSection';
import ReportModal from './ReportModal';

export const PostCard = ({ post, onOpenCertificate, onEditPost, onDeletePost, onToggleArchivePost, onOpenAuthorProfile, isAuthorView, requireAuth }) => {
  const { t } = useLanguage();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [isFollowing, setIsFollowing] = useState(post.author.isFollowing || false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isUserOwnPost = post.author.id === 'user-me' || post.author.name.includes('आप');

  const handleLikeToggle = () => {
    if (requireAuth && !requireAuth()) return;
    setIsLiked(!isLiked);
    setLikesCount(prev => (isLiked ? prev - 1 : prev + 1));
  };

  const handleFollowToggle = () => {
    if (requireAuth && !requireAuth()) return;
    setIsFollowing(!isFollowing);
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
              src={post.author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'} 
              alt={post.author.name} 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-rose-500/30 group-hover/author:ring-rose-500 transition"
            />
            {post.author.badge && (
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 rounded-full p-0.5 shadow" title={getBadgeLabel(post.author.badge)}>
                <ShieldCheck className="w-3.5 h-3.5 fill-amber-400" />
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 group-hover/author:text-rose-600 cursor-pointer truncate transition">
                {post.author.name || 'साहित्य साधक'}
              </h3>
              {post.author.badge && (
                <span className="text-[9px] sm:text-[10px] px-2 py-0.2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold shrink-0">
                  {getBadgeLabel(post.author.badge)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 truncate font-medium">
              <span className="group-hover/author:text-rose-500">{post.author.username || '@writer'}</span>
              <span>•</span>
              <span>{post.author.city}</span>
              <span>•</span>
              <span>{post.createdAt}</span>
            </div>
          </div>
        </div>

        {/* Right Actions: Author Edit or Follow Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isUserOwnPost ? (
            <button
              onClick={() => onEditPost && onEditPost(post)}
              aria-label="रचना संपादित करें"
              className="px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-bold flex items-center gap-1 transition"
              title="रचना संपादित करें"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>संपादित करें</span>
            </button>
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
          <span>{post.views.toLocaleString()} व्यूज़</span>
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

      {/* Composition Body (Royal Parchment Styling) */}
      <div className="relative p-4 sm:p-5 rounded-2xl bg-amber-50/50 dark:bg-slate-800/40 border border-amber-200/50 dark:border-slate-800 mb-4 select-text">
        <Quote className="w-6 h-6 text-amber-500/30 absolute top-2 right-2 rotate-180 pointer-events-none" />
        <div className="font-tiro text-sm sm:text-base md:text-lg text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
          {post.content}
        </div>
      </div>

      {/* Hashtags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {post.tags.map((tag, idx) => (
          <span key={idx} className="text-xs text-rose-600 dark:text-rose-400 hover:underline cursor-pointer font-medium">
            #{tag}
          </span>
        ))}
      </div>

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
            aria-label={`टिप्पणियाँ देखें (${post.comments ? post.comments.length : 0} कमेंट्स)`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{post.comments ? post.comments.length : 0}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShareToggle}
            aria-label="रचना शेयर करें"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">{t('share.title')}</span>
          </button>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkToggle}
            aria-label="रचना सहेजें (Bookmark)"
            className={`p-2 rounded-full transition ${
              isBookmarked 
                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50' 
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
            title={t('bookmark.save')}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
          </button>

          {/* Report Button */}
          <button
            onClick={() => setShowReportModal(true)}
            aria-label="रचना रिपोर्ट करें"
            className="p-2 rounded-full text-slate-500 hover:text-rose-500 transition"
            title={t('report.title')}
          >
            <Flag className="w-4 h-4" />
          </button>

          {/* Archive / Unarchive & Delete Buttons for Author */}
          {(isAuthorView || isUserOwnPost) && (
            <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-2">
              <button
                onClick={() => onToggleArchivePost && onToggleArchivePost(post.id)}
                aria-label={post.isArchived ? "अन-आर्काइव करें" : "आर्काइव करें"}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition ${
                  post.isArchived 
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/30' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
                title={post.isArchived ? "अन-आर्काइव करें (फ़ीड पर लाएँ)" : "आर्काइव करें (फ़ीड से छिपाएँ)"}
              >
                <Archive className="w-3.5 h-3.5" />
                <span>{post.isArchived ? 'अन-आर्काइव' : 'आर्काइव'}</span>
              </button>

              <button
                onClick={() => onDeletePost && onDeletePost(post.id)}
                aria-label="रचना डिलीट करें"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                title="रचना पूरी तरह डिलीट करें"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal Drawer */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 text-center">
              {t('share.title')}
            </h3>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button 
                onClick={handleCopyLink} 
                aria-label="लिंक कॉपी करें"
                className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold flex items-center gap-2 justify-center text-slate-800 dark:text-slate-200 hover:bg-slate-200"
              >
                <Copy className="w-4 h-4 text-rose-500" />
                <span>{copiedLink ? t('share.copiedMsg') : t('share.copyLink')}</span>
              </button>

              <a 
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title)}`} 
                target="_blank" 
                rel="noreferrer"
                aria-label="व्हाट्सएप पर शेयर करें"
                className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 font-bold flex items-center gap-2 justify-center hover:bg-emerald-500/20"
              >
                <Send className="w-4 h-4" />
                <span>{t('share.whatsapp')}</span>
              </a>
            </div>

            <button
              onClick={() => setShowShareModal(false)}
              aria-label="शेयर मॉडल बंद करें"
              className="w-full py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
            >
              बंद करें
            </button>
          </div>
        </div>
      )}

      {/* Inline Comments */}
      {showComments && (
        <CommentSection 
          comments={post.comments}
          onReportComment={() => setShowReportModal(true)}
        />
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        targetItem={post}
      />

    </article>
  );
};

export default PostCard;
