// src/components/ChatChecklist.tsx
import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import ModifyCheckList from './ModifyCheckList';
import type { Item } from './ModifyCheckList';

type Message = { sender: 'bot' | 'user'; text: string };

// 옵션 상수
const PURPOSE_OPTIONS = ['힐링', '액티비티', '비즈니스', '문화탐방', '캠핑'];
const TRANSPORT_OPTIONS = ['렌트', '대중교통'];
const ACTIVITY_OPTIONS = ['등산', '바다 수영', '맛집 탐방', '유적지 탐방'];
const DEFAULT_ITEMS = [
  '여권 및 신분증',
  '항공권/기차표 예약 확인',
  '숙소 예약 확인',
  '충전기',
  '선크림',
  '여행자 보험',
];
const MINIMAL_ITEMS = ['여권', '충전기', '선크림'];

export default function MakeCheckList() {
  // 단계 관리
    const [step, setStep] = useState<
    | 'city'
    | 'date'
    | 'purpose'
    | 'jp'
    | 'jp-custom'
    | 'transport'
    | 'activities'
    | 'minimal'
    | 'exchange'
    | 'items'
    | 'done'
  >('city');

  // 대화 메시지
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: '여행할 도시를 입력해주세요.' },
  ]);

  // 사용자 입력값들
  const [city, setCity] = useState('');
  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined);
  const [arrivalDate, setArrivalDate] = useState<Date | undefined>(undefined);
  const [purpose, setPurpose] = useState('');
  const [jpType, setJpType] = useState<'J' | 'P' | ''>('');
  const [transport, setTransport] = useState('');
  const [activities, setActivities] = useState<string[]>([]);
  const [minimalPack, setMinimalPack] = useState<boolean | null>(null);
  const [exchange, setExchange] = useState<boolean | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [customItem, setCustomItem] = useState('');
  const [customItems, setCustomItems] = useState<string[]>([]);

  const addMsg = (msg: Message) =>
    setMessages((prev) => [...prev, msg]);

  // Chat 완료 후 에디터로 전환
  const [showEditor, setShowEditor] = useState(false);
  const [editorData, setEditorData] = useState<{
    title: string;
    startDate: string;
    endDate: string;
    items: Omit<Item, 'id' | 'checked'>[];
  } | null>(null);

  // 1) 도시 입력 완료
  const submitCity = () => {
    if (!city.trim()) return;
    addMsg({ sender: 'user', text: city });
    addMsg({ sender: 'bot', text: '출발일과 도착일을 선택해주세요.' });
    setStep('date');
  };

  // 2) 출발일 선택
  const handleDepartureSelect = (d: Date | undefined) => {
    if (!d) return;
    setDepartureDate(d);
  };

  // 3) 도착일 선택 → 둘 다 있으면 메시지 추가 및 다음 단계
    const handleArrivalSelect = (d: Date | undefined) => {
    if (!d || !departureDate) return;
    setArrivalDate(d);
    // formatYMD 함수 사용하여 로컬 기준 날짜 포맷
    const from = formatYMD(departureDate);
    const to = formatYMD(d);
    addMsg({ sender: 'user', text: `${from} ~ ${to}` });
    addMsg({ sender: 'bot', text: '여행 목적을 선택해주세요.' });
    setStep('purpose');
  };

  // 4) 목적 선택
  const selectPurpose = (opt: string) => {
    setPurpose(opt);
    addMsg({ sender: 'user', text: opt });
    addMsg({
      sender: 'bot',
      text: '판단 유형을 선택해주세요: J(직접 입력) / P(추천)',
    });
    setStep('jp');
  };

  // 5) J/P 선택
  const selectJp = (t: 'J' | 'P') => {
    setJpType(t);
    addMsg({ sender: 'user', text: t });
    if (t === 'J') {
      addMsg({ sender: 'bot', text: '원하는 준비물을 직접 입력해주세요.' });
      setStep('jp-custom');
    } else {
      addMsg({ sender: 'bot', text: '교통 수단을 선택해주세요.' });
      setStep('transport');
    }
  };

  // J일 경우: 직접 입력
  const addCustom = () => {
    if (!customItem.trim()) return;
    setCustomItems((prev) => [...prev, customItem.trim()]);
    setCustomItem('');
  };
  const finishCustom = () => {
    addMsg({
      sender: 'user',
      text: customItems.length ? customItems.join(', ') : '없음',
    });
    goToEditor();
  };

  // P일 경우: 교통수단 선택
  const selectTransport = (opt: string) => {
    setTransport(opt);
    addMsg({ sender: 'user', text: opt });
    addMsg({ sender: 'bot', text: '원하는 활동을 선택해주세요.' });
    setStep('activities');
  };

  // P: 활동 선택
  const toggleActivity = (act: string) => {
    setActivities((prev) =>
      prev.includes(act) ? prev.filter((x) => x !== act) : [...prev, act]
    );
  };
  const finishActivities = () => {
    addMsg({
      sender: 'user',
      text: activities.length ? activities.join(', ') : '없음',
    });
    addMsg({ sender: 'bot', text: '짐을 최소화하시겠습니까?' });
    setStep('minimal');
  };

  // P: 짐 최소화
  const selectMinimal = (yes: boolean) => {
    setMinimalPack(yes);
    addMsg({ sender: 'user', text: yes ? '예 (미니멀)' : '아니요' });
    addMsg({ sender: 'bot', text: '환전이 필요하신가요?' });
    setStep('exchange');
  };

  // P: 환전 여부
  const selectExchange = (yes: boolean) => {
    setExchange(yes);
    addMsg({ sender: 'user', text: yes ? '예' : '아니요' });
    addMsg({ sender: 'bot', text: '추천 준비물을 선택해주세요.' });
    setStep('items');
  };

  // P: 추천 준비물 선택
  const suggestions = minimalPack ? MINIMAL_ITEMS : DEFAULT_ITEMS;
  const toggleItem = (it: string) => {
    setSelectedItems((prev) =>
      prev.includes(it) ? prev.filter((x) => x !== it) : [...prev, it]
    );
  };
  const finishItems = () => {
    addMsg({
      sender: 'user',
      text: selectedItems.length ? selectedItems.join(', ') : '없음',
    });
    goToEditor();
  };

  // Chat → Editor 전환
 const formatYMD = (date: Date) => {
    // 로컬 기준 YYYY-MM-DD 포맷
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const goToEditor = () => {
    const title = `${city} ${purpose}`;
    // timezone 이슈를 방지하기 위해 getFullYear 등 사용
    const startDate = formatYMD(departureDate!);
    const endDate = formatYMD(arrivalDate!);
    const items =
      jpType === 'J'
        ? customItems.map((text) => ({ category: '기타', tag: '기타', text }))
        : selectedItems.map((text) => ({ category: '기타', tag: '기타', text }));
    setEditorData({ title, startDate, endDate, items });
    setShowEditor(true);
  };



  if (showEditor && editorData) {
    return (
      <ModifyCheckList
        initialTitle={editorData.title}
        initialStartDate={editorData.startDate}
        initialEndDate={editorData.endDate}
        initialItems={editorData.items}
        onSave={(data) => {
          console.log('최종 저장된 데이터', data);
          setShowEditor(false);
          setStep('city');
        }}
      />
    );
  }

  return (
    <div className='max-w-[1320px] mx-auto'>
      <h3 className ="text-3xl font-bold text-center ml-[-130px] my-10" >체크리스트 만들기 </h3>
    <div className="w-[1000px] mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* 챗 버블 */}
      <div className="space-y-4 mb-6">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`px-4 py-2 rounded-lg whitespace-pre-wrap ${
                m.sender === 'bot' ? 'bg-gray-100 text-gray-800' : 'bg-red-500 text-white'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* 인터랙션 */}
      {step === 'city' && (
        <div className="flex gap-2">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submitCity()}
            className="flex-1 border rounded px-3 py-2 focus:outline-none"
            placeholder="예) 서울, 도쿄"
          />
          <button onClick={submitCity} className="bg-red-500 text-white px-4 py-2 rounded">
            전송
          </button>
        </div>
      )}

      {step === 'date' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-2 font-medium">출발일</p>
            <DayPicker
              mode="single"
              selected={departureDate}
              onSelect={handleDepartureSelect}
            />
          </div>
          <div>
            <p className="mb-2 font-medium">도착일</p>
            <DayPicker
              mode="single"
              selected={arrivalDate}
              onSelect={handleArrivalSelect}
            />
          </div>
        </div>
      )}

      {step === 'purpose' && (
        <div className="flex gap-2 flex-wrap">
          {PURPOSE_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => selectPurpose(opt)}
              className={`px-4 py-2 rounded-full border ${
                purpose === opt ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-800 border-gray-300'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {step === 'jp' && (
        <div className="flex gap-2">
          <button onClick={() => selectJp('J')} className="px-6 py-2 rounded-full bg-gray-800 text-white">
            J
          </button>
          <button onClick={() => selectJp('P')} className="px-6 py-2 rounded-full bg-red-500 text-white">
            P
          </button>
        </div>
      )}

      {step === 'jp-custom' && (
        <>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={customItem}
              onChange={(e) => setCustomItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustom()}
              className="flex-1 border rounded px-3 py-2 focus:outline-none"
              placeholder="직접 입력할 준비물"
            />
            <button onClick={addCustom} className="bg-red-500 text-white px-4 py-2 rounded">
              추가
            </button>
          </div>
          <button onClick={finishCustom} className="ml-auto bg-red-500 text-white px-6 py-2 rounded-full">
            완료
          </button>
        </>
      )}

      {step === 'transport' && (
        <div className="flex gap-2">
          {TRANSPORT_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => selectTransport(opt)}
              className={`px-4 py-2 rounded-full border ${
                transport === opt ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-800 border-gray-300'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {step === 'activities' && (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            {ACTIVITY_OPTIONS.map((act) => (
              <button
                key={act}
                onClick={() => toggleActivity(act)}
                className={`px-3 py-1 rounded-full border ${
                  activities.includes(act) ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-800 border-gray-300'
                }`}
              >
                {act}
              </button>
            ))}
          </div>
          <button onClick={finishActivities} className="ml-auto bg-red-500 text-white px-6 py-2 rounded-full">
            다음
          </button>
        </>
      )}

      {step === 'minimal' && (
        <div className="flex gap-2">
          <button onClick={() => selectMinimal(true)} className="px-4 py-2 rounded-full bg-red-500 text-white">
            예
          </button>
          <button onClick={() => selectMinimal(false)} className="px-4 py-2 rounded-full bg-gray-300 text-gray-800">
            아니요
          </button>
        </div>
      )}

      {step === 'exchange' && (
        <div className="flex gap-2">
          <button onClick={() => selectExchange(true)} className="px-4 py-2 rounded-full bg-red-500 text-white">
            예
          </button>
          <button onClick={() => selectExchange(false)} className="px-4 py-2 rounded-full bg-gray-300 text-gray-800">
            아니요
          </button>
        </div>
      )}

      {step === 'items' && (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestions.map((it) => (
              <button
                key={it}
                onClick={() => toggleItem(it)}
                className={`px-3 py-1 rounded-full border ${
                  selectedItems.includes(it) ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-800 border-gray-300'
                }`}
              >
                {it}
              </button>
            ))}
          </div>
          <button onClick={finishItems} className="ml-auto bg-red-500 text-white px-6 py-2 rounded-full">
            완료
          </button>
        </>
      )}

      {step === 'done' && (
        <div className="space-y-4">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2 text-left">준비물</th>
                <th className="border px-4 py-2 text-center">완료</th>
              </tr>
            </thead>
            <tbody>
              {(jpType === 'J' ? customItems : selectedItems).map((it) => (
                <tr key={it}>
                  <td className="border px-4 py-2">{it}</td>
                  <td className="border px-4 py-2 text-center">
                    <input type="checkbox" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="mt-6 float-right bg-red-500 text-white px-8 py-3 rounded-full">
            저장하기
          </button>
        </div>
      )}
    </div>
    </div>
  );
}
