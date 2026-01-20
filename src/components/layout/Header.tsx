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
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0f1923]/95 backdrop-blur-lg border-b border-[rgba(255,255,255,0.05)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#d29f32] to-[#b59553] flex items-center justify-center shadow-lg">
              <Server className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#e8f0f8] group-hover:text-[#d29f32] transition-colors">
              Hytale<span className="text-[#d29f32]">Join</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-[#d29f32]'
                    : 'text-[#8fa3b8] hover:text-[#e8f0f8]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
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
                    className="flex items-center gap-2 p-2 rounded-lg text-[#8fa3b8] hover:text-[#e8f0f8] hover:bg-[#1a2f4a] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#1a2f4a] flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                  </button>

                  {isProfileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsProfileOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-[#15243a] border border-[rgba(255,255,255,0.08)] rounded-xl shadow-xl z-20 py-2 animate-fade-in">
                        <div className="px-4 py-2 border-b border-[rgba(255,255,255,0.08)]">
                          <p className="text-sm font-medium text-[#e8f0f8] truncate">
                            {user.email}
                          </p>
                        </div>
                        <Link
                          href="/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-[#8fa3b8] hover:text-[#e8f0f8] hover:bg-[#1a2f4a] transition-colors"
                        >
                          <Server className="w-4 h-4" />
                          My Servers
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-[#8fa3b8] hover:text-[#e8f0f8] hover:bg-[#1a2f4a] transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-[#d29f32] hover:bg-[#1a2f4a] transition-colors"
                          >
                            <Shield className="w-4 h-4" />
                            Admin Panel
                          </Link>
                        )}
                        <div className="border-t border-[rgba(255,255,255,0.08)] mt-2 pt-2">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-[#1a2f4a] transition-colors"
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
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-[#8fa3b8] hover:text-[#e8f0f8] hover:bg-[#1a2f4a] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[rgba(255,255,255,0.08)] animate-fade-in">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'text-[#d29f32] bg-[#1a2f4a]'
                      : 'text-[#8fa3b8] hover:text-[#e8f0f8] hover:bg-[#1a2f4a]'
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
                    className="px-4 py-2 rounded-lg text-sm font-medium text-[#8fa3b8] hover:text-[#e8f0f8] hover:bg-[#1a2f4a] transition-colors"
                  >
                    Add Server
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-[#8fa3b8] hover:text-[#e8f0f8] hover:bg-[#1a2f4a] transition-colors"
                  >
                    My Servers
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-[#d29f32] hover:bg-[#1a2f4a] transition-colors"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-left text-red-400 hover:bg-[#1a2f4a] transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-2 px-4 pt-2">
                  <Link href="/login" className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup" className="flex-1">
                    <Button size="sm" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
