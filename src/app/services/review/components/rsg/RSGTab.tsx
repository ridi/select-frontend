import classNames from 'classnames';
import React from 'react';

interface RSGTabListItem {
  name: string;
  displayName: string;
  count?: number;
}

export interface RSGTabProps {
  tabList: RSGTabListItem[];
  selectedTabName: string;
  onClick: (itemName: string) => void;
  justify?: boolean;
}

export const RSGTab: React.SFC<RSGTabProps> = props => {
  const { tabList, selectedTabName, onClick, justify = false } = props;

  return (
    <ul className={`RSGTab_List${justify ? '-justify' : ''}`}>
      {tabList.map(tabItem => (
        <li className="RSGTab_List_Item" key={tabItem.name}>
          <button
            type="button"
            className={classNames([
              'RSGTab_List_Item_Button',
              { active: tabItem.name === selectedTabName },
            ])}
            onClick={() => onClick(tabItem.name)}
          >
            {tabItem.displayName}
            <span className="a11y">리스트 보기</span>
            {tabItem.count ? (
              <span className="RSGTab_List_Item_Count">
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
