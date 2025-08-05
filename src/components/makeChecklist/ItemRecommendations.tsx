import React from 'react';
import type { RawCategory } from '../../hooks/useRecommendItems';

const groupRecommendedByCategory = (
  allCategories: RawCategory[],
  selectedLabels: string[]
) => {
  return allCategories
    .map((cat) => {
      const matched = cat.items.filter((it) =>
        selectedLabels.some(
          (sel) =>
            sel.trim().toLowerCase() === it.itemLabel.trim().toLowerCase()
        )
      );
      return matched.length
        ? {
            categoryLabel: cat.categoryLabel,
            items: matched.map((i) => i.itemLabel),
          }
        : null;
    })
    .filter(Boolean) as { categoryLabel: string; items: string[] }[];
};

interface RecommendedItemsProps {
  items: string[];
  selected: string[];
  onToggle: (item: string) => void;
  title?: string;
  compact?: boolean;
}
export const RecommendedItems: React.FC<RecommendedItemsProps> = ({
  items,
  selected,
  onToggle,
  title = '추천 준비물',
  compact = false,
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between mb-1">
      <h4 className="font-semibold">{title}</h4>
      <div className="text-sm text-gray-500">{selected.length}개 선택</div>
    </div>
    <div className="flex flex-wrap gap-2">
      {items.map((it) => {
        const active = selected.includes(it);
        const paddingClasses = compact ? 'px-2 py-1' : 'px-3 py-2';
        const baseClass = active
          ? 'bg-red-500 text-white border border-red-500'
          : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100';
        return (
          <button
            key={it}
            onClick={() => onToggle(it)}
            aria-pressed={active}
            className={`flex items-center whitespace-nowrap rounded-full text-sm font-medium transition ${baseClass} ${paddingClasses}`}
            style={{ minWidth: 80 }}
          >
            {it}
          </button>
        );
      })}
    </div>
  </div>
);

export const CategorizedRecommendations: React.FC<{
  categories: RawCategory[];
  selected: string[];
  onToggle: (item: string) => void;
}> = ({ categories, selected, onToggle }) => {
  const grouped = groupRecommendedByCategory(categories, selected);
  if (grouped.length === 0) return null;
  return (
    <div className="space-y-3">
      {grouped.map((g) => (
        <div key={g.categoryLabel}>
          <div className="font-semibold mb-1">{g.categoryLabel}</div>
          <div className="flex flex-wrap gap-2">
            {g.items.map((it) => {
              const active = selected.includes(it);
              return (
                <button
                  key={it}
                  onClick={() => onToggle(it)}
                  aria-pressed={active}
                  className={`flex items-center whitespace-nowrap rounded-full text-sm font-medium transition ${
                    active
                      ? 'bg-red-500 text-white border border-red-500'
                      : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100'
                  } px-3 py-2`}
                  style={{ minWidth: 80 }}
                >
                  {it}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
