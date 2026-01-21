-- HytaleJoin Seed Data
-- Run this AFTER schema.sql to populate initial demo servers
-- These servers will be displayed on the site once the database is set up

-- First, create a system user for demo servers (you'll need to create this user in Supabase Auth first)
-- Or use an existing admin user's ID

-- Insert demo servers (using a placeholder owner_id - replace with real user ID after signup)
-- NOTE: You must first create a user account and get their ID, then run:
-- UPDATE servers SET owner_id = 'your-user-id-here' WHERE owner_id = '00000000-0000-0000-0000-000000000000';

INSERT INTO servers (
  id, owner_id, name, ip_address, port, description, short_description,
  game_modes, tags, version, region, max_players, current_players,
  discord_url, website_url, banner_image_url, status, is_online, is_featured, votes, views
) VALUES
(
  'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
  '00000000-0000-0000-0000-000000000000',
  'Hynetic',
  'play.hynetic.com',
  25565,
  'Server ONLINE! Hynetic is a modern Hytale minigame server featuring unique game modes, custom maps, and an active community. Join us for endless fun!',
  'Modern Hytale minigame server with unique modes',
  ARRAY['pvp', 'mini-games', 'pve']::game_mode[],
  ARRAY['minigames', 'competitive', 'events'],
  '1.0.0',
  'north-america',
  500,
  127,
  'https://discord.gg/hynetic',
  'https://hynetic.com',
  NULL,
  'approved',
  true,
  true,
  418,
  12500
),
(
  'b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e',
  '00000000-0000-0000-0000-000000000000',
  '2b2t Hytale',
  '2b2t.hytale.org',
  25565,
  'We''ve recreated the same Minecraft 2b2t server in Hytale. We''re pleased to announce the oldest anarchy server is now available!',
  'The oldest anarchy server, now in Hytale',
  ARRAY['pvp', 'survival', 'vanilla']::game_mode[],
  ARRAY['anarchy', 'no-rules', 'hardcore'],
  '1.0.0',
  'north-america',
  1000,
  342,
  'https://discord.gg/2b2thytale',
  NULL,
  NULL,
  'approved',
  true,
  false,
  212,
  15600
),
(
  'c3d4e5f6-a7b8-6c7d-0e1f-2a3b4c5d6e7f',
  '00000000-0000-0000-0000-000000000000',
  'HytalePVP',
  'hytalepvp.net',
  25565,
  'Competitive PvP server with ranked matches, tournaments, and custom game modes. Prove your skills against the best!',
  'Competitive PvP with ranked matches',
  ARRAY['pvp', 'mini-games']::game_mode[],
  ARRAY['pvp', 'ranked', 'tournaments'],
  '1.0.0',
  'north-america',
  600,
  234,
  'https://discord.gg/hytalepvp',
  'https://hytalepvp.net',
  NULL,
  'approved',
  true,
  true,
  312,
  11200
),
(
  'd4e5f6a7-b8c9-7d8e-1f2a-3b4c5d6e7f8a',
  '00000000-0000-0000-0000-000000000000',
  'Hytale Box',
  'play.hytalebox.com',
  25565,
  'Hytale Box es un servidor hispano totalmente dedicado a la comunidad hispanohablante. Ofrecemos survival, PvP y mucho mas!',
  'Servidor hispano con survival y PvP',
  ARRAY['roleplay', 'pvp', 'survival', 'pve']::game_mode[],
  ARRAY['spanish', 'community', 'survival'],
  '1.0.0',
  'south-america',
  200,
  NULL,
  'https://discord.gg/hytalebox',
  'https://hytalebox.com',
  NULL,
  'approved',
  false,
  false,
  261,
  8900
),
(
  'e5f6a7b8-c9d0-8e9f-2a3b-4c5d6e7f8a9b',
  '00000000-0000-0000-0000-000000000000',
  'AnarchyHQ',
  'anarchyhq.com',
  25565,
  'ANARCHY HQ - Hytales Most Hostile Server! No rules, no admins, pure chaos. Survive if you can in this lawless world.',
  'No rules anarchy server - pure chaos',
  ARRAY['pvp', 'survival', 'vanilla']::game_mode[],
  ARRAY['anarchy', 'chaos', 'no-rules'],
  '1.0.0',
  'europe',
  500,
  89,
  NULL,
  'https://anarchyhq.com',
  NULL,
  'approved',
  true,
  false,
  156,
  7200
),
(
  'f6a7b8c9-d0e1-9f0a-3b4c-5d6e7f8a9b0c',
  '00000000-0000-0000-0000-000000000000',
  'SkyRealms',
  'skyrealms.gg',
  25565,
  'Ultimate Skyblock experience in Hytale! Custom islands, challenges, and competitive leaderboards. Build your empire in the sky!',
  'Ultimate skyblock experience',
  ARRAY['skyblock', 'survival']::game_mode[],
  ARRAY['skyblock', 'competitive', 'islands'],
  '1.0.0',
  'asia',
  400,
  156,
  'https://discord.gg/skyrealms',
  'https://skyrealms.gg',
  NULL,
  'approved',
  true,
  false,
  187,
  6800
);

-- Note: After running this seed, you should:
-- 1. Create an admin user account through the signup page
-- 2. Run: UPDATE profiles SET is_admin = true WHERE email = 'your-admin-email@example.com';
-- 3. Update the servers' owner_id to a real user:
--    UPDATE servers SET owner_id = (SELECT id FROM profiles WHERE email = 'your-admin-email@example.com');
