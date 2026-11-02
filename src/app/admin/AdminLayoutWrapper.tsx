import '@/app/admin.css';
import Link from 'next/link';
import { FiArrowUpRight, FiBookOpen, FiImage, FiLayers } from 'react-icons/fi';
import { CONTENT_SOURCE, FIREBASE_CONFIGURED } from '@/lib/contentSource';
import starter from '@/data/hair-content.json';
import BrandMark from '@/components/BrandMark';
import CloudAdmin from '@/components/admin/CloudAdmin';
export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  if (CONTENT_SOURCE === 'firebase' && FIREBASE_CONFIGURED) return <CloudAdmin>{children}</CloudAdmin>;
  return <main id="main" className="static-studio"><div className="container"><Link href="/"><BrandMark /></Link><p className="eyebrow">YEREL İÇERİK STÜDYOSU</p><h1>Her şey burada.<br /><em>Şimdilik statik.</em></h1><p>Site projedeki başlangıç içerikleriyle çalışıyor. Bu ekran herkese açık içeriklerin önizlemesidir. Firebase içerik kaynağı etkinleştirildiğinde mevcut güvenli yönetim paneli kullanılır.</p><div className="static-studio-grid"><Link href="/blog"><FiBookOpen /><strong>{starter.haberler.length}</strong><span>Blog yazısı</span><FiArrowUpRight /></Link><Link href="/galeri"><FiImage /><strong>{starter.gallery_items.length}</strong><span>Galeri görseli</span><FiArrowUpRight /></Link><Link href="/galeri"><FiLayers /><strong>{starter.gallery_categories.length}</strong><span>Kategori</span><FiArrowUpRight /></Link></div><div className="static-studio-note"><h2>İçerik kaynakları</h2><p>Yazılar ve galeri: <code>src/data/hair-content.json</code><br />Marka bilgileri: <code>src/data/brand.ts</code></p><p>Mevcut Firebase bağlantısı, güvenli oturum ve içerik yönetimi altyapısı korunuyor.</p></div><Link href="/" className="text-link">Siteye dön <FiArrowUpRight /></Link></div></main>;
}
