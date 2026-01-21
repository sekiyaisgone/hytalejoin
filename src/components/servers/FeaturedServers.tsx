'use client';

import { Server } from '@/types';
import ServerCard from './ServerCard';

interface FeaturedServersProps {
  servers: Server[];
}

export default function FeaturedServers({ servers }: FeaturedServersProps) {
  if (servers.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {servers.map((server, index) => (
        <div
          key={server.id}
          className="animate-fade-in relative"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Gold glow effect for featured servers */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-[#d4a033] via-[#f0c35a] to-[#d4a033] rounded-2xl opacity-30 blur-sm" />
          <div className="relative">
            <ServerCard server={server} featured />
          </div>
        </div>
      ))}
    </div>
  );
}
