// src/components/ModifyCheckList.tsx
import React, { useState, useEffect } from 'react';

export interface Item {
  id: number;
  checked: boolean;
  category: string;
  tag: string;
  text: string;
}

export type RawCategory = {
  categoryId?: number;
  categoryLabel: string;
  items: { itemId?: number; itemLabel: string }[];
};

interface ChecklistEditorProps {
  initialTitle: string;
  initialStartDate: string; // YYYY-MM-DD
  initialEndDate: string;
  initialItems: Omit<Item, 'id' | 'checked'>[];
  onSave: (data: {
    title: string;
    startDate: string;
    endDate: string;
    items: Item[];
  }) => void;
  recommendedCategories?: RawCategory[];
}

const CATEGORY_OPTIONS = ['교통', '식사', '숙소', '전자기기', '의류', '문서'];
const TAG_OPTIONS = ['소품', '중요', '필수', '기타'];

const normalizeText = (s: string) => s.trim().toLowerCase();

export default function ModifyCheckList({
  initialTitle,
  initialStartDate,
  initialEndDate,
  initialItems,
  onSave,
  recommendedCategories = [],
}: ChecklistEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [items, setItems] = useState<Item[]>([]);
  const [nextId, setNextId] = useState(1);

  useEffect(() => {
    const mapped = initialItems.map((it, i) => ({
      id: i + 1,
      checked: false,
      category: it.category,
      tag: it.tag,
      text: it.text,
    }));
    setItems(mapped);
    setNextId(mapped.length + 1);
  }, [initialItems]);

  const addRow = () => {
    setItems(prev => [
      ...prev,
      {
        id: nextId,
        checked: false,
        category: CATEGORY_OPTIONS[0],
        tag: TAG_OPTIONS[0],
        text: '',
      },
    ]);
    setNextId(id => id + 1);
  };

  const deleteSelected = () => {
    setItems(prev => prev.filter(it => !it.checked));
  };

  const updateItem = (id: number, data: Partial<Item>) => {
    setItems(prev => prev.map(it => (it.id === id ? { ...it, ...data } : it)));
  };

  const addFromRecommendation = (text: string, categoryLabel?: string) => {
    const normalized = normalizeText(text);
    if (items.some(it => normalizeText(it.text) === normalized)) {
      return;
    }
    setItems(prev => [
      ...prev,
      {
        id: nextId,
        checked: false,
        category: categoryLabel || CATEGORY_OPTIONS[0],
        tag: '기타',
        text,
      },
    ]);
    setNextId(id => id + 1);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-black bg-opacity-80 text-white rounded-lg space-y-6">
      {/* 제목 / 날짜 */}
      <div className="flex flex-col md:flex-row gap-6 mb-4">
        <div className="flex flex-col flex-1">
          <label className="mb-1 font-medium">제목</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-transparent border border-red-500 rounded text-white focus:outline-none"
          />
        </div>
        <div className="flex flex-col flex-1">
          <label className="mb-1 font-medium">여행일</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="flex-1 px-3 py-2 bg-transparent border border-red-500 rounded text-white focus:outline-none"
            />
            <span className="flex items-center px-1">~</span>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="flex-1 px-3 py-2 bg-transparent border border-red-500 rounded text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 추천 준비물 */}
      {recommendedCategories.length > 0 && (
        <div className="border border-gray-600 rounded-lg p-4 bg-gray-900">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-semibold">카테고리별 추천 준비물</h4>
            <div className="text-sm text-gray-300">클릭해서 리스트에 추가하세요</div>
          </div>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {recommendedCategories.map(cat => (
              <div key={cat.categoryLabel}>
                <div className="font-medium mb-1">{cat.categoryLabel}</div>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map(it => (
                    <button
                      key={it.itemLabel}
                      onClick={() => addFromRecommendation(it.itemLabel, cat.categoryLabel)}
                      className="px-3 py-1 rounded-full border border-gray-500 text-sm hover:bg-red-600 hover:border-red-500 transition"
                      aria-label={`추가 ${it.itemLabel}`}
                    >
                      {it.itemLabel}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 아이템 리스트 */}
      <div className="relative border border-red-500 rounded-lg p-4">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={addRow} className="text-red-400 hover:text-red-200 text-sm font-medium">
            + 항목 추가
          </button>
          <button onClick={deleteSelected} className="ml-auto bg-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-600">
            선택 삭제
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto space-y-2">
          {items.map(it => (
            <div key={it.id} className="flex flex-wrap items-center gap-2 bg-gray-800 p-2 rounded">
              <input
                type="checkbox"
                checked={it.checked}
                onChange={e => updateItem(it.id, { checked: e.target.checked })}
                className="h-4 w-4 text-red-500 bg-white rounded"
              />
              <select
                value={it.category}
                onChange={e => updateItem(it.id, { category: e.target.value })}
                className="px-2 py-1 bg-transparent border border-gray-600 rounded text-xs"
              >
                {[...new Set([it.category, ...CATEGORY_OPTIONS])].map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                value={it.tag}
                onChange={e => updateItem(it.id, { tag: e.target.value })}
                className="px-2 py-1 bg-transparent border border-gray-600 rounded text-xs"
              >
                {TAG_OPTIONS.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={it.text}
                onChange={e => updateItem(it.id, { text: e.target.value })}
                className="flex-1 px-3 py-1 bg-transparent border-b border-gray-600 focus:outline-none text-sm"
                placeholder="준비물 입력"
              />
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-gray-400 text-sm">
              아직 추가된 항목이 없습니다. 위의 추천에서 추가하거나 직접 입력하세요.
            </p>
          )}
        </div>
      </div>

      {/* 저장 */}
      <div className="flex justify-end">
        <button
          onClick={() => onSave({ title, startDate, endDate, items })}
          className="bg-red-500 hover:bg-red-600 px-8 py-3 rounded-full text-white font-medium"
        >
          리스트 만들기
        </button>
      </div>
    </div>
  );
}