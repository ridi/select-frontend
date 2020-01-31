import React from 'react';
import { Link } from 'react-router-dom';

import { InstantSearchResultArticle, InstantSearchResultBook } from 'app/components/Search';
import { FetchStatusFlag } from 'app/constants';
import { getAuthorsCount, getSortedAuthorsHtmlString } from 'app/utils/search';
import { articleContentToPath } from 'app/utils/toPath';

interface InstantSearchProps {
  keyword: string;
  isActive: boolean;
  fetchStatus: FetchStatusFlag;
  searchType: string;
  instantSearchList: InstantSearchResultBook[] | InstantSearchResultArticle[];
  highlightIndex: number;
  updateHighlight: (idx: number) => void;
  onSearchItemClick: (item: InstantSearchResultBook | InstantSearchResultArticle) => void;
}

export class InstantSearch extends React.PureComponent<InstantSearchProps> {
  public render() {
    const {
      keyword,
      isActive,
      fetchStatus,
      searchType,
      instantSearchList,
      highlightIndex,
      updateHighlight,
      onSearchItemClick,
    } = this.props;

    if (
      !isActive ||
      (fetchStatus === FetchStatusFlag.IDLE && !instantSearchList)
    ) {
      return null;
    }

    return (
      <div className="InstantSearchWrapper">
        {fetchStatus === FetchStatusFlag.FETCHING ? null : (
          <ul className="InstantSearchList">
            {instantSearchList ? (
              searchType === 'Books' ? (instantSearchList as InstantSearchResultBook[]).map((book, idx) => (
                <li
                  className={`InstantSearchItem${highlightIndex === idx ? ' focused' : ''}`}
                  onMouseOver={() => updateHighlight(idx)}
                  key={`instant_search_${idx}`}
                  onClick={() => onSearchItemClick(book)}
                >
                  <Link
                    className="InstantSearchedName"
                    to={`/book/${book.bId}?q=${encodeURIComponent(keyword)}&s=instant`}
                  >
                    <span
                      className="InstantSearchTitle"
                      dangerouslySetInnerHTML={{__html: book.highlight.webTitleTitle ? book.highlight.webTitleTitle : book.title}}
                    />
                    <span
                      className="InstantSearchAuthor"
                      dangerouslySetInnerHTML={{__html: getSortedAuthorsHtmlString(
                        book.highlight.author ? book.highlight.author : book.author,
                        getAuthorsCount(book.author),
                        2,
                      )}}
                    />
                    <span
                      className="InstantSearchPublisher"
                      dangerouslySetInnerHTML={{__html: book.highlight.publisher ? book.highlight.publisher : book.publisher}}
                    />
                  </Link>
                </li>
              )) : (instantSearchList as InstantSearchResultArticle[]).map((article, idx) => (
                <li
                  className={`InstantSearchItem${highlightIndex === idx ? ' focused' : ''}`}
                  onMouseOver={() => updateHighlight(idx)}
                  key={`instant_search_${idx}`}
                  onClick={() => onSearchItemClick(article)}
                >
                  <Link
                    className="InstantSearchedName"
                    to={`${articleContentToPath({channelName: article.articleChannel.name, contentIndex: article.contentId})}?q=${encodeURIComponent(keyword)}&s=instant`}
                  >
                    <span
                      className="InstantSearchTitle"
                      dangerouslySetInnerHTML={{__html: article.highlight.title ? article.highlight.title : article.title}}
                    />
                    { article.authorsInfo && article.authorsInfo.length > 0 &&
                      <span
                        className="InstantSearchWriter"
                        dangerouslySetInnerHTML={{__html: getSortedAuthorsHtmlString(
                          article.highlight.authorNames ? article.highlight.authorNames : article.authorsInfo[0].name,
                          article.authorsInfo.length, 1,
                        )}}
                      />
                    }
                    <span
                      className="InstantSearchChannel"
                      dangerouslySetInnerHTML={{__html:
                        article.highlight.articleChannel &&
                        article.highlight.articleChannel.displayName ?
                          article.highlight.articleChannel.displayName :
                          article.articleChannel.displayName,
                      }}
                    />
                  </Link>
                </li>
              ))) : null
            }
          </ul>
        )}
      </div>
    );
  }
}
