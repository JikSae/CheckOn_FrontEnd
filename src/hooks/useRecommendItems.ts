// src/hooks/useRecommendItems.ts
import { useEffect, useState, useRef } from 'react';
import { computeLocalRecommendations } from './recommendUtils';
import type { RecommendInputCore } from './recommendUtils';
export type RecommendInputs = RecommendInputCore & {
  jpType: 'J' | 'P' | '';
  step: 'city' | 'date' | 'companion' | 'purpose' | 'jp' | 'jp-custom' | 'transport' | 'activities' | 'minimal' | 'exchange' | 'items' | 'done';
  jwt?: string;
};

export function useRecommendItems({
  purpose,
  transport,
  activities,
  minimalPack,
  exchange,
  companions,
  jpType,
  step,
  jwt = '',
}: RecommendInputs) {
  const [recommended, setRecommended] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userTouchedRef = useRef(false); // 사용자가 수동으로 바꾼 경우 덮어쓰지 않기

  const isReadyForRecommend =
    purpose &&
    transport &&
    activities !== undefined &&
    minimalPack !== null &&
    exchange !== null &&
    jpType === 'P' &&
    (step === 'items' || step === 'exchange');

  // 외부에서 selectedItems를 직접 조작하면 이 플래그를 세팅하도록 호출자 측에서 set userTouchedRef.current = true 가능

  useEffect(() => {
    if (!isReadyForRecommend) return;
    const controller = new AbortController();
    const fetchRecommend = async () => {
      setLoading(true);
      setError(null);
      try {
        const body: any = { purpose, transport, companions };
        const res = await fetch('/api/recommend-items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`추천 API 실패 ${res.status}`);
        }

        const data = await res.json();
        const apiItems: string[] =
          data.items && Array.isArray(data.items)
            ? data.items.map((i: any) => i.name)
            : [];

        if (apiItems.length > 0) {
          if (!userTouchedRef.current) {
            setRecommended(apiItems);
          }
        } else {
          // 빈 배열일 땐 로컬 fallback
          const local = computeLocalRecommendations({
            purpose,
            transport,
            activities,
            minimalPack,
            exchange,
            companions,
          });
          if (!userTouchedRef.current) {
            setRecommended(local);
          }
        }
      } catch (e: any) {
        if (e.name === 'AbortError') return;
        setError(e.message);
        const local = computeLocalRecommendations({
          purpose,
          transport,
          activities,
          minimalPack,
          exchange,
          companions,
        });
        if (!userTouchedRef.current) {
          setRecommended(local);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecommend();
    return () => {
      controller.abort();
    };
  }, [
    purpose,
    transport,
    activities,
    minimalPack,
    exchange,
    companions,
    jpType,
    step,
    jwt,
    isReadyForRecommend,
  ]);

  const markUserTouched = () => {
    userTouchedRef.current = true;
  };

  return { recommended, loading, error, markUserTouched };
}
