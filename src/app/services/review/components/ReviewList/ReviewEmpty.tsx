import * as React from 'react';

export const ReviewListEmpty: React.SFC = () => (
  <div className="ReviewListEmpty">
    <p className="ReviewListEmpty_Paragraph">
        아직 등록된 리뷰가 없습니다.<br/>
        첫 번째 리뷰를 남겨주세요!
    </p>
  </div>
);
