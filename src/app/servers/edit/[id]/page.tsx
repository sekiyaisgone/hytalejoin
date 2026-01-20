import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getServerById } from '@/lib/servers';
import ServerForm from '@/components/servers/ServerForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: 'Edit Server',
};

export default async function EditServerPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/servers/edit/' + id);
  }

  const server = await getServerById(id);

  if (!server) {
    notFound();
  }

  // Check ownership
  if (server.owner_id !== user.id) {
    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (!profile?.is_admin) {
      redirect('/dashboard');
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-[#8fa3b8] hover:text-[#e8f0f8] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#e8f0f8] mb-2">Edit Server</h1>
        <p className="text-[#8fa3b8]">Update your server listing information.</p>
      </div>

      <ServerForm userId={user.id} server={server} />
    </div>
  );
}
