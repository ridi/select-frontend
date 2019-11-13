import { ArticleChannel } from 'app/services/articleChannel';
import { articleChannelToPath } from 'app/utils/toPath';
import * as React from 'react';
import { Link } from 'react-router-dom';

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
              <Link
                to={articleChannelToPath({channelId: channel.id})}
                className="FollowingChannel_Link"
              >
                <div className="ChannelItem">
                  <img src={channel.thumbnailUrl} className="ChannelThumbnail" alt={channel.displayName} />
                  <span className="ChannelName">{channel.displayName}</span>
                </div>
              </Link>
            </li>
          ))
        }
      </ul>
    </section>
  );
};
