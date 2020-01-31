import React from 'react';
import { connect } from 'react-redux';

import { BookDetailPanelWrapper } from 'app/components/BookDetail/Panel';
import { RidiSelectState } from 'app/store';

interface BookDetailMovieTrailerProps {
  bookId: number;
  isMobile?: boolean;
}

interface BookDetailMovieTrailerStateProps {
  introVideoUrl?: string;
}

type Props = BookDetailMovieTrailerProps & BookDetailMovieTrailerStateProps;

const BookDetailMovieTrailer: React.FunctionComponent<Props> = (props) => {
  const { isMobile = false, introVideoUrl } = props;

  if (!introVideoUrl) {
    return null;
  }

  let trailerUrl = introVideoUrl;

  if (introVideoUrl.includes('youtube.com') || introVideoUrl.includes('youtu.be')) {
    const token = introVideoUrl.match(/[\w-_]{10,}/);
    if (token) {
      trailerUrl = `//www.youtube-nocookie.com/embed/${token[0]}?rel=0`;
    }
  } else if (introVideoUrl.includes('vimeo')) {
    const token = introVideoUrl.match(/\d[\w-_]{7,}/);
    if (token) {
      trailerUrl = `//player.vimeo.com/video/${token[0]}?byline=0&amp;portrait=0&amp;badge=0`;
    }
  }

  return (
    <BookDetailPanelWrapper
      className={isMobile ? 'PageBookDetail_Panel-inMeta' : ''}
    >
      <h2 className={isMobile ? 'a11y' : 'PageBookDetail_PanelTitle'}>북 트레일러</h2>
      <div className="PageBookDetail_PanelContent PageBookDetail_PanelContent-trailer">
        <iframe
          src={trailerUrl}
          width={isMobile ? 300 : 800}
          height={isMobile ? 225 : 450}
          frameBorder="0"
          allowFullScreen={true}
        />
      </div>
    </BookDetailPanelWrapper>
  );
};

const mapStateToProps = (state: RidiSelectState, ownProps: BookDetailMovieTrailerProps): BookDetailMovieTrailerStateProps => {
  const bookId = ownProps.bookId;
  const stateExists = !!state.booksById[bookId];
  const bookState = state.booksById[bookId];
  const bookDetail = stateExists ? bookState.bookDetail : undefined;

  return {
    introVideoUrl: !!bookDetail ? bookDetail.introVideoUrl : undefined,
  };
};

export const ConnectBookDetailMovieTrailer = connect(mapStateToProps, null)(BookDetailMovieTrailer);
