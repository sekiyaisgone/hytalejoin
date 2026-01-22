'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Server, GameMode, Region } from '@/types';
import { createClient } from '@/lib/supabase/client';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Upload, X } from 'lucide-react';
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

const serverSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(64, 'Name is too long'),
  ip_address: z.string().min(1, 'IP address is required'),
  port: z.number().min(1, 'Port is required').max(65535, 'Invalid port'),
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ServerFormData>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      name: server?.name || '',
      ip_address: server?.ip_address || '',
      port: server?.port || 25565,
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

  const onSubmit = async (data: ServerFormData) => {
    setIsSubmitting(true);

    try {
      let bannerUrl = server?.banner_image_url || null;

      // Upload banner if new file selected
      if (bannerFile) {
        const fileExt = bannerFile.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('server-banners')
          .upload(fileName, bannerFile);

        if (uploadError) {
          throw new Error('Failed to upload banner image');
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
        port: data.port,
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
        updated_at: new Date().toISOString(),
      };

      if (isEditing) {
        const { error } = await supabase
          .from('servers')
          .update(serverData)
          .eq('id', server.id);

        if (error) throw error;
        toast.success('Server updated successfully');
      } else {
        const { error } = await supabase.from('servers').insert(serverData);
        if (error) throw error;
        toast.success('Server submitted for review!');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Error saving server:', error);
      toast.error(isEditing ? 'Failed to update server' : 'Failed to submit server');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Info */}
      <Card hover={false} padding="lg">
        <h2 className="text-xl font-semibold text-[#e8f0f8] mb-6">Basic Information</h2>
        <div className="space-y-5">
          <Input
            label="Server Name *"
            placeholder="My Awesome Server"
            error={errors.name?.message}
            {...register('name')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="IP Address *"
              placeholder="play.myserver.com"
              error={errors.ip_address?.message}
              {...register('ip_address')}
            />
            <Input
              label="Port *"
              type="number"
              placeholder="25565"
              error={errors.port?.message}
              {...register('port', { valueAsNumber: true })}
            />
          </div>

          <Textarea
            label="Description *"
            placeholder="Tell players about your server..."
            error={errors.description?.message}
            {...register('description')}
          />

          <Input
            label="Short Description"
            placeholder="A brief summary (shown in server cards)"
            helperText="Max 200 characters"
            error={errors.short_description?.message}
            {...register('short_description')}
          />
        </div>
      </Card>

      {/* Server Details */}
      <Card hover={false} padding="lg">
        <h2 className="text-xl font-semibold text-[#e8f0f8] mb-6">Server Details</h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#e8f0f8] mb-3">
              Game Modes *
            </label>
            <div className="flex flex-wrap gap-2">
              {gameModes.map((mode) => (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => handleGameModeToggle(mode.value)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    borderRadius: '10px',
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
              <p className="mt-2 text-sm text-red-400">{errors.game_modes.message}</p>
            )}
          </div>

          <Select
            label="Region *"
            options={regions}
            placeholder="Select a region"
            error={errors.region?.message}
            {...register('region')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Version *"
              placeholder="1.0"
              error={errors.version?.message}
              {...register('version')}
            />
            <Input
              label="Max Players *"
              type="number"
              placeholder="100"
              error={errors.max_players?.message}
              {...register('max_players', { valueAsNumber: true })}
            />
          </div>

          <Input
            label="Tags"
            placeholder="economy, mcmmo, custom plugins"
            helperText="Comma-separated list"
            {...register('tags')}
          />
        </div>
      </Card>

      {/* Links */}
      <Card hover={false} padding="lg">
        <h2 className="text-xl font-semibold text-[#e8f0f8] mb-6">Links</h2>
        <div className="space-y-5">
          <Input
            label="Discord Invite URL"
            placeholder="https://discord.gg/yourserver"
            error={errors.discord_url?.message}
            {...register('discord_url')}
          />
          <Input
            label="Website URL"
            placeholder="https://yourserver.com"
            error={errors.website_url?.message}
            {...register('website_url')}
          />
        </div>
      </Card>

      {/* Banner */}
      <Card hover={false} padding="lg">
        <h2 className="text-xl font-semibold text-[#e8f0f8] mb-6">Banner Image</h2>
        <div className="space-y-4">
          {bannerPreview ? (
            <div className="relative">
              <img
                src={bannerPreview}
                alt="Banner preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeBanner}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '200px',
                border: '2px dashed rgba(255,255,255,0.1)',
                borderRadius: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: 'rgba(255,255,255,0.02)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(91, 141, 239, 0.4)';
                e.currentTarget.style.background = 'rgba(91, 141, 239, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
                <Upload style={{ width: '40px', height: '40px', color: '#6b7c8f', marginBottom: '12px' }} />
                <p style={{ fontSize: '0.875rem', color: '#8fa3b8' }}>
                  <span style={{ fontWeight: 500, color: '#5b8def' }}>Click to upload</span> or drag and drop
                </p>
                <p style={{ fontSize: '0.75rem', color: '#6b7c8f', marginTop: '4px' }}>PNG, JPG or WebP (max 5MB)</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleBannerChange}
              />
            </label>
          )}
          <p className="text-sm text-[#8fa3b8]">
            Recommended size: 1920x480 pixels. This will be displayed at the top of your
            server page.
          </p>
        </div>
      </Card>

      {/* Submit Bar */}
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          marginLeft: '-24px',
          marginRight: '-24px',
          marginBottom: '-24px',
          padding: '16px 24px',
          background: 'rgba(10, 14, 20, 0.95)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
        }}
      >
        <Button type="button" variant="secondary" onClick={() => router.back()} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {isSubmitting
            ? 'Submitting...'
            : isEditing
            ? 'Save Changes'
            : 'Submit Server'}
        </Button>
      </div>
    </form>
  );
}
