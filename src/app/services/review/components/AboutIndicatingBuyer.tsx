import classNames from 'classnames';
import React from 'react';

import { Icon } from '@ridi/rsg';

interface AboutIndicatingBuyerState {
  isContentOpen: boolean;
}

export class AboutIndicatingBuyer extends React.Component<{}, AboutIndicatingBuyerState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isContentOpen: false,
    };
    this.toggleContent = this.toggleContent.bind(this);
  }

  public toggleContent() {
    this.setState({
      isContentOpen: !this.state.isContentOpen,
    });
  }

  public render() {
    const { isContentOpen } = this.state;

    return (
      <div className="AboutIndicatingBuyer">
        <div className="AboutIndicatingBuyer_Header">
          <p
            className={classNames([
              'AboutIndicatingBuyer_Title',
              { pressed: isContentOpen },
            ])}
          >
            구매자 표시 기준은 무엇인가요?
            <Icon
              name="arrow_9_down"
              className={classNames([
                'AboutIndicatingBuyer_Title_Icon',
                { pressed: isContentOpen },
              ])}
            />
          </p>
          <button
            className="AboutIndicatingBuyer_ToggleButton"
            onClick={this.toggleContent}
          >
            열기/닫기 버튼
          </button>
        </div>
        {isContentOpen && (
          <div className="AboutIndicatingBuyer_DescriptionWrapper">
            <p className="AboutIndicatingBuyer_Paragraph">
              <strong>'구매자' 표시는 리디북스에서 유료도서 결제 후 다운로드 하시거나 리디셀렉트 도서를 다운로드하신 경우에만 표시됩니다.</strong>
            </p>
            <dl className="AboutIndicatingBuyer_Description_List">
              <dt className="AboutIndicatingBuyer_Description_Title">무료 도서 (프로모션 등으로 무료로 전환된 도서 포함)</dt>
              <dd className="AboutIndicatingBuyer_Description">‘구매자’로 표시되지 않습니다.</dd>

              <dt className="AboutIndicatingBuyer_Description_Title">시리즈 도서 내 무료 도서</dt>
              <dd className="AboutIndicatingBuyer_Description">
                ‘구매자’로 표시되지 않습니다.
                하지만 같은 시리즈의 유료 도서를 결제한 뒤 리뷰를 수정하거나 재등록하면 ‘구매자’로 표시됩니다.
              </dd>

              <dt className="AboutIndicatingBuyer_Description_Title">영구 삭제</dt>
              <dd className="AboutIndicatingBuyer_Description">도서를 영구 삭제해도 ‘구매자’ 표시는 남아있습니다.</dd>

              <dt className="AboutIndicatingBuyer_Description_Title">결제 취소</dt>
              <dd className="AboutIndicatingBuyer_Description">‘구매자’ 표시가 자동으로 사라집니다.</dd>
            </dl>
          </div>
        )}
      </div>
    );
  }
}
