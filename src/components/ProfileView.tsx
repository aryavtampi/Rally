import React, { useState } from 'react';
import { EventItem, CurrentUser, AppTab } from '../types';
import UserAvatar from './UserAvatar';
import { useTheme } from '../contexts/ThemeContext';

interface ProfileViewProps {
  currentUser: CurrentUser;
  events: EventItem[];
  friendIds: Set<string>;
  onResetDemo: () => void;
  userRole: 'host' | 'attendee';
  onNavigate: (tab: AppTab) => void;
  onShowCreate: () => void;
}


const ProfileView: React.FC<ProfileViewProps> = ({ currentUser, events, friendIds, onResetDemo, userRole, onNavigate, onShowCreate }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const goingCount = events.filter((e) => e.going.some((a) => a.id === currentUser.id)).length;
  const postedCount = events.filter((e) => e.postedBy.id === currentUser.id).length;

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <div
        style={{
          padding: '16px 20px 12px',
          background: isDark
            ? 'rgba(16, 17, 34, 0.72)'
            : 'rgba(255, 255, 255, 0.62)',
          backdropFilter: isDark
            ? 'blur(40px) saturate(150%)'
            : 'blur(40px) saturate(200%)',
          WebkitBackdropFilter: isDark
            ? 'blur(40px) saturate(150%)'
            : 'blur(40px) saturate(200%)',
          borderBottom: isDark
            ? '0.5px solid rgba(255,255,255,0.08)'
            : '0.5px solid rgba(255,255,255,0.70)',
          boxShadow: isDark
            ? '0 1px 0 rgba(255,255,255,0.06) inset, 0 4px 16px rgba(0,0,0,0.20)'
            : '0 1px 0 rgba(255,255,255,0.90) inset, 0 4px 16px rgba(100,80,200,0.06)',
        }}
      >
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: colors.textPrimary, letterSpacing: '-0.02em' }}>
          Profile
        </h2>
      </div>

      <div style={{ padding: '24px 20px 80px' }}>
        {/* Profile card */}
        <div
          style={{
            background: isDark ? 'rgba(28,30,55,0.65)' : 'rgba(255,255,255,0.58)',
            backdropFilter: isDark ? 'blur(28px) saturate(150%)' : 'blur(28px) saturate(180%)',
            WebkitBackdropFilter: isDark ? 'blur(28px) saturate(150%)' : 'blur(28px) saturate(180%)',
            borderRadius: 20,
            padding: '24px 24px',
            textAlign: 'center',
            boxShadow: isDark
              ? '0 1px 0 rgba(255,255,255,0.08) inset, 0 8px 32px rgba(0,0,0,0.30)'
              : '0 1px 0 rgba(255,255,255,0.90) inset, 0 6px 28px rgba(100,80,200,0.10)',
            border: isDark
              ? '0.5px solid rgba(255,255,255,0.10)'
              : '0.5px solid rgba(255,255,255,0.75)',
            marginBottom: 16,
            animation: 'fadeInUp 0.5s ease both',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <UserAvatar name={currentUser.name} size={72} ring ringColor="#6C63FF" />
          </div>
          <h3 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 600, color: colors.textPrimary }}>
            {currentUser.name}
          </h3>
          <p style={{ margin: 0, fontSize: 13, color: colors.textMuted, fontWeight: 500 }}>
            {userRole === 'host' ? 'Event Organizer' : 'Oxford College Student'}
          </p>

          {userRole === 'host' && (
            <span style={{
              display: 'inline-block',
              marginTop: 8,
              fontSize: 10,
              fontWeight: 700,
              color: '#D97706',
              background: 'rgba(245,158,11,0.12)',
              border: '0.5px solid rgba(245,158,11,0.40)',
              padding: '3px 10px',
              borderRadius: 8,
              letterSpacing: '0.05em',
              textTransform: 'uppercase' as const,
            }}>
              HOST MODE
            </span>
          )}

          {/* Stats */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 32,
              marginTop: 20,
              paddingTop: 20,
              borderTop: `1px solid ${isDark ? 'rgba(51,65,85,0.3)' : 'rgba(0,0,0,0.06)'}`,
            }}
          >
            {(userRole === 'host'
              ? [
                  { label: 'Posted', value: postedCount },
                  { label: 'Total Going', value: events.filter(e => e.postedBy.id === currentUser.id).reduce((sum, e) => sum + e.going.length, 0) },
                  { label: 'Friends', value: friendIds.size },
                ]
              : [
                  { label: 'Going', value: goingCount },
                  { label: 'Posted', value: postedCount },
                  { label: 'Friends', value: friendIds.size },
                ]
            ).map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 600, color: colors.textPrimary, lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 12, color: colors.textMuted, fontWeight: 500, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Host Mode CTA — only for hosts */}
        {userRole === 'host' && (
          <div
            style={{
              background: isDark
                ? 'linear-gradient(145deg, rgba(123,114,255,0.18), rgba(100,90,240,0.10))'
                : 'linear-gradient(145deg, rgba(123,114,255,0.12), rgba(100,90,240,0.06))',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: 18,
              padding: '20px',
              marginBottom: 16,
              border: isDark
                ? '0.5px solid rgba(123,114,255,0.25)'
                : '0.5px solid rgba(123,114,255,0.20)',
              boxShadow: isDark
                ? '0 1px 0 rgba(255,255,255,0.08) inset, 0 6px 24px rgba(123,114,255,0.15)'
                : '0 1px 0 rgba(255,255,255,0.80) inset, 0 6px 24px rgba(123,114,255,0.12)',
              animation: 'fadeInUp 0.5s ease 0.05s both',
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary, marginBottom: 4, letterSpacing: '-0.01em' }}>
              Host Dashboard
            </div>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: colors.textMuted, lineHeight: 1.5 }}>
              Create events, manage your posts, and track engagement.
            </p>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={onShowCreate}
                className="btn-press"
                style={{
                  flex: 1,
                  padding: '11px 14px',
                  borderRadius: 14,
                  border: 'none',
                  background: 'linear-gradient(180deg, rgba(123,114,255,0.92), rgba(108,99,240,0.96))',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  boxShadow: '0 1px 0 rgba(255,255,255,0.30) inset, 0 4px 14px rgba(123,114,255,0.40)',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Create Event
              </button>
              <button
                onClick={() => onNavigate('feed')}
                className="btn-press"
                style={{
                  flex: 1,
                  padding: '11px 14px',
                  borderRadius: 14,
                  border: isDark ? '0.5px solid rgba(255,255,255,0.12)' : '0.5px solid rgba(255,255,255,0.70)',
                  background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.55)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  color: colors.textSecondary,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  boxShadow: '0 1px 0 rgba(255,255,255,0.50) inset',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" />
                </svg>
                View Feed
              </button>
            </div>
          </div>
        )}

        {/* Settings */}
        <div
          style={{
            background: isDark ? 'rgba(28,30,55,0.60)' : 'rgba(255,255,255,0.55)',
            backdropFilter: isDark ? 'blur(24px)' : 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: isDark ? 'blur(24px)' : 'blur(24px) saturate(180%)',
            borderRadius: 18,
            overflow: 'hidden',
            boxShadow: isDark
              ? '0 1px 0 rgba(255,255,255,0.06) inset, 0 4px 16px rgba(0,0,0,0.25)'
              : '0 1px 0 rgba(255,255,255,0.80) inset, 0 4px 16px rgba(100,80,200,0.07)',
            border: isDark
              ? '0.5px solid rgba(255,255,255,0.08)'
              : '0.5px solid rgba(255,255,255,0.72)',
            animation: 'fadeInUp 0.5s ease 0.1s both',
          }}
        >
          {/* Dark mode toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: `1px solid ${isDark ? 'rgba(51,65,85,0.3)' : 'rgba(0,0,0,0.06)'}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isDark ? colors.textMuted : colors.textMuted} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                {isDark ? (
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                ) : (
                  <>
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </>
                )}
              </svg>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>Dark Mode</div>
                <div style={{ fontSize: 12, color: colors.textMuted }}>{isDark ? 'On' : 'Off'}</div>
              </div>
            </div>
            <div
              onClick={toggleTheme}
              style={{
                width: 48,
                height: 26,
                borderRadius: 13,
                background: isDark ? '#6C63FF' : '#e2e8f0',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: '#fff',
                  position: 'absolute',
                  top: 3,
                  left: isDark ? 25 : 3,
                  transition: 'left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                }}
              />
            </div>
          </div>

          {/* Notifications setting (decorative) */}
          <div
            className="settings-row"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: `1px solid ${isDark ? 'rgba(51,65,85,0.3)' : 'rgba(0,0,0,0.06)'}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>Notifications</div>
                <div style={{ fontSize: 12, color: colors.textMuted }}>Push & email</div>
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>

          {/* Privacy setting (decorative) */}
          <div
            className="settings-row"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>Privacy</div>
                <div style={{ fontSize: 12, color: colors.textMuted }}>Manage your data</div>
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>

        {/* Reset demo */}
        <button
          onClick={() => setShowResetConfirm(true)}
          className="btn-press"
          style={{
            width: '100%',
            marginTop: 24,
            padding: '14px 20px',
            borderRadius: 14,
            border: isDark
              ? '1px solid rgba(239,68,68,0.20)'
              : '1px solid rgba(239,68,68,0.12)',
            background: isDark
              ? 'rgba(239,68,68,0.08)'
              : 'rgba(239,68,68,0.04)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.15s ease',
            animation: 'fadeInUp 0.5s ease 0.2s both',
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: isDark ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#EF4444' }}>Reset demo</div>
            <div style={{ fontSize: 12, color: colors.textMuted }}>Clear all data and restart onboarding</div>
          </div>
        </button>

      </div>

      {/* Reset confirmation modal */}
      {showResetConfirm && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            animation: 'backdropIn 0.2s ease both',
          }}
        >
          {/* Backdrop */}
          <div
            onClick={() => setShowResetConfirm(false)}
            style={{
              position: 'absolute',
              inset: 0,
              background: isDark
                ? 'rgba(0,0,0,0.60)'
                : 'rgba(0,0,0,0.30)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          />

          {/* Modal */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 320,
              background: isDark
                ? 'rgba(20,22,42,0.95)'
                : 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(40px) saturate(200%)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%)',
              borderRadius: 22,
              padding: '28px 24px 20px',
              border: isDark
                ? '0.5px solid rgba(255,255,255,0.10)'
                : '0.5px solid rgba(255,255,255,0.80)',
              boxShadow: isDark
                ? '0 1px 0 rgba(255,255,255,0.08) inset, 0 24px 64px rgba(0,0,0,0.55)'
                : '0 1px 0 rgba(255,255,255,0.95) inset, 0 24px 64px rgba(60,40,160,0.20)',
              animation: 'modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both',
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: isDark ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.08)',
                border: isDark ? '1px solid rgba(239,68,68,0.20)' : '1px solid rgba(239,68,68,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
            </div>

            <h3 style={{ margin: '0 0 8px', fontSize: 19, fontWeight: 700, color: colors.textPrimary, letterSpacing: '-0.01em' }}>
              Reset demo?
            </h3>
            <p style={{ margin: '0 0 24px', fontSize: 14, color: colors.textMuted, lineHeight: 1.5 }}>
              This will clear your profile, preferences, and event activity and restart onboarding.
            </p>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="btn-press"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 14,
                  border: isDark
                    ? '1px solid rgba(255,255,255,0.10)'
                    : '1px solid rgba(0,0,0,0.06)',
                  background: isDark
                    ? 'rgba(255,255,255,0.06)'
                    : 'rgba(0,0,0,0.04)',
                  color: colors.textPrimary,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s ease',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  onResetDemo();
                }}
                className="btn-press"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 14,
                  border: 'none',
                  background: 'linear-gradient(180deg, #EF4444 0%, #DC2626 100%)',
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.20) inset, 0 4px 16px rgba(239,68,68,0.30)',
                  transition: 'all 0.15s ease',
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
