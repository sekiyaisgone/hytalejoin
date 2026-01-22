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
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  isLoggedIn?: boolean;
}

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '16px',
  width: '100%',
};

export default function ServerGrid({
  servers,
  isLoading = false,
  emptyVariant = 'no-results',
  skeletonCount = 6,
  onClearFilters,
  hasActiveFilters = false,
  isLoggedIn = false,
}: ServerGridProps) {
  if (isLoading) {
    return (
      <div style={gridStyle}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ServerCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (servers.length === 0) {
    return (
      <EmptyState
        variant={emptyVariant}
        onClearFilters={onClearFilters}
        hasActiveFilters={hasActiveFilters}
        isLoggedIn={isLoggedIn}
      />
    );
  }

  return (
    <div style={gridStyle}>
      {servers.map((server) => (
        <ServerCard key={server.id} server={server} />
      ))}
    </div>
  );
}
