import styled from '@emotion/styled';
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Button, RSGButtonColor, RSGButtonSize } from 'app/components/RSG';
import * as alertSelector from 'app/services/alertForNonSubscriber/selectors';
import Colors from 'app/styles/colors';
import { resetButton } from 'app/styles/customProperties';
import CloseIcon from 'svgs/Close.svg';
import LinkIcon from 'svgs/Link.svg';
import { getIsLoggedIn } from 'app/services/user/selectors';

const Alert = {
  Wrapper: styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 0 10px calc(20px + constant(safe-area-inset-bottom)) 10px;
    padding: 0 10px calc(20px + env(safe-area-inset-bottom)) 10px;
    background: rgba(19, 32, 47, 0.9);
    box-sizing: border-box;
    text-align: center;
    box-shadow: 0 -10px 20px 0 rgba(0, 0, 0, 0.1);
    z-index: 999;
  `,
  MainText: styled.p`
    margin: 0;
    padding-top: 20px;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.4em;
    color: white;
  `,
  SubText: styled.p`
    margin: 0;
    padding-top: 10px;
    font-size: 13px;
    color: ${Colors.slategray_20};
  `,
  subscribeButton: styled(Button)`
    display: block;
    max-width: 400px;
    width: 100%;
    height: 40px;
    line-height: 38px;
    margin: 20px auto 0 auto;
    font-size: 14px;
    pointer-events: all;
  `,
  subscribeButtonIcon: styled(LinkIcon)`
    width: 17px;
    height: 17px;
    margin: -1px 0 0 5px;
    vertical-align: middle;
    fill: white;
  `,
  closeButton: styled.button`
    ${resetButton}
    position: absolute;
    width: 44px;
    height: 44px;
    top: 0;
    right: 0;
    padding: 10px;
  `,
  closeButtonIcon: styled(CloseIcon)`
    width: 24px;
    height: 24px;
    fill: ${Colors.slategray_50};
  `,
};

export const AlertForNonSubscriber: React.FunctionComponent = () => {
  const [isIgnored, setIgnoreAlert] = React.useState(false);
  const isLoggedIn = useSelector(getIsLoggedIn);
  const hasSubscribedBefore = useSelector(alertSelector.getHasSubscribedBefore);
  const isAlertVisible = useSelector(alertSelector.getAlertVisible);
  const closeAlert = () => setIgnoreAlert(true);

  return !isIgnored && isAlertVisible ? (
    <Alert.Wrapper>
      <Alert.MainText>
        베스트셀러부터!
        <br />
        프리미엄 아티클까지
      </Alert.MainText>
      <Alert.SubText>{hasSubscribedBefore ? '모두 무제한으로' : '1개월 무료'}</Alert.SubText>
      <Alert.subscribeButton
        color={RSGButtonColor.BLUE}
        size={RSGButtonSize.LARGE}
        component={Link}
        to="/intro"
      >
        {isLoggedIn && hasSubscribedBefore ? '다시 시작하기' : '무료로 시작하기'}
        <Alert.subscribeButtonIcon />
      </Alert.subscribeButton>
      <Alert.closeButton type="button" onClick={closeAlert}>
        <Alert.closeButtonIcon />
        <span className="a11y">닫기</span>
      </Alert.closeButton>
    </Alert.Wrapper>
  ) : null;
};
