import { AxiosError, AxiosResponse } from 'axios';
import * as classNames from 'classnames';
import { isString, take } from 'lodash-es';
import * as qs from 'qs';
import * as React from 'react';
import { connect } from 'react-redux';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, tap, throttleTime } from 'rxjs/operators';

import history from 'app/config/history';
import { AppStatus } from 'app/services/app';

import { camelize } from '@ridi/object-case-converter';
import { Icon } from '@ridi/rsg';
import { InstantSearch } from 'app/components/InstantSearch';
import { SearchHistory } from 'app/components/SearchHistory';
import request from 'app/config/axios';
import { FetchStatusFlag } from 'app/constants';
import { GNBColorLevel, GNBSearchActiveType } from 'app/services/commonUI';
import { getSolidBackgroundColorRGBString } from 'app/services/commonUI/selectors';
import { getIsIosInApp, selectIsInApp } from 'app/services/environment/selectors';
import { RidiSelectState } from 'app/store';
import { localStorageManager } from 'app/utils/search';
import toast from 'app/utils/toast';
import { setDisableScroll } from 'app/utils/utils';

import env from 'app/config/env';
import { articleContentToPath } from 'app/utils/toPath';

export enum SearchHelperFlag {
  NONE,
  HISTORY,
  INSTANT,
}

export interface InstantSearchHighlight {
  webTitleTitle?: string;
  author?: string;
  publisher?: string;
}
export interface InstantSearchArticleHighlight {
  title?: string;
  channelDisplayName?: string;
}

export interface InstantSearchResultBook {
  bId: string;
  title: string;
  author: string;
  publisher: string;
  highlight: InstantSearchHighlight;
}

export interface InstantSearchResultArticle {
  id: number;
  channelId: number;
  channelDisplayName: string;
  channelName: string;
  contentId: number;
  title: string;
  highlight: InstantSearchArticleHighlight;
}

interface SearchStoreProps {
  gnbColorLevel: GNBColorLevel;
  solidBackgroundColorRGBString: string;
  gnbSearchActiveType: GNBSearchActiveType;
  searchQuery: string;
  isInApp: boolean;
  isIosInApp: boolean;
  appStatus: AppStatus;
}

interface SearchCascadedProps {
  isMobile: boolean;
}

type SearchProps = SearchStoreProps & SearchCascadedProps;

interface HistoryState {
  enabled: boolean;
  bookKeywordList: string[];
  articleKeywordList: string[];
}

interface QueryString {
  'q'?: string;
}

interface SearchState {
  searchQuery: string;
  fetchStatus: FetchStatusFlag;
  keyword: string;
  isActive: boolean;
  isClearButtonVisible: boolean;
  highlightIndex: number;
  currentHelperType: SearchHelperFlag;
  history: HistoryState;
  instantSearchResultsByKeyword: {
    Books: {
      [instantSearchKeyword: string]: InstantSearchResultBook[];
    },
    Articles: {
      [instantSearchKeyword: string]: InstantSearchResultArticle[];
    },
  };
}

enum KeyboardCode {
  ArrowUp = 38,
  ArrowDown = 40,
  Enter = 13,
}

export class Search extends React.Component<SearchProps, SearchState> {

  public static getDerivedStateFromProps(nextProps: SearchProps, prevState: SearchState) {
    if (nextProps.searchQuery !== prevState.searchQuery) {
      const queryString: QueryString = qs.parse(nextProps.searchQuery, { ignoreQueryPrefix: true });
      const keywordText: string = (queryString && queryString.q && isString(queryString.q)) ? queryString.q : '';
      if (keywordText.length <= 0) { return null; }
      return {
        searchQuery: nextProps.searchQuery,
        keyword: keywordText,
      };
    }

    return null;
  }
  // set member variables type
  private onSearchChange$ = new Subject();
  private onSearchKeydown$ = new Subject();
  private searchComponentWrapper: HTMLElement | null;
  private searchInput: HTMLInputElement | null;
  private keydownSubscription: Subscription;
  private inputSubscription: Subscription;

  public state: SearchState = this.getInitialState();
  private closeFunctionOnWindow = (event: MouseEvent): void => this.handleOutsideClick(event);

