import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'HytaleJoin Terms of Service - Guidelines for using our platform.',
};

export default function TermsPage() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
      <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#e8f0f8', marginBottom: '32px' }}>
        Terms of Service
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
              1. Acceptance of Terms
            </h2>
            <p style={{ color: '#8fa3b8' }}>
              By accessing or using HytaleJoin, you agree to be bound by these Terms of
              Service. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e8f0f8', marginBottom: '12px' }}>
              2. Description of Service
            </h2>
            <p style={{ color: '#8fa3b8' }}>
              HytaleJoin provides a platform for discovering and listing Hytale game
              servers. We are not affiliated with Hypixel Studios or Riot Games.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e8f0f8', marginBottom: '12px' }}>
              3. User Accounts
            </h2>
            <p style={{ color: '#8fa3b8' }}>
              You are responsible for maintaining the confidentiality of your account and
              password. You agree to accept responsibility for all activities that occur
              under your account.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e8f0f8', marginBottom: '12px' }}>
              4. Server Listings
            </h2>
            <p style={{ color: '#8fa3b8', marginBottom: '8px' }}>When submitting a server listing, you agree:</p>
            <ul style={{ color: '#8fa3b8', marginLeft: '20px', listStyleType: 'disc' }}>
              <li>To provide accurate and truthful information</li>
              <li>You have the authority to list the server</li>
              <li>The server complies with all applicable laws</li>
              <li>The server does not contain illegal, harmful, or inappropriate content</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e8f0f8', marginBottom: '12px' }}>
              5. Prohibited Activities
            </h2>
            <p style={{ color: '#8fa3b8', marginBottom: '8px' }}>You agree not to:</p>
            <ul style={{ color: '#8fa3b8', marginLeft: '20px', listStyleType: 'disc' }}>
              <li>Submit false or misleading information</li>
              <li>Impersonate others or misrepresent your affiliation</li>
              <li>Attempt to manipulate votes or listings</li>
              <li>Use automated systems to access the service</li>
              <li>Interfere with the proper functioning of the service</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e8f0f8', marginBottom: '12px' }}>
              6. Content Moderation
            </h2>
            <p style={{ color: '#8fa3b8' }}>
              We reserve the right to remove or modify any content that violates these
              terms or that we find objectionable. Server listings are subject to review
              and approval.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e8f0f8', marginBottom: '12px' }}>
              7. Termination
            </h2>
            <p style={{ color: '#8fa3b8' }}>
              We may terminate or suspend your account at any time for violations of
              these terms or for any other reason at our discretion.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e8f0f8', marginBottom: '12px' }}>
              8. Disclaimer of Warranties
            </h2>
            <p style={{ color: '#8fa3b8' }}>
              HytaleJoin is provided &quot;as is&quot; without warranties of any kind. We
              do not guarantee the accuracy, reliability, or availability of the service
              or any server listings.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e8f0f8', marginBottom: '12px' }}>
              9. Limitation of Liability
            </h2>
            <p style={{ color: '#8fa3b8' }}>
              HytaleJoin shall not be liable for any indirect, incidental, special, or
              consequential damages arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e8f0f8', marginBottom: '12px' }}>
              10. Changes to Terms
            </h2>
            <p style={{ color: '#8fa3b8' }}>
              We reserve the right to modify these terms at any time. We will notify
              users of significant changes by posting a notice on our website.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#e8f0f8', marginBottom: '12px' }}>
              11. Contact
            </h2>
            <p style={{ color: '#8fa3b8' }}>
              If you have any questions about these Terms of Service, please contact us
              at legal@hytalejoin.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
