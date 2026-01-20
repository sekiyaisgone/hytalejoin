import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if already voted
    const { data: existingVote } = await supabase
      .from('votes')
      .select('id')
      .eq('user_id', user.id)
      .eq('server_id', id)
      .single();

    if (existingVote) {
      // Remove vote
      await supabase
        .from('votes')
        .delete()
        .eq('user_id', user.id)
        .eq('server_id', id);

      // Decrement vote count
      await supabase.rpc('decrement_votes', { server_id: id });

      return NextResponse.json({ voted: false });
    }

    // Add vote
    await supabase.from('votes').insert({
      user_id: user.id,
      server_id: id,
    });

    // Increment vote count
    await supabase.rpc('increment_votes', { server_id: id });

    return NextResponse.json({ voted: true });
  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
