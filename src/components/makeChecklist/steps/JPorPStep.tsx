import React from 'react';

export function JPorPStep({
  jpType,
  onSelect,
}: {
  jpType: 'J' | 'P' | '';
  onSelect: (t: 'J' | 'P') => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onSelect('J')}
        className="px-6 py-2 rounded-full bg-gray-800 text-white"
      >
        J
      </button>
      <button
        onClick={() => onSelect('P')}
        className="px-6 py-2 rounded-full bg-red-500 text-white"
      >
        P
      </button>
    </div>
  );
}
