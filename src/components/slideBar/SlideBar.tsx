import React, { useState, useEffect } from 'react';

const images = [
  '/images/banner01.png',
  '/images/banner02.png',
  '/images/banner03.png',
  '/images/banner04.png',
];

const SlideBar = () => {
  const [current, setCurrent] = useState(0);
  const lastIndex = images.length - 1;

  // 자동 재생 (5초)
  useEffect(() => {
    const id = setInterval(() => {
      setCurrent(prev => (prev === lastIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(id);
  }, [lastIndex]);

  const prev = () => setCurrent(current === 0 ? lastIndex : current - 1);
  const next = () => setCurrent(current === lastIndex ? 0 : current + 1);

  return (
    <div className="relative w-full overflow-hidden my-[100px]">
      {/* 슬라이드 컨테이너 */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((src, idx) => (
          <div key={idx} className="w-full flex-shrink-0">
            <img
              src={src}
              alt={`Banner ${idx + 1}`}
              className="w-[1320px] h-[550px] object-cover object-top "
            />
          </div>
        ))}
      </div>

      {/* Prev/Next 화살표 */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
      >
        ›
      </button>

      {/* 페이지 인디케이터 */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 rounded-full ${
              idx === current ? 'bg-white' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SlideBar