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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ServerCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (servers.length === 0) {
    return <EmptyState variant={emptyVariant} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {servers.map((server) => (
        <ServerCard key={server.id} server={server} />
      ))}
    </div>
  );
}
