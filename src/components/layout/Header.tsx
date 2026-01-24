'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, User, LogOut, Settings, Server, Shield, Plus, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import Button from '@/components/ui/Button';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      try {
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
      } finally {
        setIsAuthLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (!session?.user) {
        setIsAdmin(false);
      }
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
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center">
        {/* Logo - Left */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo.png"
            alt="HytaleJoin"
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="text-lg font-bold text-white">
            Hytale<span className="text-[#5b8def]">Join</span>
          </span>
        </Link>

        {/* Nav - After logo */}
        <nav className="hidden md:flex items-center gap-6 ml-10">
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

        {/* Spacer to push actions to far right */}
        <div className="flex-1" />

        {/* Actions - Far Right */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
            {isAuthLoading ? (
              // Loading placeholder to prevent layout shift
              <div style={{ width: '150px', height: '38px' }} />
            ) : user ? (
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
