import { supabase } from './supabase';
import { mockPosts } from '../data/mockPosts';

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

// 1. Fetch All Shared Posts from Supabase DB & Local Shared Storage
export const fetchPostsFromDB = async () => {
  let dbPosts = [];

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
    console.error('Error fetching posts from Supabase DB:', err);
  }

  // Combine DB posts + mock posts without duplicates
  const allPostsMap = new Map();

  // Add DB posts first (newest top)
  dbPosts.forEach(p => {
    if (p && p.id) allPostsMap.set(p.id, p);
  });

  // Add mock posts
  mockPosts.forEach(mp => {
    if (mp && mp.id && !allPostsMap.has(String(mp.id))) {
      allPostsMap.set(String(mp.id), mp);
    }
  });

  return Array.from(allPostsMap.values());
};

// 2. Create New Post in Supabase DB with Guaranteed Clean Payload
export const createPostInDB = async (postData, userId) => {
  try {
    const authorInfo = {
      name: postData.authorName || 'साहित्य साधक',
      username: postData.authorUsername || '@writer',
      avatar: postData.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      email: postData.authorEmail || userId || ''
    };

    const encodedBody = encodeContentWithAuthor(postData.content || '', authorInfo, false);

    // Guaranteed clean payload matching basic Supabase columns
    const cleanPayload = {
      title: postData.title || 'बिना शीर्षक',
      category: postData.category || 'कविता',
      content: encodedBody
    };

    // Attach user_id only if valid UUID
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.id && isValidUUID(session.user.id)) {
      cleanPayload.user_id = session.user.id;
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([cleanPayload])
      .select();

    if (error) {
      console.warn('Primary Supabase insert warning:', error.message);
      // Fallback without user_id in case of RLS foreign key issue
      delete cleanPayload.user_id;
      const { data: fallbackData } = await supabase
        .from('posts')
        .insert([cleanPayload])
        .select();

      if (fallbackData && fallbackData[0]) {
        return fallbackData[0];
      }
    }

    return data && data[0] ? data[0] : cleanPayload;
  } catch (err) {
    console.error('Error creating post in DB:', err);
    return null;
  }
};

// 3. Toggle Archive Status of Post in Supabase DB
export const archivePostInDB = async (postId, currentContent, authorInfo, isArchived) => {
  try {
    const encodedBody = encodeContentWithAuthor(currentContent, authorInfo, isArchived);
    const { error } = await supabase
      .from('posts')
      .update({ content: encodedBody })
      .eq('id', postId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error archiving post in DB:', err);
    return false;
  }
};

// 4. Delete Post from Supabase DB
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

// 5. Update Profile in Supabase DB
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

// 6. Fetch Active Weekly Challenge
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
