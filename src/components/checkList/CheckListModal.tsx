// src/components/checkList/CheckListModal.tsx
import React, { useState, useRef, useEffect } from 'react';

type SelectType = '기내' | '위탁';

interface Item {
  name: string;
  category: SelectType;
  active: boolean;
  review: boolean;
}

// props에 checklistId 추가
interface CheckListModalProps {
  checklistId: number;
}

const initialItems: Item[] = [
  { name: '전기 어댑터(돼지코)', category: '기내', active: true, review: false },
  { name: '동전지갑', category: '기내', active: true, review: false },
  { name: '휴대용 에코백', category: '기내', active: true, review: false },
  { name: '접이식 우산', category: '기내', active: true, review: false },
  { name: '여권 / 여권복사본', category: '위탁', active: true, review: false },
  { name: 'WI-Fi 도시락', category: '위탁', active: true, review: false },
  { name: '일본 교통카드 / 교통 패스', category: '위탁', active: true, review: false },
  { name: '보조 배터리', category: '위탁', active: true, review: false },
  { name: '엔화', category: '위탁', active: true, review: false },
  { name: '세면 도구', category: '위탁', active: true, review: false },
  { name: '상비약(소화제, 진통제, 감기약)', category: '위탁', active: true, review: false },
  { name: '여벌 옷 및 속옷', category: '위탁', active: true, review: false },
];

