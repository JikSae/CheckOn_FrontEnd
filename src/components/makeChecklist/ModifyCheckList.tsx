// src/components/ModifyCheckList.tsx
import React, { useState, useEffect } from 'react'
// ← categories.ts 가 src/data 에 있으므로, 컴포넌트 경로에서 ../data 로 올라와야 합니다.
import { LOCAL_CATEGORIES, type ApiCategory } from '../../data/categories'

export interface Item {
  id: number
  checked: boolean
  category: string
  tag: string
  text: string
}

export type RawCategory = ApiCategory

interface ChecklistEditorProps {
  initialTitle: string
  initialStartDate: string
  initialEndDate: string
  initialItems: Omit<Item, 'id' | 'checked'>[]
  onSave: (data: {
    title: string
    startDate: string
    endDate: string
    items: Item[]
  }) => void
  // 기본으로 LOCAL_CATEGORIES 사용
  recommendedCategories?: RawCategory[]
}

const TAG_OPTIONS = ['소품', '중요', '필수', '기타']

export default function ModifyCheckList({
  initialTitle,
  initialStartDate,
  initialEndDate,
  initialItems,
  onSave,
  recommendedCategories = LOCAL_CATEGORIES,
}: ChecklistEditorProps) {
  const [title, setTitle] = useState(initialTitle)
  const [startDate, setStartDate] = useState(initialStartDate)
  const [endDate, setEndDate] = useState(initialEndDate)
  const [items, setItems] = useState<Item[]>([])
  const [nextId, setNextId] = useState(1)

  // 디버그: 데이터 잘 넘어오는지 확인
  useEffect(() => {
    console.log('▶ recommendedCategories:', recommendedCategories)
  }, [recommendedCategories])

  // 초기 items 세팅
  useEffect(() => {
    const mapped = initialItems.map((it, i) => ({
      id: i + 1,
      checked: false,
      category: it.category,
      tag: it.tag,
      text: it.text,
    }))
    setItems(mapped)
    setNextId(mapped.length + 1)
  }, [initialItems])

  // 새 행 추가: ID를 반환
  const addRow = (): number => {
    const id = nextId
    setItems(prev => [
      ...prev,
      {
        id,
        checked: false,
        category: recommendedCategories[0]?.categoryLabel || '',
        tag: TAG_OPTIONS[0],
        text: '',
      },
    ])
    setNextId(id + 1)
    return id
  }

  const deleteSelected = () => {
    setItems(prev => prev.filter(it => !it.checked))
  }

  const updateItem = (id: number, data: Partial<Item>) => {
    setItems(prev =>
      prev.map(it => (it.id === id ? { ...it, ...data } : it))
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-lg space-y-6">
      {/* 제목/날짜 */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <label className="block mb-1">제목</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded"
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1">여행일</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded"
            />
            <span className="self-center">~</span>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded"
            />
          </div>
        </div>
      </div>

      {/* 추천 준비물 */}
      <div className="p-4 bg-gray-800 border border-gray-700 rounded max-h-64 overflow-y-auto">
        <h4 className="mb-2 font-semibold">카테고리별 추천 준비물</h4>
        {recommendedCategories.map(cat => (
          <div key={cat.categoryLabel} className="mb-4">
            <div className="font-medium mb-1">{cat.categoryLabel}</div>
            <div className="flex flex-wrap gap-2">
              {cat.items.map(it => (
                <button
                  key={it.itemLabel}
                  onClick={() => {
                    const newId = addRow()
                    updateItem(newId, {
                      category: cat.categoryLabel,
                      text: it.itemLabel,
                    })
                  }}
                  className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-sm hover:bg-gray-600"
                >
                  {it.itemLabel}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 아이템 리스트 */}
      <div className="border border-gray-700 rounded p-4">
        <div className="flex justify-between mb-2">
          <button onClick={addRow} className="text-green-400 hover:underline">
            + 항목 추가
          </button>
          <button onClick={deleteSelected} className="text-red-400 hover:underline">
            선택 삭제
          </button>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {items.map(it => {
            const cat = recommendedCategories.find(c => c.categoryLabel === it.category)
            const opts = cat ? cat.items.map(x => x.itemLabel) : []
            return (
              <div key={it.id} className="flex items-center gap-2 bg-gray-800 p-2 rounded">
                <input
                  type="checkbox"
                  checked={it.checked}
                  onChange={e => updateItem(it.id, { checked: e.target.checked })}
                  className="h-4 w-4"
                />
                {/* 카테고리 select */}
                <select
                  value={it.category}
                  onChange={e => updateItem(it.id, { category: e.target.value, text: '' })}
                  className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs"
                >
                  {recommendedCategories.map(c => (
                    <option key={c.categoryLabel} value={c.categoryLabel}>
                      {c.categoryLabel}
                    </option>
                  ))}
                </select>
                {/* 준비물 select or input */}
                {it.category === '기타' ? (
                  <input
                    type="text"
                    value={it.text}
                    onChange={e => updateItem(it.id, { text: e.target.value })}
                    placeholder="직접 입력"
                    className="flex-1 px-3 py-1 bg-gray-700 border-b border-gray-600 rounded text-sm"
                  />
                ) : (
                  <select
                    value={it.text}
                    onChange={e => updateItem(it.id, { text: e.target.value })}
                    className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm"
                  >
                    <option value="" disabled>— 선택 —</option>
                    {opts.map(label => (
                      <option key={label} value={label}>
                        {label}
                      </option>
                    ))}
                  </select>
                )}
                {/* 태그 select */}
                {/* <select
                  value={it.tag}
                  onChange={e => updateItem(it.id, { tag: e.target.value })}
                  className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-xs"
                >
                  {TAG_OPTIONS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select> */}
              </div>
            )
          })}
          {items.length === 0 && <div className="text-gray-500 text-sm">아직 준비물이 없습니다.</div>}
        </div>
      </div>

      {/* 저장 */}
      <div className="text-right">
        <button onClick={() => onSave({ title, startDate, endDate, items })} className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded">
          리스트 만들기
        </button>
      </div>
    </div>
  )
}
