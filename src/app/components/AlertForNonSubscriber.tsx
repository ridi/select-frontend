import * as React from 'react';

import { RidiSelectState } from 'app/store';
import { useSelector } from 'react-redux';
import { GoToSubscribeButton } from './GoToSubscribeButton';

export const AlertForNonSubscriber: React.FunctionComponent = () => {
  const [isIgnored, setIgnoreAlert] = React.useState(false);
  const { STORE_URL } = useSelector((state: RidiSelectState) => ({ STORE_URL: state.environment.STORE_URL }));

  return isIgnored ? null : (
    <div className="AlertForNonSubscriber">
      <p className="AlertForNonSubscriber_MainText">신간도 베스트셀러도<br/>월정액으로 제한없이</p>
      <p className="AlertForNonSubscriber_SubText">1개월 무료 후 월 6,500원, 언제든 원클릭으로 해지</p>
      <GoToSubscribeButton
        className="AlertForNonSubscriber_SubscribeButton"
        onClick={() => { location.href = `${STORE_URL}/select/payments`; }}
      />
      <button
        className="AlertForNonSubscriber_CloseButton"
        type="button"
        onClick={() => setIgnoreAlert(true)}
      >
        <svg
          className="AlertForNonSubscriber_CloseButton_Icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fillRule="nonzero"
        >
          <path d="M5.636 4.222l14.142 14.142-1.414 1.414L4.222 5.636z"/>
          <path d="M18.364 4.222l1.414 1.414L5.636 19.778l-1.414-1.414z"/>
        </svg>
        <span className="a11y">닫기</span>
      </button>
    </div>
  );
};