  // set initial private state
  private getInitialState(): SearchState {
    const { enabled = true, bookKeywordList = [], articleKeywordList = [] } = localStorageManager.load().history;

    return {
      searchQuery: '',
      fetchStatus: FetchStatusFlag.IDLE,
      keyword: '',
      isActive: false,
      isClearButtonVisible: false,
      highlightIndex: -1,
      currentHelperType: SearchHelperFlag.NONE,
      history: { enabled, bookKeywordList, articleKeywordList },
      instantSearchResultsByKeyword: { Books: {}, Articles: {} },
    };
  }

  private setStateClean(keyword: string = ''): void {
    this.setState({
      isActive: false,
      keyword,
      highlightIndex: -1,
      currentHelperType: SearchHelperFlag.NONE,
      isClearButtonVisible: false,
    }, () => {
      if (this.searchInput) {
        this.searchInput.blur();
      }
    });
  }

  // private methods
  private setHistoryStateAndLocalStorage(historyObj: HistoryState): void {
    this.setState({
      history: historyObj,
    }, () => {
      localStorageManager.save({
        history: {
          ...this.state.history,
        },
      });
    });
  }

  private toggleSavingHistory(): void {
    const updatedHistoryState = {
      enabled: !this.state.history.enabled,
      bookKeywordList: this.state.history.bookKeywordList,
      articleKeywordList: this.state.history.articleKeywordList,
    };
    this.setHistoryStateAndLocalStorage(updatedHistoryState);
  }

  private pushHistoryKeyword(keyword: string): void {
    if (!this.state.history.enabled || keyword.length <= 0) {
      return;
    }
    const { appStatus } = this.props;
    const filteredKeywordList: string[] = appStatus === AppStatus.Books ?
      this.state.history.bookKeywordList :
      this.state.history.articleKeywordList
        .filter((listItem: string) => listItem !== keyword)
        .filter((listItem: string) => listItem.length > 0);
    const updatedHistoryState: HistoryState = {
      enabled: this.state.history.enabled,
      bookKeywordList: appStatus === AppStatus.Books ? [
        keyword,
        ...take(filteredKeywordList, 4),
      ] : this.state.history.bookKeywordList,
      articleKeywordList: appStatus === AppStatus.Articles ? [
        keyword,
        ...take(filteredKeywordList, 4),
      ] : this.state.history.articleKeywordList,
    };
    this.setHistoryStateAndLocalStorage(updatedHistoryState);
  }

  private clearHistory(): void {
    const updatedHistoryState = {
      enabled: this.state.history.enabled,
      bookKeywordList: [],
      articleKeywordList: [],
    };
    this.setHistoryStateAndLocalStorage(updatedHistoryState);
  }

  private removeHistoryKeyword(keyword: string): void {
    const { appStatus } = this.props;
    const filteredKeywordList: string[] = appStatus === AppStatus.Books ?
      this.state.history.bookKeywordList : this.state.history.articleKeywordList
        .filter((listItem: string) => listItem !== keyword);

    const updatedHistoryState = {
      enabled: this.state.history.enabled,
      bookKeywordList: appStatus === AppStatus.Books ?
        filteredKeywordList : this.state.history.bookKeywordList,
      articleKeywordList: appStatus === AppStatus.Articles ?
        filteredKeywordList : this.state.history.articleKeywordList,
    };
    this.setHistoryStateAndLocalStorage(updatedHistoryState);
  }

  private manageScrollDisable(isDisable: boolean): void {
    const { isMobile, isInApp } = this.props;
    if (isMobile || isInApp) {
      setDisableScroll(isDisable);
    }
  }

