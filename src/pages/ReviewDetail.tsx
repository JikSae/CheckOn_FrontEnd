import React, { useState } from "react";

export default function ReviewDetail() {
  const dummyReview = {
    location: "오사카 힐링 여행",
    title: "돼지코 챙겨가주세요",
    author: "test123",
    profileImg: "https://i.pravatar.cc/150?img=12",
    createdAt: "2025.08.07",
    likes: 126,
    duration: "25-07-30 ~ 25-08-06",
    tags: ["전자기기", "돼지코"],
    image: "https://images.unsplash.com/photo-1595433562696-19b4f5c3a9d8",
    content: `Lorem ipsum dolor sit amet consectetur.
    Consectetur sapien id in ornare ipsum porttitor massa orci id in.
    Aliquam orci odio eu a nunc maecenas viverra semper sed mus.
    Quisque aliquam elementum at a lobortis ultricies sed.`,
  };

  const [likes, setLikes] = useState(dummyReview.likes);
  const [liked, setLiked] = useState(false); // 유저가 추천했는지 여부

  const handleLike = () => {
    if (liked) {
      setLikes((prev) => prev - 1);
      // ⚠️ 추천 취소 - 백엔드 연동 시 사용
      /*
      fetch("/api/review/123/unlike", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "user123" })
      });
      */
    } else {
      setLikes((prev) => prev + 1);
      // ⚠️ 추천 등록 - 백엔드 연동 시 사용
      /*
      fetch("/api/review/123/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "user123" })
      });
      */
    }
    setLiked(!liked);
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#F3F4F6] text-[#1F2937]">
      {/* 헤더 자리 */}

      {/* 본문 */}
      <main className="flex-1 px-4 py-8 flex justify-center items-start overflow-auto">
        <div className="bg-[#FEFEFE] border border-red-300 rounded-xl p-10 w-full max-w-5xl shadow space-y-6">
          {/* 제목 + 좋아요 */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Review</h1>
              <p className="text-sm text-gray-500 mt-1">{dummyReview.location}</p>
            </div>
            <button onClick={handleLike} className="text-lg flex items-center gap-1">
              <span className={liked ? "text-red-500 text-xl" : "text-gray-400 text-xl"}>♥</span>
              <span>{likes}</span>
            </button>
          </div>

          {/* 작성자, 제목, 날짜 */}
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-2">
              <img
                src={dummyReview.profileImg}
                alt="작성자"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm">{dummyReview.author}</span>
            </div>
            <h2 className="text-xl font-semibold">{dummyReview.title}</h2>
            <span className="text-sm text-gray-500">{dummyReview.createdAt}</span>
          </div>

          {/* 날짜 + 태그 */}
          <div className="flex justify-between items-center border-b border-gray-300 pb-2">
            <span className="text-sm text-gray-600">{dummyReview.duration}</span>
            <div className="flex gap-2">
              {dummyReview.tags.map((tag, idx) => (
                <button
                  key={idx}
                  className="bg-gray-200 text-sm px-3 py-1 rounded-full"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 이미지 + 내용 */}
          <div className="flex gap-6 mt-6">
            <img
              src={dummyReview.image}
              alt="후기 이미지"
              className="w-[320px] h-[240px] object-cover rounded-xl border"
            />
            <div className="flex-1 bg-gray-100 p-4 rounded-xl text-sm leading-relaxed border border-gray-300">
              {dummyReview.content}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}