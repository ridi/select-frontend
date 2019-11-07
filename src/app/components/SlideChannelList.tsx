import { ArticleChannel } from 'app/services/articleChannel';
import * as React from 'react';

interface SlideChannelListProps {
  channels: ArticleChannel[];
}

export const SlideChannelList: React.FunctionComponent<SlideChannelListProps> = (props) => {
  const { channels } = props;
  return (
    <section>
      <ul className="FollowingChannelList">
        {
          channels.map((channel, idx) => (
            <li key={idx} className="FollowingChannel">
              <div className="ChannelItem">
                <img src={channel.thumbnailUrl} className="ChannelThumbnail" />
                <span className="ChannelName">{channel.name}</span>
              </div>
            </li>
          ))
        }
      </ul>
    </section>
  );
};
