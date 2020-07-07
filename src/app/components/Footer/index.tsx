import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ThemeProvider } from 'emotion-theming';

import { LinkItem, FooterLinks, CorpInfo } from 'app/constants/footer';
import { FooterTheme } from 'app/services/commonUI';
import { RidiSelectState } from 'app/store';
import { Actions as TrackingActions, DefaultTrackingParams } from 'app/services/tracking';
import { theme } from 'app/styles/theme';

import { SC, styles, FooterListKey, TopLinkDividerIndex } from './styles';

const FooterInfo: {
  key: FooterListKey;
  items: (LinkItem | string)[];
}[] = [
  {
    key: FooterListKey.TopLinks,
    items: [
      FooterLinks.DOWNLOAD,
      FooterLinks.GUIDE,
      FooterLinks.VOUCHER,
      FooterLinks.FAQ,
      FooterLinks.NEWS_LETTER,
    ],
  },
  {
    key: FooterListKey.SocialLinks,
    items: [FooterLinks.INSTA, FooterLinks.TWITTER, FooterLinks.FACEBOOK],
  },
  {
    key: FooterListKey.BizInfo,
    items: [
      CorpInfo.ADDRESS,
      CorpInfo.NAME,
      CorpInfo.CEO,
      CorpInfo.REGISTRATION,
      CorpInfo.MAIL_ORDER,
    ],
  },
  {
    key: FooterListKey.BottomLinks,
    items: [FooterLinks.CLOSING, FooterLinks.TERM, FooterLinks.PRIVACY, FooterLinks.YOUTH],
  },
];

const Footer: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const footerTheme = useSelector((state: RidiSelectState) => state.commonUI.footerTheme);

  const handleItemClick = (section: string) => {
    const trackingParams: DefaultTrackingParams = {
      section,
      index: 0,
      id: 0,
    };
    dispatch(TrackingActions.trackClick({ trackingParams }));
  };

  const renderFooterItem = (
    { to, href, label, icon: Icon, section, isBold }: LinkItem,
    key: FooterListKey,
  ) => {
    const itemLabel = Icon ? <Icon /> : isBold ? <strong>{label}</strong> : label;
    const onClickItem = useCallback(() => {
      section && handleItemClick(section);
    }, [section]);
    const props = {
      onClick: onClickItem,
      css: styles[`${key}_Item_Link`],
    };
    return to ? (
      <Link to={to} {...props}>
        {itemLabel}
      </Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {itemLabel}
      </a>
    );
  };
  const TopLinkDivider = SC[`${FooterListKey.TopLinks}_Item_Divider`];
  return (
    <ThemeProvider theme={footerTheme === FooterTheme.dark ? theme.dark : theme.light}>
      <SC.Footer>
        {FooterInfo.map(({ key, items }) => {
          const InfoList = SC[key];
          const InfoItem = SC[`${key}_Item`];
          return (
            <InfoList key={`Footer_${key}`}>
              {items.map((item, index) => (
                <>
                  {key === FooterListKey.TopLinks && index === TopLinkDividerIndex && (
                    <TopLinkDivider />
                  )}
                  <InfoItem key={`Footer_${key}-${index}`}>
                    {typeof item === 'string' ? item : renderFooterItem(item, key)}
                  </InfoItem>
                </>
              ))}
            </InfoList>
          );
        })}
        <SC.Copyright>© RIDI Corp.</SC.Copyright>
      </SC.Footer>
    </ThemeProvider>
  );
};

export const ConnectedFooter = React.memo(Footer);
