
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import dayjs from 'dayjs';

type OpenMeteoResponse = {
  current_weather: {
    temperature: number;
    windspeed: number;
    weathercode: number;
    time: string;
  };
  hourly: {
    relativehumidity_2m: number[];
    precipitation_probability: number[];
    time: string[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max?: number[];
    weathercode: number[];
  };
  timezone: string;
};

const weatherCodeToIcon = (code: number) => {
  if (code === 0) return '☀️';
  if (code >= 1 && code <= 3) return '⛅';
  if (code >= 45 && code <= 48) return '🌫️';
  if (code >= 51 && code <= 67) return '🌦️';
  if (code >= 71 && code <= 85) return '❄️';
  if (code >= 95) return '⛈️';
  return '🌈';
};

const weekdayNames = ['일', '월', '화', '수', '목', '금', '토'];

const WeatherCard: React.FC = () => {
  const [data, setData] = useState<OpenMeteoResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const latitude = 35.6895;
  const longitude = 139.6917;

  useEffect(() => {
    async function fetchWeather() {
      setLoading(true);
      setError(null);
      try {
        const today = dayjs().format('YYYY-MM-DD');
        const end = dayjs().add(6, 'day').format('YYYY-MM-DD');

        const res: AxiosResponse<OpenMeteoResponse> = await axios.get(
          'https://api.open-meteo.com/v1/forecast',
          {
            params: {
              latitude,
              longitude,
              timezone: 'Asia/Tokyo',
              current_weather: true,
              hourly: 'relativehumidity_2m,precipitation_probability',
              daily:
                'temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max',
              start_date: today,
              end_date: end,
            },
          }
        );
        setData(res.data);
        console.log('Open-Meteo 응답:', res.data);
      } catch (e: any) {
        console.error('weather fetch error', e);
        setError('날씨 정보를 가져오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, []);

  const getCurrentExtras = () => {
    if (!data || !data.hourly) return { pop: 0, humidity: 0 };
    const now = dayjs();
    const times = data.hourly.time.map((t) => dayjs(t));
    let idx = 0;
    let minDiff = Infinity;
    times.forEach((t, i) => {
      const diff = Math.abs(t.diff(now, 'minute'));
      if (diff < minDiff) {
        minDiff = diff;
        idx = i;
      }
    });
    const pop = data.hourly.precipitation_probability[idx] ?? 0;
    const humidity = data.hourly.relativehumidity_2m[idx] ?? 0;
    return { pop, humidity };
  };

  const render7Day = () => {
    if (!data) return null;
    return (
      <div className="flex gap-1 sm:gap-2 overflow-x-auto">
        {data.daily.time.map((dateStr, i) => {
          const date = dayjs(dateStr);
          const dow = weekdayNames[date.day()];
          const max = data.daily.temperature_2m_max[i];
          const min = data.daily.temperature_2m_min[i];
          const code = data.daily.weathercode[i];
          return (
            <div
              key={dateStr}
              className="flex-shrink-0 flex flex-col items-center bg-black/20 rounded px-2 py-2 text-center text-xs w-12"
            >
              <div className="font-medium">{dow}</div>
              <div className="text-2xl">{weatherCodeToIcon(code)}</div>
              <div className="mt-1">
                <div className="flex flex-col">
                  <div>
                    <span className="font-bold">{Math.round(max)}°</span>{' '}
                    <span className="text-gray-300">{Math.round(min)}°</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const { pop, humidity } = getCurrentExtras();

  const averageChangeLabel = (): string | null => {
    if (!data) return null;
    const firstAvg =
      (data.daily.temperature_2m_max[0] + data.daily.temperature_2m_min[0]) / 2;
    const lastIndex = data.daily.temperature_2m_max.length - 1;
    const lastAvg =
      (data.daily.temperature_2m_max[lastIndex] +
        data.daily.temperature_2m_min[lastIndex]) /
      2;
    if (firstAvg === 0) return null;
    const diff = lastAvg - firstAvg;
    const pct = ((diff / firstAvg) * 100).toFixed(1);
    return `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}°C (${pct}%)`;
  };

  return (
    <div className="max-w-xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-lg overflow-hidden shadow-lg">
      <div className="px-6 py-4 flex flex-col sm:flex-row items-start gap-6">
        {/* 현재 요약 */}
        <div className="flex-shrink-0 flex items-center gap-4">
          <div className="text-5xl">
            {data?.current_weather
              ? weatherCodeToIcon(data.current_weather.weathercode)
              : '...'}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-3">
            {loading || !data || !data.current_weather ? (
              <div className="text-5xl font-bold">로딩...</div>
            ) : (
              <>
                <div className="text-5xl font-extrabold">
                  {Math.round(data.current_weather.temperature)}°C
                </div>
                <div className="ml-2 text-sm flex flex-col">
                  <div className="flex gap-2">
                    <div>강수확률: {Math.round(pop)}%</div>
                    <div>습도: {Math.round(humidity)}%</div>
                    <div>
                      풍속: {data.current_weather.windspeed.toFixed(1)} m/s
                    </div>
                  </div>
                  <div className="text-xs opacity-75">
                    {dayjs(data.current_weather.time).format(
                      'M월 D일 HH:mm'
                    )}{' '}
                    기준
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 7일 예보 */}
      <div className="px-4 pb-4">{render7Day()}</div>

      <div className="px-6 pb-3 text-xs flex justify-between">
        <div>{averageChangeLabel() && <span>평균 기온 변화: {averageChangeLabel()}</span>}</div>
        <div className="opacity-75">데이터: Open-Meteo</div>
      </div>

      {error && (
        <div className="px-6 pb-2 text-xs text-red-300">오류: {error}</div>
      )}
    </div>
  );
};

export default WeatherCard;
