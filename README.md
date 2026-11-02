# Yakup Çakan — Protez Saç Merkezi

Kullanıcının `yakup-cakan.zip` dosyasındaki arayüz, mevcut Next.js 16 / React 19 projesine taşındı. ZIP’teki görseller, tipografi, açık/koyu tema ve sayfa düzenleri kullanılır. Firebase bağlantısı `sacekim-75102` projesine taşındı; Redux, yönetici doğrulaması, imzalı oturumlar, medya API’si ve güvenlik kuralları kullanılır.

## Çalıştırma

```sh
npm install
npm run dev
```

Üretim için `npm run build` ve `npm start` kullanılır. `.env.local` mevcut bağlantı ayarlarını taşır; ZIP’in ortam dosyaları, bağımlılık klasörü, Git geçmişi veya sunucu altyapısı içe aktarılmaz.

## Sayfalar ve etkileşimler

- `/`: ana sayfa, hizmetler, üç önce/sonra karşılaştırması, galeri, blog ve sık sorulan sorular.
- `/hakkimizda`, `/galeri`, `/protez-sac-bakimi`, `/blog`, `/blog/[slug]`, `/iletisim`.
- `/gizlilik-politikasi`: tema, randevu akışı ve yönetici oturumlarının açıklaması.
- Galeri kategori filtresi, fotoğraf büyütme, ok tuşları ve Escape desteği.
- Türkçe blog araması, dinamik kategori filtreleri ve ilgili yazılar.
- WhatsApp randevu mesajı hazırlama ve bilgileri yeniden düzenleme. Mesaj kullanıcı tarafından WhatsApp’ta gönderilir; form veritabanına mesaj yazmaz.
- Mobil menüde odak yönetimi, Escape ile kapatma ve arka plan etkileşimlerini kilitleme.
- Tema tercihi tarayıcıda saklanır.

Önceki URL’ler yeni karşılıklarına 308 ile yönlendirilir. Genel arayüzde eski parfüm markası gösterilmez; eski ürün verileri, görselleri ve backend bileşenleri korunur.

## İçerik yönetimi

Yeni başlangıç içerikleri `src/data/hair-content.json`; marka ve iletişim ayarları `src/data/brand.ts`; arayüz `src/components/hair/` içindedir. ZIP’in CSS dosyaları `src/app/globals.css` ve `src/app/refinements.css` olarak taşındı. Marka görselleri `public/brand/`, fotoğraflar `public/images/` içindedir.

Firebase modunda blog ve galeri mevcut koleksiyonlardan `brand: yakup-cakan` ile okunur. Diğer markanın kayıtlarına dokunulmaz. İlk yetkili ana yönetici girişinde 3 yazı, 4 görsel ve 3 kategori yalnızca eksik kayıtlar eklenerek aktarılır. Mevcut kayıtlar değiştirilmez. Aktarım öncesinde, başarılı veritabanı okumasından sonra ZIP başlangıç içeriği gösterilir; aktarım sonrasındaki yayınlama, gizleme ve silme işlemleri doğrudan siteye yansır. Bağlantı hatası gizlenmiş içerikleri geri getirmez.

`NEXT_PUBLIC_CONTENT_SOURCE=static` açıkça seçilirse çevrimdışı önizleme kullanılır. Aktif Firebase projesi kullanıcının isteğiyle `sacekim-75102` olarak güncellendi. [Firebase açıklaması](docs/firebase-setup.md).

## Kontroller

```sh
npm run build
npm run check:site
node scripts/test-public-content.cjs
node scripts/test-initial-content.cjs
node scripts/test-admin-session.cjs
```

`check:site`, çalışan sunucuda başlangıç içeriğinin sayfalarını, bağlantıları, varlıkları, SEO verilerini ve yönetici sınırını denetler. Diğer üç test uzak servise yazmadan içerik yaşam döngüsünü ve oturum davranışını sınar. [Kontrol notları](docs/verification.md).

## Vercel

GitHub reposunu Next.js projesi olarak içe aktarın. Kök dizin proje kökü, build komutu `npm run build`, kurulum komutu `npm ci` olmalıdır. Ortam değişkenleri ve yayın adımları [Vercel kurulumunda](docs/vercel.md) açıklanır. `.env.local`, yönetici şifresi, yerel aktarım raporları ve servis hesabı anahtarları Git’e dahil edilmez.
