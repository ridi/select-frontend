import React from 'react';
import { connect } from 'react-redux';

import { HelmetWithTitle } from 'app/components';
import { ErrorContext } from 'app/components/ErrorContext';
import { MaintenanceContext } from 'app/components/MaintenanceContext';
import { ErrorStatus, FetchStatusFlag, PageTitleText } from 'app/constants';
import {
  Actions as ServiceStatusActions,
  ErrorResponseData,
  ErrorResponseStatus,
} from 'app/services/serviceStatus';
import { RidiSelectState } from 'app/store';
import { sendPostRobotInitialRendered } from 'app/utils/inAppMessageEvents';

interface ErrorPageStateProps {
  fetchStatus: FetchStatusFlag;
  responseState?: ErrorResponseStatus;
  responseData?: ErrorResponseData;
}

type Props = ErrorPageStateProps & ReturnType<typeof mapDispatchToProps>;

export class ErrorPage extends React.Component<Props> {
  private getMaintenanceData() {
    const { responseData, requestMaintenanceData } = this.props;
    if (
      !responseData ||
      responseData.status !== ErrorStatus.MAINTENANCE ||
      (responseData.period && responseData.unavailableService)
    ) {
      return;
    }
    requestMaintenanceData();
  }

  private renderErrorContent() {
    const { fetchStatus, responseState, responseData, resetErrorState } = this.props;

    if (fetchStatus === FetchStatusFlag.FETCHING) {
      return null;
    }
    return responseData && responseData.period && responseData.unavailableService ? (
      <MaintenanceContext responseData={responseData} />
    ) : (
      <ErrorContext responseState={responseState} resetErrorState={resetErrorState} />
    );
  }

  public componentDidMount() {
    sendPostRobotInitialRendered();
    this.getMaintenanceData();
  }

  public UNSAFE_componentWillUpdate() {
    this.getMaintenanceData();
  }

  public render() {
    return (
      <main className="SceneWrapper">
        <HelmetWithTitle titleName={PageTitleText.ERROR} />
        {this.renderErrorContent()}
      </main>
    );
  }
}

const mapStateToProps = (state: RidiSelectState): ErrorPageStateProps => ({
  fetchStatus: state.serviceStatus.fetchStatus,
  responseState: state.serviceStatus.errorResponseState,
  responseData: state.serviceStatus.errorResponseData,
});

const mapDispatchToProps = (dispatch: any) => ({
  resetErrorState: () => dispatch(ServiceStatusActions.resetState()),
  requestMaintenanceData: () => dispatch(ServiceStatusActions.loadMaintenanceData()),
});

export const ConnectedErrorPage = connect(mapStateToProps, mapDispatchToProps)(ErrorPage);
