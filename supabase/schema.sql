-- ==============================================================================
-- SUPABASE DATABASE SCHEMA & MIGRATION SCRIPT
-- Portfolio Backend: Profiles, Projects, Blogs, Messages, and Storage
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE (Display Image, Bio, Stats, Socials)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Peter Olawale',
  title TEXT NOT NULL DEFAULT 'Software Engineer',
  bio TEXT NOT NULL DEFAULT 'I help businesses build websites that serve as powerful sales machines. Clean design, fast performance, and strategic structure.',
  full_intro TEXT NOT NULL DEFAULT 'I’m Peter, a developer and designer focused on creating clean, modern, and engaging digital experiences. I help businesses transform their ideas into responsive websites and applications through thoughtful design and powerful technology. When I''m not working, I stay curious through tech blogs, play football and unwind with video games.',
  avatar_url TEXT DEFAULT '/profile_portrait.png',
  experience_years TEXT NOT NULL DEFAULT '+12',
  projects_count TEXT NOT NULL DEFAULT '+46',
  clients_count TEXT NOT NULL DEFAULT '+20',
  instagram_url TEXT DEFAULT 'https://www.instagram.com/webdevii',
  github_url TEXT DEFAULT 'https://github.com/KingWahley',
  linkedin_url TEXT DEFAULT 'https://www.linkedin.com/in/olawale-peter-5898a9249/',
  email TEXT NOT NULL DEFAULT 'kingwahley@gmail.com',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 2. PROJECTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  domain TEXT NOT NULL,
  url TEXT NOT NULL,
  image_url TEXT NOT NULL,
  initially_hidden BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects are viewable by everyone" 
  ON public.projects FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert projects" 
  ON public.projects FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects" 
  ON public.projects FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can delete projects" 
  ON public.projects FOR DELETE 
  TO authenticated 
  USING (true);

-- ------------------------------------------------------------------------------
-- 3. BLOGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  read_time TEXT NOT NULL,
  date TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  cover_image TEXT,
  tags TEXT[] DEFAULT '{}',
  sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for blogs
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published blogs are viewable by everyone" 
  ON public.blogs FOR SELECT 
  USING (published = true OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert blogs" 
  ON public.blogs FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update blogs" 
  ON public.blogs FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can delete blogs" 
  ON public.blogs FOR DELETE 
  TO authenticated 
  USING (true);

-- ------------------------------------------------------------------------------
-- 4. MESSAGES TABLE (Contact Inquiries)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a contact message" 
  ON public.messages FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can view messages" 
  ON public.messages FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Only authenticated users can update messages" 
  ON public.messages FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Only authenticated users can delete messages" 
  ON public.messages FOR DELETE 
  TO authenticated 
  USING (true);

-- ------------------------------------------------------------------------------
-- 5. STORAGE BUCKET CONFIGURATION (portfolio-assets)
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public can view portfolio assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Authenticated users can upload portfolio assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-assets');

CREATE POLICY "Authenticated users can update portfolio assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Authenticated users can delete portfolio assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio-assets');

-- ------------------------------------------------------------------------------
-- 6. INITIAL SEED DATA
-- ------------------------------------------------------------------------------
INSERT INTO public.projects (title, domain, url, image_url, initially_hidden, sort_order)
VALUES
  ('Nautica beach ATV', 'leisuresportsatv.com', 'https://leisuresportsatv.com', '/beach_atv_thumbnail.png', false, 1),
  ('Nautica beach soccer and paintball', 'Nautica.leisuresportspaintball.com', 'https://Nautica.leisuresportspaintball.com', '/beach_soccer_thumbnail.png', false, 2),
  ('Leisure sports Nike Lake', 'Nike-Lake.leisuresportsatv.com', 'https://Nike-Lake.leisuresportsatv.com', '/nike_lake_thumbnail.png', false, 3),
  ('Play Padel ikoyi', 'ikoyi.playpadelltd.com', 'https://ikoyi.playpadelltd.com', '/play_padel_thumbnail.png', true, 4),
  ('Labs Pest Control', 'labspestcontrol.com', 'https://www.labspestcontrol.com/', '/pest_control_thumbnail.png', true, 5),
  ('Kinknot', 'kinknot.com', 'https://www.kinknot.com/', '/kinknot_thumbnail.png', true, 6)
ON CONFLICT DO NOTHING;
