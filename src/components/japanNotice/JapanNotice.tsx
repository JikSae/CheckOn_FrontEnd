// JapanNoticeCard.tsx
import React from 'react';

const noticeItems = [
  {
    title: '출입국 & 서류',
    bullets: [
      '여권 유효기간: 최소 6개월 이상 남도록 확인.',
      '단기 관광 비자 조건은 출발 직전에 공식 사이트에서 재확인.',
      '세관 신고 대상(고가 물품, 일정 금액 이상의 현금)은 미리 체크.',
    ],
  },
  {
    title: '문화/예절',
    bullets: [
      '신발 벗기: 료칸/전통식당 등에서는 신발을 벗어야 함.',
      '공공장소 매너: 줄 서기, 큰 소리 금지, 통화 자제.',
      '팁 문화 없음: 과도한 팁은 오히려 당황스러움.',
      '쓰레기: 공공 쓰레기통 드물고 분리수거 엄격. 쓰레기는 들고 다니는 편이 안전.',
    ],
  },
  {
    title: '교통',
    bullets: [
      'IC 카드(Suica/Pasmo) 사용 추천.',
      'JR 패스가 필요하면 사전 구매 및 활성화 방법 숙지.',
      '택시 문은 자동으로 열리고 닫히니 기사에게 손대지 말 것.',
    ],
  },
  {
    title: '환전/결제',
    bullets: [
      '현금 선호 환경: 일부 소규모 상점은 카드 미지원.',
      '시내 환전소나 은행이 공항보다 나을 수 있음.',
      '해외 카드 사용 시 출국 전에 카드사에 알림.',
    ],
  },
  {
    title: '안전 & 건강',
    bullets: [
      '치안은 좋은 편이나 소매치기 주의.',
      '응급: 경찰 110, 구급/응급 119. 간단한 일본어 표현이나 번역 앱 준비.',
      '지진 대비: 숙소 비상 안내 확인.',
      '여행자 보험 가입 권장.',
    ],
  },
  {
    title: '기타 팁',
    bullets: [
      '포켓 Wi-Fi/유심 미리 확보.',
      '오프라인 지도·번역 데이터 저장해두기.',
      '쇼핑 면세: 여권 지참, 점포별 절차 확인.',
    ],
  },
];

const JapanNoticeCard: React.FC = () => {
  return (
    <div className="max-w-full mx-auto px-6 py-4">
      <h1 className="text-xl font-bold mb-3">일본 유의사항</h1>
      <div className="border-2 border-red-500 rounded-lg p-6 h-64 overflow-y-auto bg-white/90 shadow-inner">
        {noticeItems.map((section) => (
          <div key={section.title} className="mb-4">
            <div className="font-semibold text-gray-800 mb-1">{section.title}</div>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {section.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
        <div className="text-xs text-gray-500 mt-2">
          * 출발 직전에 입국 정책/교통/영업시간 등의 최신 변경을 다시 확인하세요.
        </div>
      </div>
    </div>
  );
};

export default JapanNoticeCard;
