import { cache } from 'react';
import { CONTENT_SOURCE } from '@/lib/contentSource';

// Only same-origin, immutable media URLs can replace the original ZIP assets.
export const getImageManifest = cache(async (): Promise<Record<string, string>> => {
  const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (CONTENT_SOURCE === 'static' || !project || !key) return {};
  try {
    const response = await fetch(`https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/contact_info/yakup-cakan-media-manifest-v1?key=${encodeURIComponent(key)}`, { cache: 'no-store', signal: AbortSignal.timeout(8000) });
    if (!response.ok) return {};
    const doc = await response.json() as { fields?: { images?: { mapValue?: { fields?: Record<string, { stringValue?: string }> } } } };
    return Object.fromEntries(Object.entries(doc.fields?.images?.mapValue?.fields || {}).flatMap(([path, value]) => path.startsWith('/') && /^\/api\/media\/[a-f0-9-]{36}$/.test(value.stringValue || '') ? [[path, value.stringValue!]] : []));
  } catch { return {}; }
});
