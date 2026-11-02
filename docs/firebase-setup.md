# Yakup Çakan — Firebase bağlantısı

2 Kasım 2026 itibarıyla aktif proje `sacekim-75102` olarak değiştirildi. Kullanıcının verdiği altı Firebase web bağlantı değeri `.env.local` içinde güncellendi. `.firebaserc` de bu projeyi seçer. Eski projeden kalan yönetici çerezlerini geçersiz kılmak için yerel oturum imzalama sırrı yenilendi. Firebase istemci örneği proje kimliğine göre adlandırılır; eski projenin oturumu yeni bağlantıda yeniden kullanılmaz.

## Yönetici girişi

Firebase Authentication kimliği sunucuda doğrulanır. `FIREBASE_PRIMARY_ADMIN_UID` ve mevcut `admins/<UID>` yetki kontrolü kullanılır. Başarılı giriş imzalı, httpOnly oturum çerezi oluşturur. Kullanıcı talebiyle yeni Authentication hesabı oluşturuldu; `admins/<UID>.isAdmin` yetkisi kullanıcının işlem anındaki onayından sonra eklendi. Mevcut `firestore.rules` ve `storage.rules` güvenlik şartları korunur.

Yerel giriş bilgileri yalnızca Git dışında tutulan, `0600` izinli `artifacts/sacekim-admin-login.json` dosyasındadır. Şifre kaynak koduna, ortamın herkese açık değişkenlerine veya aktarım raporlarına yazılmaz.

## Başlangıç içeriği ve yayın yaşam döngüsü

Yeni blog/galeri kayıtları `brand: yakup-cakan` taşır; eski markanın verileri değiştirilmez. Ana yöneticinin ilk başarılı girişinde 3 yazı, 4 görsel, 3 kategori ve genel içerik durum kaydı tek atomik işlemde eklenir. Yalnızca eksik belgeler oluşturulur; mevcut belgelere yazılmaz. `admins/yakup-cakan-content-seed-v1` sonraki girişlerde otomatik aktarımı durdurur.

`haberler/yakup-cakan-content-state-v1` herkese açık, aktif bir teknik durum kaydıdır; blog listesinde veya içerik düzenleyicisinde görünmez. Bu kayıt aktarımın tamamlandığını bildirir. Aktarım öncesinde, başarılı Firebase sorgusundan sonra ZIP başlangıç içeriği gösterilir. Aktarımdan sonra silinen/gizlenen kayıtlar başlangıç içeriğinden geri getirilmez. Ağ veya izin hatasında da başlangıç içeriğine dönülmez.

`/admin/haberler`, `/admin/galeri` ve `/admin/galeri/kategoriler` mevcut CRUD altyapısını kullanır. Yeni yazı belge kimlikleri marka ve slug içerir; başlangıç içeriğiyle çakışan slug oluşturulamaz. Genel sayfalar ve sitemap aktif içerikleri her istekte okur.

## Fotoğraflar

Görseller bilgisayardan/telefondan seçilebilir veya sürüklenebilir. Mevcut 20 MB kaynak sınırı, 2400 piksel ve 700 KiB optimizasyonu, Firestore `media` saklaması ve `/api/media/[id]` API’si korunur. Yeni görsel ve içerik aynı işlemde kaydedilir. Kaydetmeden kapatılan görsel yüklenmez. Yeni blog/galeri düzenleyicisinin hazır görselleri ZIP’ten alınır; önceki ürün yöneticisinin seçenekleri korunur.

2 Kasım 2026 toplu aktarımında 46 ZIP görsel yolu, birebir aynı dosyalar birleştirilerek 45 WebP medya belgesine yüklendi. Kaynak toplamı 23.177.696 bayt (22,10 MiB), depolanan toplam 4.806.352 bayt (4,58 MiB); en büyük belge 385.310 bayttır. Kurallara uygun mevcut WebP dosyaları yeniden kodlanmaz; PNG/SVG kaynaklar WebP’ye çevrilir. Her dosya yüklemeden önce ve sonra SHA-256 ile kontrol edilir.

`contact_info/yakup-cakan-media-manifest-v1`, bütün orijinal yolları `/api/media/<id>` adreslerine bağlar. Sayfa, logo, duyarlı görsel boyutları ve önce/sonra karşılaştırmaları bu eşlemeyi kullanır. Yerel ZIP dosyaları kaynak ve bağlantı kesilmesi yedeği olarak korunur. `media` belgeleri değiştirilemez; aynı baytlar tekrar yüklenmez.

Toplu hazırlık: `node scripts/migrate-firebase.mjs --project sacekim-75102`. Gerçek aktarım için aynı komuta `--apply` eklenir. Medya önce sınırlı boyutlu commit gruplarıyla yüklenir; ardından eksik içerikler, yayın durumu ve eşleme kaydı atomik olarak eklenir. Mevcut içerikte sadece başlangıçtaki yerel görsel yoluyla hâlâ eşleşen alanlar güncellenir; diğer düzenlemeler korunur. Tekrar çalıştırma aynı medya belgelerinin üzerine yazmaz.

## Randevu

ZIP’teki WhatsApp akışı kullanılır: form mesajı tarayıcıda hazırlar, kullanıcı WhatsApp’ta gönderir. Form `contact_messages` koleksiyonuna yazmaz. Mevcut iletişim güvenlik kuralları bu nedenle değiştirilmedi.

## Kontroller

- `node scripts/test-admin-session.cjs`: doğrulama ve imzalı oturum testleri, taklit servislerle.
- `node scripts/test-initial-content.cjs`: atomik, yalnızca ekleyen ve bir kez çalışan aktarım; uzak yazma yapmaz.
- `node scripts/test-public-content.cjs`: marka ayrımı, gizleme/silme, kategori görünürlüğü, ağ hatası ve statik mod; uzak yazma yapmaz.
- `npm run check:site`: çalışan uygulamada başlangıç sayfaları, medya ve SEO.
- `node scripts/verify-firebase-migration.mjs`: gerçek yeni projeden 45 görselin API yanıtı, checksum ve boyutları; genel sayfaların DB görselleri; yeni yönetici girişi, httpOnly oturum ve anonim erişim reddi.

Eski içerik ekleme betikleri de yalnızca eksik başlangıç içerikleri için korunur. Görsellerle birlikte yeni proje kurulumu için toplu aktarım betiği kullanıldı. Üretimde doğrulanmış HTTPS alan adı `NEXT_PUBLIC_SITE_URL` ile ayarlanır.
