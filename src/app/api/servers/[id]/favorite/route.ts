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

    // Check if already favorited (use maybeSingle to avoid error when no favorite exists)
    const { data: existingFavorite } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('server_id', id)
      .maybeSingle();

    if (existingFavorite) {
      // Remove favorite
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('server_id', id);

      return NextResponse.json({ favorited: false });
    }

    // Add favorite
    await supabase.from('favorites').insert({
      user_id: user.id,
      server_id: id,
    });

    return NextResponse.json({ favorited: true });
  } catch (error) {
    console.error('Favorite error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
