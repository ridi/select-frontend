import * as classNames from 'classnames';
import * as React from 'react';

interface Props {
  videoUrl: string;
  isMobile: boolean;
}

export const BookDetailMovieTrailer = (props: Props) => {
  const { videoUrl, isMobile } = props;
  let videoSrc: (string | null) = null;

  if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
    const token = videoUrl.match(/[\w-_]{10,}/);
    if (token) {
      videoSrc = `//www.youtube-nocookie.com/embed/${token[0]}?rel=0`;
    } else if (videoUrl.includes('vimeo')) {
      // const token = videoUrl.match(/\d[\w-_]{7,}/);
    }
    if (token) {
      videoSrc = `//player.vimeo.com/video/${token[0]}?byline=0&amp;portrait=0&amp;badge=0`;
    }
  }

  return videoSrc ? (
      <section
        className={classNames(
          'PageBookDetail_Panel',
          { 'PageBookDetail_Panel-inMeta': isMobile },
        )}
      >
        <h2 className={isMobile ? 'a11y' : 'PageBookDetail_PanelTitle'}>북 트레일러</h2>
        <div className="PageBookDetail_PanelContent PageBookDetail_PanelContent-trailer">
          <iframe
            src={videoSrc}
            width={isMobile ? 300 : 800}
            height={isMobile ? 225 : 450}
            frameBorder="0"
            allowFullScreen={true}
          />
        </div>
      </section>
    ) : null;
};
