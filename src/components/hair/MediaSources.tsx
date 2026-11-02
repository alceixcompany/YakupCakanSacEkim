'use client';

import { createContext, useContext } from 'react';

const MediaSources = createContext<Record<string, string>>({});

export function MediaSourcesProvider({ sources, children }: { sources: Record<string, string>; children: React.ReactNode }) {
  return <MediaSources.Provider value={sources}>{children}</MediaSources.Provider>;
}

export function useMediaSource() {
  const sources = useContext(MediaSources);
  return (path: string) => sources[path] || path;
}
