import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
export default function NotFound() { return <main id="icerik"><section className="page-intro section"><div className="eyebrow">404 / SAYFA BULUNAMADI</div><h1>Yeni bir yol,<br /><em>aynı sen.</em></h1><p>Aradığınız sayfa taşınmış veya artık yayında olmayabilir. Ana sayfadan devam edebilirsiniz.</p><Link href="/" className="button primary">Ana sayfaya dön <ArrowUpRight size={18} /></Link></section></main>; }
