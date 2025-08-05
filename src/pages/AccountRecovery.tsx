import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

type Tab = "find-id" | "reset-password";

interface FindForm {
  nickname: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
}

interface ResetForm {
  userId: string;
  password: string;
  confirmPassword: string;
}

export default function AccountRecovery() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialTab = params.get("type") === "reset-password" ? "reset-password" : "find-id";
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  const [findForm, setFindForm] = useState<FindForm>({
    nickname: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
  });
  const [resetForm, setResetForm] = useState<ResetForm>({
    userId: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // 아이디 찾기 폼 값 변경
  const handleFindChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFindForm((f) => ({ ...f, [name]: value }));
    setError("");
  };

  // 아이디 찾기 제출
  const handleFindSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const { nickname, birthYear, birthMonth, birthDay } = findForm;
    if (!nickname || !birthYear || !birthMonth || !birthDay) {
      setError("모든 항목을 입력해주세요.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth1/find-id`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname,
          birthDate: `${birthYear}-${birthMonth.padStart(2, "0")}-${birthDay.padStart(2, "0")}`,
        }),
      });
      if (!res.ok) {
        // 에러 시 텍스트 확인
        const txt = await res.text();
        console.error("Find-ID error response:", txt);
        let msg = txt;
        try {
          const j = JSON.parse(txt);
          msg = j.message || msg;
        } catch {}
        setError(msg || "아이디 찾기에 실패했습니다.");
        return;
      }
      const data = await res.json();
      alert(`찾으신 아이디는 "${data.email}" 입니다.`);
    } catch (err) {
      console.error("Find-ID network error:", err);
      setError("서버 연결에 실패했습니다.");
    }
  };

  // 비밀번호 변경 폼 값 변경
  const handleResetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResetForm((f) => ({ ...f, [name]: value }));
    setError("");
  };

  // 비밀번호 변경 제출
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const { userId, password, confirmPassword } = resetForm;
    if (!userId || !password || !confirmPassword) {
      setError("모든 항목을 입력해주세요.");
      return;
    }
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth1/reset-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userId, newPassword: password }),
      });
      if (!res.ok) {
        const txt = await res.text();
        console.error("Reset-PW error response:", txt);
        let msg = txt;
        try {
          const j = JSON.parse(txt);
          msg = j.message || msg;
        } catch {}
        setError(msg || "비밀번호 변경에 실패했습니다.");
        return;
      }
      alert("비밀번호가 성공적으로 변경되었습니다.");
    } catch (err) {
      console.error("Reset-PW network error:", err);
      setError("서버 연결에 실패했습니다.");
    }
  };

  return (
    <div className="w-screen h-screen bg-[#E7E6E6] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 space-y-10">
        <h1 className="text-4xl font-extrabold text-center">
          {activeTab === "find-id" ? "아이디 찾기" : "비밀번호 변경"}
        </h1>

        {/* 탭 */}
        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
          {(["find-id", "reset-password"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-1/2 py-3 ${
                activeTab === tab ? "bg-white font-bold" : "bg-gray-200"
              }`}
            >
              {tab === "find-id" ? "아이디 찾기" : "비밀번호 변경"}
            </button>
          ))}
        </div>

        {/* 아이디 찾기 */}
        {activeTab === "find-id" && (
          <form onSubmit={handleFindSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 font-medium">닉네임</label>
              <input
                name="nickname"
                value={findForm.nickname}
                onChange={handleFindChange}
                className="w-full p-3 border rounded"
                placeholder="닉네임을 입력하세요"
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">생년월일</label>
              <div className="flex gap-2">
                {["birthYear", "birthMonth", "birthDay"].map((f, i) => (
                  <select
                    key={f}
                    name={f}
                    value={(findForm as any)[f]}
                    onChange={handleFindChange}
                    className="flex-1 p-2 border rounded"
                    required
                  >
                    <option value="">{i === 0 ? "년" : i === 1 ? "월" : "일"}</option>
                    {Array.from({ length: i === 0 ? 100 : i === 1 ? 12 : 31 }, (_, idx) => {
                      const val = i === 0 ? 2025 - idx : idx + 1;
                      return (
                        <option key={val} value={String(val)}>
                          {val}
                        </option>
                      );
                    })}
                  </select>
                ))}
              </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-lg"
            >
              아이디 찾기
            </button>
          </form>
        )}

        {/* 비밀번호 변경 */}
        {activeTab === "reset-password" && (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">이메일 (아이디)</label>
              <input
                name="userId"
                value={resetForm.userId}
                onChange={handleResetChange}
                className="w-full p-3 border rounded"
                placeholder="가입한 이메일을 입력하세요"
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">새 비밀번호</label>
              <input
                type="password"
                name="password"
                value={resetForm.password}
                onChange={handleResetChange}
                className="w-full p-3 border rounded"
                placeholder="새 비밀번호"
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">비밀번호 확인</label>
              <input
                type="password"
                name="confirmPassword"
                value={resetForm.confirmPassword}
                onChange={handleResetChange}
                className="w-full p-3 border rounded"
                placeholder="다시 입력하세요"
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-lg"
            >
              비밀번호 변경
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
