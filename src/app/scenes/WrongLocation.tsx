import React from 'react';

import toast from 'app/utils/toast';
import history from 'app/config/history';
import { RoutePaths } from 'app/constants';

const WrongLocation: React.FunctionComponent<{ location: Location }> = props => {
  React.useEffect(() => {
    toast.failureMessage('입력하신 주소는 없는 페이지입니다.');
    history.replace(
      props.location.pathname.includes('/article') ? RoutePaths.ARTICLE_HOME : RoutePaths.HOME,
    );
  });

  return <main className="SceneWrapper" />;
};

export default WrongLocation;
