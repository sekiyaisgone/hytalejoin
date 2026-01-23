import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Server, Users, Clock, CheckCircle, Star, ArrowRight, XCircle } from 'lucide-react';

export const metadata = {
  title: 'Admin Panel',
};

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/admin');
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

  // Get stats
  const [
    { count: totalServers },
    { count: pendingServers },
    { count: approvedServers },
    { count: rejectedServers },
    { count: totalUsers },
    { count: featuredServers },
    { data: recentServers },
  ] = await Promise.all([
    supabase.from('servers').select('*', { count: 'exact', head: true }),
    supabase.from('servers').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('servers').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('servers').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('servers').select('*', { count: 'exact', head: true }).eq('is_featured', true),
    supabase
      .from('servers')
      .select('*, profiles!servers_owner_id_fkey(username)')
      .order('created_at', { ascending: false })
      .limit(8),
  ]);

  const stats = [
    { label: 'Total Servers', value: totalServers || 0, icon: Server, color: '#5b8def', bg: 'rgba(91, 141, 239, 0.15)' },
    { label: 'Pending Review', value: pendingServers || 0, icon: Clock, color: '#eab308', bg: 'rgba(234, 179, 8, 0.15)' },
    { label: 'Approved', value: approvedServers || 0, icon: CheckCircle, color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)' },
    { label: 'Rejected', value: rejectedServers || 0, icon: XCircle, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
    { label: 'Featured', value: featuredServers || 0, icon: Star, color: '#d4a033', bg: 'rgba(212, 160, 51, 0.15)' },
    { label: 'Total Users', value: totalUsers || 0, icon: Users, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)' },
  ];

  const quickLinks = [
    { href: '/admin/servers', label: 'Manage Servers', desc: 'View, edit, and moderate all servers', icon: Server, color: '#5b8def' },
    { href: '/admin/pending', label: 'Pending Queue', desc: `${pendingServers || 0} servers waiting for review`, icon: Clock, color: '#eab308' },
    { href: '/admin/users', label: 'Manage Users', desc: 'View registered user accounts', icon: Users, color: '#a855f7' },
  ];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'approved':
        return { bg: 'rgba(34, 197, 94, 0.1)', text: '#86efac', dot: '#22c55e' };
      case 'pending':
        return { bg: 'rgba(234, 179, 8, 0.1)', text: '#fde047', dot: '#eab308' };
      case 'rejected':
        return { bg: 'rgba(239, 68, 68, 0.1)', text: '#fca5a5', dot: '#ef4444' };
      default:
        return { bg: 'rgba(255,255,255,0.05)', text: '#8fa3b8', dot: '#6b7c8f' };
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '8px' }}>
          Admin Dashboard
        </h1>
        <p style={{ fontSize: '0.9375rem', color: '#6b7c8f' }}>
          Manage servers, users, and site content
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: '#12161c',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '14px',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: stat.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <stat.icon style={{ width: '22px', height: '22px', color: stat.color }} />
              </div>
              <div>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f1f5f9', lineHeight: 1.2 }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: '0.8125rem', color: '#6b7c8f' }}>
                  {stat.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px',
              background: '#12161c',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '14px',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: `${link.color}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <link.icon style={{ width: '22px', height: '22px', color: link.color }} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>
                  {link.label}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#6b7c8f' }}>
                  {link.desc}
                </p>
              </div>
            </div>
            <ArrowRight style={{ width: '18px', height: '18px', color: '#4a5d73' }} />
          </Link>
        ))}
      </div>

      {/* Recent Submissions */}
      <div style={{
        background: '#12161c',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '14px',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#f1f5f9' }}>
            Recent Submissions
          </h2>
          <Link
            href="/admin/servers"
            style={{
              fontSize: '0.8125rem',
              color: '#5b8def',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            View all
            <ArrowRight style={{ width: '14px', height: '14px' }} />
          </Link>
        </div>

        <div>
          {recentServers?.map((server, index) => {
            const statusStyle = getStatusStyles(server.status);
            return (
              <div
                key={server.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 20px',
                  borderBottom: index < (recentServers?.length || 0) - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <h3 style={{
                        fontSize: '0.9375rem',
                        fontWeight: 500,
                        color: '#f1f5f9',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {server.name}
                      </h3>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: statusStyle.bg,
                        fontSize: '0.6875rem',
                        fontWeight: 500,
                        color: statusStyle.text,
                        textTransform: 'capitalize',
                      }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: statusStyle.dot }} />
                        {server.status}
                      </span>
                      {server.is_featured && (
                        <Star style={{ width: '14px', height: '14px', color: '#d4a033', fill: '#d4a033' }} />
                      )}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#6b7c8f' }}>
                      by {server.profiles?.username || 'Unknown'} •{' '}
                      {new Date(server.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <Link
                  href={server.status === 'pending' ? '/admin/pending' : `/admin/servers`}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: '#5b8def',
                    background: 'rgba(91, 141, 239, 0.1)',
                    borderRadius: '8px',
                    textDecoration: 'none',
                  }}
                >
                  {server.status === 'pending' ? 'Review' : 'View'}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
