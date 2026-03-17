import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { EventItem, CurrentUser, EventCategory, FeedMode, CATEGORY_CONFIG } from '../types';
import { UserPrefs, EngagementCounts, TimeOfDay } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { getTimeBucket } from '../utils/userPrefs';
import EventCard from './EventCard';
import EventRecapCard from './EventRecapCard';
// Feed mode options for the bottom sheet
const FEED_MODES: { key: FeedMode; label: string }[] = [
  { key: 'trending', label: 'Trending' },
  { key: 'friends', label: 'Friends' },
  { key: 'foryou', label: 'For You' },
];

interface EventFeedProps {
  events: EventItem[];
  currentUser: CurrentUser;
  onGoing: (eventId: string) => void;
  onInterested: (eventId: string) => void;
  friendIds: Set<string>;
  onNudge: (eventId: string) => void;
  onExpand: (eventId: string) => void;
  onUpload: (eventId: string) => void;
  feedMode: FeedMode;
  onFeedModeChange: (mode: FeedMode) => void;
  userPrefs: UserPrefs | null;
  engagement: EngagementCounts;
  userRole?: 'host' | 'attendee';
  portalTarget?: React.RefObject<HTMLDivElement | null>;
}

type FilterTab = 'foryou' | 'all' | 'happening' | 'today' | 'week';
type SourceFilter = 'all' | 'university' | 'hosted' | 'student';

const TABS: { key: FilterTab; label: string; isStar?: boolean }[] = [
  { key: 'foryou', label: '\u2605', isStar: true },
  { key: 'all', label: 'All' },
  { key: 'happening', label: 'Live' },
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'Week' },
];

const SOURCE_TABS: { key: SourceFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'university', label: 'University' },
  { key: 'hosted', label: 'Promoted' },
  { key: 'student', label: 'Students' },
];

const CATEGORY_KEYS = Object.keys(CATEGORY_CONFIG) as EventCategory[];

const MODE_DESCRIPTIONS: Record<'host' | 'attendee', Record<FeedMode, string>> = {
  attendee: {
    trending: 'What\u2019s hottest on campus right now.',
    friends: 'Events your friends are going to, first.',
    foryou: 'Picked for you based on your interests.',
  },
  host: {
    trending: 'Top events by engagement across campus.',
    friends: 'Events your network is attending.',
    foryou: 'Recommended based on your event categories.',
  },
};

function getPopularity(event: EventItem): number {
  return event.going.length * 2 + event.interested.length;
}

function computeForYouScore(
  event: EventItem,
  prefs: UserPrefs | null,
  engagement: EngagementCounts,
  friendIds: Set<string>,
): { score: number; reason: string | null } {
  let score = getPopularity(event);
  let reason: string | null = null;

  const bucket = getTimeBucket(event.time);

  // Category bonus from prefs
  if (prefs && prefs.favoriteCategories.includes(event.category)) {
    score += 15;
    const label = CATEGORY_CONFIG[event.category]?.label || event.category;
    reason = `Because you like ${label}`;
  }

  // Time bonus from prefs
  if (prefs && prefs.preferredTimes.includes(bucket)) {
    score += 10;
    if (!reason) {
      const timeLabels: Record<TimeOfDay, string> = {
        morning: 'Morning',
        afternoon: 'Afternoon',
        evening: 'Evening',
        latenight: 'Late night',
      };
      reason = `${timeLabels[bucket]} events you might prefer`;
    }
  }

  // Engagement bonus from actual behavior
  const catEngagement = engagement.categories[event.category] ?? 0;
  const timeEngagement = engagement.timeBuckets[bucket] ?? 0;
  score += catEngagement * 3;
  score += timeEngagement * 2;

  // Friends bonus (small)
  const friendsGoing = event.going.filter(a => friendIds.has(a.id)).length;
  score += friendsGoing * 4;

  return { score, reason };
}

