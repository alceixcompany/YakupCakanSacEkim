import Page from '@/components/hair/Page';
import { getHairArticles, getHairGallery } from '@/lib/hair/content';
export const dynamic = 'force-dynamic';
export default async function Home() {
  const [articles, gallery] = await Promise.all([getHairArticles(), getHairGallery()]);
  return <Page articles={articles} gallery={gallery} />;
}
