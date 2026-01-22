import { Metadata } from 'next';
import { Mail, MessageSquare, Github, Twitter } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the HytaleJoin team.',
};

export default function ContactPage() {
  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#e8f0f8', marginBottom: '16px' }}>
          Contact Us
        </h1>
        <p style={{ color: '#8fa3b8' }}>
          Have a question or feedback? We&apos;d love to hear from you.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Email */}
        <div style={{
          background: '#151f2e',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{
              padding: '12px',
              borderRadius: '10px',
              background: 'rgba(210, 159, 50, 0.2)'
            }}>
              <Mail style={{ width: '24px', height: '24px', color: '#d29f32' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#e8f0f8', marginBottom: '8px' }}>
                Email
              </h3>
              <p style={{ color: '#8fa3b8', marginBottom: '8px' }}>
                For general inquiries and support:
              </p>
              <a href="mailto:support@hytalejoin.com" style={{ color: '#d29f32', textDecoration: 'none' }}>
                support@hytalejoin.com
              </a>
            </div>
          </div>
        </div>

        {/* Discord */}
        <div style={{
          background: '#151f2e',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{
              padding: '12px',
              borderRadius: '10px',
              background: 'rgba(88, 101, 242, 0.2)'
            }}>
              <MessageSquare style={{ width: '24px', height: '24px', color: '#5865F2' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#e8f0f8', marginBottom: '8px' }}>
                Discord
              </h3>
              <p style={{ color: '#8fa3b8', marginBottom: '8px' }}>
                Join our community server for faster support:
              </p>
              <a href="https://discord.gg/hytalejoin" target="_blank" rel="noopener noreferrer" style={{ color: '#d29f32', textDecoration: 'none' }}>
                discord.gg/hytalejoin
              </a>
            </div>
          </div>
        </div>

        {/* GitHub */}
        <div style={{
          background: '#151f2e',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{
              padding: '12px',
              borderRadius: '10px',
              background: 'rgba(143, 163, 184, 0.2)'
            }}>
              <Github style={{ width: '24px', height: '24px', color: '#8fa3b8' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#e8f0f8', marginBottom: '8px' }}>
                GitHub
              </h3>
              <p style={{ color: '#8fa3b8', marginBottom: '8px' }}>
                Report bugs or suggest features:
              </p>
              <a href="https://github.com/hytalejoin" target="_blank" rel="noopener noreferrer" style={{ color: '#d29f32', textDecoration: 'none' }}>
                github.com/hytalejoin
              </a>
            </div>
          </div>
        </div>

        {/* Twitter */}
        <div style={{
          background: '#151f2e',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{
              padding: '12px',
              borderRadius: '10px',
              background: 'rgba(29, 161, 242, 0.2)'
            }}>
              <Twitter style={{ width: '24px', height: '24px', color: '#1DA1F2' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#e8f0f8', marginBottom: '8px' }}>
                Twitter
              </h3>
              <p style={{ color: '#8fa3b8', marginBottom: '8px' }}>
                Follow us for updates and announcements:
              </p>
              <a href="https://twitter.com/hytalejoin" target="_blank" rel="noopener noreferrer" style={{ color: '#d29f32', textDecoration: 'none' }}>
                @hytalejoin
              </a>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '48px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.875rem', color: '#8fa3b8' }}>
          We typically respond within 24-48 hours.
        </p>
      </div>
    </div>
  );
}
