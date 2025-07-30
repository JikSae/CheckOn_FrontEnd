// src/components/Main.tsx
import React from 'react';
import SlideBar from '../../components/slideBar/SlideBar';
import { Link } from 'react-router-dom';

const Main: React.FC = () => {
  return (
    <div className="max-w-[1320px] mx-auto">
      {/* banner */}
        <SlideBar />

      {/* Information */}
      <section className="mb-[120px]">
        <Link
         to="/information"
          className="block w-[280px] h-[30px] mb-[20px] -translate-x-[40px] transform no-underline"
        >
          <span className="text-[30px] font-bold">Information ▸</span>
        </Link>
        <div className="flex w-[95%] gap-[150px]">
          {/* Exchange */}
          <div className="w-[325px] h-[370px]">
            <h4 className="text-[30px] block w-[56px] h-[36px]  mb-[40px]">환율</h4>
            <div className="w-[300px] h-[320px] border border-black" />
          </div>
          {/* Weather */}
          <div className="w-[325px] h-[370px] ">
            <h4 className="text-[30px] block w-[56px] h-[36px]  mb-[40px]">날씨</h4>
            <div className="w-[700px] h-[220px] border border-black" />
          </div>
        </div>
      </section>

      {/* Record */}
      <section className="mb-[120px]">
        <Link
          to="/Record"
          className="block w-[280px] h-[30px] mb-[40px] -translate-x-[80px] transform no-underline"
        >
          <span className="text-[30px] font-bold">Record ▸</span>
        </Link>
        <div className="w-full h-[300px] border border-black">
          <p>contents</p>
        </div>
      </section>

      {/* Review */}
      <section className="mb-[120px]">
        <Link
          to="/Review"
          className="block w-[280px] h-[30px] mb-[40px] -translate-x-[80px] transform no-underline"
        >
          <span className="text-[30px] font-bold">Review ▸</span>
        </Link>
        <div className="w-full h-[300px] border border-black">
          <p>contents</p>
        </div>
      </section>
    </div>
  );
};

export default Main;
