import React, { useState, useEffect } from 'react';
import { EventItem, CurrentUser, CATEGORY_CONFIG } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import UserAvatar from './UserAvatar';
import HostApprovalQueue from './HostApprovalQueue';

interface EventDetailModalProps {
  event: EventItem;
  currentUser: CurrentUser;
  onClose: () => void;
  onGoing: (eventId: string) => void;
  onInterested: (eventId: string) => void;
  friendIds: Set<string>;
  onUpload?: (eventId: string) => void;
  onApproveMedia?: (eventId: string, mediaId: string) => void;
  onRejectMedia?: (eventId: string, mediaId: string) => void;
  onRemoveFromReel?: (eventId: string, mediaId: string) => void;
  userRole?: 'host' | 'attendee';
  onReportEvent?: (eventTitle: string) => void;
}

function formatFullDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = new Date(todayStart.getTime() + 86400000);
  const eventStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  if (eventStart.getTime() === todayStart.getTime()) return `Today · ${timeStr}`;
  if (eventStart.getTime() === tomorrowStart.getTime()) return `Tomorrow · ${timeStr}`;
  return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }) + ` · ${timeStr}`;
}

function getCountdown(isoString: string): { label: string; isLive: boolean } {
  const diff = new Date(isoString).getTime() - Date.now();
  if (diff <= 0 && diff > -7200000) return { label: 'Happening Now', isLive: true };
  if (diff <= 0) return { label: 'Ended', isLive: false };
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (days > 0) return { label: `In ${days}d ${hours}h`, isLive: false };
  if (hours > 0) return { label: `In ${hours}h ${mins}m`, isLive: false };
  return { label: `In ${mins}m`, isLive: false };
}

const Divider: React.FC<{ isDark: boolean }> = ({ isDark }) => (
  <div style={{
    height: 0.5,
    background: isDark
      ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)'
      : 'linear-gradient(90deg, transparent, rgba(100,80,200,0.12), transparent)',
    margin: '18px 0',
  }} />
);

interface CollapsibleSectionProps {
  label: string;
  count: number;
  isDark: boolean;
  colors: any;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ label, count, isDark, colors, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '2px 0',
          fontFamily: 'inherit',
          marginBottom: open ? 10 : 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>
            {label}
          </span>
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#7B72FF',
            background: isDark ? 'rgba(123,114,255,0.12)' : 'rgba(123,114,255,0.10)',
            border: '0.5px solid rgba(123,114,255,0.25)',
            borderRadius: 6,
            padding: '1px 7px',
            boxShadow: '0 1px 0 rgba(255,255,255,0.40) inset',
          }}>
            {count}
          </span>
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke={colors.textMuted}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', flexShrink: 0 }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, animation: 'fadeInDown 0.15s ease both' }}>
          {children}
        </div>
      )}
    </div>
  );
};

