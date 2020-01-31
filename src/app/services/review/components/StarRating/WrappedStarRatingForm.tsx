import React from 'react';

import { StarRatingForm } from './StarRatingForm';

export interface WrappedStarRatingFormProps {
  isTouchDevice: boolean;
  isRatingCancelable: boolean;
}

export interface WrappedStarRatingFormState {
  selectedRating: number;
}

export class WrappedStarRatingForm extends React.Component<WrappedStarRatingFormProps, WrappedStarRatingFormState> {
  constructor(props: WrappedStarRatingFormProps) {
    super(props);
    this.state = {
      selectedRating: 0,
    };
    this.onLabelClick = this.onLabelClick.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  public onLabelClick(rating: number) {
    if (rating === this.state.selectedRating) {
      this.onCancel();
    } else {
      this.setState({
        selectedRating: rating,
      });
    }
  }

  public onCancel() {
    if (!this.props.isRatingCancelable) {
      return;
    }
    this.setState({
      selectedRating: 0,
    });
  }

  public render() {
    return (
      // <StarRatingForm
      //   isRatingCancelable={this.props.isRatingCancelable}
      //   selectedRating={this.state.selectedRating}
      //   onSubmitRating={this.onLabelClick}
      //   onCancel={this.onCancel}
      // />
      <></>
    );
  }
}
