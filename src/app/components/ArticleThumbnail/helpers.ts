import { ThumbnailShape } from 'app/components/ArticleThumbnail/types';

export function getThumbnailHeight(width: number, shape: ThumbnailShape = ThumbnailShape.RECTANGLE): number {
  if (shape === ThumbnailShape.SQUARE) {
    return width;
  }

  return (width / 16) * 9;
}
