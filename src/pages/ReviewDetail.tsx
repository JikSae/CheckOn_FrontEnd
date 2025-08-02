import { useParams, useNavigate } from "react-router-dom";
import React, { useEffect,useState } from "react";


export default function ReviewDetail() {
  const { id } = useParams<{ id: string}>();
  const navigate = useNavigate();
  const [review, setReview] = useState<any | null>(null);
  const [likes, setLikes] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);
  

//   useEffect(() => {
//   fetch(`/api/reviews/${id}`)
//     .then(res => res.json())
//     .then(data => {
//       setReview(data);
//       setLikes(data.likes);
//       setLiked(data.isLikedByMe); // 백에서 내려주는 필드
//     })
//     .catch(console.error);
// }, [id]);

  useEffect(() => {
    // 실제 fetch 요청은 백 연결 후 대체
    const dummy = {
      id,
      location: `리뷰 위치 ${id}`,
      title: `리뷰 제목 ${id}`,
      author: `작성자 ${id}`,
      createdAt: "2025.08.07",
      likes: 126,
      duration: "25-07-30 ~ 25-08-06",
      tags: ["전자기기", "돼지코"],
      image: "https://images.unsplash.com/photo-1595433562696-19b4f5c3a9d8",
      content: `리뷰 ${id}의 본문 내용입니다.`,
      profileImg: `https://i.pravatar.cc/150?img=${parseInt(id ?? '1') + 10}`,
      isLikedByMe: false,
    };
    setReview(dummy);
    setLikes(dummy.likes);
    setLiked(dummy.isLikedByMe);
  }, [id]);

    if (!review) return <div>로딩 중...</div>;

    const handleLike = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인이 필요합니다.");
        return navigate("/login");
      }

      try {
        if (!liked) {
          const res = await fetch(`/api/likes`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ reviewId: id }),
          });
          if (res.ok) {
            setLikes((l) => l + 1);
            setLiked(true);
          }
        } else {
          const res = await fetch(`/api/likes/${id}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
          if (res.ok) {
            setLikes((l) => l - 1);
            setLiked(false);
          }
        }
      } catch (err) {
        console.error("찜 API 오류:", err);
      }
    };




  return (
      <div className="w-screen h-screen flex flex-col bg-[#F3F4F6] text-[#1F2937]">
        <main className="flex-1 px-4 py-8 flex justify-center items-start overflow-auto">
          <div className="bg-[#FEFEFE] border border-red-300 rounded-xl p-10 w-full max-w-5xl shadow space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Review</h1>
                <p className="text-sm text-gray-500 mt-1">{review.location}</p>
              </div>
            {/* 🔧 찜/취소 버튼 onClick, 상태 반영 */}
              <button onClick={handleLike} className="text-lg flex items-center gap-1">
                <span className={liked ? "text-red-500 text-xl" : "text-gray-400 text-xl"}>
                  ♥
                </span>
                <span>{likes}</span>
              </button>
           </div>

            {/* 작성자 */}
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-2">
                <img src={review.profileImg} alt="작성자" className="w-8 h-8 rounded-full" />
                <span className="text-sm">{review.author}</span>
              </div>
              <h2 className="text-xl font-semibold">{review.title}</h2>
              <span className="text-sm text-gray-500">{review.createdAt}</span>
            </div>

            {/* 날짜 + 태그 */}
            <div className="flex justify-between items-center border-b border-gray-300 pb-2">
              <span className="text-sm text-gray-600">{review.duration}</span>
              <div className="flex gap-2">
                {review.tags.map((tag: string, idx: number) => (
                  <button key={idx} className="bg-gray-200 text-sm px-3 py-1 rounded-full">{tag}</button>
                ))}
              </div>
            </div>

            {/* 이미지 + 내용 */}
            <div className="flex gap-6 mt-6">
              <img src={review.image} alt="후기 이미지" className="w-[320px] h-[240px] object-cover rounded-xl border" />
              <div className="flex-1 bg-gray-100 p-4 rounded-xl text-sm leading-relaxed border border-gray-300">
                {review.content}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }