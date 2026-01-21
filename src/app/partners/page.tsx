'use client';

import { Handshake, Star, Users, Zap, MessageSquare, Mail } from 'lucide-react';
import Link from 'next/link';

export default function PartnersPage() {
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    padding: '48px 24px',
  };

  const contentStyle: React.CSSProperties = {
    maxWidth: '1000px',
    margin: '0 auto',
    width: '100%',
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(19, 26, 36, 0.8)',
    border: '1px solid #2a3548',
    borderRadius: '16px',
    padding: '32px',
  };

  const benefits = [
    {
      icon: Star,
      title: 'Featured Placement',
      description: 'Get your server or brand featured prominently on our homepage and server listings.',
    },
    {
      icon: Users,
      title: 'Expanded Reach',
      description: 'Access our growing community of Hytale players looking for servers to join.',
    },
    {
      icon: Zap,
      title: 'Priority Support',
      description: 'Receive dedicated support and faster response times for any issues.',
    },
    {
      icon: MessageSquare,
      title: 'Community Promotion',
      description: 'Cross-promotion on our Discord server and social media channels.',
    },
  ];

  const partnerTypes = [
    {
      title: 'Server Partners',
      description: 'Large or established Hytale servers looking for increased visibility and player traffic.',
      requirements: ['Active player base', 'Quality server experience', 'Active moderation team'],
    },
    {
      title: 'Content Creators',
      description: 'YouTubers, streamers, and content creators in the Hytale community.',
      requirements: ['500+ followers/subscribers', 'Regular Hytale content', 'Engaged audience'],
    },
    {
      title: 'Community Partners',
      description: 'Discord communities, forums, and fan sites focused on Hytale.',
      requirements: ['Active community', 'Quality content or discussions', 'Established presence'],
    },
  ];

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(212, 160, 51, 0.2)', marginBottom: '24px' }}>
            <Handshake style={{ width: '40px', height: '40px', color: '#d4a033' }} />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '16px' }}>
            Partner with <span style={{ color: '#d4a033' }}>HytaleJoin</span>
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#8899aa', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7' }}>
            Join forces with the premier Hytale server listing platform. Together, we can build a stronger community.
          </p>
        </div>

        {/* Benefits Section */}
        <div style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '32px', textAlign: 'center' }}>
            Partner Benefits
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            {benefits.map((benefit, index) => (
              <div key={index} style={cardStyle}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(212, 160, 51, 0.15)' }}>
                    <benefit.icon style={{ width: '24px', height: '24px', color: '#d4a033' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', marginBottom: '8px' }}>
                      {benefit.title}
                    </h3>
                    <p style={{ color: '#8899aa', lineHeight: '1.6' }}>
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partner Types Section */}
        <div style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '32px', textAlign: 'center' }}>
            Partnership Types
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {partnerTypes.map((type, index) => (
              <div key={index} style={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#d4a033', marginBottom: '12px' }}>
                  {type.title}
                </h3>
                <p style={{ color: '#8899aa', lineHeight: '1.6', marginBottom: '20px', flex: 1 }}>
                  {type.description}
                </p>
                <div>
                  <p style={{ color: '#6b7c93', fontSize: '0.875rem', fontWeight: '500', marginBottom: '8px' }}>
                    Requirements:
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {type.requirements.map((req, i) => (
                      <li key={i} style={{ color: '#8899aa', fontSize: '0.875rem', marginBottom: '4px', paddingLeft: '16px', position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 0, color: '#d4a033' }}>•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div style={{ ...cardStyle, textAlign: 'center', background: 'linear-gradient(135deg, rgba(212, 160, 51, 0.1) 0%, rgba(19, 26, 36, 0.9) 100%)' }}>
          <Mail style={{ width: '48px', height: '48px', color: '#d4a033', margin: '0 auto 20px' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', marginBottom: '12px' }}>
            Interested in Partnering?
          </h2>
          <p style={{ color: '#8899aa', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
            Reach out to us to discuss partnership opportunities. We&apos;d love to hear from you!
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <a
              href="mailto:partners@hytalejoin.com"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: '#d4a033',
                color: 'white',
                borderRadius: '8px',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'background 0.2s',
              }}
            >
              <Mail style={{ width: '18px', height: '18px' }} />
              Email Us
            </a>
            <Link
              href="/about"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                borderRadius: '8px',
                fontWeight: '600',
                textDecoration: 'none',
                border: '1px solid #2a3548',
              }}
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
