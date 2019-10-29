import { ArticleChannelsMeta } from 'app/components/ArticleChannels/ArticleChannelsMeta';
import { GridArticleList } from 'app/components/GridArticleList';
import { Actions } from 'app/services/articleChannel';
import { RidiSelectState } from 'app/store';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const ArticleChannelList: React.FunctionComponent = () => {
  const { articleChannels, articleChannelById } = useSelector((state: RidiSelectState) => state);
  const dispatch = useDispatch();

  const isFetched = () => {
    return articleChannels && articleChannels.isFetched;
  };

  React.useEffect(() => {
    if (!isFetched()) {
      dispatch(Actions.loadArticleChannelListRequest());
    }
  }, []);

  return (
    <section>
      <div className="ArticlePageChannelList_Wrap">
        <ul className="ArticlePageChannelList">
          {isFetched() && articleChannels.channelList.map((channelId, idx) => {
              const cId = Number(channelId);

              return (<li key={idx} className="ArticlePageChannel">
                <ArticleChannelsMeta {...articleChannelById[cId].channelMeta!} />
                <div className="Channel_ArticleList">
                  <GridArticleList
                    pageTitleForTracking="article-channel-list"
                    uiPartTitleForTracking="article-channel-list-articles"
                    renderAuthor={false}
                    articles={articleChannelById[cId].channelMeta!.articles!}
                  />
                </div>
              </li>);
          })}
        </ul>
      </div>
    </section>
  );
};
