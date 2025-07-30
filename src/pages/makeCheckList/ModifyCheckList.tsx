import React, { useState, useEffect } from 'react';

export interface Item {
  id: number;
  checked: boolean;
  category: string;
  tag: string;
  text: string;
}

// 편집기에서 사용할 props
interface ChecklistEditorProps {
  initialTitle: string;
  initialStartDate: string; // YYYY-MM-DD
  initialEndDate: string;
  initialItems: Omit<Item,'id'|'checked'>[]; // ChatChecklist 에서 넘겨줄 간단한 배열
  onSave: (data: {
    title: string;
    startDate: string;
    endDate: string;
    items: Item[];
  }) => void;
}

const CATEGORY_OPTIONS = ['교통', '식사', '숙소', '전자기기', '의류', '문서'];
const TAG_OPTIONS = ['소품', '중요', '필수', '기타'];

export default function ModifyCheckList({
  initialTitle,
  initialStartDate,
  initialEndDate,
  initialItems,
  onSave,
}: ChecklistEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  const [items, setItems] = useState<Item[]>([]);
  const [nextId, setNextId] = useState(1);

  // 마운트 시 initialItems → items 변환
  useEffect(() => {
    const mapped = initialItems.map((it, i) => ({
      id: i+1,
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
    setItems(prev =>
      prev.map(it => (it.id === id ? { ...it, ...data } : it))
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-black bg-opacity-80 text-white rounded-lg">
      {/* 제목 / 날짜 */}
      <div className="flex gap-4 mb-6">
        <div className="flex flex-col">
          <label className="mb-1">제목</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-60 px-3 py-2 bg-transparent border border-red-500 rounded text-white focus:outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1">여행일</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="px-3 py-2 bg-transparent border border-red-500 rounded text-white focus:outline-none"
            />
            <span className="flex items-center">~</span>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="px-3 py-2 bg-transparent border border-red-500 rounded text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 아이템 리스트 */}
      <div className="relative border border-red-500 rounded-lg p-4 mb-8">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={addRow} className="text-red-400 hover:text-red-200">
            + 추가 하기
          </button>
          <button
            onClick={deleteSelected}
            className="ml-auto bg-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-600"
          >
            삭제하기
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {items.map(it => (
            <div key={it.id} className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={it.checked}
                onChange={e => updateItem(it.id, { checked: e.target.checked })}
                className="h-4 w-4 text-red-500 bg-white rounded"
              />
              <select
                value={it.category}
                onChange={e => updateItem(it.id, { category: e.target.value })}
                className="px-2 py-1 bg-transparent border border-gray-600 rounded text-sm"
              >
                {CATEGORY_OPTIONS.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                value={it.tag}
                onChange={e => updateItem(it.id, { tag: e.target.value })}
                className="px-2 py-1 bg-transparent border border-gray-600 rounded text-sm"
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
            <p className="text-gray-500 text-sm">아직 추가된 항목이 없습니다.</p>
          )}
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="flex justify-end">
        <button
          onClick={() => onSave({ title, startDate, endDate, items })}
          className="bg-red-500 hover:bg-red-600 px-8 py-3 rounded-full text-white"
        >
          리스트 만들기
        </button>
      </div>
    </div>
  );
}