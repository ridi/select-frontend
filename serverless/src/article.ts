import Router from 'express-promise-router';

import fetch from 'node-fetch';
import ellipsis from 'text-ellipsis';
import { AllHtmlEntities } from 'html-entities';

import { override, OpenGraph } from './utils/override';

const MAX_DESCRIPTION_LENGTH = 175;

const router = Router();

const getArticleApiUrl = (channelName: string, contentIndex?: string) => {
  if (contentIndex) {
    return `https://select-api.ridibooks.com/article/articles/@${channelName}/${contentIndex}`;
  }
  return `https://select-api.ridibooks.com/article/channels/${channelName}`;
}

router.get('/@:channelName/:contentIndex', async (req, res) => {
  const { channelName, contentIndex } = req.params;
  try {
    const data = await (await fetch(getArticleApiUrl(channelName, contentIndex))).json();
    const openGraph: Partial<OpenGraph> = {
      title: `${data.title} - 리디셀렉트`,
      description: data.channel.display_name,
      type: 'article',
      url: `https://select.ridibooks.com/article/@${channelName}/${contentIndex}`,
      image: data.thumbnail_url,
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

router.get('/channel/@:channelName', async (req, res) => {
  const { channelName } = req.params;
  try {
    const data = await (await fetch(getArticleApiUrl(channelName))).json();
    const entities = new AllHtmlEntities();
    const description = entities.decode(
      ellipsis(
        data.description.replace(/&(\w+);/, ''),
        MAX_DESCRIPTION_LENGTH
      )
    );
    const openGraph: Partial<OpenGraph> = {
      title: `${data.display_name} - 리디셀렉트`,
      description,
      type: 'article',
      url: `https://select.ridibooks.com/article/channel/@${channelName}`,
      image: data.thumbnail_url,
      imageHeight: false,
      imageWidth: false,
    };
    res.set('Content-Type', 'text/html');
    res.send(await override(openGraph));
  } catch (e) {
    res.set('Content-Type', 'text/html');
    res.send(await override());
  }
})

export default router;
