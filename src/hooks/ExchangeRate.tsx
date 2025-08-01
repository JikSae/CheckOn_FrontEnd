// ExchangeCard.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import dayjs from 'dayjs';

type FrankfurterHistoryResponse = {
  base: string;
  start_date: string;
  end_date: string;
  rates: Record<string, { KRW?: number }>; // 날짜 문자열 -> { KRW: rate }
};

type FrankfurterLatestResponse = {
  base: string;
  date: string;
  rates: { KRW?: number };
};

type Datum = {
  date: string;
  rate: number;
};

const formatLargeRate = (rate: number) => rate.toFixed(2);

const ExchangeRate: React.FC = () => {
  const [data, setData] = useState<Datum[] | null>(null);
  const [currentRate, setCurrentRate] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const today = dayjs().format('YYYY-MM-DD');
        const from = dayjs().subtract(30, 'day').format('YYYY-MM-DD');

        // 과거 30일치 시계열 (Frankfurter)
        const historyUrl = `https://api.frankfurter.app/${from}..${today}`;
        const historyRes: AxiosResponse<FrankfurterHistoryResponse> = await axios.get(
          historyUrl,
          {
            params: {
              from: 'JPY',
              to: 'KRW',
            },
          }
        );

        if (!historyRes.data || !historyRes.data.rates) {
          throw new Error('시계열 응답 형식이 이상합니다.');
        }

        const list: Datum[] = Object.entries(historyRes.data.rates)
          .sort(([a], [b]) => (a < b ? -1 : 1))
          .map(([date, rateObj]) => ({
            date,
            rate: typeof rateObj.KRW === 'number' ? rateObj.KRW : 0,
          }));

        setData(list);

        // 최신 환율
        const latestRes: AxiosResponse<FrankfurterLatestResponse> = await axios.get(
          'https://api.frankfurter.app/latest',
          {
            params: {
              from: 'JPY',
              to: 'KRW',
            },
          }
        );

        if (
          latestRes.data &&
          latestRes.data.rates &&
          typeof latestRes.data.rates.KRW === 'number'
        ) {
          setCurrentRate(latestRes.data.rates.KRW);
        } else if (list.length > 0) {
          setCurrentRate(list[list.length - 1].rate);
        }

        console.log('히스토리 응답:', historyRes.data);
        console.log('최신 응답:', latestRes.data);
      } catch (e: any) {
        console.error('fetch exchange history error:', e);
        if (e.response) {
          setError(
            `API 응답 오류: ${e.response.status} ${JSON.stringify(
              e.response.data
            )}`
          );
        } else if (e.request) {
          setError('요청은 갔지만 응답이 없습니다 (네트워크/CORS).');
        } else {
          setError(`오류: ${e.message}`);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const trendLabel = (): string | null => {
    if (!data || data.length < 2) return null;
    const first = data[0].rate;
    const last = data[data.length - 1].rate;
    if (first === 0) return null;
    const diff = last - first;
    const pct = ((diff / first) * 100).toFixed(2);
    return `${diff >= 0 ? '+' : ''}${diff.toFixed(2)} (${pct}%)`;
  };

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-grey-900 to-grey-700 text-black rounded-lg overflow-hidden shadow-xl">
      <div className="p-6">
        <div className="text-sm opacity-80">1 일본 엔 =</div>
        <div className="flex items-baseline gap-2">
          {loading || currentRate === null ? (
            <div className="text-5xl font-bold">로딩...</div>
          ) : (
            <>
              <div className="text-6xl font-extrabold">
                {formatLargeRate(currentRate)}
              </div>
              <div className="text-2xl font-medium">대한민국 원</div>
            </>
          )}
        </div>
        <div className="text-xs mt-1 opacity-75">
          {data && data.length > 0 && (
            <>
              {dayjs(data[data.length - 1].date).format('M월 D일')} 기준 · 과거 30일 추이
            </>
          )}
          {loading && ' 불러오는 중...'}
          {error && ` 오류: ${error}`}
        </div>
      </div>

      <div className="h-48 px-2 pb-2">
        {data && !loading && !error ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.9)" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => dayjs(d).format('M/D')}
                axisLine={false}
                tickLine={false}
                stroke="black"
                minTickGap={15}
              />
              <YAxis
                domain={['dataMin', 'dataMax']}
                axisLine={false}
                tickLine={false}
                stroke="black"
                tickFormatter={(v) => (typeof v === 'number' ? v.toFixed(2) : '')}
                width={60}
              />
              <Tooltip
                contentStyle={{ background: 'rgba(0,0,0,0.8)', border: 'none' }}
                labelFormatter={(label) => dayjs(label).format('YYYY-MM-DD')}
                formatter={(value: any) => [`${Number(value).toFixed(2)} KRW`, '환율']}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke= "red"
                strokeWidth={2}
                dot={false}
                strokeOpacity={1}
                activeDot={{ r: 6, strokeWidth: 2, fill: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-sm opacity-75">
            {error ? '그래프를 불러오지 못했습니다.' : '...'}
          </div>
        )}
      </div>

      <div className="px-6 pb-4 text-xs flex justify-between">
        <div>{trendLabel() && <span>30일 변화: {trendLabel()}</span>}</div>
        <div className="opacity-75">데이터: Frankfurter</div>
      </div>
    </div>
  );
};

export default ExchangeRate;
