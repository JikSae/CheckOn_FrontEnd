// src/components/MyPage.tsx
import React, { useState } from 'react';
import CheckListModal from '../../components/checkList/CheckListModal';
import { MyCheckList } from '../../components/reviews/MyCheckList';
import { MyReviews } from '../../components/reviews/MyReviews';
import { Link } from 'react-router-dom';


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
  { id: 4, title: '후지산 등반',   date: '25.10.12 ~ 25.10.14', badges: 2 },
];


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
        <div className="flex gap-[30px] items-center">
              {cards.map(card => (
                <div
                  key={card.id}
                  onClick={() => openModal(card)}
                  className="w-[170px] h-[100px]
                             border-2 border-[#FE0000]
                             rounded-[10px] p-[15px]
                             text-left cursor-pointer
                             hover:shadow-lg transition"
                >
                  <p className="text-[15px] font-semibold mb-[5px]">
                    {card.title}
                  </p>
                  <p className="text-[12px] font-medium mb-[5px]">
                    {card.date}
                  </p>
                  <div className="flex gap-[7px]">
                    {[...Array(card.badges)].map((_, i) => (
                      <span
                        key={i}
                        className="w-[20px] h-[15px] bg-[#FE0000] rounded-[10px]"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 하단 리뷰/후기 섹션 */}
          <div className="mx-auto flex gap-[30px]">
            <div className="w-[483px] h-[330px]">
              <Link to={"/shareCheckList"}>
                 <h4 className="text-[20px] font-bold mb-[10px] text-left">체크 리스트 공유</h4>
              </Link>
              <div className="border border-black w-full h-[266px]" >
                  <MyCheckList />
              </div>               
            </div>
            <div className="w-[483px] h-[330px]">
              <Link to={"/review"}>
                <h4 className="text-[20px] font-bold mb-[10px] text-left">후기 관리</h4> 
              </Link>
              <div className="border border-black w-full h-[266px]" >
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
            {/* <div className="flex mb-6">
              {[...Array(current.badges)].map((_, i) => (
                <span
                  key={i}
                  className="w-6 h-4 bg-[#FE0000] rounded-full mr-2"
                />
              ))}
            </div> */}
              <CheckListModal />
         
          </div>
        </div>
      )}



    </div>
  );
};

export default MyPage;
