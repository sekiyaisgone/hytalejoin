'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User, LogOut, Settings, Server, Shield, Plus } from 'lucide-react';
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

  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
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
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4a033] to-[#a67c20] flex items-center justify-center">
            <Server className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white">
            Hytale<span className="text-[#d4a033]">Join</span>
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
                <Link href="/servers/new">
                  <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                    Add Server
                  </Button>
                </Link>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg text-[#8899aa] hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#1a2535] flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                  </button>

                  {isProfileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsProfileOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-[#151f2e] border border-white/10 rounded-xl shadow-xl z-20 py-2">
                        <div className="px-4 py-3 border-b border-white/5">
                          <p className="text-sm font-medium text-white truncate">
                            {user.email}
                          </p>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/dashboard"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#8899aa] hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <Server className="w-4 h-4" />
                            My Servers
                          </Link>
                          <Link
                            href="/dashboard/settings"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#8899aa] hover:text-white hover:bg-white/5 transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            Settings
                          </Link>
                          {isAdmin && (
                            <Link
                              href="/admin"
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#d4a033] hover:bg-white/5 transition-colors"
                            >
                              <Shield className="w-4 h-4" />
                              Admin Panel
                            </Link>
                          )}
                        </div>
                        <div className="border-t border-white/5 pt-1 mt-1">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
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
                  Sign Up
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
                      className="px-3 py-2 rounded text-sm font-medium text-[#d4a033] hover:bg-white/5 transition-colors"
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
