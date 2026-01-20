import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getServerById } from '@/lib/servers';
import ServerDetailClient from './ServerDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const server = await getServerById(id);

    if (!server) {
      return {
        title: 'Server Not Found',
      };
    }

    return {
      title: server.name,
      description: server.short_description || server.description.slice(0, 160),
      openGraph: {
        title: `${server.name} - HytaleJoin`,
        description: server.short_description || server.description.slice(0, 160),
        images: server.banner_image_url ? [server.banner_image_url] : [],
      },
    };
  } catch {
    return {
      title: 'Server Not Found',
    };
  }
}

// Dynamic page - no static params generation
export const dynamic = 'force-dynamic';

export default async function ServerPage({ params }: PageProps) {
  const { id } = await params;
  const server = await getServerById(id);

  if (!server) {
    notFound();
  }

  return <ServerDetailClient server={server} />;
}
