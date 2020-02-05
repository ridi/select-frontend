import classNames from 'classnames';
import React from 'react';

export interface PipeDelimitedListItem {
  type: string;
}

export interface PipeDelimitedListMenuProps {
  list: PipeDelimitedListItem[];
  activeItemType: string;
  children: (item: PipeDelimitedListItem) => JSX.Element;
}

export const PipeDelimitedListMenu: React.SFC<PipeDelimitedListMenuProps> = props => {
  const { list, activeItemType } = props;

  return (
    <ul className="PipeDelimitedList">
      {list.map(item => (
        <li
          key={item.type}
          className={classNames([
            'PipeDelimitedList_Item',
            { active: item.type === activeItemType },
          ])}
        >
          {props.children(item)}
        </li>
      ))}
    </ul>
  );
};
