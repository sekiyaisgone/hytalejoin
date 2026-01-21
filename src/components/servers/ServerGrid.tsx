'use client';

import { Server } from '@/types';
import ServerCard from './ServerCard';
import { ServerCardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';

interface ServerGridProps {
  servers: Server[];
  isLoading?: boolean;
  emptyVariant?: 'no-servers' | 'no-results';
  skeletonCount?: number;
}

export default function ServerGrid({
  servers,
  isLoading = false,
  emptyVariant = 'no-results',
  skeletonCount = 6,
}: ServerGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div
            key={i}
            className="animate-fade-in"
            style={{ animationDelay: `${i * 75}ms` }}
          >
            <ServerCardSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (servers.length === 0) {
    return <EmptyState variant={emptyVariant} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
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
