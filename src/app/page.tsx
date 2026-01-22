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
    <main style={{ minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ paddingTop: '40px', paddingBottom: '24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
            Hytale Server List
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#7d8590', maxWidth: '32rem', marginBottom: '12px' }}>
            Find servers to play on. Browse by game mode, vote for your favorites.
          </p>
          {isMockData && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 8px',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '4px',
              color: '#fbbf24',
              fontSize: '11px',
              fontWeight: 500
            }}>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#fbbf24' }} />
              Demo servers — DB not connected
            </span>
          )}
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '24px 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
          {/* Featured */}
          {featuredServers.length > 0 && (
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>Featured</h2>
                <span style={{
                  padding: '2px 6px',
                  fontSize: '9px',
                  fontWeight: 600,
                  background: 'rgba(212, 160, 51, 0.2)',
                  color: '#d4a033',
                  borderRadius: '4px',
                  textTransform: 'uppercase'
                }}>
                  Promoted
                </span>
              </div>
              <FeaturedServers servers={featuredServers} />
            </div>
          )}

          {/* All Servers Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>All Servers</h2>
            <span style={{ fontSize: '0.75rem', color: '#7d8590' }}>{displayCount} servers</span>
          </div>

          {/* Server List with Controls */}
          <Suspense
            fallback={
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px'
              }}>
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
        </div>
      </section>
    </main>
  );
}
