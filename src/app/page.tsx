import { Suspense } from 'react';
import { getServers, getFeaturedServers } from '@/lib/servers';
import FeaturedServers from '@/components/servers/FeaturedServers';
import ServerListClient from '@/components/servers/ServerListClient';
import { ServerCardSkeleton } from '@/components/ui/Skeleton';

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  const [featuredServers, { data: servers, count, totalPages }] = await Promise.all([
    getFeaturedServers(),
    getServers({ page: 1, pageSize: 12 }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#e8f0f8] mb-4">
          Find Your Perfect{' '}
          <span className="gradient-text">Hytale Server</span>
        </h1>
        <p className="text-lg text-[#8fa3b8] max-w-2xl mx-auto">
          Discover and join the best Hytale servers. Browse through our curated list of
          servers and find communities that match your playstyle.
        </p>
      </section>

      {/* Featured servers */}
      <FeaturedServers servers={featuredServers} />

      {/* All servers */}
      <section>
        <h2 className="text-2xl font-semibold text-[#e8f0f8] mb-6">All Servers</h2>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ServerCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <ServerListClient
            initialServers={servers}
            initialCount={count}
            initialTotalPages={totalPages}
          />
        </Suspense>
      </section>
    </div>
  );
}
