import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NoProfile, NoProfilePosts } from '../NoData';
import { checkIsBlocked, getAllBlocks, getFollower, getProfile, getUserInfo, getUserPosts } from '../../../actions/profileActions';
import { Grid, Loader } from 'semantic-ui-react';
import { PlaceHolderPosts } from '../PlaceHolderGroup';
import CardPost from '../../Post/CardPost';
import ProfileMenuTabs from './ProfileMenuTabs';
import ProfileHeader from './ProfileHeader';
import { PostDeleteToastr } from '../Toastr';
import Followers from './Followers';
import Following from './Following';
import UpdateProfile from './UpdateProfile';
import Blocking from './Blocking';
import { useLocation } from 'react-router-dom';
import Settings from './Settings';
import io from 'socket.io-client';
import MessageNotificationModal from '../../Common/MessageNotificationModal';
import NotificationPortal from '../../Common/NotificationPortal';

export default function ProfileMain() {
  const dispatch = useDispatch();
  const location = useLocation();

  const usernameQuery = [...location.pathname.split('/')].at(-1);

  const { userInfo: user, loading: userLoginLoading, error: userLoginError } = useSelector((state) => state.userLogin);
  const { result, loading: checkBlockLoading, error: checkBlockError } = useSelector((state) => state.checkIsBlocked);
  const { data, loading: getProfileLoading, error: getProfileError } = useSelector((state) => state.getProfile);
  const { followObj, loading: getFollowerLoading, error: getFollwerError } = useSelector((state) => state.getFollower);
  const { posts, loading: getUserPostsLoading, error: getUserPostsError } = useSelector((state) => state.getUserPosts);
  const { blockObj, loading: getAllBlockLoading, error: getBlockError } = useSelector((state) => state.getAllBlock);

  const [profile, setProfile] = useState(null);
  const [activeItem, setActiveItem] = useState('profile');
  const [userFollowStats, setUserFollowStats] = useState(null);
  const [userBlock, setUserBlock] = useState(null);
  const [postList, setPostList] = useState([]);
  const [followersLength, setFollowersLength] = useState(0);
  const [followingLength, setFollowingLength] = useState(0);
  const [blockingLength, setBlockingLength] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showToastr, setShowToastr] = useState(false);
  const [newMessageReceived, setNewMessageReceived] = useState(null);
  const [showNewMessageModal, setShowNewMessageModel] = useState(false);
  const [newNotification, setNewNotification] = useState(null);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

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

  const handleItemClick = (item) => setActiveItem(item);
  const [isOwnAccount, setIsOwnAccount] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(checkIsBlocked(usernameQuery));
    dispatch(getProfile(usernameQuery));
    dispatch(getFollower(user._id));
    dispatch(getUserPosts(usernameQuery));
    dispatch(getAllBlocks(user._id));
  }, [dispatch, usernameQuery, user._id]);

  useEffect(() => {
    if (data) {
      setProfile(data.profile);
    }
  }, [data]);

  useEffect(() => {
    if (followObj) {
      setUserFollowStats(followObj);
      setFollowersLength(followObj.followers.length);
      setFollowingLength(followObj.following.length);
    }
  }, [followObj]);

  useEffect(() => {
    if (profile) {
      setIsOwnAccount(usernameQuery === user.username);
    }
  }, [usernameQuery, profile, user.username]);

  useEffect(() => {
    if (posts) {
      setPostList(posts);
    }
  }, [posts]);

  useEffect(() => {
    if (blockObj) {
      setUserBlock(blockObj);
      setBlockingLength(blockObj.blocks.length);
    }
    setLoading(false);
  }, [blockObj]);

  useEffect(() => {
    showToastr && setTimeout(() => setShowToastr(false), 3000);
  }, [showToastr]);

  return (
    <>
      {userLoginLoading ||
      checkBlockLoading ||
      getProfileLoading ||
      getFollowerLoading ||
      getUserPostsLoading ||
      getAllBlockLoading ? (
        <Loader />
      ) : userLoginError || checkBlockError || getProfileError || getFollwerError || getUserPostsError || getBlockError ? (
        <NoProfile />
      ) : result && result.message === 'Blocked' ? (
        <NoProfile />
      ) : (
        <>
          {showNotificationPopup && newNotification && (
            <NotificationPortal
              newNotification={newNotification}
              showNotificationPopup={showNotificationPopup}
              setShowNotificationPopup={setShowNotificationPopup}
            />
          )}
          {showNewMessageModal && newMessageReceived && (
            <MessageNotificationModal
              socket={socket}
              setShowNewMessageModel={setShowNewMessageModel}
              showNewMessageModal={showNewMessageModal}
              newMessageReceived={newMessageReceived}
              user={user}
            />
          )}
          <>
            {showToastr && <PostDeleteToastr />}
            <Grid stackable>
              <Grid.Row>
                <Grid.Column>
                  {userFollowStats && userBlock && (
                    <ProfileMenuTabs
                      activeItem={activeItem}
                      handleItemClick={handleItemClick}
                      followersLength={followersLength}
                      followingLength={followingLength}
                      blockingLength={blockingLength}
                      isOwnAccount={isOwnAccount}
                    />
                  )}
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column>
                  {activeItem === 'profile' && (
                    <>
                      {profile && userFollowStats && userBlock && (
                        <ProfileHeader
                          isOwnAccount={isOwnAccount}
                          profile={profile}
                          userFollowStats={userFollowStats}
                          userBlock={userBlock}
                          setUserBlock={setUserBlock}
                          setUserFollowStats={setUserFollowStats}
                          setFollowingLength={setFollowingLength}
                          setBlockingLength={setBlockingLength}
                          user={user}
                          socket={socket}
                        />
                      )}
                      {loading === true ? (
                        <PlaceHolderPosts />
                      ) : (
                        <>
                          {postList.length > 0 ? (
                            postList.map((post) => (
                              <CardPost
                                key={post._id}
                                post={post}
                                user={user}
                                setPostList={setPostList}
                                setShowToastr={setShowToastr}
                              />
                            ))
                          ) : (
                            <NoProfilePosts />
                          )}
                        </>
                      )}
                    </>
                  )}
                  {activeItem === 'followers' && (
                    <>
                      {profile && userFollowStats && (
                        <Followers userFollowStats={userFollowStats} profile={profile} setActiveItem={setActiveItem} />
                      )}
                    </>
                  )}
                  {activeItem === 'following' && (
                    <>
                      {profile && userFollowStats && (
                        <Following userFollowStats={userFollowStats} profile={profile} setActiveItem={setActiveItem} />
                      )}
                    </>
                  )}
                  {activeItem === 'block' && (
                    <>{profile && userBlock && <Blocking userBlock={userBlock} profile={profile} setActiveItem={setActiveItem} />}</>
                  )}
                  {activeItem === 'updateProfile' && <UpdateProfile Profile={profile} />}
                  {activeItem === 'settings' && <Settings />}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </>
        </>
      )}
    </>
  );
}
