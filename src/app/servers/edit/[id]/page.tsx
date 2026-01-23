import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getServerById } from '@/lib/servers';
import ServerForm from '@/components/servers/ServerForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: 'Edit Server',
};

export default async function EditServerPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/servers/edit/' + id);
  }

  const server = await getServerById(id);

  if (!server) {
    notFound();
  }

  // Check ownership or admin
  let isAdmin = false;
  if (server.owner_id !== user.id) {
    // Check if user is admin (use maybeSingle to avoid errors)
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile?.is_admin) {
      redirect('/dashboard');
    }
    isAdmin = true;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          color: '#f1f5f9',
          marginBottom: '8px',
        }}>
          Edit Server
        </h1>
        <p style={{ fontSize: '0.9375rem', color: '#6b7c8f' }}>
          Update your server listing information.
          {isAdmin && (
            <span style={{ color: '#d4a033', marginLeft: '8px' }}>
              (Admin editing)
            </span>
          )}
        </p>
      </div>

      <ServerForm userId={user.id} server={server} />
    </div>
  );
}
