'use client';

import { Server } from '@/types';
import ServerCard from './ServerCard';
import { ServerCardSkeleton } from '@/components/ui/Skeleton';

interface ServerGridProps {
  servers: Server[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function ServerGrid({
  servers,
  isLoading = false,
  emptyMessage = 'No servers found',
}: ServerGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ServerCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (servers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-24 h-24 mb-6 rounded-full bg-[#1a2f4a] flex items-center justify-center">
          <svg
            className="w-12 h-12 text-[#8fa3b8]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-[#e8f0f8] mb-2">
          {emptyMessage}
        </h3>
        <p className="text-[#8fa3b8] text-center max-w-md">
          Try adjusting your search or filters to find what you&apos;re looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {servers.map((server, index) => (
        <div
          key={server.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ServerCard server={server} />
        </div>
      ))}
    </div>
  );
}
