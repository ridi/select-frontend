import classNames from 'classnames';
import React from 'react';

export interface ArticleEmptyProps {
  iconName: string;
  iconClassName?: string;
  description: string;
  renderButton?: () => JSX.Element;
}

const ProfileComponent = (props: any) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2a7.2 7.2 0 01-6-3.22c.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08a7.2 7.2 0 01-6 3.22z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
);

const DocumentComponent = (props: any) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z" />
    <path d="M0 0h24v24H0z" fill="none" />
  </svg>
);

export const ArticleEmpty: React.FunctionComponent<ArticleEmptyProps> = props => {
  const { iconName, iconClassName, description, renderButton } = props;

  return (
    <div className="ArticleEmpty_Wrapper">
      {iconName === 'profile' && (
        <ProfileComponent className={classNames('ArticleEmpty_Icon', iconClassName)} />
      )}
      {iconName === 'document' && (
        <DocumentComponent className={classNames('ArticleEmpty_Icon', iconClassName)} />
      )}
      <p className="ArticleEmpty_Description">{description}</p>
      {renderButton ? renderButton() : null}
    </div>
  );
};
