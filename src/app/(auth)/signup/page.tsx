'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export default function SignUpPage() {
  const { signUp, signInWithGoogle, signInWithDiscord } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp(email, password, username);
      if (error) {
        toast.error(error.message);
      } else {
        setEmailSent(true);
        toast.success('Check your email to confirm your account!');
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error(error.message);
    }
  };

  const handleDiscordSignIn = async () => {
    const { error } = await signInWithDiscord();
    if (error) {
      toast.error(error.message);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#0d1117',
    border: '1px solid #2a3548',
    borderRadius: '8px',
    padding: '12px 16px',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'white',
    marginBottom: '8px',
  };

  const [resendCooldown, setResendCooldown] = useState(0);

  const handleResendEmail = async () => {
    if (resendCooldown > 0) return;
    try {
      const { error } = await signUp(email, password, username);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Confirmation email resent!');
        setResendCooldown(60);
        const interval = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch {
      toast.error('Failed to resend email');
    }
  };

  if (emailSent) {
    return (
      <div style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{
          width: '100%',
          maxWidth: '440px',
          background: '#12161c',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px',
          padding: '40px 32px',
          textAlign: 'center',
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '16px',
            background: 'rgba(91, 141, 239, 0.1)',
            border: '1px solid rgba(91, 141, 239, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <Mail style={{ width: '32px', height: '32px', color: '#5b8def' }} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '12px' }}>
            Check Your Email
          </h1>
          <p style={{ fontSize: '0.9375rem', color: '#8899aa', marginBottom: '8px', lineHeight: 1.6 }}>
            We&apos;ve sent a confirmation link to
          </p>
          <p style={{
            fontSize: '0.9375rem',
            fontWeight: 600,
            color: '#f1f5f9',
            marginBottom: '24px',
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '8px',
            display: 'inline-block',
          }}>
            {email}
          </p>
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '24px 0' }} />
          <p style={{ fontSize: '0.8125rem', color: '#6b7c8f', marginBottom: '12px' }}>Open your email app</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px' }}>
            <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: '#c8d4e0', fontSize: '0.8125rem', fontWeight: 500, textDecoration: 'none',
            }}>Gmail</a>
            <a href="https://outlook.live.com" target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: '#c8d4e0', fontSize: '0.8125rem', fontWeight: 500, textDecoration: 'none',
            }}>Outlook</a>
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#6b7c8f', marginBottom: '24px' }}>
            Didn&apos;t get it? Check your spam folder.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={handleResendEmail} disabled={resendCooldown > 0} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', height: '44px', padding: '0 24px',
              borderRadius: '10px', background: resendCooldown > 0 ? 'rgba(255,255,255,0.02)' : 'linear-gradient(135deg, #5b8def 0%, #4a7bd4 100%)',
              color: resendCooldown > 0 ? '#6b7c8f' : 'white', fontSize: '0.875rem', fontWeight: 500, border: 'none',
              cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer', boxShadow: resendCooldown > 0 ? 'none' : '0 2px 8px rgba(91, 141, 239, 0.25)',
            }}>
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Email'}
            </button>
            <button onClick={() => setEmailSent(false)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', height: '44px', padding: '0 24px',
              borderRadius: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)',
              color: '#8899aa', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
            }}>Use a different email</button>
          </div>
          <p style={{ marginTop: '24px', fontSize: '0.8125rem', color: '#6b7c8f' }}>
            Already confirmed? <Link href="/login" style={{ color: '#5b8def', textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>Create Account</h1>
          <p style={{ color: '#8899aa', fontSize: '0.875rem' }}>Join HytaleJoin and share your servers</p>
        </div>

        {/* Form Card */}
        <div style={{ background: '#131a24', border: '1px solid #2a3548', borderRadius: '12px', padding: '24px' }}>
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Username</label>
              <input
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                style={inputStyle}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                style={inputStyle}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  style={{ ...inputStyle, paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6b7c93', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff style={{ width: '20px', height: '20px' }} /> : <Eye style={{ width: '20px', height: '20px' }} />}
                </button>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#6b7c93', marginTop: '4px' }}>At least 8 characters</p>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                style={inputStyle}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                background: '#d4a033',
                color: 'black',
                fontWeight: '600',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1,
                fontSize: '1rem',
              }}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ position: 'relative', margin: '24px 0', textAlign: 'center' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px solid #2a3548' }} />
            <span style={{ position: 'relative', background: '#131a24', padding: '0 12px', color: '#6b7c93', fontSize: '0.875rem' }}>Or continue with</span>
          </div>

          {/* OAuth */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#0d1117', border: '1px solid #2a3548', color: 'white', fontWeight: '500', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}
            >
              <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={handleDiscordSignIn}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#0d1117', border: '1px solid #2a3548', color: 'white', fontWeight: '500', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}
            >
              <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Discord
            </button>
          </div>

          {/* Terms */}
          <p style={{ marginTop: '16px', fontSize: '0.75rem', textAlign: 'center', color: '#6b7c93' }}>
            By signing up, you agree to our{' '}
            <Link href="/terms" style={{ color: '#d4a033', textDecoration: 'none' }}>Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" style={{ color: '#d4a033', textDecoration: 'none' }}>Privacy Policy</Link>
          </p>
        </div>

        {/* Footer */}
        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.875rem', color: '#6b7c93' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#d4a033', fontWeight: '500', textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
