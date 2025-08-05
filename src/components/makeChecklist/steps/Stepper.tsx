import React from 'react';

const STEPS = [
  'city',
  'date',
  'companion',
  'purpose',
  'jp',
  'transport',
  'activities',
  'minimal',
  'exchange',
  'items',
] as const;

export function Stepper({ current }: { current: string }) {
  return (
    <div className="flex gap-2 mb-4 text-xs items-center">
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full border text-sm font-medium ${
                s === current
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-white text-gray-500 border-gray-300'
              }`}
            >
              {i + 1}
            </div>
            <div className="capitalize">{s}</div>
          </div>
          {i < STEPS.length - 1 && <div className="flex-1 h-px bg-gray-300 mx-2" />}
        </React.Fragment>
      ))}
    </div>
  );
}
