// ReviewDisplay.tsx (체크리스트 전용 카드에 좋아요 추가)
import React, { useState } from 'react';
import dayjs from 'dayjs';

export interface ChecklistItem {
  category: string;
  tag: string;
  text: string;
  checked: boolean;
}

interface ChecklistDisplayProps {
  checklist: ChecklistItem[];
  title?: string;
  subtitle?: string;
}

const categories = ['교통', '식사', '숙소', '전자기기', '의류', '문서'];

const CheckListReview: React.FC<ChecklistDisplayProps> = ({
  checklist,
  title = '준비물 체크리스트',
  subtitle,
}) => {
  // 카드 단위로 좋아요를 따로 관리하고 싶다면 key를 category로 해서 객체로 해도 되고, 일단 전체 카드 공용 예시
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(3);

  const toggleLike = () => {
    setLiked(prev => !prev);
    setLikesCount(prev => (liked ? prev - 1 : prev + 1));
  };

  return (
    <div className="max-w-[1000px] mx-auto border rounded-xl overflow-hidden shadow-md bg-white">
      <div className="p-6 border-b relative">
        <div className="text-2xl font-bold flex justify-between" >
          {title}
           {/* [추가] 좋아요 버튼 (카드 우상단, 개수 옆) */}
            <button
              onClick={toggleLike}
              aria-label="좋아요"
              className="flex items-center gap-1 bg-white border rounded-full px-3 py-1 shadow-sm hover:shadow-md transition text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill={liked ? 'red' : 'none'}
                stroke={liked ? 'red' : 'currentColor'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 21s-6.716-5.197-9.5-10.5C.667 7.51 2.557 4 6.5 4c1.962 0 3.804 1.021 5.5 2.764C13.696 5.021 15.538 4 17.5 4 21.443 4 23.333 7.51 21.5 10.5 18.716 15.803 12 21 12 21z" />
              </svg>
              <span>{likesCount}</span>
            </button>
        </div>
        {subtitle && <div className="text-sm text-gray-500 mt-1">{subtitle}</div>}
      </div>

      <div className="p-6 space-y-4">
        {categories
          .map(cat => ({
            category: cat,
            items: checklist.filter(it => it.category === cat),
          }))
          .filter(group => group.items.length > 0)
          .map(group => (
            <div
              key={group.category}
              className="relative border rounded-lg overflow-hidden bg-gray-50"
            >
              {/* 헤더: 카테고리 + 오른쪽 상단 개수 박스 + 좋아요 버튼 */}
              <div className="flex justify-between items-center bg-white px-4 py-3 font-semibold relative">
                <div className="text-base">{group.category}</div>

                <div className="flex items-center gap-3">
                  {/* 개수 배지 */}
                  <div className="text-xs bg-gray-100 px-3 py-1 rounded-full border">
                    {group.items.length}개
                  </div>

                </div>
              </div>

              {/* 아이템 리스트 */}
              <div className="divide-y">
                {group.items.map((it, i) => (
                  <div
                    key={i}
                    className="flex items-center px-4 py-2 text-sm bg-white"
                  >
                    <div className="flex-1">{it.text || '(입력없음)'}</div>
                    <div className="px-2 text-xs border rounded">{it.tag}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CheckListReview;
