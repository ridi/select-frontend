import { Icon } from '@ridi/rsg';
import { Icons as IconsInterface } from '@ridi/rsg/svg/dist/icons';
import * as classNames from 'classnames';
import * as React from 'react';

export interface ArticleEmptyProps {
  iconName: keyof IconsInterface;
  iconClassName?: string;
  description: string;
  renderButton?: () => JSX.Element;
}

export const ArticleEmpty: React.FunctionComponent<ArticleEmptyProps> = (props) => {
  return (
    <div className="ArticleEmpty_Wrapper">
      <Icon
        name={props.iconName}
        className={classNames(
          'ArticleEmpty_Icon',
          props.iconClassName,
        )}
      />
      <p className="ArticleEmpty_Description">{props.description}</p>
      {props.renderButton ? props.renderButton() : null}
    </div>
  );
};
