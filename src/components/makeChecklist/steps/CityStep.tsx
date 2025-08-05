import React from 'react';

export function CityStep({
  cities,
  selectedCity,
  onSelect,
  loading,
  error,
}: {
  cities: { cityId: number; cityName: string }[];
  selectedCity: { cityId: number; cityName: string } | null;
  onSelect: (c: { cityId: number; cityName: string }) => void;
  loading: boolean;
  error: string | null;
}) {
  return (
    <>
      {loading ? (
        <div className="text-sm text-gray-600">도시 불러오는 중...</div>
      ) : error ? (
        <div className="text-sm text-red-500">
          {error}{' '}
          <button onClick={() => window.location.reload()} className="underline">
            다시 시도
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {cities.map((c) => (
            <button
              key={c.cityId}
              onClick={() => onSelect(c)}
              aria-pressed={selectedCity?.cityId === c.cityId}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCity?.cityId === c.cityId
                  ? 'bg-red-500 text-white shadow'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {c.cityName}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
