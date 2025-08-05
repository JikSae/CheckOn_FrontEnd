// src/utils/groupRecommendations.ts
import type { ApiCategory } from '../data/categories';

export function groupFlatLabelsByCategory(
  allCategories: ApiCategory[],
  flatLabels: string[]
): { categoryLabel: string; items: string[] }[] {
  return allCategories
    .map((cat) => {
      const matched = cat.items
        .filter((it) =>
          flatLabels.some(
            (label) =>
              label.trim().toLowerCase() === it.itemLabel.trim().toLowerCase()
          )
        )
        .map((i) => i.itemLabel);
      if (matched.length === 0) return null;
      return { categoryLabel: cat.categoryLabel, items: matched };
    })
    .filter(Boolean) as { categoryLabel: string; items: string[] }[];
}
