import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface TermsGuidelinesModalProps {
  onClose: () => void;
}

const sections = [
  {
    title: 'Platform Role & Responsibility',
    bullets: [
      'Rally is a neutral platform for discovering campus events.',
      'Event organizers are responsible for the accuracy, safety, and legality of their events.',
      'Rally does not guarantee attendance, safety, or outcomes of events.',
    ],
  },
  {
    title: 'User Responsibilities',
    bullets: [
      'You agree to post truthful, non-misleading information.',
      'You will not impersonate other people, organizations, or official university entities.',
      'You are responsible for your own conduct at events you attend.',
    ],
  },
  {
    title: 'Prohibited Content & Events',
    bullets: [
      'No illegal activity, including underage drinking, drugs, or hazing.',
      'No harassment, hate speech, threats, or discriminatory content.',
      'No dangerous or unauthorized events.',
      'No fraudulent or scam events.',
    ],
  },
  {
    title: 'User-Generated Media (Photos/Videos)',
    bullets: [
      'You must only upload media you have the right to share.',
      'By uploading, you give Rally permission to display your content inside the app.',
      'We may remove media that violates these guidelines or is reported by users.',
    ],
  },
  {
    title: 'Moderation & Enforcement',
    bullets: [
      'Rally may remove events or content that violate these guidelines.',
      'Repeated or serious violations may result in account suspension or termination.',
      'We provide in-app reporting so users can flag concerning events or media.',
    ],
  },
  {
    title: 'Verified vs Student Events',
    bullets: [
      'Some events are marked as "Verified" for official university or registered organizations.',
      'Other student events are clearly labeled as unverified and subject to moderation.',
    ],
  },
];

const TermsGuidelinesModal: React.FC<TermsGuidelinesModalProps> = ({ onClose }) => {
  const { colors, isDark } = useTheme();

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
        zIndex: 600,
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
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glass specular top highlight */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 60,
            background: isDark
              ? 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)'
              : 'linear-gradient(180deg, rgba(255,255,255,0.90) 0%, transparent 100%)',
            borderRadius: '28px 28px 0 0',
            pointerEvents: 'none',
          }}
        />

        <div style={{ padding: '24px 22px 28px' }}>
          {/* Header with close button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Shield icon */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: isDark ? 'rgba(123,114,255,0.15)' : 'rgba(123,114,255,0.08)',
                  border: isDark ? '1px solid rgba(123,114,255,0.20)' : '1px solid rgba(123,114,255,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7B72FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  color: colors.textPrimary,
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em',
                }}
              >
                Rally Terms &<br />Community Guidelines
              </h2>
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

          {/* Sections */}
          {sections.map((section, sIdx) => (
            <div key={sIdx} style={{ marginBottom: sIdx < sections.length - 1 ? 20 : 0 }}>
              {/* Section divider */}
              {sIdx > 0 && (
                <div
                  style={{
                    height: 0.5,
                    background: isDark
                      ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)'
                      : 'linear-gradient(90deg, transparent, rgba(100,80,200,0.12), transparent)',
                    marginBottom: 20,
                  }}
                />
              )}

              {/* Section number + title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 7,
                    background: isDark ? 'rgba(123,114,255,0.15)' : 'rgba(123,114,255,0.10)',
                    border: '0.5px solid rgba(123,114,255,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#7B72FF',
                    flexShrink: 0,
                  }}
                >
                  {sIdx + 1}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: colors.textPrimary,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {section.title}
                </span>
              </div>

              {/* Bullets */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 30 }}>
                {section.bullets.map((bullet, bIdx) => (
                  <div key={bIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        background: isDark ? 'rgba(123,114,255,0.50)' : 'rgba(123,114,255,0.40)',
                        flexShrink: 0,
                        marginTop: 6,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 13,
                        color: colors.textSecondary,
                        lineHeight: 1.55,
                        fontWeight: 400,
                      }}
                    >
                      {bullet}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsGuidelinesModal;
