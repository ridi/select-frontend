import * as express from 'express';
import book from './book';
import article from './article';

import { override, OpenGraph } from './utils/override';
import { getTitleByPath } from './utils/getTitleByPath';

const app = express();

app.use('/book', book);
app.use('/article', article);

app.use(async (req, res) => {
  const openGraph: Pick<OpenGraph, 'title' | 'url'> = {
    title: getTitleByPath(req.path),
    url: `https://select.ridibooks.com${req.path}`,
  };

  res.set('Content-Type', 'text/html');
  res.send(await override(openGraph));
});

export default app;
