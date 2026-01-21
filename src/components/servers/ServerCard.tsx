'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Copy, Check } from 'lucide-react';
import { Server, GameMode } from '@/types';
import { useState, useCallback } from 'react';

interface ServerCardProps {
  server: Server;
}

// Modern pill-style game mode badges with inline styles for reliability
const gameModeStyles: Record<GameMode, { bg: string; border: string; text: string; label: string }> = {
  pvp: { bg: 'rgba(239,68,68,0.2)', border: 'rgba(239,68,68,0.5)', text: '#f87171', label: 'PvP' },
  survival: { bg: 'rgba(249,115,22,0.2)', border: 'rgba(249,115,22,0.5)', text: '#fb923c', label: 'Survival' },
  creative: { bg: 'rgba(59,130,246,0.2)', border: 'rgba(59,130,246,0.5)', text: '#60a5fa', label: 'Creative' },
  'mini-games': { bg: 'rgba(168,85,247,0.2)', border: 'rgba(168,85,247,0.5)', text: '#c084fc', label: 'Minigames' },
  rpg: { bg: 'rgba(245,158,11,0.2)', border: 'rgba(245,158,11,0.5)', text: '#fbbf24', label: 'RPG' },
  adventure: { bg: 'rgba(20,184,166,0.2)', border: 'rgba(20,184,166,0.5)', text: '#2dd4bf', label: 'Adventure' },
  roleplay: { bg: 'rgba(236,72,153,0.2)', border: 'rgba(236,72,153,0.5)', text: '#f472b6', label: 'Roleplay' },
  faction: { bg: 'rgba(234,179,8,0.2)', border: 'rgba(234,179,8,0.5)', text: '#facc15', label: 'Faction' },
  skyblock: { bg: 'rgba(6,182,212,0.2)', border: 'rgba(6,182,212,0.5)', text: '#22d3ee', label: 'Skyblock' },
  vanilla: { bg: 'rgba(132,204,22,0.2)', border: 'rgba(132,204,22,0.5)', text: '#a3e635', label: 'Vanilla' },
  pve: { bg: 'rgba(16,185,129,0.2)', border: 'rgba(16,185,129,0.5)', text: '#34d399', label: 'PvE' },
  'multi-server': { bg: 'rgba(99,102,241,0.2)', border: 'rgba(99,102,241,0.5)', text: '#818cf8', label: 'Network' },
};

// Generate consistent gradient based on server name
function getGradient(name: string): string {
  const gradients = [
    'from-blue-900 via-blue-800 to-slate-900',
    'from-purple-900 via-purple-800 to-slate-900',
    'from-emerald-900 via-emerald-800 to-slate-900',
    'from-amber-900 via-amber-800 to-slate-900',
    'from-rose-900 via-rose-800 to-slate-900',
    'from-cyan-900 via-cyan-800 to-slate-900',
  ];
  const index = name.charCodeAt(0) % gradients.length;
  return gradients[index];
}

export default function ServerCard({ server }: ServerCardProps) {
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyIP = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const ip = server.port === 25565 ? server.ip_address : `${server.ip_address}:${server.port}`;

    try {
      await navigator.clipboard.writeText(ip);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = ip;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [server.ip_address, server.port]);

  const gradient = getGradient(server.name);

  return (
    <Link href={`/servers/${server.id}`} className="block group">
      <article className="relative overflow-hidden rounded-xl bg-[#131a24] border border-[#2a3548] transition-all duration-300 ease-out hover:border-[#4a5f7a] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
        {/* Banner Image with Server Name Overlay */}
        <div className={`relative h-28 bg-gradient-to-br ${gradient} overflow-hidden`}>
          {server.banner_image_url && !imageError ? (
            <Image
              src={server.banner_image_url}
              alt={server.name}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-110">
              <span className="text-5xl font-bold text-white/15 select-none">
                {server.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Server name at bottom of banner */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-lg font-bold text-white drop-shadow-lg line-clamp-1">
              {server.name}
            </h3>
          </div>

          {/* Copy IP button (shown on hover) */}
          <button
            onClick={copyIP}
            className={`absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              copied
                ? 'bg-green-500 text-white scale-105'
                : 'bg-black/70 text-white opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 hover:bg-black/90'
            }`}
          >
            {copied ? (
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Copied!
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Copy className="w-3.5 h-3.5" /> Copy IP
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Description */}
          <p className="text-sm text-[#8899aa] line-clamp-2 mb-3 min-h-[40px] leading-relaxed">
            {server.short_description || server.description || 'No description available'}
          </p>

          {/* Game mode tags - modern pill style */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {server.game_modes.slice(0, 3).map((mode) => {
              const style = gameModeStyles[mode];
              return (
                <span
                  key={mode}
                  style={{
                    background: style.bg,
                    border: `1px solid ${style.border}`,
                    color: style.text,
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: 500,
                  }}
                >
                  {style.label}
                </span>
              );
            })}
            {server.game_modes.length > 3 && (
              <span
                style={{
                  background: 'rgba(100,116,139,0.2)',
                  border: '1px solid rgba(100,116,139,0.5)',
                  color: '#94a3b8',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 500,
                }}
              >
                +{server.game_modes.length - 3}
              </span>
            )}
          </div>

          {/* Footer: Status and Votes */}
          <div className="flex items-center justify-between pt-3 border-t border-[#2a3548]">
            {/* Online status */}
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  server.is_online ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-yellow-500'
                }`}
              />
              <span className={`text-xs font-semibold uppercase tracking-wide ${
                server.is_online ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {server.is_online ? 'Online' : 'Soon'}
              </span>
              {server.is_online && server.current_players !== null && (
                <span className="text-xs text-[#6b7c93]">
                  {server.current_players} players
                </span>
              )}
            </div>

            {/* Vote count */}
            <div className="flex items-center gap-1.5 transition-transform duration-200 group-hover:scale-110">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span className="text-sm font-bold text-white">{server.votes}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
