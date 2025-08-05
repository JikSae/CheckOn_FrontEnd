// src/pages/myPage/MyPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckListModal from '../../components/checkList/CheckListModal';
import { MyCheckList } from '../../components/reviews/MyCheckList';
import { MyReviews } from '../../components/reviews/MyReviews';
import { TravelStatusBadge } from '../../components/TravelStatusBadge';
import { useChecklistCreator } from '../../hooks/useChecklistCreator';

interface ChecklistCard {
  checklist_id: number;
  title: string;
  travel_start: string; // ISO
  travel_end: string; // ISO
  travel_type: string;
  city: string;
  created_at: string;
  items: { checked: boolean }[]; // 진행 상태용
}

const formatShortDate = (iso: string) => {
  try {
    const d = new Date(iso);
    const y = String(d.getFullYear()).slice(-2);
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}.${m}.${day}`;
  } catch {
    return iso;
  }
};

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  // 필요한 것만 구조분해 (cities 등 쓰지 않으면 빼서 TS6198 경고 피함)
  const { createChecklist } = useChecklistCreator();
  const [checklists, setChecklists] = useState<ChecklistCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState<ChecklistCard | null>(null);

  const handleLogout = () => {
    localStorage.clear();
    alert('로그아웃 되었습니다.');
    navigate('/');
  };

  useEffect(() => {
    const fetchMyChecklists = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('jwt') || '';
        const res = await fetch('http://localhost:4000/my/checklists/:checklistId', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`불러오기 실패 ${res.status}`);
        const json = await res.json();
        let payload: any = json;
        if (Array.isArray(json?.data)) payload = json.data;
        setChecklists(
          payload.map((c: any) => ({
            checklist_id: c.checklist_id,
            title: c.title,
            travel_start: c.travel_start,
            travel_end: c.travel_end,
            travel_type: c.travel_type,
            city: c.city,
            created_at: c.created_at,
            items: Array.isArray(c.items)
              ? c.items.map((it: any) => ({ checked: !!it.checked }))
              : [],
          }))
        );
      } catch (e) {
        console.error('체크리스트 로딩 실패', e);
      } finally {
        setLoading(false);
      }
    };
    fetchMyChecklists();
  }, []);

  const openModal = (card: ChecklistCard) => {
    setCurrent(card);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrent(null);
  };

  return (
    <div className="max-w-[1320px] mx-auto">
      <h3 className="text-[40px] font-bold block w-[170px] h-[55px] mb-[30px]">
        My Page
      </h3>
      <div className="flex gap-[30px] w-full">
        {/* 왼쪽 패널 */}
        <div className="border-2 border-[#1F2937] w-[197px] h-[358px] rounded-[10px] p-[20px] text-left">
          <div className="w-full flex flex-col items-center">
            <div className="w-[150px] h-[150px] rounded-[20px] mb-[20px] bg-[#777]" />
            <p className="text-[30px] font-bold leading-[2rem] mb-[10px] text-center">
              test123님
              <br />
              반갑습니다.
            </p>
            <div className="flex flex-col gap-[5px] text-center">
              <a href="/profile-edit" className="text-[12px] font-light black">
                회원정보 변경
              </a>
              <button
                onClick={handleLogout}
                className="text-[12px] font-light text-black hover:underline"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>

        {/* 오른쪽 패널 */}
        <div className="border-2 border-[#1F2937] flex-1 rounded-[10px] flex flex-col">
          {/* 체크리스트 섹션 */}
          <div className="mb-[30px] p-[30px]">
            <div className="flex justify-between items-center mb-[20px]">
              <h4 className="text-[20px] font-bold">체크 리스트</h4>
              <button
                onClick={() => navigate('/checkList')}
                className="text-sm bg-red-500 text-white px-4 py-2 rounded"
              >
                새 체크리스트 만들기
              </button>
            </div>
            {loading ? (
              <div className="text-center py-6">불러오는 중...</div>
            ) : (
              <div className="flex gap-[30px] overflow-x-auto pb-2">
                {checklists.map((card) => {
                  const allChecked =
                    card.items.length > 0 && card.items.every((it) => it.checked);
                  const someChecked =
                    card.items.some((it) => it.checked) && !allChecked;
                  return (
                    <div
                      key={card.checklist_id}
                      onClick={() => openModal(card)}
                      className="min-w-[220px] rounded-lg border border-gray-200 bg-white p-4 flex flex-col justify-between cursor-pointer transition hover:shadow-lg"
                    >
                      <div className="mb-2">
                        <p className="text-[15px] font-semibold">{card.title}</p>
                        <p className="text-[12px] font-medium text-gray-600">
                          {formatShortDate(card.travel_start)} ~{' '}
                          {formatShortDate(card.travel_end)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <TravelStatusBadge
                          travelStart={card.travel_start}
                          checklist={card.items}
                        />
                        {allChecked && (
                          <div className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                            완료
                          </div>
                        )}
                        {someChecked && !allChecked && (
                          <div className="text-xs bg-yellow-400 text-black px-2 py-1 rounded-full">
                            진행중
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {checklists.length === 0 && (
                  <div className="text-gray-500">생성된 체크리스트가 없습니다.</div>
                )}
              </div>
            )}
          </div>

          {/* 하단 리뷰/후기 섹션 */}
          <div className="mx-auto flex gap-[30px] px-[30px]">
            <div className="w-[50%]">
              <h4 className="text-[20px] font-bold mb-[10px] text-left">
                체크 리스트 공유
              </h4>
              <div className="border border-black w-full h-[266px] overflow-hidden">
                <MyCheckList />
              </div>
            </div>
            <div className="w-[50%]">
              <h4 className="text-[20px] font-bold mb-[10px] text-left">
                후기 관리
              </h4>
              <div className="border border-black w-full h-[266px] overflow-hidden">
                <MyReviews />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 모달 */}
      {modalOpen && current && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 pt-20"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-[983px] overflow-y-auto mx-4 p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-1">{current.title}</h2>
            <p className="text-sm text-gray-600 mb-4">
              {formatShortDate(current.travel_start)} ~{' '}
              {formatShortDate(current.travel_end)}
            </p>
            <CheckListModal checklistId={current.checklist_id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
