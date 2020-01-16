import * as React from 'react';
import { connect } from 'react-redux';

import { RidiSelectState } from 'app/store';

interface EnvBadgeState {
  isProduction: boolean;
}

declare global {
  interface Window {
    __RIDISELECT_STAGING__?: boolean;
    __RIDISELECT_USE_PRODUCTION__?: () => void;
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const useProduction = window.__RIDISELECT_USE_PRODUCTION__ || (() => {});

export const EnvBadge: React.SFC<EnvBadgeState> = (props) => {
  if (!props.isProduction) {
    // select.ridi.io 에서 모바일 테스트를 위한 임시방편입니다..ㅠ_ㅠ
    const [test, setTest] = React.useState(0);
    React.useEffect(() => {
      if (test === 7) {
        const currentStore = window.localStorage.getItem('STORE_URL');
        if (currentStore) {
          window.localStorage.removeItem('STORE_URL');
          window.localStorage.removeItem('STORE_API');
          alert('STORE 설정을 기본 상태로 변경했습니다.');
        } else {
          window.localStorage.removeItem('STORE_URL');
          window.localStorage.removeItem('STORE_API');
          const url = window.prompt('설정하시려는 STORE_URL을 입력해주세요.', undefined);
          if (url) {
            window.localStorage.setItem('STORE_URL', url);
            window.localStorage.setItem('STORE_API', url);
            alert('STORE 설정을 개발중인 URL로 변경했습니다.');
          }
        }
        setTest(0);
      }
    });

    return <p className="DEV_environment_ribbon" onClick={(e) => setTest(test + 1)}>DEV</p>;
  } else if (window.__RIDISELECT_STAGING__) {
    return (
      <p
        className="PRE_RELEASE_environment_ribbon"
        onClick={useProduction}
      >
        PRE-RELEASE
      </p>
    );
  }
  return null;
};

const mapStateToProps = (rootState: RidiSelectState) => ({
  isProduction: rootState.environment.production,
});

export const ConnectedEnvBadge = connect(mapStateToProps)(EnvBadge);
