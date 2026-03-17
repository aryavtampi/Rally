import React from 'react';
import { AppTab } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const TABS: { key: AppTab; label: string; icon: (active: boolean, color: string) => React.ReactNode }[] = [
  {
    key: 'feed',
    label: 'Feed',
    icon: (active, color) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? color : 'none'} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
  },
  {
    key: 'myevents',
    label: 'My Events',
    icon: (active, color) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? color : 'none'} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    key: 'highlights',
    label: 'Highlights',
    icon: (active, color) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Film strip tail sticking out bottom-right */}
        <rect x="14" y="17" width="8" height="5" rx="1" fill={active ? `${color}25` : 'none'} />
        <line x1="16" y1="17" x2="16" y2="22" />
        <line x1="18" y1="17" x2="18" y2="22" />
        <line x1="20" y1="17" x2="20" y2="22" />
        {/* Reel circle */}
        <circle cx="10" cy="11" r="8" fill={active ? `${color}15` : 'none'} />
        {/* Outer ring detail */}
        <circle cx="10" cy="11" r="8" />
        {/* Inner hub */}
        <circle cx="10" cy="11" r="3" fill={active ? color : 'none'} />
        {/* Sprocket holes — 6 around the ring */}
        <circle cx="10" cy="3.5" r="1" fill={color} stroke="none" />
        <circle cx="16.5" cy="7" r="1" fill={color} stroke="none" />
        <circle cx="16.5" cy="15" r="1" fill={color} stroke="none" />
        <circle cx="10" cy="18.5" r="1" fill={color} stroke="none" />
        <circle cx="3.5" cy="15" r="1" fill={color} stroke="none" />
        <circle cx="3.5" cy="7" r="1" fill={color} stroke="none" />
      </svg>
    ),
  },
  {
    key: 'friends',
    label: 'Friends',
    icon: (active, color) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" fill={active ? `${color}20` : 'none'} /><circle cx="9" cy="7" r="4" fill={active ? `${color}20` : 'none'} /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    key: 'profile',
    label: 'Profile',
    icon: (active, color) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" fill={active ? `${color}20` : 'none'} />
      </svg>
    ),
  },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { colors, isDark } = useTheme();

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 72,
        background: isDark
          ? 'rgba(16, 17, 34, 0.65)'
          : 'rgba(255, 255, 255, 0.58)',
        backdropFilter: isDark
          ? 'blur(40px) saturate(150%)'
          : 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: isDark
          ? 'blur(40px) saturate(150%)'
          : 'blur(40px) saturate(180%)',
        borderTop: isDark
          ? '0.5px solid rgba(255, 255, 255, 0.10)'
          : '0.5px solid rgba(255, 255, 255, 0.80)',
        boxShadow: isDark
          ? '0 1px 0 rgba(255,255,255,0.06) inset, 0 -0.5px 0 rgba(0,0,0,0.30) inset, 0 -8px 40px rgba(0,0,0,0.35), 0 -1px 0 rgba(255,255,255,0.04)'
          : '0 1px 0 rgba(255,255,255,0.90) inset, 0 -0.5px 0 rgba(0,0,0,0.04) inset, 0 -8px 40px rgba(80,60,200,0.08), 0 -1px 0 rgba(255,255,255,0.60)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 200,
        paddingBottom: 6,
        overflow: 'hidden',
      }}
    >
      {/* Liquid glass specular highlight — curved-glass top gleam */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: isDark
            ? 'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 45%, transparent 65%)'
            : 'linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.12) 45%, transparent 65%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        const iconColor = isActive ? '#7B72FF' : colors.textMuted;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 10px',
              color: iconColor,
              transition: 'color 0.2s ease',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Frosted capsule behind active icon */}
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: isActive ? '6px 10px' : '2px',
                borderRadius: isActive ? 12 : 0,
                background: isActive
                  ? isDark
                    ? 'rgba(123, 114, 255, 0.18)'
                    : 'rgba(123, 114, 255, 0.10)'
                  : 'transparent',
                boxShadow: isActive
                  ? isDark
                    ? '0 1px 0 rgba(255,255,255,0.10) inset, 0 2px 8px rgba(123,114,255,0.20)'
                    : '0 1px 0 rgba(255,255,255,0.60) inset, 0 2px 8px rgba(123,114,255,0.15)'
                  : 'none',
                border: isActive
                  ? isDark
                    ? '0.5px solid rgba(123,114,255,0.25)'
                    : '0.5px solid rgba(123,114,255,0.20)'
                  : 'none',
                transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {tab.icon(isActive, iconColor)}
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#7B72FF' : colors.textMuted,
                opacity: isActive ? 1 : 0.75,
                transition: 'color 0.2s ease, opacity 0.2s ease',
                letterSpacing: '-0.01em',
              }}
            >
              {tab.label}
            </span>
            {/* Active indicator — glowing bottom capsule */}
            {isActive && (
              <div style={{
                position: 'absolute',
                bottom: -6,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 24,
                height: 3,
                borderRadius: 9999,
                background: 'linear-gradient(90deg, #7B72FF, #A09BFF)',
                boxShadow: '0 0 8px rgba(123, 114, 255, 0.60), 0 0 2px rgba(123, 114, 255, 0.40)',
                animation: 'pillExpand 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both',
              }} />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
