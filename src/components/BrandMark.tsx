'use client';
import { useMediaSource } from '@/components/hair/MediaSources';
/* eslint-disable @next/next/no-img-element */
export default function BrandMark({ compact = false }: { compact?: boolean; dark?: boolean }) {
  const media = useMediaSource();
  return <span className={`brand-mark ${compact ? 'compact' : ''}`}><img src={media('/brand/monogram.png')} alt="" width="48" height="48" className="brand-emblem" /><span className="brand-wordmark"><img src={media('/brand/wordmark.png')} alt="Yakup Çakan Protez Saç Merkezi" width="210" height="50" /></span></span>;
}
