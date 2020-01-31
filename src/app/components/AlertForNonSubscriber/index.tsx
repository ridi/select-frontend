import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { GoToSubscribeButton } from 'app/components/GoToSubscribeButton';
import * as alertSelector from 'app/services/alertForNonSubscriber/selectors';
import CloseIcon from 'svgs/Close.svg';

import * as styles from './styles';

export const AlertForNonSubscriber: React.FunctionComponent = () => {
  const [isIgnored, setIgnoreAlert] = React.useState(false);
  const hasSubscribedBefore = useSelector(alertSelector.getHasSubscribedBefore);
  const isAlertVisible = useSelector(alertSelector.getAlertVisible);
  const closeAlert = () => setIgnoreAlert(true);

  return !isIgnored && isAlertVisible ? (
    <div css={styles.wrapper}>
      <p css={styles.mainText}>베스트셀러부터!<br />프리미엄 아티클까지</p>
      <p css={styles.subText}>
        {hasSubscribedBefore ? '모두 무제한으로' : '1개월 무료'}
      </p>
      <div css={styles.subscribeButton}>
        <GoToSubscribeButton
          component={Link}
          to="/intro"
        />
      </div>
      <button
        css={styles.closeButton}
        type="button"
        onClick={closeAlert}
      >
        <CloseIcon css={styles.closeButtonIcon} />
        <span className="a11y">닫기</span>
      </button>
    </div>
  ) : null;
};
