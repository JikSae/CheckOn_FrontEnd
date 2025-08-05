// TopReviews.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

interface Review {
  review_id: number;
  title: string;
  author?: string;
  created_at: string; // ISO string
  likes: number;
  mainItemName?: string;
  checklist?: any[];
}

export default function TopReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTopReviews();
  }, []);

  const fetchTopReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('jwt') || '';
      const res = await axios.get('http://localhost:4000/items-reviews', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // assume res.data.reviews or res.data is array
      let payload: any = res.data;
      if (payload.reviews && Array.isArray(payload.reviews)) {
        payload = payload.reviews;
      }

      if (!Array.isArray(payload)) {
        throw new Error('예상한 배열 구조가 아닙니다.');
      }

      const sorted = payload
        .sort((a: Review, b: Review) => b.likes - a.likes)
        .slice(0, 5);
      setReviews(sorted);
    } catch (e: any) {
      console.error('TopReviews fetch error', e);
      setError(
        e.response?.data?.message || e.message || '추천 후기 불러오기 실패'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">로딩 중...</div>;
  if (error) return <div className="p-4 text-red-500">에러: {error}</div>;
  if (reviews.length === 0)
    return <div className="p-4">추천 후기 정보가 없습니다.</div>;

  return (
    <div className="max-w-[900px] mx-auto my-6 border rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-bold">추천 물품</h2>
        <span className="text-sm text-gray-500">좋아요 순 랭킹 Top 5</span>
      </div>
      <table className="w-full table-auto">
        <thead>
          <tr className="text-left text-sm font-semibold border-b">
            <th className="px-4 py-3 w-[60px]">순위</th>
            <th className="px-4 py-3">제목</th>
            <th className="px-4 py-3">작성자</th>
            <th className="px-4 py-3">작성일</th>
            <th className="px-4 py-3 text-right">좋아요</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r, idx) => (
            <tr
              key={r.review_id}
              className="border-b hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                /* 클릭 시 상세 페이지로 이동하거나 modal 열기 */
              }}
            >
              <td className="px-4 py-3 align-top">
                <div className="flex items-center gap-2">
                  <div className="text-lg font-bold">{idx + 1}</div>
                  {idx === 0 && (
                    <div className="text-xs bg-yellow-300 px-2 rounded">Best</div>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="font-medium">{r.title}</div>
                {r.mainItemName && (
                  <div className="text-xs text-gray-500">주요 물품: {r.mainItemName}</div>
                )}
              </td>
              <td className="px-4 py-3">{r.author || '익명'}</td>
              <td className="px-4 py-3">
                {dayjs(r.created_at).format('YYYY.MM.DD')}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="inline-flex items-center gap-1">
                  <span className="font-semibold">{r.likes}</span>
                  <span className="text-xs text-gray-400">👍</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
