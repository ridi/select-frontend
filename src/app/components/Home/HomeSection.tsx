import * as React from 'react';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { Link } from 'react-router-dom';

import { Icon } from '@ridi/rsg';
import { ConnectedInlineHorizontalBookList } from 'app/components/InlineHorizontalBookList';
import { MAX_WIDTH , FetchStatusFlag } from 'app/constants';

import { HomeSectionPlaceholder } from 'app/placeholder/HomeSectionPlaceholder';
import { Book, BookState } from 'app/services/book';
import { DefaultCollectionState, SpotlightCollectionState } from 'app/services/collection';
import { CollectionType } from 'app/services/home';
import { RidiSelectState } from 'app/store';
import { collectionToPath } from 'app/utils/toPath';
import { ConnectedHomeChartBooksSection } from './HomeChartBooksSection';
import { ConnectedHomeSpotlightSection } from './HomeSpotlightSection';

interface HomeSectionProps {
  collection: DefaultCollectionState | SpotlightCollectionState;
  onScreen: boolean;
  order?: number;
}

interface HomeCollectionStateProps {
  books: BookState;
}

type Props = HomeSectionProps & HomeCollectionStateProps;

export const SectionHeader: React.SFC<{ title: string; link: string }> = (props) => (
  <div className="HomeSection_Header">
    <MediaQuery maxWidth={MAX_WIDTH}>
      {(isMobile) =>
        isMobile ? (
          <Link to={props.link}>
            <h2 className="HomeSection_Title reset-heading">
              {props.title}
              <Icon name="arrow_5_right" className="HomeSection_TitleArrowIcon" />
            </h2>
          </Link>
        ) : (
          <div className="HomeSection_Title">
            <h2 className="reset-heading">{props.title}</h2>
            <Link to={props.link} className="HomeSection_TitleLink">
                전체 보기
              <Icon name="arrow_5_right" className="HomeSection_TitleArrowIcon" />
            </Link>
          </div>
        )
      }
    </MediaQuery>
  </div>
);

export class HomeSection extends React.Component<Props> {
  public render() {
    const { collection, onScreen, books, order } = this.props;
    const { type, title, id, itemListByPage } = collection;
    const collectionBooks: Book[] = itemListByPage[1].itemList.map((bookId: number) => books[bookId].book!);

    if (
      itemListByPage[1].fetchStatus === FetchStatusFlag.IDLE && itemListByPage[1].itemList.length < 1 ||
      itemListByPage[1].fetchStatus === FetchStatusFlag.FETCH_ERROR
    ) {
      return null;
    }

    if (
      !onScreen ||
      itemListByPage[1].fetchStatus === FetchStatusFlag.FETCHING
    ) {
      return (
        <HomeSectionPlaceholder
          type={collection.type}
          key={`${collection.id}_skeleton`}
        />
      );
    }

    if (type === CollectionType.SPOTLIGHT) {
      return (
        <ConnectedHomeSpotlightSection
          books={collectionBooks}
          title={title!}
          collectionId={collection.id}
        />
      );
    }

    if (type === CollectionType.CHART) {
      return (
        <ConnectedHomeChartBooksSection
          books={collectionBooks}
          title={title!}
          collectionId={id}
          order={order}
        />
      );
    }

    return (
      <section className="HomeSection">
        <SectionHeader title={title!} link={collectionToPath({ collectionId: id })} />
        <MediaQuery maxWidth={MAX_WIDTH}>
          {(isMobile) => (
            <ConnectedInlineHorizontalBookList
              books={collectionBooks}
              serviceTitleForTracking="select-book"
              pageTitleForTracking="home"
              uiPartTitleForTracking="collection-list"
              miscTracking={JSON.stringify({ sect_collection_id: id, sect_order: order })}
              bookThumbnailSize={isMobile ? 110 : 120}
            />
          )}
        </MediaQuery>
      </section>
    );
  }
}

const mapStateToProps = (state: RidiSelectState, ownProps: HomeSectionProps): HomeCollectionStateProps => ({
  books: state.booksById,
});

export const ConnectedHomeSection = connect(mapStateToProps, null)(HomeSection);
