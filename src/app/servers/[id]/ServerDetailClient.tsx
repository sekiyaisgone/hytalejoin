'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Copy,
  ExternalLink,
  ThumbsUp,
  Users,
  Globe,
  Calendar,
  Eye,
  ArrowLeft,
  Heart,
  MessageSquare,
  Share2,
  CheckCircle,
} from 'lucide-react';
import { Server, GameMode } from '@/types';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface ServerDetailClientProps {
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

const regionLabels: Record<string, string> = {
  'north-america': 'North America',
  'south-america': 'South America',
  europe: 'Europe',
  asia: 'Asia',
  oceania: 'Oceania',
  africa: 'Africa',
};

export default function ServerDetailClient({ server }: ServerDetailClientProps) {
  const { user } = useAuth();
  const supabase = createClient();
  const [hasVoted, setHasVoted] = useState(false);
  const [hasFavorited, setHasFavorited] = useState(false);
  const [votes, setVotes] = useState(server.votes);
  const [isVoting, setIsVoting] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  const serverIP =
    server.port === 25565 ? server.ip_address : `${server.ip_address}:${server.port}`;

  useEffect(() => {
    if (user) {
      checkUserInteractions();
    }
  }, [user]);

  const checkUserInteractions = async () => {
    if (!user) return;

    // Use maybeSingle() to avoid errors when no vote/favorite exists
    const [voteResult, favoriteResult] = await Promise.all([
      supabase
        .from('votes')
        .select('id')
        .eq('user_id', user.id)
        .eq('server_id', server.id)
        .maybeSingle(),
      supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('server_id', server.id)
        .maybeSingle(),
    ]);

    setHasVoted(!!voteResult.data);
    setHasFavorited(!!favoriteResult.data);
  };

  const copyIP = async () => {
    await navigator.clipboard.writeText(serverIP);
    setCopied(true);
    toast.success('Server IP copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVote = async () => {
    if (!user) {
      toast.error('Please sign in to vote');
      return;
    }

    setIsVoting(true);

    try {
      const response = await fetch(`/api/servers/${server.id}/vote`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to process vote');
      }

      const data = await response.json();

      if (data.voted) {
        setVotes((v) => v + 1);
        setHasVoted(true);
        toast.success('Vote added!');
      } else {
        setVotes((v) => v - 1);
        setHasVoted(false);
        toast.success('Vote removed');
      }
    } catch (error) {
      toast.error('Failed to process vote');
      console.error(error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleFavorite = async () => {
    if (!user) {
      toast.error('Please sign in to favorite');
      return;
    }

    setIsFavoriting(true);

    try {
      if (hasFavorited) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('server_id', server.id);
        setHasFavorited(false);
        toast.success('Removed from favorites');
      } else {
        await supabase.from('favorites').insert({
          user_id: user.id,
          server_id: server.id,
        });
        setHasFavorited(true);
        toast.success('Added to favorites!');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
      console.error(error);
    } finally {
      setIsFavoriting(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${server.name} - HytaleJoin`,
          text: server.short_description || server.description.slice(0, 100),
          url,
        });
      } catch {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-[#8fa3b8] hover:text-[#e8f0f8] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to servers
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Banner */}
          <div className="relative h-64 md:h-80 rounded-xl overflow-hidden bg-[#1a2f4a]">
            {server.banner_image_url && !imageError ? (
              <Image
                src={server.banner_image_url}
                alt={`${server.name} banner`}
                fill
                className="object-cover"
                priority
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a2f4a] to-[#15243a]">
                <span className="text-8xl font-bold text-[#2a4060] select-none">
                  {server.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {/* Status badge */}
            <div className="absolute top-4 right-4">
              <Badge variant={server.is_online ? 'success' : 'error'} size="md">
                <span
                  className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    server.is_online ? 'bg-green-400 status-pulse' : 'bg-red-400'
                  }`}
                />
                {server.is_online ? 'Online' : 'Offline'}
              </Badge>
            </div>

            {/* Featured badge */}
            {server.is_featured && (
              <div className="absolute top-4 left-4">
                <Badge variant="gold" size="md">
                  Featured
                </Badge>
              </div>
            )}
          </div>

          {/* Server info */}
          <Card hover={false}>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-[#e8f0f8] mb-2">
                  {server.name}
                </h1>
                <div className="flex flex-wrap gap-2">
                  {server.game_modes.map((mode) => (
                    <Badge key={mode} variant="default" size="md">
                      {gameModeLabels[mode]}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <Button
                  variant={hasVoted ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={handleVote}
                  isLoading={isVoting}
                  leftIcon={<ThumbsUp className="w-4 h-4" />}
                >
                  {votes}
                </Button>
                <Button
                  variant={hasFavorited ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={handleFavorite}
                  isLoading={isFavoriting}
                  leftIcon={
                    <Heart
                      className={`w-4 h-4 ${hasFavorited ? 'fill-current' : ''}`}
                    />
                  }
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleShare}
                  leftIcon={<Share2 className="w-4 h-4" />}
                />
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-invert max-w-none">
              <p className="text-[#8fa3b8] whitespace-pre-wrap">{server.description}</p>
            </div>

            {/* Tags */}
            {server.tags && server.tags.length > 0 && (
              <div className="mt-6 pt-6 border-t border-[rgba(255,255,255,0.08)]">
                <h3 className="text-sm font-semibold text-[#e8f0f8] mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {server.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm bg-[#1a2f4a] text-[#8fa3b8] rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* How to join */}
          <Card hover={false}>
            <h2 className="text-xl font-semibold text-[#e8f0f8] mb-4">
              How to Join
            </h2>
            <ol className="space-y-3 text-[#8fa3b8]">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#5b8def] text-white text-sm font-bold flex items-center justify-center">
                  1
                </span>
                <span>Open Hytale and go to the multiplayer menu</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#5b8def] text-white text-sm font-bold flex items-center justify-center">
                  2
                </span>
                <span>Click &quot;Add Server&quot; or &quot;Direct Connect&quot;</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#5b8def] text-white text-sm font-bold flex items-center justify-center">
                  3
                </span>
                <div className="flex-1">
                  <span>Enter the server address: </span>
                  <code className="px-2 py-1 bg-[#1a2f4a] rounded text-[#5b8def]">
                    {serverIP}
                  </code>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#5b8def] text-white text-sm font-bold flex items-center justify-center">
                  4
                </span>
                <span>Click &quot;Join Server&quot; and enjoy!</span>
              </li>
            </ol>
          </Card>

          {/* Screenshots */}
          {server.screenshots && server.screenshots.length > 0 && (
            <Card hover={false}>
              <h2 className="text-xl font-semibold text-[#e8f0f8] mb-4">
                Screenshots
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {server.screenshots.map((screenshot, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-lg overflow-hidden bg-[#1a2f4a]"
                  >
                    <Image
                      src={screenshot}
                      alt={`${server.name} screenshot ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Connect card */}
          <Card hover={false}>
            <h2 className="text-lg font-semibold text-[#e8f0f8] mb-4">
              Server Address
            </h2>
            <div className="flex gap-2">
              <div className="flex-1 bg-[#1a2f4a] rounded-lg px-4 py-3">
                <code className="text-[#e8f0f8] font-mono">{serverIP}</code>
              </div>
              <Button onClick={copyIP} variant="primary" size="sm">
                {copied ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </Button>
            </div>
          </Card>

          {/* Stats card */}
          <Card hover={false}>
            <h2 className="text-lg font-semibold text-[#e8f0f8] mb-4">Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#8fa3b8]">
                  <Users className="w-5 h-5" />
                  <span>Players</span>
                </div>
                <span className="text-[#e8f0f8] font-medium">
                  {server.current_players !== null
                    ? `${server.current_players}/${server.max_players}`
                    : `${server.max_players} max`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#8fa3b8]">
                  <ThumbsUp className="w-5 h-5" />
                  <span>Votes</span>
                </div>
                <span className="text-[#e8f0f8] font-medium">{votes}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#8fa3b8]">
                  <Eye className="w-5 h-5" />
                  <span>Views</span>
                </div>
                <span className="text-[#e8f0f8] font-medium">{server.views}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#8fa3b8]">
                  <Globe className="w-5 h-5" />
                  <span>Region</span>
                </div>
                <span className="text-[#e8f0f8] font-medium">
                  {regionLabels[server.region] || server.region}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#8fa3b8]">
                  <MessageSquare className="w-5 h-5" />
                  <span>Version</span>
                </div>
                <span className="text-[#e8f0f8] font-medium">{server.version}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#8fa3b8]">
                  <Calendar className="w-5 h-5" />
                  <span>Added</span>
                </div>
                <span className="text-[#e8f0f8] font-medium">
                  {format(new Date(server.created_at), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          </Card>

          {/* Links card */}
          {(server.discord_url || server.website_url) && (
            <Card hover={false}>
              <h2 className="text-lg font-semibold text-[#e8f0f8] mb-4">Links</h2>
              <div className="space-y-3">
                {server.discord_url && (
                  <a
                    href={server.discord_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-[#1a2f4a] hover:bg-[#2a4060] rounded-lg transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-[#5865F2]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                    <span className="text-[#e8f0f8]">Discord Server</span>
                    <ExternalLink className="w-4 h-4 text-[#8fa3b8] ml-auto" />
                  </a>
                )}
                {server.website_url && (
                  <a
                    href={server.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-[#1a2f4a] hover:bg-[#2a4060] rounded-lg transition-colors"
                  >
                    <Globe className="w-5 h-5 text-[#5b8def]" />
                    <span className="text-[#e8f0f8]">Website</span>
                    <ExternalLink className="w-4 h-4 text-[#8fa3b8] ml-auto" />
                  </a>
                )}
              </div>
            </Card>
          )}

          {/* Owner card */}
          {server.owner && (
            <Card hover={false}>
              <h2 className="text-lg font-semibold text-[#e8f0f8] mb-4">
                Server Owner
              </h2>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#1a2f4a] flex items-center justify-center">
                  {server.owner.avatar_url ? (
                    <Image
                      src={server.owner.avatar_url}
                      alt={server.owner.username || 'User'}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <span className="text-xl font-bold text-[#8fa3b8]">
                      {(server.owner.username || 'U').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-[#e8f0f8]">
                    {server.owner.username || 'Anonymous'}
                  </p>
                  <p className="text-sm text-[#8fa3b8]">Server Owner</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
