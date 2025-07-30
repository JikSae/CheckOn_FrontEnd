// src/pages/Information.tsx
import React from 'react';
import { useExchangeRate } from '../../hooks/useExchangeRate';

const Information = () => {
   const { rate, error } = useExchangeRate('JPY','KRW');

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Information</h1>

      {/* 일본 유의사항 */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-4">일본 유의사항</h2>
        <div className="h-48 border-2 border-red-500 rounded-lg p-4 mb-4">
          {/* 여기에 공지사항 내용을 넣으세요 */}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* 환율 */}
        <div className="flex flex-col items-center">
          <h3 className="text-md font-semibold mb-2">환율</h3>
          <div className="w-full bg-gray-900 rounded-lg p-6 flex justify-center items-center h-60">
            {error
          ? <span className="text-red-400">불러올 수 없음</span>
          : rate == null
            ? <span>로딩 중…</span>
            : <span>1 JPY = {rate.toFixed(2)} KRW</span>
        }
          </div>
        </div>

        {/* 날씨 위젯 (예시) */}
        <div className="flex flex-col items-center">
          <h3 className="text-md font-semibold mb-2">날씨</h3>
          <div className="w-full bg-gray-900 rounded-lg overflow-hidden shadow-lg p-4 h-60">
            {/* weatherwidget.io 스크립트가 index.html 등에 이미 로드되어 있어야 합니다 */}
            <a
              className="weatherwidget-io"
              href="https://forecast7.com/ko/35d69n139d69/osaka/"
              data-label_1="Osaka"
              data-label_2="Weather"
              data-theme="dark"
            >
              Osaka Weather
            </a>
          </div>
        </div>
      </div>

      {/* 여행 정보 링크 */}
      <section>
        <h2 className="text-lg font-semibold mb-4">일본 여행 정보 사이트</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.japan.travel/ko/kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              https://www.japan.travel/ko/kr/
            </a>
          </li>
          <li>
            <a
              href="https://services.digital.go.jp/ko/visit-japan-web/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              https://services.digital.go.jp/ko/visit-japan-web/
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Information;
