import React from 'react';

import { FetchStatusFlag } from 'app/constants';

import { MyStarRatingStatus } from './MyStarRatingStatus';
import { StarRatingInput } from './StarRatingInput';
import { StarRatingTooltip } from './StarRatingTooltip';

export interface StarRatingFormProps {
  bookId: number;
  ratingFetchStatus: FetchStatusFlag;
  selectedRating: number;
  isRatingCancelable: boolean;
  onSubmitRating: (bookId: number, rating: number) => void;
  onCancel: (bookId: number) => void;
  checkAuth: () => boolean;
}

export interface StarRatingFormState {
  hoveredRating: number;
}

export class StarRatingForm extends React.Component<StarRatingFormProps, StarRatingFormState> {
  constructor(props: StarRatingFormProps) {
    super(props);
    this.state = {
      hoveredRating: 0,
    };
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onLabelClick = this.onLabelClick.bind(this);
  }

  public onMouseOver(rating: number) {
    this.setState({
      hoveredRating: rating,
    });
  }

  public onMouseOut() {
    this.setState({
      hoveredRating: 0,
    });
  }

  public onLabelClick(event: React.SyntheticEvent<any>, rating: number) {
    if (!this.props.checkAuth()) {
      event.preventDefault();
      return;
    }
    if (rating === 0 || (rating === this.props.selectedRating && this.props.isRatingCancelable)) {
      this.props.onCancel(this.props.bookId);
    } else if (rating !== this.props.selectedRating) {
      this.props.onSubmitRating(this.props.bookId, rating);
    } else {
      event.preventDefault();
    }
  }

  public render() {
    const { bookId, selectedRating, isRatingCancelable, ratingFetchStatus, onCancel } = this.props;
    const { hoveredRating } = this.state;

    return (
      <div className="StarRatingForm">
        {ratingFetchStatus === FetchStatusFlag.FETCHING && <div className="StarRatingForm_Spinner" />}
        <div className="StarRatingForm_Row">
          {hoveredRating !== 0 || !selectedRating ?
            <StarRatingTooltip
              rating={hoveredRating}
              isRatingCancelable={isRatingCancelable && !!selectedRating && selectedRating === hoveredRating}
            /> :
            <MyStarRatingStatus
              rating={selectedRating}
              onCancel={() => onCancel(bookId)}
              isRatingCancelable={isRatingCancelable}
            />
          }
        </div>
        <div className="StarRatingForm_Row">
          <StarRatingInput
            classname="StarRatingForm_Input"
            selectedRating={selectedRating}
            onLabelClick={this.onLabelClick}
            hoveredRating={hoveredRating}
            onMouseOver={this.onMouseOver}
            onMouseOut={this.onMouseOut}
          />
        </div>
      </div>
    );
  }
}
