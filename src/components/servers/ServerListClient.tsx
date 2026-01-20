'use client';

import { useState, useEffect, useCallback } from 'react';
import { Server, GameMode, Region, SortOption } from '@/types';
import ServerFilters, { FilterState } from './ServerFilters';
import ServerGrid from './ServerGrid';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ServerListClientProps {
  initialServers: Server[];
  initialCount: number;
  initialTotalPages: number;
}

export default function ServerListClient({
  initialServers,
  initialCount,
  initialTotalPages,
}: ServerListClientProps) {
  const [servers, setServers] = useState<Server[]>(initialServers);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [totalCount, setTotalCount] = useState(initialCount);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    gameModes: [],
    regions: [],
    onlineOnly: false,
  });
  const [sort, setSort] = useState<SortOption>('popular');

  const supabase = createClient();
  const pageSize = 12;

  const fetchServers = useCallback(async () => {
    setIsLoading(true);

    try {
      let query = supabase
        .from('servers')
        .select('*, profiles!servers_owner_id_fkey(id, username, avatar_url)', {
          count: 'exact',
        })
        .eq('status', 'approved');

      // Search
      if (searchQuery) {
        query = query.or(
          `name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
        );
      }

      // Filter by game modes
      if (filters.gameModes.length > 0) {
        query = query.overlaps('game_modes', filters.gameModes);
      }

      // Filter by regions
      if (filters.regions.length > 0) {
        query = query.in('region', filters.regions);
      }

      // Filter by online status
      if (filters.onlineOnly) {
        query = query.eq('is_online', true);
      }

      // Sorting
      switch (sort) {
        case 'popular':
          query = query.order('views', { ascending: false });
          break;
        case 'players':
          query = query.order('current_players', {
            ascending: false,
            nullsFirst: false,
          });
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
      }

      // Pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (error) {
        console.error('Error fetching servers:', error);
        return;
      }

      const fetchedServers = (data || []).map((server) => ({
        ...server,
        owner: server.profiles,
      })) as Server[];

      setServers(fetchedServers);
      setTotalCount(count || 0);
      setTotalPages(Math.ceil((count || 0) / pageSize));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, searchQuery, filters, sort, page]);

  useEffect(() => {
    // Skip initial fetch since we have initial data
    if (
      page === 1 &&
      !searchQuery &&
      filters.gameModes.length === 0 &&
      filters.regions.length === 0 &&
      !filters.onlineOnly &&
      sort === 'popular'
    ) {
      return;
    }
    fetchServers();
  }, [fetchServers, page, searchQuery, filters, sort]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <ServerFilters
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        currentFilters={filters}
        currentSort={sort}
      />

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#8fa3b8]">
          Showing{' '}
          <span className="text-[#e8f0f8] font-medium">
            {Math.min((page - 1) * pageSize + 1, totalCount)}-
            {Math.min(page * pageSize, totalCount)}
          </span>{' '}
          of <span className="text-[#e8f0f8] font-medium">{totalCount}</span>{' '}
          servers
        </p>
      </div>

      <ServerGrid servers={servers} isLoading={isLoading} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  disabled={isLoading}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    page === pageNum
                      ? 'bg-[#d29f32] text-white'
                      : 'bg-[#1a2f4a] text-[#8fa3b8] hover:text-[#e8f0f8] hover:bg-[#2a4060]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || isLoading}
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