  private getInstantSearchedList(value: string) {
    const { instantSearchResultsByKeyword } = this.state;
    const { appStatus } = this.props;

    const requestParams = {
      site: 'ridi-select',
      where: appStatus === AppStatus.Books ? 'book' : 'article',
      what: 'instant',
      keyword: value,
    };

    if (instantSearchResultsByKeyword[appStatus][value] &&
      (instantSearchResultsByKeyword[appStatus][value].length > 0)
    ) {
      this.setState({
        isActive: true,
        fetchStatus: FetchStatusFlag.IDLE,
        currentHelperType: SearchHelperFlag.INSTANT,
      }, () => this.manageScrollDisable(false));
      return;
    }
    this.setState({
      isActive: true,
      fetchStatus: FetchStatusFlag.FETCHING,
      currentHelperType: SearchHelperFlag.INSTANT,
    }, () => {
      request({
        baseURL: env.SEARCH_API,
        method: 'get',
        url: `/search`,
        withCredentials: false,
        params: requestParams,
      }).then((axResponse: AxiosResponse) => this.setState({
          fetchStatus: FetchStatusFlag.IDLE,
          instantSearchResultsByKeyword: {
            ...instantSearchResultsByKeyword,
            [appStatus]: {
              ...instantSearchResultsByKeyword[appStatus],
              [value]: camelize(axResponse.data[appStatus.toLowerCase()], { recursive: true }),
            },
          },
        }, () => this.manageScrollDisable(false)))
        .catch((axError: AxiosError) => this.setState({
          fetchStatus: FetchStatusFlag.FETCH_ERROR,
          currentHelperType: SearchHelperFlag.NONE,
        }, () => this.manageScrollDisable(false)));
    });
  }

  private toggleActivation(isTargetActive: boolean): void {
    const { isActive } = this.state;
    if (isActive === isTargetActive) {
      return;
    }
    window.removeEventListener('click', this.closeFunctionOnWindow!, true);
    this.manageScrollDisable(isTargetActive);
    if (!isTargetActive) {
      this.setStateClean();
      return;
    }
    window.addEventListener('click', this.closeFunctionOnWindow!, true);
    const { keyword } = this.state;
    const targetState = {
      isActive: isTargetActive,
      keyword,
      highlightIndex: -1,
      currentHelperType: SearchHelperFlag.HISTORY,
      isClearButtonVisible: true,
    };
    if (this.props.gnbSearchActiveType !== GNBSearchActiveType.block) {
      targetState.keyword = '';
      targetState.isClearButtonVisible = false;
    } else if (keyword.length > 0) {
      this.getInstantSearchedList(keyword);
      targetState.currentHelperType = SearchHelperFlag.INSTANT;
    }
    this.setState(targetState, () => {
      if (this.searchInput) {
        this.searchInput.focus();
      }
    });
  }

  private clearSearchInput(): void {
    this.setState({
      keyword: '',
      isClearButtonVisible: false,
      currentHelperType: SearchHelperFlag.HISTORY,
    }, () => this.searchInput && this.searchInput.focus());
  }

  private updateHighlightIndex(idx: number): void {
    this.setState({
      highlightIndex: idx,
    });
  }

  private linkToBookDetail(book: InstantSearchResultBook): void {
    if (!book) {
      toast.failureMessage();
      return;
    }
    let targetKeyword = '';
    if (book.highlight.webTitleTitle) {
      targetKeyword = book.title;
    } else if (book.highlight.author) {
      targetKeyword = book.author;
    } else if (book.highlight.publisher) {
      targetKeyword = book.publisher;
    }
    this.manageScrollDisable(false);
    this.setStateClean();
    this.pushHistoryKeyword(targetKeyword);
    history.push(`/book/${book.bId}?q=${encodeURIComponent(targetKeyword)}&s=instant`);
  }

  private linkToArticleDetail(article: InstantSearchResultArticle): void {
    if (!article) {
      toast.failureMessage();
      return;
    }
    let targetKeyword = '';
    if (article.highlight.title) {
      targetKeyword = article.title;
    } else if (article.highlight.channelDisplayName) {
      targetKeyword = article.channelDisplayName;
    }

    this.manageScrollDisable(false);
    this.setStateClean();
    this.pushHistoryKeyword(targetKeyword);

    history.push(`${articleContentToPath({channelName: article.channelName, contentIndex: article.contentId})}?q=${encodeURIComponent(targetKeyword)}&s=instant`);
  }

