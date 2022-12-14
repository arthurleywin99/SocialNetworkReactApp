import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Divider, Grid, Header, Image, List, Loader, Segment } from 'semantic-ui-react';
import { blockUser, unBlockUser } from '../../../actions/blockActions';
import { checkIsSent } from '../../../actions/chatActions';
import { followUser, unFollowUser } from '../../../actions/followActions';
import { BLOCK_USER_RESET, UNBLOCK_USER_RESET } from '../../../constants/blockConstants';
import { FOLLOW_USER_RESET, UNFOLLOW_USER_RESET } from '../../../constants/followerConstants';
import MessageModal from '../../Messages/MessageModal';

export default function ProfileHeader({
  isOwnAccount,
  profile,
  userFollowStats,
  userBlock,
  setUserBlock,
  setUserFollowStats,
  setFollowingLength,
  setBlockingLength,
  user,
  socket,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userFollow, loading: followUserLoading, error: followUserError } = useSelector((state) => state.followUser);
  const {
    success: unfollowSuccess,
    loading: unfollowUserLoading,
    error: unfollowUserError,
  } = useSelector((state) => state.unFollowUser);
  const { userBlock: userBlockObj, loading: blockUserLoading, error: blockUserError } = useSelector((state) => state.blockUser);
  const { success, loading: unblockUserLoading, error: unblockUserError } = useSelector((state) => state.unblockUser);

  const [loading, setLoading] = useState(false);
  const [showNewMessageModal, setShowNewMessageModel] = useState(false);
  const [isImFollowing, setIsImFollowing] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    if (userFollowStats) {
      const res =
        userFollowStats.following.length > 0 &&
        userFollowStats.following.filter((following) => following.user._id === profile.user._id).length > 0;
      setIsImFollowing(res);
    }
  }, [userFollowStats, profile.user._id]);

  useEffect(() => {
    if (userBlock) {
      const res = userBlock.blocks.length > 0 && userBlock.blocks.filter((block) => block.user._id === profile.user._id).length > 0;
      setIsBlocked(res);
    }
  }, [userBlock, profile.user._id]);

  const handleFollow = (isImFollowing) => {
    setLoading(true);
    if (isImFollowing) {
      dispatch(unFollowUser(profile.user._id));
    } else {
      dispatch(followUser(profile.user._id));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userFollow) {
      setFollowingLength((prev) => prev + 1);
      setUserFollowStats((prev) => ({
        ...prev,
        following: [...prev.following, { user: { ...userFollow } }],
      }));
      dispatch({ type: FOLLOW_USER_RESET });
    }
  }, [userFollow, setFollowingLength, setUserFollowStats, dispatch]);

  useEffect(() => {
    if (unfollowSuccess) {
      setFollowingLength((prev) => prev - 1);
      setUserFollowStats((prev) => ({
        ...prev,
        following: prev.following.filter((following) => following.user._id !== profile.user._id),
      }));
      dispatch({ type: UNFOLLOW_USER_RESET });
    }
  }, [unfollowSuccess, setFollowingLength, setUserFollowStats, profile.user._id, dispatch]);

  const handleBlock = (isBlocked) => {
    setLoading(true);
    if (!isBlocked) {
      const isExist =
        userFollowStats.following.length > 0 && userFollowStats.following.find((following) => following.user._id === profile.user._id);
      if (isExist) {
        dispatch(unFollowUser(profile.user._id));
      }
      dispatch(blockUser(profile.user._id));
    } else {
      dispatch(unBlockUser(profile.user._id));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userBlockObj) {
      setUserBlock((prev) => ({
        ...prev,
        blocks: [...prev.blocks, { user: { ...userBlockObj } }],
      }));
      setBlockingLength((prev) => prev + 1);
      dispatch({ type: BLOCK_USER_RESET });
    }
  }, [userBlock, setUserBlock, setBlockingLength, userBlockObj, dispatch]);

  useEffect(() => {
    if (success) {
      setUserBlock((prev) => ({
        ...prev,
        blocks: prev.blocks.filter((block) => block.user._id !== profile.user._id),
      }));
      setBlockingLength((prev) => prev - 1);
      dispatch({ type: UNBLOCK_USER_RESET });
    }
  }, [success, setUserBlock, setBlockingLength, profile.user._id, dispatch]);

  const handleSendMessage = async () => {
    const isSent = await checkIsSent(profile.user._id, user.token);
    isSent ? navigate(`/messages?message?${profile.user._id}`) : setShowNewMessageModel(true);
  };

  return (
    <>
      {followUserError || unfollowUserError || blockUserError || unblockUserError ? (
        <Loader />
      ) : (
        <>
          {showNewMessageModal && (
            <MessageModal
              setShowNewMessageModel={setShowNewMessageModel}
              showNewMessageModal={showNewMessageModal}
              profile={profile}
              user={user}
              socket={socket}
            />
          )}
          <Segment>
            <Grid stackable>
              <Grid.Column width={10}>
                <Grid.Row>
                  <Header as='h2' content={profile.user.name} style={{ marginTop: '5px' }} />
                </Grid.Row>

                <Grid.Row stretched>
                  {profile.bio}
                  <Divider hidden />
                </Grid.Row>

                <Grid.Row>
                  {profile.social ? (
                    <>
                      <List>
                        <List.Item>
                          <List.Icon name='mail' />
                          <List.Content content={profile.user.email} />
                        </List.Item>
                        {profile.social.facebook && (
                          <List.Item>
                            <List.Icon name='facebook' color='blue' />
                            <List.Content content={profile.social.facebook} style={{ color: 'blue' }} />
                          </List.Item>
                        )}
                        {profile.social.instagram && (
                          <List.Item>
                            <List.Icon name='instagram' color='red' />
                            <List.Content content={profile.social.instagram} style={{ color: 'red' }} />
                          </List.Item>
                        )}
                        {profile.social.youtube && (
                          <List.Item>
                            <List.Icon name='youtube' color='red' />
                            <List.Content content={profile.social.youtube} style={{ color: 'red' }} />
                          </List.Item>
                        )}
                        {profile.social.twitter && (
                          <List.Item>
                            <List.Icon name='twitter' color='red' />
                            <List.Content content={profile.social.twitter} style={{ color: 'red' }} />
                          </List.Item>
                        )}
                      </List>
                    </>
                  ) : (
                    <>Không có liên kết mạng xã hội</>
                  )}
                </Grid.Row>
              </Grid.Column>

              <Grid.Column width={6} stretched style={{ textAlign: 'center' }}>
                <Grid.Row>
                  <Image src={profile.user.profilePicUrl} avatar size='large' />
                </Grid.Row>
                <br />
                <Grid>
                  <Grid.Column width={8} stretched>
                    {!isOwnAccount && !isBlocked && (
                      <Button
                        compact
                        loading={followUserLoading || unfollowUserLoading}
                        disabled={loading}
                        content={isImFollowing ? 'ĐANG THEO DÕI' : 'THEO DÕI'}
                        icon={isImFollowing ? 'check circle' : 'add user'}
                        color={isImFollowing ? 'instagram' : 'twitter'}
                        onClick={() => {
                          handleFollow(isImFollowing);
                        }}
                      />
                    )}
                  </Grid.Column>
                  <Grid.Column width={8} stretched>
                    {!isOwnAccount && (
                      <Button
                        compact
                        loading={blockUserLoading || unblockUserLoading}
                        disabled={loading}
                        content={isBlocked ? 'BỎ CHẶN' : 'CHẶN'}
                        icon={isBlocked ? 'unlock' : 'lock'}
                        color='red'
                        onClick={() => {
                          handleBlock(isBlocked);
                        }}
                      />
                    )}
                  </Grid.Column>
                </Grid>
                <Divider hidden />
                {!isOwnAccount && !isBlocked && (
                  <Button compact content='NHẮN TIN' icon='facebook messenger' color='grey' onClick={handleSendMessage} />
                )}
              </Grid.Column>
            </Grid>
          </Segment>
        </>
      )}
    </>
  );
}
