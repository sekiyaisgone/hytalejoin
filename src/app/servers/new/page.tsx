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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>
          Add New Server
        </h1>
        <p style={{ fontSize: '0.9375rem', color: '#8899aa', lineHeight: 1.6 }}>
          Submit your server to be listed on HytaleJoin. All submissions are reviewed before being published.
        </p>
      </div>

      <ServerForm userId={user.id} />
    </div>
  );
}
