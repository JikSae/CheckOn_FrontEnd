import React from 'react';

export function CompanionStep({
  companions,
  options,
  toggleCompanion,
  onNext,
}: {
  companions: string[];
  options: string[];
  toggleCompanion: (c: string) => void;
  onNext: () => void;
}) {
  const finish = () => {
    onNext();
  };

  return (
    <>
      <div className="flex gap-2 flex-wrap mb-4">
        {options.map((opt) => {
          const active = companions.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => toggleCompanion(opt)}
              className={`px-4 py-2 rounded-full border ${
                active
                  ? 'bg-red-500 text-white border-red-500'
                  : 'bg-white text-gray-800 border border-gray-300'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      <div className="flex justify-end">
        <button onClick={finish} className="bg-red-500 text-white px-6 py-2 rounded-full">
          다음
        </button>
      </div>
    </>
  );
}
