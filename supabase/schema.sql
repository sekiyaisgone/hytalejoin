-- HytaleJoin Database Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE server_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE game_mode AS ENUM (
  'pvp', 'survival', 'creative', 'mini-games', 'rpg',
  'adventure', 'roleplay', 'faction', 'skyblock', 'vanilla',
  'pve', 'multi-server'
);
CREATE TYPE region AS ENUM (
  'north-america', 'south-america', 'europe',
  'asia', 'oceania', 'africa'
);

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  username TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Servers table
CREATE TABLE servers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  port INTEGER NOT NULL DEFAULT 25565,
  description TEXT NOT NULL,
  short_description TEXT,
  game_modes game_mode[] NOT NULL DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  version TEXT NOT NULL DEFAULT '1.0',
  region region NOT NULL DEFAULT 'north-america',
  max_players INTEGER NOT NULL DEFAULT 100,
  current_players INTEGER,
  discord_url TEXT,
  website_url TEXT,
  banner_image_url TEXT,
  screenshots TEXT[] DEFAULT '{}',
  status server_status NOT NULL DEFAULT 'pending',
  is_online BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  votes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Server stats table (for historical data)
CREATE TABLE server_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  player_count INTEGER DEFAULT 0,
  is_online BOOLEAN DEFAULT true,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Votes table
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, server_id)
);

-- Favorites table
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  server_id UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, server_id)
);

-- Create indexes for better performance
CREATE INDEX idx_servers_owner_id ON servers(owner_id);
CREATE INDEX idx_servers_status ON servers(status);
CREATE INDEX idx_servers_is_featured ON servers(is_featured);
CREATE INDEX idx_servers_is_online ON servers(is_online);
CREATE INDEX idx_servers_votes ON servers(votes DESC);
CREATE INDEX idx_servers_views ON servers(views DESC);
CREATE INDEX idx_servers_created_at ON servers(created_at DESC);
CREATE INDEX idx_servers_game_modes ON servers USING GIN(game_modes);
CREATE INDEX idx_server_stats_server_id ON server_stats(server_id);
CREATE INDEX idx_server_stats_recorded_at ON server_stats(recorded_at DESC);
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_votes_server_id ON votes(server_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_server_id ON favorites(server_id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, username, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to increment views
CREATE OR REPLACE FUNCTION increment_views(server_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE servers SET views = views + 1 WHERE id = server_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment votes
CREATE OR REPLACE FUNCTION increment_votes(server_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE servers SET votes = votes + 1 WHERE id = server_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement votes
CREATE OR REPLACE FUNCTION decrement_votes(server_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE servers SET votes = GREATEST(votes - 1, 0) WHERE id = server_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update server updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on servers table
CREATE TRIGGER update_servers_updated_at
  BEFORE UPDATE ON servers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Trigger to update updated_at on profiles table
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE server_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Servers policies
CREATE POLICY "Approved servers are viewable by everyone"
  ON servers FOR SELECT
  USING (status = 'approved' OR owner_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  ));

CREATE POLICY "Authenticated users can insert servers"
  ON servers FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own servers"
  ON servers FOR UPDATE
  USING (owner_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  ));

CREATE POLICY "Users can delete their own servers"
  ON servers FOR DELETE
  USING (owner_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  ));

-- Server stats policies
CREATE POLICY "Server stats are viewable by everyone"
  ON server_stats FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert server stats"
  ON server_stats FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  ));

-- Votes policies
CREATE POLICY "Votes are viewable by everyone"
  ON votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote"
  ON votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own votes"
  ON votes FOR DELETE
  USING (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can add favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- Run these in the Supabase Dashboard > Storage

-- Create bucket for server banners
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('server-banners', 'server-banners', true);

-- Create bucket for server screenshots
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('server-screenshots', 'server-screenshots', true);

-- Storage policies (run in SQL Editor after creating buckets)
-- CREATE POLICY "Server banners are publicly accessible"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'server-banners');

-- CREATE POLICY "Authenticated users can upload server banners"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'server-banners' AND auth.role() = 'authenticated');

-- CREATE POLICY "Users can update their own banners"
--   ON storage.objects FOR UPDATE
--   USING (bucket_id = 'server-banners' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can delete their own banners"
--   ON storage.objects FOR DELETE
--   USING (bucket_id = 'server-banners' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Uncomment and run after creating your first admin user:
-- UPDATE profiles SET is_admin = true WHERE email = 'your-admin-email@example.com';
