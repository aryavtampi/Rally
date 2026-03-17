export const MAP_LOCATIONS: Record<string, { x: number; y: number }> = {
  // --- On/around the Quad ---
  'The Quad':          { x: 50, y: 48 },
  'Seney Hall':        { x: 50, y: 60 },  // south side of Quad (iconic, clock tower)
  'Phi Gamma Hall':    { x: 34, y: 40 },  // NW of Quad
  'Few Hall':          { x: 64, y: 36 },  // NE of Quad, across from Phi Gamma
  'Tarbutton Hall':    { x: 74, y: 32 },  // adjoins Few Hall, east
  'Humanities Hall':   { x: 38, y: 52 },  // SW of Quad
  'Science Building':  { x: 64, y: 50 },  // east side of Quad
  'Oxford Library':    { x: 52, y: 36 },  // north side of Quad
  'Pierce Hall':       { x: 28, y: 56 },  // west of Quad

  // --- West cluster (west of Seney) ---
  'Hopkins Hall':      { x: 36, y: 66 },  // west of Seney
  'Williams Gymnasium': { x: 26, y: 72 }, // further west

  // --- East cluster (east of Seney) ---
  'Johnson Hall':      { x: 64, y: 64 },  // east of Seney
  'Candler Hall':      { x: 76, y: 60 },  // further east

  // --- North ---
  'Jolley Commons':    { x: 46, y: 26 },  // dining, north of Quad

  // --- South ---
  'Haygood-Hopkins Memorial Hall': { x: 42, y: 82 },
  'Student Center':    { x: 60, y: 76 },

  // --- Off-campus (Covington / Oxford town) ---
  'The Depot Sports Bar & Grill':              { x: 84, y: 18 },
  'Mystic Grill, Covington':        { x: 88, y: 14 },
  'Amici Italian Cafe, Covington':  { x: 90, y: 22 },
  'Bread and Butter, Covington':    { x: 86, y: 30 },
};
