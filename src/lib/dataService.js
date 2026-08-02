import { supabase } from './supabase';
import { mockPosts, mockDailyChallenge, mockPoetryBattle } from '../data/mockPosts';

// 1. Fetch Posts from Supabase (Fallback to Mock Posts if DB empty)
export const fetchPostsFromDB = async () => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles(*)')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return mockPosts;
    }

    return data.map(p => ({
      id: p.id,
      author: {
        id: p.profiles?.id || 'unknown',
        name: p.profiles?.name || 'अज्ञात लेखक',
        username: p.profiles?.username || '@writer',
        avatar: p.profiles?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        badge: 'verifiedAuthor',
        city: p.profiles?.city || 'प्रयागराज',
        followers: 1200
      },
      title: p.title,
      category: p.category,
      content: p.content,
      tags: p.tags || ['हिंदीसाहित्य'],
      likes: p.likes_count || 0,
      isLiked: false,
      bookmarks: p.bookmarks_count || 0,
      isBookmarked: false,
      views: p.views_count || 0,
      readingTime: '2 मिनट',
      isEditorialPick: p.is_editorial_pick || false,
      createdAt: new Date(p.created_at).toLocaleDateString('hi-IN')
    }));
  } catch (err) {
    console.error('Error fetching posts:', err);
    return mockPosts;
  }
};

// 2. Create New Post in Supabase DB
export const createPostInDB = async (postData, userId) => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          user_id: userId,
          title: postData.title,
          category: postData.category,
          content: postData.content,
          tags: postData.tags || ['बोलतीकलम']
        }
      ])
      .select();

    if (error) throw error;
    return data[0];
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
    if (!userId) return false;
    
    // Clean upsert payload compatible with Supabase profiles table schema
    const payload = {
      id: userId,
      name: userProfile.name,
      username: userProfile.username,
      avatar_url: userProfile.avatar,
      city: userProfile.city,
      bio: userProfile.bio,
      birthday: userProfile.birthday
    };

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
