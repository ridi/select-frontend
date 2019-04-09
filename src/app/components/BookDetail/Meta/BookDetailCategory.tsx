import * as React from 'react';

// Book Services
import { Icon } from '@ridi/rsg';
import { Category } from 'app/services/category';

interface Props {
  categories?: Category[][];
}

export const BookDetailCategory = (props: Props) => {
  const { categories } = props;

  return (
    <ul className="PageBookDetail_Categories">
      {categories &&
        categories.map((categoryGroup, key) => {
          return (
            <li className="PageBookDetail_CategoryItem" key={key}>
              {categoryGroup
                .map((category, idx) => <span key={`${category.name}${idx}`}>
                  {category.name}
                  {idx !== categoryGroup.length - 1 && <Icon name="arrow_5_right" className="PageBookDetail_CategoryArrow" />}
                </span>)
              }
            </li>
          );
        })}
    </ul>
  );
};
