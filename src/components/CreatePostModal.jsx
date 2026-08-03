import React, { useState } from 'react';
import { X, Send, Image, Tag, Sparkles, Wand2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const CreatePostModal = ({ isOpen, onClose, onPostCreated, onOpenAiAssistant, userProfile }) => {
  const { t } = useLanguage();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('कविता (Poetry)');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('हिंदीसाहित्य, काव्य');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(t => t.length > 0);

    const authorName = userProfile?.name || 'साहित्य साधक';
    const authorUsername = userProfile?.username || `@${authorName.toLowerCase().replace(/\s+/g, '_')}`;
    const authorAvatar = userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300';
    const authorCity = userProfile?.city || 'प्रयागराज';

    const newPost = {
      id: `post-${Date.now()}`,
      author: {
        id: userProfile?.id || 'user-current',
        name: authorName,
        username: authorUsername,
        avatar: authorAvatar,
        badge: 'verifiedAuthor',
        city: authorCity,
        followers: userProfile?.followers || 0
      },
      title: title.trim(),
      category,
      content: content.trim(),
      tags: tags.length > 0 ? tags : ['हिंदीसाहित्य'],
      likes: 0,
      isLiked: false,
      bookmarks: 0,
      isBookmarked: false,
      views: 1,
      readingTime: '2 मिनट',
      isEditorialPick: false,
      createdAt: 'अभी-अभी'
    };

    onPostCreated(newPost);

    // Reset Form
    setTitle('');
    setContent('');
    setTagsInput('हिंदीसाहित्य, काव्य');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              अपनी नई साहित्यिक रचना लिखें (Publish Post)
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Author Info Display */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
          <img 
            src={userProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'} 
            alt={userProfile?.name} 
            className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500"
          />
          <div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
              लेखक: {userProfile?.name || 'साहित्य साधक'}
            </h4>
            <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">
              {userProfile?.username || '@writer'} • {userProfile?.city || 'प्रयागराज'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Title */}
          <div>
            <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">रचना का शीर्षक (Title): *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="उदा. सावन की पहली फुहार..."
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              required
            />
          </div>

          {/* Category Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">विधा / श्रेणी (Category):</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="कविता (Poetry)">कविता (Poetry)</option>
                <option value="ग़ज़ल (Ghazal)">ग़ज़ल (Ghazal)</option>
                <option value="कहानी (Story)">कहानी (Story)</option>
                <option value="हास्य-व्यंग्य (Satire)">हास्य-व्यंग्य (Satire)</option>
                <option value="देशभक्ति (Patriotic)">देशभक्ति (Patriotic)</option>
                <option value="विचार व निबंध (Essays)">विचार व निबंध (Essays)</option>
              </select>
            </div>

            <div>
              <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">हैशटैग्स (Tags):</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="उदा. हिंदीसाहित्य, काव्य"
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Content Body */}
          <div>
            <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">मुख्य रचना (Poem / Content Body): *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              placeholder="यहाँ अपनी पूरी कविता, ग़ज़ल या कहानी लिखें..."
              className="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-800 font-tiro text-xs leading-relaxed border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-600"
              required
            />
          </div>

          {/* Publish Action Button */}
          <div className="flex justify-between items-center pt-2">
            <span className="text-[10px] text-slate-400 font-semibold">
              * प्रकाशित करते ही यह होम पेज पर तुरंत दिखने लगेगी।
            </span>

            <button
              type="submit"
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-rose-900/20 flex items-center gap-2 transition active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>रचना प्रकाशित करें (+10 Pts)</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default CreatePostModal;
