import { Pagination } from 'app/components/Pagination';
import { MAX_WIDTH } from 'app/constants';
import { getPageQuery } from 'app/services/routing/selectors';
import { RidiSelectState } from 'app/store';
import * as React from 'react';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { Link, LinkProps } from 'react-router-dom';

interface OwnProps {
  fetch: (page: number) => any;
  isFetched: (page: number) => boolean;
  buildPaginationURL: (page: number) => string;
  renderItems: (page: number) => React.ReactElement<any>;
  renderPlaceholder: () => React.ReactElement<any>;
  itemCount: number | undefined;
  itemCountPerPage?: number;

  // `_key` prop is to determine whether to call `fetchIfNeeded` function or not.
  // Page comparision does not work for all the cases. For example, in
  // the search result page of page 1, when new query is given, page would still
  // be 1, which is the same as its previous page. And it leads to not to
  // call the `fetchIfNeeded` function since page hasn't been changed.
  // To avoid this situation, provide this optional prop for comparison.
  _key?: string;
}

interface StateProps {
  page: number;
}

type Props = OwnProps & StateProps;

export class ListWithPaginationPage extends React.Component<Props> {
  private fetchIfNeeded = () => {
    const { isFetched, fetch, page } = this.props;
    if (!isFetched(page)) {
      fetch(page);
    }
  }

  public componentDidMount() {
    this.fetchIfNeeded();
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.page !== this.props.page || prevProps._key !== this.props._key) {
      this.fetchIfNeeded();
    }
  }

  public shouldComponentUpdate(nextProps: Props) {
    return !Number.isNaN(nextProps.page);
  }

  public render() {
    const {
      renderItems,
      renderPlaceholder,
      isFetched,
      buildPaginationURL,
      itemCount = 0,
      itemCountPerPage = 24,
      children,
      page,
    } = this.props;
    return (
      <div className="ListWithPaginationPage">
        {!isFetched(page) || Number.isNaN(page) ? (
          <section className="Skeleton_Wrapper">
            <h2 className="PageSearchResult_Title Skeleton" />
            {renderPlaceholder()}
          </section>
        ) : (
          <>
            <section>
              <h2 className="a11y">{page} 페이지</h2>
              {renderItems(page)}
            </section>
            {itemCount > 0 && <MediaQuery maxWidth={MAX_WIDTH}>
              {(isMobile) => <Pagination
                currentPage={page}
                isMobile={isMobile}
                totalPages={Math.ceil(itemCount / itemCountPerPage)}
                item={{
                  el: Link,
                  getProps: (p): LinkProps => ({
                    to: buildPaginationURL(p),
                  }),
                }}
              />}
            </MediaQuery>}
            {children}
          </>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: RidiSelectState): StateProps => ({
  page: getPageQuery(state),
});

export const ConnectedListWithPagination =  connect(mapStateToProps)(ListWithPaginationPage);
