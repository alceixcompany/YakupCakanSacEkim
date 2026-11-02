'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowUpRight, FiFileText, FiImage, FiLayers, FiPackage, FiDownload, FiCheck } from 'react-icons/fi';
import { useCollection, messageFor } from '@/components/admin/useCollection';
import { importStarterContent } from '@/lib/seedContent';
import starter from '@/data/hair-content.json';
import { useAuth } from '@/hooks/useAuth';
import { useMediaSource } from '@/components/hair/MediaSources';
export default function Dashboard() {
  const { user } = useAuth();
  const media = useMediaSource();
  const posts = useCollection('haberler'); const gallery = useCollection('gallery_items'); const categories = useCollection('gallery_categories');
  const [importing, setImporting] = useState(false); const [notice, setNotice] = useState(''); const [error, setError] = useState('');
  const stats = [{ title: 'Blog yazıları', data: posts, icon: FiFileText, href: '/admin/haberler' }, { title: 'Galeri görselleri', data: gallery, icon: FiImage, href: '/admin/galeri' }, { title: 'Kategoriler', data: categories, icon: FiLayers, href: '/admin/galeri/kategoriler' }];
  async function importContent() { setImporting(true); setNotice(''); setError(''); try { const result = await importStarterContent(); setNotice(`${result.added} yeni kayıt eklendi. ${result.skipped} mevcut kayıt korundu.`); } catch (e) { setError(messageFor(e)); } finally { setImporting(false); } }
  return <><div className="admin-page-heading"><div><p className="admin-eyebrow">YAKUP ÇAKAN</p><h1>Her ayrıntı, kontrolünüzde.</h1><p>İçerik stüdyonuza hoş geldiniz.</p></div><Link className="admin-button secondary" href="/" target="_blank">Siteyi görüntüle <FiArrowUpRight /></Link></div><section className="admin-welcome"><Image src={media('/images/editorial/portrait-1600.webp')} alt="" fill sizes="80vw" /><div /><div className="admin-welcome-copy"><p>KENDİNE YENİDEN MERHABA.</p><h2>Markanızın hikâyesini<br /><em>güzel anlatın.</em></h2><Link href="/admin/haberler">Yeni bir yazı ekleyin <FiArrowUpRight /></Link></div></section><div className="admin-stat-grid">{stats.map(({ title, data, icon: Icon, href }) => <Link className="admin-stat" href={href} key={title}><span><Icon /><FiArrowUpRight /></span><strong>{data.loading ? '…' : data.error ? '—' : data.items.length}</strong><p>{title}</p><small>{data.error ? 'Bağlantı kontrolü gerekli' : `${data.items.filter(item => item.isActive === true).length} yayında`}</small></Link>)}</div>
    {user?.setupMessage && <p className={user.setupError ? 'admin-error' : 'admin-success'} role="status">{user.setupMessage}</p>}
    {(error || stats.some(stat => stat.data.error)) && <p className="admin-error" role="alert">{error || stats.find(stat => stat.data.error)?.data.error}</p>}{notice && <p className="admin-success" role="status"><FiCheck />{notice}</p>}
    <section className="admin-panel admin-starter"><div><p className="admin-eyebrow">YAYINA HAZIR BİR BAŞLANGIÇ</p><h2>Yakup Çakan içerik koleksiyonu</h2><p>Üç Türkçe blog yazısı, dört marka görseli ve üç galeri kategorisi. İçe aktarma mevcut kayıtları değiştirmez; eksik kayıtları yayında olarak ekler.</p><details><summary>İçe aktarılacak içerikleri incele</summary><div className="admin-starter-preview"><div><h3>Blog yazıları</h3>{starter.haberler.map(post => <p key={post.id}>{post.title}</p>)}</div><div><h3>Galeri</h3>{starter.gallery_items.map(item => <p key={item.id}>{item.title} · {item.categoryName}</p>)}</div></div></details></div><button className="admin-button" onClick={importContent} disabled={importing || posts.loading || !!posts.error}><FiDownload />{importing ? 'İçe aktarılıyor…' : 'Hazır içerikleri içe aktar'}</button></section>
    <div className="admin-dashboard-links"><Link href="/admin/haberler"><FiPackage /><h2>Yeni bir yazı</h2><p>Bilgisayarınızdan fotoğraf seçin, yazınızı ekleyin ve yayınlayın.</p><FiArrowUpRight /></Link><Link href="/admin/galeri"><FiImage /><h2>Yeni bir bakış</h2><p>Galerinize yeni kareler ekleyin, vitrin görsellerini seçin.</p><FiArrowUpRight /></Link></div></>;
}
