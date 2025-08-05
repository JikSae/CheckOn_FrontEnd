// src/data/categories.ts
export type ApiItem = {
  itemId?: number;
  itemLabel: string;
};

export type ApiCategory = {
  categoryId?: number;
  categoryLabel: string;
  items: ApiItem[];
};

export const LOCAL_CATEGORIES: ApiCategory[] = [
  {
    categoryId: 1,
    categoryLabel: '의류',
    items: [
      { itemId: 1, itemLabel: '상의' },
      { itemId: 2, itemLabel: '정장' },
      { itemId: 3, itemLabel: '구두' },
      { itemId: 4, itemLabel: '하의' },
      { itemId: 5, itemLabel: '잠옷' },
      { itemId: 6, itemLabel: '양말' },
      { itemId: 7, itemLabel: '속옷' },
      { itemId: 8, itemLabel: '선글라스' },
      { itemId: 9, itemLabel: '신발' },
      { itemId: 10, itemLabel: '외투' },
      { itemId: 11, itemLabel: '모자' },
      { itemId: 12, itemLabel: '수영복' },
      { itemId: 13, itemLabel: '스카프' },
      { itemId: 14, itemLabel: '목도리' },
      { itemId: 15, itemLabel: '트레이닝복' },
      { itemId: 16, itemLabel: '샌들/ 슬리퍼' },
      { itemId: 17, itemLabel: '히트텍' },
    ],
  },
  {
    categoryId: 2,
    categoryLabel: '필수품',
    items: [
      { itemId: 18, itemLabel: '여권' },
      { itemId: 19, itemLabel: '지갑' },
      { itemId: 20, itemLabel: 'eUSIM' },
      { itemId: 21, itemLabel: '신분증' },
      { itemId: 22, itemLabel: '원화' },
      { itemId: 23, itemLabel: '여행자 보험 증서' },
      { itemId: 24, itemLabel: '국제운전면허증' },
    ],
  },
  {
    categoryId: 3,
    categoryLabel: '출력물',
    items: [
      { itemId: 25, itemLabel: '바우처' },
      { itemId: 26, itemLabel: '비자' },
      { itemId: 27, itemLabel: '항공권 e-ticket' },
    ],
  },
  {
    categoryId: 4,
    categoryLabel: '세면 용품',
    items: [
      { itemId: 28, itemLabel: '치약' },
      { itemId: 29, itemLabel: '칫솔' },
      { itemId: 30, itemLabel: '폼클렌징' },
      { itemId: 31, itemLabel: '샴푸' },
      { itemId: 32, itemLabel: '면도기' },
      { itemId: 33, itemLabel: '바디워시' },
      { itemId: 34, itemLabel: '수건 / 타올' },
      { itemId: 35, itemLabel: '클렌징티슈' },
    ],
  },
  {
    categoryId: 5,
    categoryLabel: '화장품',
    items: [
      { itemId: 36, itemLabel: '선크림' },
      { itemId: 37, itemLabel: '스킨' },
      { itemId: 38, itemLabel: '로션' },
      { itemId: 39, itemLabel: '화장솜' },
      { itemId: 40, itemLabel: '색조 화장품' },
    ],
  },
  {
    categoryId: 6,
    categoryLabel: '비상약',
    items: [
      { itemId: 41, itemLabel: '소화제' },
      { itemId: 42, itemLabel: '알러지약' },
      { itemId: 43, itemLabel: '진통제' },
      { itemId: 44, itemLabel: '멀미약' },
      { itemId: 45, itemLabel: '반창고' },
      { itemId: 46, itemLabel: '연고' },
    ],
  },
  {
    categoryId: 7,
    categoryLabel: '전자기기',
    items: [
      { itemId: 47, itemLabel: '돼지코' },
      { itemId: 48, itemLabel: '충전기' },
      { itemId: 49, itemLabel: '멀티탭' },
      { itemId: 50, itemLabel: '보조배터리' },
      { itemId: 51, itemLabel: 'wifi도시락' },
      { itemId: 52, itemLabel: '카메라' },
      { itemId: 53, itemLabel: '노트북' },
      { itemId: 54, itemLabel: '태블릿' },
    ],
  },
  {
    categoryId: 8,
    categoryLabel: '소모품',
    items: [
      { itemId: 55, itemLabel: '모기기피제' },
      { itemId: 56, itemLabel: '지퍼백' },
      { itemId: 57, itemLabel: '물티슈' },
    ],
  },
  {
    categoryId: 9,
    categoryLabel: '애완용품',
    items: [
      { itemId: 58, itemLabel: '사료' },
      { itemId: 59, itemLabel: '간식' },
      { itemId: 60, itemLabel: '기내 이동 가방' },
      { itemId: 61, itemLabel: '소분통' },
      { itemId: 62, itemLabel: '약' },
      { itemId: 63, itemLabel: '장난감' },
      { itemId: 64, itemLabel: '목줄' },
    ],
  },
  {
    categoryId: 10,
    categoryLabel: '애기 용품',
    items: [
      { itemId: 65, itemLabel: '기저귀' },
      { itemId: 66, itemLabel: '아기 물티슈' },
      { itemId: 67, itemLabel: '젖병' },
      { itemId: 68, itemLabel: '이유식 스푼' },
      { itemId: 69, itemLabel: '유모차 접이식' },
      { itemId: 70, itemLabel: '간식' },
      { itemId: 71, itemLabel: '분유' },
      { itemId: 72, itemLabel: '장난감' },
      { itemId: 73, itemLabel: '아기띠' },
    ],
  },
  {
    categoryId: 11,
    categoryLabel: '기타',
    items: [
      { itemId: 74, itemLabel: '여분의 쇼핑백' },
      { itemId: 75, itemLabel: '업무 관련 서류' },
      { itemId: 76, itemLabel: '우산 / 우비' },
      { itemId: 77, itemLabel: '양산' },
      { itemId: 78, itemLabel: '목베개' },
      { itemId: 79, itemLabel: '셀카봉' },
      { itemId: 80, itemLabel: '동전지갑' },
      { itemId: 81, itemLabel: '렌즈' },
      { itemId: 82, itemLabel: '부채 / 선풍기' },
      { itemId: 83, itemLabel: '쿨링용품' },
      { itemId: 84, itemLabel: '안대' },
      { itemId: 85, itemLabel: '귀마개' },
      { itemId: 86, itemLabel: '비짓재팬' },
      { itemId: 87, itemLabel: '교통카드' },
    ],
  },
];
