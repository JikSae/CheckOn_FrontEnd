// src/components/Main.tsx
import React from 'react';
import SlideBar from '../../components/slideBar/SlideBar';
import { Link } from 'react-router-dom';
import Ranking from '../../components/ranking/Ranking';
import ExchangeRate from '../../hooks/ExchangeRate';
import WeatherCard from '../../components/weather/WeatherCard';

const Main: React.FC = () => {
  return (
    <div className="max-w-[1320px] mx-auto">
      {/* banner */}
        <SlideBar />
        <div className="flex gap-[70px]">
           {/* Review */}
          <section className="mb-[120px]">
            <Link
              to="/Review"
              className="block w-[280px] h-[30px] mb-[40px] transform no-underline"
            >
              <span className="text-[30px] font-bold">추천 물품 ▸</span>
            </Link>
            <div className="w-[400px] h-[300px] border ">
              <Ranking />
            </div>
          </section>

      

          {/* Record */}
          <section className="mb-[120px]">
            <Link
              to="/Record"
              className="block w-[280px] h-[30px] mb-[40px]  transform no-underline"
            >
              <span className="text-[30px] font-bold">찜목록  ▸</span>
            </Link>
            <div className="w-[850px] h-[300px] border ">
              <p>contents</p>
            </div>
          </section>

        </div>

       
      {/* Information */}
      <section className="mb-[120px]">
        <Link
         to="/information"
          className="block w-[280px] h-[30px] mb-[40px]  transform no-underline"
        >
          <span className="text-[30px] font-bold">정보 ▸</span>
        </Link>
        <div className="flex w-[95%] gap-[150px]">
          {/* Exchange */}
          <div className="w-[325px] h-[370px]">
            <h4 className="text-[20px] block w-[56px] h-[36px]  mb-[20px]">환율</h4>
            <div className="w-[300px] h-[320px]" >
              <ExchangeRate />
            </div>
          </div>
          {/* Weather */}
          <div className="w-[325px] h-[370px] ">
            <h4 className="text-[20px] block w-[56px] h-[36px]  mb-[20px]">날씨</h4>
            <div className="w-[700px] h-[250px]" >
              <WeatherCard />
              
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Main;
