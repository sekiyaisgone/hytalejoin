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
      <section style={{ paddingTop: '32px', paddingBottom: '0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f0f4f8', margin: 0 }}>
              🎮 Hytale Server List
            </h1>
            {isMockData && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 8px',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: '6px',
                color: '#fbbf24',
                fontSize: '0.6875rem',
                fontWeight: 500
              }}>
                <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#fbbf24' }} />
                Demo
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.875rem', color: '#6b7c8f', maxWidth: '28rem', margin: 0 }}>
            Find servers to play on. Browse by game mode, vote for your favorites.
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '24px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          {/* Featured */}
          {featuredServers.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#c8d4e0', margin: 0 }}>⭐ Featured</h2>
                <span style={{
                  padding: '2px 6px',
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  background: 'rgba(91, 141, 239, 0.15)',
                  color: '#7bb0ff',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em'
                }}>
                  Promoted
                </span>
              </div>
              <FeaturedServers servers={featuredServers} />
            </div>
          )}

          {/* All Servers Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#c8d4e0', margin: 0 }}>🌍 All Servers</h2>
            <span style={{ fontSize: '0.75rem', color: '#6b7c8f' }}>{displayCount} servers</span>
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
