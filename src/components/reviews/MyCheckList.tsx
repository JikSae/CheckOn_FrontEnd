import React from 'react';

interface Item {
  id: number;
  title: string;
  dateRange: string;
  tags: string;
  createdAt: string;
}

const DUMMY: Item[] = [
  {
    id: 1,
    title: '일본 여행 후기',
    dateRange: '25.06.10 ~ 25.06.17',
    tags: '#나라 #힐링 #동전지갑',
    createdAt: '25.06.21',
  },
  // … 더미 데이터
];

export function MyCheckList() {
  return (
    <table className="w-full table-auto border-collapse text-left">
      <colgroup>
        <col className="w-1/2" />   {/* 제목: 50% */}
        <col className="w-1/6" />   {/* 날짜: 16.7% */}
        <col className="w-1/4" />   {/* 태그: 25% */}
        <col className="w-1/12" />  {/* 작성일: 8.3% */}
      </colgroup>
      <thead>
        <tr>
          <th className="border-b-2 py-2 text-center text-[10px]">제목</th>
          <th className="border-b-2 py-2 text-center text-[10px]">날짜</th>
          <th className="border-b-2 py-2 text-center text-[10px]">태그</th>
          <th className="border-b-2 py-2 text-center text-[10px]">작성일</th>
        </tr>
      </thead>
      <tbody>
        {DUMMY.map((row) => (
          <tr key={row.id} className="border-b h-12">
            <td className="px-2 text-center text-[12px]">{row.title}</td>
            <td className="px-2 text-center text-[10px]">{row.dateRange}</td>
            <td className="px-2 text-center text-[10px]">{row.tags}</td>
            <td className="px-2 text-center text-[10px]">{row.createdAt}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}