// src/pages/ReviewDetail.tsx
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function ReviewDetail() {
  const { id } = useParams<{ id: string }>();
  const [review, setReview] = useState<any | null>(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await fetch(`${API_URL}/my/items-reviews/${id}`);
        const data = await res.json();
        setReview(data);
        setLikes(data.likes);
        setLiked(data.isLikedByMe ?? false);
      } catch (err) {
        console.error("리뷰 불러오기 실패:", err);
      }
    };
    fetchReview();
  }, [id]);

  if (!review) return <div>로딩 중...</div>;

  return (
    <div className="w-screen min-h-screen flex flex-col bg-[#f4f9ff] text-gray-800">
      <main className="flex-1 px-4 py-8 flex justify-center">
        <div className="bg-white border rounded-xl p-10 w-full max-w-5xl shadow space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{review.title}</h1>
              <p className="text-sm text-gray-500">{review.location}</p>
            </div>
            <div className="text-lg flex items-center gap-2">
              <button onClick={() => setLiked(!liked)}>
                <span className={liked ? "text-red-500 text-xl" : "text-gray-400 text-xl"}>♥</span>
              </button>
              <span>{likes}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <img src={review.profileImg} alt="작성자" className="w-8 h-8 rounded-full" />
            <span className="text-sm">{review.author}</span>
            <span className="text-sm text-gray-400 ml-auto">{review.created_at}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span>{review.duration}</span>
            <div className="flex gap-2">
              {review.tags.map((tag: string, idx: number) => (
                <span key={idx} className="bg-gray-200 px-3 py-1 rounded-full text-sm">{tag}</span>
              ))}
            </div>
          </div>

          <div className="flex gap-6 mt-6">
            <img src={review.image} alt="리뷰 이미지" className="w-[320px] h-[240px] object-cover rounded-xl border" />
            <div className="flex-1 bg-gray-100 p-4 rounded-xl text-sm leading-relaxed border">
              {review.content}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
