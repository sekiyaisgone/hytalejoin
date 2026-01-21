'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Copy, Check } from 'lucide-react';
import { Server, GameMode } from '@/types';
import { useState, useCallback } from 'react';

interface ServerCardProps {
  server: Server;
}

// Modern pill-style game mode badges
const gameModeStyles: Record<GameMode, { bg: string; border: string; text: string; label: string }> = {
  pvp: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', label: 'PvP' },
  survival: { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-400', label: 'Survival' },
  creative: { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400', label: 'Creative' },
  'mini-games': { bg: 'bg-purple-500/20', border: 'border-purple-500/50', text: 'text-purple-400', label: 'Minigames' },
  rpg: { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-400', label: 'RPG' },
  adventure: { bg: 'bg-teal-500/20', border: 'border-teal-500/50', text: 'text-teal-400', label: 'Adventure' },
  roleplay: { bg: 'bg-pink-500/20', border: 'border-pink-500/50', text: 'text-pink-400', label: 'Roleplay' },
  faction: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-400', label: 'Faction' },
  skyblock: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/50', text: 'text-cyan-400', label: 'Skyblock' },
  vanilla: { bg: 'bg-lime-500/20', border: 'border-lime-500/50', text: 'text-lime-400', label: 'Vanilla' },
  pve: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400', label: 'PvE' },
  'multi-server': { bg: 'bg-indigo-500/20', border: 'border-indigo-500/50', text: 'text-indigo-400', label: 'Network' },
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
          <div className="flex flex-wrap gap-2 mb-4">
            {server.game_modes.slice(0, 3).map((mode) => {
              const style = gameModeStyles[mode];
              return (
                <span
                  key={mode}
                  className={`${style.bg} ${style.border} ${style.text} px-3 py-1 rounded-full border text-xs font-medium`}
                >
                  {style.label}
                </span>
              );
            })}
            {server.game_modes.length > 3 && (
              <span className="bg-slate-500/20 border border-slate-500/50 text-slate-400 px-3 py-1 rounded-full text-xs font-medium">
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
