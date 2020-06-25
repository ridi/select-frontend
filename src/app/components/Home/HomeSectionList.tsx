import styled from '@emotion/styled';
import throttle from 'lodash-es/throttle';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';

import HomeSection from 'app/components/Home/HomeSection';
import { groupCollections } from 'app/services/home/uitls';
import { CollectionType } from 'app/services/collection';
import { HomeSectionPlaceholder } from 'app/placeholder/HomeSectionPlaceholder';
import { getFetchedAt, getCollectionIdList } from 'app/services/home/selectors';
import { getCollections } from 'app/services/collection/selectors';
import Media from 'app/styles/mediaQuery';
import Colors from 'app/styles/colors';

const HomePanel = styled.div`
  &:not(:first-of-type) {
    border-bottom: 4px solid ${Colors.slategray_10};
    @media ${Media.PC} {
      margin-top: 0;
      border-bottom: 0;
    }
  }
`;

const HomeSectionList: React.FunctionComponent = () => {
  const panels: HTMLElement[] = [];

  const fetchedAt = useSelector(getFetchedAt);
  const collections = useSelector(getCollections);
  const collectionIdList = useSelector(getCollectionIdList);

  const [renderedLastGroupIdx, setRenderedLastGroupIdx] = useState(0);

  const getIsOnViewport = (target: HTMLElement) => {
    const viewportEndPoint = window.innerHeight + window.pageYOffset;
    return viewportEndPoint > target.offsetTop;
  };

  const checkSectionsOnViewport = () => {
    panels.forEach((panel, idx) => {
      if (idx > panels.length || !panel || !getIsOnViewport(panel)) {
        return false;
      }
      if (idx > renderedLastGroupIdx) {
        setRenderedLastGroupIdx(idx);
      }
      return true;
    });
  };
  const scrollEvent: EventListener = throttle(checkSectionsOnViewport, 500);

  useEffect(() => {
    if (!fetchedAt) {
      return;
    }

    if (panels.length > 0 && renderedLastGroupIdx + 1 >= panels.length) {
      window.removeEventListener('scroll', scrollEvent);
    }
  }, [fetchedAt, renderedLastGroupIdx]);

  useEffect(() => {
    window.removeEventListener('scroll', scrollEvent);
    window.addEventListener('scroll', scrollEvent);

    return () => {
      window.removeEventListener('scroll', scrollEvent);
    };
  }, [panels]);

  if (!fetchedAt) {
    return (
      <div className="Skeleton_Wrapper">
        <HomePanel>
          <HomeSectionPlaceholder type={CollectionType.SPOTLIGHT} />
        </HomePanel>
        <HomePanel>
          <HomeSectionPlaceholder />
          <HomeSectionPlaceholder />
        </HomePanel>
      </div>
    );
  }

  return (
    <div>
      {collectionIdList
        .map(collectionId => collections[collectionId])
        .reduce(groupCollections, [])
        .map((collectionGroup, idx) => (
          <HomePanel
            key={`home_collection_group_${idx}`}
            ref={ref => {
              if (!ref) {
                return;
              }
              if (panels[idx] !== ref) {
                panels[idx] = ref;
                checkSectionsOnViewport();
              }
            }}
          >
            {collectionGroup.map((collection, collectionIdx) => (
              <HomeSection
                key={`home_collection_${collection.id}`}
                collection={collection}
                onScreen={renderedLastGroupIdx >= idx}
                order={idx === 0 ? collectionIdx : idx + collectionIdx + 1}
              />
            ))}
          </HomePanel>
        ))}
    </div>
  );
};

export default HomeSectionList;
