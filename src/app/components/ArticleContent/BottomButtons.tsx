import classNames from 'classnames';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Icon } from '@ridi/rsg';

import { Actions } from 'app/services/article';
import { Actions as TrackingActions } from 'app/services/tracking';
import { RidiSelectState } from 'app/store';
import { thousandsSeperator } from 'app/utils/thousandsSeperator';
import toast from 'app/utils/toast';

export const ShareSVG = (props: { className?: string; }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" className={props.className}>
    <path d="M0 0h24v24H0z" fill="none" />
    // tslint:disable-next-line:max-line-length
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
  </svg>
);

export const ArticleContentBottomButtons: React.FunctionComponent<{ contentKey: string }> = (props) => {
  const articleState = useSelector((state: RidiSelectState) => state.articlesById[props.contentKey]);
  const dispatch = useDispatch();

  if (!articleState || !articleState.article) {
    return null;
  }

  const copyUrl = () => {
    const domForCopyUrl = document.createElement('textarea');
    const locationUrl = new URL(location.href);
    locationUrl.search = '';
    locationUrl.hash = '';
    domForCopyUrl.value = locationUrl.toString();
    domForCopyUrl.className = 'a11y';
    document.body.appendChild(domForCopyUrl);
    domForCopyUrl.select();
    document.execCommand('copy');
    document.body.removeChild(domForCopyUrl);
    toast.success('아티클 링크가 복사되었습니다.');

    const trackingParams = {
      eventName: 'Share Article',
      id: articleState.article!.id,
      misc: JSON.stringify({ share_type : 'copy' }),
    };
    dispatch(TrackingActions.trackingArticleActions({trackingParams}));
  };

  return (
    <ul className="ArticleContent_ButtonsWrapper">
      <li className="ArticleContent_ButtonElement">
        <Button
          color="gray"
          size="medium"
          outline={true}
          type="button"
          className={classNames(
            'ArticleContent_Button',
            'ArticleContent_LikeButton',
            articleState.article.isFavorite && 'ArticleContent_LikeButton-active',
          )}
          onClick={() => dispatch(Actions.favoriteArticleActionRequest({
            articleId: articleState.article!.id,
            method: articleState.article!.isFavorite ? 'DELETE' : 'POST',
          }))}
        >
          <Icon
            name="heart_1"
            className="ArticleContent_LikeButton_Icon"
          />
          {typeof articleState.article.favoritesCount === 'number' ? thousandsSeperator(articleState.article.favoritesCount) : ''}
        </Button>
      </li>
      <li className="ArticleContent_ButtonElement">
        <Button
          color="gray"
          size="medium"
          outline={true}
          type="button"
          className="ArticleContent_Button ArticleContent_ShareButton"
          onClick={copyUrl}
        >
          <ShareSVG className="ArticleContent_ShareButton_Icon" />
          링크 복사하기
        </Button>
      </li>
    </ul>
  );
};
