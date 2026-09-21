// Dynamically build the interior-design prompt from a room type + design style.
// Add new room types or styles here without touching the generation flow.

const ROOM_TYPES = {
  'living-room': {
    base: 'living room',
    focus: 'Make it comfortable, warm and stylish for relaxing and entertaining.',
  },
  bedroom: {
    base: 'bedroom',
    focus: 'Make it calm, relaxing and personalized for a good night\'s rest.',
  },
  kitchen: {
    base: 'kitchen',
    focus: 'Make it functional, bright and modern for daily cooking and gatherings.',
  },
  office: {
    base: 'office',
    focus: 'Make it productive, professional and inspiring for focused work.',
  },
};

const DESIGN_STYLES = {
  classic: {
    phrase: 'a classic interior design style with timeless, elegant details',
    focus: 'Elegant, refined and harmonious with rich materials.',
  },
  modern: {
    phrase: 'a modern interior design style with clean lines, contemporary furniture and a fresh look',
    focus: 'Clean, airy and contemporary with smooth surfaces.',
  },
  luxury: {
    phrase: 'a luxury interior design style with premium materials, elegant furniture and sophisticated interiors',
    focus: 'Premium, polished and sophisticated with high-end finishes.',
  },
  minimal: {
    phrase: 'a minimal interior design style that is simple, clean, functional and clutter-free',
    focus: 'Simple, uncluttered and functional with plenty of open space.',
  },
  rustic: {
    phrase: 'a rustic interior design style with warm, natural materials and a cozy traditional feel',
    focus: 'Warm, natural and cozy with wood and organic textures.',
  },
};

exports.ALLOWED_ROOM_TYPES = Object.keys(ROOM_TYPES);
exports.ALLOWED_DESIGN_STYLES = Object.keys(DESIGN_STYLES);

exports.buildDesignPrompt = ({ roomImage, roomType, designStyle }) => {
  const room = ROOM_TYPES[roomType];
  const style = DESIGN_STYLES[designStyle];

  if (!room || !style) {
    const error = new Error('Invalid room type or design style.');
    error.status = 400;
    error.code = 'INVALID_SELECTION';
    throw error;
  }

  return [
    `Redesign this ${room.base} in ${style.phrase}.`,
    room.focus,
    style.focus,
    'Preserve the room\'s existing architecture, walls, windows, doors and overall layout.',
    'Add appropriate furniture, lighting, colors, materials and decorations while keeping the result realistic and visually coherent.',
    roomImage ? `Reference image id: ${roomImage}.` : '',
  ]
    .filter(Boolean)
    .join(' ');
};