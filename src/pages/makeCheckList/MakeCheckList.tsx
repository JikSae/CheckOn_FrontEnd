// src/components/MakeCheckList.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import ModifyCheckList from './ModifyCheckList';
import type { Item } from './ModifyCheckList';
import { useChecklistCreator } from '../../hooks/useChecklistCreator';
import { useRecommendItems } from '../../hooks/useRecommendItems';
import { computeLocalRecommendations } from '../../hooks/recommendUtils';

type Message = { sender: 'bot' | 'user'; text: string };

const PURPOSE_OPTIONS = ['힐링', '액티비티', '비즈니스', '문화탐방', '캠핑'];
const TRANSPORT_OPTIONS = ['렌트', '대중교통'];
const ACTIVITY_OPTIONS = ['등산', '바다 수영', '맛집 탐방', '유적지 탐방'];
const COMPANION_OPTIONS = ['유아', '미성년자', '노인', '반려 동물'];
const MINIMAL_ITEMS = ['여권', '충전기', '선크림'];

type Inputs = {
  purpose: string;
  transport: string;
  activities: string[];
  minimalPack: boolean | null;
  exchange: boolean | null;
  companions: string[];
};

const EXCHANGE_EXTRA = ['원화', '여권', '지갑'];
const TRANSPORT_EXTRA: Record<string, string[]> = {
  '대중교통': ['교통카드'],
  렌트: ['국제운전면허증'],
};

