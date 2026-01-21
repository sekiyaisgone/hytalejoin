'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Copy, Check, ExternalLink } from 'lucide-react';
import { Server, GameMode } from '@/types';
import { useState, useCallback } from 'react';

interface ServerCardProps {
  server: Server;
}

// Tag colors using Tailwind-safe classes
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

// Generate consistent gradient based on server name
function getGradient(name: string): string {
  const gradients = [
    'from-blue-600/40 to-blue-900/60',
    'from-purple-600/40 to-purple-900/60',
    'from-emerald-600/40 to-emerald-900/60',
    'from-amber-600/40 to-amber-900/60',
    'from-rose-600/40 to-rose-900/60',
    'from-cyan-600/40 to-cyan-900/60',
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
    <article className="group relative flex flex-col h-full overflow-hidden rounded-xl bg-[#111827] border border-white/5 transition-all duration-200 hover:border-white/10 hover:shadow-lg hover:shadow-black/20">
      {/* Banner - reduced height */}
      <div className={`relative h-20 bg-gradient-to-br ${gradient} overflow-hidden`}>
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4 pt-3">
        {/* Server name + status */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-semibold text-white line-clamp-1 leading-tight">
            {server.name}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className={`w-2 h-2 rounded-full ${
                server.is_online ? 'bg-green-500' : 'bg-yellow-500'
              }`}
            />
            <span className={`text-xs font-medium ${
              server.is_online ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {server.is_online ? 'Online' : 'Soon'}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[#9ca3af] line-clamp-2 mb-3 leading-relaxed">
          {server.short_description || server.description || 'No description available'}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {server.game_modes.slice(0, 3).map((mode) => (
            <span
              key={mode}
              className={`${tagColors[mode]} px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide`}
            >
              {tagLabels[mode]}
            </span>
          ))}
          {server.game_modes.length > 3 && (
            <span className="tag-gray px-2 py-0.5 rounded text-[10px] font-medium">
              +{server.game_modes.length - 3}
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer: Players + Votes */}
        <div className="flex items-center justify-between text-xs text-[#6b7280] mb-3">
          <span>
            {server.is_online && server.current_players !== null
              ? `${server.current_players} players`
              : 'No data'}
          </span>
          <div className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span className="font-medium text-white">{server.votes}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={copyIP}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              copied
                ? 'bg-green-500/20 text-green-400'
                : 'bg-[#d4a033] text-white hover:bg-[#c49030]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy IP
              </>
            )}
          </button>
          <Link
            href={`/servers/${server.id}`}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-white/5 text-white hover:bg-white/10 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
