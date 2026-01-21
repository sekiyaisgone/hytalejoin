import Link from 'next/link';
import { Server, Github, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[rgba(255,255,255,0.06)] bg-[#0a0f16]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4a033] to-[#a67c20] flex items-center justify-center shadow-[0_2px_8px_rgba(212,160,51,0.3)]">
                <Server className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#f0f4f8]">
                Hytale<span className="text-[#d4a033]">Join</span>
              </span>
            </Link>
            <p className="text-[#7a8fa6] text-sm max-w-md mb-6 leading-relaxed">
              Discover and join the best Hytale servers. Find communities that match your playstyle
              and connect with players from around the world.
            </p>
            <div className="flex gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl text-[#7a8fa6] hover:text-[#d4a033] bg-[#151f2e] border border-[rgba(255,255,255,0.06)] hover:border-[#d4a033]/30 transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl text-[#7a8fa6] hover:text-[#d4a033] bg-[#151f2e] border border-[rgba(255,255,255,0.06)] hover:border-[#d4a033]/30 transition-all duration-200"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-[#f0f4f8] uppercase tracking-wider mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-[#7a8fa6] hover:text-[#d4a033] transition-colors"
                >
                  Browse Servers
                </Link>
              </li>
              <li>
                <Link
                  href="/servers/new"
                  className="text-sm text-[#7a8fa6] hover:text-[#d4a033] transition-colors"
                >
                  Add Your Server
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-[#7a8fa6] hover:text-[#d4a033] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/partners"
                  className="text-sm text-[#7a8fa6] hover:text-[#d4a033] transition-colors"
                >
                  Partners
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-[#f0f4f8] uppercase tracking-wider mb-5">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-[#7a8fa6] hover:text-[#d4a033] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-[#7a8fa6] hover:text-[#d4a033] transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-[#7a8fa6] hover:text-[#d4a033] transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-[rgba(255,255,255,0.06)]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#7a8fa6]">
              &copy; {currentYear} HytaleJoin. All rights reserved.
            </p>
            <p className="text-xs text-[#4a5d73]">
              Not affiliated with Hypixel Studios or Riot Games.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
