import { ArticleChannelsMeta } from 'app/components/ArticleChannels/ArticleChannelsMeta';
import { GridArticleList } from 'app/components/GridArticleList';
import { Actions } from 'app/services/articleChannel';
import { getPageQuery } from 'app/services/routing/selectors';
import { RidiSelectState } from 'app/store';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const ArticleChannelList: React.FunctionComponent = () => {
  const page = useSelector((state: RidiSelectState) => getPageQuery(state));
  const articleChannels = useSelector((state: RidiSelectState) => state.articleChannel);
  const dispatch = useDispatch();

  const isFetched = () => {
    return (articleChannels && articleChannels.itemListByPage[page] && articleChannels.itemListByPage[page].isFetched);
  };

  React.useEffect(() => {
    if (!isFetched()) {
      dispatch(Actions.loadArticleChannelListRequest({page}));
    }
  }, []);

  return (
    <section>
      <div className="ArticlePageChannelList_Wrap">
        <ul className="ArticlePageChannelList">
          {
            isFetched() && articleChannels.itemListByPage[page].itemList.map((data, idx) => (
              <li key={idx} className="ArticlePageChannel">
                <ArticleChannelsMeta {...data} />
                <div className="Channel_ArticleList">
                  <GridArticleList
                    pageTitleForTracking="article-channel-list"
                    uiPartTitleForTracking="article-channel-list-articles"
                    renderAuthor={false}
                    articles={data.articles.slice(0, 4)}
                  />
                </div>
              </li>
            ))
          }
        </ul>
      </div>
    </section>
  );
};
