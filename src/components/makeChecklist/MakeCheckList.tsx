import { useRef, useEffect, useState, useCallback } from 'react';
import ModifyCheckList, { type Item as ModifyItem } from './ModifyCheckList';
import type { Item } from './ModifyCheckList';
import { useChecklistCreator } from '../../hooks/useChecklistCreator';
import { useRecommendItems } from '../../hooks/useRecommendItems';
import { computeLocalRecommendations } from '../../hooks/recommendUtils';
import type { SelectedItem } from '../../models/selection';
import type { RawCategory } from '../../hooks/useRecommendItems';

import { Stepper } from './steps/Stepper';
import { CityStep } from './steps/CityStep';
import { DateStep } from './steps/DateStep';
import { CompanionStep } from './steps/CompanionStep';
import { PurposeStep } from './steps/PurposeStep';
import { JPorPStep } from './steps/JPorPStep';
import { TransportStep } from './steps/TransportStep';
import { ActivitiesStep } from './steps/ActivitiesStep';
import { MinimalStep } from './steps/MinimalStep';
import { ExchangeStep } from './steps/ExchangeStep';
import { ItemsStep } from './steps/ItemsStep';
import type { ApiCategory } from './steps/ItemsStep';

type Message = { sender: 'bot' | 'user'; text: string };

const PURPOSE_OPTIONS = ['힐링', '액티비티', '비즈니스', '문화탐방', '캠핑'];
const TRANSPORT_OPTIONS = ['렌트', '대중교통'];
const ACTIVITY_OPTIONS = ['등산', '바다 수영', '맛집 탐방', '유적지 탐방'];
const COMPANION_OPTIONS = ['유아', '미성년자', '노인', '반려 동물'];
const MINIMAL_ITEMS = ['여권', '충전기', '선크림'];

