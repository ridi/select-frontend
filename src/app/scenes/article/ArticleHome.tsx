import { HelmetWithTitle } from 'app/components';
import { PageTitleText } from 'app/constants';
import * as classNames from 'classnames';
import * as React from 'react';

export const ArticleHome: React.FunctionComponent = () => {

  return (
    <main
      className={classNames(
        'PageHome',
        'SceneWrapper',
        'SceneWrapper_WithGNB',
        'SceneWrapper_WithLNB',
      )}
    >
    <HelmetWithTitle titleName={PageTitleText.HOME} />
    <div className="a11y"><h1>리디셀렉트 아티클 홈</h1></div>
    </main>
  );
};
