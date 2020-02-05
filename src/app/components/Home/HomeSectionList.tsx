import { throttle } from 'lodash-es';
import React from 'react';
import { connect } from 'react-redux';

import { ConnectedHomeSection } from 'app/components/Home/HomeSection';
import { HomeSectionPlaceholder } from 'app/placeholder/HomeSectionPlaceholder';
import { CollectionsState } from 'app/services/collection';
import { CollectionType } from 'app/services/home';
import { groupCollections } from 'app/services/home/uitls';
import { RidiSelectState } from 'app/store';

interface HomeCollectionListStateProps {
  fetchedAt: number | null;
  collectionIdList: number[];
  collections: CollectionsState;
}

interface HomeCollectionListState {
  renderedLastGroupIdx: number;
}

export class HomeSectionList extends React.Component<
  HomeCollectionListStateProps,
  HomeCollectionListState
> {
  private panels: HTMLElement[] = [];

  private scrollEvent: EventListener = throttle(() => this.checkSectionsOnViewport(), 500);

  public state: HomeCollectionListState = {
    renderedLastGroupIdx: 0,
  };

  private getIsOnViewport(target: HTMLElement) {
    const viewportEndPoint = window.innerHeight + window.pageYOffset;
    return viewportEndPoint > target.offsetTop;
  }

  private checkSectionsOnViewport() {
    const { renderedLastGroupIdx } = this.state;
    this.panels.forEach((panel, idx, panels) => {
      if (idx > panels.length || !panel || !this.getIsOnViewport(panel)) {
        return false;
      }
      if (idx > renderedLastGroupIdx) {
        this.setState({
          renderedLastGroupIdx: idx,
        });
      }
      return true;
    });
  }

  public componentDidMount() {
    window.addEventListener('scroll', this.scrollEvent);
  }

  public componentDidUpdate(prevProps: HomeCollectionListStateProps) {
    const { fetchedAt } = this.props;
    const { renderedLastGroupIdx } = this.state;

    if (!fetchedAt) {
      return;
    }

    if (this.panels.length > 0 && renderedLastGroupIdx + 1 >= this.panels.length) {
      window.removeEventListener('scroll', this.scrollEvent);
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollEvent);
  }

  public render() {
    const { fetchedAt, collectionIdList, collections } = this.props;
    const { renderedLastGroupIdx } = this.state;
    const { spotlight } = collections;

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
          <ConnectedHomeSection key={spotlight.id} collection={spotlight} onScreen />
        </div>
        {collectionIdList
          .map(collectionId => collections[collectionId])
          .reduce(groupCollections, [])
          .map((collectionGroup, idx) => (
            <div
              className="PageHome_Panel"
              key={`home_collection_group_${idx}`}
              ref={ref => {
                if (this.panels[idx] !== ref) {
                  this.panels[idx] = ref!;
                  this.checkSectionsOnViewport();
                }
              }}
            >
              {collectionGroup.map((collection, collectionIdx) => (
                <ConnectedHomeSection
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
  }
}

const mapStateToProps = (state: RidiSelectState): HomeCollectionListStateProps => ({
  fetchedAt: state.home.fetchedAt,
  collectionIdList: state.home.collectionIdList,
  collections: state.collectionsById,
});

export const ConnectedHomeSectionList = connect(mapStateToProps, null)(HomeSectionList);
