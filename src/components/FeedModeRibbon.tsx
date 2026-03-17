import React from 'react';
import { FeedMode } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface FeedModeRibbonProps {
  activeMode: FeedMode;
  onModeChange: (mode: FeedMode) => void;
}

const MODES: { key: FeedMode; label: string }[] = [
  { key: 'trending', label: 'Trending' },
  { key: 'friends', label: 'Friends' },
  { key: 'foryou', label: 'For You' },
];

const FeedModeRibbon: React.FC<FeedModeRibbonProps> = ({ activeMode, onModeChange }) => {
  const { colors, isDark } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        gap: 6,
        marginBottom: 6,
        animation: 'fadeInUp 0.4s ease 0.08s both',
      }}
    >
      {MODES.map((mode) => {
        const isActive = activeMode === mode.key;
        return (
          <button
            key={mode.key}
            onClick={() => onModeChange(mode.key)}
            className="btn-press"
            style={{
              padding: '4px 10px',
              borderRadius: 14,
              border: 'none',
              background: 'transparent',
              fontSize: 12,
              fontWeight: isActive ? 600 : 400,
              color: isActive
                ? '#7B72FF'
                : isDark
                  ? 'rgba(255,255,255,0.40)'
                  : 'rgba(0,0,0,0.36)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'color 0.18s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              boxShadow: 'none',
              opacity: isActive ? 1 : 0.85,
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
  );
};

export default FeedModeRibbon;
