'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Save } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
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

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[#1a2f4a] rounded w-1/4" />
          <div className="h-64 bg-[#1a2f4a] rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-[#e8f0f8] mb-8">Account Settings</h1>

      <Card hover={false} padding="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            value={user?.email || ''}
            leftIcon={<Mail className="w-5 h-5" />}
            disabled
            helperText="Email cannot be changed"
          />

          <Input
            label="Username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            leftIcon={<User className="w-5 h-5" />}
          />

          <div className="pt-4">
            <Button
              type="submit"
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Danger zone */}
      <Card hover={false} padding="lg" className="mt-8 border-red-500/20">
        <h2 className="text-xl font-semibold text-red-400 mb-4">Danger Zone</h2>
        <p className="text-[#8fa3b8] mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button variant="danger" disabled>
          Delete Account
        </Button>
        <p className="mt-2 text-xs text-[#8fa3b8]">
          Account deletion is currently disabled. Contact support if you need to delete
          your account.
        </p>
      </Card>
    </div>
  );
}
