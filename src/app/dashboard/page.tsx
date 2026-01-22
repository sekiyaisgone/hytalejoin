import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getServers } from '@/lib/servers';
import { Plus, Server, Eye, ThumbsUp, ExternalLink, Pencil, Settings, HelpCircle, Zap } from 'lucide-react';
import DeleteServerButton from './DeleteServerButton';

// Stat Card Component
function StatCard({
  icon,
  value,
  label,
  color
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '18px 20px',
        borderRadius: '14px',
        background: '#12161c',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'all 0.15s ease',
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f1f5f9', lineHeight: 1.2 }}>
          {value.toLocaleString()}
        </p>
        <p style={{ fontSize: '0.8125rem', color: '#6b7c8f', fontWeight: 500 }}>
          {label}
        </p>
      </div>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status, isOnline }: { status: string; isOnline?: boolean }) {
  const statusConfig: Record<string, { bg: string; border: string; dot: string; text: string; label: string }> = {
    approved: { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.2)', dot: '#22c55e', text: '#86efac', label: 'Approved' },
    pending: { bg: 'rgba(234, 179, 8, 0.1)', border: 'rgba(234, 179, 8, 0.2)', dot: '#eab308', text: '#fde047', label: 'Pending' },
    rejected: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)', dot: '#ef4444', text: '#fca5a5', label: 'Rejected' },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '8px',
        background: config.bg,
        border: `1px solid ${config.border}`,
        fontSize: '0.6875rem',
        fontWeight: 500,
        color: config.text,
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: config.dot,
        }}
      />
      {config.label}
    </span>
  );
}

