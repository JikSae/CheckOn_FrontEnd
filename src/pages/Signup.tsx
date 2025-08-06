/* src/pages/Signup.tsx */
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AUTH_URL } from "../utils/api";

interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  gender: string;
  profilePhoto: string;
}

export default function Signup() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    gender: "NONSPECIFIED",
    profilePhoto: "",
  });
  const [error, setError] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        profilePhoto: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (
      !form.email ||
      !form.password ||
      !form.nickname ||
      !form.birthYear ||
      !form.birthMonth ||
      !form.birthDay
    ) {
      setError("모든 항목을 입력해주세요.");
      return;
    }

    const payload = {
      email: form.email,
      password: form.password,
      nickname: form.nickname,
      birthDate: `${form.birthYear}-${form.birthMonth.padStart(2, "0")}-${form.birthDay.padStart(2, "0")}`,
      gender: form.gender,
      authority: "USER",
      // profilePhoto: form.profilePhoto,  // 백엔드가 지원 시 주석 해제
    };

    try {
      const res = await fetch(`${AUTH_URL}/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",       // 쿠키 전달을 위해 include 설정
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorJson = await res.json();
        console.error("Signup failed:", errorJson);
        setError(errorJson.message || "회원가입에 실패했습니다.");
        return;
      }

      alert("회원가입 성공! 로그인 페이지로 이동합니다.");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      setError("서버 연결에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md bg-white p-8 rounded shadow"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>
        {/* 프로필 이미지 */}
        <div className="flex justify-center mb-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer"
          >
            <img
              src={
                form.profilePhoto ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              alt="profile"
              className="w-20 h-20 rounded-full border-2 object-cover"
            />
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        {/* 이메일 */}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1">
            이메일
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {/* 비밀번호 */}
        <div className="mb-4">
          <label htmlFor="password" className="block mb-1">
            비밀번호
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {/* 비밀번호 확인 */}
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block mb-1">
            비밀번호 확인
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {/* 닉네임 */}
        <div className="mb-4">
          <label htmlFor="nickname" className="block mb-1">
            닉네임
          </label>
          <input
            id="nickname"
            name="nickname"
            type="text"
            value={form.nickname}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {/* 생년월일 */}
        <div className="mb-4">
          <label className="block mb-1">생년월일</label>
          <div className="flex gap-2">
            {['birthYear', 'birthMonth', 'birthDay'].map((field, idx) => (
              <select
                key={field}
                name={field}
                value={(form as any)[field]}
                onChange={handleChange}
                className="flex-1 p-2 border rounded"
                required
              >
                <option value="">{idx === 0 ? '년' : idx === 1 ? '월' : '일'}</option>
                {Array.from({ length: idx === 0 ? 100 : idx === 1 ? 12 : 31 }).map((_, i) => {
                  const val = idx === 0 ? 2025 - i : i + 1;
                  return (
                    <option key={val} value={`${val}`}>{val}</option>
                  );
                })}
              </select>
            ))}
          </div>
        </div>
        {/* 성별 */}
        <div className="mb-4">
          <label className="block mb-1">성별</label>
          <div className="flex gap-4">
            {[{ label: '남자', value: 'MALE' }, { label: '여자', value: 'FEMALE' }, { label: '선택 안함', value: 'NONSPECIFIED' }].map(opt => (
              <label key={opt.value} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="gender"
                  value={opt.value}
                  checked={form.gender === opt.value}
                  onChange={handleChange}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          가입하기
        </button>
      </form>
    </div>
  );
}
