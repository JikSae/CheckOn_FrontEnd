// src/components/checkList/CheckListModal.tsx
import React, { useState, useRef } from 'react';

type SelectType = '기내' | '위탁';

interface Item {
  name: string;
  category: SelectType;
  active: boolean;
  review: boolean;
}

// 초기 목록: '기내'와 '위탁' 카테고리로 설정
const initialItems: Item[] = [
  { name: '전기 어댑터(돼지코)',    category: '기내', active: true, review: false },
  { name: '동전지갑',               category: '기내', active: true, review: false },
  { name: '휴대용 에코백',          category: '기내', active: true, review: false },
  { name: '접이식 우산',            category: '기내', active: true, review: false },
  { name: '여권 / 여권복사본',      category: '위탁', active: true, review: false },
  { name: 'WI‑Fi 도시락',          category: '위탁', active: true, review: false },
  { name: '일본 교통카드 / 교통 패스',category: '위탁', active: true, review: false },
  { name: '보조 배터리',            category: '위탁', active: true, review: false },
  { name: '엔화',                   category: '위탁', active: true, review: false },
  { name: '세면 도구',              category: '위탁', active: true, review: false },
  { name: '상비약(소화제, 진통제, 감기약)', category: '위탁', active: true, review: false },
  { name: '여벌 옷 및 속옷',        category: '위탁', active: true, review: false },
];

