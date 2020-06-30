import Colors from 'app/styles/colors';
import { rgba } from 'app/utils/colors';

export type Theme = {
  footer: {
    color: {
      footerBackground: string;
      topLink: string;
      topLinkDivider: string;
      socialLink: string;
      bizInfo: string;
      bottomLink: string;
      bottomLinkDivider: string;
      copyright: string;
    };
  };
};

export const theme = {
  light: {
    footer: {
      color: {
        footerBackground: rgba(Colors.lightsteelblue_5, 0.5),
        topLink: Colors.slategray_80,
        topLinkDivider: Colors.slategray_30,
        socialLink: Colors.slategray_60,
        bizInfo: Colors.slategray_60,
        bottomLink: Colors.slategray_60,
        bottomLinkDivider: Colors.slategray_10,
        copyright: Colors.slategray_60,
      },
    },
  },
  dark: {
    footer: {
      color: {
        footerBackground: Colors.bluegray_100,
        topLink: Colors.slategray_40,
        topLinkDivider: Colors.slategray_40,
        socialLink: Colors.slategray_40,
        bizInfo: Colors.slategray_60,
        bottomLink: Colors.slategray_40,
        bottomLinkDivider: Colors.slategray_80,
        copyright: Colors.slategray_60,
      },
    },
  },
};
