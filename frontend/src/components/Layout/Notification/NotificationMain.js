import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../../../actions/profileActions';
import { Container, Divider, Feed, Segment } from 'semantic-ui-react';
import { getNotificationList } from '../../../actions/notificationActions';
import { NoNotifications } from '../../Layout/NoData';
import LikeNotificationComponent from '../../Layout/Notification/LikeNotificationComponent';
import CommentNotificationComponent from '../../Layout/Notification/CommentNotificationComponent';
import FollowerNotificationComponent from '../../Layout/Notification/FollowerNotificationComponent';
import io from 'socket.io-client';
import MessageNotificationModal from '../../Common/MessageNotificationModal';
import Spinner from '../Spinner';

export default function NotificationMain() {
  const dispatch = useDispatch();

  const { userInfo: user, loading: userLoginLoading, error: userLoginError } = useSelector((state) => state.userLogin);
  const {
    notificationList,
    loading: getNotificationsLoading,
    error: getNotificationsError,
  } = useSelector((state) => state.getNotifications);

  const [newMessageReceived, setNewMessageReceived] = useState(null);
  const [showNewMessageModal, setShowNewMessageModel] = useState(false);

  const socket = useRef();

  useEffect(() => {
    document.title = `Xin chào, ${[...user.name.split(' ')].at(-1)}`;
    if (!socket.current) {
      socket.current = io(process.env.REACT_APP_BACKEND_URL);
    }

    if (socket.current) {
      socket.current.emit('join', { userId: user._id });

      socket.current.on('newMsgReceived', async ({ newMsg }) => {
        const { name, profilePicUrl } = await getUserInfo(newMsg.sender, user.token);

        if (user.newMessagePopup) {
          setNewMessageReceived({
            ...newMsg,
            senderName: name,
            senderProfilePic: profilePicUrl,
          });
          setShowNewMessageModel(true);
        }
      });
    }

    return () => {
      if (socket.current) {
        socket.current.emit('disconnected');
        socket.current.off();
      }
    };
  }, []);

  useEffect(() => {
    dispatch(getNotificationList());
  }, [dispatch]);

  return (
    <>
      {userLoginLoading || getNotificationsLoading ? (
        <Spinner />
      ) : userLoginError || getNotificationsError ? (
        <NoNotifications />
      ) : (
        <>
          {showNewMessageModal && newMessageReceived && (
            <MessageNotificationModal
              socket={socket}
              setShowNewMessageModel={setShowNewMessageModel}
              showNewMessageModal={showNewMessageModal}
              newMessageReceived={newMessageReceived}
              user={user}
            />
          )}
          <Container style={{ marginTop: '1.5rem' }}>
            {notificationList.length > 0 ? (
              <Segment color='teal' raised>
                <div
                  style={{
                    maxHeight: '40rem',
                    overflow: 'auto',
                    height: '40rem',
                    position: 'relative',
                    width: '100%',
                  }}
                >
                  <Feed size='small'>
                    {notificationList.map((notification) => (
                      <div key={notification._id}>
                        {notification.type === 'newLike' && notification.post !== null && (
                          <LikeNotificationComponent key={notification._id} notification={notification} />
                        )}

                        {notification.type === 'newComment' && notification.post !== null && (
                          <CommentNotificationComponent
                            key={notification._id}
                            user={user}
                            notification={notification}
                          />
                        )}
                        {notification.type === 'newFollower' && notification.post !== null && (
                          <FollowerNotificationComponent key={notification._id} notification={notification} />
                        )}
                      </div>
                    ))}
                  </Feed>
                </div>
              </Segment>
            ) : (
              <NoNotifications />
            )}
            <Divider hidden />
          </Container>
        </>
      )}
    </>
  );
}
