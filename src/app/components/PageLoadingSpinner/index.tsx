import styled from '@emotion/styled';
import React from 'react';

const Filler = styled.div`
  height: 300vh;
`;

const PageLoadingSpinner: React.FunctionComponent = () => {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Filler />
      {visible && <span className="a11y">Loading...</span>}
    </>
  );
};

export default PageLoadingSpinner;
