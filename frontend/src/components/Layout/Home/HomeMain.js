import React, { useEffect, useRef, useState } from 'react';
import CreatePost from '../../Post/CreatePost';
import CardPost from '../../Post/CardPost';
import { NoPosts } from '../NoData';
import { Loader, Segment } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPostsList } from '../../../actions/postActions';
import { getUserInfo } from '../../../actions/profileActions';
import { PostDeleteToastr } from '../Toastr';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PlaceHolderPosts, EndMessage } from '../PlaceHolderGroup';
import MessageNotificationModal from '../../Common/MessageNotificationModal';
import io from 'socket.io-client';
import NotificationPortal from '../../Common/NotificationPortal';

export default function HomeMain() {
  const dispatch = useDispatch();
  const { loading: getAllPostLoading, error: getAllPostError } = useSelector((state) => state.getAllPost);
  const { userInfo, loading: userLoginLoading, error: userLoginError } = useSelector((state) => state.userLogin);

  const [postList, setPostList] = useState([]);
  const [showToastr, setShowToastr] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [newMessageReceived, setNewMessageReceived] = useState(null);
  const [showNewMessageModal, setShowNewMessageModel] = useState(false);
  const [newNotification, setNewNotification] = useState(null);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  const socket = useRef();

  useEffect(() => {
    document.title = `Xin chào, ${[...userInfo.name.split(' ')].at(-1)}`;
    if (!socket.current) {
      socket.current = io(process.env.REACT_APP_BACKEND_URL);
    }

    if (socket.current) {
      socket.current.emit('join', { userId: userInfo._id });

      socket.current.on('newMsgReceived', async ({ newMsg }) => {
        const { name, profilePicUrl } = await getUserInfo(newMsg.sender, userInfo.token);

        if (userInfo.newMessagePopup) {
          setNewMessageReceived({
            ...newMsg,
            senderName: name,
            senderProfilePic: profilePicUrl,
          });
          setShowNewMessageModel(true);
        }
      });

      socket.current.on('newNotificationReceived', ({ name, profilePicUrl, username, postId }) => {
        setNewNotification({ name, profilePicUrl, username, postId });
        setShowNotificationPopup(true);
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
    dispatch(getAllPostsList(1, setHasMore, setPostList, setPageNumber));
  }, []);

  useEffect(() => {
    showToastr && setTimeout(() => setShowToastr(false), 3000);
  }, [showToastr]);

  const fetchDataOnScroll = () => {
    dispatch(getAllPostsList(pageNumber, setHasMore, setPostList, setPageNumber));
  };

  return (
    <>
      {getAllPostLoading || userLoginLoading ? (
        <Loader />
      ) : (
        <>
          {showNotificationPopup && newNotification && (
            <NotificationPortal
              newNotification={newNotification}
              showNotificationPopup={showNotificationPopup}
              setShowNotificationPopup={setShowNotificationPopup}
            />
          )}
          {showToastr && <PostDeleteToastr />}
          {showNewMessageModal && newMessageReceived && (
            <MessageNotificationModal
              socket={socket}
              setShowNewMessageModel={setShowNewMessageModel}
              showNewMessageModal={showNewMessageModal}
              newMessageReceived={newMessageReceived}
              user={userInfo}
            />
          )}
          <Segment>
            <CreatePost user={userInfo} setPostList={setPostList} />
            {postList.length === 0 || getAllPostError || userLoginError ? (
              <NoPosts />
            ) : (
              <InfiniteScroll
                hasMore={hasMore}
                next={fetchDataOnScroll}
                loader={<PlaceHolderPosts />}
                endMessage={<EndMessage />}
                dataLength={postList.length}
              >
                {postList.map((post) => (
                  <CardPost
                    key={post._id}
                    post={post}
                    user={userInfo}
                    setPostList={setPostList}
                    setShowToastr={setShowToastr}
                    socket={socket}
                  />
                ))}
              </InfiniteScroll>
            )}
          </Segment>
        </>
      )}
    </>
  );
}
