import styled from '@emotion/styled';
import React from 'react';
import { useSelector } from 'react-redux';

import { Book } from 'app/services/book';
import { RidiSelectState } from 'app/store';
import { FetchStatusFlag } from 'app/constants';
import { collectionToPath } from 'app/utils/toPath';
import { HomeSectionPlaceholder } from 'app/placeholder/HomeSectionPlaceholder';
import InlineHorizontalBookList from 'app/components/InlineHorizontalBookList';
import {
  DefaultCollectionState,
  SpotlightCollectionState,
  CollectionType,
} from 'app/services/collection';
import { getIsMobile } from 'app/services/commonUI/selectors';
import { SectionHeader } from 'app/components/HomeSectionHeader';
import HomeSpotlightSection from 'app/components/Home/HomeSpotlightSection';
import { HomeChartBooksSection } from 'app/components/Home/HomeChartBooksSection';
import { getIsUserFetching } from 'app/services/user/selectors';
import Media from 'app/styles/mediaQuery';

interface HomeSectionProps {
  collection: DefaultCollectionState | SpotlightCollectionState;
  onScreen: boolean;
  order?: number;
}

const StyledHomeSection = styled.section`
  padding: 30px 20px 0;
  background-color: white;
  &:last-of-type {
    padding-bottom: 20px;
  }
  @media ${Media.PC} {
    width: 800px;
    margin: 0 auto;
    padding: 60px 0 0;
  }
`;

const HomeSection: React.FunctionComponent<HomeSectionProps> = props => {
  const isMobile = useSelector(getIsMobile);
  const books = useSelector((state: RidiSelectState) => state.booksById);
  const isUserFetching = useSelector(getIsUserFetching);

  const { collection, onScreen, order } = props;
  const { type, title, id, itemListByPage } = collection;

  const fetchStatus = itemListByPage[1]?.fetchStatus || FetchStatusFlag.IDLE;
  const itemList = itemListByPage[1]?.itemList || [];

  if (
    !onScreen ||
    (type === CollectionType.CHART && isUserFetching) ||
    fetchStatus === FetchStatusFlag.FETCHING
  ) {
    return <HomeSectionPlaceholder type={collection.type} key={`${collection.id}_skeleton`} />;
  }

  if (
    (fetchStatus === FetchStatusFlag.IDLE && itemList?.length < 1) ||
    fetchStatus === FetchStatusFlag.FETCH_ERROR
  ) {
    return null;
  }

  const collectionBooks: Book[] = itemList?.map(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (bookId: number) => books[bookId]?.book!,
  );

  if (type === CollectionType.SPOTLIGHT) {
    return (
      <HomeSpotlightSection books={collectionBooks} title={title} collectionId={collection.id} />
    );
  }

  if (type === CollectionType.CHART) {
    return (
      <StyledHomeSection>
        <HomeChartBooksSection
          books={collectionBooks}
          title={title}
          collectionId={id}
          order={order}
        />
      </StyledHomeSection>
    );
  }

  return (
    <StyledHomeSection>
      <SectionHeader title={title || ''} link={collectionToPath({ collectionId: id })} />
      <InlineHorizontalBookList
        books={collectionBooks}
        serviceTitleForTracking="select-book"
        pageTitleForTracking="home"
        uiPartTitleForTracking="collection-list"
        miscTracking={JSON.stringify({ sect_collection_id: id, sect_order: order })}
        bookThumbnailSize={isMobile ? 110 : 120}
      />
    </StyledHomeSection>
  );
};

export default HomeSection;
