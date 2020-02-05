import { Icon } from '@ridi/rsg';
import { PrimaryRoutes } from 'app/routes';
import { Actions } from 'app/services/customHistory';
import { getIsIosInApp } from 'app/services/environment/selectors';
import { RidiSelectState } from 'app/store';
import classNames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';

interface UpButtonStateProps {
  isIosInApp: boolean;
}

export const UpButton: React.SFC<UpButtonStateProps &
  ReturnType<typeof mapDispatchToProps>> = props => (
  <button type="button" className="UpButton" onClick={props.goToUpperPath}>
    <Icon name={props.isIosInApp ? 'arrow_5_left' : 'arrow_13_left'} className="UpButton_Icon" />
    {props.isIosInApp ? (
      PrimaryRoutes.includes(`/${location.pathname.split('/')[1]}`) ? (
        '홈'
      ) : (
        '뒤로'
      )
    ) : (
      <span className="a11y">뒤로 가기</span>
    )}
  </button>
);

const mapStateToProps = (rootState: RidiSelectState) => ({
  isIosInApp: getIsIosInApp(rootState),
});

const mapDispatchToProps = (dispatch: any) => ({
  goToUpperPath: () => dispatch(Actions.navigateUp()),
});

export const ConnectedUpButton = connect(mapStateToProps, mapDispatchToProps)(UpButton);
