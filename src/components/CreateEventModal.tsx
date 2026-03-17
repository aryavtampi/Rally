import React, { useState } from 'react';
import { EventCategory, CATEGORY_CONFIG } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface CreateEventModalProps {
  onClose: () => void;
  onCreate: (data: { title: string; time: string; location: string; note: string; category: EventCategory; capacity?: number }) => void;
}

const LOCATIONS = [
  'Few Hall',
  'Humanities Hall',
  'Science Building',
  'Tarbutton Hall',
  'Candler Hall',
  'Williams Gymnasium',
  'Jolley Commons',
  'The Quad',
  'Pierce Hall',
  'Seney Hall',
  'Phi Gamma Hall',
  'Oxford Library',
  'Haygood-Hopkins Memorial Hall',
];

const CATEGORIES = Object.entries(CATEGORY_CONFIG) as [EventCategory, typeof CATEGORY_CONFIG[EventCategory]][];

const CreateEventModal: React.FC<CreateEventModalProps> = ({ onClose, onCreate }) => {
  const { colors, isDark } = useTheme();
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<EventCategory>('other');
  const [capacity, setCapacity] = useState('');
  const [hasCapacity, setHasCapacity] = useState(false);
  const [useCustomLocation, setUseCustomLocation] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalLocation = useCustomLocation ? customLocation : location;
    if (!title.trim() || !time || !finalLocation.trim()) return;
    onCreate({
      title: title.trim(),
      time,
      location: finalLocation.trim(),
      note: note.trim(),
      category,
      capacity: hasCapacity && capacity ? parseInt(capacity, 10) : undefined,
    });
  };

  const getInputStyle = (fieldName: string): React.CSSProperties => {
    const isFocused = focusedField === fieldName;
    return {
      width: '100%',
      padding: '12px 16px',
      borderRadius: 14,
      border: isFocused
        ? '0.5px solid rgba(123,114,255,0.60)'
        : isDark
          ? '0.5px solid rgba(255,255,255,0.10)'
          : '0.5px solid rgba(255,255,255,0.72)',
      fontSize: 14,
      fontWeight: 400,
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'border-color 0.15s, box-shadow 0.15s, background 0.15s',
      fontFamily: 'inherit',
      background: isFocused
        ? isDark ? 'rgba(30,32,60,0.80)' : 'rgba(255,255,255,0.85)'
        : isDark ? 'rgba(25,27,50,0.55)' : 'rgba(255,255,255,0.48)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      color: isDark ? '#F0F1FF' : '#1A1B2E',
      boxShadow: isFocused
        ? '0 1px 0 rgba(255,255,255,0.80) inset, 0 0 0 3px rgba(123,114,255,0.12)'
        : '0 1px 0 rgba(255,255,255,0.70) inset',
    };
  };

  const labelColor = isDark ? '#D1D5DB' : '#374151';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: isDark
          ? 'rgba(10, 10, 25, 0.55)'
          : 'rgba(20, 20, 50, 0.35)',
        backdropFilter: 'blur(16px) saturate(150%)',
        WebkitBackdropFilter: 'blur(16px) saturate(150%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 16,
        animation: 'backdropIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        className="glass glass-modal"
        style={{
          background: isDark
            ? 'rgba(14, 16, 34, 0.95)'
            : 'rgba(252, 252, 255, 0.92)',
          backdropFilter: isDark
            ? 'blur(56px) saturate(180%)'
            : 'blur(56px) saturate(200%)',
          WebkitBackdropFilter: isDark
            ? 'blur(56px) saturate(180%)'
            : 'blur(56px) saturate(200%)',
          borderRadius: 28,
          padding: '24px 20px',
          width: '100%',
          border: isDark
            ? '0.5px solid rgba(255,255,255,0.11)'
            : '0.5px solid rgba(255,255,255,0.82)',
          boxShadow: isDark
            ? '0 1px 0 rgba(255,255,255,0.09) inset, 0 -0.5px 0 rgba(0,0,0,0.50) inset, 0 32px 80px rgba(0,0,0,0.60), 0 8px 24px rgba(0,0,0,0.40)'
            : '0 1px 0 rgba(255,255,255,0.95) inset, 0 -0.5px 0 rgba(0,0,0,0.04) inset, 0 32px 80px rgba(50,40,120,0.18), 0 8px 24px rgba(0,0,0,0.10)',
          animation: 'glassModalIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          maxHeight: 'calc(100% - 32px)',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: colors.textPrimary, letterSpacing: '-0.02em' }}>
              Post Event
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: colors.textMuted, fontWeight: 400 }}>
              Let people know what's happening
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn-press"
            style={{
              background: isDark
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(255,255,255,0.60)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: isDark
                ? '0.5px solid rgba(255,255,255,0.10)'
                : '0.5px solid rgba(255,255,255,0.70)',
              boxShadow: '0 1px 0 rgba(255,255,255,0.50) inset',
              borderRadius: '50%',
              width: 36,
              height: 36,
              fontSize: 16,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.textMuted,
              transition: 'background 0.15s',
            }}
          >
            {'\u2715'}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Category picker */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: labelColor, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Category
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CATEGORIES.map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  className="btn-press"
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: category === key
                      ? `1px solid ${config.color}`
                      : `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    background: category === key
                      ? (isDark ? `${config.color}18` : config.bg)
                      : (isDark ? '#111827' : '#fff'),
                    color: category === key ? config.color : colors.textMuted,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          {/* Event name */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: labelColor, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Event Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Hackathon Kickoff"
              required
              style={getInputStyle('title')}
              onFocus={() => setFocusedField('title')}
              onBlur={() => setFocusedField(null)}
            />
          </div>

          {/* Time */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: labelColor, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              style={getInputStyle('time')}
              onFocus={() => setFocusedField('time')}
              onBlur={() => setFocusedField(null)}
            />
          </div>

          {/* Location */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: labelColor, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Location
            </label>
            {!useCustomLocation ? (
              <div>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required={!useCustomLocation}
                  style={{
                    ...getInputStyle('location'),
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 16px center',
                    paddingRight: 40,
                  } as React.CSSProperties}
                  onFocus={() => setFocusedField('location')}
                  onBlur={() => setFocusedField(null)}
                >
                  <option value="">Select a venue...</option>
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setUseCustomLocation(true)}
                  style={{
                    marginTop: 8,
                    background: 'none',
                    border: 'none',
                    color: '#6C63FF',
                    fontSize: 12,
                    cursor: 'pointer',
                    padding: 0,
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Custom location
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  placeholder="e.g. Coffee Shop on 5th"
                  required={useCustomLocation}
                  style={getInputStyle('customLocation')}
                  onFocus={() => setFocusedField('customLocation')}
                  onBlur={() => setFocusedField(null)}
                />
                <button
                  type="button"
                  onClick={() => { setUseCustomLocation(false); setCustomLocation(''); }}
                  style={{
                    marginTop: 8,
                    background: 'none',
                    border: 'none',
                    color: '#6C63FF',
                    fontSize: 12,
                    cursor: 'pointer',
                    padding: 0,
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Choose from list
                </button>
              </div>
            )}
          </div>

          {/* Note */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: labelColor, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Note <span style={{ fontWeight: 400, color: colors.textMuted, textTransform: 'none', letterSpacing: 'normal' }}>optional</span>
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder='"Free pizza", "Guest speaker", etc.'
              style={getInputStyle('note')}
              onFocus={() => setFocusedField('note')}
              onBlur={() => setFocusedField(null)}
            />
          </div>

          {/* Capacity */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: hasCapacity ? 8 : 0 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: labelColor, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={labelColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Capacity Limit
                <span style={{ fontWeight: 400, color: colors.textMuted, textTransform: 'none', letterSpacing: 'normal' }}>optional</span>
              </label>
              <button
                type="button"
                onClick={() => { setHasCapacity(!hasCapacity); if (hasCapacity) setCapacity(''); }}
                style={{
                  width: 44,
                  height: 26,
                  borderRadius: 13,
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background 0.2s ease',
                  background: hasCapacity
                    ? 'linear-gradient(180deg, rgba(123,114,255,0.92), rgba(108,99,240,0.96))'
                    : isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: '#fff',
                    position: 'absolute',
                    top: 3,
                    left: hasCapacity ? 21 : 3,
                    transition: 'left 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.20)',
                  }}
                />
              </button>
            </div>
            {hasCapacity && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, animation: 'fadeIn 0.2s ease' }}>
                <input
                  type="number"
                  min="1"
                  max="9999"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="e.g. 50"
                  style={{
                    ...getInputStyle('capacity'),
                    width: 120,
                    textAlign: 'center',
                    MozAppearance: 'textfield',
                  } as React.CSSProperties}
                  onFocus={() => setFocusedField('capacity')}
                  onBlur={() => setFocusedField(null)}
                />
                <span style={{ fontSize: 13, color: colors.textMuted, fontWeight: 400 }}>
                  max attendees
                </span>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-press"
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 14,
                border: isDark
                  ? '0.5px solid rgba(255,255,255,0.12)'
                  : '0.5px solid rgba(255,255,255,0.65)',
                background: isDark
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(255,255,255,0.50)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                boxShadow: '0 1px 0 rgba(255,255,255,0.60) inset',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                color: colors.textSecondary,
                transition: 'all 0.15s',
                fontFamily: 'inherit',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-press"
              style={{
                flex: 2,
                padding: '13px',
                borderRadius: 14,
                border: '0.5px solid rgba(255,255,255,0.30)',
                background: 'linear-gradient(180deg, rgba(123,114,255,0.92), rgba(108,99,240,0.96))',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 1px 0 rgba(255,255,255,0.35) inset, 0 4px 16px rgba(123,114,255,0.40)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
              Post Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
