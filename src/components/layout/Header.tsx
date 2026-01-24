'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, User, LogOut, Settings, Server, Shield, Plus, Sparkles, Search, Newspaper, Heart, LogIn } from 'lucide-react';
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
    { href: '/', label: 'Servers', icon: Server },
    { href: '/about', label: 'About', icon: Newspaper },
    { href: '/partners', label: 'Partners', icon: Heart },
  ];

  return (
    <header className="sticky top-0 z-50 h-14 bg-[#0a0e14] border-b border-white/10">
      <div className="w-full h-full flex items-center px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0 mr-8">
          <Image
            src="/logo.png"
            alt="HytaleJoin"
            width={32}
            height={32}
            className="object-contain"
          />
        </Link>

        {/* Nav with icons */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname === link.href
                    ? 'text-[#d4a033]'
                    : 'text-[#8899aa] hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}

          {/* Add Server in nav when logged in */}
          {user && (
            <Link
              href="/servers/new"
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname === '/servers/new'
                  ? 'text-[#d4a033]'
                  : 'text-[#8899aa] hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Add Server
            </Link>
          )}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthLoading ? (
            <div style={{ width: '80px', height: '36px' }} />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#d4a033]/50 text-[#d4a033] hover:bg-[#d4a033]/10 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Profile</span>
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
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-md border border-[#d4a033]/50 text-[#d4a033] hover:bg-[#d4a033]/10 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span className="text-sm font-medium">Login</span>
            </Link>
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
          <div className="px-4 py-4">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? 'text-[#d4a033] bg-[#d4a033]/10'
                        : 'text-[#7d8590] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
              {user ? (
                <>
                  <Link
                    href="/servers/new"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#7d8590] hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    Add Server
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#7d8590] hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <Server className="w-4 h-4" />
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#5b8def] hover:bg-white/5 transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#d4a033] hover:bg-[#d4a033]/10 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
