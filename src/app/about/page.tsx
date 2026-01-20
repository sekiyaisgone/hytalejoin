import { Metadata } from 'next';
import Card from '@/components/ui/Card';
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-[#e8f0f8] mb-6">
          About <span className="gradient-text">HytaleJoin</span>
        </h1>
        <p className="text-xl text-[#8fa3b8] max-w-2xl mx-auto">
          HytaleJoin is the premier server listing platform for Hytale, helping players
          discover amazing communities and server owners reach their audience.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {features.map((feature, index) => (
          <Card key={index} hover={false} padding="lg">
            <div className="flex gap-4">
              <div className="p-3 rounded-lg bg-[#d29f32]/20 h-fit">
                <feature.icon className="w-6 h-6 text-[#d29f32]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#e8f0f8] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#8fa3b8]">{feature.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Mission */}
      <Card hover={false} padding="lg" className="mb-16">
        <h2 className="text-2xl font-semibold text-[#e8f0f8] mb-4">Our Mission</h2>
        <div className="space-y-4 text-[#8fa3b8]">
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
      </Card>

      {/* Stats placeholder */}
      <div className="grid grid-cols-3 gap-6 text-center">
        <div>
          <p className="text-4xl font-bold text-[#d29f32]">100+</p>
          <p className="text-[#8fa3b8]">Servers Listed</p>
        </div>
        <div>
          <p className="text-4xl font-bold text-[#d29f32]">10K+</p>
          <p className="text-[#8fa3b8]">Monthly Visitors</p>
        </div>
        <div>
          <p className="text-4xl font-bold text-[#d29f32]">5K+</p>
          <p className="text-[#8fa3b8]">Players Connected</p>
        </div>
      </div>
    </div>
  );
}
