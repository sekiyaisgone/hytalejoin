'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Copy, Check, Users, ExternalLink, Globe } from 'lucide-react';
import { Server, GameMode } from '@/types';
import { useState, useCallback } from 'react';

interface ServerCardProps {
  server: Server;
}

// Tag color scheme - subtle, professional
const tagStyles: Record<GameMode, { bg: string; border: string; dot: string; text: string }> = {
  pvp: { bg: 'rgba(239, 68, 68, 0.08)', border: 'rgba(239, 68, 68, 0.2)', dot: '#ef4444', text: '#fca5a5' },
  survival: { bg: 'rgba(249, 115, 22, 0.08)', border: 'rgba(249, 115, 22, 0.2)', dot: '#f97316', text: '#fdba74' },
  creative: { bg: 'rgba(59, 130, 246, 0.08)', border: 'rgba(59, 130, 246, 0.2)', dot: '#3b82f6', text: '#93c5fd' },
  'mini-games': { bg: 'rgba(168, 85, 247, 0.08)', border: 'rgba(168, 85, 247, 0.2)', dot: '#a855f7', text: '#d8b4fe' },
  rpg: { bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.2)', dot: '#f59e0b', text: '#fcd34d' },
  adventure: { bg: 'rgba(20, 184, 166, 0.08)', border: 'rgba(20, 184, 166, 0.2)', dot: '#14b8a6', text: '#5eead4' },
  roleplay: { bg: 'rgba(236, 72, 153, 0.08)', border: 'rgba(236, 72, 153, 0.2)', dot: '#ec4899', text: '#f9a8d4' },
  faction: { bg: 'rgba(234, 179, 8, 0.08)', border: 'rgba(234, 179, 8, 0.2)', dot: '#eab308', text: '#fde047' },
  skyblock: { bg: 'rgba(6, 182, 212, 0.08)', border: 'rgba(6, 182, 212, 0.2)', dot: '#06b6d4', text: '#67e8f9' },
  vanilla: { bg: 'rgba(132, 204, 22, 0.08)', border: 'rgba(132, 204, 22, 0.2)', dot: '#84cc16', text: '#bef264' },
  pve: { bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.2)', dot: '#10b981', text: '#6ee7b7' },
  'multi-server': { bg: 'rgba(99, 102, 241, 0.08)', border: 'rgba(99, 102, 241, 0.2)', dot: '#6366f1', text: '#a5b4fc' },
};

const tagLabels: Record<GameMode, string> = {
  pvp: 'PvP',
  survival: 'Survival',
  creative: 'Creative',
  'mini-games': 'Mini-games',
  rpg: 'RPG',
  adventure: 'Adventure',
  roleplay: 'Roleplay',
  faction: 'Faction',
  skyblock: 'Skyblock',
  vanilla: 'Vanilla',
  pve: 'PvE',
  'multi-server': 'Network',
};

const regionLabels: Record<string, string> = {
  'north-america': 'NA',
  'south-america': 'SA',
  'europe': 'EU',
  'asia': 'AS',
  'oceania': 'OCE',
  'africa': 'AF',
};

function getGradient(name: string): string {
  const gradients = [
    'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    'linear-gradient(135deg, #27272a 0%, #18181b 100%)',
    'linear-gradient(135deg, #262626 0%, #171717 100%)',
    'linear-gradient(135deg, #1c1917 0%, #0c0a09 100%)',
    'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
  ];
  return gradients[name.charCodeAt(0) % gradients.length];
}

// Sub-components
function ModeTag({ mode }: { mode: GameMode }) {
  const style = tagStyles[mode];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        height: '24px',
        padding: '0 10px',
        fontSize: '0.6875rem',
        fontWeight: 500,
        borderRadius: '8px',
        background: style.bg,
        border: `1px solid ${style.border}`,
        color: style.text,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: style.dot,
        }}
      />
      {tagLabels[mode]}
    </span>
  );
}

function StatChip({ icon, value, label }: { icon: React.ReactNode; value: number | string; label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '8px',
        background: 'rgba(255,255,255,0.03)',
      }}
    >
      <span style={{ color: '#6b7c8f', display: 'flex' }}>{icon}</span>
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#e2e8f0' }}>{value}</span>
      <span style={{ fontSize: '0.6875rem', color: '#6b7c8f' }}>{label}</span>
    </div>
  );
}

function StatusBadge({ isOnline }: { isOnline: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '8px',
        background: isOnline ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)',
        border: `1px solid ${isOnline ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)'}`,
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: isOnline ? '#22c55e' : '#eab308',
          boxShadow: isOnline ? '0 0 6px rgba(34, 197, 94, 0.5)' : '0 0 6px rgba(234, 179, 8, 0.5)',
        }}
      />
      <span
        style={{
          fontSize: '0.6875rem',
          fontWeight: 500,
          color: isOnline ? '#86efac' : '#fde047',
        }}
      >
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  );
}

