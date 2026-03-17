export type EventCategory = 'workshop' | 'social' | 'food' | 'sports' | 'music' | 'talk' | 'hackathon' | 'other';

export interface Attendee {
  id: string;
  name: string;
  avatarUrl: string;
}

export type PosterType = 'student' | 'org' | 'host' | 'business';

export interface PosterIdentity {
  type: PosterType;
  orgName?: string;
  isVerified?: boolean;
  isHostMode?: boolean;
}

export interface HighlightMedia {
  id: string;
  eventId: string;
  eventTitle: string;
  uploadedBy: Attendee;
  type: 'photo' | 'video';
  color: string;
  caption?: string;
  uploadedAt: number;
  approved: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  time: string;
  location: string;
  note?: string;
  category: EventCategory;
  going: Attendee[];
  interested: Attendee[];
  createdAt: number;
  postedBy: Attendee;
  isPast?: boolean;
  actualAttendees?: number;
  highlightStat?: string;
  posterIdentity?: PosterIdentity;
  capacity?: number;
  pendingMedia?: HighlightMedia[];
  approvedMedia?: HighlightMedia[];
}

export type AppTab = 'feed' | 'myevents' | 'friends' | 'highlights' | 'profile';
export type ThemeMode = 'light' | 'dark';

export type FeedMode = 'trending' | 'friends' | 'foryou';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'latenight';

export interface UserPrefs {
  role: 'host' | 'attendee';
  favoriteCategories: EventCategory[];
  preferredTimes: TimeOfDay[];
}

export interface EngagementCounts {
  categories: Partial<Record<EventCategory, number>>;
  timeBuckets: Partial<Record<TimeOfDay, number>>;
}

export interface CurrentUser {
  id: string;
  name: string;
  avatarUrl: string;
}

export const CATEGORY_CONFIG: Record<EventCategory, { label: string; gradient: string; color: string; bg: string }> = {
  workshop: { label: 'Workshop', gradient: '#6C63FF', color: '#6C63FF', bg: '#EEEAFF' },
  social: { label: 'Social', gradient: '#6C63FF', color: '#6C63FF', bg: '#EEEAFF' },
  food: { label: 'Food & Drinks', gradient: '#3B82F6', color: '#3B82F6', bg: '#EDF4FF' },
  sports: { label: 'Sports', gradient: '#10B981', color: '#10B981', bg: '#EDFAF5' },
  music: { label: 'Music', gradient: '#6C63FF', color: '#6C63FF', bg: '#EEEAFF' },
  talk: { label: 'Talk', gradient: '#5B52E6', color: '#5B52E6', bg: '#EEEBFF' },
  hackathon: { label: 'Hackathon', gradient: '#6C63FF', color: '#6C63FF', bg: '#EEEAFF' },
  other: { label: 'Other', gradient: '#6C63FF', color: '#6C63FF', bg: '#EEEAFF' },
};
