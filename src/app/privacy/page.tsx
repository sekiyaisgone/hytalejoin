import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'HytaleJoin Privacy Policy - Learn how we handle your data.',
};

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
      <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#e8f0f8', marginBottom: '32px' }}>
        Privacy Policy
      </h1>

      <div style={{
        background: '#151f2e',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px',
        padding: '32px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <p style={{ color: '#8fa3b8', fontSize: '0.875rem' }}>Last updated: January 2025</p>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e8f0f8', marginBottom: '12px' }}>
              1. Information We Collect
            </h2>
            <p style={{ color: '#8fa3b8', marginBottom: '8px' }}>
              We collect information you provide directly to us, such as when you create
              an account, submit a server listing, or contact us. This may include:
            </p>
            <ul style={{ color: '#8fa3b8', marginLeft: '20px', listStyleType: 'disc' }}>
              <li>Email address</li>
              <li>Username</li>
              <li>Server information (IP address, port, description)</li>
              <li>Profile information</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e8f0f8', marginBottom: '12px' }}>
              2. How We Use Your Information
            </h2>
            <p style={{ color: '#8fa3b8', marginBottom: '8px' }}>We use the information we collect to:</p>
            <ul style={{ color: '#8fa3b8', marginLeft: '20px', listStyleType: 'disc' }}>
              <li>Provide, maintain, and improve our services</li>
              <li>Process server listings and user accounts</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e8f0f8', marginBottom: '12px' }}>
              3. Information Sharing
            </h2>
            <p style={{ color: '#8fa3b8' }}>
              We do not share your personal information with third parties except as
              described in this policy or with your consent. Server information (IP,
              name, description) is publicly displayed as part of the listing service.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e8f0f8', marginBottom: '12px' }}>
              4. Data Security
            </h2>
            <p style={{ color: '#8fa3b8' }}>
              We take reasonable measures to help protect your personal information from
              loss, theft, misuse, and unauthorized access. However, no method of
              transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e8f0f8', marginBottom: '12px' }}>
              5. Cookies
            </h2>
            <p style={{ color: '#8fa3b8' }}>
              We use cookies and similar technologies to maintain your session, remember
              your preferences, and understand how you use our service.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e8f0f8', marginBottom: '12px' }}>
              6. Your Rights
            </h2>
            <p style={{ color: '#8fa3b8' }}>
              You may access, update, or delete your account information at any time
              through your account settings. You can also contact us to request deletion
              of your data.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e8f0f8', marginBottom: '12px' }}>
              7. Contact Us
            </h2>
            <p style={{ color: '#8fa3b8' }}>
              If you have any questions about this Privacy Policy, please contact us at
              privacy@hytalejoin.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
