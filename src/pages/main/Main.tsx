// src/components/Main.tsx
import React from 'react';
import SlideBar from '../../components/slideBar/SlideBar';
import { Link } from 'react-router-dom';
import ExchangeRate from '../../hooks/ExchangeRate';
import WeatherCard from '../../components/weather/WeatherCard';
import TopReviews from '../../components/ranking/TopReviews';

const Main: React.FC = () => {
  return (
    <div className="max-w-[1320px] mx-auto px-4">
      {/* banner */}
      <div className="mb-8">
        <SlideBar />
      </div>

      {/* Review + Record */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        {/* Review */}
        <section className="flex-shrink-0 w-full lg:w-1/3">
          <Link to="/Review" className="inline-block mb-4 no-underline">
            <span className="text-2xl md:text-3xl font-bold">추천 물품 ▸</span>
          </Link>
          <div className="w-full min-h-[220px] border rounded-md p-4">
            <TopReviews />
          </div>
        </section>

        {/* Record */}
        <section className="flex-shrink-0 w-full lg:w-2/3">
          <Link to="/Record" className="inline-block mb-4 no-underline">
            <span className="text-2xl md:text-3xl font-bold">찜목록 ▸</span>
          </Link>
          <div className="w-full min-h-[220px] border rounded-md p-4">
            <p>contents</p>
          </div>
        </section>
      </div>

      {/* Information */}
      <section className="mb-12">
        <Link to="/information" className="inline-block mb-4 no-underline">
          <span className="text-2xl md:text-3xl font-bold">정보 ▸</span>
        </Link>
        <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* Exchange */}
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-medium mb-2">환율</h4>
            <div className="w-full border rounded-md p-4 min-h-[260px]">
              <ExchangeRate />
            </div>
          </div>
          {/* Weather */}
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-medium mb-2">날씨</h4>
            <div className="w-full border rounded-md p-4 min-h-[260px]">
              <WeatherCard />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Main;
