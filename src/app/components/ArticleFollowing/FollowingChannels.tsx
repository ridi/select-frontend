import { FollowingChannelMockUp } from 'app/utils/mock';
import * as React from 'react';

export const FollowingChannels: React.FunctionComponent = () => {
  return (
    <section>
      <ul className="FollowingChannelList">
        {
          FollowingChannelMockUp.map((data, idx) => (
            <li key={idx} className="FollowingChannel">
              <div className="ChannelItem">
                <img src={data.channelThumbnail} className="ChannelThumbnail" />
                <span className="ChannelName">{data.channelName}</span>
              </div>
            </li>
          ))
        }
      </ul>
    </section>
  );
};
