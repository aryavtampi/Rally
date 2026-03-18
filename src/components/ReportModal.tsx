import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ReportModalProps {
  type: 'event' | 'media';
  itemName: string;
  onClose: () => void;
}

const REASONS = [
  { key: 'inappropriate', label: 'Inappropriate', icon: '18' },
  { key: 'unsafe', label: 'Unsafe', icon: '18' },
  { key: 'spam', label: 'Spam', icon: '18' },
  { key: 'other', label: 'Other', icon: '18' },
];

const ReportModal: React.FC<ReportModalProps> = ({ type, itemName, onClose }) => {
  const { colors, isDark } = useTheme();
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selectedReason) return;
    setSubmitted(true);
    setTimeout(() => onClose(), 1500);
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        animation: 'backdropIn 0.2s ease both',
      }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isDark ? 'rgba(0,0,0,0.60)' : 'rgba(0,0,0,0.30)',
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
          background: isDark ? 'rgba(20,22,42,0.95)' : 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(40px) saturate(200%)',
          WebkitBackdropFilter: 'blur(40px) saturate(200%)',
          borderRadius: 22,
          padding: '28px 24px 20px',
          border: isDark ? '0.5px solid rgba(255,255,255,0.10)' : '0.5px solid rgba(255,255,255,0.80)',
          boxShadow: isDark
            ? '0 1px 0 rgba(255,255,255,0.08) inset, 0 24px 64px rgba(0,0,0,0.55)'
            : '0 1px 0 rgba(255,255,255,0.95) inset, 0 24px 64px rgba(60,40,160,0.20)',
          animation: 'modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {submitted ? (
          /* Confirmation state */
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 16,
                background: isDark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.10)',
                border: '1px solid rgba(16,185,129,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                animation: 'popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: colors.textPrimary, letterSpacing: '-0.01em' }}>
              Thanks for your report
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: colors.textMuted, lineHeight: 1.5 }}>
              We'll review this {type} and take action if needed.
            </p>
          </div>
        ) : (
          <>
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                <line x1="4" y1="22" x2="4" y2="15" />
              </svg>
            </div>

            <h3 style={{ margin: '0 0 4px', fontSize: 19, fontWeight: 700, color: colors.textPrimary, letterSpacing: '-0.01em' }}>
              Report {type === 'event' ? 'Event' : 'Media'}
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: 13, color: colors.textMuted, lineHeight: 1.5 }}>
              Why are you reporting{' '}
              <span style={{ fontWeight: 600, color: colors.textSecondary }}>
                {itemName}
              </span>
              ?
            </p>

            {/* Reason choices */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {REASONS.map((reason) => {
                const selected = selectedReason === reason.key;
                return (
                  <button
                    key={reason.key}
                    onClick={() => setSelectedReason(reason.key)}
                    className="btn-press"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 14,
                      border: selected
                        ? '1.5px solid rgba(123,114,255,0.50)'
                        : isDark
                          ? '1px solid rgba(255,255,255,0.08)'
                          : '1px solid rgba(0,0,0,0.06)',
                      background: selected
                        ? isDark
                          ? 'rgba(123,114,255,0.12)'
                          : 'rgba(123,114,255,0.06)'
                        : isDark
                          ? 'rgba(255,255,255,0.04)'
                          : 'rgba(0,0,0,0.02)',
                      color: selected ? '#7B72FF' : colors.textPrimary,
                      fontSize: 14,
                      fontWeight: selected ? 600 : 500,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      textAlign: 'left' as const,
                    }}
                  >
                    {/* Radio indicator */}
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        border: selected
                          ? '2px solid #7B72FF'
                          : isDark
                            ? '2px solid rgba(255,255,255,0.15)'
                            : '2px solid rgba(0,0,0,0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {selected && (
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: '#7B72FF',
                            animation: 'popIn 0.2s ease both',
                          }}
                        />
                      )}
                    </div>
                    {reason.label}
                  </button>
                );
              })}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={onClose}
                className="btn-press"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 14,
                  border: isDark ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(0,0,0,0.06)',
                  background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
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
                onClick={handleSubmit}
                className="btn-press"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 14,
                  border: 'none',
                  background: selectedReason
                    ? 'linear-gradient(180deg, #EF4444 0%, #DC2626 100%)'
                    : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                  color: selectedReason ? '#fff' : colors.textMuted,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: selectedReason ? 'pointer' : 'default',
                  fontFamily: 'inherit',
                  boxShadow: selectedReason
                    ? '0 1px 0 rgba(255,255,255,0.20) inset, 0 4px 16px rgba(239,68,68,0.30)'
                    : 'none',
                  transition: 'all 0.15s ease',
                  opacity: selectedReason ? 1 : 0.4,
                }}
                disabled={!selectedReason}
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportModal;
