// Original photography supplied inside the client's brand presentation.
// These are visual references, not presented as before/after client results.
export type BrandPhoto = { id: string; title: string; type: string; width: number; height: number; maxWidth: number; alt: string; src?: string; recordId?: string; };
export const photos: BrandPhoto[] = [
  { id: 'hair-detail', title: 'Saç çizgisinde özen', type: 'Saç detayları', width: 1855, height: 2000, maxWidth: 1600, alt: 'Kurumsal kimlik seçkisinden saç çizgisi ve tarama detayı' },
  { id: 'textured-style', title: 'Kesim, doku ve geçiş', type: 'Stil seçkisi', width: 1050, height: 1369, maxWidth: 1050, alt: 'Kısa ve dokulu erkek saç stilini gösteren marka referans fotoğrafı' },
  { id: 'portrait', title: 'Kişisel bir duruş', type: 'Stil seçkisi', width: 1754, height: 2000, maxWidth: 1600, alt: 'Geriye taranmış erkek saç modeli, kurumsal kimlik fotoğrafı' },
  { id: 'atelier', title: 'Markanın detayları', type: 'Markamız', width: 1190, height: 1553, maxWidth: 1190, alt: 'Yakup Çakan logosuyla tasarlanmış profesyonel kuaför önlüğü' },
];

