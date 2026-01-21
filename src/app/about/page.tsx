import { Metadata } from 'next';
import { Server, Shield, Users, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about HytaleJoin - the best place to find and list Hytale servers.',
};

export default function AboutPage() {
  const features = [
    {
      icon: Server,
      title: 'Server Discovery',
      description:
        'Browse through our curated list of Hytale servers. Filter by game mode, region, and more to find your perfect match.',
    },
    {
      icon: Shield,
      title: 'Quality Assurance',
      description:
        'Every server submission is reviewed by our team to ensure quality and prevent spam or malicious listings.',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description:
        'Vote for your favorite servers, leave reviews, and help the community find the best places to play.',
    },
    {
      icon: Zap,
      title: 'Real-time Stats',
      description:
        'See live player counts, uptime statistics, and server status to know exactly what to expect before joining.',
    },
  ];

  return (
    <div className="min-h-screen py-12 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            About <span className="text-[#d4a033]">HytaleJoin</span>
          </h1>
          <p className="text-base md:text-lg text-[#8899aa] max-w-2xl mx-auto">
            HytaleJoin is the premier server listing platform for Hytale, helping players
            discover amazing communities and server owners reach their audience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#131a24] border border-[#2a3548] rounded-xl p-5 hover:border-[#3d4f6a] transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#d4a033]/10 border border-[#d4a033]/20 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-[#d4a033]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#8899aa] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="bg-[#131a24] border border-[#2a3548] rounded-xl p-6 lg:p-8 mb-16">
          <h2 className="text-xl lg:text-2xl font-bold text-white mb-4">Our Mission</h2>
          <div className="space-y-3 text-[#8899aa] text-sm lg:text-base leading-relaxed">
            <p>
              We believe that finding the right server should be easy and enjoyable.
              HytaleJoin was created to bridge the gap between server owners and players,
              providing a platform where great communities can thrive and grow.
            </p>
            <p>
              Our goal is to build the most comprehensive and user-friendly server listing
              platform for Hytale. We&apos;re committed to maintaining high standards for
              listed servers while providing server owners with the tools they need to
              succeed.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: '100+', label: 'Servers Listed' },
            { value: '10K+', label: 'Monthly Visitors' },
            { value: '5K+', label: 'Players Connected' },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-[#131a24] border border-[#2a3548] rounded-xl p-6 text-center"
            >
              <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#d4a033] mb-1">
                {stat.value}
              </p>
              <p className="text-xs md:text-sm text-[#8899aa]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
