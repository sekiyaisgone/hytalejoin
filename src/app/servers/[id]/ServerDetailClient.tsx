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
  Share2,
  CheckCircle,
  Tag,
  Server as ServerIcon,
  Loader2,
} from 'lucide-react';
import { Server, GameMode } from '@/types';
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
  const { user, isLoading: isAuthLoading } = useAuth();
  const supabase = createClient();
  const [hasVoted, setHasVoted] = useState(false);
  const [hasFavorited, setHasFavorited] = useState(false);
  const [votes, setVotes] = useState(server.votes);
  const [isVoting, setIsVoting] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean | null>(server.is_online ?? null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  // Only show port if it exists and is not the default (25565)
  const serverIP = !server.port || server.port === 25565
    ? server.ip_address
    : `${server.ip_address}:${server.port}`;

  // Check server status on mount
  useEffect(() => {
    const checkServerStatus = async () => {
      setIsCheckingStatus(true);
      try {
        const response = await fetch(`/api/servers/${server.id}/status`);
        if (response.ok) {
          const data = await response.json();
          setIsOnline(data.isOnline);
        }
      } catch (error) {
        console.error('Failed to check server status:', error);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkServerStatus();
  }, [server.id]);

  useEffect(() => {
    if (user) {
      checkUserInteractions();
    }
  }, [user]);

  const checkUserInteractions = async () => {
    if (!user) return;

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
    if (isAuthLoading) {
      return;
    }
    if (!user) {
      toast.error('Please sign in to vote');
      return;
    }

    setIsVoting(true);

    try {
      const response = await fetch(`/api/servers/${server.id}/vote`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          toast.error('Session expired. Please sign in again.');
          return;
        }
        throw new Error(errorData.error || 'Failed to process vote');
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
    if (isAuthLoading) {
      return;
    }
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

  // Card component for consistent styling
  const SectionCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div
      style={{
        background: '#12161c',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '16px',
        padding: '24px',
      }}
      className={className}
    >
      {children}
    </div>
  );

  // Action button styles
  const actionBtnStyle = (isActive: boolean, color: string) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 600,
    transition: 'all 0.15s ease',
    background: isActive ? `${color}20` : 'rgba(255,255,255,0.05)',
    color: isActive ? color : '#c8d4e0',
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Back button */}
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.875rem',
          color: '#6b7c8f',
          textDecoration: 'none',
          marginBottom: '24px',
        }}
      >
        <ArrowLeft style={{ width: '16px', height: '16px' }} />
        Back to servers
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {/* Desktop: Two column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' }} className="server-detail-grid">
          {/* Main content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Banner */}
            <div style={{
              position: 'relative',
              height: '300px',
              borderRadius: '16px',
              overflow: 'hidden',
              background: '#1a2f4a',
            }}>
              {server.banner_image_url && !imageError ? (
                <Image
                  src={server.banner_image_url}
                  alt={`${server.name} banner`}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                  onError={() => setImageError(true)}
                />
              ) : (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #1a2f4a, #15243a)',
                }}>
                  <span style={{
                    fontSize: '6rem',
                    fontWeight: 700,
                    color: '#2a4060',
                    userSelect: 'none',
                  }}>
                    {server.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              {/* Badges */}
              <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
                {server.is_featured && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: 'rgba(212, 160, 51, 0.9)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#fff',
                  }}>
                    ⭐ Featured
                  </span>
                )}
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: isCheckingStatus
                    ? 'rgba(100, 116, 139, 0.9)'
                    : isOnline
                      ? 'rgba(34, 197, 94, 0.9)'
                      : 'rgba(239, 68, 68, 0.9)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#fff',
                }}>
                  {isCheckingStatus ? (
                    <Loader2 style={{ width: '12px', height: '12px', animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#fff',
                    }} />
                  )}
                  {isCheckingStatus ? 'Checking...' : isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>

            {/* Server header */}
            <SectionCard>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Title and actions */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f1f5f9', marginBottom: '12px' }}>
                      {server.name}
                    </h1>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {server.game_modes.map((mode) => (
                        <span
                          key={mode}
                          style={{
                            padding: '5px 12px',
                            borderRadius: '8px',
                            background: 'rgba(212, 160, 51, 0.1)',
                            fontSize: '0.8125rem',
                            fontWeight: 500,
                            color: '#d4a033',
                          }}
                        >
                          {gameModeLabels[mode]}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={handleVote}
                      disabled={isVoting || isAuthLoading}
                      style={actionBtnStyle(hasVoted, '#d4a033')}
                    >
                      {isVoting ? (
                        <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                      ) : (
                        <ThumbsUp style={{ width: '16px', height: '16px', fill: hasVoted ? 'currentColor' : 'none' }} />
                      )}
                      {votes}
                    </button>
                    <button
                      onClick={handleFavorite}
                      disabled={isFavoriting || isAuthLoading}
                      style={actionBtnStyle(hasFavorited, '#ef4444')}
                    >
                      {isFavoriting ? (
                        <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                      ) : (
                        <Heart style={{ width: '16px', height: '16px', fill: hasFavorited ? 'currentColor' : 'none' }} />
                      )}
                    </button>
                    <button onClick={handleShare} style={actionBtnStyle(false, '#5b8def')}>
                      <Share2 style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ fontSize: '0.9375rem', color: '#8fa3b8', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {server.description}
                  </p>
                </div>

                {/* Tags */}
                {server.tags && server.tags.length > 0 && (
                  <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <Tag style={{ width: '14px', height: '14px', color: '#6b7c8f' }} />
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6b7c8f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Tags
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {server.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            padding: '5px 12px',
                            borderRadius: '20px',
                            background: 'rgba(255,255,255,0.05)',
                            fontSize: '0.8125rem',
                            color: '#8fa3b8',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </SectionCard>

            {/* How to join */}
            <SectionCard>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '20px' }}>
                🎮 How to Join
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  'Open Hytale and go to the multiplayer menu',
                  'Click "Add Server" or "Direct Connect"',
                  <>Enter the server address: <code style={{ padding: '3px 8px', background: 'rgba(91, 141, 239, 0.1)', borderRadius: '6px', color: '#5b8def', fontFamily: 'monospace' }}>{serverIP}</code></>,
                  'Click "Join Server" and enjoy!',
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <span style={{
                      flexShrink: 0,
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #d4a033, #a67c20)',
                      color: '#fff',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {i + 1}
                    </span>
                    <span style={{ fontSize: '0.9375rem', color: '#c8d4e0', paddingTop: '4px' }}>{step}</span>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Screenshots */}
            {server.screenshots && server.screenshots.length > 0 && (
              <SectionCard>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '20px' }}>
                  Screenshots
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                  {server.screenshots.map((screenshot, index) => (
                    <div
                      key={index}
                      style={{
                        position: 'relative',
                        aspectRatio: '16/9',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        background: '#1a2f4a',
                      }}
                    >
                      <Image
                        src={screenshot}
                        alt={`${server.name} screenshot ${index + 1}`}
                        fill
                        style={{ objectFit: 'cover', transition: 'transform 0.3s ease' }}
                      />
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ position: 'sticky', top: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Connect card */}
              <SectionCard>
                <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6b7c8f', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                  🌐 Server Address
                </h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    fontFamily: 'monospace',
                    fontSize: '0.9375rem',
                    color: '#f1f5f9',
                  }}>
                    {serverIP}
                  </div>
                  <button
                    onClick={copyIP}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: 'none',
                      cursor: 'pointer',
                      background: 'linear-gradient(135deg, #d4a033, #a67c20)',
                      color: '#fff',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {copied ? <CheckCircle style={{ width: '18px', height: '18px' }} /> : <Copy style={{ width: '18px', height: '18px' }} />}
                  </button>
                </div>
              </SectionCard>

              {/* Stats card */}
              <SectionCard>
                <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6b7c8f', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                  📊 Statistics
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {[
                    { icon: Users, label: 'Players', value: server.current_players !== null ? `${server.current_players}/${server.max_players}` : `${server.max_players} max` },
                    { icon: ThumbsUp, label: 'Votes', value: votes },
                    { icon: Eye, label: 'Views', value: server.views },
                    { icon: Globe, label: 'Region', value: regionLabels[server.region] || server.region },
                    { icon: ServerIcon, label: 'Version', value: server.version },
                    { icon: Calendar, label: 'Added', value: format(new Date(server.created_at), 'MMM d, yyyy') },
                  ].map((stat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#6b7c8f' }}>
                        <stat.icon style={{ width: '16px', height: '16px' }} />
                        <span style={{ fontSize: '0.875rem' }}>{stat.label}</span>
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#f1f5f9' }}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Links card */}
              {(server.discord_url || server.website_url) && (
                <SectionCard>
                  <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6b7c8f', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                    🔗 Links
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {server.discord_url && (
                      <a
                        href={server.discord_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 14px',
                          background: 'rgba(88, 101, 242, 0.1)',
                          borderRadius: '10px',
                          textDecoration: 'none',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <svg style={{ width: '18px', height: '18px', color: '#5865F2' }} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                        </svg>
                        <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500, color: '#f1f5f9' }}>Discord Server</span>
                        <ExternalLink style={{ width: '14px', height: '14px', color: '#6b7c8f' }} />
                      </a>
                    )}
                    {server.website_url && (
                      <a
                        href={server.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 14px',
                          background: 'rgba(91, 141, 239, 0.1)',
                          borderRadius: '10px',
                          textDecoration: 'none',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Globe style={{ width: '18px', height: '18px', color: '#5b8def' }} />
                        <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500, color: '#f1f5f9' }}>Website</span>
                        <ExternalLink style={{ width: '14px', height: '14px', color: '#6b7c8f' }} />
                      </a>
                    )}
                  </div>
                </SectionCard>
              )}

              {/* Owner card */}
              {server.owner && (
                <SectionCard>
                  <h3 style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#6b7c8f', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                    👤 Server Owner
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}>
                      {server.owner.avatar_url ? (
                        <Image
                          src={server.owner.avatar_url}
                          alt={server.owner.username || 'User'}
                          width={48}
                          height={48}
                        />
                      ) : (
                        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#6b7c8f' }}>
                          {(server.owner.username || 'U').charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#f1f5f9' }}>
                        {server.owner.username || 'Anonymous'}
                      </p>
                      <p style={{ fontSize: '0.8125rem', color: '#6b7c8f' }}>Server Owner</p>
                    </div>
                  </div>
                </SectionCard>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 900px) {
          .server-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
