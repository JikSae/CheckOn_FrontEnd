// src/components/Header.tsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios"

interface User {
  nickname: string;
}

interface HeaderProps {
  onLogout?: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null)

  // 사용자 로그인 정보
    useEffect(() => {
    // HttpOnly 쿠키 자동 전송: withCredentials
      axios
        .get<{ nickname: string }>("http://localhost:4000/auth/me", {
          withCredentials: true
        })
        .then(res => setUser(res.data.nickname ? { nickname :res.data.nickname } : null))
        .catch(err => {
          if(err.response?.status === 401) {
            setUser(null);
          }else {
            console.error(err)
          }
        })
    }, [])// ▶ location이 바뀔 때마다 재실행

    const handleLogout = () => {
    // 백엔드에 로그아웃 요청 (쿠키 만료)
    axios.post("http://localhost:4000/auth/sign-out", {}, {
      withCredentials: true
    }).finally(() => {
      setUser(null)
      navigate("/")
    })
  }

  // 리뷰 드롭다운(open/close)
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 모바일 햄버거 메뉴(open/close)
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    localStorage.clear();
    setUser(null);
    onLogout?.();
    navigate("/");
  };

  return (
    <header className="sticky top-0 left-0 w-full bg-gray-800 text-white shadow z-50">
      <div className="max-w-[1600px] mx-auto flex items-center px-4 md:px-6 h-16">
        {/* 로고 */}
        <Link to="/" className="text-red-500 font-bold text-2xl md:text-3xl">
          Check .On
        </Link>

        {/* 데스크탑 메뉴 */}
        <nav className="hidden md:flex ml-8 items-center space-x-4 text-sm">
          <Link to="/checkList" className="hover:text-gray-300">체크리스트</Link>
          <span className="text-gray-600">|</span>
          <Link to="/information" className="hover:text-gray-300">정보</Link>
          <span className="text-gray-600">|</span>
          <Link to="/record" className="hover:text-gray-300">찜 목록</Link>
          <span className="text-gray-600">|</span>

          {/* 리뷰 드롭다운 */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setIsOpen(o => !o)}
              className="px-3 py-1 flex items-center gap-1 hover:text-gray-300"
            >
              리뷰 <span className="text-xs">▼</span>
            </button>
            {isOpen && (
              <ul className="absolute top-full left-0 mt-2 w-44 bg-white text-gray-800 rounded shadow-md z-20">
                <li>
                  <Link to="/shareCheckList" className="block px-4 py-2 hover:bg-gray-100">
                    체크리스트 공유
                  </Link>
                </li>
                <li>
                  <Link to="/review" className="block px-4 py-2 hover:bg-gray-100">
                    준비물 후기 공유
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </nav>

        {/* 모바일 햄버거 메뉴 */}
        <div className="md:hidden ml-4" ref={mobileRef}>
          <button onClick={() => setMobileOpen(o => !o)} className="p-2 focus:outline-none">
            <div className="w-6 h-0.5 bg-white mb-1" />
            <div className="w-6 h-0.5 bg-white mb-1" />
            <div className="w-6 h-0.5 bg-white" />
          </button>
          {mobileOpen && (
            <div className="absolute top-full left-0 right-0 bg-gray-800 text-white shadow-md mt-1 rounded-b-md">
              <div className="flex flex-col space-y-1 px-4 py-3 text-sm">
                <Link to="/checkList" className="hover:bg-gray-700 rounded px-2 py-1">체크리스트</Link>
                <Link to="/information" className="hover:bg-gray-700 rounded px-2 py-1">정보</Link>
                <Link to="/record" className="hover:bg-gray-700 rounded px-2 py-1">찜 목록</Link>
                <div className="border-t border-gray-700 my-1" />
                <span className="font-medium">리뷰</span>
                <Link to="/shareCheckList" className="hover:bg-gray-700 rounded px-2 py-1">
                  체크리스트 공유
                </Link>
                <Link to="/review" className="hover:bg-gray-700 rounded px-2 py-1">
                  준비물 후기 공유
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* 우측 로그인/마이페이지 */}
        <div className="ml-auto flex items-center gap-3 text-sm">
         {user ? (
          <>
            <Link to="/mypage" className="underline">
              {user.nickname}님 반갑습니다.
            </Link>
            <button onClick={handleLogout} className="ml-4 hover:text-gray-300">
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="underline hover:text-gray-300">로그인</Link>
            <span className="mx-2">|</span>
            <Link to="/signup" className="underline hover:text-gray-300">회원가입</Link>
          </>
        )}
        </div>
      </div>
    </header>
  );
}
