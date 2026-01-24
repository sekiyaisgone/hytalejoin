import type { Metadata } from 'next';
import './globals.css';
import { Header, Footer } from '@/components/layout';
import { ToastProvider } from '@/components/ui';

export const metadata: Metadata = {
  title: {
    default: 'HytaleJoin - Find the Best Hytale Servers',
    template: '%s | HytaleJoin',
  },
  description:
    'Discover and join the best Hytale servers. Find communities that match your playstyle - PVP, survival, creative, mini-games, and more.',
  keywords: [
    'Hytale',
    'Hytale servers',
    'Hytale server list',
    'Hytale multiplayer',
    'Hytale PVP',
    'Hytale survival',
    'Hytale mini-games',
  ],
  authors: [{ name: 'HytaleJoin' }],
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'HytaleJoin - Find the Best Hytale Servers',
    description:
      'Discover and join the best Hytale servers. Find communities that match your playstyle.',
    url: 'https://hytalejoin.com',
    siteName: 'HytaleJoin',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HytaleJoin - Find the Best Hytale Servers',
    description:
      'Discover and join the best Hytale servers. Find communities that match your playstyle.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  metadataBase: new URL('https://hytalejoin.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <ToastProvider />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
