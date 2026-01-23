import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { ArrowLeft, Users, Shield } from 'lucide-react';

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
        <Users className="w-8 h-8 text-purple-400" />
        <div>
          <h1 className="text-3xl font-bold text-[#e8f0f8]">Users</h1>
          <p className="text-[#8fa3b8]">{users?.length || 0} registered users</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-[rgba(255,255,255,0.08)]">
              <th className="pb-3 text-sm font-semibold text-[#8fa3b8]">User</th>
              <th className="pb-3 text-sm font-semibold text-[#8fa3b8]">Email</th>
              <th className="pb-3 text-sm font-semibold text-[#8fa3b8]">Servers</th>
              <th className="pb-3 text-sm font-semibold text-[#8fa3b8]">Joined</th>
              <th className="pb-3 text-sm font-semibold text-[#8fa3b8]">Role</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr
                key={u.id}
                className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[#1a2f4a]/50"
              >
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1a2f4a] flex items-center justify-center">
                      <span className="text-sm font-medium text-[#8fa3b8]">
                        {(u.username || u.email || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-[#e8f0f8]">
                      {u.username || 'No username'}
                    </span>
                  </div>
                </td>
                <td className="py-4 text-[#8fa3b8]">{u.email}</td>
                <td className="py-4 text-[#e8f0f8]">{serverCounts?.[u.id] || 0}</td>
                <td className="py-4 text-[#8fa3b8]">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="py-4">
                  {u.is_admin ? (
                    <Badge variant="gold">
                      <Shield className="w-3 h-3 mr-1" />
                      Admin
                    </Badge>
                  ) : (
                    <Badge variant="default">User</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
