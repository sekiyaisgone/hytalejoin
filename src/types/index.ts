export type ServerStatus = 'pending' | 'approved' | 'rejected';

export type GameMode =
  | 'pvp'
  | 'survival'
  | 'creative'
  | 'mini-games'
  | 'rpg'
  | 'adventure'
  | 'roleplay'
  | 'faction'
  | 'skyblock'
  | 'vanilla'
  | 'pve'
  | 'multi-server';

export type Region =
  | 'north-america'
  | 'south-america'
  | 'europe'
  | 'asia'
  | 'oceania'
  | 'africa';

export interface User {
  id: string;
  email: string;
  username: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Server {
  id: string;
  owner_id: string;
  name: string;
  ip_address: string;
  port: number;
  description: string;
  short_description: string | null;
  game_modes: GameMode[];
  tags: string[];
  version: string;
  region: Region;
  max_players: number;
  current_players: number | null;
  discord_url: string | null;
  website_url: string | null;
  banner_image_url: string | null;
  screenshots: string[];
  status: ServerStatus;
  is_online: boolean;
  is_featured: boolean;
  votes: number;
  views: number;
  created_at: string;
  updated_at: string;
  owner?: User;
}

export interface ServerStats {
  id: string;
  server_id: string;
  player_count: number;
  is_online: boolean;
  recorded_at: string;
}

export interface Vote {
  id: string;
  user_id: string;
  server_id: string;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  server_id: string;
  created_at: string;
}

export interface ServerFilters {
  search?: string;
  gameModes?: GameMode[];
  regions?: Region[];
  minPlayers?: number;
  maxPlayers?: number;
  isOnline?: boolean;
  isFeatured?: boolean;
  version?: string;
}

export type SortOption =
  | 'popular'
  | 'players'
  | 'newest'
  | 'alphabetical'
  | 'votes';

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ServerFormData {
  name: string;
  ip_address: string;
  port: number;
  description: string;
  short_description: string;
  game_modes: GameMode[];
  tags: string[];
  version: string;
  region: Region;
  max_players: number;
  discord_url?: string;
  website_url?: string;
  banner_image?: File | null;
  screenshots?: File[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
