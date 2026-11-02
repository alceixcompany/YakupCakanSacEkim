import Page from '@/components/hair/Page';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata({ title: 'Protez Saç Bakım Rehberi', description: 'Saç protezi yıkama, nazik tarama, ürün seçimi ve düzenli bakım hakkında Yakup Çakan bakım rehberi.', path: '/protez-sac-bakimi' });
export default async function RoutePage() {  return <Page view="care" />; }
