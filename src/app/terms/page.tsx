import { Metadata } from 'next';
import Card from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'HytaleJoin Terms of Service - Guidelines for using our platform.',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto w-full">
      <h1 className="text-4xl font-bold text-[#e8f0f8] mb-8">Terms of Service</h1>

      <Card hover={false} padding="lg">
        <div className="prose prose-invert max-w-none space-y-6">
          <p className="text-[#8fa3b8]">Last updated: January 2025</p>

          <section>
            <h2 className="text-xl font-semibold text-[#e8f0f8] mb-3">
              1. Acceptance of Terms
            </h2>
            <p className="text-[#8fa3b8]">
              By accessing or using HytaleJoin, you agree to be bound by these Terms of
              Service. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#e8f0f8] mb-3">
              2. Description of Service
            </h2>
            <p className="text-[#8fa3b8]">
              HytaleJoin provides a platform for discovering and listing Hytale game
              servers. We are not affiliated with Hypixel Studios or Riot Games.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#e8f0f8] mb-3">3. User Accounts</h2>
            <p className="text-[#8fa3b8]">
              You are responsible for maintaining the confidentiality of your account and
              password. You agree to accept responsibility for all activities that occur
              under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#e8f0f8] mb-3">
              4. Server Listings
            </h2>
            <p className="text-[#8fa3b8]">When submitting a server listing, you agree:</p>
            <ul className="list-disc list-inside text-[#8fa3b8] space-y-1 ml-4">
              <li>To provide accurate and truthful information</li>
              <li>You have the authority to list the server</li>
              <li>The server complies with all applicable laws</li>
              <li>
                The server does not contain illegal, harmful, or inappropriate content
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#e8f0f8] mb-3">
              5. Prohibited Activities
            </h2>
            <p className="text-[#8fa3b8]">You agree not to:</p>
            <ul className="list-disc list-inside text-[#8fa3b8] space-y-1 ml-4">
              <li>Submit false or misleading information</li>
              <li>Impersonate others or misrepresent your affiliation</li>
              <li>Attempt to manipulate votes or listings</li>
              <li>Use automated systems to access the service</li>
              <li>Interfere with the proper functioning of the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#e8f0f8] mb-3">
              6. Content Moderation
            </h2>
            <p className="text-[#8fa3b8]">
              We reserve the right to remove or modify any content that violates these
              terms or that we find objectionable. Server listings are subject to review
              and approval.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#e8f0f8] mb-3">7. Termination</h2>
            <p className="text-[#8fa3b8]">
              We may terminate or suspend your account at any time for violations of
              these terms or for any other reason at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#e8f0f8] mb-3">
              8. Disclaimer of Warranties
            </h2>
            <p className="text-[#8fa3b8]">
              HytaleJoin is provided &quot;as is&quot; without warranties of any kind. We
              do not guarantee the accuracy, reliability, or availability of the service
              or any server listings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#e8f0f8] mb-3">
              9. Limitation of Liability
            </h2>
            <p className="text-[#8fa3b8]">
              HytaleJoin shall not be liable for any indirect, incidental, special, or
              consequential damages arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#e8f0f8] mb-3">
              10. Changes to Terms
            </h2>
            <p className="text-[#8fa3b8]">
              We reserve the right to modify these terms at any time. We will notify
              users of significant changes by posting a notice on our website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#e8f0f8] mb-3">11. Contact</h2>
            <p className="text-[#8fa3b8]">
              If you have any questions about these Terms of Service, please contact us
              at legal@hytalejoin.com.
            </p>
          </section>
        </div>
      </Card>
    </div>
  );
}
