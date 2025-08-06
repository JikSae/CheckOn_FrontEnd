import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import CheckListModal from '../../components/checkList/CheckListModal'
import { TravelStatusBadge } from '../../components/TravelStatusBadge'
import { MyCheckList } from '../../components/reviews/MyCheckList'
import { MyReviews } from '../../components/reviews/MyReviews'
interface ChecklistCard {
  checklist_id: number
  user_id: number
  title: string
  travel_start: string
  travel_end: string
  travel_type: string
  city: string
  created_at: string
  items: { checked: boolean }[]
}
const formatShortDate = (iso: string) => {
  try {
    const d = new Date(iso)
    const y = String(d.getFullYear()).slice(-2)
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}.${m}.${day}`
  } catch {
    return iso
  }
}
const MyPage: React.FC = () => {
  const navigate = useNavigate()
  // 로그인 시 localStorage.setItem('userId', ...) 에서 읽어오기
  const [userId] = useState<number>(() => Number(localStorage.getItem('userId') || '0'))
  // 사용자 이름도 상태로 한 번 읽어서, 없으면 '손님'
  const [username] = useState<string>(
    () => localStorage.getItem('nickname') || '손님'
  )
  console.log(localStorage.getItem('nickname'))
  const token = localStorage.getItem('token') || '';
  console.log('저장된 JWT:', token)
  const [checklists, setChecklists] = useState<ChecklistCard[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [current, setCurrent] = useState<ChecklistCard | null>(null)
  const handleLogout = () => {
    localStorage.clear()
    alert('로그아웃 되었습니다.')
    navigate('/')
  }
  useEffect(() => {
    const fetchMyChecklists = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem('token') || ''
        const res = await fetch('http://localhost:4000/my/checklists', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error(`불러오기 실패 ${res.status}`)
        const json = await res.json()
        // API가 { data: [...] } 형태로 반환한다고 가정
        const all: ChecklistCard[] = Array.isArray(json.data) ? json.data : []
        // 내 것만 필터
        const mine = all
          .filter(c => c.user_id === userId)
          .map(c => ({
            ...c,
            items: Array.isArray(c.items)
              ? c.items.map(it => ({ checked: !!it.checked }))
              : [],
          }))
        setChecklists(mine)
      } catch (e) {
        console.error('체크리스트 로딩 실패', e)
      } finally {
        setLoading(false)
      }
    }
    fetchMyChecklists()
  }, [userId])
  const openModal = (card: ChecklistCard) => {
    setCurrent(card)
    setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false)
    setCurrent(null)
  }
  return (
    <div className="max-w-[1320px] mx-auto p-6">
      <h3 className="text-[40px] font-bold mb-8">My Page</h3>
      <div className="flex gap-8">
        {/* 왼쪽 패널 */}
        <div className="border-2 border-gray-800 w-[200px] p-5 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="w-36 h-36 bg-gray-400 rounded-xl mb-4" />
            <p className="text-2xl font-bold text-center mb-2">
              {username}님
              <br />
              반갑습니다.
            </p>
            <div className="flex flex-col text-center text-sm">
              <Link to="/profile-edit" className="hover:underline mb-1">
                회원정보 변경
              </Link>
              <button
                onClick={handleLogout}
                className="hover:underline text-red-500"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
        {/* 오른쪽 전체 */}
        <div className="flex-1 flex flex-col gap-6">
          {/* 내가 작성한 체크리스트 */}
          <div className="border-2 border-gray-800 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-bold">체크 리스트</h4>
              <button
                onClick={() => navigate('/checkList')}
                className="bg-red-500 text-white px-4 py-2 rounded text-sm"
              >
                새 체크리스트 만들기
              </button>
            </div>
            {loading ? (
              <div className="text-center py-6">불러오는 중...</div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {checklists.length === 0 && (
                  <div className="text-gray-500">
                    생성된 체크리스트가 없습니다.
                  </div>
                )}
                {checklists.map(card => {
                  const allChecked =
                    card.items.length > 0 && card.items.every(it => it.checked)
                  const someChecked =
                    card.items.some(it => it.checked) && !allChecked
                  return (
                    <div
                      key={card.checklist_id}
                      onClick={() => openModal(card)}
                      className="min-w-[200px] border border-gray-200 bg-white p-4 rounded-lg cursor-pointer hover:shadow-lg transition"
                    >
                      <div className="mb-2">
                        <p className="font-semibold">{card.title}</p>
                        <p className="text-sm text-gray-600">
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
                  )
                })}
              </div>
            )}
          </div>
          {/* 공유 / 후기 섹션 */}
          <div className="flex gap-6">
            <div className="w-1/2 border-2 border-gray-800 p-6 rounded-lg">
              <Link to="/shareCheckList">
                <h4 className="text-xl font-bold mb-3">
                  체크 리스트 공유
                </h4>
              </Link>
              <MyCheckList />
            </div>
            <div className="w-1/2 border-2 border-gray-800 p-6 rounded-lg">
              <h4 className="text-xl font-bold mb-3">후기 관리</h4>
              <MyReviews />
            </div>
          </div>
        </div>
      </div>
      {/* 모달 */}
      {modalOpen && current && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative"
            onClick={e => e.stopPropagation()}
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
  )
}
export default MyPage