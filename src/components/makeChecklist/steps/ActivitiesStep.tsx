import React from 'react';

export function ActivitiesStep({
  activities,
  options,
  toggleActivity,
  onNext,
}: {
  activities: string[];
  options: string[];
  toggleActivity: (act: string) => void;
  onNext: () => void;
}) {
  const finish = () => {
    onNext();
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4">
        {options.map((act) => (
          <button
            key={act}
            onClick={() => toggleActivity(act)}
            className={`px-3 py-1 rounded-full border ${
              activities.includes(act)
                ? 'bg-red-500 text-white border-red-500'
                : 'bg-white text-gray-800 border border-gray-300'
            }`}
          >
            {act}
          </button>
        ))}
      </div>
      <button onClick={finish} className="ml-auto bg-red-500 text-white px-6 py-2 rounded-full">
        다음
      </button>
    </>
  );
}
