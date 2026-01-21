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
    'from-blue-600/30 to-blue-900/50',
    'from-purple-600/30 to-purple-900/50',
    'from-emerald-600/30 to-emerald-900/50',
    'from-amber-600/30 to-amber-900/50',
    'from-rose-600/30 to-rose-900/50',
    'from-cyan-600/30 to-cyan-900/50',
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
    <article className="group flex flex-col h-full overflow-hidden rounded-xl bg-[#0d1117] border border-white/[0.06] hover:border-white/10 transition-all">
      {/* Banner */}
      <div className={`relative h-32 bg-gradient-to-br ${gradient}`}>
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
            <span className="text-5xl font-bold text-white/[0.08] select-none">
              {server.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/40 backdrop-blur-sm">
          <span className={`w-1.5 h-1.5 rounded-full ${server.is_online ? 'bg-green-400' : 'bg-yellow-400'}`} />
          <span className={`text-[10px] font-medium ${server.is_online ? 'text-green-400' : 'text-yellow-400'}`}>
            {server.is_online ? 'Online' : 'Soon'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4">
        {/* Name */}
        <h3 className="text-[15px] font-semibold text-white line-clamp-1 mb-1.5">
          {server.name}
        </h3>

        {/* Description */}
        <p className="text-[13px] text-[#8b949e] line-clamp-2 mb-3 leading-relaxed">
          {server.short_description || server.description || 'No description available'}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {server.game_modes.slice(0, 3).map((mode) => (
            <span
              key={mode}
              className={`${tagColors[mode]} px-1.5 py-0.5 rounded text-[10px] font-medium`}
            >
              {tagLabels[mode]}
            </span>
          ))}
          {server.game_modes.length > 3 && (
            <span className="tag-gray px-1.5 py-0.5 rounded text-[10px] font-medium">
              +{server.game_modes.length - 3}
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 text-xs text-[#6b7280]">
            {server.is_online && server.current_players !== null && (
              <span>{server.current_players} players</span>
            )}
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-red-500 fill-red-500" />
              <span className="text-white font-medium">{server.votes}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={copyIP}
              className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
                copied
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-[#d4a033] text-white hover:bg-[#c49030]'
              }`}
            >
              {copied ? (
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3" /> Copied
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Copy className="w-3 h-3" /> Copy IP
                </span>
              )}
            </button>
            <Link
              href={`/servers/${server.id}`}
              className="px-2.5 py-1.5 rounded-md text-[11px] font-medium bg-white/5 text-[#c9d1d9] hover:bg-white/10 hover:text-white transition-colors"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
