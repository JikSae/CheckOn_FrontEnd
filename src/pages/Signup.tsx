// SignUp

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    gender: "",
    profileImage: "", // base64
  });
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          profileImage: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    // 1) 비밀번호 확인
    if (form.password !== form.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    // 2) 필수 필드 확인
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

    try {
      const res = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          nickname: form.nickname,
          birthdate: `${form.birthYear}-${form.birthMonth.padStart(
            2,
            "0"
          )}-${form.birthDay.padStart(2, "0")}`,
          gender: form.gender,
          profileImage: form.profileImage, // base64
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("회원가입 성공! 로그인 페이지로 이동합니다.");
        navigate("/login");
      } else {
        setError(data.message || "회원가입에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      setError("서버 연결에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-12 bg-[#E7E6E6] text-[#1F2937]">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-2xl p-10 space-y-6 bg-white rounded-2xl shadow-xl"
      >
        <h1 className="text-4xl font-bold text-center">회원가입</h1>

        <div className="flex justify-center">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer"
          >
            <img
              src={
                form.profileImage ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              alt="profile"
              className="w-24 h-24 rounded-full border-2 object-cover"
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="hidden"
          />
        </div>

        <div className="space-y-4">
          <Input
            label="아이디(이메일)"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            label="비밀번호"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
          <Input
            label="비밀번호 확인"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          <Input
            label="닉네임"
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-2 text-lg">생년월일</label>
          <div className="flex gap-3">
            {["birthYear", "birthMonth", "birthDay"].map((field, i) => (
              <select
                key={field}
                name={field}
                value={form[field as keyof typeof form]}
                onChange={handleChange}
                required
                className="w-1/3 px-4 py-2 bg-gray-200 rounded-lg"
              >
                <option value="">{["년", "월", "일"][i]}</option>
                {Array.from({
                  length: i === 0 ? 100 : i === 1 ? 12 : 31,
                }).map((_, idx) => {
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

        <div>
          <label className="block mb-2 text-lg">성별 (선택)</label>
          <div className="flex gap-6">
            {["남자", "여자", "선택 안함"].map((g) => (
              <label key={g} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={form.gender === g}
                  onChange={handleChange}
                />
                {g}
              </label>
            ))}
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-bold"
        >
          가입하기
        </button>
      </form>
    </div>
  );
}

// 재사용 가능한 Input 컴포넌트
function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block mb-2 text-lg">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required
        className="w-full px-5 py-3 bg-gray-200 rounded-lg text-lg"
      />
    </div>
  );
}