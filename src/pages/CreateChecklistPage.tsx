// src/pages/CreateChecklistPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModifyCheckList, { type Item, type RawCategory } from '../components/makeChecklist/ModifyCheckList';
import { useChecklistCreator, type Purpose } from '../hooks/useChecklistCreator';

export default function CreateChecklistPage() {
  const navigate = useNavigate();
  const { cities, citiesLoading, catalogLoading, createChecklist, creating, createError } =
    useChecklistCreator();

  // 전체 카테고리+아이템 목록 로딩 상태
  const [categories, setCategories] = useState<RawCategory[]>([]);
  const [catsLoading, setCatsLoading] = useState(true);
  const [catsError, setCatsError] = useState<string | null>(null);

  // 예시로 선택할 여행 목적과 도시 (실제론 폼으로 받아야 합니다)
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [selectedPurpose, setSelectedPurpose] = useState<Purpose>('힐링');

  useEffect(() => {
    // 1) /categories API 호출
    fetch('http://localhost:4000/categories', {
      headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`카테고리 로딩 실패: ${res.status}`);
        return res.json();
      })
      .then((data: RawCategory[]) => {
        setCategories(data);
      })
      .catch((err) => {
        console.error(err);
        setCatsError(err.message);
      })
      .finally(() => {
        setCatsLoading(false);
      });
  }, []);

  // 기본 도시 선택 (첫 번째)
  useEffect(() => {
    if (!citiesLoading && cities.length > 0 && selectedCityId === null) {
      setSelectedCityId(cities[0].cityId);
    }
  }, [citiesLoading, cities, selectedCityId]);

  // 저장 핸들러
  const handleSave = async (data: {
    title: string;
    startDate: string; // "YYYY-MM-DD"
    endDate: string;   // "YYYY-MM-DD"
    items: Item[];
  }) => {
    if (!selectedCityId) {
      alert('도시를 선택해주세요.');
      return;
    }

    try {
      // itemLabel 배열로 만들기
      const itemsTextList = data.items.map((it) => it.text);

      // 위탁 항목만 HOLD 로 설정
      const packingBagOverride: Record<string, string> = {};
      data.items.forEach((it) => {
        if (it.category === '위탁') {
          packingBagOverride[it.text] = 'HOLD';
        }
      });

      await createChecklist({
        jwt: localStorage.getItem('jwt') || '',
        userId: 1, // 실제 로그인 유저 ID
        cityId: selectedCityId,
        title: data.title,
        purpose: selectedPurpose,
        travelStart: data.startDate,
        travelEnd: data.endDate,
        itemsTextList,
        packingBagOverride,
        endpoint: 'http://localhost:4000/checklists',
      });

      alert('체크리스트 생성 완료!');
      navigate('/my-page');
    } catch (e: any) {
      alert(`생성 실패: ${e.message}`);
    }
  };

  if (catsLoading || citiesLoading || catalogLoading) {
    return <div className="p-6 text-center">로딩 중입니다...</div>;
  }
  if (catsError) {
    return <div className="p-6 text-center text-red-500">에러: {catsError}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto my-8">
      {/* (선택) 도시와 목적 선택 UI */}
      <div className="flex gap-4 mb-6">
        <select
          value={selectedCityId ?? undefined}
          onChange={(e) => setSelectedCityId(Number(e.target.value))}
          className="border px-3 py-2 rounded"
        >
          {cities.map((c) => (
            <option key={c.cityId} value={c.cityId}>
              {c.cityName}
            </option>
          ))}
        </select>
        <select
          value={selectedPurpose}
          onChange={(e) => setSelectedPurpose(e.target.value as Purpose)}
          className="border px-3 py-2 rounded"
        >
          <option value="힐링">힐링</option>
          <option value="액티비티">액티비티</option>
          <option value="비즈니스">비즈니스</option>
          <option value="문화탐방">문화탐방</option>
          <option value="캠핑">캠핑</option>
          <option value="GENERAL">일반</option>
        </select>
      </div>

      {/* ModifyCheckList 컴포넌트 */}
      <ModifyCheckList
        initialTitle=""
        initialStartDate=""
        initialEndDate=""
        initialItems={[]}
        recommendedCategories={categories}
        onSave={handleSave}
      />

      {/* 생성 중/에러 상태 표시 */}
      {creating && <div className="mt-4 text-center">저장 중...</div>}
      {createError && (
        <div className="mt-4 text-center text-red-500">
          에러: {createError.message}
        </div>
      )}
    </div>
  );
}