import React from 'react';
import { EventItem, HighlightMedia, CurrentUser } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface HostApprovalQueueProps {
  event: EventItem;
  currentUser: CurrentUser;
  onApprove: (mediaId: string) => void;
  onReject: (mediaId: string) => void;
  onRemoveFromReel: (mediaId: string) => void;
}

const timeAgo = (ts: number): string => {
  const diff = Date.now() - ts;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor(diff / 60000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return `${mins}m ago`;
};

const HostApprovalQueue: React.FC<HostApprovalQueueProps> = ({
  event,
  currentUser,
  onApprove,
  onReject,
  onRemoveFromReel,
}) => {
  const { colors, isDark } = useTheme();

  // Only render for host
  if (event.postedBy.id !== currentUser.id) return null;

  const pending = event.pendingMedia ?? [];
  const approved = event.approvedMedia ?? [];

  // Nothing to show if no media at all
  if (pending.length === 0 && approved.length === 0) return null;

  const darken = (hex: string): string => {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, (num >> 16) - 40);
    const g = Math.max(0, ((num >> 8) & 0xff) - 40);
    const b = Math.max(0, (num & 0xff) - 40);
    return `rgb(${r},${g},${b})`;
  };

  const MediaTile: React.FC<{ media: HighlightMedia; dimmed?: boolean }> = ({ media, dimmed }) => (
    <div
      style={{
        width: 72,
        height: 72,
        borderRadius: 12,
        background: `linear-gradient(145deg, ${media.color}, ${darken(media.color)})`,
        flexShrink: 0,
        opacity: dimmed ? 0.65 : 1,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Gloss */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.28) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />
      {/* Type icon */}
      {media.type === 'video' && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(255,255,255,0.85)" stroke="none">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      )}
    </div>
  );

  const dividerStyle = {
    borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
    margin: '16px 0',
  };

  return (
    <div style={{ marginTop: 8 }}>
      <div style={dividerStyle} />

      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Media
        </span>
        {pending.length > 0 && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: '#F59E0B',
              background: isDark ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.12)',
              border: '0.5px solid rgba(245,158,11,0.30)',
              borderRadius: 6,
              padding: '1px 7px',
            }}
          >
            {pending.length} pending
          </span>
        )}
        {approved.length > 0 && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: '#7B72FF',
              background: isDark ? 'rgba(123,114,255,0.15)' : 'rgba(123,114,255,0.10)',
              border: '0.5px solid rgba(123,114,255,0.25)',
              borderRadius: 6,
              padding: '1px 7px',
            }}
          >
            {approved.length} in reel
          </span>
        )}
      </div>

      {/* Pending review */}
      {pending.length > 0 && (
        <div style={{ marginBottom: approved.length > 0 ? 16 : 0 }}>
          <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: '#F59E0B' }}>
            Pending Review
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pending.map((media) => (
              <div
                key={media.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: isDark ? 'rgba(245,158,11,0.06)' : 'rgba(245,158,11,0.04)',
                  border: '0.5px solid rgba(245,158,11,0.18)',
                  borderRadius: 14,
                  padding: '10px 12px',
                }}
              >
                <MediaTile media={media} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: media.type === 'video' ? '#6C63FF' : '#10B981',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {media.type}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 600, color: colors.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {media.uploadedBy.name}
                  </p>
                  {media.caption && (
                    <p style={{ margin: '0 0 2px', fontSize: 12, color: colors.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      "{media.caption}"
                    </p>
                  )}
                  <p style={{ margin: 0, fontSize: 11, color: colors.textMuted }}>
                    {timeAgo(media.uploadedAt)}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                  {/* Approve */}
                  <button
                    onClick={() => onApprove(media.id)}
                    title="Add to reel"
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      border: '0.5px solid rgba(16,185,129,0.35)',
                      background: isDark ? 'rgba(16,185,129,0.16)' : 'rgba(16,185,129,0.10)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'inherit',
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </button>
                  {/* Reject */}
                  <button
                    onClick={() => onReject(media.id)}
                    title="Dismiss"
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      border: '0.5px solid rgba(239,68,68,0.30)',
                      background: isDark ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.07)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'inherit',
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* In reel */}
      {approved.length > 0 && (
        <div>
          <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: '#7B72FF' }}>
            In Reel
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {approved.map((media) => (
              <div
                key={media.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: isDark ? 'rgba(123,114,255,0.06)' : 'rgba(123,114,255,0.04)',
                  border: '0.5px solid rgba(123,114,255,0.15)',
                  borderRadius: 14,
                  padding: '10px 12px',
                }}
              >
                <MediaTile media={media} dimmed />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: media.type === 'video' ? '#6C63FF' : '#10B981',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {media.type}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 600, color: colors.textPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {media.uploadedBy.name}
                  </p>
                  {media.caption && (
                    <p style={{ margin: '0 0 2px', fontSize: 12, color: colors.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      "{media.caption}"
                    </p>
                  )}
                </div>
                {/* Remove from reel */}
                <button
                  onClick={() => onRemoveFromReel(media.id)}
                  title="Remove from reel"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 9,
                    border: isDark ? '0.5px solid rgba(255,255,255,0.12)' : '0.5px solid rgba(0,0,0,0.08)',
                    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontFamily: 'inherit',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HostApprovalQueue;
