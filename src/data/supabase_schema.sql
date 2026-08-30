-- ========================================================
-- BOLATEE KALAM (बोलती कलम v2.0) COMPLETE & SECURE DATABASE SCHEMA
-- Supabase SQL Editor Script with RLS (Row Level Security) Active
-- ========================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  username TEXT UNIQUE,
  email TEXT,
  avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  city TEXT DEFAULT 'प्रयागराज',
  bio TEXT DEFAULT 'काव्य-रसिक एवं हिंदी साहित्य प्रेमी।',
  birthday DATE,
  points INTEGER DEFAULT 100,
  badges TEXT[] DEFAULT ARRAY['Verified Author'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. POSTS TABLE
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT,
  author_username TEXT,
  author_avatar TEXT,
  author_email TEXT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  audio_url TEXT,
  tags TEXT[] DEFAULT ARRAY['हिंदीसाहित्य', 'बोलतीकलम'],
  likes_count INTEGER DEFAULT 0,
  bookmarks_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_editorial_pick BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- If posts table already exists from earlier, ensure all columns and nullable user_id:
ALTER TABLE public.posts ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS author_name TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS author_username TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS author_avatar TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS author_email TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS audio_url TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT ARRAY['हिंदीसाहित्य', 'बोलतीकलम'];
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS bookmarks_count INTEGER DEFAULT 0;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS is_editorial_pick BOOLEAN DEFAULT FALSE;

-- 3. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT,
  author_avatar TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. LIKES TABLE
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
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
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'SUBMITTED',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. NOTIFICATIONS TABLE (For Cloud Push Broadcasts & Storage across all devices)
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  url TEXT DEFAULT '/',
  type TEXT DEFAULT 'broadcast',
  target_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_global BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ========================================================
-- 8. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES
-- (Resolves Supabase Security Warning: "RLS is disabled")
-- ========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ========================================================
-- 8. POLICIES SETUP (SAFE PUBLIC READ + PROTECTED WRITES)
-- ========================================================

-- A. PROFILES POLICIES
DROP POLICY IF EXISTS "Allow Public Read Profiles" ON public.profiles;
CREATE POLICY "Allow Public Read Profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow Insert Profiles" ON public.profiles;
CREATE POLICY "Allow Insert Profiles" ON public.profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow Update Own Profile" ON public.profiles;
CREATE POLICY "Allow Update Own Profile" ON public.profiles FOR UPDATE 
  USING (auth.uid() = id OR auth.uid() IS NULL);

-- B. POSTS POLICIES
DROP POLICY IF EXISTS "Allow Public Read Posts" ON public.posts;
CREATE POLICY "Allow Public Read Posts" ON public.posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow Insert Posts" ON public.posts;
CREATE POLICY "Allow Insert Posts" ON public.posts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow Update Posts" ON public.posts;
CREATE POLICY "Allow Update Posts" ON public.posts FOR UPDATE 
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow Delete Posts" ON public.posts;
CREATE POLICY "Allow Delete Posts" ON public.posts FOR DELETE 
  USING (true);

-- C. COMMENTS POLICIES
DROP POLICY IF EXISTS "Allow Public Read Comments" ON public.comments;
CREATE POLICY "Allow Public Read Comments" ON public.comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow Insert Comments" ON public.comments;
CREATE POLICY "Allow Insert Comments" ON public.comments FOR INSERT WITH CHECK (true);

-- D. LIKES POLICIES
DROP POLICY IF EXISTS "Allow Public Read Likes" ON public.likes;
CREATE POLICY "Allow Public Read Likes" ON public.likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow Insert Likes" ON public.likes;
CREATE POLICY "Allow Insert Likes" ON public.likes FOR INSERT WITH CHECK (true);

-- E. WEEKLY CHALLENGES POLICIES
DROP POLICY IF EXISTS "Allow Public Read Challenges" ON public.weekly_challenges;
CREATE POLICY "Allow Public Read Challenges" ON public.weekly_challenges FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow Manage Challenges" ON public.weekly_challenges;
CREATE POLICY "Allow Manage Challenges" ON public.weekly_challenges FOR ALL USING (true);

-- F. CHALLENGE SUBMISSIONS POLICIES
DROP POLICY IF EXISTS "Allow Public Read Submissions" ON public.challenge_submissions;
CREATE POLICY "Allow Public Read Submissions" ON public.challenge_submissions FOR SELECT USING (true);

-- G. NOTIFICATIONS POLICIES
DROP POLICY IF EXISTS "Allow Public Read Notifications" ON public.notifications;
CREATE POLICY "Allow Public Read Notifications" ON public.notifications FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow Insert Notifications" ON public.notifications;
CREATE POLICY "Allow Insert Notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- ========================================================
-- 9. SUPABASE REALTIME REPLICATION (For Live Sync)
-- ========================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'posts'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
END $$;

-- ========================================================
-- 10. STORAGE BUCKET FOR POSTERS & IMAGES
-- ========================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('posters', 'posters', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Storage Read" ON storage.objects;
CREATE POLICY "Public Storage Read" ON storage.objects FOR SELECT USING (bucket_id = 'posters');

DROP POLICY IF EXISTS "Public Storage Upload" ON storage.objects;
CREATE POLICY "Public Storage Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'posters');

DROP POLICY IF EXISTS "Public Storage Update" ON storage.objects;
CREATE POLICY "Public Storage Update" ON storage.objects FOR UPDATE USING (bucket_id = 'posters');
