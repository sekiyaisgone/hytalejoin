'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await resetPassword(email);
      if (error) {
        toast.error(error.message);
      } else {
        setEmailSent(true);
        toast.success('Password reset link sent!');
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-[#d29f32]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-[#d29f32]" />
          </div>
          <h1 className="text-3xl font-bold text-[#e8f0f8] mb-4">Check Your Email</h1>
          <p className="text-[#8fa3b8] mb-6">
            We&apos;ve sent a password reset link to{' '}
            <strong className="text-[#e8f0f8]">{email}</strong>. Click the link to reset
            your password.
          </p>
          <div className="space-y-3">
            <Button variant="secondary" onClick={() => setEmailSent(false)} className="w-full">
              Use a different email
            </Button>
            <Link href="/login">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-[#8fa3b8] hover:text-[#e8f0f8] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#e8f0f8] mb-2">Reset Password</h1>
          <p className="text-[#8fa3b8]">
            Enter your email and we&apos;ll send you a link to reset your password
          </p>
        </div>

        <Card hover={false} padding="lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-5 h-5" />}
              required
              autoComplete="email"
            />

            <Button type="submit" isLoading={isLoading} className="w-full">
              Send Reset Link
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
