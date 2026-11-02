/* eslint-disable @next/next/no-img-element */
'use client';
import Link from 'next/link';
import { useMediaSource } from './MediaSources';
export default function SiteBrand() {
  const media = useMediaSource();
  return <Link href="/" className="brand" aria-label="Yakup Çakan ana sayfa"><img className="brand-emblem" src={media('/brand/monogram.png')} alt="" width="48" height="48" /><img className="brand-wordmark" src={media('/brand/wordmark.png')} alt="Yakup Çakan Protez Saç Merkezi" width="210" height="50" /></Link>;
}
