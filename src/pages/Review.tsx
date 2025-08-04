// Review.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

interface ReviewSummary {
  review_id: number;
  category: string;
  title: string;
  author: string;
  created_at: string;
  likes: number;
}

export default function Review() {
  const [posts, setPosts] = useState<ReviewSummary[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState<'likes' | 'latest'>('likes');
  const postsPerPage = 20;

  const categories = [
    "의류", "세면 용품", "화장품", "아기 용품", "소모품",
    "필수품", "출력물", "비상약", "전자기기", "애완 용품", "기타"
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_URL}/my/items-reviews`);
        const data = await res.json();
  
        // 배열이 아닌 객체 형태로 들어오는 경우 처리
        if (Array.isArray(data.reviews)) {
          setPosts(data.reviews);
        } else {
          console.error("리뷰 데이터 형식이 배열이 아닙니다:", data);
          setPosts([]);
        }
      } catch (err) {
        console.error("후기 목록 불러오기 실패:", err);
        setPosts([]);
      }
    };
    fetchReviews();
  }, []);
  

  const filtered = Array.isArray(posts)
    ? selectedCategory
      ? posts.filter((post) => post.category === selectedCategory)
      : posts
    : [];

  const sorted = [...filtered].sort((a, b) => {
    if (sortType === "likes") return b.likes - a.likes;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const totalPages = Math.ceil(sorted.length / postsPerPage);
  const currentPosts = sorted.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <div className="w-screen min-h-screen flex flex-col bg-[#f4f9ff]">
      <main className="flex-1 px-4 py-10">
        <div className="w-full max-w-[1320px] mx-auto">
          <h1 className="text-4xl font-bold text-center mb-6">준비물 후기 공유</h1>

          <div className="flex justify-between items-center mb-4">
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
                <tr key={`post-${post.review_id}`} className="border-t border-gray-200 hover:bg-gray-50 text-center">
                  <td className="py-3">{(currentPage - 1) * postsPerPage + idx + 1}</td>
                  <td>{post.category}</td>
                  <td>
                    <Link to={`/review/${post.review_id}`} className="text-blue-600 hover:underline block text-center">
                      {post.title}
                    </Link>
                  </td>
                  <td>{post.author}</td>
                  <td>{post.created_at}</td>
                  <td className="text-right pr-4">{post.likes}</td>
                </tr>
              ))}

              {/* 빈 행 처리 */}
              {Array.from({ length: postsPerPage - currentPosts.length }).map((_, i) => (
                <tr key={`empty-row-${i}`} className="h-12">
                  <td colSpan={6}>&nbsp;</td>
                </tr>
              ))}
            </tbody>

          </table>

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
