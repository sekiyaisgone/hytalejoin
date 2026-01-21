'use client';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'shimmer' | 'pulse' | 'none';
  style?: React.CSSProperties;
}

export default function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'shimmer',
  style: styleProp,
}: SkeletonProps) {
  const variants = {
    text: 'rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    rounded: 'rounded-xl',
  };

  const animations = {
    shimmer: 'skeleton',
    pulse: 'animate-pulse bg-[#1a2942]',
    none: 'bg-[#1a2942]',
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    ...styleProp,
  };

  return (
    <div
      className={`
        ${animations[animation]}
        ${variants[variant]}
        ${className}
      `}
      style={style}
    />
  );
}

// Premium Server Card Skeleton with banner
export function ServerCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[rgba(15,23,32,0.75)] border border-[rgba(255,255,255,0.06)]">
      {/* Banner skeleton */}
      <div className="h-36 skeleton" />

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title row */}
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-6 w-2/3" variant="rounded" />
          <Skeleton className="h-6 w-16" variant="rounded" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" variant="rounded" />
          <Skeleton className="h-4 w-4/5" variant="rounded" />
        </div>

        {/* Tags */}
        <div className="flex gap-2">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-16 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-20" variant="rounded" />
            <Skeleton className="h-5 w-24" variant="rounded" />
          </div>
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Hero section skeleton
export function HeroSkeleton() {
  return (
    <div className="text-center space-y-6 py-8">
      <Skeleton className="h-12 w-3/4 mx-auto" variant="rounded" />
      <Skeleton className="h-6 w-1/2 mx-auto" variant="rounded" />
      <Skeleton className="h-14 w-full max-w-2xl mx-auto" variant="rounded" />
      <div className="flex justify-center gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-20 rounded-full" />
        ))}
      </div>
    </div>
  );
}

// Server detail page skeleton
export function ServerDetailSkeleton() {
  return (
    <div className="space-y-8">
      {/* Banner */}
      <Skeleton className="w-full h-72 rounded-2xl" />

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and status */}
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-10 w-2/3" variant="rounded" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>

          {/* Description */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" variant="rounded" />
            <Skeleton className="h-4 w-full" variant="rounded" />
            <Skeleton className="h-4 w-3/4" variant="rounded" />
            <Skeleton className="h-4 w-5/6" variant="rounded" />
          </div>
        </div>

        {/* Right column - sidebar */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[rgba(15,23,32,0.75)] border border-[rgba(255,255,255,0.06)] space-y-4">
            <Skeleton className="h-6 w-1/3" variant="rounded" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <div className="pt-4 border-t border-[rgba(255,255,255,0.06)] space-y-3">
              <Skeleton className="h-4 w-full" variant="rounded" />
              <Skeleton className="h-4 w-2/3" variant="rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stats card skeleton
export function StatsCardSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-[rgba(15,23,32,0.75)] border border-[rgba(255,255,255,0.06)]">
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" variant="rounded" />
          <Skeleton className="h-8 w-16" variant="rounded" />
        </div>
      </div>
    </div>
  );
}

// Filter pills skeleton
export function FilterPillsSkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-10 rounded-full"
          style={{ width: `${60 + Math.random() * 40}px` }}
        />
      ))}
    </div>
  );
}
