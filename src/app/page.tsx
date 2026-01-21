import { Suspense } from 'react';
import { getServers, getFeaturedServers } from '@/lib/servers';
import FeaturedServers from '@/components/servers/FeaturedServers';
import ServerListClient from '@/components/servers/ServerListClient';
import { ServerCardSkeleton } from '@/components/ui/Skeleton';
import { mockServers } from '@/lib/mockServers';

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  const [featuredServers, { data: servers, count, totalPages }] = await Promise.all([
    getFeaturedServers(),
    getServers({ page: 1, pageSize: 12 }),
  ]);

  // Use mock servers if no real servers exist
  const displayServers = servers.length > 0 ? servers : mockServers;
  const displayCount = servers.length > 0 ? count : mockServers.length;
  const displayTotalPages = servers.length > 0 ? totalPages : 1;
  const isMockData = servers.length === 0;

  return (
    <div className="min-h-screen">
      <div className="container-wide py-6 lg:py-10">
        {/* Page Header - Simple and Clean */}
        <header className="mb-8 lg:mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
            List of Hytale Servers
          </h1>
          <p className="text-[#8899aa] text-base lg:text-lg max-w-2xl">
            Find the best Hytale servers to play on. Browse by game mode, vote for your favorites, and join the community.
          </p>
          {isMockData && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Showing example servers — Real servers coming soon!
            </div>
          )}
        </header>

        {/* Featured Servers Section */}
        {featuredServers.length > 0 && (
          <section className="mb-12 lg:mb-16">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl lg:text-2xl font-bold text-white">Featured Servers</h2>
              <span className="px-2 py-0.5 text-xs font-semibold bg-amber-500/20 text-amber-400 rounded">
                PROMOTED
              </span>
            </div>
            <FeaturedServers servers={featuredServers} />
          </section>
        )}

        {/* All Servers Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-white">
              All Servers
              <span className="ml-3 text-base font-normal text-[#8899aa]">
                {displayCount} {displayCount === 1 ? 'server' : 'servers'}
              </span>
            </h2>
          </div>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 75}ms` }}>
                    <ServerCardSkeleton />
                  </div>
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