export default function CheckListModal({ checklistId }: CheckListModalProps) {
  const [items, setItems] = useState<Item[]>(initialItems);

  const inCabinRef = useRef<HTMLDivElement>(null);
  const checkedRef = useRef<HTMLDivElement>(null);

  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewItems, setReviewItems] = useState<Item[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [reviewTexts, setReviewTexts] = useState<string[]>([]);
  const [reviewImages, setReviewImages] = useState<(File | null)[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleCategoryChange = (name: string, newCat: SelectType) => {
    setItems(prev =>
      prev.map(item => (item.name === name ? { ...item, category: newCat } : item))
    );
  };
  const toggleActive = (name: string) => {
    setItems(prev =>
      prev.map(item => (item.name === name ? { ...item, active: !item.active } : item))
    );
  };
  const toggleReview = (name: string) => {
    setItems(prev =>
      prev.map(item => (item.name === name ? { ...item, review: !item.review } : item))
    );
  };

  const handleOpenReview = () => {
    const selected = items.filter(item => item.review);
    if (!selected.length) return;
    setReviewItems(selected);
    setReviewTexts(Array(selected.length).fill(''));
    setReviewImages(Array(selected.length).fill(null));
    setPreviewUrls(Array(selected.length).fill(''));
    setCurrentIdx(0);
    setReviewModalOpen(true);
  };
  const handleCloseReview = () => setReviewModalOpen(false);

  const updateText = (text: string) => {
    setReviewTexts(prev => {
      const copy = [...prev];
      copy[currentIdx] = text;
      return copy;
    });
  };

  const handleImageChange = (file: File, idx: number) => {
    const url = URL.createObjectURL(file);
    setPreviewUrls(prev => {
      const copy = [...prev];
      copy[idx] = url;
      return copy;
    });
    setReviewImages(prev => {
      const copy = [...prev];
      copy[idx] = file;
      return copy;
    });
  };

  const handleNext = () => {
    if (reviewTexts[currentIdx].trim().length < 10) return;
    if (currentIdx < reviewItems.length - 1) {
      setCurrentIdx(i => i + 1);
    } else {
      const payload = reviewItems.map((item, idx) => ({
        name: item.name,
        text: reviewTexts[idx],
        image: reviewImages[idx],
        checklistId, // 여기 체크리스트 아이디 포함 가능
      }));
      console.log('모든 리뷰 제출 준비:', payload);
      setReviewModalOpen(false);
    }
  };

  const inCabinItems = items.filter(item => item.category === '기내');
  const checkedItems = items.filter(item => item.category === '위탁');

  const Section = ({
    title,
    list,
  }: {
    title: SelectType;
    list: Item[];
  }) => (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 text-center font-semibold text-gray-700">
        {title === '기내' ? '기내용' : '위탁 수화물'}
      </div>
      <div className="px-4 py-6">
        <div className="grid grid-cols-[auto_3fr_2fr_auto] gap-4 items-center text-gray-600 font-medium border-b border-gray-300 pb-2 mb-4">
          <div />
          <div className="text-left">물품 이름</div>
          <div className="text-center">Check! / 이동</div>
          <div className="text-left">후기 작성</div>
        </div>
        <div className="space-y-3">
          {list.map(item => (
            <div
              key={item.name}
              className="grid grid-cols-[auto_1fr_1fr_auto_auto] gap-4 items-center"
            >
              <input
                type="checkbox"
                className="h-4 w-4 text-red-500"
                checked={!item.active}
                onChange={() => toggleActive(item.name)}
              />
              <div className={item.active ? 'text-gray-800' : 'text-gray-400'}>
                {item.name}
              </div>
              <div className="flex justify-center space-x-2">
                {(['기내', '위탁'] as SelectType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => handleCategoryChange(item.name, type)}
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      type === item.category
                        ? type === '기내'
                          ? 'bg-gray-700 text-white'
                          : 'bg-red-500 text-white'
                        : type === '기내'
                        ? 'bg-gray-200 text-gray-700'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
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

  useEffect(() => {
    if (reviewItems.length > 0) {
      setReviewTexts(prev => {
        if (prev.length === reviewItems.length) return prev;
        return Array(reviewItems.length).fill('');
      });
      setReviewImages(prev => {
        if (prev.length === reviewItems.length) return prev;
        return Array(reviewItems.length).fill(null);
      });
      setPreviewUrls(prev => {
        if (prev.length === reviewItems.length) return prev;
        return Array(reviewItems.length).fill('');
      });
    }
  }, [reviewItems]);

  return (
    <div className="w-[850px] mx-auto space-y-6 overflow-y-auto ">
      <div ref={inCabinRef}>
        <Section title="기내" list={inCabinItems} />
      </div>
      <div ref={checkedRef}>
        <Section title="위탁" list={checkedItems} />
      </div>

      <div className="bg-white rounded-b-lg px-6 py-4 text-right shadow">
        <button
          onClick={handleOpenReview}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          후기 작성하러 가기
        </button>
      </div>

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
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-1">Review</h2>
            <p className="text-sm text-gray-600 mb-4">
              {`체크리스트 #${checklistId} — ${currentIdx + 1} / ${reviewItems.length}`}
            </p>
            <hr className="border-gray-300 mb-4" />

            <p className="font-semibold mb-2">{reviewItems[currentIdx].name}</p>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="relative border border-gray-300 rounded-lg h-64 bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden">
                {previewUrls[currentIdx] ? (
                  <>
                    <img
                      src={previewUrls[currentIdx]}
                      alt="preview"
                      className="object-cover w-full h-full"
                    />
                    <button
                      onClick={() => {
                        setPreviewUrls(prev => {
                          const copy = [...prev];
                          copy[currentIdx] = '';
                          return copy;
                        });
                        setReviewImages(prev => {
                          const copy = [...prev];
                          copy[currentIdx] = null;
                          return copy;
                        });
                      }}
                      className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full px-2 py-1 text-xs"
                    >
                      삭제
                    </button>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                    <div className="text-center">
                      <div className="mb-1 font-medium">사진을 넣어주세요</div>
                      <div className="text-xs text-gray-500">클릭해서 업로드</div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={e => {
                        const f = e.target.files?.[0];
                        if (f) handleImageChange(f, currentIdx);
                      }}
                    />
                  </label>
                )}
              </div>

              <div>
                <textarea
                  value={reviewTexts[currentIdx]}
                  onChange={e => updateText(e.target.value)}
                  placeholder="후기를 입력하세요 (최소 10자)"
                  className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                />
                {reviewTexts[currentIdx].trim().length < 10 && (
                  <div className="text-xs text-red-500 mt-1">
                    최소 10자 이상 입력해 주세요. ({reviewTexts[currentIdx].length}/10)
                  </div>
                )}
              </div>
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
                disabled={reviewTexts[currentIdx].trim().length < 10}
                className={`px-4 py-2 rounded ${
                  currentIdx < reviewItems.length - 1
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-green-600 text-white hover:bg-green-700'
                } transition disabled:opacity-50`}
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
