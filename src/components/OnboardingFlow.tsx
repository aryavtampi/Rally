import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { EventCategory, TimeOfDay, UserPrefs } from '../types';

interface OnboardingFlowProps {
  onComplete: (prefs: UserPrefs) => void;
  onShowTerms: () => void;
}

const INTEREST_CHIPS: { key: EventCategory; label: string }[] = [
  { key: 'social', label: 'Social' },
  { key: 'food', label: 'Food' },
  { key: 'sports', label: 'Sports' },
  { key: 'music', label: 'Music' },
  { key: 'hackathon', label: 'Hackathons' },
  { key: 'talk', label: 'Talks' },
  { key: 'workshop', label: 'Workshops' },
  { key: 'other', label: 'Other' },
];

const TIME_CHIPS: { key: TimeOfDay; label: string }[] = [
  { key: 'morning', label: 'Mornings' },
  { key: 'afternoon', label: 'Afternoons' },
  { key: 'evening', label: 'Evenings' },
  { key: 'latenight', label: 'Late nights' },
];

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onShowTerms }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [interests, setInterests] = useState<Set<EventCategory>>(new Set());
  const [times, setTimes] = useState<Set<TimeOfDay>>(new Set());
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const { colors, isDark } = useTheme();

  const goNext = () => {
    setDirection('forward');
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
  };

  const goBack = () => {
    setDirection('back');
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  const handleFinish = () => {
    onComplete({
      role: 'attendee',
      favoriteCategories: Array.from(interests),
      preferredTimes: Array.from(times),
    });
  };

  const toggleInterest = (cat: EventCategory) => {
    setInterests((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const toggleTime = (t: TimeOfDay) => {
    setTimes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  const animKey = `step-${step}-${direction}`;
  const slideAnim = direction === 'forward'
    ? 'onboardSlideInRight 0.35s cubic-bezier(0.22, 1, 0.36, 1) both'
    : 'onboardSlideInLeft 0.35s cubic-bezier(0.22, 1, 0.36, 1) both';

  const chipStyle = (selected: boolean): React.CSSProperties => ({
    padding: '10px 20px',
    borderRadius: 20,
    border: selected
      ? '1.5px solid rgba(123,114,255,0.55)'
      : isDark
        ? '1px solid rgba(255,255,255,0.10)'
        : '1px solid rgba(0,0,0,0.06)',
    background: selected
      ? isDark
        ? 'rgba(123,114,255,0.18)'
        : 'rgba(123,114,255,0.08)'
      : isDark
        ? 'rgba(255,255,255,0.04)'
        : 'rgba(255,255,255,0.60)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    color: selected ? '#7B72FF' : colors.textSecondary,
    fontSize: 14,
    fontWeight: selected ? 600 : 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    boxShadow: selected
      ? '0 1px 0 rgba(255,255,255,0.30) inset, 0 3px 12px rgba(123,114,255,0.15)'
      : isDark
        ? '0 1px 0 rgba(255,255,255,0.04) inset'
        : '0 1px 0 rgba(255,255,255,0.90) inset, 0 2px 6px rgba(100,80,200,0.04)',
  });

  const primaryBtnStyle: React.CSSProperties = {
    width: '100%',
    padding: '15px 24px',
    borderRadius: 16,
    border: 'none',
    background: 'linear-gradient(180deg, #7B72FF 0%, #6C63FF 100%)',
    color: '#fff',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: '0 1px 0 rgba(255,255,255,0.25) inset, 0 4px 20px rgba(123,114,255,0.35)',
    transition: 'all 0.15s ease',
    letterSpacing: '-0.01em',
  };

  const ghostBtnStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 24px',
    borderRadius: 16,
    border: 'none',
    background: 'transparent',
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'color 0.15s ease',
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 200,
        background: colors.bgPrimary,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Progress bar */}
      <div style={{ padding: '20px 24px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 1.5,
                background: s <= step
                  ? '#7B72FF'
                  : isDark
                    ? 'rgba(255,255,255,0.06)'
                    : 'rgba(0,0,0,0.05)',
                transition: 'background 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* Content area */}
      <div key={animKey} style={{ flex: 1, padding: '40px 24px 90px', display: 'flex', flexDirection: 'column', animation: slideAnim, overflow: 'auto' }}>
        {step === 1 && (
          <>
            {/* Rally logo mark */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 13,
                background: 'linear-gradient(145deg, rgba(123,114,255,0.92), rgba(100,90,240,0.96))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
                boxShadow: '0 1px 0 rgba(255,255,255,0.40) inset, 0 4px 14px rgba(123,114,255,0.35)',
                border: '0.5px solid rgba(255,255,255,0.30)',
              }}
            >
              <span style={{ fontSize: 20, fontWeight: 800, color: '#fff', lineHeight: 1 }}>R</span>
            </div>

            <h2 style={{ fontSize: 28, fontWeight: 700, color: colors.textPrimary, margin: '0 0 6px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              Welcome to Rally
            </h2>
            <p style={{ fontSize: 15, color: colors.textMuted, margin: '0 0 32px', lineHeight: 1.5 }}>
              Pick a few interests so we can tailor your feed.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignContent: 'flex-start' }}>
              {INTEREST_CHIPS.map((chip, i) => (
                <button
                  key={chip.key}
                  onClick={() => toggleInterest(chip.key)}
                  className="btn-press"
                  style={{
                    ...chipStyle(interests.has(chip.key)),
                    animation: `fadeInUp 0.3s ease ${i * 0.04}s both`,
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <div style={{ flex: 1, minHeight: 24 }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
              <button
                onClick={goNext}
                className="btn-press"
                style={{
                  ...primaryBtnStyle,
                  opacity: interests.size === 0 ? 0.4 : 1,
                  pointerEvents: interests.size === 0 ? 'none' : 'auto',
                }}
                disabled={interests.size === 0}
              >
                Continue
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#7B72FF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Step 2 of 3</span>
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: colors.textPrimary, margin: '0 0 4px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              What times usually work for you?
            </h2>
            <p style={{ fontSize: 15, color: colors.textMuted, margin: '0 0 32px', lineHeight: 1.5 }}>
              We'll prioritize events in your preferred time slots.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignContent: 'flex-start' }}>
              {TIME_CHIPS.map((chip, i) => (
                <button
                  key={chip.key}
                  onClick={() => toggleTime(chip.key)}
                  className="btn-press"
                  style={{
                    ...chipStyle(times.has(chip.key)),
                    animation: `fadeInUp 0.3s ease ${i * 0.04}s both`,
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <div style={{ flex: 1, minHeight: 24 }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
              <button
                onClick={goNext}
                className="btn-press"
                style={primaryBtnStyle}
              >
                {times.size > 0 ? 'Continue' : 'Skip'}
              </button>
              <button onClick={goBack} style={ghostBtnStyle}>
                Back
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            {/* Shield icon */}
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                background: isDark ? 'rgba(123,114,255,0.15)' : 'rgba(123,114,255,0.08)',
                border: isDark ? '1px solid rgba(123,114,255,0.25)' : '1px solid rgba(123,114,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
                boxShadow: isDark
                  ? '0 1px 0 rgba(255,255,255,0.08) inset, 0 4px 16px rgba(123,114,255,0.20)'
                  : '0 1px 0 rgba(255,255,255,0.80) inset, 0 4px 16px rgba(123,114,255,0.12)',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7B72FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 700, color: colors.textPrimary, margin: '0 0 8px', lineHeight: 1.25, letterSpacing: '-0.02em' }}>
              By continuing, you agree to Rally's Terms & Community Guidelines.
            </h2>
            <p style={{ fontSize: 15, color: colors.textMuted, margin: '0 0 32px', lineHeight: 1.5 }}>
              We keep our community safe and respectful.
            </p>

            {/* View Terms card */}
            <button
              onClick={onShowTerms}
              className="btn-press"
              style={{
                width: '100%',
                padding: '16px 20px',
                borderRadius: 18,
                border: isDark
                  ? '1px solid rgba(255,255,255,0.08)'
                  : '1px solid rgba(0,0,0,0.04)',
                background: isDark
                  ? 'rgba(22,24,48,0.65)'
                  : 'rgba(255,255,255,0.72)',
                backdropFilter: 'blur(28px) saturate(180%)',
                WebkitBackdropFilter: 'blur(28px) saturate(180%)',
                boxShadow: isDark
                  ? '0 1px 0 rgba(255,255,255,0.05) inset, 0 4px 20px rgba(0,0,0,0.30)'
                  : '0 1px 0 rgba(255,255,255,0.90) inset, 0 4px 20px rgba(100,80,200,0.08)',
                cursor: 'pointer',
                textAlign: 'left' as const,
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                transition: 'all 0.2s ease',
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: isDark ? 'rgba(123,114,255,0.12)' : 'rgba(123,114,255,0.08)',
                  border: isDark ? '1px solid rgba(123,114,255,0.18)' : '1px solid rgba(123,114,255,0.10)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7B72FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: colors.textPrimary, letterSpacing: '-0.01em' }}>
                  View Terms & Community Guidelines
                </div>
                <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
                  Tap to read our full policies
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.5 }}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            <div style={{ flex: 1 }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
              <button
                onClick={handleFinish}
                className="btn-press"
                style={primaryBtnStyle}
              >
                I Agree & Continue
              </button>
              <button onClick={goBack} style={ghostBtnStyle}>
                Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;
