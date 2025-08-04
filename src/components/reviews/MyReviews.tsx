// src/components/MyReviews.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export interface ReviewItem {
  reviewId: number;
  title: string;
  content: string;
  image?: string | null;
  likes: number;
  createdAt: string; // ISO
  checklist?: {
    title: string;
    checklist_id?: number;
  };
  item?: {
    itemLabel: string;
    itemCategory: {
      categoryId: number;
      categoryLabel: string;
    };
  };
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

export function MyReviews() {
  const navigate = useNavigate();
  const [data, setData] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('jwt') || '';
        const res = await axios.get('/api/my/reviews', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // 구조 다양성 허용
        let payload: any = res.data;
        if (payload.reviews && Array.isArray(payload.reviews)) {
          payload = payload.reviews;
        }

        if (!Array.isArray(payload)) {
          console.warn('예상한 배열 구조가 아님:', res.data);
          setData([]);
        } else {
          setData(payload);
        }
      } catch (e: any) {
        console.error('fetchReviews 에러', e);
        setError(
          e.response?.data?.message || '불러오는 중 오류가 발생했습니다.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading)
    return (
      <div className="py-6 text-center text-sm">불러오는 중...</div>
    );
  if (error)
    return (
      <div className="py-6 text-center text-sm text-red-500">
        에러: {error}
      </div>
    );
  if (data.length === 0)
    return (
      <div className="py-6 text-center text-sm">
        작성한 후기가 없습니다.
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed border-collapse text-left text-[12px]">
        <colgroup>
          <col style={{ width: '30%' }} />
          <col style={{ width: '15%' }} />
          <col style={{ width: '20%' }} />
          <col style={{ width: '15%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '10%' }} />
        </colgroup>
        <thead>
          <tr className="border-b">
            <th className="py-2 px-2">제목</th>
            <th className="py-2 px-2">카테고리</th>
            <th className="py-2 px-2">체크리스트</th>
            <th className="py-2 px-2">작성일</th>
            <th className="py-2 px-2">좋아요</th>
            <th className="py-2 px-2">이미지</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr
              key={r.reviewId}
              className="border-b hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                // 상세 페이지로. 체크리스트가 있으면 그쪽, 없으면 리뷰 상세
                if (r.checklist?.checklist_id) {
                  navigate(`/shared-checklist/${r.checklist.checklist_id}`, {
                    state: { checklistTitle: r.checklist.title },
                  });
                } else {
                  navigate(`/review/${r.reviewId}`, {
                    state: { review: r },
                  });
                }
              }}
            >
              <td className="py-2 px-2">
                <div className="font-medium">{r.title}</div>
                <div className="text-[10px] text-gray-500 line-clamp-2">
                  {r.content}
                </div>
              </td>
              <td className="py-2 px-2">
                {r.item ? (
                  <>
                    {r.item.itemCategory.categoryLabel} / {r.item.itemLabel}
                  </>
                ) : (
                  '-'
                )}
              </td>
              <td className="py-2 px-2">
                {r.checklist?.title || '-'}
              </td>
              <td className="py-2 px-2">{formatDate(r.createdAt)}</td>
              <td className="py-2 px-2 text-center">{r.likes}</td>
              <td className="py-2 px-2">
                {r.image ? (
                  <img
                    src={r.image}
                    alt="후기"
                    className="w-12 h-12 object-cover rounded"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '';
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 rounded">
                    없음
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
