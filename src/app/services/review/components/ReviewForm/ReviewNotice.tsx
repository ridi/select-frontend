import React from 'react';

export interface ReviewNoticeProps {
  content?: string;
  minRows?: number;
}

export const ReviewNotice: React.SFC<ReviewNoticeProps> = (props) => {
  const { content, minRows } = props;

  return (
    <div className="ReviewForm_Notice">
      <p className="ReviewForm_Notice_P">
        건전한 리뷰 정착 및 양질의 리뷰를 위해 아래 해당하는 리뷰는 비공개 조치될 수 있음을 안내드립니다.
      </p>
      <ol className="ReviewForm_Notice_List">
        <li className="ReviewForm_Notice_List_Item">타인에게 불쾌감을 주는 욕설</li>
        <li className="ReviewForm_Notice_List_Item">비속어나 타인을 비방하는 내용</li>
        <li className="ReviewForm_Notice_List_Item">특정 종교, 민족, 계층을 비방하는 내용</li>
        <li className="ReviewForm_Notice_List_Item">해당 도서의 줄거리나 리디북스 서비스 이용과 관련이 없는 내용</li>
        <li className="ReviewForm_Notice_List_Item">의미를 알 수 없는 내용</li>
        <li className="ReviewForm_Notice_List_Item">광고 및 반복적인 글을 게시하여 서비스 품질을 떨어트리는 내용</li>
        <li className="ReviewForm_Notice_List_Item">저작권상 문제의 소지가 있는 내용</li>
        <li className="ReviewForm_Notice_List_Item">다른 리뷰에 대한 반박이나 논쟁을 유발하는 내용</li>
        <li className="ReviewForm_Notice_List_Item-extra">* 결말을 예상할 수 있는 리뷰는 자제하여 주시기 바랍니다.</li>
      </ol>
      <p className="ReviewForm_Notice_P">
        이 외에도 건전한 리뷰 문화 형성을 위한 운영 목적과 취지에 맞지 않는 내용은 담당자에 의해 리뷰가 비공개 처리가 될 수 있습니다.
      </p>
    </div>
  );
};
