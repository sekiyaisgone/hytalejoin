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
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#f0f4f8] mb-6 tracking-tight">
            About <span className="gradient-text">HytaleJoin</span>
          </h1>
          <p className="text-lg md:text-xl text-[#7a8fa6] max-w-2xl mx-auto leading-relaxed">
            HytaleJoin is the premier server listing platform for Hytale, helping players
            discover amazing communities and server owners reach their audience.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="
                relative p-6 rounded-2xl
                bg-[rgba(15,23,32,0.8)] backdrop-blur-xl
                border border-[rgba(255,255,255,0.08)]
                transition-all duration-300
                hover:border-[rgba(255,255,255,0.15)]
                hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]
              "
            >
              <div className="flex gap-5">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#d4a033]/20 to-[#d4a033]/5 border border-[#d4a033]/20 flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-[#d4a033]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#f0f4f8] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[#7a8fa6] leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="
          relative p-8 md:p-10 rounded-2xl mb-20
          bg-[rgba(15,23,32,0.8)] backdrop-blur-xl
          border border-[rgba(255,255,255,0.08)]
        ">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-[#d4a033] to-[#d4a033]/50" />
            <h2 className="text-2xl md:text-3xl font-bold text-[#f0f4f8]">Our Mission</h2>
          </div>
          <div className="space-y-4 text-[#7a8fa6] text-lg leading-relaxed">
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { value: '100+', label: 'Servers Listed' },
            { value: '10K+', label: 'Monthly Visitors' },
            { value: '5K+', label: 'Players Connected' },
          ].map((stat, index) => (
            <div
              key={index}
              className="
                relative p-8 rounded-2xl text-center
                bg-[rgba(15,23,32,0.8)] backdrop-blur-xl
                border border-[rgba(255,255,255,0.08)]
              "
            >
              <p className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.value}</p>
              <p className="text-[#7a8fa6] font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