interface RecommendedItemsProps {
  items: string[];
  selected: string[];
  onToggle: (item: string) => void;
  title?: string;
  compact?: boolean;
}
const RecommendedItems: React.FC<RecommendedItemsProps> = ({
  items,
  selected,
  onToggle,
  title = '추천 준비물',
  compact = false,
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between mb-1">
      <h4 className="font-semibold">{title}</h4>
      <div className="text-sm text-gray-500">{selected.length}개 선택</div>
    </div>
    <div className="flex flex-wrap gap-2">
      {items.map((it) => {
        const active = selected.includes(it);
        const paddingClasses = compact ? 'px-2 py-1' : 'px-3 py-2';
        const baseClass =
          active
            ? 'bg-red-500 text-white border border-red-500'
            : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-100';
        return (
          <button
            key={it}
            onClick={() => onToggle(it)}
            aria-pressed={active}
            className={`flex items-center whitespace-nowrap rounded-full text-sm font-medium transition ${baseClass} ${paddingClasses}`}
            style={{ minWidth: 80 }}
          >
            {it}
          </button>
        );
      })}
    </div>
  </div>
);

export default function MakeCheckList() {
  const [step, setStep] = useState<
    | 'city'
    | 'date'
    | 'companion'
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

  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: '여행할 도시를 입력해주세요.' },
  ]);

  const {
    cities,
    citiesLoading,
    citiesError,
    catalog,
    catalogLoading,
    catalogError,
    createChecklist,
    creating,
    createError,
  } = useChecklistCreator();

  const [city, setCity] = useState<{ cityId: number; cityName: string } | null>(null);
  const [departureDate, setDepartureDate] = useState<Date | undefined>();
  const [arrivalDate, setArrivalDate] = useState<Date | undefined>();
  const [purpose, setPurpose] = useState('');
  const [jpType, setJpType] = useState<'J' | 'P' | ''>('');
  const [transport, setTransport] = useState('');
  const [activities, setActivities] = useState<string[]>([]);
  const [minimalPack, setMinimalPack] = useState<boolean | null>(null);
  const [exchange, setExchange] = useState<boolean | null>(null);
  const [companions, setCompanions] = useState<string[]>([]);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [customItem, setCustomItem] = useState('');
  const [customItems, setCustomItems] = useState<string[]>([]);

  const [showEditor, setShowEditor] = useState(false);
  const [editorData, setEditorData] = useState<{
    title: string;
    startDate: string;
    endDate: string;
    items: Omit<Item, 'id' | 'checked'>[];
  } | null>(null);

  const addMsg = (msg: Message) => setMessages((prev) => [...prev, msg]);

  const selectCity = (c: { cityId: number; cityName: string }) => {
    setCity(c);
    addMsg({ sender: 'user', text: c.cityName });
    addMsg({ sender: 'bot', text: '출발일과 도착일을 선택해주세요.' });
    setStep('date');
  };

  const handleDepartureSelect = (d: Date | undefined) => {
    if (!d) return;
    setDepartureDate(d);
  };
  const handleArrivalSelect = (d: Date | undefined) => {
    if (!d || !departureDate) return;
    setArrivalDate(d);
    const from = formatYMD(departureDate);
    const to = formatYMD(d);
    addMsg({ sender: 'user', text: `${from} ~ ${to}` });
    addMsg({ sender: 'bot', text: '동행인 혹은 반려동물을 선택해주세요.' });
    setStep('companion');
  };

  const selectPurpose = (opt: string) => {
    setPurpose(opt);
    addMsg({ sender: 'user', text: opt });
    addMsg({ sender: 'bot', text: '판단 유형을 선택해주세요: J(직접 입력) / P(추천)' });
    setStep('jp');
  };
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
  const selectTransport = (opt: string) => {
    setTransport(opt);
    addMsg({ sender: 'user', text: opt });
    addMsg({ sender: 'bot', text: '원하는 활동을 선택해주세요.' });
    setStep('activities');
  };
  const toggleActivity = (act: string) => {
    setActivities((prev) =>
      prev.includes(act) ? prev.filter((x) => x !== act) : [...prev, act]
    );
  };
  const finishActivities = () => {
    addMsg({ sender: 'user', text: activities.length ? activities.join(', ') : '없음' });
    addMsg({ sender: 'bot', text: '짐을 최소화하시겠습니까?' });
    setStep('minimal');
  };
  const selectMinimal = (yes: boolean) => {
    setMinimalPack(yes);
    addMsg({ sender: 'user', text: yes ? '예 (미니멀)' : '아니요' });
    addMsg({ sender: 'bot', text: '환전이 필요하신가요?' });
    setStep('exchange');
  };
  const selectExchange = (yes: boolean) => {
    setExchange(yes);
    addMsg({ sender: 'user', text: yes ? '예' : '아니요' });
    addMsg({ sender: 'bot', text: '추천 준비물을 선택해주세요.' });
    setStep('items');
  };

  const toggleCompanion = (c: string) => {
    setCompanions((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };
  const finishCompanion = () => {
    addMsg({
      sender: 'user',
      text: companions.length ? companions.join(', ') : '없음',
    });
    addMsg({ sender: 'bot', text: '여행 목적을 선택해주세요.' });
    setStep('purpose');
  };

  // 추천 훅
  const {
    recommended: apiRecommended,
    loading: recommendLoading,
    error: recommendError,
    markUserTouched,
  } = useRecommendItems({
    purpose,
    transport,
    activities,
    minimalPack,
    exchange,
    companions,
    jpType,
    step,
    jwt: localStorage.getItem('jwt') || '',
  });

  useEffect(() => {
    if (apiRecommended.length) {
      setSelectedItems((prev) => {
        // 사용자가 직접 수정한 적 없으면 덮어쓰기
        return apiRecommended;
      });
    }
  }, [apiRecommended]);

  // J custom
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

  const toggleItem = (it: string) => {
    markUserTouched(); // 사용자가 직접 건드린 걸 표시
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

  const formatYMD = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const goToEditor = () => {
    const title = `${city?.cityName || ''} ${purpose}`;
    const startDate = formatYMD(departureDate!);
    const endDate = formatYMD(arrivalDate!);
    const items =
      jpType === 'J'
        ? customItems.map((text) => ({ category: '기타', tag: '기타', text }))
        : selectedItems.map((text) => ({ category: '기타', tag: '기타', text }));
    setEditorData({ title, startDate, endDate, items });
    setShowEditor(true);
  };

  const handleSave = useCallback(
    async (data: { title: string; startDate: string; endDate: string; items: Item[] }) => {
      try {
        if (!city) throw new Error('도시를 선택해주세요.');
        if (catalogLoading) {
          alert('준비물이 로딩 중입니다. 잠시만 기다려주세요.');
          return;
        }
        const jwt = localStorage.getItem('jwt') || '';
        const userId = 1; // 실제 로그인 유저 ID
        await createChecklist({
          jwt,
          userId,
          cityId: city.cityId,
          title: data.title,
          purpose,
          travelStart: data.startDate,
          travelEnd: data.endDate,
          itemsTextList: data.items.map((it) => it.text),
        });
        alert('체크리스트 생성 완료');
        // 초기화
        setShowEditor(false);
        setStep('city');
        setPurpose('');
        setJpType('');
        setTransport('');
        setActivities([]);
        setMinimalPack(null);
        setExchange(null);
        setCompanions([]);
        setSelectedItems([]);
        setCustomItems([]);
        setCity(null);
        setDepartureDate(undefined);
        setArrivalDate(undefined);
        setMessages([{ sender: 'bot', text: '여행할 도시를 입력해주세요.' }]);
      } catch (e: any) {
        alert('생성 실패: ' + e.message);
      }
    },
    [city, purpose, createChecklist, catalogLoading]
  );

  if (showEditor && editorData) {
    return (
      <ModifyCheckList
        initialTitle={editorData.title}
        initialStartDate={editorData.startDate}
        initialEndDate={editorData.endDate}
        initialItems={editorData.items}
        onSave={handleSave}
      />
    );
  }

  const minimalSuggestions = minimalPack ? MINIMAL_ITEMS : [];
  const fallbackRecs = computeLocalRecommendations({
    purpose,
    transport,
    activities,
    minimalPack,
    exchange,
    companions,
  });

  return (
    <div className="max-w-[1320px] mx-auto">
      <h3 className="text-3xl font-bold text-center ml-[-130px] my-10">
        체크리스트 만들기
      </h3>
      <div className="w-[1000px] mx-auto p-6 bg-white rounded-xl shadow-lg">
        {/* 메시지 */}
        <div className="space-y-4 mb-6">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.sender === 'bot' ? 'justify-start' : 'justify-end'
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg whitespace-pre-wrap ${
                  m.sender === 'bot'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-red-500 text-white'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* city */}
        {step === 'city' && (
          <div className="flex flex-col gap-4">
            {citiesLoading ? (
              <div className="text-sm text-gray-600">도시 불러오는 중...</div>
            ) : citiesError ? (
              <div className="text-sm text-red-500">
                {citiesError}{' '}
                <button onClick={() => window.location.reload()}>다시 시도</button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {cities.map((c) => (
                  <button
                    key={c.cityId}
                    onClick={() => selectCity(c)}
                    aria-pressed={city?.cityId === c.cityId}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      city?.cityId === c.cityId
                        ? 'bg-red-500 text-white shadow'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {c.cityName}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* date */}
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

        {/* companion */}
        {step === 'companion' && (
          <>
            <div className="flex gap-2 flex-wrap mb-4">
              {COMPANION_OPTIONS.map((opt) => {
                const active = companions.includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => toggleCompanion(opt)}
                    className={`px-4 py-2 rounded-full border ${
                      active
                        ? 'bg-red-500 text-white border-red-500'
                        : 'bg-white text-gray-800 border border-gray-300'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-end">
              <button
                onClick={finishCompanion}
                className="bg-red-500 text-white px-6 py-2 rounded-full"
              >
                다음
              </button>
            </div>
          </>
        )}

        {/* purpose */}
        {step === 'purpose' && (
          <div className="flex gap-2 flex-wrap">
            {PURPOSE_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => selectPurpose(opt)}
                className={`px-4 py-2 rounded-full border ${
                  purpose === opt
                    ? 'bg-red-500 text-white border-red-500'
                    : 'bg-white text-gray-800 border-gray-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* jp */}
        {step === 'jp' && (
          <div className="flex gap-2">
            <button
              onClick={() => selectJp('J')}
              className="px-6 py-2 rounded-full bg-gray-800 text-white"
            >
              J
            </button>
            <button
              onClick={() => selectJp('P')}
              className="px-6 py-2 rounded-full bg-red-500 text-white"
            >
              P
            </button>
          </div>
        )}

        {/* jp-custom */}
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
              <button
                onClick={addCustom}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                추가
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {customItems.map((it) => (
                <div
                  key={it}
                  className="px-3 py-1 bg-gray-100 rounded-full flex items-center gap-2 text-sm"
                >
                  {it}
                  <button
                    onClick={() =>
                      setCustomItems((p) => p.filter((x) => x !== it))
                    }
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={finishCustom}
              className="ml-auto bg-red-500 text-white px-6 py-2 rounded-full"
            >
              완료
            </button>
          </>
        )}

        {/* transport */}
        {step === 'transport' && (
          <div className="flex gap-2">
            {TRANSPORT_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => selectTransport(opt)}
                className={`px-4 py-2 rounded-full border ${
                  transport === opt
                    ? 'bg-red-500 text-white border-red-500'
                    : 'bg-white text-gray-800 border-gray-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* activities */}
        {step === 'activities' && (
          <>
            <div className="flex flex-wrap gap-2 mb-4">
              {ACTIVITY_OPTIONS.map((act) => (
                <button
                  key={act}
                  onClick={() => toggleActivity(act)}
                  className={`px-3 py-1 rounded-full border ${
                    activities.includes(act)
                      ? 'bg-red-500 text-white border-red-500'
                      : 'bg-white text-gray-800 border-gray-300'
                  }`}
                >
                  {act}
                </button>
              ))}
            </div>
            <button
              onClick={finishActivities}
              className="ml-auto bg-red-500 text-white px-6 py-2 rounded-full"
            >
              다음
            </button>
          </>
        )}

        {/* minimal */}
        {step === 'minimal' && (
          <div className="flex gap-2">
            <button
              onClick={() => selectMinimal(true)}
              className="px-4 py-2 rounded-full bg-red-500 text-white"
            >
              예
            </button>
            <button
              onClick={() => selectMinimal(false)}
              className="px-4 py-2 rounded-full bg-gray-300 text-gray-800"
            >
              아니요
            </button>
          </div>
        )}

        {/* exchange */}
        {step === 'exchange' && (
          <div className="flex gap-2">
            <button
              onClick={() => selectExchange(true)}
              className="px-4 py-2 rounded-full bg-red-500 text-white"
            >
              예
            </button>
            <button
              onClick={() => selectExchange(false)}
              className="px-4 py-2 rounded-full bg-gray-300 text-gray-800"
            >
              아니요
            </button>
          </div>
        )}

        {/* items */}
        {step === 'items' && (
          <>
            <div className="mb-4">
              <RecommendedItems
                title="자동 추천된 준비물"
                items={apiRecommended.length ? apiRecommended : fallbackRecs}
                selected={selectedItems}
                onToggle={toggleItem}
              />
              {minimalSuggestions.length > 0 && (
                <div className="mt-2">
                  <RecommendedItems
                    title="미니멀 핵심"
                    items={minimalSuggestions}
                    selected={selectedItems}
                    onToggle={toggleItem}
                    compact
                  />
                </div>
              )}
            </div>
            {recommendError && (
              <div className="text-sm text-red-500 mb-2">
                추천 로딩 실패: {recommendError}
              </div>
            )}
            <div className="flex justify-end">
              <button
                onClick={finishItems}
                disabled={creating || recommendLoading}
                className="bg-red-500 text-white px-6 py-2 rounded-full"
              >
                {creating ? '생성 중...' : '완료'}
              </button>
            </div>
            {createError && (
              <div className="text-red-500 mt-2">{createError.message}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
