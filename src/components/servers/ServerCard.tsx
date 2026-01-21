'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Copy, Check } from 'lucide-react';
import { Server, GameMode } from '@/types';
import { useState, useCallback } from 'react';

interface ServerCardProps {
  server: Server;
}

const tagColors: Record<GameMode, string> = {
  pvp: 'tag-red',
  survival: 'tag-orange',
  creative: 'tag-blue',
  'mini-games': 'tag-purple',
  rpg: 'tag-amber',
  adventure: 'tag-teal',
  roleplay: 'tag-pink',
  faction: 'tag-yellow',
  skyblock: 'tag-cyan',
  vanilla: 'tag-lime',
  pve: 'tag-emerald',
  'multi-server': 'tag-indigo',
};

const tagLabels: Record<GameMode, string> = {
  pvp: 'PvP',
  survival: 'Survival',
  creative: 'Creative',
  'mini-games': 'Minigames',
  rpg: 'RPG',
  adventure: 'Adventure',
  roleplay: 'Roleplay',
  faction: 'Faction',
  skyblock: 'Skyblock',
  vanilla: 'Vanilla',
  pve: 'PvE',
  'multi-server': 'Network',
};

function getGradient(name: string): string {
  const gradients = [
    'from-slate-700 to-slate-900',
    'from-zinc-700 to-zinc-900',
    'from-neutral-700 to-neutral-900',
    'from-stone-700 to-stone-900',
    'from-gray-700 to-gray-900',
    'from-slate-600 to-slate-800',
  ];
  return gradients[name.charCodeAt(0) % gradients.length];
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
    <article className="flex flex-col overflow-hidden rounded-lg bg-[#161b22] border border-[#30363d] hover:border-[#484f58] transition-colors">
      {/* Banner - 112px */}
      <div className={`relative h-28 bg-gradient-to-br ${gradient}`}>
        {server.banner_image_url && !imageError ? (
          <Image
            src={server.banner_image_url}
            alt={server.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-white/10 select-none">
              {server.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] to-transparent" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-3">
        {/* Header: Name + Status */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-[#e6edf3] truncate">
            {server.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <span className={`w-1.5 h-1.5 rounded-full ${server.is_online ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span className={`text-[10px] font-medium ${server.is_online ? 'text-green-500' : 'text-yellow-500'}`}>
              {server.is_online ? 'Online' : 'Soon'}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-[#7d8590] line-clamp-2 mb-2 leading-relaxed">
          {server.short_description || server.description || 'No description'}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          {server.game_modes.slice(0, 3).map((mode) => (
            <span
              key={mode}
              className={`${tagColors[mode]} px-1.5 py-0.5 rounded text-[9px] font-medium`}
            >
              {tagLabels[mode]}
            </span>
          ))}
          {server.game_modes.length > 3 && (
            <span className="tag-gray px-1.5 py-0.5 rounded text-[9px] font-medium">
              +{server.game_modes.length - 3}
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1 min-h-1" />

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#30363d]">
          {/* Left: players + votes */}
          <div className="flex items-center gap-2 text-[10px] text-[#7d8590]">
            {server.is_online && server.current_players !== null && (
              <span>{server.current_players} players</span>
            )}
            <span className="flex items-center gap-0.5">
              <Heart className="w-2.5 h-2.5 text-red-500 fill-red-500" />
              <span className="text-[#e6edf3] font-medium">{server.votes}</span>
            </span>
          </div>

          {/* Right: buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={copyIP}
              className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                copied
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-[#d4a033] text-white hover:bg-[#b8902d]'
              }`}
            >
              {copied ? (
                <span className="flex items-center gap-0.5">
                  <Check className="w-2.5 h-2.5" /> Copied
                </span>
              ) : (
                <span className="flex items-center gap-0.5">
                  <Copy className="w-2.5 h-2.5" /> Copy IP
                </span>
              )}
            </button>
            <Link
              href={`/servers/${server.id}`}
              className="px-2 py-1 rounded text-[10px] font-medium bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d] transition-colors"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
