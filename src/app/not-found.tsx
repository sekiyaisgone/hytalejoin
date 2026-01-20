'use client';

import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-[#d29f32] mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-[#e8f0f8] mb-4">Page Not Found</h2>
        <p className="text-[#8fa3b8] mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button leftIcon={<Home className="w-4 h-4" />}>Go Home</Button>
          </Link>
          <Button variant="secondary" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
