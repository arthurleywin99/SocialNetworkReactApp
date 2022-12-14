import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Feed, Icon, Image, Segment, TransitionablePortal } from 'semantic-ui-react';
import { calculateTime, newMsgSound } from '../../utils/utils';

function NotificationPortal({ newNotification, showNotificationPopup, setShowNotificationPopup }) {
  const navigate = useNavigate();
  const { name, profilePicUrl, username, postId } = newNotification;

  return (
    <TransitionablePortal
      transition={{ animation: 'fade left', duration: '500' }}
      onClose={() => showNotificationPopup && setShowNotificationPopup(false)}
      onOpen={newMsgSound}
      open={showNotificationPopup}
    >
      <Segment style={{ right: '5%', position: 'fixed', top: '10%', zIndex: 1000 }}>
        <Icon
          name='close'
          size='large'
          style={{ float: 'right', cursor: 'pointer' }}
          onClick={() => setShowNotificationPopup(false)}
        />

        <Feed>
          <Feed.Event>
            <Feed.Label>
              <Image src={profilePicUrl} avatar />
            </Feed.Label>
            <Feed.Content>
              <Feed.Summary>
                <Feed.User onClick={() => navigate(`/account/profile/${username}`)}>{name} </Feed.User> đã
                thích một <Link to={`/post/${postId}`}>bài viết</Link>
                <Feed.Date>{calculateTime(Date.now())}</Feed.Date>
              </Feed.Summary>
            </Feed.Content>
          </Feed.Event>
        </Feed>
      </Segment>
    </TransitionablePortal>
  );
}

export default NotificationPortal;
