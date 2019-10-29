import { RoutePaths } from 'app/constants';
import * as pathToRegexp from 'path-to-regexp';

export const collectionToPath = pathToRegexp.compile(RoutePaths.COLLECTION);
export const bookDetailToPath = pathToRegexp.compile(RoutePaths.BOOK_DETAIL);
export const articleContentToPath = pathToRegexp.compile(RoutePaths.ARTICLE_CONTENT);
export const articleChannelToPath = pathToRegexp.compile(RoutePaths.ARTICLE_CHANNEL_DETAIL);
