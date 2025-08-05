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
const normalize = (s: string) => s.trim().toLowerCase();

const safeJsonParse = async (res: Response) => {
  const contentType = res.headers.get('content-type') || '';
  const text = await res.text();
  if (!contentType.includes('application/json')) {
    throw new Error(
      `서버가 JSON을 반환하지 않음: ${text.slice(0, 200).replace(/\n/g, ' ')}`
    );
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `JSON 파싱 실패: ${text.slice(0, 200).replace(/\n/g, ' ')}`
    );
  }
};

// 간단한 재시도 유틸
const fetchWithRetry = async (
  input: RequestInfo,
  init: RequestInit,
  retries = 2,
  delay = 300
): Promise<Response> => {
  try {
    const res = await fetch(input, init);
    if (!res.ok) throw new Error(`status ${res.status}`);
    return res;
  } catch (e) {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, delay));
      return fetchWithRetry(input, init, retries - 1, delay * 2);
    }
    throw e;
  }
};

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
        const endpoint =
          import.meta.env.VITE_CITY_API_URL || 'http://localhost:4000/cities';
        const res = await fetchWithRetry(endpoint, {}, 2, 300);
        if (!res.ok) throw new Error(`도시 로딩 실패 ${res.status}`);
        const data: { cityId: number; cityName: string }[] = await res.json();
        setCities(
          data.map((c) => ({ cityId: c.cityId, cityName: c.cityName }))
        );
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
        const endpoint =
          import.meta.env.VITE_ITEM_CATALOG_URL || 'http://localhost:4000/items';
        const res = await fetchWithRetry(endpoint, {}, 2, 300);
        if (!res.ok) throw new Error(`아이템 카탈로그 실패 ${res.status}`);
        const data: { itemId: number; item_label: string }[] =
          await safeJsonParse(res);
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

       console.log('▶ itemsTextList:', itemsTextList);
      try {
        if (title.trim().length < 2) {
          throw new Error('제목은 최소 2글자 이상이어야 합니다.');
        }
        if (!cityId) throw new Error('도시 정보가 필요합니다.');
        if (!travelStart || !travelEnd)
          throw new Error('여행 시작/종료일이 필요합니다.');

        if (catalogLoading) {
          throw new Error(
            '준비물 카탈로그를 아직 로딩 중입니다. 잠시만 기다려주세요.'
          );
        }

        // 정규화된 카탈로그
        const normalizedCatalog: Record<string, number> = {};
        Object.entries(catalog).forEach(([label, id]) => {
          normalizedCatalog[normalize(label)] = id;
        });

      const items = itemsTextList
        .map((rawLabel) => {
          const norm = normalize(rawLabel);
          // 1) 완전 일치 시도
          let itemId = normalizedCatalog[norm];

          // 2) 못 찾으면, 카탈로그 키 중에 rawLabel(norm) 이 포함된 항목을 찾아본다
          if (!itemId) {
            const fallbackEntry = Object.entries(normalizedCatalog)
              .find(([key, id]) => key.includes(norm));
            if (fallbackEntry) itemId = fallbackEntry[1];
          }

          if (!itemId) {
            console.warn(`매핑 실패: '${rawLabel}' → '${norm}'`);
            return null;
          }

          const packingBag = packingBagOverride[rawLabel] || DEFAULT_PACKING_BAG;
          return { itemId, packingBag };
        })
        .filter((x): x is { itemId: number; packingBag: string } => Boolean(x));

      if (items.length === 0) {
        throw new Error(
          '유효한 준비물이 하나도 없습니다. 준비물 라벨과 카탈로그가 정확히 일치하는지 확인하세요.'
        );
      }

        const travelType = mapPurposeToTravelType(purpose);
        const travelStartISO = new Date(
          `${travelStart}T00:00:00.000Z`
        ).toISOString();
        const travelEndISO = new Date(
          `${travelEnd}T00:00:00.000Z`
        ).toISOString();

        const payload = {
          userId,
          title,
          cityId,
          travelType,
          travelStart: travelStartISO,
          travelEnd: travelEndISO,
          items,
        };

        const url = endpoint.startsWith('http') ? endpoint : endpoint;

        const res = await fetch(url, {
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
    [catalog, catalogLoading]
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
