import React from 'react';

export function PurposeStep({
  purpose,
  options,
  onSelectPurpose,
}: {
  purpose: string;
  options: string[];
  onSelectPurpose: (opt: string) => void;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelectPurpose(opt)}
          className={`px-4 py-2 rounded-full border ${
            purpose === opt
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
