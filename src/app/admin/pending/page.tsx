import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ArrowLeft, Clock, AlertCircle } from 'lucide-react';
import AdminServerActions from '../AdminServerActions';

export const metadata = {
  title: 'Pending Servers - Admin',
};

export default async function PendingServersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/admin/pending');
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
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
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
          background: 'rgba(234, 179, 8, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Clock style={{ width: '24px', height: '24px', color: '#eab308' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>
            Pending Review
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7c8f' }}>
            {servers?.length || 0} server{servers?.length !== 1 ? 's' : ''} waiting for approval
          </p>
        </div>
      </div>

      {servers && servers.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {servers.map((server, index) => (
            <div
              key={server.id}
              style={{
                background: '#12161c',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '14px',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#f1f5f9' }}>
                      {server.name}
                    </h2>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: 'rgba(234, 179, 8, 0.1)',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: '#fde047',
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#eab308' }} />
                      #{index + 1} in queue
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#6b7c8f', fontFamily: 'monospace' }}>
                    {server.ip_address}:{server.port}
                  </p>
                </div>
                <AdminServerActions server={server} showViewButton={false} />
              </div>

              {/* Content */}
              <div style={{ padding: '20px' }}>
                {/* Description */}
                <p style={{
                  fontSize: '0.9375rem',
                  color: '#c8d4e0',
                  lineHeight: 1.6,
                  marginBottom: '16px',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {server.description}
                </p>

                {/* Game Modes */}
                {server.game_modes && server.game_modes.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {server.game_modes.map((mode: string) => (
                      <span
                        key={mode}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: 'rgba(91, 141, 239, 0.1)',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          color: '#7bb0ff',
                          textTransform: 'capitalize',
                        }}
                      >
                        {mode.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                )}

                {/* Meta Info */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  fontSize: '0.8125rem',
                  color: '#6b7c8f',
                }}>
                  <span>
                    Submitted by{' '}
                    <span style={{ color: '#c8d4e0', fontWeight: 500 }}>
                      {server.profiles?.username || server.profiles?.email || 'Unknown'}
                    </span>
                  </span>
                  <span>
                    {new Date(server.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span>
                    Max {server.max_players} players
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: '#12161c',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '14px',
          padding: '64px 24px',
          textAlign: 'center',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'rgba(34, 197, 94, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <AlertCircle style={{ width: '28px', height: '28px', color: '#22c55e' }} />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '8px' }}>
            All caught up!
          </h3>
          <p style={{ fontSize: '0.9375rem', color: '#6b7c8f' }}>
            No servers are waiting for review.
          </p>
        </div>
      )}
    </div>
  );
}
