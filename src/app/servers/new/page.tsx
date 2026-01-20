import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ServerForm from '@/components/servers/ServerForm';

export const metadata = {
  title: 'Add New Server',
  description: 'Submit your Hytale server to be listed on HytaleJoin',
};

export default async function NewServerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/servers/new');
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#e8f0f8] mb-2">Add New Server</h1>
        <p className="text-[#8fa3b8]">
          Submit your server to be listed on HytaleJoin. All submissions are reviewed
          before being published.
        </p>
      </div>

      <ServerForm userId={user.id} />
    </div>
  );
}
