import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface UserAvatarProps {
  name: string;
  avatarUrl?: string;
  size?: number;
  ring?: boolean;
  ringColor?: string;
  friendBadge?: boolean;
}

const GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
  'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
];

const UserAvatar: React.FC<UserAvatarProps> = ({ name, avatarUrl, size = 32, ring = false, ringColor, friendBadge = false }) => {
  const { colors, isDark } = useTheme();
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const gradientIndex = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % GRADIENTS.length;

  if (avatarUrl) {
    return (
      <div style={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
        <div
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            flexShrink: 0,
            border: ring ? `2.5px solid ${ringColor || '#6C63FF'}` : undefined,
            padding: ring ? 2 : undefined,
          }}
        >
          <img
            src={avatarUrl}
            alt={name}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        </div>
        {friendBadge && (
          <div style={{
            position: 'absolute',
            bottom: -1,
            right: -1,
            width: Math.max(10, size * 0.32),
            height: Math.max(10, size * 0.32),
            borderRadius: '50%',
            background: '#10b981',
            border: `2px solid ${isDark ? colors.bgCard : '#fff'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: Math.max(6, size * 0.18), color: '#fff', lineHeight: 1 }}>{'\u2605'}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
      <div
        title={name}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: GRADIENTS[gradientIndex],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 700,
          fontSize: size * 0.36,
          flexShrink: 0,
          letterSpacing: '-0.02em',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          border: ring ? `2.5px solid ${ringColor || '#6C63FF'}` : `2.5px solid ${isDark ? colors.bgCard : '#fff'}`,
        }}
      >
        {initials}
      </div>
      {friendBadge && (
        <div style={{
          position: 'absolute',
          bottom: -1,
          right: -1,
          width: Math.max(10, size * 0.32),
          height: Math.max(10, size * 0.32),
          borderRadius: '50%',
          background: '#10b981',
          border: '2px solid #fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ fontSize: Math.max(6, size * 0.18), color: '#fff', lineHeight: 1 }}>{'\u2605'}</span>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
