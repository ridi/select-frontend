import React from 'react';
import Truncate from 'react-truncate';

import { TextWithLF } from 'app/types';

export interface ReviewContentProps {
  children: TextWithLF;
}

export interface ReviewContentState {
  expanded: boolean;
}
export class ReviewContent extends React.Component<ReviewContentProps, ReviewContentState> {
  constructor(props: ReviewContentProps) {
    super(props);
    this.state = {
      expanded: false,
    };

    this.expandContent = this.expandContent.bind(this);
  }

  public expandContent() {
    this.setState({
      expanded: true,
    });
  }

  public render() {
    const { expanded } = this.state;

    return (
      <div className="ReviewContent">
        <Truncate
          lines={!expanded && 3}
          trimWhitespace={true}
          ellipsis={(
            <span className="Review_Ellipsis">...
              <button
                className="Review_ReadMoreButton"
                onClick={this.expandContent}
              >
                계속 읽기
              </button>
            </span>
          )}
        >
          {this.props.children.split('\n').map((child, i, arr) => {
            const line = <span key={i}>{child}</span>;
            return i === arr.length - 1 ? line : [line, <br key={`${i  }br`} />];
          })}
        </Truncate>
      </div>
    );
  }
}
