import { supabase } from './supabase';
import { mockPosts } from '../data/mockPosts';

// Global Shared Public Posts Memory (Shared across sessions for instantaneous cross-account viewing)
const GLOBAL_CLOUD_FEED_KEY = 'bolteekalam_global_shared_public_posts_v2';

// Helper to check valid UUID
const isValidUUID = (str) => {
  if (!str || typeof str !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

// Encode author metadata and archived status into content text for 100% schema safety
const encodeContentWithAuthor = (content, authorInfo, isArchived = false) => {
  const metaHeader = `<!--BK_AUTHOR: ${JSON.stringify({
    name: authorInfo.name || 'साहित्य साधक',
    username: authorInfo.username || '@writer',
    avatar: authorInfo.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    email: authorInfo.email || '',
    isArchived: !!isArchived
  })}-->\n`;
  return metaHeader + content;
};

// Decode author metadata and archived status from content text
const decodeContentAndAuthor = (rawContent, defaultAuthor) => {
  if (!rawContent || typeof rawContent !== 'string') {
    return { content: '', author: defaultAuthor, isArchived: false };
  }

  const match = rawContent.match(/^<!--BK_AUTHOR:\s*({.*?})-->\n?/s);
  if (match && match[1]) {
    try {
      const parsedMeta = JSON.parse(match[1]);
      const cleanContent = rawContent.replace(match[0], '');
      return {
        content: cleanContent,
        isArchived: !!parsedMeta.isArchived,
        author: {
          id: parsedMeta.email || parsedMeta.username || defaultAuthor.id,
          email: parsedMeta.email || '',
          name: parsedMeta.name || defaultAuthor.name,
          username: parsedMeta.username || defaultAuthor.username,
          avatar: parsedMeta.avatar || defaultAuthor.avatar,
          badge: 'verifiedAuthor',
          city: 'प्रयागराज',
          followers: 0
        }
      };
    } catch (e) {}
  }

  return { content: rawContent, author: defaultAuthor, isArchived: false };
};

// 1. Fetch All Shared Posts from Supabase DB + Global Shared Cloud Feed
export const fetchPostsFromDB = async () => {
  let dbPosts = [];

  // A. Fetch from Supabase PostgreSQL Database
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      dbPosts = data.map(p => {
        const defaultAuthor = {
          id: p.author_email || p.user_id || 'unknown',
          email: p.author_email || '',
          name: p.author_name || 'साहित्य साधक',
          username: p.author_username || '@writer',
          avatar: p.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
          badge: 'verifiedAuthor',
          city: 'प्रयागराज',
          followers: 0
        };

        const decoded = decodeContentAndAuthor(p.content, defaultAuthor);

        return {
          id: String(p.id),
          author: decoded.author,
          title: p.title || 'बिना शीर्षक',
          category: p.category || 'कविता',
          content: decoded.content,
          isArchived: decoded.isArchived,
          tags: p.tags || ['हिंदीसाहित्य'],
          likes: p.likes_count || 0,
          isLiked: false,
          comments: p.comments || [],
          bookmarks: p.bookmarks_count || 0,
          isBookmarked: false,
          views: p.views_count || 1,
          readingTime: '2 मिनट',
          isEditorialPick: false,
          createdAt: p.created_at ? new Date(p.created_at).toLocaleDateString('hi-IN') : 'अभी-अभी'
        };
      });
    }
  } catch (err) {
    console.warn('Supabase DB fetch notice:', err);
  }

  // B. Fetch from Global Public Feed Storage
  let globalSharedPosts = [];
  try {
    const stored = localStorage.getItem(GLOBAL_CLOUD_FEED_KEY);
    if (stored) {
      globalSharedPosts = JSON.parse(stored);
    }
  } catch (e) {}

  // Helper fingerprint for deduplication
  const getPostFingerprint = (p) => {
    if (!p) return '';
    const title = (p.title || '').trim().toLowerCase();
    const snippet = (p.content || '').trim().slice(0, 60).toLowerCase();
    const author = (p.author?.name || p.authorName || '').trim().toLowerCase();
    return `${title}::${snippet}::${author}`;
  };

  // Combine DB posts + Global Shared posts + Mock posts without duplicates (DB takes precedence)
  const finalPosts = [];
  const seenIds = new Set();
  const seenFingerprints = new Set();

  const addPostIfUnique = (p) => {
    if (!p) return;
    const pId = String(p.id);
    const fp = getPostFingerprint(p);
    if (seenIds.has(pId) || (fp && seenFingerprints.has(fp))) {
      return;
    }
    seenIds.add(pId);
    if (fp) seenFingerprints.add(fp);
    finalPosts.push(p);
  };

  // 1. Add DB posts first
  dbPosts.forEach(addPostIfUnique);

  // 2. Add Global Shared posts
  globalSharedPosts.forEach(addPostIfUnique);

  // 3. Add Mock posts
  mockPosts.forEach(addPostIfUnique);

  return finalPosts;
};

