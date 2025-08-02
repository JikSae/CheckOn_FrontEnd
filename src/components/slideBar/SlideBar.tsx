import React, { useState, useEffect, useRef } from 'react';

// 원본 이미지 배열
const baseImages = [
  '/images/banner01.png',
  '/images/banner02.png',
  '/images/banner03.png',
  '/images/banner04.png',
];

// 무한 루프를 위해 앞뒤로 클론 붙이기
const images = [
  baseImages[baseImages.length - 1],
  ...baseImages,
  baseImages[0],
];

const SlideBar = () => {
  const [currentIdx, setCurrentIdx] = useState(1); // 실제 첫 번째 카드가 가운데로 시작
  const containerRef = useRef<HTMLDivElement | null>(null);
  const transitioningRef = useRef(false);
  const transitionDurationMs = 500;

  // 자동 재생
  useEffect(() => {
    const id = setInterval(() => {
      goNext();
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const goNext = () => {
    if (transitioningRef.current) return;
    setCurrentIdx((prev) => prev + 1);
  };
  const goPrev = () => {
    if (transitioningRef.current) return;
    setCurrentIdx((prev) => prev - 1);
  };

  // 클론 보정 (무한 루프)
  useEffect(() => {
    if (!containerRef.current) return;
    transitioningRef.current = true;
    const timeout = setTimeout(() => {
      if (currentIdx === 0) {
        // 왼쪽 클론 → 실제 마지막
        disableTransitionOnce(() => setCurrentIdx(baseImages.length));
      } else if (currentIdx === baseImages.length + 1) {
        // 오른쪽 클론 → 실제 첫
        disableTransitionOnce(() => setCurrentIdx(1));
      }
      transitioningRef.current = false;
    }, transitionDurationMs);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx]);

  // transition 없이 위치 보정
  const disableTransitionOnce = (callback: () => void) => {
    if (!containerRef.current) return;
    const track = containerRef.current.firstElementChild as HTMLElement;
    if (!track) return;
    track.style.transition = 'none';
    callback();
    // 강제 reflow
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    track.offsetHeight;
    track.style.transition = '';
  };

  // 터치 스와이프 (선택적)
  useEffect(() => {
    if (!containerRef.current) return;
    let startX: number | null = null;
    const el = containerRef.current;
    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (startX === null) return;
      const endX = e.changedTouches[0].clientX;
      const diff = endX - startX;
      if (diff > 40) goPrev();
      if (diff < -40) goNext();
      startX = null;
    };
    el.addEventListener('touchstart', onTouchStart);
    el.addEventListener('touchend', onTouchEnd);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  // 인디케이터용 정규화 (baseImages 기준)
  const normalizedCurrent =
    currentIdx === 0
      ? baseImages.length - 1
      : currentIdx === baseImages.length + 1
      ? 0
      : currentIdx - 1;

  return (
    <div className="relative w-full overflow-hidden py-16">
      <div
        ref={containerRef}
        className="flex items-center justify-center overflow-hidden"
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            width: `${(images.length * 100) / 3}%`,
            transform: `translateX(calc(-${currentIdx * (100 / 3)}%))`,
          }}
        >
          {images.map((src, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 px-1"
              style={{
                width: '33.3333%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg w-full">
                <img
                  src={src}
                  alt={`Banner ${idx}`}
                  className="w-full h-[500px] object-cover object-top"
                />
                <div className="absolute inset-0  flex items-end p-4">
                  <div className="text-white font-semibold text-lg">
                    {/* 카드 {((idx + baseImages.length - 1) % baseImages.length) + 1} */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prev/Next */}
      <button
        onClick={goPrev}
        aria-label="Previous"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75"
      >
        ‹
      </button>
      <button
        onClick={goNext}
        aria-label="Next"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75"
      >
        ›
      </button>

      {/* 인디케이터 */}
      <div className="flex justify-center gap-2 mt-6">
        {baseImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIdx(idx + 1)}
            aria-label={`Slide ${idx + 1}`}
            className={`w-3 h-3 rounded-full transition ${
              normalizedCurrent === idx ? 'bg-red-500' : 'bg-gray-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SlideBar;
