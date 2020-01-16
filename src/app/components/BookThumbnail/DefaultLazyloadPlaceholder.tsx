import * as React from 'react';

export const DefaultLazyloadPlaceholder: React.SFC<{ size: { width: number, height: number }}> = (props) => {
  const { size } = props;
  return <div className="RSGBookThumbnail_LazyloadPlaceholder" style={size}/>;
};