const EventFeed: React.FC<EventFeedProps> = ({ events, currentUser, onGoing, onInterested, friendIds, onNudge, onExpand, onUpload, feedMode, onFeedModeChange, userPrefs, engagement, userRole = 'attendee', portalTarget }) => {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Set<EventCategory>>(new Set());
  const [friendsGoingFilter, setFriendsGoingFilter] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all');
  const [searchFocused, setSearchFocused] = useState(false);
  const [showCategoryDrawer, setShowCategoryDrawer] = useState(false);
  const { colors, isDark } = useTheme();

  // Animated pill for segmented control
  const segmentedRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });

  const measurePill = useCallback(() => {
    if (!segmentedRef.current) return;
    const activeButton = segmentedRef.current.querySelector<HTMLButtonElement>(`[data-tab-key="${activeTab}"]`);
    if (activeButton) {
      setPillStyle({
        left: activeButton.offsetLeft,
        width: activeButton.offsetWidth,
      });
    }
  }, [activeTab]);

  useEffect(() => {
    measurePill();
  }, [measurePill]);

  const now = new Date();
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);
  const endOfWeek = new Date(now);
  endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
  endOfWeek.setHours(23, 59, 59, 999);

  // Sync feedMode with tab selection
  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
    if (tab === 'foryou') {
      onFeedModeChange('foryou');
    } else {
      onFeedModeChange('trending');
    }
  };

  // When feed mode changes via bottom sheet, sync tab if needed
  const handleFeedModeFromSheet = (mode: FeedMode) => {
    onFeedModeChange(mode);
    if (mode === 'foryou') {
      setActiveTab('foryou');
    }
  };

  // Step 1: Time filter (existing)
  let filtered = events.filter((e) => {
    const eventTime = new Date(e.time).getTime();
    const nowMs = Date.now();

    switch (activeTab) {
      case 'happening':
        return !e.isPast && nowMs >= eventTime && nowMs <= eventTime + 2 * 60 * 60 * 1000;
      case 'today':
        return !e.isPast && eventTime <= endOfToday.getTime() && eventTime + 2 * 60 * 60 * 1000 >= nowMs;
      case 'week':
        return !e.isPast && eventTime <= endOfWeek.getTime() && eventTime + 2 * 60 * 60 * 1000 >= nowMs;
      case 'foryou':
      default:
        return true;
    }
  });

  // Step 2: Search filter
  const query = searchQuery.trim().toLowerCase();
  if (query) {
    filtered = filtered.filter(e =>
      e.title.toLowerCase().includes(query) ||
      e.location.toLowerCase().includes(query) ||
      (e.note && e.note.toLowerCase().includes(query))
    );
  }

  // Step 3: Category filter (OR within selected)
  if (selectedCategories.size > 0) {
    filtered = filtered.filter(e => selectedCategories.has(e.category));
  }

  // Step 4: Friends going filter
  if (friendsGoingFilter) {
    filtered = filtered.filter(e =>
      e.going.some(a => friendIds.has(a.id)) ||
      e.interested.some(a => friendIds.has(a.id))
    );
  }

  // Step 5: Source filter
  if (sourceFilter === 'university') {
    filtered = filtered.filter(e => e.posterIdentity?.isVerified === true);
  } else if (sourceFilter === 'hosted') {
    filtered = filtered.filter(e =>
      e.posterIdentity?.isHostMode === true || e.posterIdentity?.type === 'business'
    );
  } else if (sourceFilter === 'student') {
    filtered = filtered.filter(e =>
      !e.posterIdentity || e.posterIdentity.type === 'student'
    );
  }

  // ── Feed-mode aware sorting ──────────────────────────────────────────────
  const forYouScores = useMemo(() => {
    if (feedMode !== 'foryou') return new Map<string, { score: number; reason: string | null }>();
    const map = new Map<string, { score: number; reason: string | null }>();
    for (const e of filtered) {
      map.set(e.id, computeForYouScore(e, userPrefs, engagement, friendIds));
    }
    return map;
  }, [feedMode, filtered, userPrefs, engagement, friendIds]);

  const sorted = useMemo(() => {
    const arr = [...filtered];

    // Past events always at bottom
    arr.sort((a, b) => {
      if (a.isPast && !b.isPast) return 1;
      if (!a.isPast && b.isPast) return -1;
      return 0;
    });

    const upcoming = arr.filter(e => !e.isPast);
    const past = arr.filter(e => e.isPast);

    let sortedUpcoming: EventItem[];

    if (feedMode === 'trending') {
      sortedUpcoming = [...upcoming].sort((a, b) => {
        const goingDiff = b.going.length - a.going.length;
        if (goingDiff !== 0) return goingDiff;
        const popDiff = getPopularity(b) - getPopularity(a);
        if (popDiff !== 0) return popDiff;
        return new Date(a.time).getTime() - new Date(b.time).getTime();
      });
    } else if (feedMode === 'friends') {
      const friendEvents = upcoming.filter(e =>
        e.going.some(a => friendIds.has(a.id)) || friendIds.has(e.postedBy.id)
      );
      const nonFriendEvents = upcoming.filter(e =>
        !e.going.some(a => friendIds.has(a.id)) && !friendIds.has(e.postedBy.id)
      );

      friendEvents.sort((a, b) => {
        const aFriends = a.going.filter(at => friendIds.has(at.id)).length;
        const bFriends = b.going.filter(at => friendIds.has(at.id)).length;
        if (bFriends !== aFriends) return bFriends - aFriends;
        return new Date(a.time).getTime() - new Date(b.time).getTime();
      });

      // Fill with trending
      nonFriendEvents.sort((a, b) => {
        const goingDiff = b.going.length - a.going.length;
        if (goingDiff !== 0) return goingDiff;
        return new Date(a.time).getTime() - new Date(b.time).getTime();
      });

      sortedUpcoming = [...friendEvents, ...nonFriendEvents];
    } else {
      // For You
      sortedUpcoming = [...upcoming].sort((a, b) => {
        const scoreA = forYouScores.get(a.id)?.score ?? 0;
        const scoreB = forYouScores.get(b.id)?.score ?? 0;
        if (scoreB !== scoreA) return scoreB - scoreA;
        return new Date(a.time).getTime() - new Date(b.time).getTime();
      });
    }

    return [...sortedUpcoming, ...past];
  }, [filtered, feedMode, friendIds, forYouScores]);

  const hasActiveFilters = query !== '' || selectedCategories.size > 0 || friendsGoingFilter || sourceFilter !== 'all';
  const filterBadgeCount = selectedCategories.size + (friendsGoingFilter ? 1 : 0) + (sourceFilter !== 'all' ? 1 : 0);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories(new Set());
    setFriendsGoingFilter(false);
    setSourceFilter('all');
  };

  const toggleCategory = (cat: EventCategory) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <div>
      {/* Glass search bar */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          marginBottom: 10,
          borderRadius: 14,
          background: colors.inputBg,
          backdropFilter: 'blur(12px) saturate(160%)',
          WebkitBackdropFilter: 'blur(12px) saturate(160%)',
          border: searchFocused
            ? '0.5px solid rgba(123,114,255,0.50)'
            : `0.5px solid ${colors.borderGlass}`,
          boxShadow: searchFocused
            ? `0 0 0 3px rgba(123,114,255,0.08), ${colors.shadowCard}`
            : colors.shadowCard,
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          animation: 'fadeInUp 0.4s ease both',
          overflow: 'visible',
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke={colors.textMuted}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ position: 'absolute', left: 12, pointerEvents: 'none', zIndex: 2 }}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 32px 10px 36px',
            borderRadius: 14,
            border: 'none',
            boxShadow: 'none',
            background: 'transparent',
            color: colors.textPrimary,
            fontSize: 13,
            fontWeight: 500,
            outline: 'none',
            fontFamily: 'inherit',
            position: 'relative',
            zIndex: 1,
          }}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: 10,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: colors.textMuted,
              padding: 2,
              display: 'flex',
              alignItems: 'center',
              zIndex: 2,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Unified glass segmented control: time tabs + filters button */}
      <div
        ref={segmentedRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: 16,
          padding: 3,
          gap: 2,
          marginBottom: 12,
          background: colors.bgGlass,
          backdropFilter: 'blur(18px) saturate(170%)',
          WebkitBackdropFilter: 'blur(18px) saturate(170%)',
          border: `0.5px solid ${colors.borderGlass}`,
          boxShadow: colors.shadowCard,
          animation: 'fadeInUp 0.4s ease 0.08s both',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated sliding pill */}
        {pillStyle.width > 0 && (
          <div
            style={{
              position: 'absolute',
              top: 3,
              left: pillStyle.left,
              width: pillStyle.width,
              height: 'calc(100% - 6px)',
              borderRadius: 13,
              background: 'rgba(123,114,255,0.18)',
              boxShadow: isDark
                ? '0 1px 0 rgba(255,255,255,0.06) inset, 0 2px 8px rgba(123,114,255,0.20)'
                : '0 1px 0 rgba(255,255,255,0.80) inset, 0 2px 8px rgba(123,114,255,0.15)',
              transition: 'left 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94), width 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />
        )}
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              data-tab-key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className="btn-press"
              style={{
                flex: tab.isStar ? 0 : 1,
                padding: tab.isStar ? '8px 10px' : '4px 12px',
                borderRadius: tab.isStar ? 13 : 999,
                border: 'none',
                fontSize: tab.isStar ? 15 : 13,
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                transition: 'color 0.22s ease, font-weight 0.22s ease, background 0.22s ease',
                background: isActive ? 'transparent' : (tab.isStar ? 'transparent' : (isDark ? 'transparent' : '#F5F3FF')),
                color: isActive ? '#7B72FF' : (isDark ? colors.textMuted : '#6B7280'),
                boxShadow: 'none',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                whiteSpace: 'nowrap',
                position: 'relative',
                zIndex: 1,
                flexShrink: 0,
                lineHeight: 1,
              }}
            >
              {tab.key === 'happening' && (
                <span style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: isActive ? '#7B72FF' : '#EF4444',
                  display: 'inline-block',
                  flexShrink: 0,
                }} />
              )}
              {tab.label}
            </button>
          );
        })}

        {/* Divider */}
        <div style={{
          width: 1,
          height: 20,
          background: colors.divider,
          flexShrink: 0,
          margin: '0 2px',
          position: 'relative',
          zIndex: 1,
        }} />

        {/* Filters button */}
        <button
          onClick={() => setShowCategoryDrawer(prev => !prev)}
          className="btn-press"
          style={{
            padding: '8px 12px',
            borderRadius: 13,
            border: 'none',
            fontSize: 12,
            fontWeight: filterBadgeCount > 0 ? 600 : 500,
            cursor: 'pointer',
            background: filterBadgeCount > 0
              ? 'rgba(123,114,255,0.18)'
              : 'transparent',
            color: filterBadgeCount > 0 ? '#7B72FF' : colors.textMuted,
            boxShadow: filterBadgeCount > 0
              ? isDark
                ? '0 1px 0 rgba(255,255,255,0.06) inset, 0 2px 8px rgba(123,114,255,0.20)'
                : '0 1px 0 rgba(255,255,255,0.80) inset, 0 2px 8px rgba(123,114,255,0.15)'
              : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            transition: 'all 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fontFamily: 'inherit',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          {filterBadgeCount > 0 && (
            <span style={{
              background: '#7B72FF',
              color: '#fff',
              fontSize: 9,
              fontWeight: 700,
              borderRadius: 6,
              minWidth: 16,
              height: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
            }}>
              {filterBadgeCount}
            </span>
          )}
        </button>
      </div>

      {/* Glass filter bottom sheet — portaled to phone frame for fixed overlay */}
      {showCategoryDrawer && portalTarget?.current && createPortal(
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: isDark
              ? 'rgba(0, 0, 10, 0.50)'
              : 'rgba(20, 20, 50, 0.25)',
            zIndex: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'backdropIn 0.2s ease',
            borderRadius: 48,
          }}
          onClick={() => setShowCategoryDrawer(false)}
        >
          <div
            style={{
              width: 'calc(100% - 32px)',
              maxHeight: 'calc(100% - 120px)',
              borderRadius: 22,
              padding: '16px 16px 24px',
              background: colors.bgGlassHeavy,
              backdropFilter: 'blur(40px) saturate(190%)',
              WebkitBackdropFilter: 'blur(40px) saturate(190%)',
              border: `0.5px solid ${colors.borderGlass}`,
              boxShadow: isDark
                ? '0 1px 0 rgba(255,255,255,0.08) inset, 0 -4px 32px rgba(0,0,0,0.50), 0 24px 64px rgba(0,0,0,0.55)'
                : '0 1px 0 rgba(255,255,255,0.90) inset, 0 -4px 32px rgba(100,80,200,0.15), 0 24px 64px rgba(60,40,160,0.20)',
              animation: 'slideUp 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              position: 'relative',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div style={{
              width: 32,
              height: 4,
              borderRadius: 2,
              background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.10)',
              margin: '0 auto 14px',
              position: 'relative',
              zIndex: 1,
            }} />

            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
              position: 'relative',
              zIndex: 1,
            }}>
              <span style={{
                fontSize: 15,
                fontWeight: 600,
                color: colors.textPrimary,
              }}>
                Filters
              </span>
              {(filterBadgeCount > 0) && (
                <button
                  onClick={() => {
                    setSelectedCategories(new Set());
                    setFriendsGoingFilter(false);
                    setSourceFilter('all');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#7B72FF',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: '4px 8px',
                    fontFamily: 'inherit',
                  }}
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Section 1: Feed Mode */}
            <div style={{ marginBottom: 14, position: 'relative', zIndex: 1 }}>
              <div style={{
                fontSize: 11,
                fontWeight: 600,
                color: colors.textMuted,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.05em',
                marginBottom: 8,
              }}>
                Feed
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {FEED_MODES.map((mode) => {
                  const isActive = feedMode === mode.key;
                  return (
                    <button
                      key={mode.key}
                      onClick={() => handleFeedModeFromSheet(mode.key)}
                      className="btn-press"
                      style={{
                        padding: '7px 14px',
                        borderRadius: 12,
                        border: 'none',
                        fontSize: 12,
                        fontWeight: isActive ? 600 : 500,
                        cursor: 'pointer',
                        background: isActive
                          ? 'rgba(123,114,255,0.15)'
                          : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        color: isActive ? '#7B72FF' : colors.textMuted,
                        boxShadow: isActive
                          ? isDark
                            ? '0 1px 0 rgba(255,255,255,0.06) inset, 0 2px 6px rgba(123,114,255,0.18)'
                            : '0 1px 0 rgba(255,255,255,0.70) inset, 0 2px 6px rgba(123,114,255,0.12)'
                          : 'none',
                        transition: 'all 0.2s ease',
                        fontFamily: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                      }}
                    >
                      {mode.key === 'trending' && (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                          <polyline points="17 6 23 6 23 12" />
                        </svg>
                      )}
                      {mode.key === 'friends' && (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      )}
                      {mode.key === 'foryou' && (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      )}
                      {mode.label}
                    </button>
                  );
                })}
              </div>
              <div style={{
                fontSize: 11,
                color: colors.textMuted,
                fontWeight: 400,
                marginTop: 6,
                fontStyle: 'italic',
              }}>
                {MODE_DESCRIPTIONS[userRole][feedMode]}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: colors.divider, marginBottom: 14 }} />

            {/* Section 2: Source */}
            <div style={{ marginBottom: 14, position: 'relative', zIndex: 1 }}>
              <div style={{
                fontSize: 11,
                fontWeight: 600,
                color: colors.textMuted,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.05em',
                marginBottom: 8,
              }}>
                Source
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {SOURCE_TABS.filter(t => t.key !== 'all').map((tab) => {
                  const isActive = sourceFilter === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setSourceFilter(isActive ? 'all' : tab.key)}
                      className="btn-press"
                      style={{
                        padding: '7px 14px',
                        borderRadius: 12,
                        border: 'none',
                        fontSize: 12,
                        fontWeight: isActive ? 600 : 500,
                        cursor: 'pointer',
                        background: isActive
                          ? 'rgba(123,114,255,0.15)'
                          : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        color: isActive ? '#7B72FF' : colors.textMuted,
                        boxShadow: isActive
                          ? isDark
                            ? '0 1px 0 rgba(255,255,255,0.06) inset, 0 2px 6px rgba(123,114,255,0.18)'
                            : '0 1px 0 rgba(255,255,255,0.70) inset, 0 2px 6px rgba(123,114,255,0.12)'
                          : 'none',
                        transition: 'all 0.2s ease',
                        fontFamily: 'inherit',
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: colors.divider, marginBottom: 14 }} />

            {/* Section 3: Categories */}
            <div style={{ marginBottom: 14, position: 'relative', zIndex: 1 }}>
              <div style={{
                fontSize: 11,
                fontWeight: 600,
                color: colors.textMuted,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.05em',
                marginBottom: 8,
              }}>
                Categories
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {CATEGORY_KEYS.map((key) => {
                  const config = CATEGORY_CONFIG[key];
                  const isSelected = selectedCategories.has(key);
                  return (
                    <button
                      key={key}
                      onClick={() => toggleCategory(key)}
                      className="btn-press"
                      style={{
                        padding: '7px 14px',
                        borderRadius: 12,
                        border: 'none',
                        fontSize: 12,
                        fontWeight: isSelected ? 600 : 500,
                        cursor: 'pointer',
                        background: isSelected
                          ? 'rgba(123,114,255,0.15)'
                          : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        color: isSelected ? '#7B72FF' : colors.textMuted,
                        boxShadow: isSelected
                          ? isDark
                            ? '0 1px 0 rgba(255,255,255,0.06) inset, 0 2px 6px rgba(123,114,255,0.18)'
                            : '0 1px 0 rgba(255,255,255,0.70) inset, 0 2px 6px rgba(123,114,255,0.12)'
                          : 'none',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s ease',
                        fontFamily: 'inherit',
                      }}
                    >
                      {config.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: colors.divider, marginBottom: 14 }} />

            {/* Section 4: People */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                fontSize: 11,
                fontWeight: 600,
                color: colors.textMuted,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.05em',
                marginBottom: 8,
              }}>
                People
              </div>
              <button
                onClick={() => setFriendsGoingFilter(prev => !prev)}
                className="btn-press"
                style={{
                  padding: '7px 14px',
                  borderRadius: 12,
                  border: 'none',
                  fontSize: 12,
                  fontWeight: friendsGoingFilter ? 600 : 500,
                  cursor: 'pointer',
                  background: friendsGoingFilter
                    ? 'rgba(123,114,255,0.15)'
                    : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  color: friendsGoingFilter ? '#7B72FF' : colors.textMuted,
                  boxShadow: friendsGoingFilter
                    ? isDark
                      ? '0 1px 0 rgba(255,255,255,0.06) inset, 0 2px 6px rgba(123,114,255,0.18)'
                      : '0 1px 0 rgba(255,255,255,0.70) inset, 0 2px 6px rgba(123,114,255,0.12)'
                    : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  transition: 'all 0.2s ease',
                  fontFamily: 'inherit',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Friends going
              </button>
            </div>
          </div>
        </div>,
        portalTarget.current!,
      )}

      {/* Active filter indicator */}
      {hasActiveFilters && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
            paddingLeft: 2,
            animation: 'fadeIn 0.2s ease both',
          }}
        >
          <span style={{
            fontSize: 12,
            color: colors.textMuted,
            fontWeight: 500,
          }}>
            {sorted.length} result{sorted.length !== 1 ? 's' : ''}
            {query && <span> for &ldquo;{searchQuery.trim()}&rdquo;</span>}
          </span>
          <button
            onClick={clearFilters}
            style={{
              background: 'none',
              border: 'none',
              color: '#6C63FF',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: 6,
              fontFamily: 'inherit',
              transition: 'opacity 0.15s',
            }}
          >
            Clear filters
          </button>
        </div>
      )}

      {/* For You recommendation banner */}
      {feedMode === 'foryou' && sorted.length > 0 && (
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: colors.textMuted,
            fontStyle: 'italic',
            marginBottom: 12,
            paddingLeft: 2,
            animation: 'fadeIn 0.3s ease both',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.6 }}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Recommended based on your interests and where you actually show up.
        </div>
      )}

      {/* Event list */}
      {sorted.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: hasActiveFilters ? '48px 24px' : '64px 24px',
            color: colors.textMuted,
            animation: 'fadeIn 0.3s ease both',
          }}
        >
          {hasActiveFilters ? (
            <>
              <div style={{ fontSize: 40, marginBottom: 16, animation: 'float 3s ease-in-out infinite' }}>
                {'\u{1F50D}'}
              </div>
              <p style={{ fontSize: 16, fontWeight: 600, color: colors.textSecondary, marginBottom: 6 }}>
                No matching events
              </p>
              <p style={{ fontSize: 13, color: colors.textMuted, marginBottom: 16 }}>
                Try adjusting your filters or search terms
              </p>
              <button
                onClick={clearFilters}
                className="btn-press"
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  border: 'none',
                  background: isDark ? 'rgba(108,99,255,0.15)' : 'rgba(108,99,255,0.1)',
                  color: '#6C63FF',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Clear all filters
              </button>
            </>
          ) : (
            <>
              <div style={{ fontSize: 40, marginBottom: 16, animation: 'float 3s ease-in-out infinite' }}>
                {'\u{1F389}'}
              </div>
              <p style={{ fontSize: 18, fontWeight: 600, color: colors.textSecondary, marginBottom: 8 }}>
                {activeTab === 'all' || activeTab === 'foryou' ? 'No events yet' : `No ${TABS.find(t => t.key === activeTab)?.label.toLowerCase()} events`}
              </p>
              <p style={{ fontSize: 14, color: colors.textMuted }}>
                {activeTab === 'all' || activeTab === 'foryou'
                  ? (userRole === 'host'
                    ? 'Create your first event and start building your audience.'
                    : 'Check back soon to discover what\u2019s happening on campus!')
                  : 'Check back later or browse all events'}
              </p>
            </>
          )}
        </div>
      ) : (
        <div>
          {sorted.map((event, i) => {
            const forYouReason = feedMode === 'foryou' && i < 2 && !event.isPast
              ? forYouScores.get(event.id)?.reason ?? null
              : null;

            return event.isPast ? (
              <EventRecapCard
                key={event.id}
                event={event}
                friendIds={friendIds}
                index={i}
                onUpload={onUpload}
              />
            ) : (
              <div key={event.id}>
                {forYouReason && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 12,
                      fontWeight: 500,
                      color: isDark ? 'rgba(255,255,255,0.45)' : '#9CA3AF',
                      background: 'none',
                      border: 'none',
                      padding: '0 2px',
                      marginBottom: 6,
                      animation: `fadeInUp 0.3s ease ${i * 0.06}s both`,
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={isDark ? '#A78BFA' : '#7C3AED'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    {forYouReason}
                  </div>
                )}
                <EventCard
                  event={event}
                  currentUser={currentUser}
                  onGoing={onGoing}
                  onInterested={onInterested}
                  friendIds={friendIds}
                  onNudge={onNudge}
                  onExpand={onExpand}
                  index={i}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventFeed;
