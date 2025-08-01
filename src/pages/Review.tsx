import React, { useState } from "react";

const categories = [
  "의류", "세면 용품", "화장품", "아기 용품", "소모품",
  "필수품", "출력물", "비상약", "전자기기", "애완 용품", "기타"
];

const dummyPosts = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  category: ["의류", "전자기기", "화장품"][i % 3],
  title: `샘플 제목 ${i + 1}`,
  author: `user${i + 1}`,
  createdAt: `2025.07.${String(22 + (i % 7)).padStart(2, "0")}`,
  likes: 100 - i * 2,
}));

export default function Review() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState<'likes' | 'latest'>('likes');
  const postsPerPage = 20;

  // 필터링 & 정렬
  const filteredPosts = selectedCategory
    ? dummyPosts.filter((post) => post.category === selectedCategory)
    : dummyPosts;
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortType === 'likes') return b.likes - a.likes;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
  const currentPosts = sortedPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <div className="w-screen h-screen flex flex-col bg-white">
      {/* <Header /> */}
      <main className="flex-1 px-4 py-10">
        <div className="w-full max-w-[1320px] mx-auto">
          <h1 className="text-4xl font-bold text-center mb-6">준비물 후기 공유</h1>

          {/* 카테고리 & 정렬 컨트롤 */}
          <div className="flex justify-between items-center mb-4">
            {/* 왼쪽: 카테고리 */}
            <div className="flex items-center gap-2">
              <label className="text-base font-medium">카테고리:</label>
              <select
                value={selectedCategory ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedCategory(val === "" ? null : val);
                  setCurrentPage(1);
                }}
                className="border border-gray-400 rounded px-3 py-1 text-sm"
              >
                <option value="">전체</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* 오른쪽: 정렬 */}
            <div className="flex items-center gap-2">
              <label className="text-base font-medium">정렬:</label>
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value as 'likes' | 'latest')}
                className="border border-gray-400 rounded px-3 py-1 text-sm"
              >
                <option value="likes">추천순</option>
                <option value="latest">최신순</option>
              </select>
            </div>
          </div>

          {/* 게시판 테이블 */}
          <table className="w-full text-sm border-t border-b border-gray-400">
            <thead>
              <tr className="border-b border-gray-300 text-center">
                <th className="w-16 py-3">No</th>
                <th className="w-40">카테고리</th>
                <th>제목</th>
                <th className="w-40">글쓴이</th>
                <th className="w-40">작성시간</th>
                <th className="w-24 text-right pr-4">추천수</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((post, idx) => (
                <tr key={post.id} className="border-t border-gray-200 hover:bg-gray-50 text-center">
                  <td className="py-3">{(currentPage - 1) * postsPerPage + idx + 1}</td>
                  <td>{post.category}</td>
                  <td>
                    <a href={`/review/${post.id}`} className="text-blue-600 hover:underline block text-center">
                      {post.title}
                    </a>
                  </td>
                  <td>{post.author}</td>
                  <td>{post.createdAt}</td>
                  <td className="text-right pr-4">{post.likes}</td>
                </tr>
              ))}
              {currentPosts.length < postsPerPage &&
                Array.from({ length: postsPerPage - currentPosts.length }).map((_, i) => (
                  <tr key={`empty-${i}`} className="h-12">
                    <td colSpan={6}>&nbsp;</td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* 페이지네이션 */}
          <div className="flex justify-center mt-10 gap-2 text-sm">
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>{'<<'}</button>
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>{'<'}</button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'font-bold underline' : ''}`}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>{'>'}</button>
            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>{'>>'}</button>
          </div>
        </div>
      </main>
    </div>
  );
}
