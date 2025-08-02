import React from 'react'
import CheckListReview  from '../pages/CheckListReview';
import type { ChecklistItem } from '../pages/CheckListReview';

const CheckListWrapper = () => {

    const myChecklist: ChecklistItem[] = [
    { category: '교통', tag: '버스', text: '버스 카드 챙기기', checked: true },
    { category: '전자기기', tag: '충전기', text: '폰 충전기', checked: false },
    { category: '문서', tag: '여권', text: '여권 준비 완료', checked: true },
  ];

    return (
    <div className="py-8">
      <CheckListReview
        checklist={myChecklist}
        title="내 준비물 체크리스트"
        subtitle="지금까지 체크한 항목을 확인하세요."
      />
    </div>
  );
}

export default CheckListWrapper