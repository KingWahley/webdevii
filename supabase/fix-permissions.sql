-- =============================================
-- PASTE THIS ENTIRE SCRIPT IN SUPABASE SQL EDITOR
-- Then click RUN
-- =============================================

-- 1. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 2. Grant API access to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.profiles TO authenticated;

GRANT SELECT ON public.projects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.projects TO authenticated;

GRANT SELECT ON public.blogs TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blogs TO authenticated;

GRANT SELECT, INSERT ON public.messages TO anon, authenticated;
GRANT UPDATE, DELETE ON public.messages TO authenticated;

-- 3. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can insert their profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can update their profile" ON public.profiles;

DROP POLICY IF EXISTS "Projects are viewable by everyone" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can manage projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can update projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can delete projects" ON public.projects;

DROP POLICY IF EXISTS "Published blogs are viewable by everyone" ON public.blogs;
DROP POLICY IF EXISTS "Authenticated users can manage blogs" ON public.blogs;
DROP POLICY IF EXISTS "Authenticated users can insert blogs" ON public.blogs;
DROP POLICY IF EXISTS "Authenticated users can update blogs" ON public.blogs;
DROP POLICY IF EXISTS "Authenticated users can delete blogs" ON public.blogs;

DROP POLICY IF EXISTS "Anyone can submit a message" ON public.messages;
DROP POLICY IF EXISTS "Authenticated users can view messages" ON public.messages;
DROP POLICY IF EXISTS "Authenticated users can manage messages" ON public.messages;

-- 4. Create simple, permissive RLS policies

-- PROFILES: anyone can read, authenticated users can write
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE TO authenticated USING (true);
CREATE POLICY "profiles_delete" ON public.profiles FOR DELETE TO authenticated USING (true);

-- PROJECTS: anyone can read, authenticated users can write
CREATE POLICY "projects_select" ON public.projects FOR SELECT USING (true);
CREATE POLICY "projects_insert" ON public.projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "projects_update" ON public.projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "projects_delete" ON public.projects FOR DELETE TO authenticated USING (true);

-- BLOGS: published ones public, authenticated can see all and write
CREATE POLICY "blogs_select_public" ON public.blogs FOR SELECT USING (published = true OR auth.role() = 'authenticated');
CREATE POLICY "blogs_insert" ON public.blogs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "blogs_update" ON public.blogs FOR UPDATE TO authenticated USING (true);
CREATE POLICY "blogs_delete" ON public.blogs FOR DELETE TO authenticated USING (true);

-- MESSAGES: anyone can insert (contact form), authenticated can read/delete
CREATE POLICY "messages_insert" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "messages_select" ON public.messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "messages_update" ON public.messages FOR UPDATE TO authenticated USING (true);
CREATE POLICY "messages_delete" ON public.messages FOR DELETE TO authenticated USING (true);

-- 5. Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 6. Storage policies
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete access" ON storage.objects;

CREATE POLICY "storage_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-assets');
CREATE POLICY "storage_anon_upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-assets');
CREATE POLICY "storage_auth_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio-assets');
CREATE POLICY "storage_auth_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio-assets');

-- 7. Done! Verify:
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' AND tablename IN ('profiles','projects','blogs','messages');
