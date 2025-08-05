// src/hooks/useRecommendItems.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { computeLocalRecommendations } from './recommendUtils';

export type RawCategory = {
  categoryLabel: string;
  items: { itemId: number; itemLabel: string }[];
};

interface Answer {
  travelStart: string;
  travelEnd: string;
  purpose: string;
  transport: string;
  activities: string[];
  minimalPack: boolean | null;
  exchange: boolean | null;
  companions: string[];
  jpType: 'J' | 'P' | '';
  step: string;
}

interface BackendItem {
  itemId: number;
  itemLabel: string;
  categoryLabel: string;
}

interface UseRecommendItemsArgs extends Answer {
  jwt: string;
}

const safeJsonParse = async (res: Response) => {
  const contentType = res.headers.get('content-type') || '';
  const text = await res.text();
  if (!contentType.includes('application/json')) {
    throw new Error(`서버가 JSON을 반환하지 않음: ${text.slice(0, 200).replace(/\n/g, ' ')}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`JSON 파싱 실패: ${text.slice(0, 200).replace(/\n/g, ' ')}`);
  }
};

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

export function useRecommendItems({
  travelStart,
  travelEnd,
  purpose,
  transport,
  activities,
  minimalPack,
  exchange,
  companions,
  jpType,
  step,
  jwt,
}: UseRecommendItemsArgs) {
  const [recommended, setRecommended] = useState<string[]>([]);
  const [raw, setRaw] = useState<RawCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userTouchedRef = useRef(false);
  const lastPayloadRef = useRef<string>('');
  const abortCtrlRef = useRef<AbortController | null>(null);

  const markUserTouched = useCallback(() => {
    userTouchedRef.current = true;
  }, []);

  const answer = {
    travelStart,
    travelEnd,
    purpose,
    transport,
    activities,
    minimalPack,
    exchange,
    companions,
    jpType,
    step,
  };

  useEffect(() => {
    const serialized = JSON.stringify(answer);
    if (serialized === lastPayloadRef.current) return;
    lastPayloadRef.current = serialized;
    userTouchedRef.current = false;

    abortCtrlRef.current?.abort();
    const ctrl = new AbortController();
    abortCtrlRef.current = ctrl;

    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        const endpoint =
          import.meta.env.VITE_RECOMMENDATION_API_URL || 'http://localhost:4000/recommendations';
        const res = await fetchWithRetry(endpoint, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(answer),
          signal: ctrl.signal as any,
        });

        if (!res.ok) {
          throw new Error(`추천 API 실패 ${res.status}`);
        }

        const data: BackendItem[] = await safeJsonParse(res);

        // 카테고리별로 묶기
        const categoryMap: Record<string, RawCategory> = {};
        data.forEach((it) => {
          const catLabel = it.categoryLabel || '기타';
          if (!categoryMap[catLabel]) {
            categoryMap[catLabel] = { categoryLabel: catLabel, items: [] };
          }
          if (!categoryMap[catLabel].items.some((x) => x.itemId === it.itemId)) {
            categoryMap[catLabel].items.push({
              itemId: it.itemId,
              itemLabel: it.itemLabel,
            });
          }
        });

        const rawFromApi = Object.values(categoryMap);
        const flatLabels = data.map((it) => it.itemLabel);

        if (!userTouchedRef.current) {
          setRecommended(flatLabels);
        }
        setRaw(rawFromApi);
      } catch (e: any) {
        console.warn('추천 API 오류:', e);
        setError(e.message || '추천 로딩 실패');

        const fallback = computeLocalRecommendations({
          purpose,
          transport,
          activities,
          minimalPack,
          exchange,
          companions,
        });
        if (!userTouchedRef.current) {
          setRecommended(fallback);
        }
        setRaw([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
    return () => ctrl.abort();
  }, [
    travelStart,
    travelEnd,
    purpose,
    transport,
    activities,
    minimalPack,
    exchange,
    companions,
    jpType,
    step,
    jwt,
  ]);

  return {
    recommended,
    raw,
    loading,
    error,
    markUserTouched,
  };
}
