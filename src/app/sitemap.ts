import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { getPublishedPosts } from '@/lib/publicContent';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  return [...['', '/hakkimizda', '/galeri', '/protez-sac-bakimi', '/blog', '/iletisim', '/gizlilik-politikasi'].map(path => ({ url: `${SITE_URL}${path}`, changeFrequency: 'monthly' as const, priority: path === '' ? 1 : .7 })), ...posts.map(post => ({ url: `${SITE_URL}/blog/${post.slug}`, ...(Number.isNaN(Date.parse(post.modifiedDate || post.publishedDate)) ? {} : { lastModified: new Date(post.modifiedDate || post.publishedDate) }), changeFrequency: 'monthly' as const, priority: .6 }))];
}
