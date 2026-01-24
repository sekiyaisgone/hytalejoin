'use client';

import { useState, useMemo } from 'react';
import { Search, Star, Filter } from 'lucide-react';
import { Server } from '@/types';
import AdminServerActions from '../AdminServerActions';

interface ServerWithProfile extends Server {
  profiles?: {
    username: string | null;
    email: string | null;
  };
}

interface AdminServersClientProps {
  servers: ServerWithProfile[];
  statusCounts: {
    all: number;
    approved: number;
    pending: number;
    rejected: number;
    featured: number;
  };
}

type FilterStatus = 'all' | 'approved' | 'pending' | 'rejected' | 'featured';

export default function AdminServersClient({ servers: initialServers, statusCounts }: AdminServersClientProps) {
  const [servers, setServers] = useState(initialServers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');

  const filteredServers = useMemo(() => {
    let result = servers;

    // Filter by status
    if (statusFilter === 'featured') {
      result = result.filter(s => s.is_featured);
    } else if (statusFilter !== 'all') {
      result = result.filter(s => s.status === statusFilter);
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(searchLower) ||
        s.ip_address.toLowerCase().includes(searchLower) ||
        (s.profiles?.username || '').toLowerCase().includes(searchLower) ||
        (s.profiles?.email || '').toLowerCase().includes(searchLower)
      );
    }

    return result;
  }, [servers, statusFilter, search]);

  // Handle server update (optimistic UI)
  const handleServerUpdate = (serverId: string, updates: Partial<Server>) => {
    setServers(prev => prev.map(s =>
      s.id === serverId ? { ...s, ...updates } : s
    ));
  };

  // Handle server delete (optimistic UI)
  const handleServerDelete = (serverId: string) => {
    setServers(prev => prev.filter(s => s.id !== serverId));
  };

  const filterTabs: { key: FilterStatus; label: string; count: number; color: string }[] = [
    { key: 'all', label: 'All', count: statusCounts.all, color: '#5b8def' },
    { key: 'approved', label: 'Approved', count: statusCounts.approved, color: '#22c55e' },
    { key: 'pending', label: 'Pending', count: statusCounts.pending, color: '#eab308' },
    { key: 'rejected', label: 'Rejected', count: statusCounts.rejected, color: '#ef4444' },
    { key: 'featured', label: 'Featured', count: statusCounts.featured, color: '#d4a033' },
  ];

  const getStatusBadge = (status: string, isFeatured: boolean) => {
    const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
      approved: { bg: 'rgba(34, 197, 94, 0.1)', text: '#86efac', dot: '#22c55e' },
      pending: { bg: 'rgba(234, 179, 8, 0.1)', text: '#fde047', dot: '#eab308' },
      rejected: { bg: 'rgba(239, 68, 68, 0.1)', text: '#fca5a5', dot: '#ef4444' },
    };

    const style = statusStyles[status] || statusStyles.pending;

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '8px',
            background: style.bg,
            fontSize: '0.75rem',
            fontWeight: 500,
            color: style.text,
            textTransform: 'capitalize',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: style.dot }} />
          {status}
        </span>
        {isFeatured && (
          <Star style={{ width: '16px', height: '16px', color: '#d4a033', fill: '#d4a033' }} />
        )}
      </div>
    );
  };

  return (
    <>
      {/* Filters and Search */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '24px',
      }}>
        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
        }}>
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: 'all 0.15s ease',
                background: statusFilter === tab.key ? `${tab.color}20` : 'rgba(255,255,255,0.04)',
                color: statusFilter === tab.key ? tab.color : '#8fa3b8',
                boxShadow: statusFilter === tab.key ? `inset 0 0 0 1px ${tab.color}40` : 'none',
              }}
            >
              {tab.label}
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: statusFilter === tab.key ? `${tab.color}30` : 'rgba(255,255,255,0.06)',
                  fontSize: '0.75rem',
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '18px',
              height: '18px',
              color: '#6b7c8f',
            }}
          />
          <input
            type="text"
            placeholder="Search servers, owners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              height: '44px',
              paddingLeft: '44px',
              paddingRight: '16px',
              background: '#12161c',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              color: '#f1f5f9',
              fontSize: '0.875rem',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Results count */}
      {search && (
        <p style={{ fontSize: '0.875rem', color: '#6b7c8f', marginBottom: '16px' }}>
          {filteredServers.length} result{filteredServers.length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Server Table */}
      <div style={{
        background: '#12161c',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '14px',
        overflow: 'hidden',
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
          gap: '16px',
          padding: '14px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7c8f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Server
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7c8f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Owner
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7c8f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Status
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7c8f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Created
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7c8f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Actions
          </span>
        </div>

        {/* Table Body */}
        {filteredServers.length > 0 ? (
          filteredServers.map((server, index) => (
            <div
              key={server.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                gap: '16px',
                padding: '16px 20px',
                alignItems: 'center',
                borderBottom: index < filteredServers.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                transition: 'background 0.15s ease',
              }}
            >
              {/* Server Info */}
              <div>
                <h3 style={{
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: '#f1f5f9',
                  marginBottom: '4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {server.name}
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#6b7c8f', fontFamily: 'monospace' }}>
                  {server.ip_address}:{server.port}
                </p>
              </div>

              {/* Owner */}
              <div>
                <p style={{ fontSize: '0.875rem', color: '#c8d4e0' }}>
                  {server.profiles?.username || 'Unknown'}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#6b7c8f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {server.profiles?.email}
                </p>
              </div>

              {/* Status */}
              {getStatusBadge(server.status, server.is_featured)}

              {/* Created Date */}
              <span style={{ fontSize: '0.875rem', color: '#8fa3b8' }}>
                {new Date(server.created_at).toLocaleDateString()}
              </span>

              {/* Actions */}
              <AdminServerActions
                server={server}
                showViewButton={server.status === 'approved'}
                onServerUpdate={handleServerUpdate}
                onServerDelete={handleServerDelete}
              />
            </div>
          ))
        ) : (
          <div style={{
            padding: '48px 20px',
            textAlign: 'center',
          }}>
            <Filter style={{ width: '32px', height: '32px', color: '#4a5d73', margin: '0 auto 12px' }} />
            <p style={{ fontSize: '0.9375rem', color: '#6b7c8f' }}>
              No servers match your filters
            </p>
          </div>
        )}
      </div>
    </>
  );
}
