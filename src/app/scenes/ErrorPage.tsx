import * as React from 'react';
import { connect } from 'react-redux';

import { Button } from '@ridi/rsg';

import { HelmetWithTitle } from 'app/components';
import { ConnectedCompactPageHeader } from 'app/components/CompactPageHeader';
import history from 'app/config/history';
import { PageTitleText } from 'app/constants';
import { Actions as ServiceStatusActions, errorResponseData, errorResponseStatus } from 'app/services/serviceStatus';
import { RidiSelectState } from 'app/store';

interface ErrorPageStateProps {
  responseState?: errorResponseStatus;
  responseData?: errorResponseData;
}

export class ErrorPage extends React.Component<ErrorPageStateProps & ReturnType<typeof mapDispatchToProps>> {
  private renderErrorIcon() {
    return (
      <div className="Error_Image">
        {/* tslint:disable-next-line:max-line-length */}
        <svg width="94" height="79"><g fill="none" fillRule="evenodd"><path d="M70.352 0c-10.195 0-19.4 4.418-23.348 9.937C43.048 4.418 33.844 0 23.648 0H5.885C2.627 0 .006 2.46.006 5.519v60.354C-.11 67.678 1.46 69.1 3.382 69.1c0 0 9.612-.164 14.21-.164 9.436 0 24.347 1.147 26.557 9.4h5.702c2.21-8.253 17.12-9.4 26.56-9.4 4.599 0 14.21.164 14.21.164 1.92 0 3.49-1.422 3.373-3.227V5.519c0-3.06-2.62-5.519-5.88-5.519H70.353z" fill="#E6E8EB"/><path fill="#B8BFC4" fillRule="nonzero" d="M32.674 30.736l4.308 4.308-1.938 1.938-4.308-4.308-4.308 4.308-1.938-1.938 4.308-4.308-4.308-4.308 1.938-1.938 4.308 4.308 4.308-4.308 1.938 1.938zM68.315 35.044l-1.938 1.938-4.308-4.308-4.308 4.308-1.938-1.938 4.308-4.308-4.308-4.308 1.938-1.938 4.308 4.308 4.308-4.308 1.938 1.938-4.308 4.308zM59.685 49.981v2.741h-25.37v-2.74z"/></g></svg>
      </div>
    );
  }

  private renderErrorContext(Description: React.ReactElement<any>, Buttons?: Array<React.ReactElement<any>>) {
    const { responseState } = this.props;
    return (
      <>
        <h2 className="Error_Title">
          {responseState}
        </h2>
        <p className="Error_Description">
          {Description}
        </p>
        {Buttons ? (
          <ul className="Error_ButtonWrapper">
            {Buttons.map((ButtonElement) => (
              <li className="Error_ButtonElement">
                {ButtonElement}
              </li>
            ))}
          </ul>
        ) : null}
      </>
    );
  }

  private renderBackButton() {
    return (
      <Button
        className="Error_Button WhiteButton"
        color="gray"
        outline={true}
        size="medium"
        onClick={() => {
          this.props.resetErrorState();
          history.goBack();
        }}
      >
        이전페이지
      </Button>
    );
  }

  private renderReloadButton() {
    return (
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
  }

  private renderHomeButton() {
    return (
      <Button
        className="Error_Button GrayButton"
        color="gray"
        size="medium"
        onClick={() => {
          this.props.resetErrorState();
          history.push('/');
        }}
      >
        홈으로 돌아가기
      </Button>
    );
  }

  public render() {
    const {
      responseState = 404,
      responseData,
    } = this.props;

    return (
      <main className="SceneWrapper">
        <HelmetWithTitle titleName={PageTitleText.ERROR} />
        <section className="PageError">
          {responseState !== 404 && <ConnectedCompactPageHeader />}
          {this.renderErrorIcon()}
          {responseState === 404 ?
            this.renderErrorContext((
              <>
                <strong>요청하신 페이지가 없습니다.</strong><br />
                입력하신 주소를 확인해 주세요.
              </>
            ), [
              this.renderBackButton(),
              this.renderHomeButton(),
            ])
            : responseData !== 'maintenance' ?
              this.renderErrorContext((
                <>
                  <strong>지금은 접속이 어렵습니다.</strong><br />
                  현재 오류 복구에 최선을 다하고 있으니,<br />
                  잠시 후 다시 접속해주세요.
                </>
              ), [
                this.renderReloadButton(),
                this.renderHomeButton(),
              ]) :
              this.renderErrorContext((
                <p className="Error_Description">
                  <strong>시스템 점검 안내</strong><br />
                  보다 나은 서비스를 제공해 드리기 위한 시스템 점검으로, 이용에 불편함을 드리게 된 점 양해 부탁드립니다.<br />
                  언제나 편리하고 즐겁게 리디셀렉트를 이용하실 수 있도록 최선을 다하겠습니다.<br />
                  감사합니다.
                </p>
              ))
          }
        </section>
      </main>
    );
  }
}

const mapStateToProps = (state: RidiSelectState): ErrorPageStateProps => {
  return {
    responseState: state.serviceStatus.errorResponseState,
    responseData: state.serviceStatus.errorResponseData,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    resetErrorState: () =>
      dispatch(ServiceStatusActions.resetState()),
  };
};

export const ConnectedErrorPage = connect(mapStateToProps, mapDispatchToProps)(ErrorPage);
