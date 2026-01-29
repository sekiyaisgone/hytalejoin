-- =============================================================================
-- HytaleJoin Database Schema Migration
-- Run this script in Supabase SQL Editor after deleting existing tables/policies
-- =============================================================================

-- =============================================================================
-- 1. PROFILES TABLE
-- =============================================================================

-- Create profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  email TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- =============================================================================
-- 2. AUTO-CREATE PROFILE ON SIGNUP (TRIGGER)
-- =============================================================================

-- Function to create profile on signup
-- Handles email/password signups AND OAuth providers (Google, Discord)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_username TEXT;
  v_avatar_url TEXT;
BEGIN
  -- Extract username from various OAuth providers or fallback to email prefix
  -- Priority: username (email signup) > name (Google) > full_name (Discord) > global_name (Discord) > email prefix
  v_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'global_name',
    split_part(NEW.email, '@', 1)
  );

  -- Extract avatar URL from various OAuth providers
  -- Google uses 'picture', Discord uses 'avatar_url'
  v_avatar_url := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture'
  );

  INSERT INTO public.profiles (id, email, username, avatar_url, is_admin, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    v_username,
    v_avatar_url,
    FALSE,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    username = COALESCE(EXCLUDED.username, profiles.username),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- 2b. BACKFILL PROFILES FOR EXISTING USERS
-- =============================================================================
-- This ensures users who existed before this migration get a profile row
-- Uses same logic as trigger to handle OAuth providers (Google, Discord)
INSERT INTO public.profiles (id, email, username, avatar_url, is_admin, created_at, updated_at)
SELECT
  id,
  email,
  COALESCE(
    raw_user_meta_data->>'username',
    raw_user_meta_data->>'name',
    raw_user_meta_data->>'full_name',
    raw_user_meta_data->>'global_name',
    split_part(email, '@', 1)
  ),
  COALESCE(
    raw_user_meta_data->>'avatar_url',
    raw_user_meta_data->>'picture'
  ),
  FALSE,
  COALESCE(created_at, NOW()),
  NOW()
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 3. SERVERS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.servers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  port INTEGER NOT NULL DEFAULT 25565,
  description TEXT NOT NULL,
  short_description TEXT,
  game_modes TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  version TEXT NOT NULL DEFAULT '1.0',
  region TEXT NOT NULL,
  max_players INTEGER NOT NULL DEFAULT 100,
  current_players INTEGER DEFAULT 0,
  discord_url TEXT,
  website_url TEXT,
  banner_image_url TEXT,
  screenshots TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_online BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  votes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.servers ENABLE ROW LEVEL SECURITY;

-- Server policies
CREATE POLICY "Approved servers are viewable by everyone"
  ON public.servers FOR SELECT
  USING (status = 'approved' OR owner_id = auth.uid());

CREATE POLICY "Authenticated users can insert their own servers"
  ON public.servers FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own servers"
  ON public.servers FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own servers"
  ON public.servers FOR DELETE
  USING (auth.uid() = owner_id);

-- Admin policy for full access (using is_admin from profiles)
CREATE POLICY "Admins can do anything with servers"
  ON public.servers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_servers_owner_id ON public.servers(owner_id);
CREATE INDEX IF NOT EXISTS idx_servers_status ON public.servers(status);
CREATE INDEX IF NOT EXISTS idx_servers_created_at ON public.servers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_servers_votes ON public.servers(votes DESC);
CREATE INDEX IF NOT EXISTS idx_servers_views ON public.servers(views DESC);
CREATE INDEX IF NOT EXISTS idx_servers_region ON public.servers(region);
CREATE INDEX IF NOT EXISTS idx_servers_is_featured ON public.servers(is_featured) WHERE is_featured = TRUE;

-- =============================================================================
-- 4. SERVER_STATS TABLE (for tracking player counts over time)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.server_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID NOT NULL REFERENCES public.servers(id) ON DELETE CASCADE,
  player_count INTEGER DEFAULT 0,
  is_online BOOLEAN DEFAULT FALSE,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.server_stats ENABLE ROW LEVEL SECURITY;

-- Stats policies
CREATE POLICY "Server stats are viewable by everyone"
  ON public.server_stats FOR SELECT
  USING (true);

CREATE POLICY "Only system can insert stats"
  ON public.server_stats FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.is_admin = TRUE
    )
  );

-- Index for queries
CREATE INDEX IF NOT EXISTS idx_server_stats_server_id ON public.server_stats(server_id);
CREATE INDEX IF NOT EXISTS idx_server_stats_recorded_at ON public.server_stats(recorded_at DESC);

