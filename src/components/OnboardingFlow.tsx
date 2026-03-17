import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { EventCategory, TimeOfDay, UserPrefs } from '../types';

interface OnboardingFlowProps {
  onComplete: (prefs: UserPrefs) => void;
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

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [role, setRole] = useState<'host' | 'attendee' | null>(null);
  const [interests, setInterests] = useState<Set<EventCategory>>(new Set());
  const [times, setTimes] = useState<Set<TimeOfDay>>(new Set());
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const { colors, isDark } = useTheme();

  const goNext = () => {
    setDirection('forward');
    if (step === 1 && role) setStep(2);
    else if (step === 2) setStep(3);
  };

  const goBack = () => {
    setDirection('back');
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  const handleFinish = () => {
    onComplete({
      role: role!,
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

  const roleCardStyle = (selected: boolean): React.CSSProperties => ({
    padding: '28px 24px',
    borderRadius: 22,
    border: selected
      ? '1.5px solid rgba(123,114,255,0.50)'
      : isDark
        ? '1px solid rgba(255,255,255,0.08)'
        : '1px solid rgba(0,0,0,0.04)',
    background: isDark
      ? selected ? 'rgba(123,114,255,0.10)' : 'rgba(22,24,48,0.65)'
      : selected ? 'rgba(123,114,255,0.04)' : 'rgba(255,255,255,0.72)',
    backdropFilter: 'blur(28px) saturate(180%)',
    WebkitBackdropFilter: 'blur(28px) saturate(180%)',
    boxShadow: selected
      ? isDark
        ? '0 1px 0 rgba(255,255,255,0.08) inset, 0 8px 32px rgba(123,114,255,0.18)'
        : '0 1px 0 rgba(255,255,255,0.90) inset, 0 8px 32px rgba(123,114,255,0.12)'
      : isDark
        ? '0 1px 0 rgba(255,255,255,0.05) inset, 0 4px 20px rgba(0,0,0,0.30)'
        : '0 1px 0 rgba(255,255,255,0.90) inset, 0 4px 20px rgba(100,80,200,0.08)',
    cursor: 'pointer',
    textAlign: 'left' as const,
    fontFamily: 'inherit',
    transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 18,
  });

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
      <div key={animKey} style={{ flex: 1, padding: '40px 24px 24px', display: 'flex', flexDirection: 'column', animation: slideAnim, overflow: 'hidden' }}>
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
              How are you using Rally?
            </h2>
            <p style={{ fontSize: 15, color: colors.textMuted, margin: '0 0 36px', lineHeight: 1.5 }}>
              This helps us tailor your experience.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
              {/* Host card */}
              <button
                onClick={() => { setRole('host'); goNext(); }}
                className="btn-press"
                style={roleCardStyle(role === 'host')}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: isDark ? 'rgba(123,114,255,0.15)' : 'rgba(123,114,255,0.08)',
                    border: isDark ? '1px solid rgba(123,114,255,0.20)' : '1px solid rgba(123,114,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B72FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 17, fontWeight: 600, color: colors.textPrimary, marginBottom: 3, letterSpacing: '-0.01em' }}>
                    I host events
                  </div>
                  <div style={{ fontSize: 13, color: colors.textMuted, lineHeight: 1.45 }}>
                    Create and manage events, track RSVPs, and grow your audience.
                  </div>
                </div>
                {/* Chevron */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 4, opacity: 0.5 }}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>

              {/* Attendee card */}
              <button
                onClick={() => { setRole('attendee'); goNext(); }}
                className="btn-press"
                style={roleCardStyle(role === 'attendee')}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: isDark ? 'rgba(123,114,255,0.15)' : 'rgba(123,114,255,0.08)',
                    border: isDark ? '1px solid rgba(123,114,255,0.20)' : '1px solid rgba(123,114,255,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7B72FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 17, fontWeight: 600, color: colors.textPrimary, marginBottom: 3, letterSpacing: '-0.01em' }}>
                    I attend events
                  </div>
                  <div style={{ fontSize: 13, color: colors.textMuted, lineHeight: 1.45 }}>
                    Discover events, RSVP with friends, and never miss out.
                  </div>
                </div>
                {/* Chevron */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 4, opacity: 0.5 }}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
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
              What kinds of events are you into?
            </h2>
            <p style={{ fontSize: 15, color: colors.textMuted, margin: '0 0 32px', lineHeight: 1.5 }}>
              Pick a few so we can tailor your feed.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, flex: 1, alignContent: 'flex-start' }}>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 24, flexShrink: 0 }}>
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
              <button onClick={goBack} style={ghostBtnStyle}>
                Back
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#7B72FF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Step 3 of 3</span>
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: colors.textPrimary, margin: '0 0 4px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
              What times usually work for you?
            </h2>
            <p style={{ fontSize: 15, color: colors.textMuted, margin: '0 0 32px', lineHeight: 1.5 }}>
              We'll prioritize events in your preferred time slots.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, flex: 1, alignContent: 'flex-start' }}>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 24, flexShrink: 0 }}>
              <button
                onClick={handleFinish}
                className="btn-press"
                style={primaryBtnStyle}
              >
                {times.size > 0 ? 'Finish' : 'Skip'}
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
