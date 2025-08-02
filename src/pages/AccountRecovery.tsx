//Account

import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AccountRecovery() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type") === "reset-password" ? "reset-password" : "find-id";

  const [activeTab, setActiveTab] = useState<"find-id" | "reset-password">(type);
  const [findForm, setFindForm] = useState({
    nickname: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
  });
  const [resetForm, setResetForm] = useState({
    userId: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    setActiveTab(type);
  }, [type]);

  const handleChangeFind = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFindForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };
  const handleFindSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!findForm.nickname || !findForm.birthYear || !findForm.birthMonth || !findForm.birthDay) {
      setError("모든 항목을 입력해주세요.");
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/auth/find-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(findForm),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`아이디는 ${data.userId} 입니다.`);
      } else {
        setError(data.message || "아이디 찾기에 실패했습니다.");
      }
    } catch {
      setError("서버 연결에 실패했습니다.");
    }
  };

  const handleChangeReset = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResetForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetForm.userId || !resetForm.password || !resetForm.confirmPassword) {
      setError("모든 항목을 입력해주세요.");
      return;
    }
    if (resetForm.password !== resetForm.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: resetForm.userId,
          newPassword: resetForm.password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("비밀번호가 성공적으로 변경되었습니다.");
      } else {
        setError(data.message || "비밀번호 변경에 실패했습니다.");
      }
    } catch {
      setError("서버 연결에 실패했습니다.");
    }
  };

  return (
    <div className="w-screen h-screen bg-[#E7E6E6] flex items-center justify-center px-6 sm:px-12 py-12 sm:py-16">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl px-6 sm:px-10 py-12 sm:py-16 space-y-10">
      <h1 className="text-4xl font-extrabold text-center mb-8">
          {activeTab === "find-id" ? "아이디 찾기" : "비밀번호 변경"}
        </h1>

        {/* 탭 */}
        <div className="flex rounded-lg border border-gray-300 overflow-hidden">
          <button
            onClick={() => setActiveTab("find-id")}
            className={`w-1/2 py-3 ${activeTab === "find-id" ? "bg-white font-bold" : "bg-gray-200"}`}
          >
            아이디 찾기
          </button>
          <button
            onClick={() => setActiveTab("reset-password")}
            className={`w-1/2 py-3 ${activeTab === "reset-password" ? "bg-white font-bold" : "bg-gray-200"}`}
          >
            비밀번호 변경
          </button>
        </div>

        {/* find-id */}
        {activeTab === "find-id" && (
          <form onSubmit={handleFindSubmit} className="space-y-8">
            <div>
              <label className="block mb-2">닉네임</label>
              <input
                name="nickname"
                value={findForm.nickname}
                onChange={handleChangeFind}
                className="w-full p-3 border rounded"
                placeholder="닉네임"
              />
            </div>
            <div>
              <label className="block mb-2">생년월일</label>
              <div className="flex gap-2">
                {["birthYear", "birthMonth", "birthDay"].map((f, i) => (
                  <select
                    key={f}
                    name={f}
                    value={(findForm as any)[f]}
                    onChange={handleChangeFind}
                    className="flex-1 p-2 border rounded"
                  >
                    <option value="">{["년", "월", "일"][i]}</option>
                    {Array.from({ length: i === 0 ? 100 : i === 1 ? 12 : 31 }, (_, idx) => {
                      const val = i === 0 ? 2025 - idx : idx + 1;
                      return <option key={val}>{val}</option>;
                    })}
                  </select>
                ))}
              </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button type="submit" className="w-full py-3 bg-blue-500 text-white rounded-lg">
              아이디 찾기
            </button>
          </form>
        )}

        {/* reset-password */}
        {activeTab === "reset-password" && (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">아이디</label>
              <input
                name="userId"
                value={resetForm.userId}
                onChange={handleChangeReset}
                className="w-full p-3 border rounded"
                placeholder="아이디 입력"
              />
            </div>
            <div>
              <label className="block mb-1">새 비밀번호</label>
              <input
                type="password"
                name="password"
                value={resetForm.password}
                onChange={handleChangeReset}
                className="w-full p-3 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">비밀번호 확인</label>
              <input
                type="password"
                name="confirmPassword"
                value={resetForm.confirmPassword}
                onChange={handleChangeReset}
                className="w-full p-3 border rounded"
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button type="submit" className="w-full py-3 bg-blue-500 text-white rounded-lg">
              비밀번호 변경
            </button>
          </form>
        )}
      </div>
    </div>
  );
}