  private fullSearchWithKeyword(keyword: string): void {
    if (keyword.length <= 0) {
      return;
    }
    const { appStatus } = this.props;
    this.manageScrollDisable(false);
    history.push(`/search?q=${encodeURIComponent(keyword)}&type=${appStatus}`);
    this.pushHistoryKeyword(keyword);
    setTimeout(() => this.setStateClean(keyword), 0);
  }

  private doSearchAction(value: string): void {
    const { keyword, highlightIndex, currentHelperType } = this.state;
    const { appStatus } = this.props;
    const { bookKeywordList, articleKeywordList } = this.state.history;

    if (highlightIndex < 0) {
      this.fullSearchWithKeyword(value);
      return;
    }

    if (currentHelperType === SearchHelperFlag.INSTANT) {
      const instantSearchResults = this.state.instantSearchResultsByKeyword;
      if (appStatus === AppStatus.Books) {
        this.linkToBookDetail(instantSearchResults.Books[keyword][highlightIndex]);
      } else {
        this.linkToArticleDetail(instantSearchResults.Articles[keyword][highlightIndex]);
      }
      return;
    }

    if (currentHelperType === SearchHelperFlag.HISTORY) {
      if (appStatus === AppStatus.Books) {
        this.fullSearchWithKeyword(bookKeywordList[highlightIndex]);
      } else {
        this.fullSearchWithKeyword(articleKeywordList[highlightIndex]);
      }
    }
  }

  private getMovedHighlightIndex(
    keyType: number,
    currentIndex: number,
    currentList: string[] | InstantSearchResultBook[] | InstantSearchResultArticle[],
  ): number {
    switch (keyType) {
      case KeyboardCode.ArrowDown:
        return currentIndex + 1 >= currentList.length ? currentIndex : currentIndex + 1;
      case KeyboardCode.ArrowUp:
        return currentIndex - 1 < 0 ? 0 : currentIndex - 1;
      default:
        return currentIndex;
    }
  }

  private subscribeKeyboardEvent(): void {
    if (!this.searchInput) {
      return;
    }
    // functional key event observable
    this.keydownSubscription = this.onSearchKeydown$
      .pipe(
        filter((e: any) => (e.keyCode === 13 || e.keyCode === 38 || e.keyCode === 40)),
        map((e: any) => {
          e.preventDefault();
          const { appStatus } = this.props;
          return {
            keyType: e.keyCode,
            value: e.target.value,
            currentHelperList: (this.state.currentHelperType === SearchHelperFlag.HISTORY) ?
              (appStatus === AppStatus.Books ? this.state.history.bookKeywordList : this.state.history.articleKeywordList) :
              this.state.instantSearchResultsByKeyword[appStatus][this.state.keyword],
          };
        }),
        throttleTime(100),
      )
      .subscribe((obj: {
        keyType: KeyboardCode;
        value: string;
        currentHelperList: string[] | InstantSearchResultBook[] | InstantSearchResultArticle[];
      }): void => {
        const {
          keyword,
          currentHelperType,
          instantSearchResultsByKeyword,
          fetchStatus,
          highlightIndex,
        } = this.state;
        if (obj.keyType === KeyboardCode.Enter) {
          this.doSearchAction(obj.value);
          return;
        }
        if (currentHelperType === SearchHelperFlag.HISTORY && !this.state.history.enabled) {
          this.setState({ highlightIndex: -1 });
          return;
        }
        if (currentHelperType !== SearchHelperFlag.NONE) {
          this.setState({
            highlightIndex:
              fetchStatus === FetchStatusFlag.FETCHING ?
                -1 :
                this.getMovedHighlightIndex(obj.keyType, highlightIndex, obj.currentHelperList),
          });
        } else if (keyword.length > 0 && instantSearchResultsByKeyword[this.props.appStatus][keyword].length > 0) {
          this.setState({
            highlightIndex:
              fetchStatus === FetchStatusFlag.FETCHING ? -1 : 0,
            currentHelperType: fetchStatus === FetchStatusFlag.FETCHING ?
              SearchHelperFlag.NONE : SearchHelperFlag.INSTANT,
          });
        } else if (keyword.length === 0) {
          this.setState({
            highlightIndex: 0,
            currentHelperType: SearchHelperFlag.HISTORY,
          });
        }
      });

    // input value change event observable
    this.inputSubscription = this.onSearchChange$
      .pipe(
        tap((value: string): void => this.setState({
          keyword: value,
          highlightIndex: -1,
          isClearButtonVisible: true,
          currentHelperType: value.length > 0 ? this.state.currentHelperType : SearchHelperFlag.HISTORY,
        })),
        distinctUntilChanged(),
        debounceTime(150),
      )
      .subscribe((value: string): void => {
        if (value.length === 0) {
          this.setState({
            isActive: true,
            isClearButtonVisible: false,
            currentHelperType: SearchHelperFlag.HISTORY,
          });
          return;
        }
        this.getInstantSearchedList(value);
      });
  }

