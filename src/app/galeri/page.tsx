import Page from '@/components/hair/Page';
import { pageMetadata } from '@/lib/seo';
import { getHairGallery } from '@/lib/hair/content';
export const metadata = pageMetadata({ title: 'Galeri — Stil ve Tasarım', description: 'Yakup Çakan marka seçkisinden saç stilleri, saç çizgileri ve tasarım detayları. Fotoğrafları ve uygulama referanslarını keşfedin.', path: '/galeri' });
export const dynamic = 'force-dynamic';
export default async function RoutePage() { const gallery = await getHairGallery(); return <Page view="gallery" gallery={gallery} />; }
