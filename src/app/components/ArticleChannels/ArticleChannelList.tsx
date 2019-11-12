import { ArticleChannelsMeta } from 'app/components/ArticleChannels/ArticleChannelsMeta';
import { GridArticleList } from 'app/components/GridArticleList';
import { FetchStatusFlag } from 'app/constants';
import { Actions } from 'app/services/articleChannel';
import { getChannelList } from 'app/services/articleChannel/selectors';
import { RidiSelectState } from 'app/store';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const ArticleChannelList: React.FunctionComponent = () => {
  const channelList = useSelector(getChannelList);
  const channelListFetchStatus = useSelector((state: RidiSelectState) => state.articleChannels.fetchStatus);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (channelListFetchStatus === FetchStatusFlag.IDLE && channelList.length === 0) {
      dispatch(Actions.loadArticleChannelListRequest());
    }
  }, []);

  return (
    <section>
      <div className="ArticlePageChannelList_Wrap">
        <ul className="ArticlePageChannelList">
          {channelList.map((channelMeta, idx) => {
              return (
                <li key={idx} className="ArticlePageChannel">
                  <ArticleChannelsMeta {...channelMeta} />
                </li>
              );
          })}
        </ul>
      </div>
    </section>
  );
};
