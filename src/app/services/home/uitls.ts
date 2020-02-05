import { Book } from 'app/services/book';
import { DefaultCollectionState } from 'app/services/collection';

export const groupCollections = (
  groupedCollections: DefaultCollectionState[][],
  collection: DefaultCollectionState,
) => {
  const latestGroup = groupedCollections[groupedCollections.length - 1];
  // If current collection has a same type as the latest group,
  // push the current collection into the group. If it doesn't, create
  // a new group and put the current collection into it.
  if (
    !!latestGroup &&
    !!latestGroup[latestGroup.length - 1] &&
    latestGroup[latestGroup.length - 1].type === collection.type
  ) {
    latestGroup.push(collection);
  } else {
    groupedCollections.push([collection]);
  }
  return groupedCollections;
};

export const groupChartBooks = (groupingUnitCount: number) => (
  groupedBooks: Book[][],
  book: Book,
  idx: number,
) => {
  if (idx % groupingUnitCount === 0) {
    groupedBooks.push([book]);
  } else {
    groupedBooks[groupedBooks.length - 1].push(book);
  }
  return groupedBooks;
};
