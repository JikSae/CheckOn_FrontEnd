// src/components/makeChecklist/MakeCheckList.tsx
import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import ModifyCheckList, { type Item as ModifyItem } from './ModifyCheckList'
import type { Item } from './ModifyCheckList'
import { useChecklistCreator } from '../../hooks/useChecklistCreator'
import { useRecommendItems } from '../../hooks/useRecommendItems'
import {
  computeLocalRecommendations,
  mapRecommendationsToData,
  type RecommendInputCore,
  type RecommendedItem
} from '../../hooks/recommendUtils'
import { LOCAL_CATEGORIES } from '../../data/categories'
import { Stepper } from './steps/Stepper'
import { CityStep } from './steps/CityStep'
import { DateStep } from './steps/DateStep'
import { CompanionStep } from './steps/CompanionStep'
import { PurposeStep } from './steps/PurposeStep'
import { JPorPStep } from './steps/JPorPStep'
import { TransportStep } from './steps/TransportStep'
import { ActivitiesStep } from './steps/ActivitiesStep'
import { MinimalStep } from './steps/MinimalStep'
import { ExchangeStep } from './steps/ExchangeStep'
import { ItemsStep } from './steps/ItemsStep'
import type { ApiCategory } from './steps/ItemsStep'

type Message = { sender: 'bot' | 'user'; text: string }
type SelectedItem = { text: string; category: string; source: 'api' | 'fallback' }

const PURPOSE_OPTIONS = ['힐링','액티비티','비즈니스','문화탐방','캠핑']
const TRANSPORT_OPTIONS = ['렌트','대중교통']
const ACTIVITY_OPTIONS = ['등산','바다 수영','맛집 탐방','유적지 탐방']
const COMPANION_OPTIONS = ['유아','미성년자','노인','반려 동물']
const MINIMAL_ITEMS = ['여권','충전기','선크림']

