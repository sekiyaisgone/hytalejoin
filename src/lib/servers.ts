import { createClient } from '@/lib/supabase/server';
import { Server, GameMode, Region, SortOption, PaginatedResponse } from '@/types';

interface GetServersOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  gameModes?: GameMode[];
  regions?: Region[];
  onlineOnly?: boolean;
  sort?: SortOption;
  featured?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  ownerId?: string;
}

export async function getServers(options: GetServersOptions = {}): Promise<PaginatedResponse<Server>> {
  const {
    page = 1,
    pageSize = 12,
    search,
    gameModes = [],
    regions = [],
    onlineOnly = false,
    sort = 'popular',
    featured,
    status = 'approved',
    ownerId,
  } = options;

  const supabase = await createClient();

  let query = supabase
    .from('servers')
    .select('*, profiles!servers_owner_id_fkey(id, username, avatar_url)', { count: 'exact' });

  // Filter by status
  if (status) {
    query = query.eq('status', status);
  }

  // Filter by owner
  if (ownerId) {
    query = query.eq('owner_id', ownerId);
  }

  // Filter by featured
  if (featured !== undefined) {
    query = query.eq('is_featured', featured);
  }

  // Search
  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  // Filter by game modes
  if (gameModes.length > 0) {
    query = query.overlaps('game_modes', gameModes);
  }

  // Filter by regions
  if (regions.length > 0) {
    query = query.in('region', regions);
  }

  // Filter by online status
  if (onlineOnly) {
    query = query.eq('is_online', true);
  }

  // Sorting
  switch (sort) {
    case 'popular':
      query = query.order('views', { ascending: false });
      break;
    case 'players':
      query = query.order('current_players', { ascending: false, nullsFirst: false });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'votes':
      query = query.order('votes', { ascending: false });
      break;
    case 'alphabetical':
      query = query.order('name', { ascending: true });
      break;
    default:
      query = query.order('views', { ascending: false });
  }

  // Pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching servers:', error);
    return { data: [], count: 0, page, pageSize, totalPages: 0 };
  }

  const servers = (data || []).map((server) => ({
    ...server,
    owner: server.profiles,
  })) as Server[];

  return {
    data: servers,
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

export async function getFeaturedServers(): Promise<Server[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('servers')
    .select('*, profiles!servers_owner_id_fkey(id, username, avatar_url)')
    .eq('status', 'approved')
    .eq('is_featured', true)
    .order('votes', { ascending: false })
    .limit(6);

  if (error) {
    console.error('Error fetching featured servers:', error);
    return [];
  }

  return (data || []).map((server) => ({
    ...server,
    owner: server.profiles,
  })) as Server[];
}

export async function getServerById(id: string): Promise<Server | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('servers')
    .select('*, profiles!servers_owner_id_fkey(id, username, avatar_url)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching server:', error);
    return null;
  }

  // Increment view count
  await supabase.rpc('increment_views', { server_id: id });

  return {
    ...data,
    owner: data.profiles,
  } as Server;
}

export async function getServerStats(serverId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('server_stats')
    .select('*')
    .eq('server_id', serverId)
    .order('recorded_at', { ascending: false })
    .limit(168); // Last 7 days of hourly data

  if (error) {
    console.error('Error fetching server stats:', error);
    return [];
  }

  return data || [];
}
