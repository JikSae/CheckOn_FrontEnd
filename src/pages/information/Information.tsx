// src/pages/Information.tsx
import React from 'react';
import ExchangeRate from '../../hooks/ExchangeRate';
import WeatherCard from '../../components/weather/WeatherCard';
import JapanNoticeCard from '../../components/japanNotice/JapanNotice';


const Information = () => {

  return (
    <div className="w-[1320px] mx-auto">
      <h1 className="text-3xl font-bold text-center ml-[-130px] my-10">Information</h1>

      {/* 일본 유의사항 */}
      <section className="mb-12">
         <JapanNoticeCard />
      </section>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 ">
        {/* 환율 */}
        <div className="flex flex-col items-center ">
          <h3 className="text-md font-semibold mb-2">환율</h3>
          <div className="w-full  rounded-lg p-6 flex justify-center items-center h-full">
             <ExchangeRate />
          </div>
        </div>

        {/* 날씨 위젯 (예시) */}
        <div className="flex flex-col items-center">
          <h3 className="text-md font-semibold mb-2">날씨</h3>
          <div className="w-full  rounded-lg  shadow-lg p-4 ">
          
            <WeatherCard />
          </div>
        </div>
      </div>


    </div>
  );
};

export default Information;
