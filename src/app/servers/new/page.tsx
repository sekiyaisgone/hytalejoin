import { createClient } from '@/lib/supabase/server';
import ServerForm from '@/components/servers/ServerForm';

export const metadata = {
  title: 'Add New Server',
  description: 'Submit your Hytale server to be listed on HytaleJoin',
};

export default async function NewServerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Middleware handles redirect for unauthenticated users
  // This is a safety fallback that shows a message instead of crashing
  if (!user) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px', textAlign: 'center' }}>
        <p style={{ color: '#6b7c8f' }}>Loading authentication...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px 120px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f0f4f8', marginBottom: '6px' }}>
          {`Add New Server`}
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#6b7c8f', lineHeight: 1.5 }}>
          Fill out the details below. Submissions are reviewed before appearing publicly (usually within 24 hours).
        </p>
      </div>

      <ServerForm userId={user.id} />
    </div>
  );
}
