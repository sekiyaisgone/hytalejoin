import { Metadata } from 'next';
import Card from '@/components/ui/Card';
import { Mail, MessageSquare, Github, Twitter } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the HytaleJoin team.',
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#e8f0f8] mb-4">Contact Us</h1>
        <p className="text-[#8fa3b8]">
          Have a question or feedback? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="space-y-6">
        <Card hover={false} padding="lg">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-[#d29f32]/20">
              <Mail className="w-6 h-6 text-[#d29f32]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#e8f0f8] mb-2">Email</h3>
              <p className="text-[#8fa3b8] mb-2">
                For general inquiries and support:
              </p>
              <a
                href="mailto:support@hytalejoin.com"
                className="text-[#d29f32] hover:text-[#e5b343] transition-colors"
              >
                support@hytalejoin.com
              </a>
            </div>
          </div>
        </Card>

        <Card hover={false} padding="lg">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-[#5865F2]/20">
              <MessageSquare className="w-6 h-6 text-[#5865F2]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#e8f0f8] mb-2">Discord</h3>
              <p className="text-[#8fa3b8] mb-2">
                Join our community server for faster support:
              </p>
              <a
                href="https://discord.gg/hytalejoin"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#d29f32] hover:text-[#e5b343] transition-colors"
              >
                discord.gg/hytalejoin
              </a>
            </div>
          </div>
        </Card>

        <Card hover={false} padding="lg">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-[#8fa3b8]/20">
              <Github className="w-6 h-6 text-[#8fa3b8]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#e8f0f8] mb-2">GitHub</h3>
              <p className="text-[#8fa3b8] mb-2">
                Report bugs or suggest features:
              </p>
              <a
                href="https://github.com/hytalejoin"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#d29f32] hover:text-[#e5b343] transition-colors"
              >
                github.com/hytalejoin
              </a>
            </div>
          </div>
        </Card>

        <Card hover={false} padding="lg">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-[#1DA1F2]/20">
              <Twitter className="w-6 h-6 text-[#1DA1F2]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#e8f0f8] mb-2">Twitter</h3>
              <p className="text-[#8fa3b8] mb-2">
                Follow us for updates and announcements:
              </p>
              <a
                href="https://twitter.com/hytalejoin"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#d29f32] hover:text-[#e5b343] transition-colors"
              >
                @hytalejoin
              </a>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-[#8fa3b8]">
          We typically respond within 24-48 hours.
        </p>
      </div>
    </div>
  );
}
