import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ArrowLeft, Server } from 'lucide-react';
import AdminServersClient from './AdminServersClient';

export const metadata = {
  title: 'All Servers - Admin',
};

export default async function AdminServersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/admin/servers');
  }

  // Check if user is admin (use maybeSingle to avoid 406 if profile missing)
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    redirect('/');
  }

  const { data: servers } = await supabase
    .from('servers')
    .select('*, profiles!servers_owner_id_fkey(username, email)')
    .order('created_at', { ascending: false });

  // Get counts by status
  const statusCounts = {
    all: servers?.length || 0,
    approved: servers?.filter(s => s.status === 'approved').length || 0,
    pending: servers?.filter(s => s.status === 'pending').length || 0,
    rejected: servers?.filter(s => s.status === 'rejected').length || 0,
    featured: servers?.filter(s => s.is_featured).length || 0,
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      <Link
        href="/admin"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.875rem',
          color: '#6b7c8f',
          textDecoration: 'none',
          marginBottom: '24px',
        }}
      >
        <ArrowLeft style={{ width: '16px', height: '16px' }} />
        Back to admin
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'rgba(91, 141, 239, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Server style={{ width: '24px', height: '24px', color: '#5b8def' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>
            All Servers
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7c8f' }}>
            {servers?.length || 0} total servers
          </p>
        </div>
      </div>

      <AdminServersClient servers={servers || []} statusCounts={statusCounts} />
    </div>
  );
}
