# Vercel kurulumu

1. `alceixcompany/YakupCakanSacEkim` reposunun `main` dalını içe aktarın.
2. Framework: Next.js. Root Directory: proje kökü. Build: `npm run build`. Install: `npm ci`. Output Directory: Next.js varsayılanı. Node.js: Vercel’in desteklediği 22.x veya 24.x sürümü.
3. Aşağıdaki değişkenleri Vercel → Settings → Environment Variables bölümüne ekleyin. `.env.local` repoda bulunmaz. Gerçek anahtar değerleri ve yönetici giriş bilgileri proje sahibine ayrı verilir.

| Değişken | Değer / amaç |
| --- | --- |
| `NEXT_PUBLIC_CONTENT_SOURCE` | `firebase` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web API anahtarı |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `sacekim-75102.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `sacekim-75102` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `sacekim-75102.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `445383800498` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:445383800498:web:536a5c43499e08d100fbab` |
| `ADMIN_SESSION_SECRET` | En az 32 bayt rastgele sunucu oturum sırrı; `NEXT_PUBLIC_` öneki eklenmez |
| `FIREBASE_PRIMARY_ADMIN_UID` | `864a9qlBDvUSVhxYjHV5iQrNCGP2`; sunucu değişkeni |
| `NEXT_PUBLIC_SITE_URL` | Sitenin gerçek HTTPS ana adresi; localhost veya örnek adres kullanmayın |

`NEXT_PUBLIC_CONTACT_PHONE`, `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_ADDRESS`, `NEXT_PUBLIC_INSTAGRAM_URL` isteğe bağlı iletişim geçersiz kılmalarıdır. Bunlar ayarlanmazsa `src/data/brand.ts` içindeki marka bilgileri kullanılır.

4. Production için değişkenleri etkinleştirin; aynı Firebase projesiyle önizleme isteniyorsa Preview için de ekleyin. Ortam değişkeni ekleme veya değiştirme sonrası yeniden deploy edin. `NEXT_PUBLIC_` değerleri derleme sırasında tarayıcı paketine alınır.
5. Alan adı kesinleştiğinde `NEXT_PUBLIC_SITE_URL` değerini bu adresle güncelleyip tekrar deploy edin. Sitenin robots, canonical ve sitemap adresleri bu değeri kullanır. Vercel önizlemeleri indekslenmez.
6. `/`, `/blog`, `/galeri` ve `/admin/login` sayfalarını kontrol edin. Yönetim paneli Firebase Authentication hesabıyla açılır; yönetici şifresi bir Vercel ortam değişkeni değildir. Yönetici hesabı ve içerikler yeni Firebase projesinde hazırdır; yeniden seed çalıştırılması gerekmez.

Görseller Firestore `media` koleksiyonundan `/api/media/<id>` üzerinden okunur. Yeni görseller yönetim panelinde en fazla 2400 piksel ve 700 KiB olacak şekilde hazırlanır. Uygulamanın mevcut oturum ve medya akışı için Firebase Admin SDK özel anahtarı gerekmez.

Kaynaklar: [Vercel ortam değişkenleri](https://vercel.com/docs/environment-variables/managing-environment-variables), [Node.js sürümleri](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions), [Next.js ortam değişkenleri](https://nextjs.org/docs/app/guides/environment-variables).
