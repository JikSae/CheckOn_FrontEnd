import React from 'react';

export function TransportStep({
  transport,
  options,
  onSelectTransport,
}: {
  transport: string;
  options: string[];
  onSelectTransport: (opt: string) => void;
}) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelectTransport(opt)}
          className={`px-4 py-2 rounded-full border ${
            transport === opt
              ? 'bg-red-500 text-white border-red-500'
              : 'bg-white text-gray-800 border border-gray-300'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
