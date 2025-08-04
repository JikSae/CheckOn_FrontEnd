// src/hooks/useChecklistCreator.ts
import { useState, useEffect, useCallback } from 'react';

export type Purpose =
  | '힐링'
  | '액티비티'
  | '비즈니스'
  | '문화탐방'
  | '캠핑'
  | string;

export type TravelType =
  | 'ACTIVITY'
  | 'BUSINESS'
  | 'CULTURE'
  | 'RELAX'
  | 'CAMPING'
  | 'GENERAL';

export interface City {
  cityId: number;
  cityName: string;
}

export interface CatalogItem {
  itemId: number;
  item_label: string;
}

interface CreateChecklistParams {
  jwt: string;
  userId: number;
  cityId: number;
  title: string;
  purpose: Purpose;
  travelStart: string; // YYYY-MM-DD
  travelEnd: string; // YYYY-MM-DD
  itemsTextList: string[]; // 준비물 라벨들
  packingBagOverride?: Record<string, string>; // ex: { '노트북': 'HOLD' }
  endpoint?: string;
}

interface UseChecklistCreatorResult {
  cities: City[];
  citiesLoading: boolean;
  citiesError: string | null;
  catalog: Record<string, number>; // label -> itemId
  catalogLoading: boolean;
  catalogError: string | null;
  createChecklist: (args: CreateChecklistParams) => Promise<any>;
  creating: boolean;
  createError: Error | null;
}

const mapPurposeToTravelType = (purpose: string): TravelType => {
  switch (purpose) {
    case '액티비티':
      return 'ACTIVITY';
    case '비즈니스':
      return 'BUSINESS';
    case '문화탐방':
      return 'CULTURE';
    case '힐링':
      return 'RELAX';
    case '캠핑':
      return 'CAMPING';
    default:
      return 'GENERAL';
  }
};

const DEFAULT_PACKING_BAG = 'HAND';

export function useChecklistCreator(): UseChecklistCreatorResult {
  const [cities, setCities] = useState<City[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [citiesError, setCitiesError] = useState<string | null>(null);

  const [catalog, setCatalog] = useState<Record<string, number>>({});
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      setCitiesLoading(true);
      setCitiesError(null);
      try {
        const res = await fetch('http://localhost:4000/cities');
        if (!res.ok) throw new Error(`도시 로딩 실패 ${res.status}`);
        const data: { cityId: number; cityName: string }[] = await res.json();
        setCities(data.map((c) => ({ cityId: c.cityId, cityName: c.cityName })));
      } catch (e: any) {
        setCitiesError(e.message || '도시 불러오는 중 오류');
      } finally {
        setCitiesLoading(false);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      setCatalogLoading(true);
      setCatalogError(null);
      try {
        const res = await fetch('/api/items');
        if (!res.ok) throw new Error(`아이템 카탈로그 실패 ${res.status}`);
        const data: { itemId: number; item_label: string }[] = await res.json();
        const map: Record<string, number> = {};
        data.forEach((it) => {
          map[it.item_label] = it.itemId;
        });
        setCatalog(map);
      } catch (e: any) {
        setCatalogError(e.message || '아이템 불러오는 중 오류');
      } finally {
        setCatalogLoading(false);
      }
    };
    fetchItems();
  }, []);

  const createChecklist = useCallback(
    async ({
      jwt,
      userId,
      cityId,
      title,
      purpose,
      travelStart,
      travelEnd,
      itemsTextList,
      packingBagOverride = {},
      endpoint = '/api/checklists',
    }: CreateChecklistParams) => {
      setCreating(true);
      setCreateError(null);
      try {
        if (title.trim().length < 2) {
          throw new Error('제목은 최소 2글자 이상이어야 합니다.');
        }
        if (!cityId) throw new Error('도시 정보가 필요합니다.');
        if (!travelStart || !travelEnd) throw new Error('여행 시작/종료일이 필요합니다.');

        const travelType = mapPurposeToTravelType(purpose);
        const travelStartISO = new Date(`${travelStart}T00:00:00.000Z`).toISOString();
        const travelEndISO = new Date(`${travelEnd}T00:00:00.000Z`).toISOString();

        const items = itemsTextList
          .map((label) => {
            const itemId = catalog[label];
            if (!itemId) {
              console.warn(`매핑 없는 준비물: ${label}`);
              return null;
            }
            const packingBag = packingBagOverride[label] || DEFAULT_PACKING_BAG;
            return { itemId, packingBag };
          })
          .filter(Boolean);

        if (items.length === 0) {
          throw new Error('유효한 준비물이 하나도 없습니다.');
        }

        const payload = {
          userId,
          title,
          cityId,
          travelType,
          travelStart: travelStartISO,
          travelEnd: travelEndISO,
          items,
        };

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`서버 오류 ${res.status}: ${txt}`);
        }

        const data = await res.json();
        return data;
      } catch (e: any) {
        setCreateError(e);
        throw e;
      } finally {
        setCreating(false);
      }
    },
    [catalog]
  );

  return {
    cities,
    citiesLoading,
    citiesError,
    catalog,
    catalogLoading,
    catalogError,
    createChecklist,
    creating,
    createError,
  };
}