export default function ServerCard({ server }: ServerCardProps) {
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const copyIP = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const ip = server.port === 25565 ? server.ip_address : `${server.ip_address}:${server.port}`;

    try {
      await navigator.clipboard.writeText(ip);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = ip;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [server.ip_address, server.port]);

  const displayIP = server.port === 25565 ? server.ip_address : `${server.ip_address}:${server.port}`;

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: '14px',
        background: '#12161c',
        border: `1px solid ${isHovered ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'}`,
        transition: 'all 0.2s ease',
        transform: isHovered ? 'translateY(-2px)' : 'none',
        boxShadow: isHovered ? '0 8px 24px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.2)',
      }}
    >
      {/* Banner */}
      <div
        style={{
          position: 'relative',
          height: '100px',
          background: getGradient(server.name),
        }}
      >
        {server.banner_image_url && !imageError ? (
          <Image
            src={server.banner_image_url}
            alt={server.name}
            fill
            style={{ objectFit: 'cover' }}
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                color: 'rgba(255,255,255,0.06)',
                userSelect: 'none',
              }}
            >
              {server.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, #12161c 0%, transparent 60%)',
          }}
        />

        {/* Status Badge - top right */}
        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
          <StatusBadge isOnline={server.is_online} />
        </div>

        {/* Region Badge - top left */}
        {server.region && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '6px',
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Globe style={{ width: '10px', height: '10px', color: '#8899aa' }} />
            <span style={{ fontSize: '0.625rem', fontWeight: 600, color: '#c8d4e0' }}>
              {regionLabels[server.region] || server.region}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px' }}>
        {/* Header: Name */}
        <h3
          style={{
            fontSize: '0.9375rem',
            fontWeight: 600,
            color: '#f1f5f9',
            marginBottom: '2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {server.name}
        </h3>

        {/* IP Address - muted, clickable */}
        <button
          onClick={copyIP}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.6875rem',
            color: '#6b7c8f',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            marginBottom: '10px',
            textAlign: 'left',
          }}
        >
          <span style={{ fontFamily: 'monospace' }}>{displayIP}</span>
          <Copy style={{ width: '10px', height: '10px' }} />
        </button>

        {/* Description */}
        <p
          style={{
            fontSize: '0.75rem',
            color: '#8899aa',
            lineHeight: 1.5,
            marginBottom: '12px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {server.short_description || server.description || 'No description available'}
        </p>

        {/* Mode Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
          {server.game_modes.slice(0, 3).map((mode) => (
            <ModeTag key={mode} mode={mode} />
          ))}
          {server.game_modes.length > 3 && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: '24px',
                padding: '0 8px',
                fontSize: '0.6875rem',
                fontWeight: 500,
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#6b7c8f',
              }}
            >
              +{server.game_modes.length - 3}
            </span>
          )}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1, minHeight: '4px' }} />

        {/* Divider */}
        <div
          style={{
            height: '1px',
            background: 'rgba(255,255,255,0.06)',
            marginBottom: '12px',
          }}
        />

        {/* Footer: Stats + Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Left: Stat Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {server.is_online && server.current_players !== null && (
              <StatChip
                icon={<Users style={{ width: '12px', height: '12px' }} />}
                value={server.current_players}
                label="online"
              />
            )}
            <StatChip
              icon={<Heart style={{ width: '12px', height: '12px', fill: '#ef4444', color: '#ef4444' }} />}
              value={server.votes}
              label="votes"
            />
          </div>

          {/* Right: Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={copyIP}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                height: '34px',
                padding: '0 14px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 500,
                transition: 'all 0.15s ease',
                background: copied
                  ? 'rgba(34, 197, 94, 0.15)'
                  : 'linear-gradient(135deg, #5b8def 0%, #4a7bd4 100%)',
                color: copied ? '#86efac' : 'white',
                boxShadow: copied ? 'none' : '0 2px 8px rgba(91, 141, 239, 0.25)',
              }}
            >
              {copied ? (
                <>
                  <Check style={{ width: '13px', height: '13px' }} />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy style={{ width: '13px', height: '13px' }} />
                  <span>Copy IP</span>
                </>
              )}
            </button>
            <Link
              href={`/servers/${server.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                height: '34px',
                padding: '0 14px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '0.75rem',
                fontWeight: 500,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#c8d4e0',
                transition: 'all 0.15s ease',
              }}
            >
              <span>View</span>
              <ExternalLink style={{ width: '12px', height: '12px' }} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
