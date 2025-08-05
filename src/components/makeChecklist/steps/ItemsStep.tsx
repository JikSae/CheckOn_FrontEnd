// src/components/makeChecklist/steps/ItemsStep.tsx
import React, { useMemo } from 'react';
import type { SelectedItem } from '../../../models/selection';

export interface ApiCategory {
  categoryId?: number;
  categoryLabel: string;
  items: { itemId?: number; itemLabel: string }[];
}

interface Props {
  categories: ApiCategory[];
  selectedItems: SelectedItem[];
  toggleItem: (item: SelectedItem) => void;
  finishItems: () => void;
  isFinishDisabled: boolean;
  minimalPack: boolean | null;
}

export const ItemsStep: React.FC<Props> = ({
  categories,
  selectedItems,
  toggleItem,
  finishItems,
  isFinishDisabled,
  minimalPack,
}) => {
  const countsByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    selectedItems.forEach((it) => {
      map[it.category] = (map[it.category] || 0) + 1;
    });
    return map;
  }, [selectedItems]);

  const minimalDefaults: SelectedItem[] = minimalPack
    ? [
        { text: '여권', category: '필수품', source: 'fallback' },
        { text: '충전기', category: '전자기기', source: 'fallback' },
        { text: '선크림', category: '화장품', source: 'fallback' },
      ]
    : [];

  const isSelected = (text: string, category: string) =>
    selectedItems.some(
      (s) =>
        s.text.trim().toLowerCase() === text.trim().toLowerCase() &&
        s.category === category
    );

  return (
    <div className="space-y-6">
      <div className="flex gap-4 flex-wrap">
        {categories.map((cat) => (
          <div key={cat.categoryLabel} className="flex-1 min-w-[160px]">
            <div className="font-semibold flex justify-between mb-2">
              <div>{cat.categoryLabel}</div>
              <div className="text-sm text-gray-500">
                {countsByCategory[cat.categoryLabel] || 0}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {cat.items.map((it) => {
                const active = isSelected(it.itemLabel, cat.categoryLabel);
                return (
                  <button
                    key={it.itemLabel}
                    onClick={() =>
                      toggleItem({
                        text: it.itemLabel,
                        category: cat.categoryLabel,
                        source: 'local',
                      })
                    }
                    aria-pressed={active}
                    className={`rounded-full text-sm font-medium px-3 py-2 transition border ${
                      active
                        ? 'bg-red-500 text-white border-red-500'
                        : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100'
                    }`}
                    style={{ minWidth: 80 }}
                  >
                    {it.itemLabel}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {minimalPack && (
        <div>
          <div className="font-semibold mb-1">미니멀 핵심</div>
          <div className="flex flex-wrap gap-2">
            {minimalDefaults.map((it) => {
              const active = isSelected(it.text, it.category);
              return (
                <button
                  key={it.text}
                  onClick={() => toggleItem(it)}
                  aria-pressed={active}
                  className={`rounded-full text-sm font-medium px-3 py-2 transition border ${
                    active
                      ? 'bg-red-500 text-white border-red-500'
                      : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100'
                  }`}
                  style={{ minWidth: 80 }}
                >
                  {it.text}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={finishItems}
          disabled={isFinishDisabled}
          className="bg-red-500 text-white px-6 py-2 rounded-full disabled:opacity-50"
        >
          완료
        </button>
      </div>
    </div>
  );
};