const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  currentUser,
  onClose,
  onGoing,
  onInterested,
  friendIds,
  onUpload,
  onApproveMedia,
  onRejectMedia,
  onRemoveFromReel,
  userRole = 'attendee',
  onReportEvent,
}) => {
  const { colors, isDark } = useTheme();
  const [mapsOpen, setMapsOpen] = useState(false);
  const [countdown, setCountdown] = useState(() => getCountdown(event.time));
  const [justClicked, setJustClicked] = useState<'going' | 'interested' | null>(null);

  const cat = CATEGORY_CONFIG[event.category];
  const poster = event.posterIdentity;
  const isBusiness = poster?.type === 'business';
  const isGoing = event.going.some(a => a.id === currentUser.id);
  const isInterested = event.interested.some(a => a.id === currentUser.id);

  const encodedLocation = encodeURIComponent(event.location);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  const appleMapsUrl = `https://maps.apple.com/?q=${encodedLocation}`;

  useEffect(() => {
    const t = setInterval(() => setCountdown(getCountdown(event.time)), 10000);
    return () => clearInterval(t);
  }, [event.time]);

  const handleGoingClick = () => {
    setJustClicked('going');
    onGoing(event.id);
    setTimeout(() => setJustClicked(null), 400);
  };

  const handleInterestedClick = () => {
    setJustClicked('interested');
    onInterested(event.id);
    setTimeout(() => setJustClicked(null), 400);
  };

  const glassBtn = (active: boolean, accentColor: string): React.CSSProperties => ({
    flex: 1,
    padding: '11px 0',
    borderRadius: 14,
    border: active
      ? `0.5px solid ${accentColor}80`
      : isDark ? '0.5px solid rgba(255,255,255,0.12)' : '0.5px solid rgba(255,255,255,0.70)',
    background: active
      ? `linear-gradient(180deg, ${accentColor}EE, ${accentColor}FA)`
      : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.50)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    color: active ? '#fff' : colors.textSecondary,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    transition: 'all 0.15s ease',
    fontFamily: 'inherit',
    boxShadow: active
      ? `0 1px 0 rgba(255,255,255,0.30) inset, 0 3px 12px ${accentColor}50`
      : '0 1px 0 rgba(255,255,255,0.60) inset',
    animation: justClicked === (accentColor === '#10B981' ? 'going' : 'interested') ? 'pulse 0.4s ease' : undefined,
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: isDark ? 'rgba(10, 10, 25, 0.60)' : 'rgba(20, 20, 50, 0.40)',
        backdropFilter: 'blur(16px) saturate(150%)',
        WebkitBackdropFilter: 'blur(16px) saturate(150%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 500,
        padding: '20px 16px',
        animation: 'backdropIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        className="glass glass-modal"
        style={{
          background: isDark ? 'rgba(14, 16, 34, 0.95)' : 'rgba(252, 252, 255, 0.92)',
          backdropFilter: isDark ? 'blur(56px) saturate(180%)' : 'blur(56px) saturate(200%)',
          WebkitBackdropFilter: isDark ? 'blur(56px) saturate(180%)' : 'blur(56px) saturate(200%)',
          borderRadius: 28,
          width: '100%',
          border: isDark ? '0.5px solid rgba(255,255,255,0.11)' : '0.5px solid rgba(255,255,255,0.82)',
          boxShadow: isDark
            ? '0 1px 0 rgba(255,255,255,0.09) inset, 0 -0.5px 0 rgba(0,0,0,0.55) inset, 0 32px 80px rgba(0,0,0,0.60)'
            : '0 1px 0 rgba(255,255,255,0.95) inset, 0 -0.5px 0 rgba(0,0,0,0.04) inset, 0 32px 80px rgba(50,40,120,0.22)',
          animation: 'glassModalIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          maxHeight: '88vh',
          overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Glass specular top highlight */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 60,
            background: isDark
              ? 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)'
              : 'linear-gradient(180deg, rgba(255,255,255,0.90) 0%, transparent 100%)',
            borderRadius: '28px 28px 0 0',
            pointerEvents: 'none',
          }}
        />

        <div style={{ padding: '24px 22px 28px' }}>
          {/* Top bar: category pill + close button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: cat.color,
                  background: isDark ? `${cat.color}14` : `${cat.color}10`,
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: `0.5px solid ${cat.color}30`,
                  boxShadow: '0 1px 0 rgba(255,255,255,0.50) inset',
                  padding: '4px 10px',
                  borderRadius: 10,
                }}
              >
                {cat.label}
              </span>

              {/* Live / Countdown badge */}
              {countdown.isLive ? (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: 11, fontWeight: 700, color: '#EF4444',
                  background: isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.08)',
                  border: '0.5px solid rgba(239,68,68,0.40)',
                  padding: '3px 8px', borderRadius: 8,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', display: 'inline-block', animation: 'livePulse 1.5s ease infinite' }} />
                  LIVE
                </span>
              ) : (
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  color: colors.textMuted,
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.55)',
                  border: isDark ? '0.5px solid rgba(255,255,255,0.10)' : '0.5px solid rgba(255,255,255,0.65)',
                  padding: '3px 8px', borderRadius: 8,
                  boxShadow: '0 1px 0 rgba(255,255,255,0.50) inset',
                }}>
                  {countdown.label}
                </span>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.65)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: isDark ? '0.5px solid rgba(255,255,255,0.10)' : '0.5px solid rgba(255,255,255,0.70)',
                boxShadow: '0 1px 0 rgba(255,255,255,0.50) inset',
                borderRadius: '50%',
                width: 32,
                height: 32,
                fontSize: 14,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.textMuted,
                flexShrink: 0,
                fontFamily: 'inherit',
              }}
            >
              {'\u2715'}
            </button>
          </div>

          {/* Title */}
          <h2 style={{
            margin: '0 0 6px',
            fontSize: 22,
            fontWeight: 700,
            color: colors.textPrimary,
            lineHeight: 1.25,
            letterSpacing: '-0.025em',
          }}>
            {event.title}
          </h2>

          {/* Poster line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 13, color: colors.textMuted }}>
              by {poster?.orgName || event.postedBy.name}
            </span>
            {poster?.isVerified && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 16, height: 16, borderRadius: '50%',
                background: '#7B72FF', flexShrink: 0,
              }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            )}
            {isBusiness && (
              <span style={{
                fontSize: 10, fontWeight: 700, color: '#D97706',
                background: 'rgba(245,158,11,0.12)', border: '0.5px solid rgba(245,158,11,0.40)',
                padding: '2px 6px', borderRadius: 6, letterSpacing: '0.03em',
              }}>
                PROMOTED
              </span>
            )}
            {poster?.isHostMode && !isBusiness && (
              <span style={{
                fontSize: 10, fontWeight: 700, color: '#D97706',
                background: 'rgba(245,158,11,0.12)', border: '0.5px solid rgba(245,158,11,0.40)',
                padding: '2px 6px', borderRadius: 6, letterSpacing: '0.03em',
              }}>
                HOST
              </span>
            )}
          </div>

          <Divider isDark={isDark} />

          {/* When */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>
              When
            </div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: colors.textPrimary }}>
              {formatFullDate(event.time)}
            </p>
          </div>

          {/* Location + Directions */}
          <div style={{ marginBottom: 4 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>
              Location
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: colors.textPrimary, flex: 1 }}>
                {event.location}
              </p>

              {/* Directions inline dropdown */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <button
                  onClick={() => setMapsOpen(o => !o)}
                  style={{
                    padding: '7px 12px',
                    borderRadius: 10,
                    border: isDark ? '0.5px solid rgba(255,255,255,0.12)' : '0.5px solid rgba(255,255,255,0.70)',
                    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.55)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    boxShadow: '0 1px 0 rgba(255,255,255,0.60) inset',
                    color: '#7B72FF',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    fontFamily: 'inherit',
                    whiteSpace: 'nowrap' as const,
                  }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                  Directions
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{ transform: mapsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {mapsOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    minWidth: 160,
                    borderRadius: 12,
                    overflow: 'hidden',
                    border: isDark ? '0.5px solid rgba(255,255,255,0.10)' : '0.5px solid rgba(255,255,255,0.70)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                    animation: 'fadeInDown 0.15s ease both',
                    zIndex: 10,
                  }}>
                    {[
                      { label: 'Google Maps', url: googleMapsUrl },
                      { label: 'Apple Maps', url: appleMapsUrl },
                    ].map((opt, i) => (
                      <button
                        key={opt.label}
                        onClick={() => { window.open(opt.url, '_blank'); setMapsOpen(false); }}
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          border: 'none',
                          borderTop: i > 0
                            ? isDark ? '0.5px solid rgba(255,255,255,0.06)' : '0.5px solid rgba(100,80,200,0.10)'
                            : 'none',
                          background: isDark ? 'rgba(25,27,50,0.96)' : 'rgba(248,248,255,0.96)',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                          color: colors.textPrimary,
                          fontSize: 13,
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          fontFamily: 'inherit',
                          textAlign: 'left' as const,
                        }}
                      >
                        {opt.label}
                        <svg style={{ marginLeft: 'auto' }} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Note / About */}
          {event.note && (
            <>
              <Divider isDark={isDark} />
              <div style={{ fontSize: 12, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>
                About
              </div>
              <p style={{
                margin: 0,
                fontSize: 14,
                color: colors.textSecondary,
                lineHeight: 1.6,
                fontWeight: 400,
              }}>
                {event.note}
              </p>
            </>
          )}

          {/* Add Photos / Videos button */}
          {onUpload && (
            <>
              <Divider isDark={isDark} />
              <button
                onClick={() => onUpload(event.id)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
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
                  boxShadow: '0 1px 0 rgba(255,255,255,0.22) inset',
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
            </>
          )}

          <Divider isDark={isDark} />

          {/* Going — collapsible */}
          <CollapsibleSection
            label="Going"
            count={event.going.length}
            isDark={isDark}
            colors={colors}
          >
            {event.going.length === 0 ? (
              <p style={{ margin: 0, fontSize: 13, color: colors.textMuted }}>No one yet — be the first!</p>
            ) : (
              event.going.map(attendee => (
                <div key={attendee.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0' }}>
                  <UserAvatar
                    name={attendee.name}
                    size={32}
                    ring={attendee.id === currentUser.id}
                    ringColor="#7B72FF"
                    friendBadge={friendIds.has(attendee.id)}
                  />
                  <span style={{ fontSize: 14, color: colors.textPrimary, fontWeight: attendee.id === currentUser.id ? 600 : 400 }}>
                    {attendee.id === currentUser.id ? 'You' : attendee.name}
                  </span>
                  {friendIds.has(attendee.id) && (
                    <span style={{ fontSize: 11, color: '#7B72FF', fontWeight: 600, marginLeft: 'auto' }}>friend</span>
                  )}
                </div>
              ))
            )}
          </CollapsibleSection>

          {/* Interested — collapsible */}
          {event.interested.length > 0 && (
            <>
              <div style={{ height: 14 }} />
              <CollapsibleSection
                label="Interested"
                count={event.interested.length}
                isDark={isDark}
                colors={colors}
              >
                {event.interested.map(attendee => (
                  <div key={attendee.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0' }}>
                    <UserAvatar
                      name={attendee.name}
                      size={32}
                      ring={attendee.id === currentUser.id}
                      ringColor="#7B72FF"
                      friendBadge={friendIds.has(attendee.id)}
                    />
                    <span style={{ fontSize: 14, color: colors.textPrimary, fontWeight: attendee.id === currentUser.id ? 600 : 400 }}>
                      {attendee.id === currentUser.id ? 'You' : attendee.name}
                    </span>
                    {friendIds.has(attendee.id) && (
                      <span style={{ fontSize: 11, color: '#7B72FF', fontWeight: 600, marginLeft: 'auto' }}>friend</span>
                    )}
                  </div>
                ))}
              </CollapsibleSection>
            </>
          )}

          <Divider isDark={isDark} />

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleGoingClick} style={glassBtn(isGoing, '#10B981')}>
              {isGoing ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Going
                </>
              ) : "I'm Going"}
            </button>

            <button onClick={handleInterestedClick} style={glassBtn(isInterested, '#7B72FF')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill={isInterested ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {isInterested ? `Interested · ${event.interested.length}` : 'Interested'}
            </button>
          </div>

          {/* Report event */}
          {onReportEvent && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}>
              <button
                onClick={() => onReportEvent(event.title)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.textMuted,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '4px 8px',
                  borderRadius: 8,
                  transition: 'all 0.15s ease',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
                Report Event
              </button>
            </div>
          )}

          {/* Host stat strip — visible only to hosts */}
          {userRole === 'host' && (
            <>
              <Divider isDark={isDark} />
              <div style={{
                display: 'flex',
                gap: 0,
                borderRadius: 14,
                overflow: 'hidden',
                border: isDark ? '0.5px solid rgba(245,158,11,0.20)' : '0.5px solid rgba(245,158,11,0.15)',
                background: isDark ? 'rgba(245,158,11,0.06)' : 'rgba(245,158,11,0.04)',
              }}>
                {[
                  { label: 'Impressions', value: Math.floor((event.going.length + event.interested.length) * 3.2) },
                  { label: 'Going', value: event.going.length },
                  { label: 'Interested', value: event.interested.length },
                  { label: 'Friends', value: event.going.filter(a => friendIds.has(a.id)).length + event.interested.filter(a => friendIds.has(a.id)).length },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      padding: '10px 4px',
                      borderRight: i < 3 ? `0.5px solid ${isDark ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.12)'}` : 'none',
                    }}
                  >
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#D97706', lineHeight: 1 }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: 9, fontWeight: 600, color: colors.textMuted, marginTop: 3, textTransform: 'uppercase' as const, letterSpacing: '0.04em' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Host approval queue — only visible to host for their own events */}
          {userRole === 'host' && onApproveMedia && onRejectMedia && onRemoveFromReel && (
            <HostApprovalQueue
              event={event}
              currentUser={currentUser}
              onApprove={(mediaId) => onApproveMedia(event.id, mediaId)}
              onReject={(mediaId) => onRejectMedia(event.id, mediaId)}
              onRemoveFromReel={(mediaId) => onRemoveFromReel(event.id, mediaId)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
