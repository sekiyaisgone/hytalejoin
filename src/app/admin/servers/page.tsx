import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import AdminServerActions from '../AdminServerActions';
import { ArrowLeft, Server, Star } from 'lucide-react';

export const metadata = {
  title: 'All Servers - Admin',
};

export default async function AdminServersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/admin/servers');
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    redirect('/');
  }

  const { data: servers } = await supabase
    .from('servers')
    .select('*, profiles!servers_owner_id_fkey(username, email)')
    .order('created_at', { ascending: false });

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
        <Server className="w-8 h-8 text-[#d29f32]" />
        <div>
          <h1 className="text-3xl font-bold text-[#e8f0f8]">All Servers</h1>
          <p className="text-[#8fa3b8]">{servers?.length || 0} total servers</p>
        </div>
      </div>

      <div className="space-y-4">
        {servers?.map((server) => (
          <Card key={server.id} hover={false} padding="md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-semibold text-[#e8f0f8] truncate">
                    {server.name}
                  </h2>
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
                  {server.ip_address}:{server.port} • by{' '}
                  {server.profiles?.username || server.profiles?.email}
                </p>
              </div>
              <AdminServerActions server={server} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
