// src/pages/Record.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Post {
  id: number;
  category: string;
  title: string;
  author: string;
  createdAt: string;
  likes: number;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Record() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const postsPerPage = 8;

  // 1) 찜한 리뷰 목록 불러오기
  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인이 필요합니다.");
        return navigate("/login");
      }
      try {
        const res = await fetch(`${API_URL}/favorites/favorite-reviews`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("찜 목록 조회 실패");
        const body = await res.json();
        // 실제 데이터 shape에 맞게 조정하세요
        // 여기서는 body.data로 배열이 온다고 가정합니다.
        setPosts(
          (body.data as any[]).map((r) => ({
            id: r.reviewId,
            category: r.categoryLabel,
            title: r.itemLabel,
            author: r.userNickname,
            createdAt: new Date(r.createdAt).toLocaleDateString(),
            likes: r.likesCount,
          }))
        );
      } catch (err: any) {
        console.error(err);
        alert(err.message);
      }
    };
    fetchFavorites();
  }, [navigate]);

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const currentPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  // 2) 선택 삭제
  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return navigate("/login");
    }
    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`${API_URL}/favorites/item-reviews/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }).then((res) => {
            if (!res.ok) throw new Error("삭제 실패");
          })
        )
      );
      // 로컬 상태에서도 제거
      setPosts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
      setSelectedIds([]);
      setSelectMode(false);
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-screen min-h-screen bg-white">
      <main className="px-4 py-10 max-w-[1000px] mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">내가 찜한 목록</h1>

        <div className="mb-4">
          <button
            onClick={() => {
              if (selectMode && selectedIds.length > 0) handleDelete();
              else {
                setSelectMode(!selectMode);
                setSelectedIds([]);
              }
            }}
            className={`px-4 py-1 text-white text-sm rounded ${
              selectMode ? "bg-red-500" : "bg-blue-500"
            }`}
          >
            {selectMode ? "삭제하기" : "찜 삭제"}
          </button>
        </div>

        <table className="w-full text-sm border-t border-b border-gray-400">
          <thead>
            <tr className="border-b border-gray-300 text-center">
              <th className="w-12 py-2">No</th>
              <th className="w-16">{selectMode ? "선택" : ""}</th>
              <th className="w-24">카테고리</th>
              <th className="text-center">물품 이름</th>
              <th className="w-36">글쓴이</th>
              <th className="w-24 text-right pr-7">추천수</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.map((post, idx) => (
              <tr
                key={post.id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="py-2 text-center">
                  {(currentPage - 1) * postsPerPage + idx + 1}
                </td>
                <td className="text-center">
                  {selectMode && (
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(post.id)}
                      onChange={() => toggleSelect(post.id)}
                    />
                  )}
                </td>
                <td className="text-center">{post.category}</td>
                <td className="text-center">{post.title}</td>
                <td className="text-center">{post.author}</td>
                <td className="text-center">{post.likes}</td>
              </tr>
            ))}
            {currentPosts.length < postsPerPage &&
              Array.from({ length: postsPerPage - currentPosts.length }).map(
                (_, i) => (
                  <tr key={`empty-${i}`} className="h-10">
                    <td colSpan={6}>&nbsp;</td>
                  </tr>
                )
              )}
          </tbody>
        </table>

        <div className="flex justify-center mt-6 gap-2 text-sm">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            {"<<"}
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            {"<"}
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-2 py-1 rounded ${
                currentPage === i + 1 ? "font-bold underline" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            {">"}
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            {">>"}
          </button>
        </div>
      </main>
    </div>
  );
}
