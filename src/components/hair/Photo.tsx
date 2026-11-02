'use client';
import type { BrandPhoto } from '@/lib/hair/media';
import { useMediaSource } from './MediaSources';
export default function Photo({ photo, alt, className = '', priority = false, sizes = '(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw' }: { photo: BrandPhoto; alt?: string; className?: string; priority?: boolean; sizes?: string }) {
  const media = useMediaSource();
  return <div className={'crop original-photo ' + className} style={{ aspectRatio: `${photo.width}/${photo.height}` }}>
    <img src={media(photo.src || `/images/editorial/${photo.id}-${photo.maxWidth}.webp`)} srcSet={photo.src ? undefined : [...new Set([480, 800, photo.maxWidth])].map(width => `${media(`/images/editorial/${photo.id}-${width}.webp`)} ${width}w`).join(', ')} sizes={sizes} width={photo.width} height={photo.height} alt={alt || photo.alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} decoding="async" draggable={false} />
  </div>;
}
