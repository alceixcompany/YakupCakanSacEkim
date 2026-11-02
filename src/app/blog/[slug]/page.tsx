import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Page from '@/components/hair/Page';
import { getHairArticles } from '@/lib/hair/content';
import { getPublishedPost } from '@/lib/publicContent';
import { SITE_URL, pageMetadata, getBreadcrumbSchema } from '@/lib/seo';
import { business } from '@/data/brand';
type Props = { params: Promise<{ slug: string }> };
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPublishedPost((await params).slug);
  return post ? pageMetadata({ title: post.title, description: post.excerpt, path: `/blog/${post.slug}`, image: post.image, article: { publishedTime: post.publishedDate, modifiedTime: post.modifiedDate, author: post.author } }) : { title: 'Yazı bulunamadı', robots: { index: false, follow: false } };
}
export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const [post, articles] = await Promise.all([getPublishedPost(slug), getHairArticles()]);
  if (!post) notFound();
  const schema = [{ '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description: post.excerpt, image: new URL(post.image, SITE_URL).href, datePublished: post.publishedDate, dateModified: post.modifiedDate || post.publishedDate, author: { '@type': 'Organization', name: business.name, url: SITE_URL }, publisher: { '@id': `${SITE_URL}/#organization` }, inLanguage: 'tr-TR', mainEntityOfPage: `${SITE_URL}/blog/${post.slug}` }, getBreadcrumbSchema([{ name: 'Blog', path: '/blog' }, { name: post.title, path: `/blog/${post.slug}` }])];
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} /><Page view="article" articleSlug={slug} articles={articles} /></>;
}
