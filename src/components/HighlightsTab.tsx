import React, { useState } from 'react';
import { EventItem, HighlightMedia } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import UserAvatar from './UserAvatar';

interface HighlightsTabProps {
  events: EventItem[];
}

type Filter = 'all' | 'photo' | 'video';

const timeAgo = (ts: number): string => {
  const diff = Date.now() - ts;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor(diff / 60000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return `${mins}m ago`;
};

const darken = (hex: string): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - 48);
  const g = Math.max(0, ((num >> 8) & 0xff) - 48);
  const b = Math.max(0, (num & 0xff) - 48);
  return `rgb(${r},${g},${b})`;
};

const HighlightsTab: React.FC<HighlightsTabProps> = ({ events }) => {
  const { colors, isDark } = useTheme();
  const [filter, setFilter] = useState<Filter>('all');
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Collect all approved media from past events, sorted newest first
  const allMedia: HighlightMedia[] = events
    .filter((e) => e.isPast && e.approvedMedia && e.approvedMedia.length > 0)
    .flatMap((e) => e.approvedMedia!)
    .sort((a, b) => b.uploadedAt - a.uploadedAt);

  const filtered = filter === 'all' ? allMedia : allMedia.filter((m) => m.type === filter);

  const FILTER_TABS: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'photo', label: 'Photos' },
    { key: 'video', label: 'Videos' },
  ];


  return (
    <div style={{ height: '100%', overflowY: 'auto', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
      {/* Sticky header */}
      <div
        style={{
          padding: '16px 20px 0',
          background: isDark ? 'rgba(16, 17, 34, 0.78)' : 'rgba(255, 255, 255, 0.72)',
          backdropFilter: 'blur(40px) saturate(190%)',
          WebkitBackdropFilter: 'blur(40px) saturate(190%)',
          borderBottom: isDark ? '0.5px solid rgba(255,255,255,0.08)' : '0.5px solid rgba(255,255,255,0.72)',
          boxShadow: isDark
            ? '0 1px 0 rgba(255,255,255,0.06) inset, 0 4px 16px rgba(0,0,0,0.22)'
            : '0 1px 0 rgba(255,255,255,0.90) inset, 0 4px 16px rgba(100,80,200,0.07)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
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

        {/* Header content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: colors.textPrimary, letterSpacing: '-0.02em' }}>
              Highlights
            </h2>
            {allMedia.length > 0 && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#7B72FF',
                  background: isDark ? 'rgba(123,114,255,0.16)' : 'rgba(123,114,255,0.10)',
                  border: '0.5px solid rgba(123,114,255,0.28)',
                  borderRadius: 8,
                  padding: '2px 8px',
                }}
              >
                {allMedia.length} moment{allMedia.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p style={{ margin: '0 0 12px', fontSize: 12, color: colors.textMuted, fontWeight: 500 }}>
            Moments from past events
          </p>

          {/* Filter chips */}
          <div style={{ display: 'flex', gap: 8, paddingBottom: 12 }}>
            {FILTER_TABS.map((tab) => {
              const active = filter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    border: active
                      ? '0.5px solid rgba(123,114,255,0.45)'
                      : isDark ? '0.5px solid rgba(255,255,255,0.12)' : '0.5px solid rgba(0,0,0,0.08)',
                    background: active
                      ? isDark ? 'rgba(123,114,255,0.22)' : 'rgba(123,114,255,0.12)'
                      : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    color: active ? '#7B72FF' : colors.textMuted,
                    fontSize: 13,
                    fontWeight: active ? 600 : 500,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    boxShadow: active
                      ? isDark
                        ? '0 1px 0 rgba(255,255,255,0.12) inset, 0 2px 10px rgba(123,114,255,0.22)'
                        : '0 1px 0 rgba(255,255,255,0.80) inset, 0 2px 10px rgba(123,114,255,0.15)'
                      : isDark
                        ? '0 1px 0 rgba(255,255,255,0.07) inset'
                        : '0 1px 0 rgba(255,255,255,0.60) inset',
                    transform: active ? 'scale(1.03)' : 'scale(1)',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '12px 16px 100px' }}>
        {filtered.length === 0 ? (
          /* Empty state */
          <div
            className="glass card-hover"
            style={{
              marginTop: 32,
              borderRadius: 20,
              background: isDark ? 'rgba(22, 24, 48, 0.72)' : 'rgba(255,255,255,0.68)',
              backdropFilter: 'blur(28px) saturate(180%)',
              WebkitBackdropFilter: 'blur(28px) saturate(180%)',
              border: isDark ? '0.5px solid rgba(255,255,255,0.11)' : '0.5px solid rgba(255,255,255,0.78)',
              boxShadow: 'var(--shadow-card)',
              padding: '48px 24px',
              textAlign: 'center',
              animation: 'fadeInUp 0.4s ease both',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: isDark ? 'rgba(123,114,255,0.16)' : 'rgba(123,114,255,0.10)',
                border: '0.5px solid rgba(123,114,255,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7B72FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="15" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-4 0v2" />
                <line x1="12" y1="12" x2="12" y2="16" />
                <line x1="10" y1="14" x2="14" y2="14" />
              </svg>
            </div>
            <p style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: colors.textPrimary }}>
              No highlights yet
            </p>
            <p style={{ margin: 0, fontSize: 13, color: colors.textMuted, lineHeight: 1.5 }}>
              Attend events and upload photos or videos. Hosts review and add the best moments here.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map((media, i) => (
              <HighlightCard
                key={media.id}
                media={media}
                index={i}
                isDark={isDark}
                colors={colors}
                isLiked={liked.has(media.id)}
                onLike={() => toggleLike(media.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface HighlightCardProps {
  media: HighlightMedia;
  index: number;
  isDark: boolean;
  colors: any;
  isLiked: boolean;
  onLike: () => void;
}

const HighlightCard: React.FC<HighlightCardProps> = ({ media, index, isDark, isLiked, onLike }) => {
  return (
    <div
      className="card-hover"
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        height: 240,
        position: 'relative',
        background: `linear-gradient(145deg, ${media.color}, ${darken(media.color)})`,
        boxShadow: isDark
          ? '0 1px 0 rgba(255,255,255,0.14) inset, 0 -0.5px 0 rgba(0,0,0,0.55) inset, 0 10px 36px rgba(0,0,0,0.50), 0 3px 8px rgba(0,0,0,0.35)'
          : '0 1px 0 rgba(255,255,255,0.55) inset, 0 -0.5px 0 rgba(0,0,0,0.08) inset, 0 8px 28px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.10)',
        borderLeft: '1px solid rgba(255,255,255,0.22)',
        borderTop: '1px solid rgba(255,255,255,0.18)',
        animation: `fadeInUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.07}s both`,
        cursor: 'default',
      }}
    >
      {/* Glass specular gloss — curved top highlight */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '58%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.08) 50%, transparent 72%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Grain texture overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.80' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          opacity: 0.045,
          pointerEvents: 'none',
          zIndex: 1,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Type badge top-right */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          right: 14,
          zIndex: 3,
          background: 'rgba(0,0,0,0.38)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '0.5px solid rgba(255,255,255,0.22)',
          borderRadius: 8,
          padding: '4px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 5,
        }}
      >
        {media.type === 'video' ? (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="white" stroke="none">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        ) : (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" fill="white" stroke="none" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        )}
        <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {media.type === 'video' ? 'Video' : 'Photo'}
        </span>
      </div>

      {/* Bottom info overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '40px 16px 16px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.30) 55%, transparent 100%)',
          zIndex: 3,
        }}
      >
        {/* Event name chip */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '0.5px solid rgba(255,255,255,0.28)',
            borderRadius: 6,
            padding: '3px 9px',
            marginBottom: 10,
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.92)', letterSpacing: '0.02em' }}>
            {media.eventTitle}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Uploader with avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <UserAvatar
              name={media.uploadedBy.name}
              avatarUrl={media.uploadedBy.avatarUrl || undefined}
              size={20}
            />
            <div>
              <span style={{ fontSize: 13, color: '#fff', fontWeight: 600, display: 'block', lineHeight: 1.2 }}>
                {media.uploadedBy.name}
              </span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 400 }}>
                {timeAgo(media.uploadedAt)}
              </span>
            </div>
          </div>

          {/* Like button */}
          <button
            onClick={onLike}
            style={{
              background: isLiked ? 'rgba(239,68,68,0.28)' : 'rgba(0,0,0,0.32)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: isLiked ? '0.5px solid rgba(239,68,68,0.50)' : '0.5px solid rgba(255,255,255,0.22)',
              borderRadius: 10,
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              fontFamily: 'inherit',
              transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              animation: isLiked ? 'popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both' : 'none',
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={isLiked ? '#EF4444' : 'none'}
              stroke={isLiked ? '#EF4444' : 'rgba(255,255,255,0.85)'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HighlightsTab;
