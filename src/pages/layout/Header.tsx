import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <header className="top-0 left-0 w-full bg-gray-800 text-white shadow ">
      <div className="max-w-[1600px] mx-auto h-16 flex items-center px-6">
        {/* 로고 */}
        <div className="text-red-500 font-bold text-3xl">
          <Link to="/">Check .On</Link>
        </div>

        {/* 네비 메뉴 */}
        <nav className="ml-8 flex items-center space-x-4">
          <Link to="/checkList" className="hover:text-gray-300">체크리스트</Link>
          <span className="text-gray-600">|</span>
          <Link to="/information" className="hover:text-gray-300">정보</Link>
          <span className="text-gray-600">|</span>
          <Link to="/record" className="hover:text-gray-300">찜 목록</Link>
          <span className="text-gray-600">|</span>

          {/* Review 드롭다운 (클릭 토글) */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setIsOpen(open => !open)}
              className="px-3 py-1 hover:text-gray-300"
            >
              리뷰
            </button>

            {isOpen && (
              <ul className="absolute top-full left-0 mt-1 w-40 bg-white text-gray-800 rounded shadow-lg z-10">
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link to="/shareCheckList" className="block">체크리스트 공유</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link to="/review" className="block">준비물 후기 공유</Link>
                </li>
              </ul>
            )}
          </div>
        </nav>

        {/* 우측 마이페이지 */}
        <div className="ml-auto">
          <Link to="/mypage" className="underline hover:text-gray-300">
            test123님 반갑습니다.
          </Link>
        </div>
      </div>
    </header>
  );
}
