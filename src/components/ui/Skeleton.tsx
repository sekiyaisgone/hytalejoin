'use client';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={`
        skeleton bg-[#1a2f4a]
        ${variants[variant]}
        ${className}
      `}
      style={style}
    />
  );
}

export function ServerCardSkeleton() {
  return (
    <div className="bg-[rgba(26,47,74,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-xl p-5">
      <div className="flex gap-4">
        <Skeleton className="w-20 h-20 flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ServerDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="w-full h-64 rounded-xl" />
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}