function formatYMD(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

export default function MakeCheckList() {
  const navigate = useNavigate()

  // 1. 챗봇 상태 및 메시지
  const [step, setStep] = useState<
    | 'city' | 'date' | 'companion' | 'purpose' | 'jp' | 'jp-custom'
    | 'transport' | 'activities' | 'minimal' | 'exchange' | 'items' | 'done'
  >('city')
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: '여행할 도시를 입력해주세요.' }
  ])
  const addMsg = (m: Message) =>
    setMessages(prev => {
      if (
        prev.length &&
        prev[prev.length - 1].text === m.text &&
        prev[prev.length - 1].sender === m.sender
      ) {
        return prev
      }
      return [...prev, m]
    })

  // 2. 체크리스트 생성 훅
  const {
    cities,
    citiesLoading,
    citiesError,
    catalogLoading,
    createChecklist,
    creating,
    createError,
  } = useChecklistCreator()

  // 3. 사용자 선택 값
  const [city, setCity] = useState<{ cityId: number; cityName: string } | null>(null)
  const [departureDate, setDepartureDate] = useState<Date>()
  const [arrivalDate, setArrivalDate] = useState<Date>()
  const [purpose, setPurpose] = useState('')
  const [jpType, setJpType] = useState<'J' | 'P' | ''>('')
  const [transport, setTransport] = useState('')
  const [activities, setActivities] = useState<string[]>([])
  const [minimalPack, setMinimalPack] = useState<boolean | null>(null)
  const [exchange, setExchange] = useState<boolean | null>(null)
  const [companions, setCompanions] = useState<string[]>([])
  const userTouchedRef = useRef(false)
  const [fallbackAnnounced, setFallbackAnnounced] = useState(false)

  // 4. 추천된 아이템 상태
  const [selectedItems, setSelectedItems] = useState<RecommendedItem[]>([])
  const [customItem, setCustomItem] = useState('')
  const [customItems, setCustomItems] = useState<string[]>([])

  // 5. editor 모드 전환용 state
  const [showEditor, setShowEditor] = useState(false)
  const [editorData, setEditorData] = useState<{
    title: string
    startDate: string
    endDate: string
    items: Omit<Item, 'id' | 'checked'>[]
  } | null>(null)

  // 6. API 추천 훅
  const {
    recommended: apiRecommended,
    raw: apiRecommendedRaw,
    loading: recommendLoading,
    error: recommendError,
    markUserTouched
  } = useRecommendItems({
    travelStart: departureDate ? formatYMD(departureDate) : '',
    travelEnd: arrivalDate ? formatYMD(arrivalDate) : '',
    purpose, transport, activities, minimalPack, exchange, companions, jpType, step,
    jwt: localStorage.getItem('jwt') || ''
  })

  // 7. API 추천 → selectedItems 세팅
  useEffect(() => {
    if (apiRecommended.length && !fallbackAnnounced && !userTouchedRef.current) {
      const mapped = mapRecommendationsToData({ purpose, transport, activities, minimalPack, exchange, companions })
      setSelectedItems(mapped.map(it => ({ ...it, source: 'api' })))
    }
  }, [
    apiRecommended, fallbackAnnounced, apiRecommendedRaw,
    purpose, transport, activities, minimalPack, exchange, companions
  ])

  // 8. 로컬 fallback 추천
  const fallbackRecs = computeLocalRecommendations({ purpose, transport, activities, minimalPack, exchange, companions })
    .map(text => ({ categoryLabel: '기타', itemLabel: text, source: 'fallback' }))

  // 9. 추천 토글
  const toggleItem = (it: RecommendedItem) => {
    markUserTouched()
    userTouchedRef.current = true
    setFallbackAnnounced(false)
    setSelectedItems(prev => {
      const exists = prev.some(x => x.itemLabel === it.itemLabel && x.categoryLabel === it.categoryLabel)
      if (exists) return prev.filter(x => !(x.itemLabel === it.itemLabel && x.categoryLabel === it.categoryLabel))
      return [...prev, it]
    })
  }

  // 10. 스텝 핸들러들 (생략 없이 동일하게)
  const handleSelectCity = (c: { cityId: number; cityName: string }) => {
    setCity(c)
    addMsg({ sender: 'user', text: c.cityName })
    addMsg({ sender: 'bot', text: '출발/도착일을 선택해주세요.' })
    setStep('date')
  }
  const handleSelectDates = (d1?: Date, d2?: Date) => {
    if (d1) setDepartureDate(d1)
    if (d2 && departureDate) {
      setArrivalDate(d2)
      addMsg({ sender: 'user', text: `${formatYMD(departureDate)} ~ ${formatYMD(d2)}` })
      addMsg({ sender: 'bot', text: '동행인을 선택해주세요.' })
      setStep('companion')
    }
  }
  const handleCompanionNext = () => {
    addMsg({ sender: 'user', text: companions.length ? companions.join(', ') : '없음' })
    addMsg({ sender: 'bot', text: '여행 목적을 선택해주세요.' })
    setStep('purpose')
  }
  const handlePurpose = (opt: string) => {
    setPurpose(opt)
    addMsg({ sender: 'user', text: opt })
    addMsg({ sender: 'bot', text: 'J(직접) 또는 P(추천)을 선택하세요.' })
    setStep('jp')
  }
  const handleJp = (t: 'J' | 'P') => {
    setJpType(t)
    addMsg({ sender: 'user', text: t })
    if (t === 'J') {
      addMsg({ sender: 'bot', text: '직접 입력 준비물을 적어주세요.' })
      setStep('jp-custom')
    } else {
      addMsg({ sender: 'bot', text: '교통수단을 선택해주세요.' })
      setStep('transport')
    }
  }
  const handleTransport = (opt: string) => {
    setTransport(opt)
    addMsg({ sender: 'user', text: opt })
    addMsg({ sender: 'bot', text: '활동을 선택해주세요.' })
    setStep('activities')
  }
  const handleActivitiesNext = () => {
    addMsg({ sender: 'user', text: activities.join(', ') || '없음' })
    addMsg({ sender: 'bot', text: '짐을 최소화하시겠습니까?' })
    setStep('minimal')
  }
  const handleMinimal = (yes: boolean) => {
    setMinimalPack(yes)
    addMsg({ sender: 'user', text: yes ? '예' : '아니요' })
    addMsg({ sender: 'bot', text: '환전이 필요하신가요?' })
    setStep('exchange')
  }
  const handleExchange = (yes: boolean) => {
    setExchange(yes)
    addMsg({ sender: 'user', text: yes ? '예' : '아니요' })
    addMsg({ sender: 'bot', text: '추천 준비물을 선택해주세요.' })
    setStep('items')
  }
  const addCustomAndFinish = () => {
    if (!customItem.trim()) return
    setCustomItems(p => [...p, customItem.trim()])
    setCustomItem('')
  }
  const finishCustom = () => {
    addMsg({ sender: 'user', text: customItems.join(', ') || '없음' })
    goToEditor()
  }
  const toggleCompanion = (c: string) => setCompanions(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c])
  const toggleActivity = (a: string) => setActivities(p => p.includes(a) ? p.filter(x => x !== a) : [...p, a])

  // 11. 최종 finishItems → editorData 생성
  const finishItems = () => {
    const final = selectedItems.length > 0
      ? selectedItems
      : MINIMAL_ITEMS.map(t => ({ categoryLabel: '기타', itemLabel: t, source: 'fallback' }))
    addMsg({ sender: 'user', text: final.map(x => x.itemLabel).join(', ') })
    if (selectedItems.length === 0) {
      addMsg({ sender: 'bot', text: `기본 추천 적용: ${MINIMAL_ITEMS.join(', ')}` })
    }
    const title = `${city?.cityName || ''} ${purpose}`
    const s = departureDate ? formatYMD(departureDate) : ''
    const e = arrivalDate ? formatYMD(arrivalDate) : ''
    const itemsArr = jpType === 'J'
      ? customItems.map(t => ({ category: '기타', tag: '기타', text: t }))
      : final.map(x => ({ category: x.categoryLabel, tag: '기타', text: x.itemLabel }))
    setEditorData({ title, startDate: s, endDate: e, items: itemsArr })
    setShowEditor(true)
  }
  const goToEditor = () => finishItems()

  // 12. ***handleSave*** (여기에 넣었습니다)
  const handleSave = useCallback(
    async (data: {
      title: string
      startDate: string
      endDate: string
      items: ModifyItem[]
    }) => {
      if (!city) {
        alert('도시를 선택해주세요.')
        return
      }
      if (catalogLoading) {
        alert('준비물이 로딩 중입니다.')
        return
      }

      // 1) selectedItems → API 스펙 items 배열 생성
      const payloadItems = selectedItems.map(sel => {
        for (const cat of LOCAL_CATEGORIES) {
          const found = cat.items.find(it => it.itemLabel === sel.itemLabel)
          if (found && found.itemId != null) {
            return {
              itemId: found.itemId,
              packingBag: 'HAND' as const,
            }
          }
        }
        return { itemId: null, packingBag: 'HAND' as const }
      })

      // 2) 전체 페이로드
      const payload = {
        userId: 1,
        title: data.title,
        cityId: city.cityId,
        travelType: 'ACTIVITY',
        travelStart: `${data.startDate}T00:00:00.000Z`,
        travelEnd: `${data.endDate}T00:00:00.000Z`,
        items: payloadItems,
      }

    console.log('▶️ payloadItems:', payloadItems)
    console.log('▶️ payload 전체:', payload)

      try {
        await fetch('http://localhost:4000/my/checklists', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
          body: JSON.stringify(payload),
        })
        alert('체크리스트 생성 완료')
        navigate('/mypage')
      } catch (err: any) {
        alert('생성 실패: ' + err.message)
      }
    },
    [city, catalogLoading, selectedItems, navigate]
  )

  // 13. editor 모드 렌더링
  if (showEditor && editorData) {
    const cats: ApiCategory[] = apiRecommendedRaw.length > 0
      ? apiRecommendedRaw.map(c => ({
          categoryLabel: c.categoryLabel,
          items: c.items.map(i => ({ itemLabel: i.itemLabel }))
        }))
      : LOCAL_CATEGORIES

    return (
      <ModifyCheckList
        initialTitle={editorData.title}
        initialStartDate={editorData.startDate}
        initialEndDate={editorData.endDate}
        initialItems={editorData.items}
        onSave={handleSave}
        recommendedCategories={cats}
      />
    )
  }

  const isFinishDisabled = Boolean(
    creating ||
    recommendLoading ||
    catalogLoading ||
    (recommendError && apiRecommended.length === 0 && selectedItems.length === 0)
  )

  // ItemsStep에 넘길 SelectedItem[]
  const itemsForStep: SelectedItem[] = selectedItems.map(x => ({
    text: x.itemLabel,
    category: x.categoryLabel,
    source: x.source
  }))

  // 14. 일반 모드 UI 반환
  return (
    <div className="max-w-4xl mx-auto my-8">
      <h3 className="text-3xl font-bold text-center mb-6">체크리스트 만들기</h3>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <Stepper current={step} />

        {/* 메시지 로그 */}
        <div className="space-y-4 mb-6">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.sender === 'bot' ? 'justify-start' : 'justify-end'} `}
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

        {/* 스텝별 UI */}
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
            onSelectDeparture={d => handleSelectDates(d, arrivalDate)}
            onSelectArrival={d => handleSelectDates(departureDate, d)}
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
          <PurposeStep
            purpose={purpose}
            options={PURPOSE_OPTIONS}
            onSelectPurpose={handlePurpose}
          />
        )}
        {step === 'jp' && <JPorPStep jpType={jpType} onSelect={handleJp} />}
        {step === 'jp-custom' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                className="flex-1 border rounded px-3 py-2"
                placeholder="직접 입력할 준비물"
                value={customItem}
                onChange={e => setCustomItem(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustomAndFinish()}
              />
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={addCustomAndFinish}
              >
                추가
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {customItems.map(it => (
                <div
                  key={it}
                  className="px-3 py-1 bg-gray-100 rounded-full flex items-center gap-2"
                >
                  {it} <button onClick={() => setCustomItems(p => p.filter(x => x !== it))}>✕</button>
                </div>
              ))}
            </div>
            <button
              className="bg-red-500 text-white px-6 py-2 rounded-full ml-auto block"
              onClick={finishCustom}
            >
              완료
            </button>
          </div>
        )}
        {step === 'transport' && (
          <TransportStep
            transport={transport}
            options={TRANSPORT_OPTIONS}
            onSelectTransport={handleTransport}
          />
        )}
        {step === 'activities' && (
          <ActivitiesStep
            activities={activities}
            options={ACTIVITY_OPTIONS}
            toggleActivity={toggleActivity}
            onNext={handleActivitiesNext}
          />
        )}
        {step === 'minimal' && (
          <MinimalStep minimalPack={minimalPack} onSelect={handleMinimal} />
        )}
        {step === 'exchange' && (
          <ExchangeStep exchange={exchange} onSelect={handleExchange} />
        )}
        {step === 'items' && (
          <ItemsStep
            categories={
              apiRecommendedRaw.length > 0
                ? apiRecommendedRaw.map(c => ({
                    categoryLabel: c.categoryLabel,
                    items: c.items.map(i => ({ itemLabel: i.itemLabel }))
                  }))
                : LOCAL_CATEGORIES
            }
            selectedItems={itemsForStep}
            toggleItem={si => toggleItem({ categoryLabel: si.category, itemLabel: si.text, source: si.source })}
            finishItems={finishItems}
            isFinishDisabled={isFinishDisabled}
            minimalPack={!!minimalPack}
          />
        )}

        {createError && (
          <div className="text-red-500 mt-4">{createError.message}</div>
        )}
      </div>
    </div>
  )
}
