import React, { useState, useRef } from 'react';
import { EventItem, CurrentUser, Attendee, EventCategory, AppTab, FeedMode, HighlightMedia, UserPrefs, EngagementCounts } from './types';
import { useTheme } from './contexts/ThemeContext';
import { INITIAL_FRIEND_IDS, SEED_USERS } from './data/friends';
import { getUserPrefs, saveUserPrefs, getEngagementCounts, incrementEngagement, getTimeBucket, clearAllData } from './utils/userPrefs';
import FriendsView from './components/FriendsView';
import EventFeed from './components/EventFeed';
import CreateEventModal from './components/CreateEventModal';
import UserAvatar from './components/UserAvatar';
import BottomNav from './components/BottomNav';
import MyEventsView from './components/MyEventsView';
import ProfileView from './components/ProfileView';
import Toast from './components/Toast';
import EventDetailModal from './components/EventDetailModal';
import HighlightsTab from './components/HighlightsTab';
import MediaUploadSheet from './components/MediaUploadSheet';
import OnboardingFlow from './components/OnboardingFlow';

const CURRENT_USER: CurrentUser = {
  id: 'user-me',
  name: 'Aryav Tampi',
  avatarUrl: '',
};

const SEED_ATTENDEES: Attendee[] = [
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

const now = new Date();
const hour = (h: number, m: number = 0, daysOffset: number = 0) => {
  const d = new Date(now);
  d.setDate(d.getDate() + daysOffset);
  d.setHours(h, m, 0, 0);
  if (daysOffset === 0 && d < now) d.setDate(d.getDate() + 1);
  return d.toISOString();
};

const SEED_EVENTS: EventItem[] = [
  {
    id: 'e1',
    title: 'Shark Tank Competition',
    time: hour(18, 0),
    location: 'Tarbutton Hall',
    category: 'talk',
    going: [SEED_ATTENDEES[0], SEED_ATTENDEES[1], SEED_ATTENDEES[2], SEED_ATTENDEES[3], SEED_ATTENDEES[7]],
    interested: [SEED_ATTENDEES[4]],
    createdAt: Date.now() - 3600000,
    postedBy: SEED_ATTENDEES[0],
    posterIdentity: { type: 'org', orgName: 'Oxventures', isVerified: true },
  },
  {
    id: 'e2',
    title: 'OxStudies: Exam Prep Workshop',
    time: hour(14, 0),
    location: 'Few Hall',
    category: 'workshop',
    going: [SEED_ATTENDEES[1], SEED_ATTENDEES[5], SEED_ATTENDEES[8]],
    interested: [SEED_ATTENDEES[0], SEED_ATTENDEES[3], SEED_ATTENDEES[6]],
    createdAt: Date.now() - 7200000,
    postedBy: SEED_ATTENDEES[1],
  },
  {
    id: 'e3',
    title: 'Oxventures Guest Speaker: Startup Life',
    time: hour(17, 0),
    location: 'Humanities Hall',
    category: 'talk',
    going: [SEED_ATTENDEES[2], SEED_ATTENDEES[4], SEED_ATTENDEES[6], SEED_ATTENDEES[8]],
    interested: [SEED_ATTENDEES[0], SEED_ATTENDEES[5]],
    createdAt: Date.now() - 1800000,
    postedBy: SEED_ATTENDEES[2],
    posterIdentity: { type: 'org', orgName: 'Oxventures', isVerified: true },
  },
  {
    id: 'e4',
    title: 'Calc 2 Final Review Session',
    time: hour(19, 0),
    location: 'Science Building',
    category: 'workshop',
    going: [SEED_ATTENDEES[0], SEED_ATTENDEES[3], SEED_ATTENDEES[5], SEED_ATTENDEES[6], SEED_ATTENDEES[2], SEED_ATTENDEES[8]],
    interested: [SEED_ATTENDEES[1]],
    createdAt: Date.now() - 600000,
    postedBy: SEED_ATTENDEES[3],
  },
  {
    id: 'e5',
    title: 'Asian Culture Club Cook-Off',
    time: hour(12, 0),
    location: 'Jolley Commons',
    category: 'food',
    going: [SEED_ATTENDEES[4], SEED_ATTENDEES[6], SEED_ATTENDEES[1], SEED_ATTENDEES[7]],
    interested: [SEED_ATTENDEES[0], SEED_ATTENDEES[3]],
    createdAt: Date.now() - 5400000,
    postedBy: SEED_ATTENDEES[4],
    posterIdentity: { type: 'org', orgName: 'Asian Culture Club', isVerified: true },
  },
  {
    id: 'e6',
    title: 'Oxford College Basketball: Freshman Night',
    time: hour(16, 30),
    location: 'Williams Gymnasium',
    category: 'sports',
    going: [SEED_ATTENDEES[0], SEED_ATTENDEES[2], SEED_ATTENDEES[5], SEED_ATTENDEES[8]],
    interested: [SEED_ATTENDEES[1], SEED_ATTENDEES[3]],
    createdAt: Date.now() - 900000,
    postedBy: SEED_ATTENDEES[5],
    posterIdentity: { type: 'org', orgName: 'Oxford College Basketball', isVerified: true },
  },
  {
    id: 'e7',
    title: 'Ski Themed Party',
    time: hour(20, 0, 1),
    location: 'Phi Gamma Hall',
    category: 'social',
    going: [SEED_ATTENDEES[1], SEED_ATTENDEES[3], SEED_ATTENDEES[7], SEED_ATTENDEES[0], SEED_ATTENDEES[2], SEED_ATTENDEES[5], SEED_ATTENDEES[8], SEED_ATTENDEES[4], SEED_ATTENDEES[6],
      { id: 'u10', name: 'Chris Evans', avatarUrl: '' },
      { id: 'u11', name: 'Pat Sullivan', avatarUrl: '' },
      { id: 'u12', name: 'Morgan Blake', avatarUrl: '' },
      { id: 'u13', name: 'Avery Scott', avatarUrl: '' },
      { id: 'u14', name: 'Quinn Torres', avatarUrl: '' },
      { id: 'u15', name: 'Drew Patel', avatarUrl: '' },
      { id: 'u16', name: 'Sage Williams', avatarUrl: '' },
      { id: 'u17', name: 'Reese Cooper', avatarUrl: '' },
      { id: 'u18', name: 'Ellis Grant', avatarUrl: '' },
      { id: 'u19', name: 'Lane Fisher', avatarUrl: '' },
      { id: 'u20', name: 'Finley Ross', avatarUrl: '' },
      { id: 'u21', name: 'Rowan Price', avatarUrl: '' },
      { id: 'u22', name: 'Blair Murphy', avatarUrl: '' },
      { id: 'u23', name: 'Emery Walsh', avatarUrl: '' },
      { id: 'u24', name: 'Haven Brooks', avatarUrl: '' },
      { id: 'u25', name: 'Skyler Reed', avatarUrl: '' },
      { id: 'u26', name: 'Oakley James', avatarUrl: '' },
      { id: 'u27', name: 'Lennox Hart', avatarUrl: '' },
      { id: 'u28', name: 'River Stone', avatarUrl: '' },
      { id: 'u29', name: 'Phoenix Cole', avatarUrl: '' },
      { id: 'u30', name: 'Harley Quinn', avatarUrl: '' },
      { id: 'u31', name: 'Indigo Fox', avatarUrl: '' },
      { id: 'u32', name: 'Wren Carter', avatarUrl: '' },
      { id: 'u33', name: 'Briar Rose', avatarUrl: '' },
      { id: 'u34', name: 'Lake Morrison', avatarUrl: '' },
      { id: 'u35', name: 'Storm Davis', avatarUrl: '' },
      { id: 'u36', name: 'Echo Wang', avatarUrl: '' },
      { id: 'u37', name: 'Ash Taylor', avatarUrl: '' },
      { id: 'u38', name: 'Zephyr Klein', avatarUrl: '' },
      { id: 'u39', name: 'Onyx Bell', avatarUrl: '' },
      { id: 'u40', name: 'Vale Kim', avatarUrl: '' },
      { id: 'u41', name: 'Slate Young', avatarUrl: '' },
      { id: 'u42', name: 'Dune Harris', avatarUrl: '' },
      { id: 'u43', name: 'Frost Chen', avatarUrl: '' },
      { id: 'u44', name: 'Peak Anderson', avatarUrl: '' },
      { id: 'u45', name: 'Cliff Weber', avatarUrl: '' },
    ],
    interested: [{ id: 'u46', name: 'Moss Green', avatarUrl: '' }, { id: 'u47', name: 'Bay Miller', avatarUrl: '' }],
    createdAt: Date.now() - 300000,
    postedBy: SEED_ATTENDEES[3],
    posterIdentity: { type: 'org', orgName: 'Italian Culture Club', isVerified: true },
  },
  {
    id: 'e8',
    title: 'SGA Town Hall Meeting',
    time: hour(11, 0, 2),
    location: 'Candler Hall',
    category: 'social',
    going: [SEED_ATTENDEES[2], SEED_ATTENDEES[4], SEED_ATTENDEES[6], SEED_ATTENDEES[8]],
    interested: [SEED_ATTENDEES[0], SEED_ATTENDEES[5], SEED_ATTENDEES[7]],
    createdAt: Date.now() - 7200000,
    postedBy: SEED_ATTENDEES[6],
    posterIdentity: { type: 'org', orgName: 'SGA', isVerified: true },
  },
  {
    id: 'e9',
    title: 'College Night: Half-Price Wings',
    time: hour(19, 30, 1),
    location: 'The Depot Sports Bar & Grill',
    category: 'food',
    going: [SEED_ATTENDEES[4], SEED_ATTENDEES[8],
      { id: 'u140', name: 'Cleo Archer', avatarUrl: '' },
      { id: 'u141', name: 'Miles Payne', avatarUrl: '' },
      { id: 'u142', name: 'Ada Whitfield', avatarUrl: '' },
      { id: 'u143', name: 'Bodhi Greene', avatarUrl: '' },
      { id: 'u144', name: 'Elise Langley', avatarUrl: '' },
      { id: 'u145', name: 'Jasper Cain', avatarUrl: '' },
    ],
    interested: [SEED_ATTENDEES[0], SEED_ATTENDEES[2], SEED_ATTENDEES[3], SEED_ATTENDEES[5], SEED_ATTENDEES[7]],
    createdAt: Date.now() - 4800000,
    postedBy: { id: 'biz-1', name: 'The Depot Sports Bar & Grill', avatarUrl: '' },
    posterIdentity: { type: 'business', orgName: 'The Depot Sports Bar & Grill', isHostMode: true },
    capacity: 30,
  },
  {
    id: 'e10',
    title: 'Trivia Night at Mystic Grill',
    time: hour(20, 0, 2),
    location: 'Mystic Grill, Covington',
    category: 'social',
    going: [SEED_ATTENDEES[0], SEED_ATTENDEES[2], SEED_ATTENDEES[5], SEED_ATTENDEES[7],
      { id: 'u110', name: 'Niko Reyes', avatarUrl: '' },
      { id: 'u111', name: 'Talia Marsh', avatarUrl: '' },
      { id: 'u112', name: 'Cyrus Webb', avatarUrl: '' },
      { id: 'u113', name: 'Mila Thornton', avatarUrl: '' },
      { id: 'u114', name: 'Dex Calloway', avatarUrl: '' },
      { id: 'u115', name: 'Ari Vasquez', avatarUrl: '' },
      { id: 'u116', name: 'Ronan Bright', avatarUrl: '' },
      { id: 'u117', name: 'Zara Finch', avatarUrl: '' },
      { id: 'u118', name: 'Leo Stanton', avatarUrl: '' },
      { id: 'u119', name: 'Gemma Knox', avatarUrl: '' },
      { id: 'u120', name: 'Felix Park', avatarUrl: '' },
      { id: 'u121', name: 'Lena Cho', avatarUrl: '' },
      { id: 'u122', name: 'Mateo Vega', avatarUrl: '' },
      { id: 'u123', name: 'Ivy Dunn', avatarUrl: '' },
    ],
    interested: [SEED_ATTENDEES[1], SEED_ATTENDEES[4], SEED_ATTENDEES[6], SEED_ATTENDEES[8]],
    createdAt: Date.now() - 2400000,
    postedBy: { id: 'biz-2', name: 'Mystic Grill', avatarUrl: '' },
    posterIdentity: { type: 'business', orgName: 'Mystic Grill', isHostMode: true },
    capacity: 40,
  },
  {
    id: 'e11',
    title: 'Pasta & Study',
    time: hour(21, 0, 1),
    location: 'Amici Italian Cafe, Covington',
    category: 'food',
    going: [SEED_ATTENDEES[1], SEED_ATTENDEES[3], SEED_ATTENDEES[6],
      { id: 'u130', name: 'Juno Welles', avatarUrl: '' },
      { id: 'u131', name: 'Kai Odom', avatarUrl: '' },
      { id: 'u132', name: 'Thea Rios', avatarUrl: '' },
      { id: 'u133', name: 'Ezra Lund', avatarUrl: '' },
      { id: 'u134', name: 'Nina Ashford', avatarUrl: '' },
      { id: 'u135', name: 'Oscar Delgado', avatarUrl: '' },
      { id: 'u136', name: 'Wren Hadley', avatarUrl: '' },
      { id: 'u137', name: 'Soren Blake', avatarUrl: '' },
      { id: 'u138', name: 'Petra Mills', avatarUrl: '' },
    ],
    interested: [SEED_ATTENDEES[0], SEED_ATTENDEES[5], SEED_ATTENDEES[8]],
    createdAt: Date.now() - 3600000,
    postedBy: { id: 'biz-3', name: 'Amici Italian Cafe', avatarUrl: '' },
    posterIdentity: { type: 'business', orgName: 'Amici Italian Cafe', isHostMode: true },
    capacity: 30,
  },
  {
    id: 'e12',
    title: 'Free Coffee Sampling',
    time: hour(8, 0, 3),
    location: 'Bread and Butter, Covington',
    category: 'food',
    going: [SEED_ATTENDEES[0], SEED_ATTENDEES[1], SEED_ATTENDEES[3], SEED_ATTENDEES[5], SEED_ATTENDEES[7], SEED_ATTENDEES[8],
      { id: 'u50', name: 'Kai Bennett', avatarUrl: '' },
      { id: 'u51', name: 'Nova Clark', avatarUrl: '' },
      { id: 'u52', name: 'Jules Martin', avatarUrl: '' },
      { id: 'u53', name: 'Sage Thompson', avatarUrl: '' },
      { id: 'u54', name: 'Rain Alvarez', avatarUrl: '' },
      { id: 'u55', name: 'Aero Nguyen', avatarUrl: '' },
      { id: 'u56', name: 'Lyric Patel', avatarUrl: '' },
      { id: 'u57', name: 'Ember Cruz', avatarUrl: '' },
      { id: 'u58', name: 'Sol Rivera', avatarUrl: '' },
      { id: 'u59', name: 'Cove Mitchell', avatarUrl: '' },
      { id: 'u60', name: 'Blaze Foster', avatarUrl: '' },
      { id: 'u61', name: 'Coral Hughes', avatarUrl: '' },
      { id: 'u62', name: 'Flint Sanders', avatarUrl: '' },
      { id: 'u63', name: 'Pearl Ortiz', avatarUrl: '' },
      { id: 'u64', name: 'Reed Gonzalez', avatarUrl: '' },
      { id: 'u65', name: 'Cedar Park', avatarUrl: '' },
      { id: 'u66', name: 'Harbor Lee', avatarUrl: '' },
      { id: 'u67', name: 'Dew Garcia', avatarUrl: '' },
      { id: 'u68', name: 'Fern Wood', avatarUrl: '' },
      { id: 'u69', name: 'Glen Hayes', avatarUrl: '' },
      { id: 'u70', name: 'Ivy Torres', avatarUrl: '' },
      { id: 'u71', name: 'Jade Phillips', avatarUrl: '' },
      { id: 'u72', name: 'Kit Morgan', avatarUrl: '' },
      { id: 'u73', name: 'Lark Bailey', avatarUrl: '' },
      { id: 'u74', name: 'Maple Stewart', avatarUrl: '' },
      { id: 'u75', name: 'North Collins', avatarUrl: '' },
      { id: 'u76', name: 'Olive Price', avatarUrl: '' },
      { id: 'u77', name: 'Pike Russell', avatarUrl: '' },
      { id: 'u78', name: 'Quill Edwards', avatarUrl: '' },
      { id: 'u79', name: 'Spruce Barnes', avatarUrl: '' },
      { id: 'u80', name: 'Tide Brooks', avatarUrl: '' },
      { id: 'u81', name: 'Umber Ray', avatarUrl: '' },
      { id: 'u82', name: 'Vine Kelly', avatarUrl: '' },
      { id: 'u83', name: 'Wilder Scott', avatarUrl: '' },
      { id: 'u84', name: 'Birch Adams', avatarUrl: '' },
      { id: 'u85', name: 'Clove Baker', avatarUrl: '' },
      { id: 'u86', name: 'Drift Campbell', avatarUrl: '' },
      { id: 'u87', name: 'Elm Carter', avatarUrl: '' },
      { id: 'u88', name: 'Flax Davidson', avatarUrl: '' },
      { id: 'u89', name: 'Grove Ellis', avatarUrl: '' },
      { id: 'u90', name: 'Heath Fisher', avatarUrl: '' },
      { id: 'u91', name: 'Iris Grant', avatarUrl: '' },
      { id: 'u92', name: 'Juniper Hill', avatarUrl: '' },
      { id: 'u93', name: 'Kelp Irving', avatarUrl: '' },
      { id: 'u94', name: 'Lotus James', avatarUrl: '' },
      { id: 'u95', name: 'Marsh King', avatarUrl: '' },
      { id: 'u96', name: 'Noel Lambert', avatarUrl: '' },
      { id: 'u97', name: 'Opal Morris', avatarUrl: '' },
      { id: 'u98', name: 'Palm Newman', avatarUrl: '' },
      { id: 'u99', name: 'Quarry Owen', avatarUrl: '' },
      { id: 'u100', name: 'Rustic Perry', avatarUrl: '' },
      { id: 'u101', name: 'Shale Quinn', avatarUrl: '' },
      { id: 'u102', name: 'Thorn Reed', avatarUrl: '' },
      { id: 'u103', name: 'Umber Sage', avatarUrl: '' },
      { id: 'u104', name: 'Vale Thomas', avatarUrl: '' },
      { id: 'u105', name: 'Wynn Underwood', avatarUrl: '' },
      { id: 'u106', name: 'Yarrow Vance', avatarUrl: '' },
    ],
    interested: [SEED_ATTENDEES[2], SEED_ATTENDEES[4], SEED_ATTENDEES[6]],
    createdAt: Date.now() - 1200000,
    postedBy: { id: 'biz-4', name: 'Bread and Butter', avatarUrl: '' },
    posterIdentity: { type: 'business', orgName: 'Bread and Butter', isHostMode: true },
    capacity: 80,
  },
  {
    id: 'e-past-1',
    title: 'Fall Welcome Mixer',
    time: hour(18, 0, -3),
    location: 'Jolley Commons',
    category: 'social',
    going: [SEED_ATTENDEES[0], SEED_ATTENDEES[1], SEED_ATTENDEES[2], SEED_ATTENDEES[3], SEED_ATTENDEES[4], SEED_ATTENDEES[6], SEED_ATTENDEES[7]],
    interested: [],
    createdAt: Date.now() - 86400000 * 4,
    postedBy: SEED_ATTENDEES[1],
    isPast: true,
    actualAttendees: 12,
    highlightStat: 'Best dressed: Maya Johnson',
    approvedMedia: [
      { id: 'm-p1-1', eventId: 'e-past-1', eventTitle: 'Fall Welcome Mixer', uploadedBy: SEED_ATTENDEES[0], type: 'photo', color: '#6C63FF', uploadedAt: Date.now() - 86400000 * 3, approved: true },
      { id: 'm-p1-2', eventId: 'e-past-1', eventTitle: 'Fall Welcome Mixer', uploadedBy: SEED_ATTENDEES[2], type: 'video', color: '#10B981', uploadedAt: Date.now() - 86400000 * 3 + 3600000, approved: true },
      { id: 'm-p1-3', eventId: 'e-past-1', eventTitle: 'Fall Welcome Mixer', uploadedBy: SEED_ATTENDEES[4], type: 'photo', color: '#EC4899', uploadedAt: Date.now() - 86400000 * 2, approved: true },
    ],
  },
  {
    id: 'e-past-2',
    title: 'Hackathon Demo Day',
    time: hour(14, 0, -5),
    location: 'Tarbutton Hall',
    category: 'hackathon',
    going: [SEED_ATTENDEES[0], SEED_ATTENDEES[2], SEED_ATTENDEES[3], SEED_ATTENDEES[5], SEED_ATTENDEES[6], SEED_ATTENDEES[8]],
    interested: [],
    createdAt: Date.now() - 86400000 * 6,
    postedBy: { id: 'user-me', name: 'Aryav Tampi', avatarUrl: '' },
    isPast: true,
    actualAttendees: 24,
    highlightStat: 'Winner: Team NightOwl',
    approvedMedia: [
      { id: 'm-p2-1', eventId: 'e-past-2', eventTitle: 'Hackathon Demo Day', uploadedBy: SEED_ATTENDEES[2], type: 'photo', color: '#F59E0B', uploadedAt: Date.now() - 86400000 * 5, approved: true },
      { id: 'm-p2-2', eventId: 'e-past-2', eventTitle: 'Hackathon Demo Day', uploadedBy: SEED_ATTENDEES[5], type: 'video', color: '#3B82F6', uploadedAt: Date.now() - 86400000 * 5 + 7200000, approved: true },
    ],
    pendingMedia: [
      { id: 'm-p2-3', eventId: 'e-past-2', eventTitle: 'Hackathon Demo Day', uploadedBy: SEED_ATTENDEES[3], type: 'photo', color: '#8B5CF6', uploadedAt: Date.now() - 3600000 * 2, approved: false },
      { id: 'm-p2-4', eventId: 'e-past-2', eventTitle: 'Hackathon Demo Day', uploadedBy: SEED_ATTENDEES[6], type: 'video', color: '#EF4444', uploadedAt: Date.now() - 3600000, approved: false },
    ],
  },
];

const App: React.FC = () => {
  const phoneFrameRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<EventItem[]>(SEED_EVENTS);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [toast, setToast] = useState<{ message: string; emoji: string } | null>(null);
  const [friendIds, setFriendIds] = useState<Set<string>>(new Set(INITIAL_FRIEND_IDS));
  const [uploadTarget, setUploadTarget] = useState<EventItem | null>(null);
  const [userPrefs, setUserPrefs] = useState<UserPrefs | null>(() => getUserPrefs());
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => getUserPrefs() === null);
  const [feedMode, setFeedMode] = useState<FeedMode>('trending');
  const [engagement, setEngagement] = useState<EngagementCounts>(() => getEngagementCounts());
  const [activeTab, setActiveTab] = useState<AppTab>(() => {
    const p = getUserPrefs();
    if (!p) return 'feed';
    return p.role === 'host' ? 'profile' : 'feed';
  });

  const userRole = userPrefs?.role ?? 'attendee';
  const { colors, isDark } = useTheme();

  const handleOnboardingComplete = (prefs: UserPrefs) => {
    saveUserPrefs(prefs);
    setUserPrefs(prefs);
    setShowOnboarding(false);
    if (prefs.role === 'host') {
      setFeedMode('foryou');
      setActiveTab('profile');
    } else {
      setFeedMode('friends');
      setActiveTab('feed');
    }
  };

  const handleResetDemo = () => {
    clearAllData();
    setUserPrefs(null);
    setEngagement({ categories: {}, timeBuckets: {} });
    setEvents(SEED_EVENTS);
    setFriendIds(new Set(INITIAL_FRIEND_IDS));
    setFeedMode('trending');
    setSelectedEvent(null);
    setShowCreate(false);
    setUploadTarget(null);

    setToast({ message: 'Demo reset. Restarting as a new user\u2026', emoji: '' });
    setTimeout(() => {
      setToast(null);
      setShowOnboarding(true);
      setActiveTab('feed');
    }, 1200);
  };

  const handleToggleFriend = (userId: string) => {
    setFriendIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const trackEngagement = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      const bucket = getTimeBucket(event.time);
      incrementEngagement(event.category, bucket);
      setEngagement(getEngagementCounts());
    }
  };

  const handleGoing = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    const alreadyGoing = event?.going.some((a) => a.id === CURRENT_USER.id);
    if (!alreadyGoing) {
      trackEngagement(eventId);
    }
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e;
        const isGoing = e.going.some((a) => a.id === CURRENT_USER.id);
        if (isGoing) {
          return { ...e, going: e.going.filter((a) => a.id !== CURRENT_USER.id) };
        }
        return {
          ...e,
          going: [...e.going, { id: CURRENT_USER.id, name: CURRENT_USER.name, avatarUrl: CURRENT_USER.avatarUrl }],
          interested: e.interested.filter((a) => a.id !== CURRENT_USER.id),
        };
      })
    );
  };

  const handleInterested = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    const alreadyInterested = event?.interested.some((a) => a.id === CURRENT_USER.id);
    if (!alreadyInterested) {
      trackEngagement(eventId);
    }
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e;
        const isInterested = e.interested.some((a) => a.id === CURRENT_USER.id);
        if (isInterested) {
          return { ...e, interested: e.interested.filter((a) => a.id !== CURRENT_USER.id) };
        }
        return {
          ...e,
          interested: [
            ...e.interested,
            { id: CURRENT_USER.id, name: CURRENT_USER.name, avatarUrl: CURRENT_USER.avatarUrl },
          ],
          going: e.going.filter((a) => a.id !== CURRENT_USER.id),
        };
      })
    );
  };

  const handleCreate = (data: { title: string; time: string; location: string; note: string; category: EventCategory; capacity?: number }) => {
    const newEvent: EventItem = {
      id: `e-${Date.now()}`,
      title: data.title,
      time: new Date(data.time).toISOString(),
      location: data.location,
      note: data.note || undefined,
      category: data.category,
      capacity: data.capacity,
      going: [{ id: CURRENT_USER.id, name: CURRENT_USER.name, avatarUrl: CURRENT_USER.avatarUrl }],
      interested: [],
      createdAt: Date.now(),
      postedBy: { id: CURRENT_USER.id, name: CURRENT_USER.name, avatarUrl: CURRENT_USER.avatarUrl },
    };
    setEvents((prev) => [newEvent, ...prev]);
    setShowCreate(false);
    setActiveTab('feed');
  };

  const handleExpand = (eventId: string) => {
    setSelectedEvent(events.find((e) => e.id === eventId) ?? null);
  };

  const handleNudge = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (!event) return;
    const friendCount = event.going.filter((a) => friendIds.has(a.id)).length;
    const totalFriends = friendIds.size;
    const nudgeCount = Math.max(friendCount, Math.min(totalFriends, 3));
    setToast({
      message: `Nudged ${nudgeCount} friend${nudgeCount !== 1 ? 's' : ''}`,
      emoji: '',
    });
    setTimeout(() => setToast(null), 2500);
  };

  const TILE_COLORS = ['#6C63FF', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#8B5CF6', '#06B6D4'];

  const handleUploadMedia = (eventId: string, type: 'photo' | 'video', caption: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e;
        const colorIndex = ((e.pendingMedia?.length ?? 0) + (e.approvedMedia?.length ?? 0)) % TILE_COLORS.length;
        const newMedia: HighlightMedia = {
          id: `m-${Date.now()}`,
          eventId,
          eventTitle: e.title,
          uploadedBy: { id: CURRENT_USER.id, name: CURRENT_USER.name, avatarUrl: CURRENT_USER.avatarUrl },
          type,
          color: TILE_COLORS[colorIndex],
          caption: caption || undefined,
          uploadedAt: Date.now(),
          approved: false,
        };
        return { ...e, pendingMedia: [...(e.pendingMedia ?? []), newMedia] };
      })
    );
  };

  const handleApproveMedia = (eventId: string, mediaId: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e;
        const item = (e.pendingMedia ?? []).find((m) => m.id === mediaId);
        if (!item) return e;
        return {
          ...e,
          pendingMedia: (e.pendingMedia ?? []).filter((m) => m.id !== mediaId),
          approvedMedia: [...(e.approvedMedia ?? []), { ...item, approved: true }],
        };
      })
    );
  };

  const handleRejectMedia = (eventId: string, mediaId: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e;
        return { ...e, pendingMedia: (e.pendingMedia ?? []).filter((m) => m.id !== mediaId) };
      })
    );
  };

  const handleRemoveFromReel = (eventId: string, mediaId: string) => {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e;
        return { ...e, approvedMedia: (e.approvedMedia ?? []).filter((m) => m.id !== mediaId) };
      })
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #1A1A3E 0%, #0D0E1A 50%, #1A2040 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '10px 0',
    }}>
      <div
        ref={phoneFrameRef}
        className="phone-frame"
        style={{
          width: 390,
          height: 780,
          borderRadius: 48,
          background: colors.bgPrimary,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 60px 120px rgba(0,0,0,0.55), 0 0 0 8px rgba(40,42,70,0.90), 0 0 0 9px rgba(255,255,255,0.08), 0 0 0 12px rgba(30,32,55,0.95)',
          flexShrink: 0,
          transition: 'background 0.2s ease',
        }}
      >
        <Toast message={toast?.message || ''} emoji={toast?.emoji} visible={!!toast} />

        <div key={activeTab} style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden', position: 'relative', animation: 'viewEnter 0.25s ease both' }}>
          {activeTab === 'feed' && (
            <>
              <header
                style={{
                  background: isDark
                    ? 'rgba(16, 17, 34, 0.78)'
                    : 'rgba(255, 255, 255, 0.72)',
                  backdropFilter: isDark
                    ? 'blur(40px) saturate(180%)'
                    : 'blur(40px) saturate(200%)',
                  WebkitBackdropFilter: isDark
                    ? 'blur(40px) saturate(180%)'
                    : 'blur(40px) saturate(200%)',
                  borderBottom: isDark
                    ? '0.5px solid rgba(255,255,255,0.08)'
                    : '0.5px solid rgba(255,255,255,0.72)',
                  boxShadow: isDark
                    ? '0 1px 0 rgba(255,255,255,0.07) inset, 0 4px 20px rgba(0,0,0,0.28)'
                    : '0 1px 0 rgba(255,255,255,0.95) inset, 0 4px 20px rgba(100,80,200,0.08)',
                  position: 'sticky',
                  top: 0,
                  zIndex: 100,
                  overflow: 'hidden',
                }}
              >
                {/* Curved-glass specular overlay */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '55%',
                    background: isDark
                      ? 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 45%, transparent 65%)'
                      : 'linear-gradient(180deg, rgba(255,255,255,0.70) 0%, rgba(255,255,255,0.10) 45%, transparent 65%)',
                    pointerEvents: 'none',
                    zIndex: 0,
                  }}
                />
                <div
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 12,
                        background: 'linear-gradient(145deg, rgba(123,114,255,0.92), rgba(100,90,240,0.96))',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 1px 0 rgba(255,255,255,0.40) inset, 0 4px 12px rgba(123,114,255,0.40)',
                        border: '0.5px solid rgba(255,255,255,0.30)',
                      }}
                    >
                      <span style={{ fontSize: 18, fontWeight: 800, color: '#fff', lineHeight: 1 }}>R</span>
                    </div>
                    <h1
                      style={{
                        margin: 0,
                        fontSize: 20,
                        fontWeight: 700,
                        color: '#7B72FF',
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      Rally
                    </h1>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button
                      onClick={() => setShowCreate(true)}
                      className="btn-press"
                      style={{
                        background: 'linear-gradient(180deg, rgba(123,114,255,0.92), rgba(108,99,240,0.96))',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        color: '#fff',
                        border: '0.5px solid rgba(255,255,255,0.30)',
                        borderRadius: 14,
                        padding: '8px 16px',
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        transition: 'opacity 0.15s, transform 0.1s',
                        fontFamily: 'inherit',
                        boxShadow: '0 1px 0 rgba(255,255,255,0.35) inset, 0 3px 12px rgba(123,114,255,0.40)',
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      {userRole === 'host' ? 'Create Event' : 'Post'}
                    </button>
                    <UserAvatar name={CURRENT_USER.name} size={32} ring ringColor="#6C63FF" />
                  </div>
                </div>

                <div
                  style={{
                    padding: '0 20px 12px',
                    display: 'flex',
                    gap: 24,
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {[
                    { label: 'Events', value: events.filter(e => !e.isPast).length },
                    { label: 'Going', value: events.filter(e => !e.isPast).reduce((acc, e) => acc + e.going.length, 0) },
                    { label: 'Interested', value: events.filter(e => !e.isPast).reduce((acc, e) => acc + e.interested.length, 0) },
                  ].map((stat) => (
                    <div key={stat.label} style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: isDark ? colors.textPrimary : '#111' }}>
                        {stat.value}
                      </span>
                      <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 400 }}>
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </header>

              <main style={{ padding: '12px 16px 80px' }}>
                <EventFeed
                  events={events}
                  currentUser={CURRENT_USER}
                  onGoing={handleGoing}
                  onInterested={handleInterested}
                  friendIds={friendIds}
                  onNudge={handleNudge}
                  onExpand={handleExpand}
                  onUpload={(eventId) => setUploadTarget(events.find((e) => e.id === eventId) ?? null)}
                  feedMode={feedMode}
                  onFeedModeChange={setFeedMode}
                  userPrefs={userPrefs}
                  engagement={engagement}
                  userRole={userRole}
                  portalTarget={phoneFrameRef}
                />
              </main>
            </>
          )}

          {activeTab === 'myevents' && <MyEventsView events={events} currentUser={CURRENT_USER} friendIds={friendIds} onGoing={handleGoing} onInterested={handleInterested} />}
          {activeTab === 'friends' && <FriendsView friendIds={friendIds} onToggleFriend={handleToggleFriend} allUsers={SEED_USERS} currentUser={CURRENT_USER} events={events} />}
          {activeTab === 'highlights' && <HighlightsTab events={events} />}
          {activeTab === 'profile' && <ProfileView currentUser={CURRENT_USER} events={events} friendIds={friendIds} onResetDemo={handleResetDemo} userRole={userRole} onNavigate={setActiveTab} onShowCreate={() => setShowCreate(true)} />}
        </div>

        {/* Modals rendered as direct children of the phone frame so that
            position:absolute;inset:0 fills the frame viewport regardless of scroll position */}
        {showCreate && <CreateEventModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
        {selectedEvent && (
          <EventDetailModal
            event={events.find((e) => e.id === selectedEvent.id) ?? selectedEvent}
            currentUser={CURRENT_USER}
            onClose={() => setSelectedEvent(null)}
            onGoing={handleGoing}
            onInterested={handleInterested}
            friendIds={friendIds}
            onUpload={(eventId) => setUploadTarget(events.find((e) => e.id === eventId) ?? null)}
            onApproveMedia={handleApproveMedia}
            onRejectMedia={handleRejectMedia}
            onRemoveFromReel={handleRemoveFromReel}
            userRole={userRole}
          />
        )}
        {uploadTarget && (
          <MediaUploadSheet
            event={uploadTarget}
            onClose={() => setUploadTarget(null)}
            onUpload={(type, caption) => {
              handleUploadMedia(uploadTarget.id, type, caption);
              setUploadTarget(null);
            }}
          />
        )}

        {showOnboarding && <OnboardingFlow onComplete={handleOnboardingComplete} />}

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

export default App;
