export const CONTENT_BRAND = 'yakup-cakan';
export const business = {
  name: 'Yakup Çakan',
  fullName: 'Yakup Çakan Protez Saç Merkezi',
  tagline: 'Kendine yeniden merhaba.',
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+905078736383',
  secondPhone: '+905445932426',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
  address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || 'Hasanpaşa Mah. Kurbağalıdere Cad. No:17 K:1, Kadıköy / İstanbul',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/yakupcakan/',
};
export const whatsapp = `https://wa.me/${business.phone.replace(/\D/g, '')}`;
export const maps = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(`${business.fullName} ${business.address}`);
export const formatPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '').replace(/^90/, '0');
  return digits.length === 11 ? `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9)}` : phone;
};
export const navigation = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Hakkımızda', href: '/hakkimizda' },
  { label: 'Galeri', href: '/galeri' },
  { label: 'Bakım Rehberi', href: '/protez-sac-bakimi' },
  { label: 'Blog', href: '/blog' },
  { label: 'İletişim', href: '/iletisim' },
];
// Retained for the previous catalogue's internal components.
export const fragranceFamilies = [
  { name: 'Çiçeksi', subtitle: 'Bir bahar sabahı gibi', image: '/parfum-bahari/fleur.webp', note: 'Gül · Yasemin · Manolya' },
  { name: 'Odunsu', subtitle: 'Sakin ve derin', image: '/parfum-bahari/santal.webp', note: 'Sandal · Sedir · Vetiver' },
  { name: 'Ferah', subtitle: 'Hafifliğin peşinde', image: '/parfum-bahari/neroli.webp', note: 'Bergamot · Neroli · Misk' },
  { name: 'Oryantal', subtitle: 'Sıcak bir iz bırakır', image: '/parfum-bahari/ambre.webp', note: 'Amber · Vanilya · Baharat' },
];
