import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AccountRecovery() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");

  const [activeTab, setActiveTab] = useState<"find-id" | "reset-password">("find-id");
  const [form, setForm] = useState({ password: "", confirmPassword: "" });

  useEffect(() => {
    if (type === "reset-password") {
      setActiveTab("reset-password");
    } else {
      setActiveTab("find-id");
    }
  }, [type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-[#E7E6E6] flex items-center justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-2xl bg-white text-[#1F2937] rounded-2xl shadow-2xl px-6 sm:px-10 py-8 sm:py-12 space-y-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center">
          {activeTab === "find-id" ? "아이디 찾기" : "비밀번호 변경"}
        </h1>

        {/* 탭 버튼 */}
        <div className="flex rounded-lg overflow-hidden border border-gray-300 text-base sm:text-lg">
          <button
            onClick={() => setActiveTab("find-id")}
            className={`w-1/2 py-3 transition ${
              activeTab === "find-id" ? "bg-white font-bold" : "bg-gray-200"
            }`}
          >
            아이디 찾기
          </button>
          <button
            onClick={() => setActiveTab("reset-password")}
            className={`w-1/2 py-3 transition ${
              activeTab === "reset-password" ? "bg-white font-bold" : "bg-gray-200"
            }`}
          >
            비밀번호 변경
          </button>
        </div>

        {/* 아이디 찾기 폼 */}
        {activeTab === "find-id" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("아이디 찾기 요청 전송됨");
            }}
            className="space-y-8 text-base sm:text-lg"
          >
            <div>
              <label className="block mb-2">닉네임</label>
              <input
                type="text"
                placeholder="닉네임을 입력하세요"
                className="w-full px-5 py-3 bg-white border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block mb-2">생년월일</label>
              <div className="flex gap-3">
                <select
                  className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg bg-white"
                  required
                >
                  <option value="">년</option>
                  {Array.from({ length: 100 }, (_, i) => 2025 - i).map((year) => (
                    <option key={year}>{year}</option>
                  ))}
                </select>
                <select
                  className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg bg-white"
                  required
                >
                  <option value="">월</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month}>{month}</option>
                  ))}
                </select>
                <select
                  className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg bg-white"
                  required
                >
                  <option value="">일</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day}>{day}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#3B82F6] text-white rounded-lg hover:bg-blue-600"
            >
              아이디 찾기
            </button>
          </form>
        )}

        {/* 비밀번호 변경 폼 */}
        {activeTab === "reset-password" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("비밀번호 변경 요청 전송됨");
            }}
            className="space-y-6 text-base sm:text-lg"
          >
            <div>
              <label className="block mb-2">아이디</label>
              <input
                type="text"
                className="w-full px-5 py-3 bg-white border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block mb-2">새 비밀번호</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-5 py-3 bg-white border border-gray-300 rounded-lg"
                required
              />
              {form.password && (form.password.length < 6 || form.password.length > 13) && (
                <div className="text-[#F59E0B] text-sm mt-1">
                  비밀번호는 6자 이상 13자 이하로 입력해주세요.
                </div>
              )}
            </div>

            <div>
              <label className="block mb-2">비밀번호 확인</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full px-5 py-3 bg-white border border-gray-300 rounded-lg"
                required
              />
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <div className="text-[#F59E0B] text-sm mt-1">
                  비밀번호가 일치하지 않습니다.
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#3B82F6] text-white rounded-lg hover:bg-blue-600"
            >
              비밀번호 변경
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
