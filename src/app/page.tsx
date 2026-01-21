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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-white/5 bg-gradient-to-b from-[#0d1117] to-transparent">
        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
            Hytale Server List
          </h1>
          <p className="text-[#8899aa] text-base lg:text-lg max-w-xl mb-4">
            Discover the best Hytale servers. Browse by game mode, vote for your favorites, and join the community.
          </p>
          {isMockData && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Demo servers — Database not connected
            </span>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Featured Servers */}
        {featuredServers.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-lg font-semibold text-white">Featured</h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-[#d4a033]/20 text-[#d4a033] rounded uppercase tracking-wide">
                Promoted
              </span>
            </div>
            <FeaturedServers servers={featuredServers} />
          </section>
        )}

        {/* All Servers Section */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white">All Servers</h2>
            <span className="text-sm text-[#6b7280]">
              {displayCount} {displayCount === 1 ? 'server' : 'servers'}
            </span>
          </div>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
    </div>
  );
}
