import React, { useState, useRef } from "react";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    gender: "",
    profileImage: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-12 sm:pt-16 bg-[#E7E6E6] text-[#1F2937]">
      {/* TODO: <Header /> 위치 */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("회원가입 정보:", form);
        }}
        className="w-full max-w-2xl px-6 sm:px-10 py-10 space-y-6 bg-white rounded-2xl shadow-xl"
      >
        <h1 className="text-4xl font-bold text-center mb-6">회원가입</h1>

        <div className="flex justify-center">
          <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
            <img
              src={form.profileImage || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
              alt="profile"
              className="w-24 h-24 rounded-full border-2 border-white object-cover"
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

        {/* 입력 필드 */}
        <div className="space-y-4">
          <Input label="아이디" name="email" type="email" value={form.email} onChange={handleChange} />
          <Input
            label="비밀번호"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            warning={
              form.password && (form.password.length < 6 || form.password.length > 13)
                ? "비밀번호는 6자 이상 13자 이하로 입력해주세요."
                : ""
            }
          />
          <Input
            label="비밀번호 확인"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            warning={
              form.confirmPassword && form.password !== form.confirmPassword
                ? "비밀번호가 일치하지 않습니다."
                : ""
            }
          />
          <Input label="닉네임" name="nickname" value={form.nickname} onChange={handleChange} />
        </div>

        {/* 생년월일 */}
        <div>
          <label className="block mb-2 text-lg">생년 월 일</label>
          <div className="flex gap-3">
            {["birthYear", "birthMonth", "birthDay"].map((field, i) => (
              <select
                key={field}
                name={field}
                value={form[field as keyof typeof form]}
                onChange={handleChange}
                required
                className="w-1/3 px-4 py-2 bg-gray-200 text-black rounded-lg"
              >
                <option value="">{["년", "월", "일"][i]}</option>
                {Array.from({ length: i === 0 ? 100 : i === 1 ? 12 : 31 }, (_, idx) =>
                  i === 0 ? 2025 - idx : idx + 1
                ).map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>

        {/* 성별 선택 */}
        <div>
          <label className="block mb-2 text-lg">성별 (선택)</label>
          <div className="flex gap-6 text-lg">
            {["남자", "여자", "선택 안함"].map((gender) => (
              <label key={gender} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={form.gender === gender}
                  onChange={handleChange}
                />
                {gender}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-blue-500 text-white rounded-lg font-bold text-lg hover:bg-blue-600"
        >
          가입하기
        </button>
      </form>
    </div>
  );
}

// 공통 인풋 컴포넌트
function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  warning,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  warning?: string;
}) {
  return (
    <div>
      <label className="block mb-2 text-lg" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full px-5 py-3 text-black rounded-lg bg-gray-200 text-lg"
      />
      {warning && <p className="text-yellow-500 text-sm mt-1">{warning}</p>}
    </div>
  );
}
