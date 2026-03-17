import React from 'react';
import { EventItem } from '../types';
import UserAvatar from './UserAvatar';
import { useTheme } from '../contexts/ThemeContext';

interface EventRecapCardProps {
  event: EventItem;
  friendIds: Set<string>;
  index: number;
  onUpload: (eventId: string) => void;
}

const EventRecapCard: React.FC<EventRecapCardProps> = ({ event, friendIds, index, onUpload }) => {
  const { colors, isDark } = useTheme();
  const allAttendees = event.going;
  const displayAttendees = allAttendees.slice(0, 8);
  const approvedCount = event.approvedMedia?.length ?? 0;

  const daysAgo = Math.floor((Date.now() - new Date(event.time).getTime()) / 86400000);
  const timeAgo = daysAgo === 0 ? 'Earlier today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`;

  return (
    <div
      className="glass card-hover"
      style={{
        background: isDark ? 'rgba(22, 24, 48, 0.72)' : 'rgba(255, 255, 255, 0.68)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        borderRadius: 16,
        marginBottom: 12,
        border: isDark ? '0.5px solid rgba(255,255,255,0.11)' : '0.5px solid rgba(255,255,255,0.78)',
        animation: `fadeInUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.06}s both`,
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div style={{ padding: '20px 20px 14px' }}>
        {/* Top line: RECAP badge + time ago */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                background: isDark ? 'rgba(108,99,255,0.12)' : '#EEF2FF',
                color: '#6C63FF',
                fontSize: 12,
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: 8,
                textTransform: 'uppercase',
              }}
            >
              Recap
            </span>
            <span style={{ fontSize: 14, color: colors.textMuted, fontWeight: 400 }}>
              {timeAgo} {'\u00B7'} {event.location}
            </span>
          </div>
          {/* Reel count badge */}
          {approvedCount > 0 && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#7B72FF',
                background: isDark ? 'rgba(123,114,255,0.15)' : 'rgba(123,114,255,0.10)',
                border: '0.5px solid rgba(123,114,255,0.25)',
                borderRadius: 8,
                padding: '3px 8px',
                whiteSpace: 'nowrap',
              }}
            >
              {approvedCount} in reel
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          style={{
            margin: '0 0 8px',
            fontSize: 17,
            fontWeight: 600,
            color: colors.textPrimary,
            lineHeight: 1.35,
          }}
        >
          {event.title}
        </h3>

        {/* Attendee count + highlight */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 20, fontWeight: 600, color: colors.textPrimary, lineHeight: 1 }}>
            {event.actualAttendees || allAttendees.length}
          </span>
          <div>
            <span style={{ fontSize: 14, fontWeight: 500, color: colors.textSecondary }}>showed up</span>
            {event.highlightStat && (
              <span style={{ fontSize: 13, color: colors.textMuted, marginLeft: 8 }}>
                {event.highlightStat}
              </span>
            )}
          </div>
        </div>

        {/* Compact attendee row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div style={{ display: 'flex' }}>
            {displayAttendees.map((a, i) => (
              <div
                key={a.id}
                style={{
                  marginLeft: i === 0 ? 0 : -6,
                  zIndex: displayAttendees.length - i,
                }}
              >
                <UserAvatar
                  name={a.name}
                  avatarUrl={a.avatarUrl || undefined}
                  size={24}
                  friendBadge={friendIds.has(a.id)}
                />
              </div>
            ))}
          </div>
          {allAttendees.length > displayAttendees.length && (
            <span style={{ fontSize: 12, color: colors.textMuted, fontWeight: 500 }}>
              +{allAttendees.length - displayAttendees.length}
            </span>
          )}
        </div>

        {/* Upload button */}
        <button
          onClick={(e) => { e.stopPropagation(); onUpload(event.id); }}
          style={{
            width: '100%',
            padding: '9px 14px',
            borderRadius: 12,
            border: isDark ? '0.5px solid rgba(255,255,255,0.14)' : '0.5px solid rgba(123,114,255,0.25)',
            background: isDark ? 'rgba(123,114,255,0.10)' : 'rgba(123,114,255,0.07)',
            color: '#7B72FF',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 0 rgba(255,255,255,0.25) inset',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none" />
            <polyline points="21 15 16 10 5 21" />
            <line x1="16" y1="3" x2="16" y2="7" />
            <line x1="14" y1="5" x2="18" y2="5" />
          </svg>
          Add Photos / Videos
        </button>
      </div>
    </div>
  );
};

export default EventRecapCard;
