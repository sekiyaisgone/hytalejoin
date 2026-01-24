'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User, LogOut, Settings, Server, Shield, Plus, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import Button from '@/components/ui/Button';

// Hytale-inspired shield logo
const HytaleLogo = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5b8def" />
        <stop offset="100%" stopColor="#4a7bd4" />
      </linearGradient>
      <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7ba3ff" />
        <stop offset="100%" stopColor="#5b8def" />
      </linearGradient>
    </defs>
    {/* Shield shape */}
    <path
      d="M16 2L4 7v9c0 7.5 5.1 14.5 12 16 6.9-1.5 12-8.5 12-16V7L16 2z"
      fill="url(#shieldGradient)"
    />
    {/* Inner shield border */}
    <path
      d="M16 4L6 8.2v7.3c0 6.3 4.3 12.2 10 13.5 5.7-1.3 10-7.2 10-13.5V8.2L16 4z"
      fill="#0d1520"
      fillOpacity="0.3"
    />
    {/* H letter */}
    <text
      x="16"
      y="21"
      textAnchor="middle"
      fontSize="14"
      fontWeight="bold"
      fill="white"
      fontFamily="system-ui, -apple-system, sans-serif"
    >
      H
    </text>
  </svg>
);

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Use maybeSingle() to avoid 406 error if profile doesn't exist yet
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .maybeSingle();
        setIsAdmin(profile?.is_admin || false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    setIsProfileOpen(false);
    window.location.href = '/';
  };

  const navLinks = [
    { href: '/', label: 'Servers' },
    { href: '/about', label: 'About' },
    { href: '/partners', label: 'Partners' },
  ];

  return (
    <header className="sticky top-0 z-50 h-16 bg-[#0a0e14]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo - Left */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <HytaleLogo />
          <span className="text-lg font-bold text-white">
            Hytale<span className="text-[#5b8def]">Join</span>
          </span>
        </Link>

        {/* Nav - Center (desktop) */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'text-white'
                  : 'text-[#7d8590] hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions - Right */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
            {user ? (
              <>
                <Link
                  href="/servers/new"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: 'white',
                    background: 'linear-gradient(135deg, #5b8def 0%, #4a7bd4 100%)',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(91, 141, 239, 0.2)',
                  }}
                >
                  <Plus style={{ width: '15px', height: '15px' }} />
                  Add Server ✨
                </Link>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '2px',
                      borderRadius: '50%',
                      background: 'transparent',
                      border: isProfileOpen ? '2px solid rgba(91, 141, 239, 0.5)' : '2px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3d5a80 0%, #293d52 100%)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: '#c8d4e0',
                      }}
                    >
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </button>

                  {isProfileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsProfileOpen(false)}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          right: 0,
                          marginTop: '8px',
                          width: '240px',
                          background: '#12161c',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '14px',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                          zIndex: 20,
                          overflow: 'hidden',
                        }}
                      >
                        {/* Email header */}
                        <div
                          style={{
                            padding: '14px 16px',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                          }}
                        >
                          <p
                            style={{
                              fontSize: '0.75rem',
                              color: '#6b7c8f',
                              marginBottom: '2px',
                            }}
                          >
                            Signed in as
                          </p>
                          <p
                            style={{
                              fontSize: '0.875rem',
                              fontWeight: 500,
                              color: '#f0f4f8',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {user.email}
                          </p>
                        </div>

                        {/* Menu items */}
                        <div style={{ padding: '6px' }}>
                          <Link
                            href="/dashboard"
                            onClick={() => setIsProfileOpen(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '10px 12px',
                              borderRadius: '8px',
                              fontSize: '0.875rem',
                              color: '#c8d4e0',
                              textDecoration: 'none',
                              transition: 'background 0.15s ease',
                            }}
                            className="hover:bg-white/5"
                          >
                            <Server style={{ width: '16px', height: '16px', color: '#6b7c8f' }} />
                            Dashboard
                          </Link>
                          <Link
                            href="/dashboard/settings"
                            onClick={() => setIsProfileOpen(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '10px 12px',
                              borderRadius: '8px',
                              fontSize: '0.875rem',
                              color: '#c8d4e0',
                              textDecoration: 'none',
                              transition: 'background 0.15s ease',
                            }}
                            className="hover:bg-white/5"
                          >
                            <Settings style={{ width: '16px', height: '16px', color: '#6b7c8f' }} />
                            Settings
                          </Link>
                          {isAdmin && (
                            <Link
                              href="/admin"
                              onClick={() => setIsProfileOpen(false)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                color: '#5b8def',
                                textDecoration: 'none',
                                transition: 'background 0.15s ease',
                              }}
                              className="hover:bg-white/5"
                            >
                              <Shield style={{ width: '16px', height: '16px' }} />
                              Admin Panel
                            </Link>
                          )}
                        </div>

                        {/* Sign out */}
                        <div
                          style={{
                            padding: '6px',
                            borderTop: '1px solid rgba(255,255,255,0.06)',
                          }}
                        >
                          <button
                            onClick={handleSignOut}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              width: '100%',
                              padding: '10px 12px',
                              borderRadius: '8px',
                              fontSize: '0.875rem',
                              color: '#f87171',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'background 0.15s ease',
                            }}
                            className="hover:bg-red-500/10"
                          >
                            <LogOut style={{ width: '16px', height: '16px' }} />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link
                  href="/login"
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#8899aa',
                    textDecoration: 'none',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    transition: 'color 0.2s'
                  }}
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'white',
                    textDecoration: 'none',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #5b8def 0%, #4a7bd4 100%)',
                    boxShadow: '0 2px 8px rgba(91, 141, 239, 0.25)',
                    transition: 'transform 0.2s, box-shadow 0.2s'
                  }}
                >
                  Sign Up 🚀
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-[#8899aa] hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0a0e14]">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'text-white bg-white/10'
                      : 'text-[#7d8590] hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    href="/servers/new"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-3 py-2 rounded text-sm font-medium text-[#7d8590] hover:text-white transition-colors"
                  >
                    Add Server
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-3 py-2 rounded text-sm font-medium text-[#7d8590] hover:text-white transition-colors"
                  >
                    My Servers
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-3 py-2 rounded text-sm font-medium text-[#5b8def] hover:bg-white/5 transition-colors"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="px-3 py-2 rounded text-sm font-medium text-left text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link href="/login" className="flex-1">
                    <Button variant="secondary" size="sm" fullWidth>
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup" className="flex-1">
                    <Button size="sm" fullWidth>
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
