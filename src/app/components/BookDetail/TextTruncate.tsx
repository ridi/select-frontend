import classNames from 'classnames';
import React from 'react';

interface Props {
  text: string;
  lines: number;
  lineHeight: number;
  renderExpander?: ({
    isExpanded,
    isTruncated,
    expand,
  }: {
    isExpanded: boolean;
    isTruncated: boolean;
    expand: () => void;
  }) => any;
}

interface State {
  isExpanded: boolean;
  isTruncated: boolean;
}

export class TextTruncate extends React.Component<Props, State> {
  private wrapper: HTMLParagraphElement | null;

  public state = {
    isExpanded: false,
    isTruncated: false,
  };

  private expand = () => {
    this.setState({ isExpanded: true });
  };

  public componentDidMount() {
    if (this.wrapper) {
      if (this.wrapper.offsetHeight > this.props.lineHeight * this.props.lines) {
        this.setState({ isTruncated: true });
      }
    }
  }

  public render() {
    const { expand, props } = this;
    const { lines, text, lineHeight, renderExpander } = props;
    const { isExpanded, isTruncated } = this.state;
    // Not setting type since WebkitLiineClamp doesn't exist in StyleProperties
    const style = {
      WebkitLineClamp: isTruncated && !isExpanded ? lines : ('unset' as 'unset'),
      maxHeight: isTruncated && !isExpanded ? lines * lineHeight : 'none',
    };
    return (
      <>
        <p
          className={classNames({
            TextTruncate: true,
            'TextTruncate-truncated': isTruncated && !isExpanded,
          })}
          ref={wrapper => (this.wrapper = wrapper)}
          dangerouslySetInnerHTML={{ __html: text.split('\n').join('<br />') }}
          style={style}
        />
        {!!renderExpander && renderExpander({ isExpanded, isTruncated, expand })}
      </>
    );
  }
}
