'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, LogOut, Settings, Server, Shield, Plus } from 'lucide-react';
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
      <div className="w-full h-full flex items-center justify-between px-4">
        {/* Left section: Logo + Nav */}
        <div className="flex items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logo.png"
              alt="HytaleJoin"
              width={36}
              height={36}
              className="object-contain"
            />
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8 ml-12">
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
        </div>

        {/* Right section: Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthLoading ? (
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
                      <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <p style={{ fontSize: '0.75rem', color: '#6b7c8f', marginBottom: '2px' }}>Signed in as</p>
                        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#f0f4f8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.email}
                        </p>
                      </div>

                      <div style={{ padding: '6px' }}>
                        <Link
                          href="/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#c8d4e0] hover:bg-white/5 transition-colors"
                        >
                          <Server className="w-4 h-4 text-[#6b7c8f]" />
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#c8d4e0] hover:bg-white/5 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-[#6b7c8f]" />
                          Settings
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#5b8def] hover:bg-white/5 transition-colors"
                          >
                            <Shield className="w-4 h-4" />
                            Admin Panel
                          </Link>
                        )}
                      </div>

                      <div style={{ padding: '6px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
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
