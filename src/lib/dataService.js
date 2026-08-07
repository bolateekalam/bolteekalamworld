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

// IndexedDB Helper for Unlimited Local Browser Storage (Solves 5MB localStorage limit)
const openDB = () => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject('IndexedDB not supported');
      return;
    }
    const request = window.indexedDB.open('BolteeKalamDB', 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('posts')) {
        db.createObjectStore('posts', { keyPath: 'id' });
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
};

export const savePostToIndexedDB = async (post) => {
  try {
    const db = await openDB();
    const tx = db.transaction('posts', 'readwrite');
    const store = tx.objectStore('posts');
    store.put(post);
  } catch (e) {
    console.warn('IndexedDB save fallback:', e);
  }
};

export const getAllPostsFromIndexedDB = async () => {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction('posts', 'readonly');
      const store = tx.objectStore('posts');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  } catch (e) {
    return [];
  }
};

// Cloud Storage CDN Helper: Uploads Image to Supabase Storage Bucket 'posters'
export const uploadImageToSupabaseStorage = async (base64DataUrl, fileName) => {
  try {
    if (!base64DataUrl || !base64DataUrl.startsWith('data:image')) return base64DataUrl;

    const res = await fetch(base64DataUrl);
    const blob = await res.blob();
    const filePath = `posters/${fileName || `poster_${Date.now()}`}.jpg`;

    const { data, error } = await supabase.storage
      .from('posters')
      .upload(filePath, blob, { contentType: 'image/jpeg', upsert: true });

    if (!error && data) {
      const { data: publicUrlData } = supabase.storage
        .from('posters')
        .getPublicUrl(filePath);

      if (publicUrlData && publicUrlData.publicUrl) {
        return publicUrlData.publicUrl;
      }
    }
  } catch (e) {
    console.warn('Supabase storage upload fallback:', e);
  }
  return base64DataUrl;
};

// Encode author metadata, archived status, and poster imageUrl into content text for 100% schema safety
const encodeContentWithAuthor = (content, authorInfo, isArchived = false, imageUrl = null) => {
  const metaHeader = `<!--BK_AUTHOR: ${JSON.stringify({
    name: authorInfo.name || 'साहित्य साधक',
    username: authorInfo.username || '@writer',
    avatar: authorInfo.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    email: authorInfo.email || '',
    isArchived: !!isArchived,
    imageUrl: imageUrl || authorInfo.imageUrl || null
  })}-->\n`;
  return metaHeader + content;
};

// Decode author metadata, archived status, and poster imageUrl from content text
const decodeContentAndAuthor = (rawContent, defaultAuthor) => {
  if (!rawContent || typeof rawContent !== 'string') {
    return { content: '', author: defaultAuthor, isArchived: false, imageUrl: null };
  }

  const match = rawContent.match(/^<!--BK_AUTHOR:\s*({.*?})-->\n?/s);
  if (match && match[1]) {
    try {
      const parsedMeta = JSON.parse(match[1]);
      const cleanContent = rawContent.replace(match[0], '');
      return {
        content: cleanContent,
        isArchived: !!parsedMeta.isArchived,
        imageUrl: parsedMeta.imageUrl || null,
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

  return { content: rawContent, author: defaultAuthor, isArchived: false, imageUrl: null };
};

// 1. Fetch All Shared Posts from Supabase DB + Global Shared Cloud Feed
export const fetchPostsFromDB = async () => {
  let dbPosts = [];
  let deletedIds = new Set();
  let likedIds = new Set();

  try {
    const savedDeleted = localStorage.getItem('bolteekalam_deleted_post_ids');
    if (savedDeleted) deletedIds = new Set(JSON.parse(savedDeleted));
  } catch (e) {}

  try {
    const savedLikes = localStorage.getItem('bolteekalam_user_liked_posts');
    if (savedLikes) likedIds = new Set(JSON.parse(savedLikes));
  } catch (e) {}

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
        const pId = String(p.id);
        const isUserLiked = likedIds.has(pId);
        const posterImg = decoded.imageUrl || p.image_url || p.imageUrl || p.image || null;

        return {
          id: pId,
          author: decoded.author,
          title: p.title || 'बिना शीर्षक',
          category: p.category || 'कविता',
          content: decoded.content,
          imageUrl: posterImg,
          image: posterImg,
          isArchived: decoded.isArchived,
          tags: p.tags || ['हिंदीसाहित्य'],
          likes: isUserLiked ? Math.max(p.likes_count || 0, 1) : (p.likes_count || 0),
          isLiked: isUserLiked,
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
    if (deletedIds.has(pId) || (fp && deletedIds.has(fp)) || seenIds.has(pId) || (fp && seenFingerprints.has(fp))) {
      return;
    }
    seenIds.add(pId);
    if (fp) seenFingerprints.add(fp);

    const isUserLiked = likedIds.has(pId);
    finalPosts.push({
      ...p,
      isLiked: isUserLiked || p.isLiked,
      likes: isUserLiked ? Math.max(p.likes || 0, 1) : (p.likes || 0)
    });
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

  const posterImg = postData.imageUrl || postData.image || null;
  const encodedBody = encodeContentWithAuthor(postData.content || '', authorInfo, false, posterImg);

  const postId = postData.id || `post_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  const newCreatedPostObj = {
    id: postId,
    author: authorInfo,
    title: postData.title || 'बिना शीर्षक',
    category: postData.category || 'कविता',
    content: postData.content || '',
    imageUrl: postData.imageUrl || postData.image || null,
    image: postData.imageUrl || postData.image || null,
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
        const updated = [dbPost, ...existing.filter(p => p.id !== postId && String(p.id) !== String(dbPost.id))];
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
      const updated = postsList.map(p => (p.id === postId || String(p.id) === String(postId)) ? { ...p, isArchived } : p);
      localStorage.setItem(GLOBAL_CLOUD_FEED_KEY, JSON.stringify(updated));
    }
  } catch (e) {}

  return true;
};

// 4. Delete Post Across DB and Local Storage Keys
export const deletePostFromDB = async (postId) => {
  const pIdStr = String(postId);

  // Store in deleted IDs list so fetchPostsFromDB ignores it permanently
  try {
    const storedDeleted = localStorage.getItem('bolteekalam_deleted_post_ids');
    const deletedList = storedDeleted ? JSON.parse(storedDeleted) : [];
    if (!deletedList.includes(pIdStr)) {
      deletedList.push(pIdStr);
      localStorage.setItem('bolteekalam_deleted_post_ids', JSON.stringify(deletedList));
    }
  } catch (e) {}

  // Delete from Supabase DB
  try {
    await supabase
      .from('posts')
      .delete()
      .eq('id', postId);
  } catch (err) {}

  // Clean from all Local Storage keys
  const keysToClean = [
    GLOBAL_CLOUD_FEED_KEY,
    'bolteekalam_global_shared_posts',
    'bolteekalam_global_shared_public_posts_v2',
    'bolteekalam_user_created_posts'
  ];

  keysToClean.forEach(key => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const postsList = JSON.parse(stored);
        const updated = postsList.filter(p => String(p.id) !== pIdStr);
        localStorage.setItem(key, JSON.stringify(updated));
      }
    } catch (e) {}
  });

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
