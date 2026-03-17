import { UserPrefs, EngagementCounts, EventCategory, TimeOfDay } from '../types';

const PREFS_KEY      = 'rally_user_prefs';
const ENGAGEMENT_KEY = 'rally_engagement';

// ── UserPrefs helpers ─────────────────────────────────────────────────────────

export function getUserPrefs(): UserPrefs | null {
  try {
    const r = localStorage.getItem(PREFS_KEY);
    return r ? (JSON.parse(r) as UserPrefs) : null;
  } catch {
    return null;
  }
}

export function saveUserPrefs(prefs: UserPrefs): void {
  try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch {}
}

export function hasCompletedOnboarding(): boolean {
  return getUserPrefs() !== null;
}

// ── Engagement helpers ────────────────────────────────────────────────────────

export function getEngagementCounts(): EngagementCounts {
  try {
    const r = localStorage.getItem(ENGAGEMENT_KEY);
    return r ? (JSON.parse(r) as EngagementCounts) : { categories: {}, timeBuckets: {} };
  } catch {
    return { categories: {}, timeBuckets: {} };
  }
}

export function incrementEngagement(category: EventCategory, timeBucket: TimeOfDay): void {
  try {
    const c = getEngagementCounts();
    c.categories[category]    = (c.categories[category]    ?? 0) + 1;
    c.timeBuckets[timeBucket] = (c.timeBuckets[timeBucket] ?? 0) + 1;
    localStorage.setItem(ENGAGEMENT_KEY, JSON.stringify(c));
  } catch {}
}

// ── Reset helper ─────────────────────────────────────────────────────────────

export function clearAllData(): void {
  try {
    localStorage.removeItem(PREFS_KEY);
    localStorage.removeItem(ENGAGEMENT_KEY);
  } catch {}
}

// ── Time bucket utility ───────────────────────────────────────────────────────

export function getTimeBucket(isoString: string): TimeOfDay {
  const h = new Date(isoString).getHours();
  if (h >= 6  && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 21) return 'evening';
  return 'latenight';
}
