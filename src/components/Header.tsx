"use client";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, MapPin, Menu, Moon, Sun, X } from 'lucide-react';
import SiteBrand from './hair/SiteBrand';
import { maps, navigation } from '@/data/brand';
export default function Header() {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);
  const isAdmin = pathname.startsWith('/admin');
  const view = pathname === '/' ? 'home' : pathname.startsWith('/blog/') ? 'article' : ({ '/hakkimizda': 'about', '/galeri': 'gallery', '/protez-sac-bakimi': 'care', '/blog': 'blog', '/iletisim': 'contact' } as Record<string, string>)[pathname];
  const nav = navigation.map(item => ({ ...item, path: item.href, view: ({ '/': 'home', '/hakkimizda': 'about', '/galeri': 'gallery', '/protez-sac-bakimi': 'care', '/blog': 'blog', '/iletisim': 'contact' } as Record<string, string>)[item.href] }));
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
    const scroll = () => setScrolled(window.scrollY > 20);
    scroll(); window.addEventListener('scroll', scroll, { passive: true });
    return () => window.removeEventListener('scroll', scroll);
  }, []);
  useEffect(() => { setMenu(false); }, [pathname]);
  useEffect(() => {
    if (!menu || isAdmin) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const background = Array.from(document.querySelectorAll<HTMLElement>('main, [data-site-footer]'));
    background.forEach(element => { element.inert = true; });
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('#main-navigation a'));
    links[0]?.focus();
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenu(false); menuRef.current?.focus(); }
      if (event.key === 'Tab') {
        const focusable = [...links, menuRef.current].filter((el): el is HTMLAnchorElement | HTMLButtonElement => el !== null);
        if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable.at(-1)?.focus(); }
        else if (!event.shiftKey && document.activeElement === focusable.at(-1)) { event.preventDefault(); focusable[0]?.focus(); }
      }
    };
    const resize = () => { if (window.innerWidth > 1120) setMenu(false); };
    window.addEventListener('resize', resize); document.addEventListener('keydown', keyboard);
    return () => { document.body.style.overflow = previous; background.forEach(element => { element.inert = false; }); document.removeEventListener('keydown', keyboard); window.removeEventListener('resize', resize); };
  }, [menu, isAdmin]);
  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next); document.documentElement.dataset.theme = next;
    try { localStorage.setItem('yc-theme-v2', next); } catch {}
  }
  if (isAdmin) return null;
  return <>
    <a className="skip-link" href="#icerik">İçeriğe geç</a>
    <div className="topbar"><span>2017’DEN BERİ, AYNI ÖZENLE.</span><a href={maps} target="_blank" rel="noreferrer"><MapPin size={11} /> KADIKÖY, İSTANBUL <ArrowUpRight size={12} /></a></div>
    <header className={scrolled ? 'header scrolled' : 'header'}><div className="nav-wrap"><SiteBrand /><nav id="main-navigation" aria-label="Ana menü" className={menu ? 'navigation open' : 'navigation'}>{nav.map(item => <Link key={item.path} href={item.path} className={(view === item.view || view === 'article' && item.view === 'blog') ? 'current' : ''} aria-current={view === item.view || view === 'article' && item.view === 'blog' ? 'page' : undefined} onClick={() => setMenu(false)}>{item.label}</Link>)}<a className="mobile-book" href="/iletisim#randevu" onClick={() => setMenu(false)}>Randevu oluştur <ArrowUpRight size={17} /></a></nav><div className="nav-actions"><button className="theme-toggle" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Gündüz moduna geç' : 'Gece moduna geç'} title={theme === 'dark' ? 'Gündüz moduna geç' : 'Gece moduna geç'}>{theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}<span>{theme === 'dark' ? 'Gündüz' : 'Gece'}</span></button><a className="nav-book" href="/iletisim#randevu">Randevu al <ArrowUpRight size={16} /></a><button ref={menuRef} className="menu-toggle" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="main-navigation" aria-label={menu ? 'Menüyü kapat' : 'Menüyü aç'}>{menu ? <X /> : <Menu />}</button></div></div></header>
  </>;
}
