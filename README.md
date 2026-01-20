# HytaleJoin - Hytale Server Listing Platform

A modern, production-ready Hytale server listing website built with Next.js 14, Tailwind CSS, and Supabase.

## Features

- **Server Listings**: Browse, search, and filter Hytale servers
- **User Authentication**: Email/password, Google, and Discord OAuth
- **Server Management**: Submit, edit, and manage your servers
- **Admin Panel**: Approve/reject servers, manage users, feature servers
- **Real-time Stats**: Player counts, votes, and view tracking
- **Modern UI**: Dark theme with glassmorphism design inspired by Hytale
- **Fully Responsive**: Mobile-first design
- **SEO Optimized**: Metadata, sitemap, and robots.txt included

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Language**: TypeScript
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/hytalejoin.git
cd hytalejoin
npm install
```

### 2. Supabase Setup

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)

2. **Run the database schema**:
   - Go to SQL Editor in your Supabase dashboard
   - Copy the contents of `supabase/schema.sql`
   - Paste and run the SQL

3. **Create storage buckets**:
   - Go to Storage in your Supabase dashboard
   - Create a bucket named `server-banners` (set to public)
   - Create a bucket named `server-screenshots` (set to public)
   - Run the storage policies from the schema.sql file

4. **Enable Authentication providers**:
   - Go to Authentication > Providers
   - Enable Email (already enabled by default)
   - Enable Google OAuth:
     - Get credentials from [Google Cloud Console](https://console.cloud.google.com)
     - Add redirect URL: `https://your-project.supabase.co/auth/v1/callback`
   - Enable Discord OAuth:
     - Get credentials from [Discord Developer Portal](https://discord.com/developers/applications)
     - Add redirect URL: `https://your-project.supabase.co/auth/v1/callback`

5. **Get your API keys**:
   - Go to Settings > API
   - Copy the `Project URL` and `anon public` key

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=HytaleJoin
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/hytalejoin.git
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (set to your production URL)
5. Click "Deploy"

### 3. Connect Custom Domain

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add `hytalejoin.com`
4. Update your DNS records:
   - Add an A record pointing to Vercel's IP
   - Or add a CNAME record pointing to `cname.vercel-dns.com`

### 4. Update Supabase Settings

After deployment, update these in Supabase:

1. **Site URL**:
   - Go to Authentication > URL Configuration
   - Set Site URL to `https://hytalejoin.com`

2. **Redirect URLs**:
   - Add `https://hytalejoin.com/auth/callback` to allowed redirect URLs

3. **OAuth Providers**:
   - Update Google and Discord redirect URLs to use your production domain

## Post-Deployment Setup

### Create Admin User

1. Sign up with your admin email
2. Go to Supabase SQL Editor
3. Run:
```sql
UPDATE profiles SET is_admin = true WHERE email = 'your-admin-email@example.com';
```

### Test Production Site

1. Visit your deployed URL
2. Test user signup and login
3. Submit a test server
4. Check admin panel at `/admin`
5. Approve the test server
6. Verify it appears on the homepage

## Project Structure

```
hytalejoin/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Auth pages (login, signup)
│   │   ├── admin/             # Admin panel pages
│   │   ├── api/               # API routes
│   │   ├── auth/              # Auth callbacks
│   │   ├── dashboard/         # User dashboard
│   │   ├── servers/           # Server pages
│   │   └── ...                # Other pages
│   ├── components/            # React components
│   │   ├── layout/           # Layout components
│   │   ├── servers/          # Server-related components
│   │   └── ui/               # Reusable UI components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   │   └── supabase/         # Supabase client setup
│   └── types/                 # TypeScript types
├── public/                    # Static assets
├── supabase/                  # Supabase schema
└── ...                        # Config files
```

## Key Files

- `src/app/layout.tsx` - Root layout with header/footer
- `src/app/page.tsx` - Homepage with server listing
- `src/lib/supabase/` - Supabase client configuration
- `src/middleware.ts` - Auth middleware for protected routes
- `supabase/schema.sql` - Database schema and RLS policies

## Customization

### Colors

Edit the CSS variables in `src/app/globals.css`:

```css
:root {
  --background: #0f1923;
  --accent-gold: #d29f32;
  /* ... more colors */
}
```

### Logo

Replace the Server icon in:
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`

### Metadata

Update SEO metadata in `src/app/layout.tsx`.

## API Reference

### Servers

- `GET /` - List servers (with filters)
- `POST /servers/new` - Create server (auth required)
- `GET /servers/[id]` - Get server details
- `POST /servers/edit/[id]` - Update server (owner only)

### Votes & Favorites

- `POST /api/servers/[id]/vote` - Toggle vote
- `POST /api/servers/[id]/favorite` - Toggle favorite

## Security

- **Row Level Security (RLS)**: All database tables have RLS policies
- **Auth Middleware**: Protected routes require authentication
- **Admin Checks**: Admin routes verify admin status
- **CSRF Protection**: Handled by Supabase Auth

## Database Schema

The schema includes:

- **profiles**: User profiles (extends Supabase auth)
- **servers**: Server listings with all metadata
- **server_stats**: Historical player count data
- **votes**: User votes on servers
- **favorites**: User favorite servers

See `supabase/schema.sql` for the complete schema with RLS policies.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `NEXT_PUBLIC_SITE_URL` | Site URL (for OAuth redirects) | Yes |
| `NEXT_PUBLIC_SITE_NAME` | Site name | No |

## Troubleshooting

### Common Issues

1. **Auth not working**: Check that redirect URLs are correctly configured in Supabase
2. **Database errors**: Ensure the schema.sql was run completely
3. **Images not loading**: Verify storage buckets are public and policies are set
4. **Admin access denied**: Confirm is_admin is set to true in profiles table

### Debug Mode

Set `DEBUG=true` in your environment to enable verbose logging.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Design inspired by [hytale.game/en/servers](https://hytale.game/en/servers/)
- Built with [Next.js](https://nextjs.org)
- Powered by [Supabase](https://supabase.com)
- Deployed on [Vercel](https://vercel.com)

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/hytalejoin/issues)
- **Email**: support@hytalejoin.com

---

Made with love for the Hytale community
