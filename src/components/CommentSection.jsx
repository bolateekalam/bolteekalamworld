import React, { useState } from 'react';
import { Heart, Reply, Pin, Flag, Trash2, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const CommentSection = ({ comments = [], onAddComment, onReportComment }) => {
  const { t } = useLanguage();
  const [commentList, setCommentList] = useState(comments);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handleSendComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const added = {
      id: `c-${Date.now()}`,
      author: 'आप (User)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      content: newCommentText,
      createdAt: 'अभी',
      likes: 0,
      isLiked: false,
      isPinned: false,
      replies: []
    };

    setCommentList([added, ...commentList]);
    if (onAddComment) onAddComment(added);
    setNewCommentText('');
  };

  const handleLikeComment = (id) => {
    setCommentList(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          isLiked: !c.isLiked,
          likes: c.isLiked ? c.likes - 1 : c.likes + 1
        };
      }
      return c;
    }));
  };

  const handleTogglePin = (id) => {
    setCommentList(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, isPinned: !c.isPinned };
      }
      return c;
    }));
  };

  const handleDeleteComment = (id) => {
    setCommentList(prev => prev.filter(c => c.id !== id));
  };

  const handleSendReply = (commentId) => {
    if (!replyText.trim()) return;
    setCommentList(prev => prev.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [
            ...(c.replies || []),
            {
              id: `r-${Date.now()}`,
              author: 'आप (User)',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
              content: replyText,
              createdAt: 'अभी',
              likes: 0
            }
          ]
        };
      }
      return c;
    }));
    setReplyText('');
    setReplyingToId(null);
  };

  return (
    <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
        <span>{t('comments.title')}</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
          {commentList.length}
        </span>
      </h4>

      {/* Input Box */}
      <form onSubmit={handleSendComment} className="flex gap-2">
        <input
          type="text"
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder={t('comments.placeholder')}
          className="flex-1 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-rose-500 text-xs text-slate-800 dark:text-slate-200 focus:outline-none transition"
        />
        <button
          type="submit"
          disabled={!newCommentText.trim()}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-900/20 flex items-center gap-1 transition"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Comment List */}
      <div className="space-y-3 pt-1">
        {commentList.map((c) => (
          <div 
            key={c.id}
            className={`p-3 rounded-2xl transition ${
              c.isPinned 
                ? 'bg-amber-500/10 border border-amber-500/20' 
                : 'bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60'
            }`}
          >
            {c.isPinned && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 mb-1.5">
                <Pin className="w-3 h-3 fill-amber-500" />
                <span>पिन की गई टिप्पणी</span>
              </div>
            )}

            <div className="flex items-start gap-2.5">
              <img 
                src={c.avatar} 
                alt={c.author} 
                className="w-7 h-7 rounded-full object-cover shrink-0" 
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {c.author}
                  </span>
                  <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-tiro leading-relaxed">
                  {c.content}
                </p>

                {/* Comment Action Toolbar */}
                <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <button
                    onClick={() => handleLikeComment(c.id)}
                    className={`flex items-center gap-1 hover:text-rose-600 transition ${c.isLiked ? 'text-rose-600 font-bold' : ''}`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${c.isLiked ? 'fill-rose-600' : ''}`} />
                    <span>{c.likes}</span>
                  </button>

                  <button
                    onClick={() => setReplyingToId(replyingToId === c.id ? null : c.id)}
                    className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-200 transition"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>{t('comments.reply')}</span>
                  </button>

                  <button
                    onClick={() => handleTogglePin(c.id)}
                    className="hover:text-amber-500 transition"
                    title={t('comments.pin')}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onReportComment && onReportComment(c)}
                    className="hover:text-rose-500 transition"
                    title={t('comments.report')}
                  >
                    <Flag className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteComment(c.id)}
                    className="hover:text-rose-600 transition ml-auto"
                    title={t('comments.delete')}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Nested Reply Input */}
                {replyingToId === c.id && (
                  <div className="flex gap-2 mt-2.5">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="जवाब दर्ज करें..."
                      className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-rose-500"
                    />
                    <button
                      onClick={() => handleSendReply(c.id)}
                      className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold"
                    >
                      जवाब दें
                    </button>
                  </div>
                )}

                {/* Nested Replies Display */}
                {c.replies && c.replies.length > 0 && (
                  <div className="mt-2.5 space-y-2 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                    {c.replies.map(r => (
                      <div key={r.id} className="text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                          <span>{r.author}</span>
                          <span className="text-[9px] text-slate-400 font-normal">{r.createdAt}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 font-tiro mt-0.5">{r.content}</p>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
