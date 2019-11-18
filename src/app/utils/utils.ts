import { Article } from 'app/types/ridi-prosemirror-editor.d';
import { flatMap } from 'lodash-es';

import { ArticleContentJSON } from '@ridi/ridi-prosemirror-editor';
import { ArticleContent } from 'app/services/article';
import {
  authorKeys,
  AuthorKeys,
  authorKoreanNames,
  BookAuthor,
  BookAuthors,
} from 'app/services/book';
import { store } from 'app/store';
import { sendPostRobotInappLogin } from 'app/utils/inAppMessageEvents';

export const setFixedScrollToTop = (isFixed: boolean) => {
  if (isFixed) {
    document.body.classList.add('scrollFixedToTop');
  } else {
    document.body.classList.remove('scrollFixedToTop');
  }
};

export const setDisableScroll = (isDisabled: boolean) => {
  if (isDisabled) {
    document.body.classList.add('App-disableScroll');
  } else {
    document.body.classList.remove('App-disableScroll');
  }
};

export const buildAuthorString = (authors: BookAuthor[], suffix: string, authorLimitCount?: number): string => {
  if (!authors) {
    return '';
  }
  if (authorLimitCount && authors.length > authorLimitCount) {
    const expandedAuthors = authors
      .slice(0, authorLimitCount)
      .map((author) => author.name)
      .join(', ');
    return `${expandedAuthors} 외 ${authors.length - authorLimitCount}명 ${suffix}`;
  }
  return authors
    .map((author) => author.name)
    .join(', ')
    .concat(` ${suffix}`);
};

export const stringifyAuthors = (authors: BookAuthors, authorLimitCount?: number): string =>
  authorKeys
    .map((key: AuthorKeys) => buildAuthorString(authors[key], authorKoreanNames[key], authorLimitCount))
    .filter((str: string) => str.length > 0)
    .join(', ');

export function getDTOAuthorsCount(authors: BookAuthors): number {
  return flatMap(authors, (value) => value).length;
}

export function moveToLogin(additionalReturnUrl?: string) {
  const { platform, STORE_URL } = store.getState().environment;

  if (platform.isRidibooks) {
    sendPostRobotInappLogin();
    return;
  }

  const returnUrl = additionalReturnUrl ? additionalReturnUrl : window.location.href;

  window.location.replace(`${ STORE_URL }/account/oauth-authorize?fallback=login&return_url=${ returnUrl }`);
}

export function refineArticleJSON(articleJSON: ArticleContentJSON): ArticleContent {
  const articleContent: ArticleContentJSON = {
    type: articleJSON.type,
    content: [],
  };

  articleJSON.content.forEach((content: any) => {
    if (content.type === 'title') {
      return;
    }
    articleContent.content.push(content);
  });

  return {
    json: articleContent,
  };
}

export function getArticleKeyFromData(article: Article): string {
  const channelName = article.channelName;
  const contentIndex = article.contentId;

  return `@${channelName}/${contentIndex}`;
}
