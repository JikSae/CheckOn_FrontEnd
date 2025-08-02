// src/pages/Record.tsx
import React, { useState } from "react";

interface Post {
  id: number;
  category: string;
  title: string;
  author: string;
  createdAt: string;
  likes: number;
}

// 더미 데이터
const dummyPosts: Post[] = [
  { id: 101, category: "전자기기", title: "샘플 찜 리뷰 1", author: "userA", createdAt: "2025.08.01", likes: 42 },
  { id: 102, category: "의류",     title: "샘플 찜 리뷰 2", author: "userB", createdAt: "2025.07.28", likes: 17 },
  { id: 103, category: "화장품",   title: "샘플 찜 리뷰 3", author: "userC", createdAt: "2025.07.25", likes:  8 },
];

export default function Record() {
  const [posts, setPosts] = useState<Post[]>(dummyPosts);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const postsPerPage = 8;

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const currentPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const handleDelete = () => {
    // 실제 삭제는 API 호출로 대체
    setPosts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    setSelectedIds([]);
    setSelectMode(false);
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

        {/* — 삭제/선택 모드 토글 버튼 */}
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
              Array.from({ length: postsPerPage - currentPosts.length }).map((_, i) => (
                <tr key={`empty-${i}`} className="h-10">
                  <td colSpan={6}>&nbsp;</td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-6 gap-2 text-sm">
          <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
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
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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
