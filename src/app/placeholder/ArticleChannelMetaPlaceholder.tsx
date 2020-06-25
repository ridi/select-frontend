import styled from '@emotion/styled';
import React from 'react';

import Media from 'app/styles/mediaQuery';
import { skeleton } from 'app/styles/skeleton';
import Colors from 'app/styles/colors';

const Channel = {
  Wrapper: styled.li`
    padding: 20px 0;
    border-bottom: 1px solid ${Colors.slategray_10};
    @media ${Media.PC} {
      padding: 30px 0;
    }
  `,
  Info: styled.div`
    display: flex;
    align-items: center;
  `,
  Thunmbnail: styled.div`
    ${skeleton}
    margin-right: 10px;
    width: 40px;
    height: 40px;
    border: solid 1px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    border-radius: 999px;
  `,
  Meta: styled.div`
    min-width: 0;
    padding-right: 10px;
  `,
  Title: styled.div`
    ${skeleton}
    display: block;
    width: 120px;
    height: 17px;
    @media ${Media.MOBILE} {
      width: 70px;
    }
    @media ${Media.PC} {
      width: 180px;
    }
  `,
  Description: styled.div`
    ${skeleton}
    display: block;
    margin-top: 2px;
    height: 15px;
    width: 200px;
    @media ${Media.MOBILE} {
      width: 100px;
    }
    @media ${Media.PC} {
      width: 350px;
    }
  `,
  FollowButton: styled.div`
    ${skeleton}
    display: inline-block;
    margin-left: auto;
    min-width: 76px;
    height: 30px;
    border-radius: 3px;
    border: 0;
  `,
};

export const ArticleChannelMetaPlaceholder: React.FunctionComponent = () => (
  <Channel.Wrapper>
    <Channel.Info>
      <Channel.Thunmbnail />
      <Channel.Meta>
        <Channel.Title />
        <Channel.Description />
      </Channel.Meta>
      <Channel.FollowButton />
    </Channel.Info>
  </Channel.Wrapper>
);
