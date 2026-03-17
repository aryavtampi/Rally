import React from 'react';
import { EventItem, CurrentUser, CATEGORY_CONFIG } from '../types';
import UserAvatar from './UserAvatar';
import { useTheme } from '../contexts/ThemeContext';

interface MyEventsViewProps {
  events: EventItem[];
  currentUser: CurrentUser;
  friendIds: Set<string>;
  onGoing: (eventId: string) => void;
  onInterested: (eventId: string) => void;
}

const MyEventsView: React.FC<MyEventsViewProps> = ({ events, currentUser, friendIds, onGoing, onInterested }) => {
  const { colors, isDark } = useTheme();

  const goingEvents = events.filter((e) => !e.isPast && e.going.some((a) => a.id === currentUser.id));
  const interestedEvents = events.filter((e) => !e.isPast && e.interested.some((a) => a.id === currentUser.id));

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const timeStr = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    if (isToday) return `Today ${timeStr}`;
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (d.toDateString() === tomorrow.toDateString()) return `Tomorrow ${timeStr}`;
    return `${d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} ${timeStr}`;
  };

  const renderMiniCard = (event: EventItem, type: 'going' | 'interested') => {
    const cat = CATEGORY_CONFIG[event.category];
    const friendsGoing = event.going.filter((a) => friendIds.has(a.id)).length;

    return (
      <div
        key={event.id}
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
          animation: 'fadeInUp 0.4s ease both',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: cat.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: cat.color }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: colors.textPrimary, lineHeight: 1.3 }}>
            {event.title}
          </h4>
          <div style={{ fontSize: 12, color: colors.textMuted, fontWeight: 500, marginTop: 4 }}>
            {formatTime(event.time)} {'\u00B7'} {event.location}
          </div>
          {friendsGoing > 0 && (
            <div style={{ fontSize: 12, color: '#10b981', fontWeight: 600, marginTop: 4 }}>
              {friendsGoing} friend{friendsGoing !== 1 ? 's' : ''} going
            </div>
          )}
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: type === 'going' ? '#10b981' : '#6C63FF', lineHeight: 1 }}>
            {event.going.length}
          </div>
          <div style={{ fontSize: 10, color: colors.textMuted, fontWeight: 600, textTransform: 'uppercase' }}>going</div>
        </div>
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
          My Events
        </h2>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: colors.textMuted, fontWeight: 500 }}>
          {goingEvents.length + interestedEvents.length} events saved
        </p>
      </div>

      <div style={{ padding: '12px 16px 80px' }}>
        {/* Going section */}
        {goingEvents.length > 0 && (
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
                Going ({goingEvents.length})
              </span>
            </div>
            {goingEvents.map((e) => renderMiniCard(e, 'going'))}
          </div>
        )}

        {/* Interested section */}
        {interestedEvents.length > 0 && (
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
                Interested ({interestedEvents.length})
              </span>
            </div>
            {interestedEvents.map((e) => renderMiniCard(e, 'interested'))}
          </div>
        )}

        {/* Empty state */}
        {goingEvents.length === 0 && interestedEvents.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 20px', animation: 'fadeIn 0.5s ease both' }}>
            <div style={{ fontSize: 48, marginBottom: 16, animation: 'float 3s ease-in-out infinite' }}>
              {'\u{2B50}'}
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: colors.textSecondary, marginBottom: 8 }}>
              No events yet
            </p>
            <p style={{ fontSize: 13, color: colors.textMuted }}>
              Tap "I'm Going" on events to see them here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEventsView;
