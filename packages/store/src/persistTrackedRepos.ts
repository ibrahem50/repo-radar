import type { TrackedRepoInfo } from './trackedReposSlice';

const STORAGE_KEY = 'repo-radar:tracked-repos';

export function loadTrackedReposFromStorage(): Record<string, TrackedRepoInfo> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    // Migrate old string[] format — drop it, can't reconstruct full data
    if (Array.isArray(parsed)) return {};
    if (typeof parsed === 'object' && parsed !== null) return parsed as Record<string, TrackedRepoInfo>;
    return {};
  } catch {
    return {};
  }
}

export function saveTrackedReposToStorage(repos: Record<string, TrackedRepoInfo>): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(repos));
  } catch {
    // Storage full or disabled — fail silently.
  }
}
