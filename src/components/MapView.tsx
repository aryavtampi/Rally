import React, { useState } from 'react';
import { EventItem, CATEGORY_CONFIG } from '../types';
import { MAP_LOCATIONS } from '../data/mapLocations';
import { useTheme } from '../contexts/ThemeContext';
import UserAvatar from './UserAvatar';

interface MapViewProps {
  events: EventItem[];
  friendIds: Set<string>;
}

const BUILDINGS = Object.entries(MAP_LOCATIONS);

const MapView: React.FC<MapViewProps> = ({ events, friendIds }) => {
  const { colors, isDark } = useTheme();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const activeEvents = events.filter((e) => !e.isPast);
  const selectedEvent = activeEvents.find((e) => e.id === selectedEventId);

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const timeStr = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    if (isToday) return `Today ${timeStr}`;
    return `${d.toLocaleDateString([], { weekday: 'short' })} ${timeStr}`;
  };

  const roadColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const brickColor = isDark ? 'rgba(180,120,80,0.15)' : 'rgba(180,120,80,0.25)';
  const quadFill = isDark ? 'rgba(34,197,94,0.04)' : 'rgba(34,197,94,0.06)';
  const quadStroke = isDark ? 'rgba(34,197,94,0.08)' : 'rgba(34,197,94,0.12)';
  const treeColor = isDark ? 'rgba(34,197,94,0.06)' : 'rgba(34,197,94,0.1)';
  const pathColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const roadLabelColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Map header */}
      <div
        style={{
          padding: '16px 20px 12px',
          background: isDark
            ? 'rgba(16, 17, 34, 0.72)'
            : 'rgba(255, 255, 255, 0.62)',
          backdropFilter: isDark
            ? 'blur(40px) saturate(150%)'
            : 'blur(40px) saturate(200%)',
          WebkitBackdropFilter: isDark
            ? 'blur(40px) saturate(150%)'
            : 'blur(40px) saturate(200%)',
          borderBottom: isDark
            ? '0.5px solid rgba(255,255,255,0.08)'
            : '0.5px solid rgba(255,255,255,0.70)',
          boxShadow: isDark
            ? '0 1px 0 rgba(255,255,255,0.06) inset, 0 4px 16px rgba(0,0,0,0.20)'
            : '0 1px 0 rgba(255,255,255,0.90) inset, 0 4px 16px rgba(100,80,200,0.06)',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 600,
            color: colors.textPrimary,
            letterSpacing: '-0.02em',
          }}
        >
          Campus Map
        </h2>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: colors.textMuted, fontWeight: 400 }}>
          {activeEvents.length} events happening nearby
        </p>
      </div>

      {/* Map area */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          background: isDark
            ? 'linear-gradient(135deg, #0f2918 0%, #0f172a 50%, #0f2918 100%)'
            : 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 50%, #ecfdf5 100%)',
          overflow: 'hidden',
        }}
        onClick={() => setSelectedEventId(null)}
      >
        {/* Grid pattern overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: isDark
              ? 'radial-gradient(circle, rgba(255,255,255,0.02) 1px, transparent 1px)'
              : 'radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Campus SVG */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Roads */}
          <line x1="16" y1="18" x2="16" y2="88" stroke={roadColor} strokeWidth="1.2" strokeDasharray="3,2" />
          <line x1="86" y1="15" x2="86" y2="90" stroke={roadColor} strokeWidth="1.2" strokeDasharray="3,2" />
          <line x1="16" y1="88" x2="86" y2="88" stroke={roadColor} strokeWidth="0.8" strokeDasharray="3,2" />

          {/* Road labels */}
          <text x="14" y="16" fill={roadLabelColor} fontSize="2.8" fontWeight="600" textAnchor="middle">
            Pierce St
          </text>
          <text x="86" y="13" fill={roadLabelColor} fontSize="2.8" fontWeight="600" textAnchor="middle">
            Emory St
          </text>

          {/* The Quad */}
          <rect x="28" y="34" width="46" height="30" rx="3" ry="3" fill={quadFill} stroke={quadStroke} strokeWidth="0.4" />

          {/* Brick walkways */}
          <line x1="28" y1="34" x2="74" y2="64" stroke={brickColor} strokeWidth="0.4" />
          <line x1="74" y1="34" x2="28" y2="64" stroke={brickColor} strokeWidth="0.4" />
          <line x1="51" y1="34" x2="51" y2="64" stroke={brickColor} strokeWidth="0.4" />
          <line x1="28" y1="49" x2="74" y2="49" stroke={brickColor} strokeWidth="0.4" />

          {/* Connecting paths */}
          <line x1="28" y1="56" x2="20" y2="56" stroke={pathColor} strokeWidth="0.3" />
          <line x1="74" y1="60" x2="82" y2="60" stroke={pathColor} strokeWidth="0.3" />
          <line x1="51" y1="64" x2="42" y2="82" stroke={pathColor} strokeWidth="0.3" />
          <line x1="51" y1="64" x2="60" y2="76" stroke={pathColor} strokeWidth="0.3" />
          <line x1="51" y1="34" x2="46" y2="26" stroke={pathColor} strokeWidth="0.3" />
          <line x1="36" y1="64" x2="26" y2="72" stroke={pathColor} strokeWidth="0.3" />

          {/* Green tree clusters */}
          <circle cx="32" cy="38" r="2.5" fill={treeColor} />
          <circle cx="44" cy="42" r="3" fill={treeColor} />
          <circle cx="58" cy="44" r="2.8" fill={treeColor} />
          <circle cx="68" cy="42" r="2" fill={treeColor} />
          <circle cx="36" cy="58" r="2.5" fill={treeColor} />
          <circle cx="62" cy="56" r="2.2" fill={treeColor} />
          <circle cx="50" cy="52" r="3.2" fill={treeColor} />
          <circle cx="42" cy="46" r="2" fill={treeColor} />

          {/* The Quad label */}
          <text
            x="51"
            y="49"
            fill={isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}
            fontSize="3.5"
            fontWeight="600"
            textAnchor="middle"
            fontStyle="italic"
          >
            The Quad
          </text>

          {/* Oxford College title */}
          <text
            x="51"
            y="6"
            fill={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}
            fontSize="3"
            fontWeight="700"
            textAnchor="middle"
            letterSpacing="0.3"
          >
            OXFORD COLLEGE
          </text>
        </svg>

        {/* Buildings */}
        {BUILDINGS.map(([name, pos]) => {
          const hasEvent = activeEvents.some((e) => e.location === name);
          const isQuad = name === 'The Quad';
          const isSeney = name === 'Seney Hall';
          const isGym = name === 'Williams Gymnasium';

          if (isQuad) return null;

          const bw = isGym ? 44 : isSeney ? 42 : hasEvent ? 38 : 30;
          const bh = isGym ? 24 : isSeney ? 20 : hasEvent ? 18 : 14;

          return (
            <div
              key={name}
              style={{
                position: 'absolute',
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  width: bw,
                  height: bh,
                  borderRadius: isSeney ? 6 : 4,
                  background: isDark
                    ? hasEvent ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.06)'
                    : hasEvent ? 'rgba(108,99,255,0.1)' : 'rgba(0,0,0,0.05)',
                  border: `1px solid ${isDark
                    ? hasEvent ? 'rgba(108,99,255,0.25)' : 'rgba(255,255,255,0.08)'
                    : hasEvent ? 'rgba(108,99,255,0.2)' : 'rgba(0,0,0,0.08)'}`,
                }}
              />
              <div
                style={{
                  fontSize: isSeney ? 8 : 7.5,
                  color: isDark
                    ? isSeney ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.3)'
                    : isSeney ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.3)',
                  textAlign: 'center',
                  marginTop: 2,
                  fontWeight: isSeney ? 700 : 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {name
                  .replace(' Hall', '')
                  .replace(' Building', '')
                  .replace('Memorial ', '')
                  .replace(' Gymnasium', ' Gym')
                  .replace('Haygood-Hopkins ', 'Haygood')
                  .replace('Student Center', 'Student Ctr')}
              </div>
            </div>
          );
        })}

        {/* Event pins */}
        {activeEvents.map((event) => {
          const loc = MAP_LOCATIONS[event.location];
          if (!loc) return null;
          const cat = CATEGORY_CONFIG[event.category];
          const isSelected = selectedEventId === event.id;

          return (
            <div
              key={event.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEventId(isSelected ? null : event.id);
              }}
              style={{
                position: 'absolute',
                left: `${loc.x}%`,
                top: `${loc.y}%`,
                transform: 'translate(-50%, -100%)',
                cursor: 'pointer',
                zIndex: isSelected ? 10 : 5,
                animation: `fadeInUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both`,
              }}
            >
              {/* Pin body */}
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  background: cat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isSelected
                    ? `0 4px 16px rgba(0,0,0,0.2), 0 0 0 3px ${cat.color}`
                    : '0 2px 8px rgba(0,0,0,0.15)',
                  border: '3px solid #fff',
                  transition: 'box-shadow 0.15s ease, transform 0.15s ease',
                  transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.85)' }} />
              </div>
              {/* Going count badge */}
              <div
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  background: '#10b981',
                  color: '#fff',
                  borderRadius: '50%',
                  width: 18,
                  height: 18,
                  fontSize: 10,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #fff',
                }}
              >
                {event.going.length}
              </div>
              {/* Pin stem */}
              <div
                style={{
                  width: 2,
                  height: 8,
                  background: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.15)',
                  margin: '0 auto',
                  borderRadius: 1,
                }}
              />
            </div>
          );
        })}

        {/* Mini card overlay */}
        {selectedEvent && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              bottom: 80,
              left: 12,
              right: 12,
              background: isDark ? 'rgba(28,30,55,0.80)' : 'rgba(255,255,255,0.75)',
              backdropFilter: isDark ? 'blur(32px) saturate(150%)' : 'blur(32px) saturate(180%)',
              WebkitBackdropFilter: isDark ? 'blur(32px) saturate(150%)' : 'blur(32px) saturate(180%)',
              borderRadius: 18,
              padding: '16px 16px',
              boxShadow: isDark
                ? '0 1px 0 rgba(255,255,255,0.08) inset, 0 12px 40px rgba(0,0,0,0.40)'
                : '0 1px 0 rgba(255,255,255,0.90) inset, 0 12px 40px rgba(80,60,200,0.14)',
              border: isDark
                ? '0.5px solid rgba(255,255,255,0.10)'
                : '0.5px solid rgba(255,255,255,0.75)',
              animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both',
              zIndex: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: CATEGORY_CONFIG[selectedEvent.category].color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(255,255,255,0.85)' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4
                  style={{
                    margin: '0 0 4px',
                    fontSize: 14,
                    fontWeight: 600,
                    color: colors.textPrimary,
                    letterSpacing: 0,
                  }}
                >
                  {selectedEvent.title}
                </h4>
                <div style={{ fontSize: 12, color: colors.textSecondary, fontWeight: 400, marginBottom: 8 }}>
                  {formatTime(selectedEvent.time)} {'\u00B7'} {selectedEvent.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex' }}>
                    {selectedEvent.going.slice(0, 3).map((a, i) => (
                      <div key={a.id} style={{ marginLeft: i === 0 ? 0 : -8 }}>
                        <UserAvatar name={a.name} size={24} friendBadge={friendIds.has(a.id)} />
                      </div>
                    ))}
                  </div>
                  <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>
                    {selectedEvent.going.length} going
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
