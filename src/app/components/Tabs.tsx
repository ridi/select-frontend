import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';

export interface TabProps {
  active?: boolean;
  children?: React.ReactNode;
  component?: React.ReactType;
  className?: string;
  value?: any;
  href?: string;
  to?: string;
  onClick?: (e: React.SyntheticEvent<any>) => void;
}

export const Tab: React.SFC<TabProps> = (props) => {
  const {
    active,
    children,
    className,
    component,
    href,
    to,
  } = props;

  const Wrapper = component || 'button';
  return (
    <li className={classNames('Tab', className)}>
      <Wrapper
        className={classNames('Tab_Button', { active })}
        href={href}
        to={to}
      >
        {children}
      </Wrapper>
    </li>
  );
};

export interface TabsProps {
  className?: string;
  children?: Array<React.ReactElement<TabProps>> | React.ReactElement<TabProps>;
}

export const Tabs: React.SFC<TabsProps> = (props) => {
  const {
    children,
    className,
  } = props;

  return (
    <ul
      className={classNames(
        'Tabs',
        className,
      )}
    >
      {children}
    </ul>
  );
};
