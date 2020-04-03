import * as WebFont from 'webfontloader';

import 'css/font.css';

export const loadFonts = () => {
  WebFont.load({
    custom: {
      families: ['Minion Pro', 'review_num'],
    },
  });
};
