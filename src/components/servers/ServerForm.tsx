'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Server, GameMode, Region } from '@/types';
import { createClient } from '@/lib/supabase/client';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Upload, X, ImageIcon, ArrowLeft, Save, Eye, Users, Globe, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const gameModes: { value: GameMode; label: string }[] = [
  { value: 'pvp', label: 'PVP' },
  { value: 'survival', label: 'Survival' },
  { value: 'creative', label: 'Creative' },
  { value: 'mini-games', label: 'Mini-Games' },
  { value: 'rpg', label: 'RPG' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'roleplay', label: 'Roleplay' },
  { value: 'faction', label: 'Faction' },
  { value: 'skyblock', label: 'Skyblock' },
  { value: 'vanilla', label: 'Vanilla' },
  { value: 'pve', label: 'PVE' },
  { value: 'multi-server', label: 'Multi-Server' },
];

const regions: { value: Region; label: string }[] = [
  { value: 'north-america', label: 'North America' },
  { value: 'south-america', label: 'South America' },
  { value: 'europe', label: 'Europe' },
  { value: 'asia', label: 'Asia' },
  { value: 'oceania', label: 'Oceania' },
  { value: 'africa', label: 'Africa' },
];

const regionLabels: Record<string, string> = {
  'north-america': 'North America',
  'south-america': 'South America',
  europe: 'Europe',
  asia: 'Asia',
  oceania: 'Oceania',
  africa: 'Africa',
};

const serverSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(64, 'Name is too long'),
  ip_address: z.string().min(1, 'IP address is required'),
  port: z.number().min(1).max(65535, 'Invalid port').optional().nullable(),
  description: z.string().min(50, 'Description must be at least 50 characters').max(5000),
  short_description: z.string().max(200).optional(),
  game_modes: z.array(z.string()).min(1, 'Select at least one game mode'),
  tags: z.string().optional(),
  version: z.string().min(1, 'Version is required'),
  region: z.string().min(1, 'Region is required'),
  max_players: z.number().min(1, 'Max players is required'),
  discord_url: z.string().url().optional().or(z.literal('')),
  website_url: z.string().url().optional().or(z.literal('')),
});

type ServerFormData = z.infer<typeof serverSchema>;

interface ServerFormProps {
  userId: string;
  server?: Server;
}

const DRAFT_KEY = 'hytalejoin_server_draft';

