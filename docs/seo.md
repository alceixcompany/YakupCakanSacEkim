# Yakup Çakan SEO

Türkçe sayfa başlıkları, açıklamalar, canonical, Open Graph ve Twitter metadata yeni markaya uyarlandı. Yerel marka monogramı favicon ve manifest içinde kullanılır.

`/sitemap.xml` ana sayfayı, hakkımızda, galeri, bakım rehberi, blog, iletişim, gizlilik ve yalnızca aktif blog yazılarını listeler. Eski katalog yolları listelenmez. `HairSalon`, `BreadcrumbList` ve `BlogPosting` yapılandırılmış verileri bulunur.

Mevcut indeksleme koruması korunur: doğrulanmış HTTPS `NEXT_PUBLIC_SITE_URL` ayarlanmadan indeksleme açılmaz; yönetim ve API yolları indekslenmez. Geliştirme ve önizleme sürümleri indekslenmez.

Eski İngilizce yollar, `/haberler`, katalog ve hizmet yolları ilgili yeni sayfalara 308 ile yönlenir. Yayında olmayan blog slug’ları 404 verir. Gerçek iletişim bilgileri ZIP’teki işletme bilgisinden alınır; mevcut ortam değişkenleri bunları geçersiz kılabilir.
