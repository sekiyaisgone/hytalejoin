'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Save, AlertTriangle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile, isLoading } = useAuth();
  const supabase = createClient();

  const [username, setUsername] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/dashboard/settings');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (profile?.username) {
      setUsername(profile.username);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username, updated_at: new Date().toISOString() })
        .eq('id', user?.id);

      if (error) {
        throw error;
      }

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '44px',
    padding: '0 16px',
    paddingLeft: '44px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    color: '#f1f5f9',
    fontSize: '0.9375rem',
    outline: 'none',
  };

  if (isLoading) {
    return (
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ height: '32px', background: '#1a2433', borderRadius: '8px', width: '200px', marginBottom: '32px' }} />
        <div style={{ height: '240px', background: '#1a2433', borderRadius: '14px' }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '32px' }}>
        Account Settings
      </h1>

      {/* Profile Card */}
      <div style={{
        background: '#12161c',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '14px',
        padding: '24px',
        marginBottom: '24px',
      }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '20px' }}>
          Profile Information
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#8899aa', marginBottom: '8px' }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6b7c8f',
              }}>
                <Mail style={{ width: '18px', height: '18px' }} />
              </div>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                style={{
                  ...inputStyle,
                  opacity: 0.6,
                  cursor: 'not-allowed',
                }}
              />
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6b7c8f', marginTop: '6px' }}>
              Email cannot be changed
            </p>
          </div>

          {/* Username Field */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#8899aa', marginBottom: '8px' }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6b7c8f',
              }}>
                <User style={{ width: '18px', height: '18px' }} />
              </div>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={isSaving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              height: '40px',
              padding: '0 20px',
              borderRadius: '10px',
              background: isSaving ? 'rgba(91, 141, 239, 0.5)' : 'linear-gradient(135deg, #5b8def 0%, #4a7bd4 100%)',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: 500,
              border: 'none',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 8px rgba(91, 141, 239, 0.25)',
            }}
          >
            <Save style={{ width: '16px', height: '16px' }} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div style={{
        background: '#12161c',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: '14px',
        padding: '24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <AlertTriangle style={{ width: '18px', height: '18px', color: '#f87171' }} />
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#f87171' }}>
            Danger Zone
          </h2>
        </div>

        <p style={{ fontSize: '0.875rem', color: '#8899aa', marginBottom: '16px', lineHeight: 1.6 }}>
          Once you delete your account, there is no going back. All your servers and data will be permanently removed.
        </p>

        <button
          disabled
          style={{
            height: '40px',
            padding: '0 20px',
            borderRadius: '10px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#6b7c8f',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'not-allowed',
          }}
        >
          Delete Account
        </button>

        <p style={{ fontSize: '0.75rem', color: '#6b7c8f', marginTop: '12px' }}>
          Account deletion is currently disabled. Contact{' '}
          <a href="/contact" style={{ color: '#5b8def', textDecoration: 'none' }}>support</a>{' '}
          if you need to delete your account.
        </p>
      </div>
    </div>
  );
}
