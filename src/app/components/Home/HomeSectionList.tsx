import throttle from 'lodash-es/throttle';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';

import { RidiSelectState } from 'app/store';
import HomeSection from 'app/components/Home/HomeSection';
import { groupCollections } from 'app/services/home/uitls';
import { CollectionType } from 'app/services/collection';
import { HomeSectionPlaceholder } from 'app/placeholder/HomeSectionPlaceholder';

const HomeSectionList: React.FunctionComponent = () => {
  const panels: HTMLElement[] = [];

  const fetchedAt = useSelector((state: RidiSelectState) => state.home.fetchedAt);
  const collections = useSelector((state: RidiSelectState) => state.collectionsById);
  const collectionIdList = useSelector((state: RidiSelectState) => state.home.collectionIdList);
  const { spotlight } = collections;

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
      <div className="PageHome_Content Skeleton_Wrapper">
        <div className="PageHome_Panel">
          <HomeSectionPlaceholder type={CollectionType.SPOTLIGHT} />
        </div>
        <div className="PageHome_Panel">
          <HomeSectionPlaceholder />
          <HomeSectionPlaceholder />
        </div>
      </div>
    );
  }

  return (
    <div className="PageHome_Content">
      <div className="PageHome_Panel">
        <HomeSection key={spotlight.id} collection={spotlight} onScreen />
      </div>
      {collectionIdList
        .map(collectionId => collections[collectionId])
        .reduce(groupCollections, [])
        .map((collectionGroup, idx) => (
          <div
            className="PageHome_Panel"
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
          </div>
        ))}
    </div>
  );
};

export default HomeSectionList;
