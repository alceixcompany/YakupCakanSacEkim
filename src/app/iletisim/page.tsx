import Page from '@/components/hair/Page';
import { pageMetadata } from '@/lib/seo';
export const metadata = pageMetadata({ title: 'İletişim ve Randevu', description: 'Kadıköy Yakup Çakan Protez Saç Merkezi: telefon, adres, yol tarifi ve WhatsApp üzerinden randevu talebi.', path: '/iletisim' });
export default async function RoutePage() {  return <Page view="contact" />; }