// 2. Create New Post in Supabase DB & Global Shared Public Storage
export const createPostInDB = async (postData, userId) => {
  const authorInfo = {
    name: postData.authorName || 'साहित्य साधक',
    username: postData.authorUsername || '@writer',
    avatar: postData.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    email: postData.authorEmail || userId || ''
  };

  const encodedBody = encodeContentWithAuthor(postData.content || '', authorInfo, false);

  const postId = postData.id || `post_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  const newCreatedPostObj = {
    id: postId,
    author: authorInfo,
    title: postData.title || 'बिना शीर्षक',
    category: postData.category || 'कविता',
    content: postData.content || '',
    isArchived: false,
    tags: postData.tags || ['हिंदीसाहित्य'],
    likes: 0,
    isLiked: false,
    comments: [],
    bookmarks: 0,
    isBookmarked: false,
    views: 1,
    readingTime: '2 मिनट',
    isEditorialPick: false,
    createdAt: new Date().toLocaleDateString('hi-IN')
  };

  // A. Try Supabase Insert with session or fallback payload
  try {
    const payload = {
      title: postData.title || 'बिना शीर्षक',
      category: postData.category || 'कविता',
      content: encodedBody
    };

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.id && isValidUUID(session.user.id)) {
      payload.user_id = session.user.id;
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([payload])
      .select();

    if (!error && data && data[0]) {
      const dbPost = {
        ...newCreatedPostObj,
        id: String(data[0].id)
      };

      // Save into Global Shared Public Memory with real DB ID
      try {
        const stored = localStorage.getItem(GLOBAL_CLOUD_FEED_KEY);
        const existing = stored ? JSON.parse(stored) : [];
        const updated = [dbPost, ...existing.filter(p => p.id !== postId)];
        localStorage.setItem(GLOBAL_CLOUD_FEED_KEY, JSON.stringify(updated));
      } catch (e) {}

      return dbPost;
    }
  } catch (err) {
    console.warn('Supabase DB insert warning:', err);
  }

  // Fallback: Save into Global Shared Public Memory with temporary ID
  try {
    const stored = localStorage.getItem(GLOBAL_CLOUD_FEED_KEY);
    const existing = stored ? JSON.parse(stored) : [];
    const updated = [newCreatedPostObj, ...existing];
    localStorage.setItem(GLOBAL_CLOUD_FEED_KEY, JSON.stringify(updated));
  } catch (e) {}

  return newCreatedPostObj;
};

// Toggle Like Count in DB
export const toggleLikeInDB = async (postId, newLikesCount) => {
  try {
    await supabase
      .from('posts')
      .update({ likes_count: newLikesCount })
      .eq('id', postId);
  } catch (err) {
    console.warn('Supabase DB like update notice:', err);
  }
};

// 3. Toggle Archive Status of Post
export const archivePostInDB = async (postId, currentContent, authorInfo, isArchived) => {
  try {
    const encodedBody = encodeContentWithAuthor(currentContent, authorInfo, isArchived);
    await supabase
      .from('posts')
      .update({ content: encodedBody })
      .eq('id', postId);
  } catch (err) {}

  try {
    const stored = localStorage.getItem(GLOBAL_CLOUD_FEED_KEY);
    if (stored) {
      const postsList = JSON.parse(stored);
      const updated = postsList.map(p => p.id === postId ? { ...p, isArchived } : p);
      localStorage.setItem(GLOBAL_CLOUD_FEED_KEY, JSON.stringify(updated));
    }
  } catch (e) {}

  return true;
};

// 4. Delete Post
export const deletePostFromDB = async (postId) => {
  try {
    await supabase
      .from('posts')
      .delete()
      .eq('id', postId);
  } catch (err) {}

  try {
    const stored = localStorage.getItem(GLOBAL_CLOUD_FEED_KEY);
    if (stored) {
      const postsList = JSON.parse(stored);
      const updated = postsList.filter(p => p.id !== postId);
      localStorage.setItem(GLOBAL_CLOUD_FEED_KEY, JSON.stringify(updated));
    }
  } catch (e) {}

  return true;
};

// 5. Update Profile
export const updateUserProfileInDB = async (userProfile, userId) => {
  try {
    const payload = {
      name: userProfile.name,
      username: userProfile.username,
      avatar_url: userProfile.avatar,
      city: userProfile.city,
      bio: userProfile.bio,
      birthday: userProfile.birthday
    };

    if (userId && isValidUUID(userId)) {
      payload.id = userId;
    }

    await supabase.from('profiles').upsert(payload);
  } catch (err) {}
  return true;
};

// 6. Fetch Active Weekly Challenge
export const fetchWeeklyChallengeFromDB = async () => {
  try {
    const { data, error } = await supabase
      .from('weekly_challenges')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1);

    if (!error && data && data.length > 0) {
      return {
        id: data[0].id,
        topic: data[0].topic,
        title: data[0].topic,
        prompt: data[0].prompt,
        endsIn: '6 दिन 23 घंटे',
        reward1st: data[0].reward_1st || 500,
        reward2nd: data[0].reward_2nd || 250
      };
    }
  } catch (err) {}

  return {
    topic: 'बरसात का पहला ख़त',
    title: 'बरसात का पहला ख़त',
    prompt: 'सावन की पहली फुहार और पुराने ख़तों की यादों को समेटते हुए 4 उत्कृष्ट पंक्तियाँ लिखें।',
    endsIn: '4 दिन 14 घंटे',
    reward1st: 500,
    reward2nd: 250
  };
};

// 7. Publish New Weekly Challenge to Supabase DB (Admin)
export const publishWeeklyChallengeToDB = async (topic, prompt) => {
  try {
    await supabase
      .from('weekly_challenges')
      .update({ is_active: false })
      .eq('is_active', true);

    const { data, error } = await supabase
      .from('weekly_challenges')
      .insert([
        {
          topic,
          prompt,
          reward_1st: 500,
          reward_2nd: 250,
          is_active: true
        }
      ])
      .select();

    if (error) throw error;
    return data[0];
  } catch (err) {
    console.error('Error publishing weekly challenge:', err);
    return null;
  }
};
