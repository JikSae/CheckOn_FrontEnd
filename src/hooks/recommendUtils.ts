// src/hooks/recommendUtils.ts
import { LOCAL_CATEGORIES, type ApiCategory, type ApiItem } from '../data/categories'

export type RecommendInputCore = {
  purpose: string
  transport: string
  activities: string[]
  minimalPack: boolean | null
  exchange: boolean | null
  companions: string[]
}

const EXCHANGE_EXTRA = ['원화', '여권', '지갑']
const TRANSPORT_EXTRA: Record<string, string[]> = {
  '대중교통': ['교통카드'],
  '렌트': ['국제운전면허증'],
}

export function computeLocalRecommendations({
  purpose,
  transport,
  activities,
  minimalPack,
  exchange,
  companions,
}: RecommendInputCore): string[] {
  const set = new Set<string>()
  // 기본
  ;['여권', '충전기'].forEach(i => set.add(i))

  if (minimalPack) {
    ;['여권', '충전기', '선크림'].forEach(i => set.add(i))
  } else {
    if (purpose === '비즈니스') {
      ;['정장', '노트북', '업무 관련 서류'].forEach(i => set.add(i))
    } else if (purpose === '액티비티') {
      ;['트레이닝복', '모자'].forEach(i => set.add(i))
    } else if (purpose === '문화탐방' || purpose === '힐링') {
      ;['편한 신발', '물티슈'].forEach(i => set.add(i))
    } else {
      ;['여권', '충전기', '선크림'].forEach(i => set.add(i))
    }

    activities.forEach(act => {
      if (act === '등산') {
        set.add('트레이닝복')
        set.add('모자')
      }
      if (act === '바다 수영') {
        set.add('수영복')
        set.add('수건 / 타올')
      }
      if (act === '맛집 탐방') {
        set.add('물티슈')
      }
      if (act === '유적지 탐방') {
        set.add('편한 신발')
      }
    })

    if (transport && TRANSPORT_EXTRA[transport]) {
      TRANSPORT_EXTRA[transport].forEach(i => set.add(i))
    }
  }

  if (exchange) {
    EXCHANGE_EXTRA.forEach(i => set.add(i))
  }

  if (companions.includes('유아')) {
    ;['기저귀', '아기 물티슈', '젖병'].forEach(i => set.add(i))
  }
  if (companions.includes('노인')) {
    ;['편한 신발', '지팡이'].forEach(i => set.add(i))
  }
  if (companions.includes('반려 동물')) {
    ;['사료', '간식', '배변 봉투'].forEach(i => set.add(i))
  }

  return Array.from(set)
}

export interface RecommendedItem {
  categoryId?: number
  categoryLabel: string
  itemId?: number
  itemLabel: string
  
}

/**
 * computeLocalRecommendations 로 나온 itemLabel 을
 * LOCAL_CATEGORIES 에서 찾아 category / itemId 와 묶어서 반환
 */
export function mapRecommendationsToData(
  input: RecommendInputCore
): RecommendedItem[] {
  const labels = computeLocalRecommendations(input)
  const result: RecommendedItem[] = []

  labels.forEach(label => {
    const norm = label.trim().toLowerCase()
    for (const cat of LOCAL_CATEGORIES) {
      const found = cat.items.find(
        it => it.itemLabel.trim().toLowerCase() === norm
      )
      if (found) {
        result.push({
          categoryId: cat.categoryId,
          categoryLabel: cat.categoryLabel,
          itemId: found.itemId,
          itemLabel: found.itemLabel,
        })
        break
      }
    }
  })

  return result
}
