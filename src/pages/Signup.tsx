import React, { useState } from "react";

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
    profileImage: "", // 프로필 이미지 (base64로 미리보기용)
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 이미지 업로드 핸들러
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

  // 이미지 선택 창 열기용 ref
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-[#E7E6E6] text-[#1F2937] font-sans">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // TODO: 백엔드로 form 정보 전송 (form.profileImage 포함)
          console.log("회원가입 정보:", form);
        }}
        className="w-full max-w-2xl p-10 space-y-6 border border-gray-700 rounded-2xl shadow-2xl bg-[#FEFEFE]"
      >
        {/* TODO: 나중에 Header 컴포넌트 추가 위치 */} 
        {/* <Header /> */}

        <h1 className="text-4xl font-extrabold text-center">회원가입</h1>

        {/* 프로필 이미지 업로드 */}
        <div className="flex justify-center">
          <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
            <img
              src={
                form.profileImage ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
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


        <div>
          <label className="block mb-2 text-lg">아이디</label>
          <input
            type="email"
            name="email"
            placeholder="test123@check.com"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-5 py-3 text-black rounded-lg bg-gray-200 text-lg"
          />
        </div>

        <div>
          <label className="block mb-2 text-lg">비밀번호</label>
          <input
            type="password"
            name="password"
            placeholder="6 - 13 자리 입력"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-5 py-3 text-black rounded-lg bg-gray-200 text-lg"
          />
          {form.password && (form.password.length < 6 || form.password.length > 13) && (
            <div className="text-[#F59E0B] text-sm mt-1">
              비밀번호는 6자 이상 13자 이하로 입력해주세요.
            </div>
          )}
        </div>

        <div>
          <label className="block mb-2 text-lg">비밀번호 확인</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-5 py-3 text-black rounded-lg bg-gray-200 text-lg"
          />
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <div className="text-[#F59E0B] text-sm mt-1">비밀번호가 일치하지 않습니다.</div>
            )}
        </div>

        <div>
          <label className="block mb-2 text-lg">닉네임</label>
          <input
            type="text"
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            required
            className="w-full px-5 py-3 text-black rounded-lg bg-gray-200 text-lg"
          />
        </div>

        <div>
          <label className="block mb-2 text-lg">생년 월 일</label>
          <div className="flex gap-4">
            <select
              name="birthYear"
              value={form.birthYear}
              onChange={handleChange}
              required
              className="w-1/3 px-4 py-2 text-[#1F2937] rounded-lg bg-gray-200 text-lg"
            >
              <option value="">년도</option>
              {Array.from({ length: 100 }, (_, i) => 2025 - i).map((year) => (
                <option key={year}>{year}</option>
              ))}
            </select>
            <select
              name="birthMonth"
              value={form.birthMonth}
              onChange={handleChange}
              required
              className="w-1/3 px-4 py-2 text-black rounded-lg bg-gray-200 text-lg"
            >
              <option value="">월</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month}>{month}</option>
              ))}
            </select>
            <select
              name="birthDay"
              value={form.birthDay}
              onChange={handleChange}
              required
              className="w-1/3 px-4 py-2 text-black rounded-lg bg-gray-200 text-lg"
            >
              <option value="">일</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <option key={day}>{day}</option>
              ))}
            </select>
          </div>
        </div>

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
          className="w-full py-3 text-white text-lg bg-[#3B82F6] rounded-lg hover:bg-blue-700"
        >
          가입하기
        </button>
      </form>
    </div>
  );
}
