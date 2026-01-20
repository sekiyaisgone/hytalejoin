'use client';

import { Server } from '@/types';
import ServerCard from './ServerCard';
import { Star } from 'lucide-react';

interface FeaturedServersProps {
  servers: Server[];
}

export default function FeaturedServers({ servers }: FeaturedServersProps) {
  if (servers.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-6">
        <Star className="w-5 h-5 text-[#d29f32] fill-[#d29f32]" />
        <h2 className="text-xl font-semibold text-[#e8f0f8]">Featured Servers</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servers.map((server, index) => (
          <div
            key={server.id}
            className="animate-fade-in relative"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gold border glow effect for featured */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#d29f32] to-[#b59553] rounded-xl opacity-50 blur-sm" />
            <div className="relative">
              <ServerCard server={server} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
