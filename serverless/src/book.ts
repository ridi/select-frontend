import Router from 'express-promise-router';
import fetch from 'node-fetch';
import { override, OpenGraph } from './utils/override';
import { ellipsisDescription } from './utils/descriptions';

const getThumbnailUrl = (thumbnails: {
  small?: string,
  large?: string,
  xxlarge?: string,
}) => thumbnails.xxlarge || thumbnails.large || thumbnails.small || '';

const getBookApiUrl = (bookId: string, paths = '') =>
  `https://book-api.ridibooks.com/books/${bookId}${paths}`;

const router = Router();

router.get('/:id', async (req, res) => {
  const { id: bookId } = req.params;
  try {
    const data = await (await fetch(getBookApiUrl(bookId))).json();
    const { descriptions } = await (await fetch(getBookApiUrl(bookId, '/descriptions'))).json();
    const description = ellipsisDescription(descriptions.intro);
    const openGraph: Partial<OpenGraph> = {
      title: `${data.title.main} - 리디셀렉트`,
      description,
      type: 'book',
      url: `https://select.ridibooks.com/book/${bookId}`,
      image: getThumbnailUrl(data.thumbnail),
      imageHeight: false,
      imageWidth: false,
    };
    res.set('Content-Type', 'text/html');
    res.send(await override(openGraph));
  } catch (e) {
    res.set('Content-Type', 'text/html');
    res.send(await override());
  }
});

export default router;
