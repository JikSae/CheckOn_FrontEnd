import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import type { TouchEvent } from "react";

const baseImages = [
  "/images/banner01.png",
  "/images/banner02.png",
  "/images/banner03.png",
  "/images/banner04.png",
];

// 앞뒤로 클론 붙이기
const slides = [
  baseImages[baseImages.length - 1],
  ...baseImages,
  baseImages[0],
];

const TRANSITION_MS = 500;
const AUTO_PLAY_MS = 4000;

const SlideBar: React.FC = () => {
  const [index, setIndex] = useState(1); // 실제 첫 슬라이드
  const trackRef = useRef<HTMLDivElement | null>(null);
  const autoPlayRef = useRef<number | null>(null);
  const isJumpingRef = useRef(false);
  const startXRef = useRef<number | null>(null);
  const deltaXRef = useRef(0);
  const [visibleCount, setVisibleCount] = useState(1);

  // 반응형: 화면 너비에 따라 보여줄 카드 수 조정
  const updateVisibleCount = useCallback(() => {
    const w = window.innerWidth;
    if (w >= 1280) setVisibleCount(4);
    else if (w >= 1024) setVisibleCount(3);
    else if (w >= 768) setVisibleCount(2);
    else setVisibleCount(1);
  }, []);

  useEffect(() => {
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, [updateVisibleCount]);

  // 자동 재생
  const resetAuto = useCallback(() => {
    if (autoPlayRef.current) window.clearInterval(autoPlayRef.current);
    autoPlayRef.current = window.setInterval(() => {
      slideTo(index + 1);
    }, AUTO_PLAY_MS);
  }, [index]);

  useEffect(() => {
    resetAuto();
    return () => {
      if (autoPlayRef.current) window.clearInterval(autoPlayRef.current);
    };
  }, [resetAuto]);

  const slideTo = (newIdx: number) => {
    if (!trackRef.current) return;
    setIndex(newIdx);
  };

  // transitionend 보정 (클론 영역)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleTransitionEnd = () => {
      if (index === 0) {
        // 왼쪽 클론 → 실제 마지막
        isJumpingRef.current = true;
        track.style.transition = "none";
        setIndex(baseImages.length);
        const percent = (100 / (baseImages.length + 2)) * baseImages.length;
        track.style.transform = `translateX(-${percent}%)`;
        // 강제 reflow
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        track.offsetHeight;
        track.style.transition = "";
        isJumpingRef.current = false;
      } else if (index === baseImages.length + 1) {
        // 오른쪽 클론 → 실제 첫
        isJumpingRef.current = true;
        track.style.transition = "none";
        setIndex(1);
        const percent = (100 / (baseImages.length + 2)) * 1;
        track.style.transform = `translateX(-${percent}%)`;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        track.offsetHeight;
        track.style.transition = "";
        isJumpingRef.current = false;
      }
    };

    track.addEventListener("transitionend", handleTransitionEnd);
    return () => {
      track.removeEventListener("transitionend", handleTransitionEnd);
    };
  }, [index]);

  // index 변화 -> transform 적용
  useEffect(() => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const percent = (100 / (baseImages.length + 2)) * index;
    if (!isJumpingRef.current) {
      track.style.transition = `transform ${TRANSITION_MS}ms ease`;
    }
    track.style.transform = `translateX(-${percent}%)`;
  }, [index]);

  const goNext = () => slideTo(index + 1);
  const goPrev = () => slideTo(index - 1);

  // hover / focus / 터치 시 자동재생 일시정지
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const pause = () => {
      if (autoPlayRef.current) window.clearInterval(autoPlayRef.current);
    };
    const resume = () => resetAuto();
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("touchstart", pause);
    el.addEventListener("touchend", resume);
    return () => {
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
    };
  }, [resetAuto]);

  // 터치 핸들링 (간단 swipe)
  const onTouchStart = (e: TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    deltaXRef.current = 0;
    if (autoPlayRef.current) window.clearInterval(autoPlayRef.current);
  };
  const onTouchMove = (e: TouchEvent) => {
    if (startXRef.current === null) return;
    deltaXRef.current = e.touches[0].clientX - startXRef.current;
  };
  const onTouchEnd = () => {
    if (Math.abs(deltaXRef.current) > 50) {
      if (deltaXRef.current > 0) goPrev();
      else goNext();
    }
    startXRef.current = null;
    deltaXRef.current = 0;
    resetAuto();
  };

  // 인디케이터 정규화 (0..3)
  const normalized =
    index === 0
      ? baseImages.length - 1
      : index === baseImages.length + 1
      ? 0
      : index - 1;

  return (
    <div className="relative w-full overflow-hidden py-12">
      <div
        className="flex items-center justify-center overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          ref={trackRef}
          className="flex"
          style={{
            width: `${(baseImages.length + 2) * (100 / visibleCount)}%`,
            // translateX는 effect에서 처리
          }}
        >
          {slides.map((src, idx) => (
            <div
              key={`${idx}-${src}`}
              className="flex-shrink-0 px-1"
              style={{
                width: `${100 / (baseImages.length + 2)}%`,
                flexBasis: `${100 / visibleCount}%`,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg w-full">
                <img
                  src={src}
                  alt={`Banner ${idx}`}
                  className="w-full h-[300px] sm:h-[350px] md:h-[400px] object-cover object-bottom"
                />
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
      <div className="flex justify-center gap-2 mt-4">
        {baseImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setIndex(idx + 1)}
            aria-label={`Slide ${idx + 1}`}
            className={`w-3 h-3 rounded-full transition ${
              normalized === idx ? "bg-red-500 scale-110" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SlideBar;
