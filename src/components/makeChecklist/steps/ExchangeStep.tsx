import React from 'react';

export function ExchangeStep({
  exchange,
  onSelect,
}: {
  exchange: boolean | null;
  onSelect: (yes: boolean) => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onSelect(true)}
        className="px-4 py-2 rounded-full bg-red-500 text-white"
      >
        예
      </button>
      <button
        onClick={() => onSelect(false)}
        className="px-4 py-2 rounded-full bg-gray-300 text-gray-800"
      >
        아니요
      </button>
    </div>
  );
}
