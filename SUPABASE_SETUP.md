# HytaleJoin Supabase Setup Guide

This document provides step-by-step instructions to set up your Supabase database for HytaleJoin.

## Prerequisites

- Supabase project created at [supabase.com](https://supabase.com)
- Your Supabase project URL and anon key

---

## Step 1: Delete Existing Schema (Clean Slate)

If you have existing tables/policies, delete them first:

1. Go to **Supabase Dashboard > SQL Editor**
2. Run this cleanup script:

```sql
-- Drop storage policies first
DROP POLICY IF EXISTS "Public read access for server banners" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload server banners" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own server banners" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own server banners" ON storage.objects;

-- Drop storage bucket
DELETE FROM storage.buckets WHERE id = 'server-banners';

-- Drop triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS set_servers_updated_at ON public.servers;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_updated_at();
DROP FUNCTION IF EXISTS public.increment_views(UUID);
DROP FUNCTION IF EXISTS public.increment_votes(UUID);
DROP FUNCTION IF EXISTS public.decrement_votes(UUID);
DROP FUNCTION IF EXISTS public.vote_for_server(UUID);
DROP FUNCTION IF EXISTS public.has_voted(UUID);

-- Drop tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS public.favorites CASCADE;
DROP TABLE IF EXISTS public.votes CASCADE;
DROP TABLE IF EXISTS public.server_stats CASCADE;
DROP TABLE IF EXISTS public.servers CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
```

---

## Step 2: Run the Migration Script

1. Go to **Supabase Dashboard > SQL Editor**
2. Copy and paste the entire contents of `supabase/migrations/001_initial_schema.sql`
3. Click **Run**

This creates:
- `profiles` table (auto-created for each user via trigger)
- `servers` table (with all required columns)
- `votes` table
- `favorites` table
- `server_stats` table
- RLS policies for all tables
- Helper functions (increment_views, vote_for_server, etc.)
- Storage bucket `server-banners` with policies

---

## Step 3: Verify Storage Bucket

If the storage bucket wasn't created automatically:

1. Go to **Supabase Dashboard > Storage**
2. Click **New Bucket**
3. Name: `server-banners`
4. Check **Public bucket** (allows public read access)
5. Set file size limit: `5242880` (5MB)
6. Allowed MIME types: `image/png, image/jpeg, image/webp, image/gif`

Then run these storage policies manually if they weren't created:

```sql
-- Storage policies for server-banners bucket
CREATE POLICY "Public read access for server banners"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'server-banners');

CREATE POLICY "Authenticated users can upload server banners"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'server-banners'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own server banners"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'server-banners'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own server banners"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'server-banners'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

---

## Step 4: Set Environment Variables in Vercel

Ensure these environment variables are set in your Vercel project:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (e.g., `https://xxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

Optional (for server-side operations):
| Variable | Description |
|----------|-------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (if needed for admin operations) |

---

## Step 5: Verification Flow

Test the complete flow:

### 1. Create a new user
- Go to your site and click **Sign Up**
- Fill in email, username, password
- Check your email and confirm

### 2. Verify profile was auto-created
In Supabase Dashboard > Table Editor > `profiles`:
- You should see a row with your user's ID
- Username should be populated from sign-up form
- `is_admin` should be `false`

### 3. Test banner upload
- Go to `/servers/new`
- Try uploading a banner image
- Should upload to `server-banners/{user_id}/{timestamp}.ext`

### 4. Submit a server
- Fill out all required fields
- Click Submit
- Should insert into `servers` table with `status: 'pending'`

### 5. View server list
- Go to homepage
- Should show approved servers (none yet if fresh setup)

### 6. Make yourself admin (optional)
```sql
UPDATE public.profiles
SET is_admin = true
WHERE email = 'your-email@example.com';
```

Then you can access `/admin` to approve servers.

---

## Database Schema Summary

### profiles
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key, references auth.users |
| username | TEXT | Display name |
| email | TEXT | Email address |
| avatar_url | TEXT | Profile picture URL |
| is_admin | BOOLEAN | Admin flag (default false) |
| created_at | TIMESTAMPTZ | Created timestamp |
| updated_at | TIMESTAMPTZ | Last updated timestamp |

### servers
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| owner_id | UUID | References profiles |
| name | TEXT | Server name |
| ip_address | TEXT | Server IP/hostname |
| port | INTEGER | Server port (default 25565) |
| description | TEXT | Full description |
| short_description | TEXT | Brief tagline |
| game_modes | TEXT[] | Array of game modes |
| tags | TEXT[] | Custom tags |
| version | TEXT | Game version |
| region | TEXT | Server region |
| max_players | INTEGER | Maximum players |
| current_players | INTEGER | Current player count |
| discord_url | TEXT | Discord invite link |
| website_url | TEXT | Server website |
| banner_image_url | TEXT | Banner image URL |
| screenshots | TEXT[] | Screenshot URLs |
| status | TEXT | pending/approved/rejected |
| is_online | BOOLEAN | Online status |
| is_featured | BOOLEAN | Featured flag |
| votes | INTEGER | Vote count |
| views | INTEGER | View count |
| created_at | TIMESTAMPTZ | Created timestamp |
| updated_at | TIMESTAMPTZ | Last updated timestamp |

---

## Troubleshooting

### FK violation "servers_owner_id_fkey"
This means the profile row doesn't exist for the current user. Run this backfill:
```sql
-- Backfill profiles for existing users (supports OAuth providers)
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
```
This is now included in the migration script automatically.

### "406 Not Acceptable" on profiles query
- This means the profile row doesn't exist for the user
- The auto-create trigger should handle this for new users
- For existing users, run the backfill SQL above
- Verify the trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`

### "Could not find column" errors
- Schema cache might be stale
- Go to Supabase Dashboard > Settings > API > Click "Reload schema cache"

### Storage upload fails with 400
- Check bucket exists and is named exactly `server-banners`
- Check storage policies exist
- Make sure you're authenticated
- File path must start with user's UUID

### Auth redirect loop
- Clear browser cookies
- Check middleware.ts is using `maybeSingle()` not `single()`
- Hard refresh (Ctrl+Shift+R)

---

## OAuth Provider Setup (Google & Discord)

HytaleJoin supports signing in with Google and Discord. Follow these steps to enable OAuth.

### Step 1: Enable Providers in Supabase

1. Go to **Supabase Dashboard > Authentication > Providers**
2. Find **Google** and **Discord** in the list
3. Toggle each provider to **Enabled**

### Step 2: Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth client ID**
5. Select **Web application**
6. Configure the OAuth consent screen if prompted
7. Add authorized JavaScript origins:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
8. Add authorized redirect URIs:
   - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - Replace `YOUR_PROJECT_REF` with your Supabase project reference
9. Copy the **Client ID** and **Client Secret**
10. In Supabase Dashboard > Authentication > Providers > Google:
    - Paste the Client ID and Client Secret
    - Save

### Step 3: Set Up Discord OAuth

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **New Application** and give it a name
3. Go to **OAuth2** in the left sidebar
4. Copy the **Client ID** and **Client Secret**
5. Add redirect URLs:
   - `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - Replace `YOUR_PROJECT_REF` with your Supabase project reference
6. In Supabase Dashboard > Authentication > Providers > Discord:
   - Paste the Client ID and Client Secret
   - Save

### Step 4: Configure Redirect URLs

In Supabase Dashboard > Authentication > URL Configuration:
- **Site URL**: `https://yourdomain.com` (or `http://localhost:3000` for dev)
- **Redirect URLs**: Add all valid redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `https://yourdomain.com/auth/callback`

### OAuth Troubleshooting

#### "Provider not enabled" error
- Make sure the provider is toggled ON in Supabase Dashboard

#### Redirect mismatch error
- Ensure the redirect URL in your OAuth app matches exactly:
  `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
- Check both Google/Discord developer console AND Supabase settings

#### User created but no profile
- The `on_auth_user_created` trigger handles this automatically
- For OAuth users, username is extracted from their social profile
- If missing, run the profile backfill SQL from the troubleshooting section above

#### OAuth popup blocked
- Users may need to allow popups for your site
- The OAuth flow should work with redirects (not popups)

---

## Quick Reference: RLS Policies

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| profiles | Everyone | Own row | Own row | - |
| servers | Approved + own | Own rows | Own rows | Own rows |
| votes | Everyone | Own votes | - | Own votes |
| favorites | Own favorites | Own favorites | - | Own favorites |

Admins have full access to servers via separate policy.
