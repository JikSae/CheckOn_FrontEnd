import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export function DateStep({
  departureDate,
  arrivalDate,
  onSelectDeparture,
  onSelectArrival,
}: {
  departureDate?: Date;
  arrivalDate?: Date;
  onSelectDeparture: (d: Date | undefined) => void;
  onSelectArrival: (d: Date | undefined) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <p className="mb-2 font-medium">출발일</p>
        <DayPicker
          mode="single"
          selected={departureDate}
          onSelect={onSelectDeparture}
        />
      </div>
      <div>
        <p className="mb-2 font-medium">도착일</p>
        <DayPicker
          mode="single"
          selected={arrivalDate}
          onSelect={onSelectArrival}
        />
      </div>
    </div>
  );
}
