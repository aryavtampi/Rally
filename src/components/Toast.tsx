import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ToastProps {
  message: string;
  emoji?: string;
  visible: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, emoji, visible }) => {
  const { isDark } = useTheme();

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
        zIndex: 300,
        background: isDark ? 'rgba(240, 241, 255, 0.95)' : 'rgba(14, 16, 34, 0.90)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderRadius: 14,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        overflow: 'hidden',
        border: isDark ? '0.5px solid rgba(255,255,255,0.70)' : '0.5px solid rgba(255,255,255,0.18)',
        boxShadow: isDark
          ? '0 1px 0 rgba(255,255,255,0.70) inset, 0 10px 28px rgba(0,0,0,0.22)'
          : '0 1px 0 rgba(255,255,255,0.18) inset, 0 10px 28px rgba(0,0,0,0.40)',
        animation: 'fadeInDown 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both',
      }}
    >
      {/* Gloss overlay */}
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: isDark
          ? 'linear-gradient(158deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.04) 38%, transparent 62%)'
          : 'linear-gradient(158deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.02) 38%, transparent 62%)',
        borderRadius: 'inherit',
      }} />
      <span style={{ color: isDark ? '#1A1B2E' : '#F0F1FF', fontSize: 14, fontWeight: 600, letterSpacing: 0, position: 'relative' }}>
        {message}
      </span>
    </div>
  );
};

export default Toast;
