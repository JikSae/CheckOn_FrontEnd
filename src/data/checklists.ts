// src/data/mockChecklists.ts
export interface ChecklistItemRes {
  checklistItemId: number;
  itemId: number;
  itemLabel: string;
  packingBag: 'HAND' | 'HOLD';
}

export interface MockChecklist {
  checklist: {
    checklistId:   number;
    title:         string;
    travelType:    string;
    travelStart:   string;
    travelEnd:     string;
    createdAt:     string;
    city:          string;
    itemRes:       ChecklistItemRes[];
  };
}
export const mockChecklists: MockChecklist[] =[
  {
    "checklist": {
      "checklistId": 1,
      "title": "도쿄 출장",
      "travelType": "BUSINESS",
      "travelStart": "2025-08-01T00:00:00.000Z",
      "travelEnd": "2025-08-03T00:00:00.000Z",
      "createdAt": "2025-07-25T10:15:30.000Z",
      "city": "도쿄",
      "itemRes": [
        { "checklistItemId": 1, "itemId": 4,  "itemLabel": "하의",    "packingBag": "HAND" },
        { "checklistItemId": 2, "itemId": 1,  "itemLabel": "상의",    "packingBag": "HOLD" },
        { "checklistItemId": 3, "itemId": 13, "itemLabel": "여권",    "packingBag": "HAND" }
      ]
    }
  },
  {
    "checklist": {
      "checklistId": 2,
      "title": "후쿠오카 휴양",
      "travelType": "RECREATION",
      "travelStart": "2025-08-05T00:00:00.000Z",
      "travelEnd": "2025-08-07T00:00:00.000Z",
      "createdAt": "2025-07-26T09:20:00.000Z",
      "city": "후쿠오카",
      "itemRes": [
        { "checklistItemId": 4, "itemId": 7,  "itemLabel": "속옷",    "packingBag": "HAND" },
        { "checklistItemId": 5, "itemId": 10, "itemLabel": "충전기",  "packingBag": "HAND" },
        { "checklistItemId": 6, "itemId": 20, "itemLabel": "선글라스","packingBag": "HOLD" }
      ]
    }
  },
  {
    "checklist": {
      "checklistId": 3,
      "title": "교토 문화탐방",
      "travelType": "EXPLORATION",
      "travelStart": "2025-08-10T00:00:00.000Z",
      "travelEnd": "2025-08-12T00:00:00.000Z",
      "createdAt": "2025-07-27T14:45:10.000Z",
      "city": "교토",
      "itemRes": [
        { "checklistItemId": 7,  "itemId": 1,  "itemLabel": "상의",    "packingBag": "HAND" },
        { "checklistItemId": 8,  "itemId": 14, "itemLabel": "모자",    "packingBag": "HAND" },
        { "checklistItemId": 9,  "itemId": 9,  "itemLabel": "신발",    "packingBag": "HOLD" }
      ]
    }
  },
  {
    "checklist": {
      "checklistId": 4,
      "title": "삿포로 겨울캠핑",
      "travelType": "CAMPING",
      "travelStart": "2025-12-15T00:00:00.000Z",
      "travelEnd": "2025-12-18T00:00:00.000Z",
      "createdAt": "2025-11-30T11:00:00.000Z",
      "city": "삿포로",
      "itemRes": [
        { "checklistItemId": 10, "itemId": 22, "itemLabel": "텐트",    "packingBag": "HOLD" },
        { "checklistItemId": 11, "itemId": 23, "itemLabel": "침낭",    "packingBag": "HOLD" },
        { "checklistItemId": 12, "itemId": 7,  "itemLabel": "속옷",    "packingBag": "HAND" }
      ]
    }
  },
  {
    "checklist": {
      "checklistId": 5,
      "title": "나고야 액티비티",
      "travelType": "ACTIVITY",
      "travelStart": "2025-09-01T00:00:00.000Z",
      "travelEnd": "2025-09-03T00:00:00.000Z",
      "createdAt": "2025-08-20T08:30:00.000Z",
      "city": "나고야",
      "itemRes": [
        { "checklistItemId": 13, "itemId": 15, "itemLabel": "카메라",  "packingBag": "HAND" },
        { "checklistItemId": 14, "itemId": 4,  "itemLabel": "하의",    "packingBag": "HAND" }
      ]
    }
  },
  {
    "checklist": {
      "checklistId": 6,
      "title": "하코네 온천여행",
      "travelType": "RELAX",
      "travelStart": "2025-10-10T00:00:00.000Z",
      "travelEnd": "2025-10-12T00:00:00.000Z",
      "createdAt": "2025-09-25T17:00:00.000Z",
      "city": "하코네",
      "itemRes": [
        { "checklistItemId": 15, "itemId": 2,  "itemLabel": "잠옷",    "packingBag": "HAND" },
        { "checklistItemId": 16, "itemId": 20, "itemLabel": "선글라스","packingBag": "HAND" },
        { "checklistItemId": 17, "itemId": 10, "itemLabel": "충전기",  "packingBag": "HAND" }
      ]
    }
  },
  {
    "checklist": {
      "checklistId": 7,
      "title": "히로시마 역사탐방",
      "travelType": "EXPLORATION",
      "travelStart": "2025-11-05T00:00:00.000Z",
      "travelEnd": "2025-11-07T00:00:00.000Z",
      "createdAt": "2025-10-28T12:45:00.000Z",
      "city": "히로시마",
      "itemRes": [
        { "checklistItemId": 18, "itemId": 1,  "itemLabel": "상의",    "packingBag": "HAND" },
        { "checklistItemId": 19, "itemId": 14, "itemLabel": "모자",    "packingBag": "HAND" }
      ]
    }
  },
  {
    "checklist": {
      "checklistId": 8,
      "title": "오키나와 해변캠핑",
      "travelType": "CAMPING",
      "travelStart": "2025-07-20T00:00:00.000Z",
      "travelEnd": "2025-07-23T00:00:00.000Z",
      "createdAt": "2025-07-10T09:00:00.000Z",
      "city": "오키나와",
      "itemRes": [
        { "checklistItemId": 20, "itemId": 19, "itemLabel": "수영복",  "packingBag": "HAND" },
        { "checklistItemId": 21, "itemId": 7,  "itemLabel": "속옷",    "packingBag": "HAND" },
        { "checklistItemId": 22, "itemId": 23, "itemLabel": "침낭",    "packingBag": "HOLD" }
      ]
    }
  },
  {
    "checklist": {
      "checklistId": 9,
      "title": "나가사키 미식여행",
      "travelType": "ACTIVITY",
      "travelStart": "2025-09-15T00:00:00.000Z",
      "travelEnd": "2025-09-17T00:00:00.000Z",
      "createdAt": "2025-09-05T14:10:00.000Z",
      "city": "나가사키",
      "itemRes": [
        { "checklistItemId": 23, "itemId": 26, "itemLabel": "카메라",  "packingBag": "HAND" },
        { "checklistItemId": 24, "itemId": 4,  "itemLabel": "하의",    "packingBag": "HAND" }
      ]
    }
  },
  {
    "checklist": {
      "checklistId": 10,
      "title": "요코하마 가족여행",
      "travelType": "RECREATION",
      "travelStart": "2025-12-20T00:00:00.000Z",
      "travelEnd": "2025-12-24T00:00:00.000Z",
      "createdAt": "2025-12-01T11:30:00.000Z",
      "city": "요코하마",
      "itemRes": [
        { "checklistItemId": 25, "itemId": 1,  "itemLabel": "상의",    "packingBag": "HAND" },
        { "checklistItemId": 26, "itemId": 9,  "itemLabel": "신발",    "packingBag": "HOLD" },
        { "checklistItemId": 27, "itemId": 13, "itemLabel": "여권",    "packingBag": "HAND" }
      ]
    }
  }
]