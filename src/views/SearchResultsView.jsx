import React from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PostCard from '../components/PostCard';

export const SearchResultsView = ({ 
  searchQuery, 
  searchType, 
  posts = [], 
  onOpenCertificate 
}) => {
  const { t } = useLanguage();

  const filtered = posts.filter((p) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;

    if (searchType === 'writer') {
      return p.author.name.toLowerCase().includes(q) || p.author.username.toLowerCase().includes(q);
    }
    if (searchType === 'poem' || searchType === 'story') {
      return p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q);
    }
    if (searchType === 'tag') {
      return p.tags.some(t => t.toLowerCase().includes(q));
    }
    if (searchType === 'category') {
      return p.category.toLowerCase().includes(q);
    }
    if (searchType === 'city') {
      return p.author.city.toLowerCase().includes(q);
    }

    return (
      p.title.toLowerCase().includes(q) ||
      p.author.name.toLowerCase().includes(q) ||
      p.author.city.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400">
          <Search className="w-4 h-4" />
          <span>खोज परिणाम (Search Results)</span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          "{searchQuery}" के लिए परिणाम ({filtered.length})
        </h2>
        <p className="text-xs text-slate-500">
          फ़िल्टर प्रकार: {searchType.toUpperCase()}
        </p>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            कोई परिणाम नहीं मिला। कृपया भिन्न शब्द या फ़िल्टर आज़माएँ।
          </div>
        ) : (
          filtered.map(post => (
            <PostCard key={post.id} post={post} onOpenCertificate={onOpenCertificate} />
          ))
        )}
      </div>

    </div>
  );
};

export default SearchResultsView;
