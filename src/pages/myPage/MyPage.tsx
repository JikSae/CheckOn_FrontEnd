import React, { useState } from 'react';
import CheckListModal from '../../components/checkList/CheckListModal';
import { MyCheckList } from '../../components/reviews/MyCheckList';
import { MyReviews } from '../../components/reviews/MyReviews';
import { Link } from 'react-router-dom';
import { TravelStatusBadge } from '../../components/TravelStatusBadge';

interface Card {
  id: number;
  title: string;
  date: string;
  badges: number;
}

const cards: Card[] = [
  { id: 1, title: '오사카 힐링 여행', date: '25.07.30 ~ 25.08.03', badges: 2 },
  { id: 2, title: '도쿄 음식 탐방', date: '25.08.10 ~ 25.08.15', badges: 3 },
  { id: 3, title: '교토 사찰 순례', date: '25.09.01 ~ 25.09.05', badges: 1 },
  { id: 4, title: '후지산 등반', date: '25.10.12 ~ 25.10.14', badges: 2 },
];

// 예시 체크리스트 상태 매핑 (실제라면 상위에서 체크리스트 상태를 동기화)
const checklistMap: Record<number, { checked: boolean }[]> = {
  1: [
    { checked: true },
    { checked: false }, // 일부만 체크 => 시작 임박이면 빨강
  ],
  2: [
    { checked: true },
    { checked: true },
    { checked: true }, // 모두 체크 => 초록
  ],
  3: [
    { checked: false }, // 미완료, 출발 여유 있으면 회색
  ],
  4: [
    { checked: true },
    { checked: false },
  ],
};

const MyPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState<Card | null>(null);

  const openModal = (card: Card) => {
    setCurrent(card);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrent(null);
  };

  return (
    <div className="max-w-[1320px] mx-auto">
      {/* 타이틀 */}
      <h3 className="text-[40px] font-bold block w-[170px] h-[55px] mb-[30px]">
        My Page
      </h3>

      <div className="flex gap-[30px] w-full">
        {/* 왼쪽 패널 */}
        <div className="border-2 border-[#1F2937] w-[197px] h-[358px] rounded-[10px] p-[20px] text-left">
          <img
            src=""
            alt="프로필사진"
            className="w-[150px] h-[150px] rounded-[20px] mx-auto mb-[20px] bg-[#777]"
          />
          <p className="text-[30px] font-bold leading-[2rem] mb-[10px]">
            test123님
            <br />
            반갑습니다.
          </p>
          <div className="flex flex-col gap-[5px]">
            <a href="/profile-edit" className="text-[12px] font-light black">
              회원정보 변경
            </a>
          </div>
        </div>

        {/* 오른쪽 패널 */}
        <div className="border-2 border-[#1F2937] w-[1094px] h-[700px] rounded-[10px] flex flex-col">
          {/* 체크리스트 섹션 */}
         <div className="mb-[30px] p-[50px]">
          <h4 className="text-[20px] font-bold mb-[30px] block text-left w-[140px]">
            체크 리스트
          </h4>
          <div className="flex gap-[30px] items-start">
            {cards.map(card => {
              const checklist = checklistMap[card.id] || [];
              return (
                <div
                  key={card.id}
                  onClick={() => openModal(card)}
                  className="w-[170px] h-[100px] rounded-lg border border-gray-200 bg-white p-3 flex flex-col justify-between cursor-pointer
                            transition hover:shadow-lg hover:border-red-500" 
                  >
                  {/* 타이틀 + 날짜 */}
                  <div className="mb-2">
                    <p className="text-[15px] font-semibold">{card.title}</p>
                    <p className="text-[12px] font-medium text-gray-600">{card.date}</p>
                  </div>

                  {/* [변경] 기존 빨간 점 자리 대신 상태 뱃지 */}
                  <div className="flex gap-2 mb-auto">
                    <TravelStatusBadge travelStart={card.date} checklist={checklist} />
                  </div>

                  {/* 아래쪽은 여백 유지용 또는 추가 정보 여기에 둘 수 있음 */}
                </div>
              );
            })}
          </div>
        </div>

          {/* 하단 리뷰/후기 섹션 */}
          <div className="mx-auto flex gap-[30px]">
            <div className="w-[483px] h-[330px]">
              <Link to={"/shareCheckList"}>
                <h4 className="text-[20px] font-bold mb-[10px] text-left">체크 리스트 공유</h4>
              </Link>
              <div className="border border-black w-full h-[266px]">
                <MyCheckList />
              </div>
            </div>
            <div className="w-[483px] h-[330px]">
              <Link to={"/review"}>
                <h4 className="text-[20px] font-bold mb-[10px] text-left">후기 관리</h4>
              </Link>
              <div className="border border-black w-full h-[266px]">
                <MyReviews />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 모달 */}
      {modalOpen && current && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50
                     flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-[983px]  max-h-[900px] overflow-y-auto hide-scrollbar mx-4 p-6 relative"
            onClick={e => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            {/* 모달 내용 */}
            <h2 className="text-start font-bold mb-2">{current.title}</h2>
            <p className="text-start text-gray-600 mb-4">{current.date}</p>
            <CheckListModal />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
