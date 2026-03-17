import React, { useState, useMemo } from 'react';
import { Attendee, CurrentUser, EventItem } from '../types';
import UserAvatar from './UserAvatar';
import { useTheme } from '../contexts/ThemeContext';

interface FriendsViewProps {
  friendIds: Set<string>;
  onToggleFriend: (userId: string) => void;
  allUsers: Attendee[];
  currentUser: CurrentUser;
  events: EventItem[];
}

const FriendsView: React.FC<FriendsViewProps> = ({ friendIds, onToggleFriend, allUsers, currentUser, events }) => {
  const { colors, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const getSharedEventCount = useMemo(() => {
    const myEventIds = new Set(
      events
        .filter(
          (e) =>
            e.going.some((a) => a.id === currentUser.id) ||
            e.interested.some((a) => a.id === currentUser.id)
        )
        .map((e) => e.id)
    );

    const cache: Record<string, number> = {};
    return (userId: string): number => {
      if (cache[userId] !== undefined) return cache[userId];
      const count = events.filter((e) => {
        if (!myEventIds.has(e.id)) return false;
        return e.going.some((a) => a.id === userId) || e.interested.some((a) => a.id === userId);
      }).length;
      cache[userId] = count;
      return count;
    };
  }, [events, currentUser.id]);

  const query = searchQuery.trim().toLowerCase();
  const isSearching = query.length > 0;

  const friends = allUsers.filter((u) => friendIds.has(u.id));
  const nonFriends = allUsers.filter((u) => !friendIds.has(u.id) && u.id !== currentUser.id);

  // Sort non-friends by shared event count descending
  const sortedNonFriends = [...nonFriends].sort(
    (a, b) => getSharedEventCount(b.id) - getSharedEventCount(a.id)
  );

  // Search: filter across all users
  const searchResults = isSearching
    ? allUsers
        .filter((u) => u.id !== currentUser.id && u.name.toLowerCase().includes(query))
    : [];

  const renderUserRow = (user: Attendee, i: number) => {
    const isFriend = friendIds.has(user.id);
    const sharedCount = getSharedEventCount(user.id);

    return (
      <div
        key={user.id}
        style={{
          background: isDark ? 'rgba(22, 24, 48, 0.72)' : 'rgba(255, 255, 255, 0.68)',
          backdropFilter: 'blur(18px) saturate(170%)',
          WebkitBackdropFilter: 'blur(18px) saturate(170%)',
          borderRadius: 16,
          padding: '12px 16px',
          marginBottom: 8,
          boxShadow: 'var(--shadow-card)',
          border: isDark ? '0.5px solid rgba(255,255,255,0.11)' : '0.5px solid rgba(255,255,255,0.78)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          animation: `fadeInUp 0.3s ease ${i * 0.04}s both`,
        }}
      >
        <UserAvatar name={user.name} avatarUrl={user.avatarUrl || undefined} size={36} friendBadge={isFriend} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: colors.textPrimary }}>{user.name}</div>
          {isFriend ? (
            <div style={{ fontSize: 12, color: '#10b981', fontWeight: 600, marginTop: 4 }}>
              {'\u2605'} Friend
            </div>
          ) : sharedCount > 0 ? (
            <div style={{ fontSize: 12, color: '#6C63FF', fontWeight: 600, marginTop: 4 }}>
              {sharedCount} shared event{sharedCount !== 1 ? 's' : ''}
            </div>
          ) : (
            <div style={{ fontSize: 12, color: colors.textMuted, fontWeight: 500, marginTop: 4 }}>
              Oxford College
            </div>
          )}
        </div>
        {isFriend ? (
          <button
            onClick={() => onToggleFriend(user.id)}
            className="btn-press"
            style={{
              padding: '8px 12px',
              borderRadius: 10,
              border: `1px solid ${isDark ? '#4B5563' : '#D1D5DB'}`,
              background: 'transparent',
              color: '#ef4444',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              transition: 'all 0.2s ease',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Remove
          </button>
        ) : (
          <button
            onClick={() => onToggleFriend(user.id)}
            className="btn-press"
            style={{
              padding: '8px 12px',
              borderRadius: 10,
              border: 'none',
              background: '#6C63FF',
              color: '#fff',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              /* removed */
              transition: 'all 0.2s ease',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add
          </button>
        )}
      </div>
    );
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div
        style={{
          padding: '16px 20px 12px',
          background: isDark ? 'rgba(16, 18, 36, 0.78)' : 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(40px) saturate(190%)',
          WebkitBackdropFilter: 'blur(40px) saturate(190%)',
          borderBottom: isDark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(255,255,255,0.72)',
          boxShadow: isDark ? '0 1px 0 rgba(255,255,255,0.06) inset, 0 4px 16px rgba(0,0,0,0.22)' : '0 1px 0 rgba(255,255,255,0.90) inset, 0 4px 16px rgba(100,80,200,0.07)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: colors.textPrimary, letterSpacing: '-0.02em' }}>
          Friends
        </h2>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: colors.textMuted, fontWeight: 500 }}>
          {friends.length} friend{friends.length !== 1 ? 's' : ''}
        </p>

        {/* Search bar */}
        <div
          style={{
            marginTop: 12,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
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
            style={{ position: 'absolute', left: 12, pointerEvents: 'none' }}
          >
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 32px',
              borderRadius: 14,
              border: searchFocused ? '0.5px solid rgba(123,114,255,0.60)' : (isDark ? '0.5px solid rgba(255,255,255,0.12)' : '0.5px solid rgba(255,255,255,0.72)'),
              background: isDark ? 'rgba(30,32,58,0.65)' : 'rgba(255,255,255,0.62)',
              backdropFilter: 'blur(18px) saturate(170%)',
              WebkitBackdropFilter: 'blur(18px) saturate(170%)',
              color: colors.textPrimary,
              fontSize: 13,
              fontWeight: 500,
              outline: 'none',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              boxShadow: searchFocused ? '0 1px 0 rgba(255,255,255,0.80) inset, 0 0 0 3px rgba(123,114,255,0.12)' : '0 1px 0 rgba(255,255,255,0.70) inset',
              fontFamily: 'inherit',
            }}
          />
          {isSearching && (
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
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: '12px 16px 80px' }}>
        {/* Search results mode */}
        {isSearching ? (
          searchResults.length > 0 ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, paddingLeft: 4 }}>
                <span style={{ fontSize: 12, color: colors.textMuted, fontWeight: 500 }}>
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery.trim()}"
                </span>
              </div>
              {searchResults.map((user, i) => renderUserRow(user, i))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', animation: 'fadeIn 0.3s ease both' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{'\u{1F50D}'}</div>
              <p style={{ fontSize: 14, fontWeight: 600, color: colors.textSecondary, marginBottom: 4 }}>
                No results for "{searchQuery.trim()}"
              </p>
              <p style={{ fontSize: 12, color: colors.textMuted }}>
                Try a different name
              </p>
            </div>
          )
        ) : (
          <>
            {/* My Friends section */}
            {friends.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, paddingLeft: 4 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#10b981',
                    }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 700, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    My Friends ({friends.length})
                  </span>
                </div>
                {friends.map((user, i) => renderUserRow(user, i))}
              </div>
            )}

            {/* Recommended section */}
            {sortedNonFriends.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, paddingLeft: 4 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#6C63FF',
                    }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 700, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Recommended ({sortedNonFriends.length})
                  </span>
                </div>
                {sortedNonFriends.map((user, i) => renderUserRow(user, i))}
              </div>
            )}

            {/* Empty state */}
            {friends.length === 0 && sortedNonFriends.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px', animation: 'fadeIn 0.5s ease both' }}>
                <div style={{ fontSize: 48, marginBottom: 16, animation: 'float 3s ease-in-out infinite' }}>
                  {'\u{1F465}'}
                </div>
                <p style={{ fontSize: 16, fontWeight: 700, color: colors.textSecondary, marginBottom: 6 }}>
                  No users found
                </p>
                <p style={{ fontSize: 13, color: colors.textMuted }}>
                  Add friends to see who's going to events!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FriendsView;
