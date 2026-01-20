import Link from 'next/link';
import { Server, Github, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[rgba(255,255,255,0.08)] bg-[#0f1923]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#d29f32] to-[#b59553] flex items-center justify-center shadow-lg">
                <Server className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#e8f0f8]">
                Hytale<span className="text-[#d29f32]">Join</span>
              </span>
            </Link>
            <p className="text-[#8fa3b8] text-sm max-w-md mb-4">
              Discover and join the best Hytale servers. Find communities that match your playstyle
              and connect with players from around the world.
            </p>
            <div className="flex gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-[#8fa3b8] hover:text-[#d29f32] hover:bg-[#1a2f4a] transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-[#8fa3b8] hover:text-[#d29f32] hover:bg-[#1a2f4a] transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-[#e8f0f8] uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-[#8fa3b8] hover:text-[#d29f32] transition-colors"
                >
                  Browse Servers
                </Link>
              </li>
              <li>
                <Link
                  href="/servers/new"
                  className="text-sm text-[#8fa3b8] hover:text-[#d29f32] transition-colors"
                >
                  Add Your Server
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-[#8fa3b8] hover:text-[#d29f32] transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-[#e8f0f8] uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-[#8fa3b8] hover:text-[#d29f32] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-[#8fa3b8] hover:text-[#d29f32] transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-[#8fa3b8] hover:text-[#d29f32] transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[rgba(255,255,255,0.08)]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#8fa3b8]">
              &copy; {currentYear} HytaleJoin. All rights reserved.
            </p>
            <p className="text-xs text-[#8fa3b8]">
              Not affiliated with Hypixel Studios or Riot Games.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
