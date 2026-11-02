"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { FiInstagram as Instagram } from 'react-icons/fi';
import SiteBrand from './hair/SiteBrand';
import { business, formatPhone, maps, navigation, whatsapp } from '@/data/brand';
export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  const instagram = business.instagram;
  return <div data-site-footer>
      <section className="contact section" id="iletisim"><div className="contact-top"><SiteBrand /><h2>Kadıköy’de, <em>bir kahveye bekleriz.</em></h2></div><div className="contact-grid"><div><div className="eyebrow">BİZİ ZİYARET EDİN</div><p>{business.address}</p><a href={maps} target="_blank" rel="noreferrer" className="text-link">Yol tarifi al <ArrowUpRight size={17} /></a></div><div><div className="eyebrow">İLETİŞİMDE KALALIM</div><a className="contact-tel" href={"tel:" + business.phone}>{formatPhone(business.phone)}</a><a className="contact-tel" href={"tel:" + business.secondPhone}>{formatPhone(business.secondPhone)}</a></div><div><div className="eyebrow">HİKÂYEMİZE KATILIN</div><a href={instagram} target="_blank" rel="noreferrer" className="social-link"><Instagram size={20} /> Instagram <ArrowUpRight size={18} /></a><a href={whatsapp} target="_blank" rel="noreferrer" className="social-link"><MessageCircle size={20} /> WhatsApp <ArrowUpRight size={18} /></a></div></div></section>

    <div className="footer-navigation"><div className="section">{navigation.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}</div></div>
    <footer><span>© {new Date().getFullYear()} Yakup Çakan Protez Saç Merkezi</span><span>KENDİNE YENİDEN MERHABA.</span><Link href="/gizlilik-politikasi" className="privacy-link">Gizlilik</Link><a href="#icerik">Başa dön <ArrowUpRight size={14} /></a></footer>
    <a className="floating-whatsapp" href={whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp üzerinden iletişime geç"><MessageCircle size={23} /><span>Bir sorunuz mu var?</span></a>
</div>;
}
