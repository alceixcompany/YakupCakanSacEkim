# Yakup Çakan — görsel kaynakları

Tüm güncel marka varlıkları kullanıcının `/Users/umid/Downloads/yakup-cakan.zip` arşivinden alındı. Bu çalışma sırasında yeni görsel üretilmedi.

- `public/brand/`: orijinal logo, monogram ve yazı logosu.
- `public/images/editorial/`: saç detayı, dokulu stil, portre ve atölye fotoğrafları. ZIP’in 480/800 ve büyük WebP varyantları korunur.
- `public/images/results/`: üç önce/sonra çifti, 480/800/1122 WebP varyantları.
- `src/app/icon.png`: sağlanan monogram.

Referans fotoğrafları ZIP’teki açıklamalarla kullanılır. Dosyalar yereldir; ZIP’in harici çalışma ortamına bağımlılık yoktur. Önceki `public/parfum-bahari/` görselleri mevcut ürün backend’i için korunur.

ZIP’teki görsellerin tamamı artık yereldir: `public/reference-assets/` klasöründe hero konsepti, Instagram referansı ve altı yüksek çözünürlüklü önce/sonra PNG orijinali de korunur. `public/` altındaki üç SVG dahil 46 dosyanın kaynak yolu ve SHA-256 özeti `src/data/image-assets.json` içinde kayıtlıdır. Çalışan önizlemede `node scripts/check-images.mjs` tüm dosyaların kaynakla aynı olduğunu ve HTTP üzerinden resim olarak sunulduğunu doğrular.
