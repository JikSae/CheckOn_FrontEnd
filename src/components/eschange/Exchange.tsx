import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface RateData {
  date: string;
  rate: number;
}

const Exchange: React.FC = () => {
  const [data, setData] = useState<RateData[]>([]);

  useEffect(() => {
    console.log('▶ useEffect 실행');
    async function fetchRates() {
      console.log('▶ fetchRates 시작');
      try {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 30);
        const startStr = start.toISOString().split('T')[0];
        const endStr = end.toISOString().split('T')[0];

        // ✅ 올바른 엔드포인트, API 키 제거
        const res = await axios.get('https://api.exchangerate.host/timeseries', {
          params: {
            start_date: startStr,
            end_date: endStr,
            base: 'JPY',
            symbols: 'KRW',
          },
        });

        // exchangerate.host 에선 success가 항상 true. 
        const rates = res.data.rates as Record<string, Record<string, number>>;
        const chartData: RateData[] = Object.entries(rates)
          .map(([date, obj]) => ({
            date,
            rate: obj.KRW,
          }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setData(chartData);
      } catch (err) {
        console.error('환율 조회 중 오류:', err);
      }
    }
    fetchRates();
  }, []);

  // ✅ 부모에 높이를 줘야 함
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} />
          <YAxis domain={['dataMin', 'dataMax']} />
          <Tooltip />
          <Line type="monotone" dataKey="rate" dot={false} stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Exchange;
