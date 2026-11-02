import { cache } from 'react';
import { getPublishedGallery, getPublishedPosts } from '@/lib/publicContent';
import { photos, type BrandPhoto } from './media';
import type { Article } from './blog';

function photoFor(src: string, title: string, type: string, id: string): BrandPhoto {
  const original = photos.find(photo => src.startsWith(`/images/editorial/${photo.id}-`));
  return original ? { ...original, recordId: id, title, type } : { id, title, type, alt: title, width: 1200, height: 1500, maxWidth: 1200, src };
}
export const getHairArticles = cache(async (): Promise<Article[]> => (await getPublishedPosts()).map(post => {
  const sections: Article['sections'] = [];
  for (const paragraph of post.paragraphs) {
    if (paragraph.length < 120 && !/[.!?]$/.test(paragraph)) sections.push({ title: paragraph, paragraphs: [] });
    else {
      if (!sections.length) sections.push({ title: 'Yazıdan notlar', paragraphs: [] });
      sections[sections.length - 1].paragraphs.push(paragraph);
    }
  }
  return { slug: post.slug, title: post.title, category: post.category, excerpt: post.excerpt, image: 0, cover: photoFor(post.image, post.title, post.category, post.slug), sections, featured: post.featured };
}));
export const getHairGallery = cache(async (): Promise<BrandPhoto[]> => (await getPublishedGallery()).map(item => photoFor(item.src, item.title, item.tag, item.id)));
