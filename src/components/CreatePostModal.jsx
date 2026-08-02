import React, { useState } from 'react';
import { Feather, Sparkles, X, Plus, Hash, Users, Check, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { mockCategories } from '../data/mockPosts';

export const CreatePostModal = ({ isOpen, onClose, onPostCreated, onOpenAiAssistant }) => {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('kavita');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isCollabDraft, setIsCollabDraft] = useState(false);
  const [coAuthor, setCoAuthor] = useState('');
  const [moderationWarning, setModerationWarning] = useState(null);

  if (!isOpen) return null;

  // AI Content Safety Pre-check Filter
  const checkSafetyPolicy = (text) => {
    const forbiddenPatterns = [
      /गाली/i, /hate/i, /adult/i, /अश्लील/i, /नेता चोर/i, /अपशब्द/i
    ];
    for (const pattern of forbiddenPatterns) {
      if (pattern.test(text)) {
        return 'सामग्री सुरक्षा चेतावनी: आपकी रचना में अमर्यादित या आपत्तिजनक शब्द पाए गए हैं। कृपया नियम एवं शर्तों का पालन करें।';
      }
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setModerationWarning(null);

    const safetyViolation = checkSafetyPolicy(title + ' ' + content);
    if (safetyViolation) {
      setModerationWarning(safetyViolation);
      return;
    }

    if (!title.trim() || !content.trim()) return;

    const newPost = {
      id: `post-${Date.now()}`,
      author: {
        id: 'user-me',
        name: 'आप (User)',
        username: '@writer_user',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        badge: 'verifiedAuthor',
        city: 'नई दिल्ली',
        followers: 120,
        isFollowing: false
      },
      title,
      category,
      content,
      tags: tagsInput ? tagsInput.split(',').map(t => t.trim()) : ['साहित्य', 'बोलतीकलम'],
      likes: 0,
      isLiked: false,
      bookmarks: 0,
      isBookmarked: false,
      views: 1,
      readingTime: '1 मिनट',
      isEditorialPick: false,
      createdAt: 'अभी',
      comments: []
    };

    onPostCreated(newPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-base">
            <Feather className="w-5 h-5" />
            <span>{t('nav.createPost')}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenAiAssistant}
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold text-xs flex items-center gap-1 hover:bg-amber-500/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI सुझाव</span>
            </button>

            <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AI Moderation Warning Alert */}
        {moderationWarning && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{moderationWarning}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              शीर्षक (Title):
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="अपनी कविता या कहानी का शीर्षक दर्ज करें..."
              className="w-full p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-rose-500 text-sm font-rozha text-slate-900 dark:text-slate-100 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                श्रेणी (Category):
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-rose-500 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                {mockCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.hi} ({c.en})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                टैग (Comma separated):
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="उदा: कविता, प्रेम, सावन, हिंदी"
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-rose-500 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Composition Text Area */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              रचना का मुख्य पाठ (Devanagari Composition):
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="अपनी पंक्तियाँ यहाँ लिखें..."
              rows={6}
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-base font-tiro text-slate-800 dark:text-slate-200 leading-relaxed focus:outline-none focus:border-rose-500"
              required
            />
          </div>

          {/* Draft Collaboration Toggle (सह-लेखन) */}
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-300">
                <Users className="w-4 h-4" />
                <span>Draft Collaboration (सह-लेखन फ़ीचर)</span>
              </div>
              <input
                type="checkbox"
                checked={isCollabDraft}
                onChange={(e) => setIsCollabDraft(e.target.checked)}
                className="accent-purple-600"
              />
            </label>

            {isCollabDraft && (
              <input
                type="text"
                value={coAuthor}
                onChange={(e) => setCoAuthor(e.target.value)}
                placeholder="सह-लेखक का यूजरनेम (उदा: @kumarvishwas)..."
                className="w-full p-2 rounded-xl bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-800 text-xs focus:outline-none"
              />
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              रद्द करें
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-900/20 active:scale-95 transition"
            >
              प्रकाशित करें (Publish)
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default CreatePostModal;