  private onSearchChange(e: any): void {
    const searchKeyword = e.target.value;
    this.onSearchChange$.next(searchKeyword);
  }

  private onSearchKeydown(e: any): void {
    this.onSearchKeydown$.next(e);
  }

  private handleOutsideClick(e: any): void {
    if (
      this.searchComponentWrapper &&
      this.searchComponentWrapper.contains(e.target)
    ) {
      return;
    }

    const targetKeyword = (this.props.gnbSearchActiveType === GNBSearchActiveType.block) ?
      this.state.keyword : '';
    this.toggleActivation(false);
    this.setStateClean(targetKeyword);
  }

  private renderSearchButtonIcon() {
    const { isActive } = this.state;
    const { isIosInApp, gnbSearchActiveType } = this.props;
    if (isActive || gnbSearchActiveType === GNBSearchActiveType.block) {
      return (
        <Icon
          name="arrow_13_left"
          className="GNBSearchButtonIcon"
        />
      );
    }
    if (isIosInApp) {
      return (
        <svg className="GNBSearchButtonIcon_IosInApp" width="24px" height="24px" viewBox="0 0 24 24">
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g transform="translate(2.500000, 2.500000)" fill="#339CF2">
              {/* tslint:disable-next-line:max-line-length */}
              <path d="M8,1.5 C4.41014913,1.5 1.5,4.41014913 1.5,8 C1.5,11.5898509 4.41014913,14.5 8,14.5 C11.5898509,14.5 14.5,11.5898509 14.5,8 C14.5,4.41014913 11.5898509,1.5 8,1.5 Z M8,0 C12.418278,-7.77156117e-16 16,3.581722 16,8 C16,12.418278 12.418278,16 8,16 C3.581722,16 4.4408921e-16,12.418278 0,8 C-5.55111512e-16,3.581722 3.581722,8.8817842e-16 8,0 Z" id="Rectangle" fillRule="nonzero" />
              {/* tslint:disable-next-line:max-line-length */}
              <polygon transform="translate(15.778175, 15.674621) rotate(-45.000000) translate(-15.778175, -15.674621)" points="15.0281746 11.4246212 16.5281746 11.4246212 16.5281746 19.9246212 15.0281746 19.9246212" />
            </g>
          </g>
        </svg>
      );
    }
    return (
      <Icon
        name="search"
        className="GNBSearchButtonIcon"
      />
    );
  }

  // component life cycle handler
  public componentDidMount(): void {
    this.subscribeKeyboardEvent();
  }

  public componentWillUnmount(): void {
    this.keydownSubscription.unsubscribe();
    this.inputSubscription.unsubscribe();
  }

