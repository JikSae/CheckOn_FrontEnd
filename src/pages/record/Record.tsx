import React, { useEffect, useState } from "react";

interface Post {
  id: number;
  category: string;
  title: string;
  author: string;
  createdAt: string;
  likes: number;
}

const dummyPosts: Post[] = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  category: ["의류", "전자기기", "화장품"][i % 3],
  title: `찜한 항목 ${i + 1}`,
  author: `user${i + 1}`,
  createdAt: `2025.07.${String(22 + (i % 7)).padStart(2, "0")}`,
  likes: 100 - i * 2,
}));

export default function WishListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const postsPerPage = 8;

  const totalPages = Math.ceil(dummyPosts.length / postsPerPage);
  const currentPosts = dummyPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const handleDelete = () => {
    // fetch("/api/delete-wishlist", { method: "POST", body: JSON.stringify(selectedIds) })
    alert(`삭제된 ID들: ${selectedIds.join(", ")}`);
    setSelectedIds([]);
    setSelectMode(false);
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((el) => el !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-screen min-h-screen bg-white">
      {/* <Header /> */}

      <main className="max-w-[1320px] mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center ml-[-130px] mb-6">내가 찜한 목록</h1>

        <div className="flex justify-start mb-4">
          <button
            onClick={() => {
              if (selectMode && selectedIds.length > 0) {
                handleDelete();
              } else {
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

        {/* 테이블 */}
        <table className="w-full text-sm border-t border-b border-gray-400">
          <thead>
            <tr className="border-b border-gray-300 text-center">
              <th className="w-12 py-2">No</th>
              <th className="w-24">{selectMode ? "선택" : ""}</th>
              <th className="w-32">카테고리</th>
              <th className="w-[40%] text-center">제목</th>
              <th className="w-36">글쓴이</th>
              <th className="w-36">작성일</th>
              <th className="w-24 text-right pr-2">추천수</th>
            </tr>
          </thead>

          <tbody>
            {currentPosts.map((post, idx) => (
              <tr
                key={post.id}
                className="border-t border-gray-200 hover:bg-gray-50 text-center"
              >
                <td className="py-2">{(currentPage - 1) * postsPerPage + idx + 1}</td>
                <td>
                  {selectMode && (
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(post.id)}
                      onChange={() => toggleSelect(post.id)}
                    />
                  )}
                </td>
                <td>{post.category}</td>
                <td className="text-center text-blue-600 hover:underline">   
                  {post.title}
                </td>
                <td>{post.author}</td>
                <td>{post.createdAt}</td>
                <td className="text-right pr-4">{post.likes}</td>
              </tr>
            ))}
            {currentPosts.length < postsPerPage &&
              Array.from({ length: postsPerPage - currentPosts.length }).map((_, i) => (
                <tr key={`empty-${i}`} className="h-10">
                  <td colSpan={7}>&nbsp;</td>
                </tr>
              ))}
          </tbody>

        </table>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-10 gap-2 text-sm">
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
              className={`px-2 py-1 ${
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