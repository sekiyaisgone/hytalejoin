import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ArrowLeft, Users, Shield, Server } from 'lucide-react';

export const metadata = {
  title: 'Users - Admin',
};

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/admin/users');
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

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  // Get server counts for each user
  const { data: serverCounts } = await supabase
    .from('servers')
    .select('owner_id')
    .then(({ data }) => {
      const counts: Record<string, number> = {};
      data?.forEach((s) => {
        counts[s.owner_id] = (counts[s.owner_id] || 0) + 1;
      });
      return { data: counts };
    });

  const adminCount = users?.filter(u => u.is_admin).length || 0;

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
          background: 'rgba(168, 85, 247, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Users style={{ width: '24px', height: '24px', color: '#a855f7' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>
            Users
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7c8f' }}>
            {users?.length || 0} registered users • {adminCount} admin{adminCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div style={{
        background: '#12161c',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '14px',
        overflow: 'hidden',
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 2fr 100px 120px 100px',
          gap: '16px',
          padding: '14px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7c8f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            User
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7c8f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Email
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7c8f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Servers
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7c8f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Joined
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7c8f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Role
          </span>
        </div>

        {/* Table Body */}
        {users?.map((u, index) => (
          <div
            key={u.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 2fr 100px 120px 100px',
              gap: '16px',
              padding: '16px 20px',
              alignItems: 'center',
              borderBottom: index < (users?.length || 0) - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}
          >
            {/* User */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {u.avatar_url ? (
                <img
                  src={u.avatar_url}
                  alt=""
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(91, 141, 239, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <span style={{ fontSize: '1rem', fontWeight: 600, color: '#5b8def' }}>
                    {(u.username || u.email || 'U').charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: '#f1f5f9' }}>
                {u.username || 'No username'}
              </span>
            </div>

            {/* Email */}
            <span style={{
              fontSize: '0.875rem',
              color: '#8fa3b8',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {u.email}
            </span>

            {/* Servers Count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Server style={{ width: '14px', height: '14px', color: '#6b7c8f' }} />
              <span style={{ fontSize: '0.875rem', color: '#c8d4e0', fontWeight: 500 }}>
                {serverCounts?.[u.id] || 0}
              </span>
            </div>

            {/* Joined Date */}
            <span style={{ fontSize: '0.875rem', color: '#8fa3b8' }}>
              {new Date(u.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>

            {/* Role Badge */}
            {u.is_admin ? (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '8px',
                background: 'rgba(212, 160, 51, 0.15)',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: '#d4a033',
              }}>
                <Shield style={{ width: '12px', height: '12px' }} />
                Admin
              </span>
            ) : (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 10px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.04)',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: '#8fa3b8',
              }}>
                User
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