function formatYMD(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

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
  const addMsg = (msg: Message) =>
    setMessages((prev) => {
      if (
        prev.length &&
        prev[prev.length - 1].text === msg.text &&
        prev[prev.length - 1].sender === msg.sender
      ) {
        return prev;
      }
      return [...prev, msg];
    });

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
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [customItem, setCustomItem] = useState('');
  const [customItems, setCustomItems] = useState<string[]>([]);
  const [fallbackAnnounced, setFallbackAnnounced] = useState(false);
  const userTouchedRef = useRef(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editorData, setEditorData] = useState<{
    title: string;
    startDate: string;
    endDate: string;
    items: Omit<Item, 'id' | 'checked'>[];
  } | null>(null);

  const {
    recommended: apiRecommended,
    raw: apiRecommendedRaw,
    loading: recommendLoading,
    error: recommendError,
    markUserTouched,
  } = useRecommendItems({
    travelStart: departureDate ? formatYMD(departureDate) : '',
    travelEnd: arrivalDate ? formatYMD(arrivalDate) : '',
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

  // API 추천 덮어쓰기 (한번만, 유저 조작 없을 때)
  useEffect(() => {
    if (apiRecommended.length && !fallbackAnnounced && !userTouchedRef.current) {
      const mapped: SelectedItem[] = apiRecommended.map((label) => {
        const found = apiRecommendedRaw
          .flatMap((c) =>
            c.items.map((it) => ({
              categoryLabel: c.categoryLabel,
              itemLabel: it.itemLabel,
            }))
          )
          .find((x) => x.itemLabel.trim().toLowerCase() === label.trim().toLowerCase());
        return {
          text: label,
          category: found ? found.categoryLabel : '기타',
          source: 'api',
        };
      });
      setSelectedItems(mapped);
    }
  }, [apiRecommended, fallbackAnnounced, apiRecommendedRaw]);

  // fallback 계산
  const fallbackRecs: SelectedItem[] = computeLocalRecommendations({
    purpose,
    transport,
    activities,
    minimalPack,
    exchange,
    companions,
  }).map((text) => ({
    text,
    category: '기타',
    source: 'fallback',
  }));

  // useEffect(() => {
  //   if (recommendError && !fallbackAnnounced) {
  //     if (!userTouchedRef.current && fallbackRecs.length) {
  //       setSelectedItems(fallbackRecs);
  //     }
  //     addMsg({
  //       sender: 'bot',
  //       text: '추천 불러오기 실패, 기본 추천이 적용되었습니다.',
  //     });
  //     setFallbackAnnounced(true);
  //   }
  // }, [
  //   recommendError,
  //   fallbackRecs,
  //   fallbackAnnounced,
  //   purpose,
  //   transport,
  //   activities,
  //   minimalPack,
  //   exchange,
  //   companions,
  // ]);

  // 흐름 함수들
  const handleSelectCity = (c: { cityId: number; cityName: string }) => {
    setCity(c);
    addMsg({ sender: 'user', text: c.cityName });
    addMsg({ sender: 'bot', text: '출발일과 도착일을 선택해주세요.' });
    setStep('date');
  };

  const handleSelectDates = (dep?: Date, arr?: Date) => {
    if (dep) setDepartureDate(dep);
    if (arr && departureDate) {
      setArrivalDate(arr);
      const from = formatYMD(departureDate);
      const to = formatYMD(arr);
      addMsg({ sender: 'user', text: `${from} ~ ${to}` });
      addMsg({
        sender: 'bot',
        text: '동행인 혹은 반려동물을 선택해주세요.',
      });
      setStep('companion');
    }
  };

  const handleCompanionNext = () => {
    addMsg({
      sender: 'user',
      text: companions.length ? companions.join(', ') : '없음',
    });
    addMsg({ sender: 'bot', text: '여행 목적을 선택해주세요.' });
    setStep('purpose');
  };

  const handlePurpose = (opt: string) => {
    setPurpose(opt);
    addMsg({ sender: 'user', text: opt });
    addMsg({
      sender: 'bot',
      text: '판단 유형을 선택해주세요: J(직접 입력) / P(추천)',
    });
    setStep('jp');
  };

  const handleJp = (t: 'J' | 'P') => {
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

  const handleTransport = (opt: string) => {
    setTransport(opt);
    addMsg({ sender: 'user', text: opt });
    addMsg({ sender: 'bot', text: '원하는 활동을 선택해주세요.' });
    setStep('activities');
  };

  const handleActivitiesNext = () => {
    addMsg({
      sender: 'user',
      text: activities.length ? activities.join(', ') : '없음',
    });
    addMsg({ sender: 'bot', text: '짐을 최소화하시겠습니까?' });
    setStep('minimal');
  };

  const handleMinimal = (yes: boolean) => {
    setMinimalPack(yes);
    addMsg({ sender: 'user', text: yes ? '예 (미니멀)' : '아니요' });
    addMsg({ sender: 'bot', text: '환전이 필요하신가요?' });
    setStep('exchange');
  };

  const handleExchange = (yes: boolean) => {
    setExchange(yes);
    addMsg({ sender: 'user', text: yes ? '예' : '아니요' });
    addMsg({ sender: 'bot', text: '추천 준비물을 선택해주세요.' });
    setStep('items');
  };

  const addCustomAndFinish = () => {
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

  const toggleCompanion = (c: string) => {
    setCompanions((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  };

  const toggleActivity = (act: string) => {
    setActivities((prev) => (prev.includes(act) ? prev.filter((x) => x !== act) : [...prev, act]));
  };

  const toggleItem = (it: SelectedItem) => {
    markUserTouched();
    userTouchedRef.current = true;
    setFallbackAnnounced(false);
    setSelectedItems((prev) => {
      const exists = prev.some(
        (s) =>
          s.text.trim().toLowerCase() === it.text.trim().toLowerCase() && s.category === it.category
      );
      if (exists) {
        return prev.filter(
          (s) =>
            !(
              s.text.trim().toLowerCase() === it.text.trim().toLowerCase() &&
              s.category === it.category
            )
        );
      }
      return [...prev, it];
    });
  };

  const finishItems = () => {
    const finalSelected = selectedItems.length
      ? selectedItems
      : MINIMAL_ITEMS.map((t) => ({ text: t, category: '기타', source: 'fallback' as const }));

    addMsg({
      sender: 'user',
      text: finalSelected.map((i) => i.text).join(', '),
    });

    if (selectedItems.length === 0) {
      addMsg({
        sender: 'bot',
        text: `선택된 준비물이 없어 미니멀 기본으로 채워졌습니다: ${MINIMAL_ITEMS.join(', ')}`,
      });
    }

    const title = `${city?.cityName || ''} ${purpose}`;
    const startDate = departureDate ? formatYMD(departureDate) : '';
    const endDate = arrivalDate ? formatYMD(arrivalDate) : '';
    const items =
      jpType === 'J'
        ? customItems.map((text) => ({ category: '기타', tag: '기타', text }))
        : finalSelected.map((it) => ({ category: it.category, tag: '기타', text: it.text }));

    setEditorData({ title, startDate, endDate, items });
    setShowEditor(true);
  };

  const goToEditor = () => {
    const title = `${city?.cityName || ''} ${purpose}`;
    const startDate = departureDate ? formatYMD(departureDate) : '';
    const endDate = arrivalDate ? formatYMD(arrivalDate) : '';
    const items =
      jpType === 'J'
        ? customItems.map((text) => ({ category: '기타', tag: '기타', text }))
        : selectedItems.map((it) => ({ category: it.category, tag: '기타', text: it.text }));
    setEditorData({ title, startDate, endDate, items });
    setShowEditor(true);
  };

  const handleSave = useCallback(
    async (data: { title: string; startDate: string; endDate: string; items: ModifyItem[] }) => {
      try {
        if (!city) throw new Error('도시를 선택해주세요.');
        if (catalogLoading) {
          alert('준비물이 로딩 중입니다. 잠시만 기다려주세요.');
          return;
        }
        const jwt = localStorage.getItem('jwt') || '';
        const userId = 1;
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
        // reset
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
        setFallbackAnnounced(false);
        userTouchedRef.current = false;
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
        recommendedCategories={apiRecommendedRaw.map((c) => ({
          categoryLabel: c.categoryLabel,
          items: c.items.map((it) => ({ itemLabel: it.itemLabel })),
        }))}
      />
    );
  }

  const isFinishDisabled = Boolean(
    creating ||
      recommendLoading ||
      catalogLoading ||
      (recommendError && apiRecommended.length === 0 && selectedItems.length === 0)
  );

  return (
    <div className="max-w-[1320px] mx-auto">
      <h3 className="text-3xl font-bold text-center my-6">체크리스트 만들기</h3>
      <div className="w-full mx-auto p-6 bg-white rounded-xl shadow-lg">
        <Stepper current={step} />

        {/* 메시지 로그 */}
        <div className="space-y-4 mb-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
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

        {/* 스텝별 */}
        {step === 'city' && (
          <CityStep
            cities={cities}
            selectedCity={city}
            onSelect={handleSelectCity}
            loading={citiesLoading}
            error={citiesError}
          />
        )}

        {step === 'date' && (
          <DateStep
            departureDate={departureDate}
            arrivalDate={arrivalDate}
            onSelectDeparture={(d) => handleSelectDates(d, arrivalDate)}
            onSelectArrival={(d) => handleSelectDates(departureDate, d)}
          />
        )}

        {step === 'companion' && (
          <CompanionStep
            companions={companions}
            options={COMPANION_OPTIONS}
            toggleCompanion={toggleCompanion}
            onNext={handleCompanionNext}
          />
        )}

        {step === 'purpose' && (
          <PurposeStep purpose={purpose} options={PURPOSE_OPTIONS} onSelectPurpose={handlePurpose} />
        )}

        {step === 'jp' && <JPorPStep jpType={jpType} onSelect={handleJp} />}

        {step === 'jp-custom' && (
          <>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={customItem}
                onChange={(e) => setCustomItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomAndFinish()}
                className="flex-1 border rounded px-3 py-2 focus:outline-none"
                placeholder="직접 입력할 준비물"
              />
              <button onClick={addCustomAndFinish} className="bg-red-500 text-white px-4 py-2 rounded">
                추가
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {customItems.map((it) => (
                <div key={it} className="px-3 py-1 bg-gray-100 rounded-full flex items-center gap-2 text-sm">
                  {it}
                  <button onClick={() => setCustomItems((p) => p.filter((x) => x !== it))}>✕</button>
                </div>
              ))}
            </div>
            <button onClick={finishCustom} className="ml-auto bg-red-500 text-white px-6 py-2 rounded-full">
              완료
            </button>
          </>
        )}

        {step === 'transport' && (
          <TransportStep transport={transport} options={TRANSPORT_OPTIONS} onSelectTransport={handleTransport} />
        )}

        {step === 'activities' && (
          <ActivitiesStep activities={activities} options={ACTIVITY_OPTIONS} toggleActivity={toggleActivity} onNext={handleActivitiesNext} />
        )}

        {step === 'minimal' && (
          <MinimalStep minimalPack={minimalPack} onSelect={handleMinimal} />
        )}

        {step === 'exchange' && (
          <ExchangeStep exchange={exchange} onSelect={handleExchange} />
        )}

        {step === 'items' && (
          <ItemsStep
            categories={apiRecommendedRaw.map((c) => ({
              categoryLabel: c.categoryLabel,
              items: c.items.map((it) => ({ itemLabel: it.itemLabel })),
            } as ApiCategory))}
            selectedItems={selectedItems}
            toggleItem={toggleItem}
            finishItems={finishItems}
            isFinishDisabled={isFinishDisabled}
            minimalPack={minimalPack}
          />
        )}

        {createError && <div className="text-red-500 mt-2">{createError.message}</div>}
      </div>
    </div>
  );
}
