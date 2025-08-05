import React from 'react';
import { TravelStatusBadge } from '../TravelStatusBadge';

export interface SummaryCardProps {
  title:       string;
  startDate:   string;
  endDate:     string;
  items:       { checked: boolean }[];
  onClick:     () => void;
}

export function SummaryCard({
  title, startDate, endDate, items, onClick
}: SummaryCardProps) {
  const allChecked  = items.length > 0 && items.every(i => i.checked);
  const someChecked = items.some(i => i.checked) && !allChecked;

  const fmt = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear().toString().slice(-2)}.${(d.getMonth()+1).toString().padStart(2,'0')}.${d.getDate().toString().padStart(2,'0')}`;
  };

  return (
    <div
      onClick={onClick}
      className="min-w-[180px] p-4 bg-white rounded-lg shadow hover:shadow-lg cursor-pointer transition flex flex-col"
    >
      <h5 className="font-semibold mb-1">{title}</h5>
      <p className="text-xs text-gray-500 mb-2">
        {fmt(startDate)} ~ {fmt(endDate)}
      </p>
      <div className="mt-auto">
        <TravelStatusBadge
          travelStart={startDate}
          checklist={items}
          // className="mb-1"
        />
        {allChecked  && <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded">완료</span>}
        {someChecked && <span className="text-xs bg-yellow-400 text-black px-2 py-0.5 rounded">진행중</span>}
      </div>
    </div>
  );
}