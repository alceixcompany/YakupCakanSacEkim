import type { MetadataRoute } from 'next';
import { SEO_CONFIG } from '@/lib/seo';
export default function manifest(): MetadataRoute.Manifest { return { name: SEO_CONFIG.name, short_name: 'Yakup Çakan', description: SEO_CONFIG.shortDescription, lang: 'tr', start_url: '/', display: 'standalone', background_color: '#ffffff', theme_color: '#bf613f', icons: [{ src: '/brand/monogram.png', sizes: 'any', type: 'image/png' }] }; }
