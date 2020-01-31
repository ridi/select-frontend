import React from 'react';

interface SettingMenuItemProps {
  renderCondition?: boolean;
  linkComponent?: React.ReactType;
  children?: React.ReactNode;
  [extraKey: string]: any;
}

interface SettingMenuStateProps {
  title: string;
  icon: string;
  children?: React.ReactNode;
}

const settingMenuIcon = (icon: string) => {
  switch (icon) {
    case 'card':
      return <CardIconComponent className="SettingMenu_Icon" />;
    case 'book':
      return <BookIconComponent className="SettingMenu_Icon" />;
    case 'user':
      return <UserIconComponent className="SettingMenu_Icon" />;
    default:
      return null;
  }
};

const CardIconComponent = (props: { className: string; }) => (
  <svg width={20} height={20} {...props}>
    <path
      fill="#808991"
      d="M15.833 3.333a2.5 2.5 0 012.5 2.5v8.334a2.5 2.5 0 01-2.5 2.5H4.167a2.5 2.5 0 01-2.5-2.5V5.833a2.5 2.5 0 012.5-2.5h11.666zm.834 5H3.333v5.834c0 .46.373.833.834.833h11.666c.46 0 .834-.373.834-.833V8.333zm-8.334 1.25v2.084H5V9.583h3.333zM15.833 5H4.167a.833.833 0 00-.834.833v.833h13.334v-.833A.833.833 0 0015.833 5z"
    />
  </svg>
);

const BookIconComponent = (props: { className: string; }) => (
  <svg width={20} height={20} {...props}>
    <path
      fill="#808991"
      d="M9.167 14.731V6.25c0-.662-1.664-1.667-3.251-1.667H3.35c-.003 0-.016.013-.016.048l-.001 9.305a241.51 241.51 0 01.844-.012c.357-.005.651-.008.864-.008 1.773 0 3.224.207 4.126.815zm4.917-11.814h2.566c.938 0 1.682.772 1.682 1.714l-.001 9.582a1.32 1.32 0 01-1.336 1.396l-.226-.004a243.716 243.716 0 00-.968-.015c-.35-.004-.638-.007-.842-.007-1.846 0-3.321.364-3.442.863l-.154.637H8.637l-.154-.637c-.12-.5-1.596-.863-3.442-.863a69.913 69.913 0 00-1.262.013l-.548.01-.242.003c-.757 0-1.365-.63-1.321-1.348v-9.63c0-.942.744-1.714 1.682-1.714h2.566c1.542 0 3.143.637 4.084 1.575.94-.938 2.542-1.575 4.084-1.575zm2.582 1.714c0-.035-.013-.048-.016-.048h-2.566c-1.587 0-3.25 1.005-3.25 1.667v8.481c.901-.608 2.352-.815 4.125-.815a71.262 71.262 0 011.288.014l.419.006V4.631z"
    />
  </svg>
);

const UserIconComponent = (props: { className: string; }) => (
  <svg width={20} height={20} {...props}>
    <path
      fill="#808991"
      d="M10 10.417a4.167 4.167 0 110-8.334 4.167 4.167 0 010 8.334zm0-1.667a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm8.333 6.667v2.5H1.667v-2.5c0-2.554 4.859-4.167 8.333-4.167s8.333 1.613 8.333 4.167zm-1.666.833v-.833c0-.358-.603-.961-1.866-1.515-1.396-.611-3.245-.985-4.801-.985s-3.405.374-4.8.985c-1.264.554-1.867 1.157-1.867 1.515v.833h13.334z"
    />
  </svg>
);

export const SettingMenuItem: React.FunctionComponent<SettingMenuItemProps> = (props) => {
  const {
    renderCondition = true,
    linkComponent,
    children,
    ...extraProps
  } = props;

  const Wrapper = linkComponent || 'a';

  return renderCondition ? (
    <li className="SettingMenu_Item">
      <Wrapper className="SettingMenu_Link" {...extraProps}>
        {children}
      </Wrapper>
    </li>
  ) : null;
};

export const SettingMenu: React.FunctionComponent<SettingMenuStateProps> = ({ title, icon, children }) => children ? (
  <React.Fragment>
    <div className="SettingGroupTitle">
      {settingMenuIcon(icon)}
      {title}
    </div>
    <ul className="SettingMenu">
      {children}
    </ul>
  </React.Fragment>
) : null;
