import React, { useState } from 'react';
import { EventItem } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface MediaUploadSheetProps {
  event: EventItem;
  onClose: () => void;
  onUpload: (type: 'photo' | 'video', caption: string) => void;
}

const MediaUploadSheet: React.FC<MediaUploadSheetProps> = ({ event, onClose, onUpload }) => {
  const { colors, isDark } = useTheme();
  const [selectedType, setSelectedType] = useState<'photo' | 'video' | null>(null);
  const [caption, setCaption] = useState('');

  // Uploads only allowed once event has started (isPast events always qualify)
  const eventStart = new Date(event.time).getTime();
  const isLiveOrOver = event.isPast || Date.now() >= eventStart;

  const handleSubmit = () => {
    if (!selectedType || !isLiveOrOver) return;
    onUpload(selectedType, caption.trim());
    onClose();
  };

  return (
    /* Backdrop */
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        zIndex: 500,
        display: 'flex',
        alignItems: 'flex-end',
        animation: 'fadeIn 0.2s ease both',
      }}
    >
      {/* Sheet */}
      <div
        className="glass glass-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          background: isDark ? 'rgba(14, 16, 34, 0.97)' : 'rgba(252, 252, 255, 0.97)',
          backdropFilter: 'blur(56px) saturate(200%)',
          WebkitBackdropFilter: 'blur(56px) saturate(200%)',
          borderRadius: '24px 24px 0 0',
          padding: '24px 20px 32px',
          border: isDark ? '0.5px solid rgba(255,255,255,0.11)' : '0.5px solid rgba(255,255,255,0.82)',
          borderBottom: 'none',
          boxShadow: isDark
            ? '0 1px 0 rgba(255,255,255,0.09) inset, 0 -32px 80px rgba(0,0,0,0.60)'
            : '0 1px 0 rgba(255,255,255,0.95) inset, 0 -32px 80px rgba(50,40,120,0.18)',
          animation: 'slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        }}
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 9999,
              background: isDark ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.15)',
            }}
          />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 700, color: colors.textPrimary, letterSpacing: '-0.02em' }}>
              Share a moment
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: colors.textMuted }}>
              from {event.title}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: isDark ? '0.5px solid rgba(255,255,255,0.12)' : '0.5px solid rgba(0,0,0,0.08)',
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontFamily: 'inherit',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Locked state — event hasn't started yet */}
        {!isLiveOrOver ? (
          <div
            style={{
              textAlign: 'center',
              padding: '28px 16px 8px',
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                border: isDark ? '0.5px solid rgba(255,255,255,0.10)' : '0.5px solid rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <p style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: colors.textPrimary }}>
              Not available yet
            </p>
            <p style={{ margin: 0, fontSize: 13, color: colors.textMuted, lineHeight: 1.5 }}>
              You can share photos and videos once the event is live or has ended.
            </p>
          </div>
        ) : (
          <>
            {/* Type selector */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {(['photo', 'video'] as const).map((type) => {
                const active = selectedType === type;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    style={{
                      padding: '18px 12px',
                      borderRadius: 16,
                      border: active
                        ? '1.5px solid rgba(123,114,255,0.70)'
                        : isDark ? '0.5px solid rgba(255,255,255,0.12)' : '0.5px solid rgba(0,0,0,0.08)',
                      background: active
                        ? isDark ? 'rgba(123,114,255,0.20)' : 'rgba(123,114,255,0.10)'
                        : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                      transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      transform: active ? 'scale(1.02)' : 'scale(1)',
                      fontFamily: 'inherit',
                      boxShadow: active
                        ? isDark
                          ? '0 1px 0 rgba(255,255,255,0.10) inset, 0 4px 16px rgba(123,114,255,0.25)'
                          : '0 1px 0 rgba(255,255,255,0.80) inset, 0 4px 16px rgba(123,114,255,0.15)'
                        : 'none',
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: active ? 'rgba(123,114,255,0.20)' : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {type === 'photo' ? (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#7B72FF' : colors.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      ) : (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#7B72FF' : colors.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="23 7 16 12 23 17 23 7" />
                          <rect x="1" y="5" width="15" height="14" rx="2" />
                        </svg>
                      )}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: active ? '#7B72FF' : colors.textSecondary }}>
                      {type === 'photo' ? 'Photo' : 'Video'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Caption input */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                Caption (optional)
              </label>
              <input
                type="text"
                placeholder="Add a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                maxLength={120}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: isDark ? '0.5px solid rgba(255,255,255,0.14)' : '0.5px solid rgba(0,0,0,0.10)',
                  background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                  color: colors.textPrimary,
                  fontSize: 14,
                  fontFamily: 'inherit',
                  outline: 'none',
                  boxSizing: 'border-box',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
              />
            </div>
          </>
        )}

        {/* Submit button — shown in both states; disabled when locked or no type selected */}
        <button
          onClick={handleSubmit}
          disabled={!selectedType || !isLiveOrOver}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 14,
            border: '0.5px solid rgba(255,255,255,0.25)',
            background: selectedType && isLiveOrOver
              ? 'linear-gradient(180deg, rgba(123,114,255,0.95), rgba(108,99,240,0.98))'
              : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            color: selectedType && isLiveOrOver ? '#fff' : colors.textMuted,
            fontSize: 15,
            fontWeight: 600,
            cursor: selectedType && isLiveOrOver ? 'pointer' : 'default',
            fontFamily: 'inherit',
            transition: 'all 0.2s ease',
            boxShadow: selectedType && isLiveOrOver
              ? '0 1px 0 rgba(255,255,255,0.30) inset, 0 4px 16px rgba(123,114,255,0.40)'
              : 'none',
          }}
        >
          Share with Host
        </button>
      </div>
    </div>
  );
};

export default MediaUploadSheet;
