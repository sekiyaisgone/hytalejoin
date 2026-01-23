import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import AdminServerActions from '../AdminServerActions';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm text-[#8fa3b8] hover:text-[#e8f0f8] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to admin
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <Clock className="w-8 h-8 text-yellow-400" />
        <div>
          <h1 className="text-3xl font-bold text-[#e8f0f8]">Pending Servers</h1>
          <p className="text-[#8fa3b8]">{servers?.length || 0} servers waiting for review</p>
        </div>
      </div>

      {servers && servers.length > 0 ? (
        <div className="space-y-4">
          {servers.map((server) => (
            <Card key={server.id} hover={false} padding="lg">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-semibold text-[#e8f0f8]">{server.name}</h2>
                    <Badge variant="warning">Pending</Badge>
                  </div>
                  <p className="text-[#8fa3b8] mb-3">
                    {server.ip_address}:{server.port}
                  </p>
                  <p className="text-[#8fa3b8] mb-4 line-clamp-3">{server.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {server.game_modes?.map((mode: string) => (
                      <Badge key={mode} variant="default">
                        {mode}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-[#8fa3b8]">
                    Submitted by <span className="text-[#e8f0f8]">{server.profiles?.username || server.profiles?.email}</span>{' '}
                    on {new Date(server.created_at).toLocaleDateString()}
                  </p>
                </div>
                <AdminServerActions server={server} />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card hover={false} padding="lg">
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-[#8fa3b8] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#e8f0f8] mb-2">No pending servers</h3>
            <p className="text-[#8fa3b8]">All server submissions have been reviewed.</p>
          </div>
        </Card>
      )}
    </div>
  );
}
