// src/components/Header.tsx
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

interface User {
  username: string;
}

interface HeaderProps {
  user?: User | null; // 실제 로그인 상태는 부모나 context에서 주입
  onLogout?: () => void;
}

export default function Header({ user: initialUser = null, onLogout }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false); // 리뷰 드롭다운 (데스크탑)
  const [mobileOpen, setMobileOpen] = useState(false); // 모바일 전체 메뉴
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 닫기 (데스크탑 드롭다운)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 실제 유저 상태는 prop/context 기준. 여기선 fallback으로 null.
  const [user, setUser] = useState<User | null>(initialUser);

  return (
    <header className="sticky top-0 left-0 w-full bg-gray-800 text-white shadow z-50">
      <div className="max-w-[1600px] mx-auto flex items-center px-4 md:px-6 h-16">
        {/* 로고 */}
        <div className="flex-shrink-0">
          <Link to="/" className="text-red-500 font-bold text-2xl md:text-3xl">
            Check .On
          </Link>
        </div>

        {/* 데스크탑 네비 */}
        <nav className="hidden md:flex ml-8 items-center space-x-4 text-sm">
          <Link to="/checkList" className="hover:text-gray-300">
            체크리스트
          </Link>
          <span className="text-gray-600">|</span>
          <Link to="/information" className="hover:text-gray-300">
            정보
          </Link>
          <span className="text-gray-600">|</span>
          <Link to="/record" className="hover:text-gray-300">
            찜 목록
          </Link>
          <span className="text-gray-600">|</span>

          {/* Review 드롭다운 */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setIsOpen(o => !o)}
              aria-expanded={isOpen}
              aria-haspopup="menu"
              className="px-3 py-1 flex items-center gap-1 hover:text-gray-300 focus:outline-none"
            >
              리뷰
              <span aria-hidden="true" className="text-xs">
                ▼
              </span>
            </button>
            {isOpen && (
              <ul
                role="menu"
                className="absolute top-full left-0 mt-2 w-44 bg-white text-gray-800 rounded shadow-md z-20"
              >
                <li role="none">
                  <Link
                    to="/shareCheckList"
                    className="block px-4 py-2 hover:bg-gray-100"
                    role="menuitem"
                  >
                    체크리스트 공유
                  </Link>
                </li>
                <li role="none">
                  <Link
                    to="/review"
                    className="block px-4 py-2 hover:bg-gray-100"
                    role="menuitem"
                  >
                    준비물 후기 공유
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </nav>

        {/* mobile 햄버거 */}
        <div className="md:hidden ml-4" ref={mobileRef}>
          <button
            aria-label="메뉴 열기"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(o => !o)}
            className="p-2 focus:outline-none"
          >
            <div className="w-6 h-0.5 bg-white mb-1" />
            <div className="w-6 h-0.5 bg-white mb-1" />
            <div className="w-6 h-0.5 bg-white" />
          </button>
          {mobileOpen && (
            <div className="absolute top-full left-0 right-0 bg-gray-800 text-white shadow-md mt-1 rounded-b-md">
              <div className="flex flex-col space-y-1 px-4 py-3 text-sm">
                <Link to="/checkList" className="hover:bg-gray-700 rounded px-2 py-1">
                  체크리스트
                </Link>
                <Link to="/information" className="hover:bg-gray-700 rounded px-2 py-1">
                  정보
                </Link>
                <Link to="/record" className="hover:bg-gray-700 rounded px-2 py-1">
                  찜 목록
                </Link>
                <div className="border-t border-gray-700 my-1" />
                <div className="flex flex-col">
                  <span className="font-medium mb-1">리뷰</span>
                  <Link
                    to="/shareCheckList"
                    className="hover:bg-gray-700 rounded px-2 py-1"
                  >
                    체크리스트 공유
                  </Link>
                  <Link to="/review" className="hover:bg-gray-700 rounded px-2 py-1">
                    준비물 후기 공유
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 우측 로그인/마이페이지 */}
        <div className="ml-auto flex items-center gap-3 text-sm">
          {user ? (
            <>
              <Link
                to="/mypage"
                className="underline hover:text-gray-300 whitespace-nowrap"
              >
                {user.username}님 반갑습니다.
              </Link>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="text-xs ml-2 hover:text-gray-300"
                >
                  로그아웃
                </button>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Link to="/login" className="underline hover:text-gray-300">
                로그인
              </Link>
              <span className="text-gray-500">|</span>
              <Link to="/signup" className="underline hover:text-gray-300">
                회원가입
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
