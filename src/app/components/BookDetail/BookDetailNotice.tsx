import * as React from 'react';

// Book Services
import { NoticeResponse } from 'app/services/book/requests';

interface Props {
  noticeList?: NoticeResponse[];
}

export const BookDetailNotice = (props: Props) => {
  const { noticeList } = props;

  if (!noticeList || !noticeList.length) {
    return null;
  }

  return (
    <>
    <h2 className="a11y">도서 운영 정보</h2>
    <ul className="PageBookDetail_NoticeList">
      {noticeList.map((noticeItem) => {
        let { content } = noticeItem;
        if (this.props.isIosInApp) {
          content = content.replace(/<a(\s[^>]*)?>.*?<\/a>/ig, '');
        }

        return (
          <li className="PageBookDetail_NoticeItem" key={noticeItem.id}>
            <p
              className="PageBookDetail_NoticeParagraph"
              dangerouslySetInnerHTML={{ __html: content.split('\n').join('<br />') }}
            />
          </li>
        );
      })}
    </ul>
  </>
  );
};
