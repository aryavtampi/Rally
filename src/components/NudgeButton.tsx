import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface NudgeButtonProps {
  friendCount: number;
  onNudge: () => void;
}

const NudgeButton: React.FC<NudgeButtonProps> = ({ friendCount, onNudge }) => {
  const [nudged, setNudged] = useState(false);
  const { colors, isDark } = useTheme();

  if (friendCount === 0) return null;

  const handleClick = () => {
    if (nudged) return;
    setNudged(true);
    onNudge();
    setTimeout(() => setNudged(false), 3000);
  };

  return (
    <button
      onClick={(e) => { e.stopPropagation(); handleClick(); }}
      className="btn-press"
      title="Nudge friends"
      style={{
        height: 36,
        padding: '0 14px',
        borderRadius: 12,
        border: isDark
          ? '0.5px solid rgba(255,255,255,0.10)'
          : '0.5px solid rgba(255,255,255,0.55)',
        background: nudged
          ? (isDark ? 'rgba(123,114,255,0.12)' : 'rgba(123,114,255,0.08)')
          : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.50)'),
        backdropFilter: 'blur(12px) saturate(160%)',
        WebkitBackdropFilter: 'blur(12px) saturate(160%)',
        fontSize: 13,
        fontWeight: 500,
        cursor: nudged ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        flexShrink: 0,
        transition: 'all 0.2s ease',
        color: nudged ? '#7B72FF' : (isDark ? colors.textMuted : '#6B7280'),
        fontFamily: 'inherit',
        marginLeft: 'auto',
        animation: nudged ? 'pulse 0.3s ease' : undefined,
        boxShadow: nudged
          ? (isDark
              ? '0 0.5px 0 rgba(255,255,255,0.06) inset, 0 2px 8px rgba(123,114,255,0.15)'
              : '0 1px 0 rgba(255,255,255,0.80) inset, 0 2px 8px rgba(123,114,255,0.10)')
          : (isDark
              ? '0 0.5px 0 rgba(255,255,255,0.06) inset'
              : '0 1px 0 rgba(255,255,255,0.80) inset, 0 1px 4px rgba(100,80,200,0.06)'),
      }}
    >
      {nudged ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Sent!
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          Nudge
        </>
      )}
    </button>
  );
};

export default NudgeButton;
