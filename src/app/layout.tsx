import type { Metadata, Viewport } from 'next';
import './globals.css';
import './refinements.css';
import './integration.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MediaSourcesProvider } from '@/components/hair/MediaSources';
import { getImageManifest } from '@/lib/hair/imageManifest';
import { SITE_URL, SEO_CONFIG, getBrandSchema, pageMetadata } from '@/lib/seo';
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#0c0d0c' }, { media: '(prefers-color-scheme: light)', color: '#ffffff' }] };
export const metadata: Metadata = {
  ...pageMetadata({ title: 'Kadıköy Protez Saç Merkezi | Yakup Çakan', description: SEO_CONFIG.shortDescription, path: '/' }),
  metadataBase: new URL(SITE_URL), applicationName: SEO_CONFIG.name, authors: [{ name: SEO_CONFIG.name }], creator: SEO_CONFIG.name, publisher: SEO_CONFIG.name,
  category: 'Protez saç uygulaması ve bakımı', keywords: SEO_CONFIG.keywords, manifest: '/manifest.webmanifest', icons: { icon: '/brand/monogram.png', apple: '/brand/monogram.png' },
};
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const sources = await getImageManifest();
  return <html lang="tr" data-theme="light" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('yc-theme-v2');document.documentElement.dataset.theme=t==='dark'?'dark':'light'}catch(e){}})();` }} /></head><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getBrandSchema()).replace(/</g, '\\u003c') }} /><MediaSourcesProvider sources={sources}><Header />{children}<Footer /></MediaSourcesProvider></body></html>;
}
