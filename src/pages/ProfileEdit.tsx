// src/pages/ProfileEdit.tsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function ProfileEdit() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState(
    "https://cdn-icons-png.flaticon.com/512/847/847969.png"
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // — 내 정보 조회
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_URL}/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("내 정보 조회 실패");
        const body = await res.json();
        // body.data.publicUserInfo 혹은 body.data 형태
        const user = body.data?.publicUserInfo ?? body.data ?? body;
        setNickname(user.nickname ?? "");
        if (user.profilePhoto) {
          setProfileImage(user.profilePhoto);
        }
      } catch (err) {
        console.error(err);
        alert("내 정보를 불러올 수 없습니다.");
        navigate("/");
      }
    })();
  }, [navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  // — 프로필 수정
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return navigate("/login");
    }
    if (password && password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/my`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nickname,
          password: password || undefined,
          profilePhoto: profileImage,
        }),
      });
      if (!res.ok) {
        const txt = await res.text();
        console.error("프로필 수정 실패:", txt);
        throw new Error("프로필 수정에 실패했습니다.");
      }
      alert("프로필이 성공적으로 수정되었습니다.");
      navigate("/mypage");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-3xl">
        <table className="w-full table-fixed border-collapse border border-gray-300 bg-white">
          <tbody>
            <tr>
              <th className="w-1/4 bg-gray-200 text-left p-4 border-r">프로필 사진</th>
              <td className="p-4 border">
                <div className="flex items-center gap-4">
                  <img
                    src={profileImage}
                    alt="profile"
                    className="w-20 h-20 rounded-full object-cover border"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1 bg-white border rounded"
                  >
                    사진 변경
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setProfileImage(
                        "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                      )
                    }
                    className="px-3 py-1 bg-white border rounded"
                  >
                    기본 이미지
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th className="bg-gray-200 text-left p-4 border-t border-r">닉네임</th>
              <td className="p-4 border-t">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full border px-3 py-2 rounded bg-gray-50"
                />
              </td>
            </tr>
            <tr>
              <th className="bg-gray-200 text-left p-4 border-t border-r">비밀번호 변경</th>
              <td className="p-4 border-t">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6~13자리"
                  className="w-full border px-3 py-2 rounded bg-gray-50"
                  minLength={6}
                  maxLength={13}
                />
              </td>
            </tr>
            <tr>
              <th className="bg-gray-200 text-left p-4 border-t border-r">비밀번호 확인</th>
              <td className="p-4 border-t">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border px-3 py-2 rounded bg-gray-50"
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-sm text-yellow-600 mt-2">
                    비밀번호가 일치하지 않습니다.
                  </p>
                )}
              </td>
            </tr>
            <tr>
              <td colSpan={2} className="text-center p-6 bg-gray-200 border-t">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-4"
                >
                  적용
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  취소
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}