export default function CheckListModal() {
  // 전체 아이템 상태
  const [items, setItems] = useState<Item[]>(initialItems);

  // ─── 섹션 스크롤용 레퍼런스 ─────────────────────────────
  const inCabinRef = useRef<HTMLDivElement>(null);
  const checkedRef = useRef<HTMLDivElement>(null);

  // ─── 리뷰 모달 상태 ────────────────────────────────────
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewItems, setReviewItems] = useState<Item[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [reviewTexts, setReviewTexts] = useState<string[]>([]);

  // ─── 아이템 업데이트 핸들러 ─────────────────────────────
  /** 카테고리 변경 (기내 ↔️ 위탁) */
  const handleCategoryChange = (name: string, newCat: SelectType) => {
    setItems(prev =>
      prev.map(item =>
        item.name === name ? { ...item, category: newCat } : item
      )
    );
  };

  /** 체크(on/off) 토글 */
  const toggleActive = (name: string) => {
    setItems(prev =>
      prev.map(item =>
        item.name === name ? { ...item, active: !item.active } : item
      )
    );
  };

  /** 후기 작성 선택 토글 */
  const toggleReview = (name: string) => {
    setItems(prev =>
      prev.map(item =>
        item.name === name ? { ...item, review: !item.review } : item
      )
    );
  };

  // ─── 순차 리뷰 모달 열기/닫기 ────────────────────────────
  const handleOpenReview = () => {
    const selected = items.filter(item => item.review);
    if (!selected.length) return;
    setReviewItems(selected);
    setReviewTexts(Array(selected.length).fill(''));
    setCurrentIdx(0);
    setReviewModalOpen(true);
  };
  const handleCloseReview = () => setReviewModalOpen(false);

  // ─── 모달 내 다음/완료 버튼 ──────────────────────────────
  const handleNext = () => {
    if (currentIdx < reviewItems.length - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      console.log('모든 리뷰:', reviewTexts);
      setReviewModalOpen(false);
    }
  };
  const updateText = (text: string) => {
    setReviewTexts(prev => {
      const copy = [...prev];
      copy[currentIdx] = text;
      return copy;
    });
  };

  // ─── 섹션별 분류 ─────────────────────────────────────────
  const inCabinItems = items.filter(item => item.category === '기내');
  const checkedItems = items.filter(item => item.category === '위탁');

  // ─── 섹션 컴포넌트 ──────────────────────────────────────
  const Section = ({
    title,
    list,
  }: {
    title: SelectType;
    list: Item[];
  }) => (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* 섹션 제목 */}
      <div className="bg-gray-100 px-4 py-2 text-center font-semibold text-gray-700">
        {title === '기내' ? '기내용' : '위탁 수화물'}
      </div>
      <div className="px-4 py-6">
        {/* 헤더 */}
        <div className="grid grid-cols-[auto_3fr_2fr_auto] gap-4 items-center
                        text-gray-600 font-medium border-b border-gray-300 pb-2 mb-4">
          <div />
          <div className="text-center">물품 이름</div>
          <div className="text-center">Check! / 이동</div>
          <div className="text-center">후기 작성</div>
        </div>
        {/* 아이템 리스트 */}
        <div className="space-y-3">
          {list.map(item => (
            <div
              key={item.name}
              className="grid grid-cols-[auto_3fr_2fr_auto] gap-4 items-center"
            >
              {/* 체크박스 */}
              <input
                type="checkbox"
                className="h-4 w-4 text-red-500"
                checked={!item.active}
                onChange={() => toggleActive(item.name)}
              />

              {/* 물품 이름 */}
              <div className={item.active ? 'text-gray-800' : 'text-gray-400'}>
                {item.name}
              </div>

              {/* 카테고리 이동 버튼 */}
              <div className="flex justify-center space-x-2">
                {(['기내', '위탁'] as SelectType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => handleCategoryChange(item.name, type)}
                    className={`px-3 py-1 rounded-full text-sm transition
                      ${
                        type === item.category
                          ? type === '기내'
                            ? 'bg-gray-700 text-white'
                            : 'bg-red-500 text-white'
                          : type === '기내'
                            ? 'bg-gray-200 text-gray-700'
                            : 'bg-red-100 text-red-600'
                      }
                    `}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* 후기 선택 */}
              <input
                type="checkbox"
                className="h-4 w-4 text-red-500 mx-auto"
                checked={item.review}
                onChange={() => toggleReview(item.name)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-[850px] mx-auto space-y-6 overflow-y-auto ">
      {/* 섹션 스크롤용 탭 */}
      {/* <div className="flex space-x-2 mb-4">
        <button
          onClick={() => inCabinRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          기내용
        </button>
        <button
          onClick={() => checkedRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          위탁 수화물
        </button>
      </div> */}

      {/* 기내용 섹션 */}
      <div ref={inCabinRef}>
        <Section title="기내" list={inCabinItems} />
      </div>

      {/* 위탁 수화물 섹션 */}
      <div ref={checkedRef}>
        <Section title="위탁" list={checkedItems} />
      </div>

      {/* 후기 작성 버튼 */}
      <div className="bg-white rounded-b-lg px-6 py-4 text-right shadow">
        <button
          onClick={handleOpenReview}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          후기 작성하러 가기
        </button>
      </div>

      {/* 순차 리뷰 모달 */}
      {isReviewModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseReview}
        >
          <div
            className="bg-white w-full max-w-2xl mx-4 p-6 rounded-lg shadow-lg relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={handleCloseReview}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >✕</button>

            <h2 className="text-xl font-bold mb-1">Review</h2>
            <p className="text-sm text-gray-600 mb-4">
              {`오사카 힐링 여행 — ${currentIdx + 1} / ${reviewItems.length}`}
            </p>
            <hr className="border-gray-300 mb-4" />

            <p className="font-semibold mb-2">
              {reviewItems[currentIdx].name}
            </p>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="border border-gray-300 rounded-lg h-64 bg-gray-100
                              flex items-center justify-center text-gray-400">
                사진을 넣어주세요
              </div>
              <textarea
                value={reviewTexts[currentIdx]}
                onChange={e => updateText(e.target.value)}
                placeholder="후기를 입력하세요 (최소 10자)"
                className="w-full h-64 p-3 border border-gray-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </div>

            <hr className="border-gray-300 mb-4" />

            <div className="text-right space-x-2">
              <button
                onClick={handleCloseReview}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
              >
                취소
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                {currentIdx < reviewItems.length - 1 ? '다음' : '완료'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
