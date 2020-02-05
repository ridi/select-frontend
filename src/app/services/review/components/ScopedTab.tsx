import classNames from 'classnames';
import React from 'react';

interface ScopedTabListItem {
  name: string;
  displayName: string;
  count?: number;
}

export interface ScopedTabProps {
  tabList: ScopedTabListItem[];
  selectedTabName: string;
  onClick: (itemName: string) => void;
}

export const ScopedTab: React.SFC<ScopedTabProps> = props => {
  const { tabList, selectedTabName, onClick } = props;

  return (
    <ul className="ScopedTab_List">
      {tabList.map(tabItem => (
        <li className="ScopedTab_Item" key={tabItem.name}>
          <button
            type="button"
            className={classNames([
              'ScopedTab_Item_Button',
              { active: tabItem.name === selectedTabName },
            ])}
            onClick={() => onClick(tabItem.name)}
          >
            {tabItem.displayName}
            <span className="a11y">리스트 보기</span>
            {tabItem.count ? (
              <span className="ScopedTab_Item_Count">
                {tabItem.count}
                <span className="a11y">개의 요소가 있습니다.</span>
              </span>
            ) : null}
          </button>
        </li>
      ))}
    </ul>
  );
};
