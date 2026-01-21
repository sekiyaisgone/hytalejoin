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
    <div style={{ minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
            About <span style={{ color: '#d4a033' }}>HytaleJoin</span>
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#8899aa', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            HytaleJoin is the premier server listing platform for Hytale, helping players
            discover amazing communities and server owners reach their audience.
          </p>
        </div>

        {/* Features Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '64px' }}>
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                background: '#131a24',
                border: '1px solid #2a3548',
                borderRadius: '12px',
                padding: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{
                  flexShrink: 0,
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  background: 'rgba(212, 160, 51, 0.1)',
                  border: '1px solid rgba(212, 160, 51, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <feature.icon style={{ width: '24px', height: '24px', color: '#d4a033' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'white', marginBottom: '4px' }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#8899aa', lineHeight: '1.5' }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div style={{
          background: '#131a24',
          border: '1px solid #2a3548',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '64px',
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>Our Mission</h2>
          <div style={{ color: '#8899aa', fontSize: '1rem', lineHeight: '1.7' }}>
            <p style={{ marginBottom: '12px' }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { value: '100+', label: 'Servers Listed' },
            { value: '10K+', label: 'Monthly Visitors' },
            { value: '5K+', label: 'Players Connected' },
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                background: '#131a24',
                border: '1px solid #2a3548',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
              }}
            >
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d4a033', marginBottom: '4px' }}>
                {stat.value}
              </p>
              <p style={{ fontSize: '0.875rem', color: '#8899aa' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
