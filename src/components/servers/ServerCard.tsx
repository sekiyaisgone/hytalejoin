'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Users, ThumbsUp, Copy, MapPin, Check } from 'lucide-react';
import { Server, GameMode, Region } from '@/types';
import Badge from '@/components/ui/Badge';
import { useState, useCallback } from 'react';

interface ServerCardProps {
  server: Server;
  featured?: boolean;
}

const gameModeLabels: Record<GameMode, string> = {
  pvp: 'PVP',
  survival: 'Survival',
  creative: 'Creative',
  'mini-games': 'Mini-Games',
  rpg: 'RPG',
  adventure: 'Adventure',
  roleplay: 'Roleplay',
  faction: 'Faction',
  skyblock: 'Skyblock',
  vanilla: 'Vanilla',
  pve: 'PVE',
  'multi-server': 'Multi-Server',
};

const regionLabels: Record<Region, string> = {
  'north-america': 'NA',
  'south-america': 'SA',
  europe: 'EU',
  asia: 'Asia',
  oceania: 'OCE',
  africa: 'AF',
};

// Generate consistent gradient based on server name
function getGradientClass(name: string): string {
  const gradients = [
    'from-[#1a2942] via-[#0f1720] to-[#1e3a5f]',
    'from-[#2d1f3d] via-[#1a1025] to-[#3d2952]',
    'from-[#1f2d2a] via-[#0f1a17] to-[#2a3d37]',
    'from-[#2d2a1f] via-[#1a1710] to-[#3d3729]',
    'from-[#1f2a2d] via-[#101a1d] to-[#29373d]',
    'from-[#2d1f2a] via-[#1a1015] to-[#3d2937]',
  ];
  const index = name.charCodeAt(0) % gradients.length;
  return gradients[index];
}

export default function ServerCard({ server, featured = false }: ServerCardProps) {
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
      // Fallback for older browsers
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

  const serverIP = server.port === 25565 ? server.ip_address : `${server.ip_address}:${server.port}`;
  const gradientClass = getGradientClass(server.name);

  return (
    <Link href={`/servers/${server.id}`} className="block group">
      <article
        className={`
          relative overflow-hidden rounded-2xl
          bg-[rgba(15,23,32,0.75)] backdrop-blur-xl
          border border-[rgba(255,255,255,0.06)]
          transition-all duration-300 ease-out
          hover:border-[rgba(255,255,255,0.12)]
          hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)]
          hover:-translate-y-1
          ${featured ? 'ring-1 ring-[#d4a033]/30 shadow-[0_0_30px_rgba(212,160,51,0.15)]' : ''}
        `}
        aria-label={`${server.name} server`}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

        {/* Banner Image */}
        <div className={`relative h-36 bg-gradient-to-br ${gradientClass} overflow-hidden`}>
          {server.banner_image_url && !imageError ? (
            <>
              <Image
                src={server.banner_image_url}
                alt={`${server.name} banner`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                onError={() => setImageError(true)}
              />
              {/* Image overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f16]/80 via-transparent to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Decorative pattern for fallback */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
              </div>
              <span className="relative text-5xl font-bold text-white/20 select-none tracking-wider">
                {server.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Status badge */}
          <div className="absolute top-3 right-3 z-10">
            <Badge
              variant={server.is_online ? 'success' : 'error'}
              size="sm"
              dot
              pulse={server.is_online}
            >
              {server.is_online ? 'Online' : 'Offline'}
            </Badge>
          </div>

          {/* Featured badge */}
          {(server.is_featured || featured) && (
            <div className="absolute top-3 left-3 z-10">
              <Badge variant="gold" size="sm">
                Featured
              </Badge>
            </div>
          )}

          {/* Region badge */}
          <div className="absolute bottom-3 left-3 z-10">
            <Badge variant="default" size="xs" className="backdrop-blur-sm bg-black/30">
              <MapPin className="w-3 h-3 mr-1" />
              {regionLabels[server.region]}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="relative p-5">
          {/* Server name and votes */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="text-lg font-semibold text-[#f0f4f8] line-clamp-1 group-hover:text-[#f0c35a] transition-colors">
              {server.name}
            </h3>
            <div className="flex items-center gap-1.5 text-[#7a8fa6] flex-shrink-0 bg-[#1a2942]/50 px-2 py-1 rounded-lg">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span className="text-sm font-medium">{server.votes}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-[#7a8fa6] line-clamp-2 mb-4 min-h-[40px] leading-relaxed">
            {server.short_description || server.description || 'No description available'}
          </p>

          {/* Game modes */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {server.game_modes.slice(0, 3).map((mode) => (
              <Badge key={mode} variant="default" size="xs">
                {gameModeLabels[mode]}
              </Badge>
            ))}
            {server.game_modes.length > 3 && (
              <Badge variant="outline" size="xs">
                +{server.game_modes.length - 3}
              </Badge>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.06)]">
            {/* Player count */}
            <div className="flex items-center gap-2 text-sm text-[#7a8fa6]">
              <Users className="w-4 h-4" />
              <span>
                {server.current_players !== null ? (
                  <>
                    <span className="text-[#f0f4f8] font-semibold">{server.current_players}</span>
                    <span className="mx-1 text-[#4a5d73]">/</span>
                    <span>{server.max_players}</span>
                  </>
                ) : (
                  <span>{server.max_players} max</span>
                )}
              </span>
            </div>

            {/* Copy IP button */}
            <button
              onClick={copyIP}
              className={`
                flex items-center gap-2 px-3 py-2
                text-xs font-semibold rounded-lg
                transition-all duration-200
                ${copied
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-[#1a2942] text-[#7a8fa6] border border-[rgba(255,255,255,0.06)] hover:text-[#f0f4f8] hover:border-[#d4a033]/50 hover:bg-[#1a2942]/80'
                }
              `}
              title={`Copy IP: ${serverIP}`}
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
          </div>
        </div>
      </article>
    </Link>
  );
}