-- =============================================================================
-- 5. VOTES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  server_id UUID NOT NULL REFERENCES public.servers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, server_id)
);

-- Enable RLS
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Votes policies
CREATE POLICY "Votes are viewable by everyone"
  ON public.votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert their own votes"
  ON public.votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes"
  ON public.votes FOR DELETE
  USING (auth.uid() = user_id);

-- Index
CREATE INDEX IF NOT EXISTS idx_votes_server_id ON public.votes(server_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON public.votes(user_id);

-- =============================================================================
-- 6. FAVORITES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  server_id UUID NOT NULL REFERENCES public.servers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, server_id)
);

-- Enable RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Favorites policies
CREATE POLICY "Users can view their own favorites"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert their own favorites"
  ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Index
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_server_id ON public.favorites(server_id);

-- =============================================================================
-- 7. HELPER FUNCTIONS
-- =============================================================================

-- Function to increment view count
CREATE OR REPLACE FUNCTION public.increment_views(server_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.servers
  SET views = views + 1, updated_at = NOW()
  WHERE id = server_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle voting (adds vote and updates server vote count)
CREATE OR REPLACE FUNCTION public.vote_for_server(p_server_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_id UUID;
  v_existing BOOLEAN;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Check if already voted
  SELECT EXISTS(SELECT 1 FROM public.votes WHERE user_id = v_user_id AND server_id = p_server_id) INTO v_existing;

  IF v_existing THEN
    -- Remove vote
    DELETE FROM public.votes WHERE user_id = v_user_id AND server_id = p_server_id;
    UPDATE public.servers SET votes = votes - 1, updated_at = NOW() WHERE id = p_server_id;
    RETURN FALSE;
  ELSE
    -- Add vote
    INSERT INTO public.votes (user_id, server_id) VALUES (v_user_id, p_server_id);
    UPDATE public.servers SET votes = votes + 1, updated_at = NOW() WHERE id = p_server_id;
    RETURN TRUE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has voted for a server
CREATE OR REPLACE FUNCTION public.has_voted(p_server_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM public.votes
    WHERE user_id = auth.uid() AND server_id = p_server_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment votes (used by API)
CREATE OR REPLACE FUNCTION public.increment_votes(server_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.servers
  SET votes = votes + 1, updated_at = NOW()
  WHERE id = server_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement votes (used by API)
CREATE OR REPLACE FUNCTION public.decrement_votes(server_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.servers
  SET votes = GREATEST(votes - 1, 0), updated_at = NOW()
  WHERE id = server_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 8. UPDATED_AT TRIGGER
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to profiles
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Apply to servers
DROP TRIGGER IF EXISTS set_servers_updated_at ON public.servers;
CREATE TRIGGER set_servers_updated_at
  BEFORE UPDATE ON public.servers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- 9. GRANT PERMISSIONS
-- =============================================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant table permissions
GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT INSERT, UPDATE ON public.profiles TO authenticated;

GRANT SELECT ON public.servers TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.servers TO authenticated;

GRANT SELECT ON public.server_stats TO anon, authenticated;

GRANT SELECT, INSERT, DELETE ON public.votes TO authenticated;
GRANT SELECT ON public.votes TO anon;

GRANT SELECT, INSERT, DELETE ON public.favorites TO authenticated;

-- Grant function execute permissions
GRANT EXECUTE ON FUNCTION public.increment_views(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_votes(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.decrement_votes(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.vote_for_server(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_voted(UUID) TO authenticated;

-- =============================================================================
-- 10. STORAGE BUCKET FOR SERVER BANNERS
-- =============================================================================

-- Note: Run these in a separate SQL statement or via Supabase Dashboard
-- The storage schema may not be directly accessible via SQL Editor

-- Insert bucket if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'server-banners',
  'server-banners',
  TRUE,
  5242880, -- 5MB
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = TRUE,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

-- Storage policies for server-banners bucket
-- First drop existing policies if any
DROP POLICY IF EXISTS "Public read access for server banners" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload server banners" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own server banners" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own server banners" ON storage.objects;

-- Public read access
CREATE POLICY "Public read access for server banners"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'server-banners');

-- Authenticated users can upload to their own folder
CREATE POLICY "Authenticated users can upload server banners"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'server-banners'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can update their own files
CREATE POLICY "Users can update their own server banners"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'server-banners'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can delete their own files
CREATE POLICY "Users can delete their own server banners"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'server-banners'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- =============================================================================
-- END OF MIGRATION
-- =============================================================================