export default function ServerForm({ userId, server }: ServerFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const isEditing = !!server;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGameModes, setSelectedGameModes] = useState<GameMode[]>(
    server?.game_modes || []
  );
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(
    server?.banner_image_url || null
  );
  const [showPreview, setShowPreview] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
    reset,
  } = useForm<ServerFormData>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      name: server?.name || '',
      ip_address: server?.ip_address || '',
      port: server?.port || null,
      description: server?.description || '',
      short_description: server?.short_description || '',
      game_modes: server?.game_modes || [],
      tags: server?.tags?.join(', ') || '',
      version: server?.version || '1.0',
      region: server?.region || '',
      max_players: server?.max_players || 100,
      discord_url: server?.discord_url || '',
      website_url: server?.website_url || '',
    },
  });

  // Watch form values for preview
  const formValues = watch();

  // Check for draft on mount
  useEffect(() => {
    if (!isEditing) {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) {
        setHasDraft(true);
      }
    }
  }, [isEditing]);

  // Load draft
  const loadDraft = () => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const data = JSON.parse(draft);
        reset(data.formData);
        setSelectedGameModes(data.gameModes || []);
        setBannerPreview(data.bannerPreview || null);
        toast.success('Draft loaded');
        setHasDraft(false);
      } catch {
        toast.error('Failed to load draft');
      }
    }
  };

  // Save draft
  const saveDraft = () => {
    const data = {
      formData: getValues(),
      gameModes: selectedGameModes,
      bannerPreview: bannerPreview,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    toast.success('Draft saved');
  };

  // Clear draft on successful submit
  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
  };

  const handleGameModeToggle = (mode: GameMode) => {
    const newModes = selectedGameModes.includes(mode)
      ? selectedGameModes.filter((m) => m !== mode)
      : [...selectedGameModes, mode];
    setSelectedGameModes(newModes);
    setValue('game_modes', newModes);
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Banner image must be less than 5MB');
        return;
      }
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const removeBanner = () => {
    setBannerFile(null);
    setBannerPreview(null);
  };

  // Ensure profile exists before submitting (fallback if trigger didn't create it)
  const ensureProfileExists = async () => {
    // Check if profile exists
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (fetchError) {
      console.error('Error checking profile:', fetchError);
      // Continue anyway, insert might still work if profile exists
      return;
    }

    // If no profile, create one
    if (!profile) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: user.email,
            username: user.user_metadata?.username || user.email?.split('@')[0] || 'User',
            is_admin: false,
          });

        if (insertError) {
          console.error('Error creating profile:', insertError);
          // If it's a duplicate key error, profile already exists - that's fine
          if (!insertError.message?.includes('duplicate')) {
            throw new Error(`Profile setup failed: ${insertError.message}`);
          }
        }
      }
    }
  };

  const onSubmit = async (data: ServerFormData) => {
    setIsSubmitting(true);

    try {
      // Ensure profile exists before trying to insert server (FK constraint)
      await ensureProfileExists();

      let bannerUrl = server?.banner_image_url || null;

      // Upload banner if new file selected
      if (bannerFile) {
        const fileExt = bannerFile.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}.${fileExt}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('server-banners')
          .upload(fileName, bannerFile, {
            cacheControl: '3600',
            upsert: true, // Allow overwriting if file exists
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          // Show actual error message for debugging
          const errorMsg = uploadError.message || 'Unknown upload error';
          throw new Error(`Failed to upload banner: ${errorMsg}`);
        }

        const { data: urlData } = supabase.storage
          .from('server-banners')
          .getPublicUrl(fileName);

        bannerUrl = urlData.publicUrl;
      }

      // Parse tags
      const tags = data.tags
        ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      const serverData = {
        owner_id: userId,
        name: data.name,
        ip_address: data.ip_address,
        port: data.port || null,
        description: data.description,
        short_description: data.short_description || null,
        game_modes: selectedGameModes,
        tags,
        version: data.version,
        region: data.region,
        max_players: data.max_players,
        discord_url: data.discord_url || null,
        website_url: data.website_url || null,
        banner_image_url: bannerUrl,
        status: isEditing ? server.status : 'pending',
      };

      if (isEditing) {
        const { error } = await supabase
          .from('servers')
          .update(serverData)
          .eq('id', server.id);

        if (error) {
          console.error('Update error:', error);
          // Show actual Supabase error message
          const errorMsg = error.message || error.code || 'Unknown error';
          throw new Error(`Failed to update server: ${errorMsg}`);
        }
        toast.success('Server updated successfully');
      } else {
        const { error } = await supabase.from('servers').insert(serverData);
        if (error) {
          console.error('Insert error:', error);
          // Show actual Supabase error message
          const errorMsg = error.message || error.code || 'Unknown error';
          throw new Error(`Failed to submit server: ${errorMsg}`);
        }
        clearDraft();
        toast.success('Server submitted for review!');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Error saving server:', error);
      // Show the actual error message to help debugging
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preview Card Component
  const PreviewCard = () => (
    <div
      style={{
        background: '#12161c',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '14px',
        overflow: 'hidden',
        maxWidth: '380px',
        margin: '0 auto',
      }}
    >
      {/* Banner */}
      <div style={{ height: '120px', background: '#1a2535', position: 'relative' }}>
        {bannerPreview ? (
          <img src={bannerPreview} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '3rem', fontWeight: 700, color: '#2a4060' }}>
              {formValues.name?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
        )}
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          padding: '4px 8px',
          background: 'rgba(34, 197, 94, 0.9)',
          borderRadius: '6px',
          fontSize: '0.6875rem',
          fontWeight: 500,
          color: 'white',
        }}>
          Online
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f0f4f8', marginBottom: '4px' }}>
          {formValues.name || 'Server Name'}
        </h3>
        <p style={{ fontSize: '0.8125rem', color: '#6b7c8f', marginBottom: '12px', lineHeight: 1.4 }}>
          {formValues.short_description || formValues.description?.slice(0, 80) || 'Server description...'}
        </p>

        {/* Game modes */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
          {selectedGameModes.slice(0, 3).map((mode) => (
            <span
              key={mode}
              style={{
                padding: '3px 8px',
                fontSize: '0.6875rem',
                fontWeight: 500,
                background: 'rgba(91, 141, 239, 0.15)',
                color: '#7bb0ff',
                borderRadius: '6px',
              }}
            >
              {gameModes.find(m => m.value === mode)?.label || mode}
            </span>
          ))}
          {selectedGameModes.length > 3 && (
            <span style={{ padding: '3px 8px', fontSize: '0.6875rem', color: '#6b7c8f' }}>
              +{selectedGameModes.length - 3}
            </span>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.75rem', color: '#6b7c8f' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Users style={{ width: '12px', height: '12px' }} />
            0/{formValues.max_players || 100}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Globe style={{ width: '12px', height: '12px' }} />
            {regionLabels[formValues.region] || 'Region'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Heart style={{ width: '12px', height: '12px' }} />
            0
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Draft notification */}
      {hasDraft && !isEditing && (
        <div
          style={{
            marginBottom: '20px',
            padding: '14px 18px',
            background: 'rgba(91, 141, 239, 0.1)',
            border: '1px solid rgba(91, 141, 239, 0.2)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '0.875rem', color: '#c8d4e0' }}>
            You have an unsaved draft. Would you like to continue?
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setHasDraft(false)}
              style={{
                padding: '6px 12px',
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: '#6b7c8f',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Dismiss
            </button>
            <button
              type="button"
              onClick={loadDraft}
              style={{
                padding: '6px 12px',
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: '#5b8def',
                background: 'rgba(91, 141, 239, 0.1)',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Load Draft
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Basic Info */}
        <section
          style={{
            background: '#12161c',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '14px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#f0f4f8', margin: 0 }}>
              Basic Information
            </h2>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="Server Name"
              placeholder="My Awesome Server"
              error={errors.name?.message}
              {...register('name')}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '12px' }}>
              <Input
                label="IP Address"
                placeholder="play.myserver.com"
                error={errors.ip_address?.message}
                {...register('ip_address')}
              />
              <Input
                label="Port (Optional)"
                type="number"
                placeholder="25565"
                error={errors.port?.message}
                {...register('port', {
                  setValueAs: (v) => v === '' || v === null || v === undefined ? null : parseInt(v, 10)
                })}
              />
            </div>

            <Textarea
              label="Description"
              placeholder="Tell players about your server, what makes it unique, the features you offer..."
              error={errors.description?.message}
              {...register('description')}
            />

            <Input
              label="Short Description"
              placeholder="A brief one-line summary"
              helperText="Shown on server cards (max 200 characters)"
              error={errors.short_description?.message}
              {...register('short_description')}
            />
          </div>
        </section>

        {/* Server Details */}
        <section
          style={{
            background: '#12161c',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '14px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#f0f4f8', margin: 0 }}>
              Server Details
            </h2>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#c8d4e0', marginBottom: '10px' }}>
                Game Modes
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {gameModes.map((mode) => (
                  <button
                    key={mode.value}
                    type="button"
                    onClick={() => handleGameModeToggle(mode.value)}
                    style={{
                      padding: '8px 14px',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      background: selectedGameModes.includes(mode.value)
                        ? 'rgba(91, 141, 239, 0.2)'
                        : 'rgba(255,255,255,0.04)',
                      color: selectedGameModes.includes(mode.value) ? '#7bb0ff' : '#8fa3b8',
                      boxShadow: selectedGameModes.includes(mode.value)
                        ? 'inset 0 0 0 1px rgba(91, 141, 239, 0.4)'
                        : 'inset 0 0 0 1px rgba(255,255,255,0.08)',
                    }}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
              {errors.game_modes && (
                <p style={{ marginTop: '8px', fontSize: '0.8125rem', color: '#f87171' }}>{errors.game_modes.message}</p>
              )}
            </div>

            <Select
              label="Region"
              options={regions}
              placeholder="Select your server's region"
              error={errors.region?.message}
              {...register('region')}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                label="Version"
                placeholder="1.0"
                helperText="Game version"
                error={errors.version?.message}
                {...register('version')}
              />
              <Input
                label="Max Players"
                type="number"
                placeholder="100"
                error={errors.max_players?.message}
                {...register('max_players', { valueAsNumber: true })}
              />
            </div>

            <Input
              label="Tags"
              placeholder="economy, custom-items, friendly"
              helperText="Comma-separated. Helps players find your server."
              {...register('tags')}
            />
          </div>
        </section>

        {/* Links */}
        <section
          style={{
            background: '#12161c',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '14px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#f0f4f8', margin: 0 }}>
              Links
            </h2>
            <p style={{ fontSize: '0.75rem', color: '#6b7c8f', marginTop: '4px' }}>Optional community links</p>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="Discord Invite"
              placeholder="https://discord.gg/yourserver"
              error={errors.discord_url?.message}
              {...register('discord_url')}
            />
            <Input
              label="Website"
              placeholder="https://yourserver.com"
              error={errors.website_url?.message}
              {...register('website_url')}
            />
          </div>
        </section>

        {/* Banner */}
        <section
          style={{
            background: '#12161c',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '14px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#f0f4f8', margin: 0 }}>
              Banner Image
            </h2>
            <p style={{ fontSize: '0.75rem', color: '#6b7c8f', marginTop: '4px' }}>Recommended: 1920×480px</p>
          </div>
          <div style={{ padding: '20px' }}>
            {bannerPreview ? (
              <div style={{ position: 'relative' }}>
                <img
                  src={bannerPreview}
                  alt="Banner preview"
                  style={{
                    width: '100%',
                    height: '160px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    display: 'flex',
                    gap: '8px',
                  }}
                >
                  <label
                    style={{
                      padding: '8px 12px',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      color: 'white',
                      background: 'rgba(0,0,0,0.7)',
                      backdropFilter: 'blur(8px)',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    Change
                    <input
                      type="file"
                      style={{ display: 'none' }}
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleBannerChange}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={removeBanner}
                    style={{
                      padding: '8px 12px',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      color: '#f87171',
                      background: 'rgba(0,0,0,0.7)',
                      backdropFilter: 'blur(8px)',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <label
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '32px 20px',
                  border: '1px dashed rgba(255,255,255,0.12)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                  }}
                >
                  <ImageIcon style={{ width: '22px', height: '22px', color: '#6b7c8f' }} />
                </div>
                <p style={{ fontSize: '0.875rem', color: '#c8d4e0', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 500, color: '#5b8def' }}>Click to upload</span> or drag and drop
                </p>
                <p style={{ fontSize: '0.75rem', color: '#6b7c8f' }}>PNG, JPG, or WebP (max 5MB)</p>
                <input
                  type="file"
                  style={{ display: 'none' }}
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleBannerChange}
                />
              </label>
            )}
          </div>
        </section>

        {/* Spacer for sticky bar */}
        <div style={{ height: '80px' }} />

        {/* Sticky Action Bar */}
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '14px 24px',
            background: 'rgba(10, 14, 20, 0.95)',
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            zIndex: 50,
          }}
        >
          <div
            style={{
              maxWidth: '900px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Left side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link
                href="/dashboard"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 14px',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: '#8fa3b8',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.15s ease',
                }}
              >
                <ArrowLeft style={{ width: '15px', height: '15px' }} />
                Back
              </Link>
              {!isEditing && (
                <button
                  type="button"
                  onClick={saveDraft}
                  disabled={isSubmitting}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 14px',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: '#8fa3b8',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s ease',
                    opacity: isSubmitting ? 0.5 : 1,
                  }}
                >
                  <Save style={{ width: '14px', height: '14px' }} />
                  Save Draft 📝
                </button>
              )}
            </div>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                disabled={isSubmitting}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 14px',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: '#c8d4e0',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease',
                  opacity: isSubmitting ? 0.5 : 1,
                }}
              >
                <Eye style={{ width: '14px', height: '14px' }} />
                Preview 👀
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 18px',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: 'white',
                  background: isSubmitting
                    ? 'rgba(91, 141, 239, 0.5)'
                    : 'linear-gradient(135deg, #5b8def 0%, #4a7bd4 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSubmitting ? 'none' : '0 2px 8px rgba(91, 141, 239, 0.25)',
                }}
              >
                {isSubmitting ? 'Submitting...' : isEditing ? 'Save Changes 💾' : 'Submit Server 🎮'}
              </button>
            </div>
          </div>

          {/* Terms notice */}
          {!isEditing && (
            <p
              style={{
                maxWidth: '900px',
                margin: '10px auto 0',
                fontSize: '0.6875rem',
                color: '#4a5d73',
                textAlign: 'center',
              }}
            >
              By submitting, you agree to our{' '}
              <Link href="/terms" style={{ color: '#6b7c8f', textDecoration: 'underline' }}>Terms</Link>{' '}
              and confirm you own or admin this server.
            </p>
          )}
        </div>
      </form>

      {/* Preview Modal */}
      {showPreview && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '24px',
          }}
          onClick={() => setShowPreview(false)}
        >
          <div
            style={{
              background: '#0d1117',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '440px',
              width: '100%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f0f4f8', margin: 0 }}>
                Card Preview
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                style={{
                  padding: '6px',
                  background: 'rgba(255,255,255,0.04)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: '#6b7c8f',
                }}
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            <PreviewCard />

            <p style={{ marginTop: '16px', fontSize: '0.75rem', color: '#6b7c8f', textAlign: 'center' }}>
              This is how your server will appear in listings
            </p>
          </div>
        </div>
      )}
    </>
  );
}
