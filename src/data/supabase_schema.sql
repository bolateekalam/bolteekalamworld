-- ========================================================
-- BOLTI KALAM (बोलती कलम v2.0) COMPLETE SUPABASE DATABASE SCHEMA
-- Execute this SQL script in Supabase SQL Editor (>_ icon)
-- ========================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  city TEXT DEFAULT 'प्रयागराज',
  bio TEXT DEFAULT 'काव्य-रसिक एवं हिंदी साहित्य प्रेमी।',
  birthday DATE,
  points INTEGER DEFAULT 100,
  badges TEXT[] DEFAULT ARRAY['Verified Author'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. POSTS & POETRY TABLE
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  audio_url TEXT,
  tags TEXT[] DEFAULT ARRAY['हिंदीसाहित्य', 'बोलतीकलम'],
  likes_count INTEGER DEFAULT 0,
  bookmarks_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_editorial_pick BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. LIKES TABLE
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(post_id, user_id)
);

-- 5. WEEKLY CHALLENGES TABLE
CREATE TABLE IF NOT EXISTS public.weekly_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic TEXT NOT NULL,
  prompt TEXT NOT NULL,
  reward_1st INTEGER DEFAULT 500,
  reward_2nd INTEGER DEFAULT 250,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. CHALLENGE SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.challenge_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID REFERENCES public.weekly_challenges(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'SUBMITTED', -- SUBMITTED, WINNER_1ST, WINNER_2ND, DISQUALIFIED
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_submissions ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES
CREATE POLICY "Allow Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow Public Read Posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Allow Public Read Comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Allow Public Read Challenges" ON public.weekly_challenges FOR SELECT USING (true);
CREATE POLICY "Allow Public Read Submissions" ON public.challenge_submissions FOR SELECT USING (true);
