export type Article = {
  slug: string; title: string; category: string; excerpt: string; image: number; cover?: import('./media').BrandPhoto; featured?: boolean;
  sections: { title: string; paragraphs: string[] }[];
};
export const articles: Article[] = [
  {
    slug: 'ilk-gorusme-rehberi', title: 'İlk görüşme, doğru sorularla başlar.', category: 'Başlangıç rehberi', image: 3,
    excerpt: 'Beklentilerinizden günlük alışkanlıklarınıza: ilk görüşmenize hazırlanmak için kısa bir rehber.',
    sections: [
      { title: 'Önce nasıl hissetmek istediğinizi konuşalım', paragraphs: ['İlk görüşmede bir model seçmek zorunda değilsiniz. Görünümünüzde neyi değiştirmek istediğinizi ve neleri korumayı önemsediğinizi anlatmanız iyi bir başlangıçtır. Daha önce beğendiğiniz saç kesimlerinin fotoğraflarını getirebilirsiniz.', 'Fotoğrafları birebir bir sonuç beklentisi olarak değil, tarzınızı anlatmanın bir yolu olarak kullanın. Saç rengi, yoğunluk ve kesim birlikte değerlendirildiğinde size ait bir görünüm üzerine konuşmak kolaylaşır.'] },
      { title: 'Günlük hayatınız da tasarımın bir parçası', paragraphs: ['Sabah hazırlanmaya ne kadar zaman ayırıyorsunuz? Daha düzenli bir stil mi, rahat bir görünüm mü seviyorsunuz? İşiniz, sık seyahat etmeniz ve şekillendirme alışkanlıklarınız, görüşmede paylaşabileceğiniz detaylardır.', 'Ekibe, uygulama sonrasındaki bakımın nasıl planlandığını ve evde hangi adımları takip etmeniz gerektiğini de sorabilirsiniz. Böylece yalnızca ilk günün görünümünü değil, sonraki süreci de konuşmuş olursunuz.'] },
      { title: 'Karar vermeden önce netleştirin', paragraphs: ['Tercih edilen sistemin özelliklerini, uygulamanın kapsamını, bakım planını ve fiyatlandırmaya nelerin dahil olduğunu öğrenin. Aklınızda kalan soruları not etmek, görüşmeden daha net bir fikirle ayrılmanıza yardımcı olur.', 'Yakup Çakan merkezinde ön görüşme planlamak için iletişim sayfamızdan bir WhatsApp mesajı hazırlayabilirsiniz. Randevu günü ve saati ekibimizin teyidiyle kesinleşir.'] },
    ],
  },
  {
    slug: 'sana-ait-bir-sac-stili', title: 'İyi bir kesim, seni anlatır.', category: 'Stil & görünüm', image: 1,
    excerpt: 'Kopyalanmış bir modelden, kendinize ait bir görünüme. Stil görüşmesinde konuşabileceğiniz detaylar.',
    sections: [
      { title: 'Referans verin, kendinize uyarlayın', paragraphs: ['Beğendiğiniz bir kesim, konuşmaya başlamak için iyi bir referanstır. O kesimde sizi etkileyen şeyin ne olduğunu düşünün: üst bölümün hacmi, yanların kısalığı veya saçın hareketi olabilir.', 'Yüzünüzde öne çıkarmak istediğiniz detayları ve günlük giyim tarzınızı paylaşın. Bir modelin kendi görünümünüzle nasıl bütünleşeceğini birlikte değerlendirmek, seçenekleri daraltmayı kolaylaştırır.'] },
      { title: 'Yoğunluk, renk ve geçişler', paragraphs: ['Görünüm yalnızca saçın uzunluğundan oluşmaz. Renk, yoğunluk, yön ve yan bölümlerle geçiş de toplam etkiyi belirler. Görüşmede bu detayları ayrı ayrı ele alabilirsiniz.', 'Farklı açılardan nasıl bir görünüm istediğinizi anlatın. Saçınızı geriye taramayı sevmenizle öne doğru kullanmanız arasında, kesim planını etkileyebilecek stil farkları vardır.'] },
      { title: 'Günlük rutininize yer açın', paragraphs: ['Her gün aynı özeni göstermek isteyip istemediğinizi açıkça konuşun. Daha az şekillendirme gerektiren bir stil tercih ediyorsanız bunu en başta belirtin.', 'Kesim sonrası nasıl şekil vereceğinizi merkezde görerek öğrenebilir, kullanacağınız ürünleri ve uygulama adımlarını ekibimize sorabilirsiniz.'] },
    ],
  },
  {
    slug: 'bakim-randevusuna-hazirlik', title: 'Bakım da deneyimin bir parçası.', category: 'Bakım notları', image: 0,
    excerpt: 'Bakım randevularınızı planlarken not alabileceğiniz sorular ve süreci kolaylaştıran küçük alışkanlıklar.',
    sections: [
      { title: 'Size özel bir takvim oluşturun', paragraphs: ['Bakım aralıklarını herkes için tek bir takvimle belirlemek yerine, kullanılan sistemin özelliklerini ve kendi kullanımınızı ekibinizle konuşun. İlk uygulama sonrasında sonraki görüşmenin nasıl planlanacağını öğrenin.', 'Randevuyu unutmamak için telefonunuza bir hatırlatıcı ekleyebilir; seyahat veya yoğun iş dönemleriniz varsa bunları önceden paylaşabilirsiniz.'] },
      { title: 'Deneyiminizi not edin', paragraphs: ['Saçınızı şekillendirirken zorlandığınız bir nokta, merak ettiğiniz bir ürün veya değiştirmek istediğiniz bir detay varsa not alın. Bakım randevusu, bu konuları yeniden değerlendirmek için de bir fırsattır.', 'Kendi sisteminize uygun olmayan genel öneriler yerine, uygulamanızı yapan ekibin size verdiği bakım planını esas alın. Ürün ve uygulama sorularınızı doğrudan ekibe iletin.'] },
      { title: 'Görüşmede sorabilecekleriniz', paragraphs: ['Evde bakım adımları nasıl olmalı? Hangi ürünleri kullanmalıyım? Bir sonraki görüşmede hangi işlemler yapılacak? Fiyatlandırmaya neler dahil? Sorularınızı önceden hazırlamak, zamanı daha verimli kullanmanızı sağlar.', 'Bakım randevusu veya mevcut planınız hakkında bilgi için telefon ya da WhatsApp üzerinden bize ulaşabilirsiniz.'] },
    ],
  },
];
export const readingTime = (article: Article) => Math.max(1, Math.ceil(article.sections.flatMap(s => [s.title, ...s.paragraphs]).join(' ').split(/\s+/).length / 180));
