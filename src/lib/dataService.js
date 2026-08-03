import { supabase } from './supabase';
import { mockPosts } from '../data/mockPosts';

// Helper to check valid UUID
const isValidUUID = (str) => {
  if (!str || typeof str !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

// 1. Fetch All Shared Posts from Supabase DB & Local Shared Storage
export const fetchPostsFromDB = async () => {
  let dbPosts = [];

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      dbPosts = data.map(p => ({
        id: p.id,
        author: {
          id: p.author_email || p.user_id || 'unknown',
          email: p.author_email || '',
          name: p.author_name || 'साहित्य साधक',
          username: p.author_username || '@writer',
          avatar: p.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
          badge: 'verifiedAuthor',
          city: p.author_city || 'प्रयागराज',
          followers: 0
        },
        title: p.title || 'बिना शीर्षक',
        category: p.category || 'कविता',
        content: p.content || '',
        tags: p.tags || ['हिंदीसाहित्य'],
        likes: p.likes_count || 0,
        isLiked: false,
        bookmarks: p.bookmarks_count || 0,
        isBookmarked: false,
        views: p.views_count || 1,
        readingTime: '2 मिनट',
        isEditorialPick: false,
        createdAt: p.created_at ? new Date(p.created_at).toLocaleDateString('hi-IN') : 'अभी-अभी'
      }));
    }
  } catch (err) {
    console.error('Error fetching posts from Supabase:', err);
  }

  // Get locally created shared posts across browser sessions
  let localSharedPosts = [];
  try {
    const saved = localStorage.getItem('bolteekalam_global_shared_posts');
    if (saved) {
      localSharedPosts = JSON.parse(saved);
    }
  } catch (e) {}

  // Combine local shared posts + DB posts + mock posts without duplicates
  const allPostsMap = new Map();

  // Add local shared posts first (newest top)
  localSharedPosts.forEach(p => {
    if (p && p.id) allPostsMap.set(p.id, p);
  });

  // Add DB posts
  dbPosts.forEach(p => {
    if (p && p.id && !allPostsMap.has(p.id)) {
      allPostsMap.set(p.id, p);
    }
  });

  // Add mock posts
  mockPosts.forEach(mp => {
    if (mp && mp.id && !allPostsMap.has(mp.id)) {
      allPostsMap.set(mp.id, mp);
    }
  });

  return Array.from(allPostsMap.values());
};

// 2. Create New Post in Supabase DB with Full Author Metadata
export const createPostInDB = async (postData, userId) => {
  try {
    const payload = {
      title: postData.title || 'बिना शीर्षक',
      category: postData.category || 'कविता',
      content: postData.content || '',
      tags: postData.tags || ['बोलतीकलम'],
      author_name: postData.authorName || 'साहित्य साधक',
      author_username: postData.authorUsername || '@writer',
      author_avatar: postData.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      author_email: postData.authorEmail || userId || ''
    };

    // Try to get authenticated Supabase user session UUID
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.id && isValidUUID(session.user.id)) {
      payload.user_id = session.user.id;
    } else if (isValidUUID(userId)) {
      payload.user_id = userId;
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([payload])
      .select();

    if (error) {
      console.warn('Supabase insert warning:', error.message);
      if (payload.user_id) {
        delete payload.user_id;
        const { data: fallbackData } = await supabase.from('posts').insert([payload]).select();
        if (fallbackData && fallbackData[0]) return fallbackData[0];
      }
    }
    return data && data[0] ? data[0] : payload;
  } catch (err) {
    console.error('Error creating post in DB:', err);
    return null;
  }
};

// 3. Delete Post from Supabase DB
export const deletePostFromDB = async (postId) => {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error deleting post from DB:', err);
    return false;
  }
};

// 4. Update Profile in Supabase DB
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

    const { error } = await supabase
      .from('profiles')
      .upsert(payload);

    if (error) {
      console.warn('Supabase upsert warning:', error.message);
    }
    return true;
  } catch (err) {
    console.error('Error updating profile in DB:', err);
    return false;
  }
};

// 5. Fetch Active Weekly Challenge
export const fetchWeeklyChallengeFromDB = async () => {
  try {
    const { data, error } = await supabase
      .from('weekly_challenges')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return {
        topic: 'बरसात का पहला ख़त',
        title: 'बरसात का पहला ख़त',
        prompt: 'सावन की पहली फुहार और पुराने ख़तों की यादों को समेटते हुए 4 उत्कृष्ट पंक्तियाँ लिखें।',
        endsIn: '4 दिन 14 घंटे',
        reward1st: 500,
        reward2nd: 250
      };
    }

    return {
      id: data[0].id,
      topic: data[0].topic,
      title: data[0].topic,
      prompt: data[0].prompt,
      endsIn: '6 दिन 23 घंटे',
      reward1st: data[0].reward_1st || 500,
      reward2nd: data[0].reward_2nd || 250
    };
  } catch (err) {
    console.error('Error fetching weekly challenge:', err);
    return {
      topic: 'बरसात का पहला ख़त',
      title: 'बरसात का पहला ख़त',
      prompt: 'सावन की पहली फुहार और पुराने ख़तों की यादों को समेटते हुए 4 उत्कृष्ट पंक्तियाँ लिखें।',
      endsIn: '4 दिन 14 घंटे',
      reward1st: 500,
      reward2nd: 250
    };
  }
};

// 6. Publish New Weekly Challenge to Supabase DB (Admin)
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
