import { doc, runTransaction, type DocumentReference } from 'firebase/firestore';
import { db } from './firebase';
import starter from '@/data/hair-content.json';
import { CONTENT_BRAND } from '@/data/brand';
export async function importStarterContent() {
  const entries: { ref: DocumentReference; data: Record<string, unknown> }[] = Object.entries(starter).flatMap(([collection, records]) => records.map(({ id, ...data }) => ({ ref: doc(db, collection, id), data })));
  entries.push({ ref: doc(db, 'haberler', 'yakup-cakan-content-state-v1'), data: { brand: CONTENT_BRAND, isActive: true, contentKind: 'site-state' } });
  return runTransaction(db, async transaction => {
    const existing = await Promise.all(entries.map(entry => transaction.get(entry.ref)));
    let added = 0;
    entries.forEach((entry, index) => { if (!existing[index].exists()) { transaction.set(entry.ref, { ...entry.data, updatedAt: new Date().toISOString() }); added++; } });
    return { added, skipped: entries.length - added };
  });
}
