// src/components/MyCheckList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export interface SharedCheckList {
  checklist_id: number;
  title: string;
  city: string;
  travel_type: string;
  travel_start: string; // ISO date string
  travel_end: string; // ISO date string
  created_at: string; // ISO datetime
  content: string;
  likes: number;
}

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('ko-KR', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return iso;
  }
};

export function MyCheckList() {
  const navigate = useNavigate();
  const [data, setData] = useState<SharedCheckList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShared = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('jwt') || '';
        const res = await axios.get('/api/my/shared-checklists', {
          headers: { Authorization: `Bearer ${token}` },
        });

        let payload: any = res.data;
        if (!Array.isArray(payload) && Array.isArray(res.data?.data)) {
          payload = res.data.data;
        }

        if (!Array.isArray(payload)) {
          console.warn('예상한 배열이 아님:', res.data);
          setData([]);
        } else {
          setData(payload);
        }
      } catch (e: any) {
        console.error(e);
        setError(
          e.response?.data?.message || '불러오는 중 오류가 발생했습니다.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchShared();
  }, []);

  if (loading) {
    return <div className="py-6 text-center text-sm">불러오는 중...</div>;
  }

  if (error) {
    return (
      <div className="py-6 text-center text-sm text-red-500">
        에러: {error}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="py-6 text-center text-sm">
        공유한 체크리스트가 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed border-collapse text-left text-[12px]">
        <colgroup>
          <col style={{ width: '40%' }} /> {/* 제목/콘텐츠 */}
          <col style={{ width: '15%' }} /> {/* 기간 */}
          <col style={{ width: '15%' }} /> {/* 도시·타입 */}
          <col style={{ width: '15%' }} /> {/* 공유일 */}
          <col style={{ width: '15%' }} /> {/* 좋아요 */}
        </colgroup>
        <thead>
          <tr className="border-b">
            <th className="py-2 px-2">제목</th>
            <th className="py-2 px-2">기간</th>
            <th className="py-2 px-2">도시·타입</th>
            <th className="py-2 px-2">공유일</th>
            <th className="py-2 px-2">좋아요</th>
          </tr>
        </thead>
        <tbody className="max-h-[280px] overflow-y-auto">
          {data.map((row) => (
            <tr
              key={row.checklist_id}
              className="border-b hover:bg-gray-50 cursor-pointer"
              onClick={() =>
                navigate(`/shared-checklist/${row.checklist_id}`, {
                  state: { checklist: row },
                })
              }
            >
              <td className="py-2 px-2">
                <div className="font-medium">{row.title}</div>
                <div className="text-[10px] text-gray-500 line-clamp-2">
                  {row.content}
                </div>
              </td>
              <td className="py-2 px-2">
                {formatDate(row.travel_start)} ~ {formatDate(row.travel_end)}
              </td>
              <td className="py-2 px-2">
                {row.city} · {row.travel_type}
              </td>
              <td className="py-2 px-2">{formatDate(row.created_at)}</td>
              <td className="py-2 px-2 text-center">{row.likes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
