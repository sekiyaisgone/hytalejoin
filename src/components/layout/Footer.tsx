import Link from 'next/link';
import Image from 'next/image';
import { Twitter } from 'lucide-react';

// TikTok icon component
const TikTokIcon = ({ style }: { style?: React.CSSProperties }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ width: '20px', height: '20px', ...style }}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#0a0f16' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '48px' }}>
          {/* Brand */}
          <div style={{ gridColumn: 'span 2' }}>
            <Link href="/" style={{ display: 'inline-block', marginBottom: '20px' }}>
              <Image
                src="/logo.png"
                alt="HytaleJoin"
                width={48}
                height={48}
                style={{ objectFit: 'contain' }}
              />
            </Link>
            <p style={{ color: '#7a8fa6', fontSize: '0.875rem', maxWidth: '400px', marginBottom: '24px', lineHeight: 1.6 }}>
              Discover and join the best Hytale servers. Find communities that match your playstyle
              and connect with players from around the world.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '10px',
                  borderRadius: '12px',
                  color: '#7a8fa6',
                  background: '#151f2e',
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label="Twitter"
              >
                <Twitter style={{ width: '20px', height: '20px' }} />
              </a>
              <a
                href="https://tiktok.com/@hytalejoin"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '10px',
                  borderRadius: '12px',
                  color: '#7a8fa6',
                  background: '#151f2e',
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label="TikTok"
              >
                <TikTokIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f0f4f8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '20px' }}>
              Quick Links
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>
                <Link href="/" style={{ fontSize: '0.875rem', color: '#7a8fa6', textDecoration: 'none' }}>
                  Browse Servers
                </Link>
              </li>
              <li>
                <Link href="/servers/new" style={{ fontSize: '0.875rem', color: '#7a8fa6', textDecoration: 'none' }}>
                  Add Your Server
                </Link>
              </li>
              <li>
                <Link href="/about" style={{ fontSize: '0.875rem', color: '#7a8fa6', textDecoration: 'none' }}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/partners" style={{ fontSize: '0.875rem', color: '#7a8fa6', textDecoration: 'none' }}>
                  Partners
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f0f4f8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '20px' }}>
              Legal
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>
                <Link href="/privacy" style={{ fontSize: '0.875rem', color: '#7a8fa6', textDecoration: 'none' }}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" style={{ fontSize: '0.875rem', color: '#7a8fa6', textDecoration: 'none' }}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" style={{ fontSize: '0.875rem', color: '#7a8fa6', textDecoration: 'none' }}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ marginTop: '64px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: '0.875rem', color: '#7a8fa6', margin: 0 }}>
              &copy; {currentYear} HytaleJoin. All rights reserved.
            </p>
            <p style={{ fontSize: '0.75rem', color: '#4a5d73', margin: 0 }}>
              Not affiliated with Hypixel Studios or Riot Games.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
