import Page from '@/components/hair/Page';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata({ title: 'Hakkımızda', description: '2017’den beri Kadıköy’de protez saç uygulaması, kesim ve bakım. Yakup Çakan merkezinin kişiye özel yaklaşımını tanıyın.', path: '/hakkimizda' });
export default async function RoutePage() {  return <Page view="about" />; }
