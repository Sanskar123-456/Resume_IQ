import React from 'react';

const PALETTE = [
  ['#7C3AED', '#A78BFA'],
  ['#2563EB', '#60A5FA'],
  ['#059669', '#34D399'],
  ['#DB2777', '#F472B6'],
  ['#EA580C', '#FB923C'],
  ['#0891B2', '#22D3EE'],
  ['#4F46E5', '#818CF8'],
  ['#BE123C', '#FB7185'],
];

export const getInitials = (name = '') => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
};

const colorFor = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
};

// Circular avatar showing the user's initials, coloured from their name.
const Avatar = ({ name, size = 36, className = '', ring = false }) => {
  const [from, to] = colorFor(name);
  return (
    <div
      title={name}
      aria-label={`Avatar for ${name || 'user'}`}
      className={`shrink-0 rounded-full flex items-center justify-center font-bold text-white select-none ${ring ? 'ring-2 ring-white shadow-md' : ''} ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.38),
        background: `linear-gradient(135deg, ${from}, ${to})`,
      }}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
