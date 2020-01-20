import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export interface OpenGraph {
  title: string;
  description: string;
  type: string;
  url: string;
  image: string;
  imageWidth: string | false;
  imageHeight: string | false;
}

export const override = async (og?: Partial<OpenGraph>): Promise<string> => {
  const origin = 'http://ridi-select-prod.s3-website.ap-northeast-2.amazonaws.com';
  const root = await (await fetch(origin)).text();

  if (!og) {
    return root;
  }

  const $ = cheerio.load(root, {
    decodeEntities: false,
  });

  if (og.title) {
    $('title').text(og.title);
    $('meta[property="og:title"]').attr('content', og.title);
  }

  if (og.description) {
    $('meta[name="description"]').text(og.description);
    $('meta[property="og:description"]').attr('content', og.description);
  }

  if (og.type) {
    $('meta[property="og:type"]').attr('content', og.type);
  }

  if (og.url) {
    $('meta[property="og:url"]').attr('content', og.url);
  }

  if (og.image) {
    $('meta[property="og:image"]').attr('content', og.image);
  }

  if (og.imageWidth === false) {
    $('meta[property="og:image:width"]').remove();
  } else if (og.imageWidth) {
    $('meta[property="og:image:width"]').attr('content', og.imageWidth);
  }

  if (og.imageHeight === false) {
    $('meta[property="og:image:height"]').remove();
  } else if (og.imageHeight) {
    $('meta[property="og:image:height"]').attr('content', og.imageHeight);
  }

  return $.html();
};
