import * as classNames from 'classnames';
import * as React from 'react';

// Book Services
import { formatFileSize } from 'app/services/book';
import { BookFile } from 'app/services/book/requests';

interface Props {
  file?: BookFile;
}

export const BookDetailFile = (props: Props) => {
  const { file } = props;
  return (
    <>
    {file && file.format && file.format !== 'bom' && <span className="PageBookDetail_FileType">{`${file.format.toUpperCase()}`}</span>}
    {
      file && file.size &&
      <span
        className={classNames(
          'PageBookDetail_FileSize',
          { 'PageBookDetail_FileSize-noFileType': file.format && file.format === 'bom' },
        )}
      >
        {`${file.format && file.format !== 'bom' ? ' · ' : ''}${formatFileSize(file.size)}`}
      </span>
    }
    </>
  );
};
