import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ServerForm from '@/components/servers/ServerForm';

export const metadata = {
  title: 'Add New Server',
  description: 'Submit your Hytale server to be listed on HytaleJoin',
};

export default async function NewServerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/servers/new');
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px 100px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f0f4f8', marginBottom: '8px' }}>
          Add New Server
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#6b7c8f', lineHeight: 1.6 }}>
          Submit your server to be listed on HytaleJoin. All submissions are reviewed before being published.
        </p>
      </div>

      <ServerForm userId={user.id} />
    </div>
  );
}
