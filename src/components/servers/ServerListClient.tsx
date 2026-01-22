'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Server, GameMode, Region, SortOption } from '@/types';
import ServerFilters, { FilterState } from './ServerFilters';
import ServerGrid from './ServerGrid';
import { createClient } from '@/lib/supabase/client';
import { mockServers } from '@/lib/mockServers';
import Button from '@/components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ServerListClientProps {
  initialServers: Server[];
  initialCount: number;
  initialTotalPages: number;
  useMockFallback?: boolean;
}

export default function ServerListClient({
  initialServers,
  initialCount,
  initialTotalPages,
  useMockFallback = false,
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

  // Filter mock servers locally when using mock fallback
  const filteredMockServers = useMemo(() => {
    if (!useMockFallback) return [];

    let result = [...mockServers];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.description?.toLowerCase().includes(query)
      );
    }

    // Game mode filter
    if (filters.gameModes.length > 0) {
      result = result.filter((s) =>
        s.game_modes.some((mode) => filters.gameModes.includes(mode))
      );
    }

    // Region filter
    if (filters.regions.length > 0) {
      result = result.filter((s) => filters.regions.includes(s.region));
    }

    // Online only filter
    if (filters.onlineOnly) {
      result = result.filter((s) => s.is_online);
    }

    // Sorting
    switch (sort) {
      case 'popular':
        result.sort((a, b) => b.views - a.views);
        break;
      case 'players':
        result.sort((a, b) => (b.current_players || 0) - (a.current_players || 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'votes':
        result.sort((a, b) => b.votes - a.votes);
        break;
      case 'alphabetical':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [useMockFallback, searchQuery, filters, sort]);

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
    // If using mock data, update with filtered results
    if (useMockFallback) {
      setServers(filteredMockServers);
      setTotalCount(filteredMockServers.length);
      setTotalPages(1);
      return;
    }

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
  }, [fetchServers, page, searchQuery, filters, sort, useMockFallback, filteredMockServers]);

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <ServerFilters
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        currentFilters={filters}
        currentSort={sort}
      />

      {/* Results count */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontSize: '0.875rem', color: '#8fa3b8' }}>
          Showing{' '}
          <span style={{ color: '#e8f0f8', fontWeight: 500 }}>
            {Math.min((page - 1) * pageSize + 1, totalCount)}-
            {Math.min(page * pageSize, totalCount)}
          </span>{' '}
          of <span style={{ color: '#e8f0f8', fontWeight: 500 }}>{totalCount}</span>{' '}
          servers
        </p>
      </div>

      <ServerGrid servers={servers} isLoading={isLoading} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', paddingTop: '32px' }}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Previous
          </Button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
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
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    fontWeight: 500,
                    transition: 'all 0.2s',
                    border: 'none',
                    cursor: 'pointer',
                    background: page === pageNum ? '#d29f32' : '#1a2f4a',
                    color: page === pageNum ? 'white' : '#8fa3b8',
                  }}
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
