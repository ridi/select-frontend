import { asyncComponent } from 'app/utils/asyncComponent';

export const ErrorPage = asyncComponent(() => import('./ErrorPage'));
export const BookDetail = asyncComponent(() => import('./BookDetail'));
export const Category = asyncComponent(() => import('./Category'));
export const Charts = asyncComponent(() => import('./Charts'));
export const Home = asyncComponent(() => import('./Home'));
export const ManageSubscription = asyncComponent(() => import('./ManageSubscription'));
export const MySelect = asyncComponent(() => import('./MySelect'));
export const MySelectHistory = asyncComponent(() => import('./MySelectHistory'));
export const NewReleases = asyncComponent(() => import('./NewReleases'));
export const OrderHistory = asyncComponent(() => import('./OrderHistory'));
export const SearchResult = asyncComponent(() => import('./SearchResult'));
export const Collection = asyncComponent(() => import('./Collection'));
export const Settings = asyncComponent(() => import('./Settings'));
export const Intro = asyncComponent(() => import('./Intro'));
export const NotAvailableBook = asyncComponent(() => import('./NotAvailableBook'));
export const ClosingReservedBooks = asyncComponent(() => import('./ClosingReservedBooks'));
export const WrongLocation = asyncComponent(() => import('./WrongLocation'));
export const Voucher = asyncComponent(() => import('./Voucher'));

export const ArticleHome = asyncComponent(() => import('./ArticleHome'));
export const ArticleFollowing = asyncComponent(() => import('./ArticleFollowing'));
export const ArticleChannelList = asyncComponent(() => import('./ArticleChannelList'));
export const ArticleFavorite = asyncComponent(() => import('./ArticleFavorite'));
export const ArticleChannelDetail = asyncComponent(() => import('./ArticleChannelDetail'));
export const ArticleContent = asyncComponent(() => import('./ArticleContent'));
