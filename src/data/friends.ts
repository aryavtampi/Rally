import { Attendee } from '../types';

export const INITIAL_FRIEND_IDS: Set<string> = new Set([
  'u1', // Alex Chen
  'u3', // Sam Rivera
  'u5', // Taylor Kim
  'u7', // Riley Morgan
]);

// Keep backward-compat alias
export const FRIEND_IDS = INITIAL_FRIEND_IDS;

export const SEED_USERS: Attendee[] = [
  { id: 'u1', name: 'Alex Chen', avatarUrl: '' },
  { id: 'u2', name: 'Maya Johnson', avatarUrl: '' },
  { id: 'u3', name: 'Sam Rivera', avatarUrl: '' },
  { id: 'u4', name: 'Jordan Lee', avatarUrl: '' },
  { id: 'u5', name: 'Taylor Kim', avatarUrl: '' },
  { id: 'u6', name: 'Casey Park', avatarUrl: '' },
  { id: 'u7', name: 'Riley Morgan', avatarUrl: '' },
  { id: 'u8', name: 'Dana White', avatarUrl: '' },
  { id: 'u9', name: 'Jamie Fox', avatarUrl: '' },
];
