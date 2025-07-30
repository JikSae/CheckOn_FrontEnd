// src/components/checkList/CheckListModal.tsx
import React, { useState } from 'react';

const initialInCabin = [
  '전기 어댑터(돼지코)',
  '동전지갑',
  '휴대용 에코백',
  '접이식 우산',
];
const initialChecked = [
  '여권 / 여권복사본',
  'WI‑Fi 도시락',
  '일본 교통카드 / 교통 패스',
  '보조 배터리',
  '엔화',
  '세면 도구',
  '상비약(소화제, 진통제, 감기약)',
  '여벌 옷 및 속옷',
];

type SelectType = '기내' | '위탁';

export default function CheckListModal() {
  // ─── 체크리스트 상태 ───────────────────────────────────
  const [inCabinActive, setInCabinActive] = useState<boolean[]>(
    Array(initialInCabin.length).fill(true)
  );
  const [checkedActive, setCheckedActive] = useState<boolean[]>(
    Array(initialChecked.length).fill(true)
  );
  const [inCabinSel, setInCabinSel] = useState<SelectType[]>(
    Array(initialInCabin.length).fill('기내')
  );
  const [checkedSel, setCheckedSel] = useState<SelectType[]>(
    Array(initialChecked.length).fill('기내')
  );
  const [inCabinReview, setInCabinReview] = useState<boolean[]>(
    Array(initialInCabin.length).fill(false)
  );
  const [checkedReview, setCheckedReview] = useState<boolean[]>(
    Array(initialChecked.length).fill(false)
  );

  // ─── 모달 & 순차 리뷰 상태 ────────────────────────────────
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewItems, setReviewItems] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [reviewTexts, setReviewTexts] = useState<string[]>([]);

  // ─── 체크리스트 핸들러 ───────────────────────────────────
  const toggleInCabinActive = (i: number) => {
    const c = [...inCabinActive]; c[i] = !c[i]; setInCabinActive(c);
  };
  const toggleCheckedActive = (i: number) => {
    const c = [...checkedActive]; c[i] = !c[i]; setCheckedActive(c);
  };
  const handleInCabinSelect = (i: number, t: SelectType) => {
    const c = [...inCabinSel]; c[i] = t; setInCabinSel(c);
  };
  const handleCheckedSelect = (i: number, t: SelectType) => {
    const c = [...checkedSel]; c[i] = t; setCheckedSel(c);
  };
  const toggleInCabinReview = (i: number) => {
    const c = [...inCabinReview]; c[i] = !c[i]; setInCabinReview(c);
  };
  const toggleCheckedReview = (i: number) => {
    const c = [...checkedReview]; c[i] = !c[i]; setCheckedReview(c);
  };

  // ─── “후기 작성하러 가기” → 모달 열기 ─────────────────────
  const handleOpenReview = () => {
    const selIn = initialInCabin.filter((_, i) => inCabinReview[i]);
    const selChk = initialChecked.filter((_, i) => checkedReview[i]);
    const items = [...selIn, ...selChk];
    if (!items.length) return;
    setReviewItems(items);
    setReviewTexts(items.map(() => ''));
    setCurrentIdx(0);
    setReviewModalOpen(true);
  };
  const handleCloseReview = () => {
    setReviewModalOpen(false);
  };

  // ─── 모달 내 “다음”/“완료” ────────────────────────────────
  const handleNext = () => {
    if (currentIdx < reviewItems.length - 1) {
      setCurrentIdx(idx => idx + 1);
    } else {
      console.log('모든 리뷰:', reviewTexts);
      setReviewModalOpen(false);
    }
  };
  const updateText = (text: string) => {
    const c = [...reviewTexts]; c[currentIdx] = text; setReviewTexts(c);
  };

  // ─── 섹션 컴포넌트 ──────────────────────────────────────
  const Section = ({
    title, items,
    activeArr, selArr, reviewArr,
    toggleActiveFn, handleSelectFn, toggleReviewFn
  }: {
    title: string;
    items: string[];
    activeArr: boolean[];
    selArr: SelectType[];
    reviewArr: boolean[];
    toggleActiveFn: (i: number) => void;
    handleSelectFn: (i: number, t: SelectType) => void;
    toggleReviewFn: (i: number) => void;
  }) => (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 text-center font-semibold text-gray-700">
        {title}
      </div>
      <div className="px-4 py-6">
        <div className="grid grid-cols-[auto_3fr_1fr_auto] gap-4 items-center
                        text-gray-600 font-medium border-b border-gray-300 pb-2 mb-4">
          <div/> <div className="text-center">물품 이름</div>
          <div className="text-center">Check!</div> <div className="text-center">후기 작성</div>
        </div>
        <div className="space-y-3">
          {items.map((item,i) => {
            const isActive=activeArr[i], sel=selArr[i], rev=reviewArr[i];
            return (
              <div key={i}
                   className="grid grid-cols-[auto_3fr_1fr_auto] gap-4 items-center">
                <input type="checkbox"
                       className="h-4 w-4 text-red-500"
                       checked={!isActive}
                       onChange={()=>toggleActiveFn(i)} />
                <div className={isActive?'text-gray-800':'text-gray-400'}>{item}</div>
                <div className="flex space-x-2">
                  {(['기내','위탁'] as SelectType[]).map(type=>{
                    const base='px-3 py-1 rounded-full text-sm transition';
                    const variant= type==='기내'
                      ? sel==='기내'
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-200 text-gray-700'
                      : sel==='위탁'
                        ? 'bg-red-500 text-white'
                        : 'bg-red-100 text-red-600';
                    return (
                      <button key={type}
                              onClick={()=>handleSelectFn(i,type)}
                              className={`${base} ${variant}`}>
                        {type}
                      </button>
                    );
                  })}
                </div>
                <input type="checkbox"
                       className="h-4 w-4 text-red-500 mx-auto"
                       checked={rev}
                       onChange={()=>toggleReviewFn(i)} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-[850px] mx-auto space-y-6">
      {/* 체크리스트 섹션들 */}
      <Section
        title="기내용"
        items={initialInCabin}
        activeArr={inCabinActive}
        selArr={inCabinSel}
        reviewArr={inCabinReview}
        toggleActiveFn={toggleInCabinActive}
        handleSelectFn={handleInCabinSelect}
        toggleReviewFn={toggleInCabinReview}
      />
      <Section
        title="위탁 수화물"
        items={initialChecked}
        activeArr={checkedActive}
        selArr={checkedSel}
        reviewArr={checkedReview}
        toggleActiveFn={toggleCheckedActive}
        handleSelectFn={handleCheckedSelect}
        toggleReviewFn={toggleCheckedReview}
      />

      {/* 후기 버튼 */}
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
            onClick={e=>e.stopPropagation()}
          >
            <button
              onClick={handleCloseReview}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >✕</button>

            <h2 className="text-xl font-bold mb-1">Review</h2>
            <p className="text-sm text-gray-600 mb-4">
              {`오사카 힐링 여행 — ${currentIdx+1} / ${reviewItems.length}`}
            </p>
            <hr className="border-gray-300 mb-4" />

            <p className="font-semibold mb-2">
              {reviewItems[currentIdx]}
            </p>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="border border-gray-300 rounded-lg h-64 bg-gray-100
                              flex items-center justify-center text-gray-400">
                사진을 넣어주세요
              </div>
              <textarea
                value={reviewTexts[currentIdx]}
                onChange={e=>updateText(e.target.value)}
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
