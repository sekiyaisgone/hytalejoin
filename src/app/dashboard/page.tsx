import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getServers } from '@/lib/servers';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Plus, Server, Eye, ThumbsUp, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import DeleteServerButton from './DeleteServerButton';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/dashboard');
  }

  const { data: servers } = await getServers({
    ownerId: user.id,
    status: undefined, // Get all statuses for the owner
    pageSize: 100,
  });

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Calculate stats
  const totalViews = servers.reduce((acc, s) => acc + s.views, 0);
  const totalVotes = servers.reduce((acc, s) => acc + s.votes, 0);
  const approvedServers = servers.filter((s) => s.status === 'approved').length;
  const pendingServers = servers.filter((s) => s.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#e8f0f8]">Dashboard</h1>
          <p className="text-[#8fa3b8]">
            Welcome back, {profile?.username || user.email?.split('@')[0]}
          </p>
        </div>
        <Link href="/servers/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>Add New Server</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card hover={false} padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-[#d29f32]/20">
              <Server className="w-5 h-5 text-[#d29f32]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#e8f0f8]">{servers.length}</p>
              <p className="text-sm text-[#8fa3b8]">Total Servers</p>
            </div>
          </div>
        </Card>
        <Card hover={false} padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-500/20">
              <Server className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#e8f0f8]">{approvedServers}</p>
              <p className="text-sm text-[#8fa3b8]">Approved</p>
            </div>
          </div>
        </Card>
        <Card hover={false} padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <Eye className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#e8f0f8]">{totalViews}</p>
              <p className="text-sm text-[#8fa3b8]">Total Views</p>
            </div>
          </div>
        </Card>
        <Card hover={false} padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-purple-500/20">
              <ThumbsUp className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#e8f0f8]">{totalVotes}</p>
              <p className="text-sm text-[#8fa3b8]">Total Votes</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pending notice */}
      {pendingServers > 0 && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-yellow-400">
            You have <strong>{pendingServers}</strong> server(s) pending approval.
            They will be visible to other users once approved by an admin.
          </p>
        </div>
      )}

      {/* Server list */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[#e8f0f8]">Your Servers</h2>

        {servers.length === 0 ? (
          <Card hover={false} padding="lg">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[#1a2f4a] rounded-full flex items-center justify-center mx-auto mb-4">
                <Server className="w-8 h-8 text-[#8fa3b8]" />
              </div>
              <h3 className="text-lg font-semibold text-[#e8f0f8] mb-2">
                No servers yet
              </h3>
              <p className="text-[#8fa3b8] mb-4">
                Add your first server to get started
              </p>
              <Link href="/servers/new">
                <Button leftIcon={<Plus className="w-4 h-4" />}>
                  Add Your First Server
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {servers.map((server) => (
              <Card key={server.id} hover={false} padding="md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-[#e8f0f8] truncate">
                        {server.name}
                      </h3>
                      <Badge
                        variant={
                          server.status === 'approved'
                            ? 'success'
                            : server.status === 'pending'
                            ? 'warning'
                            : 'error'
                        }
                      >
                        {server.status}
                      </Badge>
                      {server.is_online && (
                        <Badge variant="success">Online</Badge>
                      )}
                    </div>
                    <p className="text-sm text-[#8fa3b8]">
                      {server.ip_address}:{server.port}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-[#8fa3b8]">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {server.views} views
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {server.votes} votes
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {server.status === 'approved' && (
                      <Link href={`/servers/${server.id}`}>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                    <Link href={`/servers/edit/${server.id}`}>
                      <Button variant="secondary" size="sm">
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </Link>
                    <DeleteServerButton serverId={server.id} serverName={server.name} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
