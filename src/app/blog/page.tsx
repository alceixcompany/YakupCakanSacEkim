import Page from '@/components/hair/Page';
import { pageMetadata } from '@/lib/seo';
import { getHairArticles } from '@/lib/hair/content';
export const metadata = pageMetadata({ title: 'Blog — Protez Saç Rehberi', description: 'İlk görüşme, saç stili ve bakım üzerine notlar. Yakup Çakan protez saç rehberini keşfedin.', path: '/blog' });
export const dynamic = 'force-dynamic';
export default async function RoutePage() { const articles = await getHairArticles(); return <Page view="blog" articles={articles} />; }
