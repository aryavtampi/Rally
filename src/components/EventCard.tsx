import React, { useState, useEffect, useCallback } from 'react';
import { EventItem, CurrentUser, CATEGORY_CONFIG } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import UserAvatar from './UserAvatar';
import NudgeButton from './NudgeButton';

interface EventCardProps {
  event: EventItem;
  currentUser: CurrentUser;
  onGoing: (eventId: string) => void;
  onInterested: (eventId: string) => void;
  friendIds: Set<string>;
  onNudge: (eventId: string) => void;
  onExpand: (eventId: string) => void;
  index: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  speed: number;
}

const EventCard: React.FC<EventCardProps> = ({ event, currentUser, onGoing, onInterested, friendIds, onNudge, onExpand, index }) => {
  const isGoing = event.going.some((a) => a.id === currentUser.id);
  const isInterested = event.interested.some((a) => a.id === currentUser.id);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [countdown, setCountdown] = useState('');
  const [justClicked, setJustClicked] = useState<'going' | 'interested' | null>(null);
  const [justJoined, setJustJoined] = useState(false);

  const { colors, isDark } = useTheme();
  const cat = CATEGORY_CONFIG[event.category];
  const goingCount = event.going.length;
  const friendsGoingCount = event.going.filter((a) => friendIds.has(a.id)).length;
  const poster = event.posterIdentity;
  const isBusiness = poster?.type === 'business';
  const isHostMode = poster?.isHostMode;
  const isVerified = poster?.isVerified;
  const hasCapacity = event.capacity && event.capacity > 0;
  const capacityPercent = hasCapacity ? Math.min((goingCount / event.capacity!) * 100, 100) : 0;
  const capacityColor = capacityPercent > 95 ? '#EF4444' : capacityPercent > 85 ? '#F59E0B' : '#6C63FF';
  const capacityLabel = capacityPercent >= 100 ? 'Full' : capacityPercent > 85 ? 'Almost full!' : '';

  const isHappeningNow = (() => {
    const eventTime = new Date(event.time).getTime();
    const now = Date.now();
    return now >= eventTime && now <= eventTime + 2 * 60 * 60 * 1000;
  })();

  // Countdown timer
  useEffect(() => {
    const update = () => {
      const diff = new Date(event.time).getTime() - Date.now();
      if (diff <= 0) {
        setCountdown('');
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hrs = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);

      if (days > 0) setCountdown(`${days}d ${hrs}h`);
      else if (hrs > 0) setCountdown(`${hrs}h ${mins}m`);
      else setCountdown(`${mins}m`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [event.time]);

  // Confetti burst
  const spawnParticles = useCallback(() => {
    const confettiColors = ['#6C63FF', '#818CF8', '#A5B4FC', '#10B981', '#34D399'];
    const newParticles: Particle[] = [];
    for (let i = 0; i < 12; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: 50 + (Math.random() - 0.5) * 20,
        y: 50,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        size: 3 + Math.random() * 5,
        angle: (Math.PI * 2 * i) / 12 + (Math.random() - 0.5) * 0.5,
        speed: 40 + Math.random() * 60,
      });
    }
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 700);
  }, []);

  const handleGoingClick = () => {
    if (!isGoing) {
      spawnParticles();
      setJustClicked('going');
      setJustJoined(true);
      setTimeout(() => setJustClicked(null), 600);
      setTimeout(() => setJustJoined(false), 600);
    }
    onGoing(event.id);
  };

  const handleInterestedClick = () => {
    if (!isInterested) {
      setJustClicked('interested');
      setTimeout(() => setJustClicked(null), 600);
    }
    onInterested(event.id);
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = d.toDateString() === tomorrow.toDateString();
    const timeStr = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    if (isToday) return `Today ${timeStr}`;
    if (isTomorrow) return `Tomorrow ${timeStr}`;
    return `${d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} ${timeStr}`;
  };

  // Sort friends first in avatar stack
  const sortedGoing = [...event.going].sort((a, b) => {
    const aFriend = friendIds.has(a.id) ? 0 : 1;
    const bFriend = friendIds.has(b.id) ? 0 : 1;
    return aFriend - bFriend;
  });
  const displayAvatars = sortedGoing.slice(0, 4);
  const extraCount = event.going.length - displayAvatars.length;

  return (
    <div
      className="glass card-hover"
      onClick={() => onExpand(event.id)}
      style={{
        cursor: 'pointer',
        background: isDark ? 'rgba(22, 24, 48, 0.72)' : 'rgba(255, 255, 255, 0.72)',
        backdropFilter: isDark ? 'blur(14px) saturate(160%)' : 'blur(14px)',
        WebkitBackdropFilter: isDark ? 'blur(14px) saturate(160%)' : 'blur(14px)',
        borderRadius: 20,
        marginBottom: 12,
        border: isDark
            ? '1px solid rgba(255, 255, 255, 0.11)'
            : '1px solid rgba(255, 255, 255, 0.50)',
        boxShadow: isDark
          ? 'var(--shadow-card)'
          : '0 4px 20px rgba(109, 40, 217, 0.07)',
        animation: `fadeInUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.06}s both`,
      }}
    >
      {/* Glass specular top-edge highlight */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 40,
          background: isDark
            ? 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%)'
            : 'linear-gradient(180deg, rgba(255,255,255,0.80) 0%, transparent 100%)',
          borderRadius: '20px 20px 0 0',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      {/* Confetti particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            background: p.color,
            animation: 'confettiBurst 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
            transform: `translate(${Math.cos(p.angle) * p.speed}px, ${Math.sin(p.angle) * p.speed - 40}px)`,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />
      ))}

      <div style={{ padding: '14px 16px' }}>
        {/* Row 1: Category tag + time on left, countdown badge on right */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.03em',
                color: isDark ? '#A78BFA' : '#6D28D9',
                background: isDark ? 'rgba(109, 40, 217, 0.15)' : '#EDE9FE',
                border: 'none',
                padding: '2px 8px',
                borderRadius: 6,
              }}
            >
              {cat.label}
            </span>
            <span style={{ fontSize: 13, color: isDark ? colors.textMuted : '#374151', fontWeight: 500 }}>
              {formatTime(event.time)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {isHappeningNow && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#EF4444',
                  background: isDark ? 'rgba(239,68,68,0.12)' : '#FEF2F2',
                  padding: '3px 8px',
                  borderRadius: 8,
                }}
              >
                <span
                  style={{
                    position: 'relative',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#EF4444',
                    display: 'inline-block',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      background: '#EF4444',
                      animation: 'livePulse 1.5s ease-out infinite',
                    }}
                  />
                </span>
                LIVE
              </span>
            )}

            {countdown && !isHappeningNow && (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: isDark ? 'rgba(139, 133, 255, 0.7)' : 'rgba(108, 99, 255, 0.55)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {countdown}
              </span>
            )}
          </div>
        </div>

        {/* Row 2: Event title */}
        <div
          style={{
            margin: '0 0 2px',
            fontSize: 16,
            fontWeight: 600,
            color: isDark ? colors.textPrimary : '#111',
            lineHeight: 1.35,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          } as React.CSSProperties}
        >
          {event.title}
        </div>

        {/* Row 2b: Organizer + badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            marginBottom: 4,
            fontSize: 13,
            fontWeight: 400,
            color: '#6B7280',
            lineHeight: 1.4,
          }}
        >
          <span>{poster?.orgName || event.postedBy.name}</span>
          {isVerified && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: '#6C63FF',
                flexShrink: 0,
              }}
              title="Verified organization"
            >
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          )}
          {isHostMode && !isBusiness && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.03em',
                color: isDark ? '#A78BFA' : '#6D28D9',
                background: isDark ? 'rgba(109, 40, 217, 0.15)' : '#EDE9FE',
                border: 'none',
                padding: '2px 8px',
                borderRadius: 6,
              }}
            >
              HOST
            </span>
          )}
          {isBusiness && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.03em',
                color: isDark ? '#A78BFA' : '#6D28D9',
                background: isDark ? 'rgba(109, 40, 217, 0.15)' : '#EDE9FE',
                border: 'none',
                padding: '2px 8px',
                borderRadius: 6,
              }}
            >
              PROMOTED
            </span>
          )}
        </div>

        {/* Row 3: Location */}
        <div
          style={{
            fontSize: 13,
            color: '#6B7280',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontWeight: 400,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
          {event.location}
        </div>

        {/* Row 3b: Note / description */}
        {event.note && (
          <p
            style={{
              fontSize: 13,
              color: '#6B7280',
              fontWeight: 400,
              margin: '4px 0 0',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
            } as React.CSSProperties}
          >
            {event.note}
          </p>
        )}

        {/* Row 4: Avatar stack + social proof */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 12, gap: 8 }}>
          {/* Left: avatar stack + overflow */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex' }}>
              {displayAvatars.map((a, i) => (
                <div
                  key={a.id}
                  style={{
                    marginLeft: i === 0 ? 0 : -8,
                    zIndex: displayAvatars.length - i,
                    position: 'relative',
                    animation: justJoined && a.id === currentUser.id
                      ? 'avatarSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both'
                      : `popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.05}s both`,
                  }}
                >
                  <UserAvatar
                    name={a.name}
                    avatarUrl={a.avatarUrl || undefined}
                    size={28}
                    ring={a.id === currentUser.id}
                    ringColor="#6C63FF"
                    friendBadge={friendIds.has(a.id)}
                  />
                </div>
              ))}
            </div>
            {extraCount > 0 && (
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: isDark ? colors.borderGlass : colors.divider,
                  border: `2px solid ${isDark ? colors.bgCard : '#fff'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: -2,
                  position: 'relative',
                  zIndex: displayAvatars.length + 1,
                  fontSize: 11,
                  fontWeight: 600,
                  color: colors.textMuted,
                }}
              >
                +{extraCount}
              </div>
            )}
          </div>

          {/* Right: going count + friends count */}
          <span
            style={{
              fontSize: 13,
              color: isDark ? colors.textSecondary : '#374151',
              fontWeight: 500,
              marginLeft: 'auto',
              animation: justJoined ? 'countUp 0.3s ease both' : undefined,
            }}
          >
            {goingCount} going
            {friendsGoingCount > 0 && (
              <span style={{ color: '#6B7280' }}> · <span style={{ fontWeight: 600, color: '#7C3AED' }}>{friendsGoingCount}</span> friend{friendsGoingCount !== 1 ? 's' : ''}</span>
            )}
          </span>
        </div>

        {/* Capacity bar (host/business events only) */}
        {hasCapacity && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <div
              style={{
                flex: 1,
                height: 4,
                borderRadius: 999,
                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(109, 40, 217, 0.10)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${capacityPercent}%`,
                  height: '100%',
                  borderRadius: 999,
                  background: capacityColor,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: isDark ? colors.textSecondary : '#374151', whiteSpace: 'nowrap' }}>
              {goingCount}/{event.capacity}
            </span>
            {capacityLabel && (
              <span style={{ fontSize: 11, fontWeight: 600, color: capacityColor, whiteSpace: 'nowrap' }}>
                {capacityLabel}
              </span>
            )}
          </div>
        )}

        {/* Divider */}
        <div style={{
          height: 0.5,
          background: isDark
            ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(100,80,200,0.08), transparent)',
          margin: '14px 0',
        }} />

        {/* Row 5: Action buttons */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Primary: I'm Going */}
          <button
            onClick={(e) => { e.stopPropagation(); handleGoingClick(); }}
            className="btn-press"
            style={{
              height: 36,
              padding: '0 16px',
              borderRadius: 12,
              border: isGoing
                ? '0.5px solid rgba(255,255,255,0.25)'
                : '0.5px solid rgba(255,255,255,0.30)',
              fontWeight: 500,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: isGoing
                ? 'linear-gradient(180deg, rgba(16,185,129,0.88), rgba(12,160,110,0.92))'
                : 'linear-gradient(180deg, rgba(123,114,255,0.90), rgba(108,99,240,0.95))',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: isGoing
                ? '0 1px 0 rgba(255,255,255,0.35) inset, 0 -0.5px 0 rgba(0,0,0,0.10) inset, 0 4px 16px rgba(16,185,129,0.30)'
                : '0 1px 0 rgba(255,255,255,0.35) inset, 0 -0.5px 0 rgba(0,0,0,0.10) inset, 0 4px 16px rgba(123,114,255,0.35)',
              animation: justClicked === 'going' ? 'pulse 0.4s ease' : undefined,
              fontFamily: 'inherit',
            }}
          >
            {isGoing ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Going
              </>
            ) : (
              "I'm Going"
            )}
          </button>

          {/* Secondary: Interested (glass) */}
          <button
            onClick={(e) => { e.stopPropagation(); handleInterestedClick(); }}
            className="btn-press"
            title="Interested"
            style={{
              height: 36,
              padding: '0 14px',
              borderRadius: 12,
              border: isInterested
                ? (isDark ? '0.5px solid rgba(123,114,255,0.40)' : '0.5px solid rgba(123,114,255,0.25)')
                : isDark
                  ? '0.5px solid rgba(255,255,255,0.10)'
                  : '0.5px solid rgba(255,255,255,0.55)',
              background: isInterested
                ? (isDark ? 'rgba(123,114,255,0.12)' : 'rgba(123,114,255,0.08)')
                : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.50)'),
              backdropFilter: 'blur(12px) saturate(160%)',
              WebkitBackdropFilter: 'blur(12px) saturate(160%)',
              color: isInterested ? '#7B72FF' : (isDark ? colors.textSecondary : '#4A4B6A'),
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              fontWeight: 500,
              flexShrink: 0,
              transition: 'all 0.2s ease',
              boxShadow: isInterested
                ? (isDark
                    ? '0 0.5px 0 rgba(255,255,255,0.06) inset, 0 2px 8px rgba(123,114,255,0.15)'
                    : '0 1px 0 rgba(255,255,255,0.80) inset, 0 2px 8px rgba(123,114,255,0.10)')
                : (isDark
                    ? '0 0.5px 0 rgba(255,255,255,0.06) inset'
                    : '0 1px 0 rgba(255,255,255,0.80) inset, 0 1px 4px rgba(100,80,200,0.06)'),
              animation: justClicked === 'interested' ? 'pulse 0.4s ease' : undefined,
              fontFamily: 'inherit',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={isInterested ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            {isInterested
              ? (event.interested.length > 0 ? event.interested.length : null)
              : (event.interested.length > 0 ? `${event.interested.length} Interested` : 'Interested')
            }
          </button>

          {/* Tertiary: Nudge */}
          <NudgeButton
            friendCount={friendsGoingCount > 0 ? friendsGoingCount : FRIEND_IDS_SIZE}
            onNudge={() => onNudge(event.id)}
          />
        </div>

      </div>
    </div>
  );
};

const FRIEND_IDS_SIZE = 4;

export default EventCard;
