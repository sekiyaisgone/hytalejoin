import { Suspense } from 'react';
import { getServers, getFeaturedServers } from '@/lib/servers';
import FeaturedServers from '@/components/servers/FeaturedServers';
import ServerListClient from '@/components/servers/ServerListClient';
import { ServerCardSkeleton } from '@/components/ui/Skeleton';
import { Search, Sparkles, Server, Users, Globe } from 'lucide-react';

export const revalidate = 60; // Revalidate every minute

// Stats component
function StatsBar() {
  return (
    <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-12">
      {[
        { icon: Server, label: 'Servers', value: '150+' },
        { icon: Users, label: 'Players', value: '10K+' },
        { icon: Globe, label: 'Regions', value: '6' },
      ].map((stat) => (
        <div key={stat.label} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#d4a033]/10 flex items-center justify-center">
            <stat.icon className="w-5 h-5 text-[#d4a033]" />
          </div>
          <div>
            <div className="text-xl font-bold text-[#f0f4f8]">{stat.value}</div>
            <div className="text-xs text-[#7a8fa6] uppercase tracking-wide">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Hero section component
function HeroSection() {
  return (
    <section className="relative text-center pt-8 pb-12 mb-8">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#d4a033]/10 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-[#38bdf8]/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-1/4 w-[250px] h-[250px] bg-[#d4a033]/5 rounded-full blur-[80px]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-[#d4a033]/10 border border-[#d4a033]/20 text-[#f0c35a] text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          Discover the Best Hytale Servers
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#f0f4f8] mb-6 tracking-tight">
          Find Your Perfect{' '}
          <span className="gradient-text">Hytale Server</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-[#7a8fa6] max-w-2xl mx-auto mb-10 leading-relaxed">
          Browse through our curated collection of Hytale servers and find
          communities that match your playstyle.
        </p>

        {/* Glass Search Bar (decorative - actual search is in filters) */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#d4a033]/20 via-[#38bdf8]/10 to-[#d4a033]/20 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative flex items-center bg-[rgba(15,23,32,0.8)] backdrop-blur-xl border border-[rgba(255,255,255,0.1)] rounded-2xl px-6 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <Search className="w-5 h-5 text-[#7a8fa6] mr-4" />
              <span className="text-[#4a5d73] text-base">Search servers by name, gamemode, or region...</span>
              <div className="ml-auto flex items-center gap-2">
                <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-medium text-[#7a8fa6] bg-[#1a2942] rounded-md border border-[rgba(255,255,255,0.06)]">
                  Ctrl K
                </kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {['PVP', 'Survival', 'Creative', 'Mini-Games', 'RPG', 'Adventure'].map((mode) => (
            <button
              key={mode}
              className="px-4 py-2 text-sm font-medium rounded-full bg-[#1a2942] text-[#7a8fa6] border border-[rgba(255,255,255,0.06)] hover:text-[#f0f4f8] hover:border-[rgba(255,255,255,0.1)] hover:bg-[#1a2942]/80 transition-all duration-200"
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Stats */}
        <StatsBar />
      </div>
    </section>
  );
}

// Section header component
function SectionHeader({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-3 mb-8">
      {Icon && (
        <div className="w-10 h-10 rounded-xl bg-[#d4a033]/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#d4a033]" />
        </div>
      )}
      <div>
        <h2 className="text-2xl font-bold text-[#f0f4f8]">{title}</h2>
        {subtitle && (
          <p className="text-sm text-[#7a8fa6] mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

export default async function HomePage() {
  const [featuredServers, { data: servers, count, totalPages }] = await Promise.all([
    getFeaturedServers(),
    getServers({ page: 1, pageSize: 12 }),
  ]);

  return (
    <div className="min-h-screen">
      <div className="container-wide py-8">
        {/* Hero Section */}
        <HeroSection />

        {/* Featured Servers */}
        {featuredServers.length > 0 && (
          <section className="mb-16">
            <SectionHeader
              title="Featured Servers"
              subtitle="Hand-picked servers with the best experiences"
              icon={Sparkles}
            />
            <FeaturedServers servers={featuredServers} />
          </section>
        )}

        {/* All Servers */}
        <section>
          <SectionHeader
            title="All Servers"
            subtitle={`${count || 0} servers available`}
            icon={Server}
          />
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="animate-fade-in"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <ServerCardSkeleton />
                  </div>
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
    </div>
  );
}
