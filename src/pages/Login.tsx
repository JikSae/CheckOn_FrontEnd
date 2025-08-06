/* src/pages/Login.tsx */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AUTH_URL } from "../utils/api";

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/auth/sign-in", {
        method: "POST",
        credentials: "include", 
        headers: { "Content-Type": "application/json" },
        credentials: "include",  // 쿠키 전달/수신을 위해 include 설정
        body: JSON.stringify(form),
      });

      const result = await res.json();
      if (res.ok) {
        // 쿠키로 세션/토큰이 설정되어 있으므로 별도 저장 불필요
        navigate("/mypage");
      } else {
        setError(result.message || "로그인에 실패했습니다.");
      }

      // 서버가 HttpOnly 쿠키로 token 내려준다면 이 한 줄로 충분합니다.
      navigate("/mypage");
    } catch (err) {
      console.error("Login error:", err);
      setError("서버 연결에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FEFEFE] text-gray-800">
      <div className="h-20 w-full" />
      <main className="flex-1 flex justify-center pt-12">
        <div className="w-full max-w-md px-4">
          <h1 className="text-4xl font-bold text-center text-red-500 mb-12">Check .On</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 font-semibold">
                아이디 (이메일)
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="예) test123@check.com"
                className="w-full border-b border-gray-400 py-2 px-1 focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 font-semibold">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border-b border-gray-400 py-2 px-1 focus:outline-none"
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
            >
              로그인
            </button>
          </form>
          <div className="flex justify-center gap-4 text-sm text-gray-700 mt-8">
            <Link to="/signup" className="hover:underline">회원가입</Link>
            <span>|</span>
            <Link to="/account-recovery?type=find-id" className="hover:underline">아이디 찾기</Link>
            <span>|</span>
            <Link to="/account-recovery?type=reset-password" className="hover:underline">비밀번호 변경</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
