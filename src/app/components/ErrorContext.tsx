import React from 'react';

import { Button } from '@ridi/rsg';

import { ConnectedCompactPageHeader } from 'app/components/CompactPageHeader';
import history from 'app/config/history';
import { ErrorResponseStatus } from 'app/services/serviceStatus';

interface ErrorContextProps {
  responseState?: ErrorResponseStatus;
  resetErrorState: () => {};
}

export const ErrorContext: React.FunctionComponent<ErrorContextProps> = (props) => {
  const { responseState } = props;
  const ErrorDescription = responseState === 404 ? (
    <>
      <strong>요청하신 페이지가 없습니다.</strong><br />
      입력하신 주소를 확인해 주세요.
    </>
  ) : (
    <>
      <strong>지금은 접속이 어렵습니다.</strong><br />
      현재 오류 복구에 최선을 다하고 있으니,<br />
      잠시 후 다시 접속해주세요.
    </>
  );

  const ErrorPrimaryButton = responseState === 404 ? (
    <Button
      className="Error_Button WhiteButton"
      color="gray"
      outline={true}
      size="medium"
      onClick={() => {
        props.resetErrorState();
        history.goBack();
      }}
    >
      이전페이지
    </Button>
  ) : (
    <Button
      className="Error_Button WhiteButton"
      color="gray"
      outline={true}
      size="medium"
      onClick={() => location.reload()}
    >
      다시 시도
    </Button>
  );

  const ErrorSecondaryButton = (
    <Button
      className="Error_Button GrayButton"
      color="gray"
      size="medium"
      onClick={() => {
        props.resetErrorState();
        history.push('/');
      }}
    >
      홈으로 돌아가기
    </Button>
  );

  return (
    <section className="PageError">
      {responseState !== 404 && <ConnectedCompactPageHeader />}
      <div className="Error_Image">
        {/* tslint:disable-next-line:max-line-length */}
        <svg width="94" height="79"><g fill="none" fillRule="evenodd"><path d="M70.352 0c-10.195 0-19.4 4.418-23.348 9.937C43.048 4.418 33.844 0 23.648 0H5.885C2.627 0 .006 2.46.006 5.519v60.354C-.11 67.678 1.46 69.1 3.382 69.1c0 0 9.612-.164 14.21-.164 9.436 0 24.347 1.147 26.557 9.4h5.702c2.21-8.253 17.12-9.4 26.56-9.4 4.599 0 14.21.164 14.21.164 1.92 0 3.49-1.422 3.373-3.227V5.519c0-3.06-2.62-5.519-5.88-5.519H70.353z" fill="#E6E8EB"/><path fill="#B8BFC4" fillRule="nonzero" d="M32.674 30.736l4.308 4.308-1.938 1.938-4.308-4.308-4.308 4.308-1.938-1.938 4.308-4.308-4.308-4.308 1.938-1.938 4.308 4.308 4.308-4.308 1.938 1.938zM68.315 35.044l-1.938 1.938-4.308-4.308-4.308 4.308-1.938-1.938 4.308-4.308-4.308-4.308 1.938-1.938 4.308 4.308 4.308-4.308 1.938 1.938-4.308 4.308zM59.685 49.981v2.741h-25.37v-2.74z"/></g></svg>
      </div>
      <h2 className="Error_Title">
        {responseState}
      </h2>
      <p className="Error_Description">
        {ErrorDescription}
      </p>
      <ul className="Error_ButtonWrapper">
        <li className="Error_ButtonElement">{ErrorPrimaryButton}</li>
        <li className="Error_ButtonElement">{ErrorSecondaryButton}</li>
      </ul>
    </section>
  );
};
