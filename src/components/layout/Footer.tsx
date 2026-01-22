import Link from 'next/link';
import { Server, Github, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#0a0f16' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '48px' }}>
          {/* Brand */}
          <div style={{ gridColumn: 'span 2' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', textDecoration: 'none' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #d4a033, #a67c20)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(212,160,51,0.3)'
              }}>
                <Server style={{ width: '20px', height: '20px', color: 'white' }} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f0f4f8' }}>
                Hytale<span style={{ color: '#d4a033' }}>Join</span>
              </span>
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
                href="https://github.com"
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
                aria-label="GitHub"
              >
                <Github style={{ width: '20px', height: '20px' }} />
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
