import React, { useState } from 'react';
import { X, ShieldCheck, MapPin, Calendar, UserPlus, UserCheck, Copy, Check, Heart, MessageCircle, Share2, Sparkles } from 'lucide-react';
import PostCard from './PostCard';

export const PublicProfileModal = ({ isOpen, onClose, author, authorPosts = [], onOpenCertificate }) => {
  const [isFollowing, setIsFollowing] = useState(author?.isFollowing || false);
  const [followersCount, setFollowersCount] = useState(author?.followers || 14);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !author) return null;

  const handleToggleFollow = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowersCount(prev => Math.max(0, prev - 1));
    } else {
      setIsFollowing(true);
      setFollowersCount(prev => prev + 1);
    }
  };

  const handleCopyProfileLink = () => {
    const link = `https://www.bolateeworld.in/#author/${author.username?.replace(/^@/, '') || 'profile'}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-0 shadow-2xl space-y-0 max-h-[92vh] overflow-y-auto relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="प्रोफ़ाइल मॉडल बंद करें"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 backdrop-blur-md border border-white/20 transition active:scale-95"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Cover Photo */}
        <div className="h-40 sm:h-48 bg-slate-800 relative">
          <img
            src={author.cover || 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1200'}
            alt="Cover"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
        </div>

        {/* Profile Details Container */}
        <div className="px-6 pb-6 pt-0 relative">
          
          {/* Avatar & Badges */}
          <div className="flex flex-row items-end justify-between -mt-14 sm:-mt-16 mb-4 gap-4">
            <div className="relative">
              <img
                src={author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                alt={author.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-white dark:ring-slate-900 shadow-2xl bg-white"
              />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-white dark:border-slate-900 shadow">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            {/* Instagram Style Follow & Share Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleFollow}
                className={`px-5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition active:scale-95 shadow-md ${
                  isFollowing
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                    : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/20'
                }`}
              >
                {isFollowing ? <UserCheck className="w-4 h-4 text-emerald-500" /> : <UserPlus className="w-4 h-4" />}
                <span>{isFollowing ? 'फ़ॉलो कर रहे हैं' : '+ फ़ॉलो करें'}</span>
              </button>

              <button
                onClick={handleCopyProfileLink}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition active:scale-95"
                title="प्रोफ़ाइल शेयर करें"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Name & Bio */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-rozha">
                {author.name || 'साहित्य साधक'}
              </h2>
              <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold border border-rose-500/20">
                सत्यापित लेखक
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <span className="text-rose-600 dark:text-rose-400 font-bold">{author.username || '@writer'}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                {author.city || 'प्रयागराज'}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-tiro pt-1">
              {author.bio || 'हिंदी साहित्य एवं काव्य का साधक। बोलती कलम मंच पर नियमित रचनाकार।'}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center">
            <div className="space-y-0.5">
              <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {authorPosts.length}
              </div>
              <p className="text-[10px] text-slate-500 font-semibold">कुल रचनाएँ</p>
            </div>

            <div className="space-y-0.5">
              <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {followersCount}
              </div>
              <p className="text-[10px] text-slate-500 font-semibold">फ़ॉलोअर्स</p>
            </div>

            <div className="space-y-0.5">
              <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {author.following || 8}
              </div>
              <p className="text-[10px] text-slate-500 font-semibold">फ़ॉलो कर रहे हैं</p>
            </div>
          </div>

        </div>

        {/* Section Header: Author's Published Works */}
        <div className="px-6 py-3 border-t border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 flex items-center justify-between">
          <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{author.name} की प्रकाशित रचनाएँ ({authorPosts.length})</span>
          </h4>
        </div>

        {/* Author Posts List */}
        <div className="p-4 space-y-4">
          {authorPosts.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-semibold">
              अभी तक कोई रचना प्रकाशित नहीं की गई है।
            </div>
          ) : (
            authorPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onOpenCertificate={onOpenCertificate}
              />
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default PublicProfileModal;