// Server Row Component
function ServerRow({ server }: { server: any }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderRadius: '12px',
        background: '#12161c',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'all 0.15s ease',
      }}
    >
      {/* Left: Server Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <h3 style={{
            fontSize: '0.9375rem',
            fontWeight: 600,
            color: '#f1f5f9',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {server.name}
          </h3>
          <StatusBadge status={server.status} />
          {server.is_online && server.status === 'approved' && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 8px',
                borderRadius: '6px',
                background: 'rgba(34, 197, 94, 0.1)',
                fontSize: '0.625rem',
                fontWeight: 500,
                color: '#86efac',
              }}
            >
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e' }} />
              Online
            </span>
          )}
        </div>
        <p style={{ fontSize: '0.75rem', color: '#6b7c8f', fontFamily: 'monospace', marginBottom: '8px' }}>
          {server.ip_address}:{server.port}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#8899aa' }}>
            <Eye style={{ width: '13px', height: '13px' }} />
            <span style={{ color: '#c8d4e0', fontWeight: 500 }}>{server.views}</span> views
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#8899aa' }}>
            <ThumbsUp style={{ width: '13px', height: '13px' }} />
            <span style={{ color: '#c8d4e0', fontWeight: 500 }}>{server.votes}</span> votes
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {server.status === 'approved' && (
          <Link
            href={`/servers/${server.id}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#8899aa',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <ExternalLink style={{ width: '15px', height: '15px' }} />
          </Link>
        )}
        <Link
          href={`/servers/edit/${server.id}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#8899aa',
            textDecoration: 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <Pencil style={{ width: '15px', height: '15px' }} />
        </Link>
        <DeleteServerButton serverId={server.id} serverName={server.name} />
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/dashboard');
  }

  const { data: servers } = await getServers({
    ownerId: user.id,
    status: undefined,
    pageSize: 100,
  });

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const totalViews = servers.reduce((acc, s) => acc + s.views, 0);
  const totalVotes = servers.reduce((acc, s) => acc + s.votes, 0);
  const approvedServers = servers.filter((s) => s.status === 'approved').length;
  const pendingServers = servers.filter((s) => s.status === 'pending').length;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px',
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '4px' }}>
            Dashboard
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7c8f' }}>
            Welcome back, {profile?.username || user.email?.split('@')[0]}
          </p>
        </div>
        <Link
          href="/servers/new"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            height: '40px',
            padding: '0 18px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #5b8def 0%, #4a7bd4 100%)',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: 500,
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(91, 141, 239, 0.25)',
            transition: 'all 0.15s ease',
          }}
        >
          <Plus style={{ width: '16px', height: '16px' }} />
          Add Server
        </Link>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '32px',
      }}>
        <StatCard
          icon={<Server style={{ width: '20px', height: '20px', color: '#5b8def' }} />}
          value={servers.length}
          label="Total Servers"
          color="rgba(91, 141, 239, 0.15)"
        />
        <StatCard
          icon={<Server style={{ width: '20px', height: '20px', color: '#22c55e' }} />}
          value={approvedServers}
          label="Approved"
          color="rgba(34, 197, 94, 0.15)"
        />
        <StatCard
          icon={<Eye style={{ width: '20px', height: '20px', color: '#06b6d4' }} />}
          value={totalViews}
          label="Total Views"
          color="rgba(6, 182, 212, 0.15)"
        />
        <StatCard
          icon={<ThumbsUp style={{ width: '20px', height: '20px', color: '#a855f7' }} />}
          value={totalVotes}
          label="Total Votes"
          color="rgba(168, 85, 247, 0.15)"
        />
      </div>

      {/* Main Content: 2 Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
        {/* Left: Server List */}
        <div>
          {/* Section Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#f1f5f9' }}>
              Your Servers
            </h2>
            {servers.length > 0 && (
              <span style={{ fontSize: '0.75rem', color: '#6b7c8f' }}>
                {servers.length} server{servers.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Pending Notice */}
          {pendingServers > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                marginBottom: '16px',
                borderRadius: '12px',
                background: 'rgba(234, 179, 8, 0.08)',
                border: '1px solid rgba(234, 179, 8, 0.15)',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#eab308',
                }}
              />
              <p style={{ fontSize: '0.8125rem', color: '#fde047', margin: 0 }}>
                <strong>{pendingServers}</strong> server{pendingServers !== 1 ? 's' : ''} pending approval
              </p>
            </div>
          )}

          {/* Server List or Empty State */}
          {servers.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px 24px',
                borderRadius: '14px',
                background: '#12161c',
                border: '1px solid rgba(255,255,255,0.06)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'rgba(91, 141, 239, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <Server style={{ width: '28px', height: '28px', color: '#5b8def' }} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '8px' }}>
                No servers yet
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7c8f', marginBottom: '20px', maxWidth: '280px' }}>
                Add your first server to start tracking views, votes, and grow your community.
              </p>
              <Link
                href="/servers/new"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  height: '40px',
                  padding: '0 20px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #5b8def 0%, #4a7bd4 100%)',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(91, 141, 239, 0.25)',
                }}
              >
                <Plus style={{ width: '16px', height: '16px' }} />
                Add Your First Server
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {servers.map((server) => (
                <ServerRow key={server.id} server={server} />
              ))}
            </div>
          )}
        </div>

        {/* Right: Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Quick Actions Card */}
          <div
            style={{
              padding: '20px',
              borderRadius: '14px',
              background: '#12161c',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '16px' }}>
              Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link
                href="/servers/new"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: '#c8d4e0',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <Plus style={{ width: '16px', height: '16px', color: '#5b8def' }} />
                Add New Server
              </Link>
              <Link
                href="/dashboard/settings"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: '#c8d4e0',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <Settings style={{ width: '16px', height: '16px', color: '#8899aa' }} />
                Account Settings
              </Link>
            </div>
          </div>

          {/* Tips Card */}
          <div
            style={{
              padding: '20px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(91, 141, 239, 0.08) 0%, rgba(91, 141, 239, 0.02) 100%)',
              border: '1px solid rgba(91, 141, 239, 0.15)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Zap style={{ width: '16px', height: '16px', color: '#5b8def' }} />
              <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f1f5f9' }}>
                Pro Tips
              </h3>
            </div>
            <ul style={{
              margin: 0,
              padding: '0 0 0 16px',
              fontSize: '0.75rem',
              color: '#8899aa',
              lineHeight: 1.7,
            }}>
              <li>Add a banner image to stand out</li>
              <li>Write a detailed description</li>
              <li>Keep your server info up to date</li>
              <li>Encourage players to vote</li>
            </ul>
          </div>

          {/* Help Card */}
          <div
            style={{
              padding: '16px',
              borderRadius: '14px',
              background: '#12161c',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <HelpCircle style={{ width: '18px', height: '18px', color: '#6b7c8f' }} />
              <div>
                <p style={{ fontSize: '0.8125rem', color: '#c8d4e0', fontWeight: 500, marginBottom: '2px' }}>
                  Need help?
                </p>
                <Link
                  href="/contact"
                  style={{ fontSize: '0.75rem', color: '#5b8def', textDecoration: 'none' }}
                >
                  Contact support →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
