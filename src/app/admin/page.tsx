import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Server, Users, Clock, CheckCircle, XCircle, Star } from 'lucide-react';

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
    { count: totalUsers },
    { data: recentServers },
  ] = await Promise.all([
    supabase.from('servers').select('*', { count: 'exact', head: true }),
    supabase.from('servers').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('servers').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase
      .from('servers')
      .select('*, profiles!servers_owner_id_fkey(username)')
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#e8f0f8]">Admin Panel</h1>
        <p className="text-[#8fa3b8]">Manage servers and users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card hover={false} padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <Server className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#e8f0f8]">{totalServers}</p>
              <p className="text-sm text-[#8fa3b8]">Total Servers</p>
            </div>
          </div>
        </Card>
        <Card hover={false} padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-yellow-500/20">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#e8f0f8]">{pendingServers}</p>
              <p className="text-sm text-[#8fa3b8]">Pending</p>
            </div>
          </div>
        </Card>
        <Card hover={false} padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-500/20">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#e8f0f8]">{approvedServers}</p>
              <p className="text-sm text-[#8fa3b8]">Approved</p>
            </div>
          </div>
        </Card>
        <Card hover={false} padding="md">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-purple-500/20">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#e8f0f8]">{totalUsers}</p>
              <p className="text-sm text-[#8fa3b8]">Users</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link href="/admin/servers">
          <Card className="h-full">
            <div className="flex items-center gap-3">
              <Server className="w-6 h-6 text-[#d29f32]" />
              <div>
                <h3 className="font-semibold text-[#e8f0f8]">Manage Servers</h3>
                <p className="text-sm text-[#8fa3b8]">Approve, edit, or delete servers</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/admin/users">
          <Card className="h-full">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-[#d29f32]" />
              <div>
                <h3 className="font-semibold text-[#e8f0f8]">Manage Users</h3>
                <p className="text-sm text-[#8fa3b8]">View and manage user accounts</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/admin/pending">
          <Card className="h-full">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-[#d29f32]" />
              <div>
                <h3 className="font-semibold text-[#e8f0f8]">Pending Queue</h3>
                <p className="text-sm text-[#8fa3b8]">Review {pendingServers} pending servers</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent servers */}
      <Card hover={false} padding="lg">
        <h2 className="text-xl font-semibold text-[#e8f0f8] mb-4">Recent Submissions</h2>
        <div className="space-y-3">
          {recentServers?.map((server) => (
            <div
              key={server.id}
              className="flex items-center justify-between p-3 bg-[#1a2f4a] rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-[#e8f0f8] truncate">{server.name}</h3>
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
                  {server.is_featured && (
                    <Star className="w-4 h-4 text-[#d29f32] fill-[#d29f32]" />
                  )}
                </div>
                <p className="text-sm text-[#8fa3b8]">
                  by {server.profiles?.username || 'Unknown'} •{' '}
                  {new Date(server.created_at).toLocaleDateString()}
                </p>
              </div>
              <Link
                href={`/admin/servers/${server.id}`}
                className="text-[#d29f32] hover:text-[#e5b343] text-sm font-medium"
              >
                Review
              </Link>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
