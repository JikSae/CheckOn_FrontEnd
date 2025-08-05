// src/models/selection.ts
// models/selection.ts
export type SelectedItemSource = 'api' | 'fallback' | 'local';

export interface SelectedItem {
  text: string;
  category: string;
  source: SelectedItemSource;
}