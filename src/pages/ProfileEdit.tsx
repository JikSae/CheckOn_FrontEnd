import React, { useState, useRef } from "react";

export default function ProfileEdit() {
  const [form, setForm] = useState({
    nickname: "test123",
    password: "",
    confirmPassword: "",
    profileImage: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setForm({
      nickname: "test123",
      password: "",
      confirmPassword: "",
      profileImage: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 백엔드에 변경된 회원정보 전송
    console.log("회원정보 수정 요청", form);
  };

  return (
    <div className="w-screen h-screen bg-[#E7E6E6] text-[#1F2937] font-sans flex flex-col">
      {/* TODO: 헤더 영역 삽입 위치 */}
      <div className="h-20 w-full bg-black">
        {/* Header 자리입니다. 나중에 <Header /> 컴포넌트로 교체 예정 */}
      </div>

      <div className="flex flex-col items-center justify-center flex-1 px-4 mt-[-300px]">
        <h1 className="text-4xl font-bold mb-10">프로필 수정</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-[#FEFEFE] text-black w-full max-w-3xl p-10 rounded-xl shadow-2xl text-lg"
        >
          <div className="grid grid-cols-4 gap-y-8 items-center">
            <div className="font-semibold col-span-1 text-right pr-4">프로필 사진</div>
            <div className="col-span-3 flex flex-col items-start gap-3">
              <img
                src={form.profileImage}
                alt="profile"
                className="w-24 h-24 rounded-full object-cover border border-gray-400"
              />
              <div className="flex gap-5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-1 rounded bg-gray-300 text-sm"
                >
                  사진 변경
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      profileImage: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
                    }))
                  }
                  className="px-4 py-1 rounded bg-gray-300 text-sm"
                >
                  기본 이미지
                </button>
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <div className="font-semibold col-span-1 text-right pr-4">닉네임</div>
            <div className="col-span-3">
              <input
                type="text"
                name="nickname"
                value={form.nickname}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-white border border-gray-300"
              />
            </div>

            <div className="font-semibold col-span-1 text-right pr-4">비밀번호 변경</div>
            <div className="col-span-3">
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="6~13자리"
                className="w-full px-4 py-2 rounded bg-white border border-gray-300"
                minLength={6}
                maxLength={13}
              />
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <div className="text-[#F59E0B] text-sm mt-1">비밀번호는 6자 이상 13자 이하로 입력해주세요.</div>
              )}
            </div>

            <div className="font-semibold col-span-1 text-right pr-4">비밀번호 확인</div>
            <div className="col-span-3">
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-white border border-gray-300"
              />
              {form.confirmPassword &&
                form.password !== form.confirmPassword && (
                  <p className="text-[#F59E0B] text-sm mt-1">
                    비밀번호가 일치하지 않습니다.
                  </p>
                )}
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-12">
            <button
              type="submit"
              className="bg-[#3B82F6] text-white px-10 py-2 rounded-lg text-lg hover:bg-blue-700"
            >
              적용
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-300 text-black px-10 py-2 rounded-lg text-lg hover:bg-gray-300"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