  // render
  public render() {
    const {
      keyword,
      fetchStatus,
      isActive,
      isClearButtonVisible,
      highlightIndex,
      currentHelperType,
    } = this.state;
    const {
      isMobile,
      gnbColorLevel,
      solidBackgroundColorRGBString,
      gnbSearchActiveType,
      appStatus,
    } = this.props;
    const instantSearchResult = this.state.instantSearchResultsByKeyword[appStatus][keyword];
    const { enabled, bookKeywordList, articleKeywordList } = this.state.history;
    const inputEvents = {
      onChange: (e: any) => this.onSearchChange(e),
      onKeyDown: (e: any) => this.onSearchKeydown(e),
    };

    Object.assign(inputEvents, isMobile ? {
      onTouchStart: () => this.toggleActivation(true),
    } : {
      onClick: () => this.toggleActivation(true),
    });

    return (
      <div
        className={classNames({
          'GNBSearchWrapper': true,
          'active': isActive,
          'GNBSearchWrapper-colored': gnbColorLevel !== GNBColorLevel.DEFAULT,
          'GNBSearchWrapper-typeBlock': gnbSearchActiveType === GNBSearchActiveType.block,
        })}
        style={{ background: solidBackgroundColorRGBString }}
        ref={(ref) => { this.searchComponentWrapper = ref; }}
      >
        <button
          type="button"
          className="GNBSearchButton"
          onClick={() => {
            if (gnbSearchActiveType === GNBSearchActiveType.block) {
              history.goBack();
              this.toggleActivation(false);
              return;
            }
            this.toggleActivation(!isActive);
          }}
        >
          {this.renderSearchButtonIcon()}
          <h2 className="a11y">검색</h2>
        </button>
        <div
          className={classNames(
            'GNBSearchInputWrapper',
            { 'GNBSearchInputWrapper-empty': isClearButtonVisible },
          )}
        >
          <Icon name="search" className="GNBSearchIcon" />
          <input
            className="GNBSearchInput"
            type="search"
            role="search"
            autoCorrect="off"
            autoComplete="off"
            autoCapitalize="off"
            placeholder={appStatus === AppStatus.Books ? '제목, 저자, 출판사 검색' : '아티클 검색'}
            value={keyword}
            ref={(ref) => { this.searchInput = ref; }}
            {...inputEvents}
            maxLength={150}
          />
          {isClearButtonVisible && keyword.length > 0 ? (
            <button
              className="GNBSearchResetButton"
              type="button"
              onClick={() => this.clearSearchInput()}
            >
              <Icon
                name="close_2"
                className="GNBSearchResetButtonIcon"
              />
              <span className="a11y">검색어 비우기</span>
            </button>
          ) : null}
        </div>
        <InstantSearch
          keyword={keyword}
          isActive={isActive && currentHelperType === SearchHelperFlag.INSTANT}
          fetchStatus={fetchStatus}
          searchType={appStatus}
          instantSearchList={instantSearchResult}
          highlightIndex={highlightIndex}
          updateHighlight={(idx: number) => this.updateHighlightIndex(idx)}
          onSearchItemClick={(item: InstantSearchResultBook | InstantSearchResultArticle) => {
            if (appStatus === AppStatus.Books) {
              const book = item as InstantSearchResultBook;
              this.linkToBookDetail(book);
            } else {
              const article = item as InstantSearchResultArticle;
              this.linkToArticleDetail(article);
            }
          }}
        />
        <SearchHistory
          isActive={isActive && currentHelperType === SearchHelperFlag.HISTORY}
          highlightIndex={highlightIndex}
          updateHighlight={(idx: number) => this.updateHighlightIndex(idx)}
          savingHistoryEnabled={enabled}
          keywordList={appStatus === AppStatus.Books ? bookKeywordList : articleKeywordList}
          toggleSavingHistory={() => this.toggleSavingHistory()}
          clearHistory={() => this.clearHistory()}
          removeKeyword={(targetKeyword: string) => this.removeHistoryKeyword(targetKeyword)}
          resetSearchState={() => {
            this.manageScrollDisable(false);
            this.toggleActivation(false);
          }}
        />
        {isMobile ? (<span
          className="dim"
          onClick={() => {
            this.manageScrollDisable(false);
            this.setState({ isActive: false, isClearButtonVisible: false });
          }}
        />) : null}
      </div>
    );
  }
}

const mapStateToProps = (state: RidiSelectState): SearchStoreProps => {
  return {
    gnbColorLevel: state.commonUI.gnbColorLevel,
    solidBackgroundColorRGBString: getSolidBackgroundColorRGBString(state),
    gnbSearchActiveType: state.commonUI.gnbSearchActiveType,
    searchQuery: state.router.location!.search,
    isIosInApp: getIsIosInApp(state),
    isInApp: selectIsInApp(state),
    appStatus: state.app.appStatus,
  };
};

export const ConnectedSearch = connect(mapStateToProps)(Search);
