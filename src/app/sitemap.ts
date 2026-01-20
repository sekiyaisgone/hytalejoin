import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Get all approved servers
  const { data: servers } = await supabase
    .from('servers')
    .select('id, updated_at')
    .eq('status', 'approved');

  const serverUrls = (servers || []).map((server) => ({
    url: `https://hytalejoin.com/servers/${server.id}`,
    lastModified: new Date(server.updated_at),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://hytalejoin.com',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: 'https://hytalejoin.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://hytalejoin.com/privacy',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: 'https://hytalejoin.com/terms',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: 'https://hytalejoin.com/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    ...serverUrls,
  ];
}
