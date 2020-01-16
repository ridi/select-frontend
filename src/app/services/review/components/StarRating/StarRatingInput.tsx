import * as classNames from 'classnames';
import detectIt from 'detect-it';
import * as React from 'react';

const ratingList = [1, 2, 3, 4, 5];

export interface StarRatingInputProps {
  classname?: string;
  selectedRating: number;
  onLabelClick: (event: React.SyntheticEvent<any>, rating: number) => void;
  hoveredRating: number;
  onMouseOver: (rating: number) => void;
  onMouseOut: () => void;
}

export const StarRatingInput: React.SFC<StarRatingInputProps> = (props) => {
  const { selectedRating, onLabelClick, hoveredRating, onMouseOver, onMouseOut, classname } = props;
  const isTouchDevice = detectIt.hasTouch;

  return (
    <div
      className={classNames('StarRatingInput', classname)}
      onMouseOut={() => onMouseOut()}
      onTouchEnd={() => onMouseOut()}
      onTouchCancel={() => onMouseOut()}
    >
      {ratingList.map((ratingData) => (
        <React.Fragment key={ratingData}>
          <label
            htmlFor={`MyStarRating${ratingData}`}
            className={classNames(
              'StarRatingInput_Label',
              { 'StarRatingInput_Label-filled': hoveredRating >= ratingData ||
                !hoveredRating && selectedRating >= ratingData },
            )}
            onClick={(event) => onLabelClick(event, ratingData)}
            data-rating={ratingData}
            onMouseOver={() => !isTouchDevice && onMouseOver(ratingData)}
            onTouchStart={() => isTouchDevice && onMouseOver(ratingData)}
            onTouchMove={(e) => isTouchDevice && onMouseOver(
              e.touches[0].clientX ?
                Number(
                  document
                    .elementFromPoint(e.touches[0].clientX, e.touches[0].clientY)
                    .getAttribute('data-rating'),
                ) : ratingData,
            )}
          >
            <span className="a11y">{`${ratingData}점`}</span>
            {(ratingData < 5) && <span className="StarRatingInput_Separator" />}
          </label>
          <input
            id={`MyStarRating${ratingData}`}
            className="a11y"
            name="MyStarRating"
            type="radio"
            value={ratingData}
            defaultChecked={selectedRating === ratingData}
          />
        </React.Fragment>
      ))}
    </div>
  );
};

interface WrapperStarRatingInputProps {
  isTouchDevice: boolean;
}

interface WrappedStarRatingInputState {
  selectedRating: number;
  hoveredRating: number;
}

export class WrappedStarRatingInput extends React.Component<WrapperStarRatingInputProps, WrappedStarRatingInputState> {
  constructor(props: WrapperStarRatingInputProps) {
    super(props);
    this.state = {
      selectedRating: 0,
      hoveredRating: 0,
    };
    this.onLabelClick = this.onLabelClick.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
  }

  public onLabelClick(event: React.SyntheticEvent<any>, rating: number) {
    if (rating === this.state.selectedRating) {
      this.setState({
        selectedRating: 0,
      });
    } else {
      this.setState({
        selectedRating: rating,
      });
    }
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

  public render() {
    return (
      <StarRatingInput
        selectedRating={this.state.selectedRating}
        onLabelClick={this.onLabelClick}
        hoveredRating={this.state.hoveredRating}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
      />
    );
  }
}
