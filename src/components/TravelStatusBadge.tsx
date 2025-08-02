import React from 'react';
import dayjs from 'dayjs';

type Status = 'complete' | 'urgent' | 'incomplete';

interface TravelStatusBadgeProps {
  travelStart: string; // ex. "25.07.30 ~ 25.08.03"
  checklist: { checked: boolean }[];
}

// 시작 날짜 파싱
const parseStartDate = (range: string) => {
  const first = range.split('~')[0].trim(); // "25.07.30"
  return dayjs(first, ['YY.MM.DD', 'YYYY.MM.DD', 'YY-MM-DD', 'YYYY-MM-DD']);
};

const getStatus = (travelStart: string, checklist: { checked: boolean }[]): Status => {
  const allChecked = checklist.every(item => item.checked);
  if (allChecked) return 'complete';

  const start = parseStartDate(travelStart);
  const now = dayjs();
  const diffDays = start.diff(now, 'day');

  if (diffDays >= 0 && diffDays <= 3) return 'urgent'; // 임박
  return 'incomplete';
};

const badgeStyles = {
  complete: 'bg-green-500 text-white',
  urgent: 'bg-red-500 text-white',
  incomplete: 'bg-gray-300 text-gray-700',
} as const;

export const TravelStatusBadge: React.FC<TravelStatusBadgeProps> = ({
  travelStart,
  checklist,
}) => {
  const status = getStatus(travelStart, checklist);
  const label = status === 'complete' ? '완료' : status === 'urgent' ? '임박' : '진행중';
  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${badgeStyles[status]}`}
    >
      {label}
    </div>
  );
};
