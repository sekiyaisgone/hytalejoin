import { Metadata } from 'next';
import Card from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'HytaleJoin Privacy Policy - Learn how we handle your data.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-[#e8f0f8] mb-8">Privacy Policy</h1>

      <Card hover={false} padding="lg">
        <div className="prose prose-invert max-w-none space-y-6">
          <p className="text-[#8fa3b8]">Last updated: January 2025</p>

          <section>
            <h2 className="text-xl font-semibold text-[#e8f0f8] mb-3">
              1. Information We Collect
            </h2>
            <p className="text-[#8fa3b8]">
              We collect information you provide directly to us, such as when you create
              an account, submit a server listing, or contact us. This may include:
            </p>
            <ul className="list-disc list-inside text-[#8fa3b8] space-y-1 ml-4">
              <li>Email address</li>
              <li>Username</li>
              <li>Server information (IP address, port, description)</li>
              <li>Profile information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#e8f0f8] mb-3">
              2. How We Use Your Information
            </h2>
            <p className="text-[#8fa3b8]">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-[#8fa3b8] space-y-1 ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process server listings and user accounts</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#e8f0f8] mb-3">
              3. Information Sharing
            </h2>
            <p className="text-[#8fa3b8]">
              We do not share your personal information with third parties except as
              described in this policy or with your consent. Server information (IP,
              name, description) is publicly displayed as part of the listing service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#e8f0f8] mb-3">4. Data Security</h2>
            <p className="text-[#8fa3b8]">
              We take reasonable measures to help protect your personal information from
              loss, theft, misuse, and unauthorized access. However, no method of
              transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#e8f0f8] mb-3">5. Cookies</h2>
            <p className="text-[#8fa3b8]">
              We use cookies and similar technologies to maintain your session, remember
              your preferences, and understand how you use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#e8f0f8] mb-3">6. Your Rights</h2>
            <p className="text-[#8fa3b8]">
              You may access, update, or delete your account information at any time
              through your account settings. You can also contact us to request deletion
              of your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#e8f0f8] mb-3">7. Contact Us</h2>
            <p className="text-[#8fa3b8]">
              If you have any questions about this Privacy Policy, please contact us at
              privacy@hytalejoin.com.
            </p>
          </section>
        </div>
      </Card>
    </div>
  );
}
