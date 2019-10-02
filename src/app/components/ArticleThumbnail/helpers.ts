import { ThumbnailShape, ThumbnailSize } from 'app/components/ArticleThumbnail/types';

export function getThumbnailHeight(width: ThumbnailSize, shape: ThumbnailShape = ThumbnailShape.RECTANGLE): number {
  if (shape === ThumbnailShape.SQUARE) {
    return width;
  }
  if (width === 173) {
    return 97;
  } else if (width === 154) {
    return 86;
  } else if (width === 100) {
    return 56;
  }

  return width * 1.79;
}
