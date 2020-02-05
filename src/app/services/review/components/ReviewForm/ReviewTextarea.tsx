import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

export interface ReviewTextareaProps {
  content?: string;
  autoFocus: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
  onClick: (event: React.ChangeEvent<any>) => void;
  isDisabled: boolean;
}

export const ReviewTextarea: React.SFC<ReviewTextareaProps> = props => {
  const { content, onChange, autoFocus, onClick, isDisabled } = props;

  return (
    <TextareaAutosize
      className="ReviewTextarea"
      name="reviewContent"
      title="리뷰 입력"
      placeholder="리뷰 작성 시 광고 및 욕설, 비속어나 타인을 비방하는 문구를 사용하시면 비공개될 수 있습니다."
      autoFocus={autoFocus}
      onChange={onChange}
      onClick={onClick}
      value={content}
      readOnly={isDisabled}
    />
  );
};
