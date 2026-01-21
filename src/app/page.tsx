import { Suspense } from 'react';
import { getServers, getFeaturedServers } from '@/lib/servers';
import FeaturedServers from '@/components/servers/FeaturedServers';
import ServerListClient from '@/components/servers/ServerListClient';
import { ServerCardSkeleton } from '@/components/ui/Skeleton';
import { mockServers } from '@/lib/mockServers';

export const revalidate = 60;

export default async function HomePage() {
  const [featuredServers, { data: servers, count, totalPages }] = await Promise.all([
    getFeaturedServers(),
    getServers({ page: 1, pageSize: 12 }),
  ]);

  const displayServers = servers.length > 0 ? servers : mockServers;
  const displayCount = servers.length > 0 ? count : mockServers.length;
  const displayTotalPages = servers.length > 0 ? totalPages : 1;
  const isMockData = servers.length === 0;

  return (
    <>
      {/* Hero */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
          Hytale Server List
        </h1>
        <p className="text-sm text-[#7d8590] max-w-lg mb-3">
          Find servers to play on. Browse by game mode, vote for your favorites.
        </p>
        {isMockData && (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded text-amber-400 text-[11px] font-medium">
            <span className="w-1 h-1 rounded-full bg-amber-400" />
            Demo servers — DB not connected
          </span>
        )}
      </div>

      {/* Content */}
      <div>
        {/* Featured */}
        {featuredServers.length > 0 && (
          <section className="py-4">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-sm font-semibold text-white">Featured</h2>
              <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-[#d4a033]/20 text-[#d4a033] rounded uppercase">
                Promoted
              </span>
            </div>
            <FeaturedServers servers={featuredServers} />
          </section>
        )}

        {/* All Servers */}
        <section className="py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">All Servers</h2>
            <span className="text-xs text-[#7d8590]">{displayCount} servers</span>
          </div>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ServerCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <ServerListClient
              initialServers={displayServers}
              initialCount={displayCount}
              initialTotalPages={displayTotalPages}
              useMockFallback={isMockData}
            />
          </Suspense>
        </section>
      </div>
    </>
  );
}
