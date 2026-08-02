import React, { useState } from 'react';
import { Edit3, CheckCircle2, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { mockCategories } from '../data/mockPosts';

export const EditPostModal = ({ isOpen, onClose, post, onSavePost }) => {
  const { t } = useLanguage();
  const [title, setTitle] = useState(post?.title || '');
  const [category, setCategory] = useState(post?.category || 'kavita');
  const [content, setContent] = useState(post?.content || '');
  const [tagsInput, setTagsInput] = useState(post?.tags ? post.tags.join(', ') : '');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen || !post) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedPost = {
      ...post,
      title,
      category,
      content,
      tags: tagsInput ? tagsInput.split(',').map(t => t.trim()) : post.tags
    };
    onSavePost(updatedPost);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-base">
            <Edit3 className="w-5 h-5" />
            <span>{t('post.editPost')}</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSaved ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {t('post.postUpdated')}
            </h3>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                शीर्षक (Title):
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 font-rozha text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  श्रेणी:
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 font-semibold focus:outline-none"
                >
                  {mockCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.hi} ({c.en})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  टैग:
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                मुख्य पंक्तियाँ (Composition):
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 font-tiro text-base leading-relaxed focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
              >
                रद्द करें
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md active:scale-95 transition"
              >
                अपडेट सहेजें
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

export default EditPostModal;
