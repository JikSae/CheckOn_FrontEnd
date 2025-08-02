import React from 'react'

const CITIES = ['Tokyo', 'Osaka', 'Kyoto', 'Nara', 'Nagoya', 'Sapporo', 'Hakodate', 'Otaru'] as const;
type City = typeof CITIES[number];

interface CitySelectorProps {
  selected: City | null;
  onSelect: (city: City) => void;
}


const CitySelector = ({ selected, onSelect }: CitySelectorProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {CITIES.map(city => (
        <button
          key={city}
          onClick={() => onSelect(city)}
          aria-pressed={selected === city}
          className={`
            px-3 py-1 rounded-full text-sm font-medium transition
            ${selected === city 
              ? 'bg-red-500 text-white shadow' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
          `}
        >
          {city}
        </button>
      ))}
    </div>
  );
}

export default CitySelector