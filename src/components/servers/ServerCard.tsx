'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, Copy, Check } from 'lucide-react';
import { Server, GameMode } from '@/types';
import { useState, useCallback } from 'react';

interface ServerCardProps {
  server: Server;
}

// Colorful game mode styles matching reference
const gameModeStyles: Record<GameMode, { bg: string; text: string; label: string }> = {
  pvp: { bg: 'bg-green-500', text: 'text-white', label: 'PVP' },
  survival: { bg: 'bg-orange-500', text: 'text-white', label: 'SURVIVAL' },
  creative: { bg: 'bg-blue-500', text: 'text-white', label: 'CREATIVE' },
  'mini-games': { bg: 'bg-purple-500', text: 'text-white', label: 'MINI-GAMES' },
  rpg: { bg: 'bg-red-500', text: 'text-white', label: 'RPG' },
  adventure: { bg: 'bg-teal-500', text: 'text-white', label: 'ADVENTURE' },
  roleplay: { bg: 'bg-pink-500', text: 'text-white', label: 'RP' },
  faction: { bg: 'bg-amber-600', text: 'text-white', label: 'FACTION' },
  skyblock: { bg: 'bg-cyan-500', text: 'text-white', label: 'SKYBLOCK' },
  vanilla: { bg: 'bg-lime-600', text: 'text-white', label: 'VANILLA' },
  pve: { bg: 'bg-emerald-600', text: 'text-white', label: 'PVE' },
  'multi-server': { bg: 'bg-indigo-500', text: 'text-white', label: 'MULTI-SERV' },
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
      <article className="relative overflow-hidden rounded-lg bg-[#1a2235] border border-[#2a3548] hover:border-[#3d4f6a] transition-all duration-200 hover:shadow-lg">
        {/* Banner Image with Server Name Overlay */}
        <div className={`relative h-44 bg-gradient-to-br ${gradient} overflow-hidden`}>
          {server.banner_image_url && !imageError ? (
            <Image
              src={server.banner_image_url}
              alt={server.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-bold text-white/20 select-none">
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
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Description */}
          <p className="text-sm text-[#8899aa] line-clamp-3 mb-3 min-h-[60px]">
            {server.short_description || server.description || 'No description available'}
          </p>

          {/* Game mode tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {server.game_modes.slice(0, 4).map((mode) => {
              const style = gameModeStyles[mode];
              return (
                <span
                  key={mode}
                  className={`${style.bg} ${style.text} px-2 py-0.5 rounded text-[10px] font-bold uppercase`}
                >
                  {style.label}
                </span>
              );
            })}
          </div>

          {/* Footer: Status and Votes */}
          <div className="flex items-center justify-between pt-2 border-t border-[#2a3548]">
            {/* Online status */}
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  server.is_online ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                }`}
              />
              <span className={`text-xs font-semibold uppercase ${
                server.is_online ? 'text-green-500' : 'text-yellow-500'
              }`}>
                {server.is_online ? 'Online' : 'Soon'}
              </span>
            </div>

            {/* Vote count */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#8899aa] uppercase">Vote</span>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                <span className="text-sm font-bold text-white">{server.votes}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copy IP button (shown on hover) */}
        <button
          onClick={copyIP}
          className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold transition-all duration-200 ${
            copied
              ? 'bg-green-500 text-white'
              : 'bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-black/80'
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
      </article>
    </Link>
  );
}
