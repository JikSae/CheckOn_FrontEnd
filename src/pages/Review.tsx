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

export default function ReviewBoardPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState<'likes' | 'latest'>('likes');
  const postsPerPage = 20;

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
      <div className="flex h-full">
        {/* 왼쪽 카테고리 선택 카드 */}
        <aside className="w-52 bg-gray-100 p-6 border-r border-gray-300">
          <h2 className="text-xl font-bold mb-6 text-center">카테고리</h2>
          <ul className="space-y-3 text-base">
            {categories.map((category) => (
              <li
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className={`cursor-pointer py-2 text-center rounded hover:bg-blue-100 ${
                  selectedCategory === category ? "bg-blue-200 font-bold" : ""
                }`}
              >
                {category}
              </li>
            ))}
          </ul>
        </aside>

        {/* 게시판 본문 */}
        <main className="flex-1 px-16 py-10 overflow-auto">
          <h1 className="text-5xl font-bold text-center mb-10">준비물 후기 공유</h1>

          <div className="flex justify-end items-center gap-4 mb-6">
            <label className="text-lg font-medium">정렬:</label>
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value as 'likes' | 'latest')}
              className="border border-gray-400 rounded px-3 py-1 text-base"
            >
              <option value="likes">추천순</option>
              <option value="latest">최신순</option>
            </select>
          </div>

          <table className="w-full text-lg border-t border-b border-gray-400">
            <thead>
              <tr className="border-b border-gray-300 text-center">
                <th className="w-16 py-3">No</th>
                <th className="w-40">카테고리</th>
                <th className="">제목</th>
                <th className="w-40">글쓴이</th>
                <th className="w-40">작성시간</th>
                <th className="w-24">추천수</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((post, idx) => (
                <tr
                  key={post.id}
                  className="border-t border-gray-200 hover:bg-gray-50 text-center"
                >
                  <td className="py-3">{(currentPage - 1) * postsPerPage + idx + 1}</td>
                  <td>{post.category}</td>
                  <td>
                    <a
                      href={`/review/${post.id}`}
                      className="text-blue-600 hover:underline block text-center"
                    >
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
          <div className="flex justify-center mt-10 gap-4 text-lg">
            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
              {'<<'}
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              {'<'}
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'font-bold underline' : ''}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              {'>'}
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              {'>>'}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
