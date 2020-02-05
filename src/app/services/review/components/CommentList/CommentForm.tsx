import { Button } from '@ridi/rsg';
import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

export interface CommentFormProps {
  bookId: number;
  reviewId: number;
  content: string;
  isSubmitting: boolean;
  onChange: (bookId: number, reviewId: number, content: string) => void;
  onSubmit: (bookId: number, reviewId: number, content: string) => void;
  checkAuth: () => boolean;
}

export const CommentForm: React.SFC<CommentFormProps> = props => {
  const { bookId, reviewId, isSubmitting, content, onChange, onSubmit, checkAuth } = props;

  return (
    <div className="CommentForm_Wrapper">
      <div className="CommentForm">
        <TextareaAutosize
          className="CommentForm_Textarea"
          name="commentContent"
          title="댓글 입력"
          placeholder="이 곳에 댓글을 남겨주세요."
          onChange={(event: React.ChangeEvent<any>) =>
            onChange(bookId, reviewId, event.target.value)
          }
          onClick={(event: React.ChangeEvent<any>) => {
            if (!checkAuth()) {
              event.preventDefault();
            }
          }}
          minRows={1}
          value={content}
        />
        <Button
          size="small"
          color="blue"
          className="CommentForm_SubmitButton"
          spinner={isSubmitting}
          disabled={!content.length || isSubmitting}
          onClick={() => onSubmit(bookId, reviewId, content)}
        >
          댓글 달기
        </Button>
      </div>
    </div>
  );
};
