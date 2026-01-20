'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Users, ThumbsUp, Copy, ExternalLink } from 'lucide-react';
import { Server, GameMode } from '@/types';
import Badge from '@/components/ui/Badge';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ServerCardProps {
  server: Server;
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

export default function ServerCard({ server }: ServerCardProps) {
  const [imageError, setImageError] = useState(false);

  const copyIP = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const ip = server.port === 25565 ? server.ip_address : `${server.ip_address}:${server.port}`;
    await navigator.clipboard.writeText(ip);
    toast.success('Server IP copied to clipboard!');
  };

  const serverIP = server.port === 25565 ? server.ip_address : `${server.ip_address}:${server.port}`;

  return (
    <Link href={`/servers/${server.id}`}>
      <article
        className="glass-card group cursor-pointer overflow-hidden"
        aria-label={`${server.name} server`}
      >
        {/* Banner Image */}
        <div className="relative h-32 bg-gradient-to-br from-[#1a2f4a] to-[#15243a] overflow-hidden">
          {server.banner_image_url && !imageError ? (
            <Image
              src={server.banner_image_url}
              alt={`${server.name} banner`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-[#2a4060] select-none">
                {server.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Status indicator */}
          <div className="absolute top-3 right-3">
            <Badge variant={server.is_online ? 'success' : 'error'}>
              <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${server.is_online ? 'bg-green-400 status-pulse' : 'bg-red-400'}`} />
              {server.is_online ? 'Online' : 'Offline'}
            </Badge>
          </div>

          {/* Featured badge */}
          {server.is_featured && (
            <div className="absolute top-3 left-3">
              <Badge variant="gold">Featured</Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Server name and votes */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-semibold text-[#e8f0f8] line-clamp-1 group-hover:text-[#d29f32] transition-colors">
              {server.name}
            </h3>
            <div className="flex items-center gap-1 text-[#8fa3b8] flex-shrink-0">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm font-medium">{server.votes}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-[#8fa3b8] line-clamp-2 mb-3 min-h-[40px]">
            {server.short_description || server.description}
          </p>

          {/* Game modes */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {server.game_modes.slice(0, 3).map((mode) => (
              <Badge key={mode} variant="default" size="sm">
                {gameModeLabels[mode]}
              </Badge>
            ))}
            {server.game_modes.length > 3 && (
              <Badge variant="default" size="sm">
                +{server.game_modes.length - 3}
              </Badge>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.08)]">
            {/* Player count */}
            <div className="flex items-center gap-1.5 text-sm text-[#8fa3b8]">
              <Users className="w-4 h-4" />
              <span>
                {server.current_players !== null ? (
                  <>
                    <span className="text-[#e8f0f8] font-medium">{server.current_players}</span>
                    <span className="mx-1">/</span>
                    <span>{server.max_players}</span>
                  </>
                ) : (
                  <span>{server.max_players} max</span>
                )}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={copyIP}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#8fa3b8] hover:text-[#e8f0f8] bg-[#1a2f4a] hover:bg-[#2a4060] rounded-md transition-colors"
                title={`Copy IP: ${serverIP}`}
              >
                <Copy className="w-3.5 h-3.5" />
                Copy IP
              </button>
              <div
                className="p-1.5 text-[#8fa3b8] hover:text-[#d29f32] transition-colors"
                title="View details"
              >
                <ExternalLink className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
