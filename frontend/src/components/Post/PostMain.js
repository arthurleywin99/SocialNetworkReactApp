import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Card, Container, Divider, Icon, Image, Loader, Segment } from 'semantic-ui-react';
import { getPostById, likePost } from '../../actions/postActions';
import CommentInputField from '../../components/Post/CommentInputField';
import CommentsPost from '../../components/Post/CommentsPost';
import LikesList from '../../components/Post/LikesList';
import { calculateTime } from '../../utils/utils';
import io from 'socket.io-client';
import { getUserInfo } from '../../actions/profileActions';
import MessageNotificationModal from '../Common/MessageNotificationModal';
import NotificationPortal from '../Common/NotificationPortal';

export default function PostMain() {
  const dispatch = useDispatch();
  const location = useLocation();

  const { userInfo: user, loading: userLoginLoading, error: userLoginError } = useSelector((state) => state.userLogin);
  const { data, loading: getPostByIdLoading, error: getPostByIdError } = useSelector((state) => state.getPostById);
  const { success, loading: likePostLoading, error: likePostError } = useSelector((state) => state.likePost);

  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [newMessageReceived, setNewMessageReceived] = useState(null);
  const [showNewMessageModal, setShowNewMessageModel] = useState(false);
  const [newNotification, setNewNotification] = useState(null);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  const socket = useRef();

  const postIdQuery = location.pathname.split('/').reverse()[0];

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

  useEffect(() => {
    dispatch(getPostById(postIdQuery));
  }, [dispatch, postIdQuery]);

  useEffect(() => {
    if (data) {
      setPost(data);
      setLikes(data.likes);
      setComments(data.comments);
    }
  }, [data]);

  useEffect(() => {
    const res = likes.length > 0 && likes.filter((like) => like.user === user._id).length > 0;
    setIsLiked(res);
  }, [likes, user._id]);

  const handleLikePost = () => {
    if (socket.current) {
      socket.current.emit('likePost', {
        postId: post._id,
        userId: user._id,
        like: !isLiked,
      });

      socket.current.on('postLiked', () => {
        if (isLiked) {
          setLikes((prev) => prev.filter((like) => like.user !== user._id));
        } else {
          setLikes((prev) => [...prev, { user: user._id }]);
        }
      });
    } else {
      dispatch(likePost(post._id, !isLiked));
    }
  };

  useEffect(() => {
    if (success) {
      if (isLiked) {
        setLikes((prev) => [...prev, { user: user._id }]);
      } else {
        setLikes((prev) => prev.filter((like) => like.user !== user._id));
      }
    }
  }, [success, isLiked, user._id]);

  return (
    <>
      {userLoginLoading || getPostByIdLoading || likePostLoading ? (
        <Loader />
      ) : userLoginError || getPostByIdError || likePostError ? (
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
          {showNewMessageModal && newMessageReceived && (
            <MessageNotificationModal
              socket={socket}
              setShowNewMessageModel={setShowNewMessageModel}
              showNewMessageModal={showNewMessageModal}
              newMessageReceived={newMessageReceived}
              user={user}
            />
          )}
          <Container>
            <Segment>
              {post && (
                <Card color='teal' fluid>
                  {post.picUrl && (
                    <Image src={post.picUrl} style={{ cursor: 'pointer' }} floated='left' wrapped ui={false} alt='PostImage' />
                  )}

                  <Card.Content>
                    <Image floated='left' src={post.user.profilePicUrl} avatar circular />
                    <Card.Header>
                      <Link to={`/account/profile/${post.user.username}`}>
                        <p>{post.user.name}</p>
                      </Link>
                    </Card.Header>

                    <Card.Meta>{calculateTime(post.createdAt)}</Card.Meta>

                    {post.location && <Card.Meta content={post.location} />}

                    <Card.Description
                      style={{
                        fontSize: '17px',
                        letterSpacing: '0.1px',
                        wordSpacing: '0.5px',
                      }}
                    >
                      {post.text}
                    </Card.Description>
                  </Card.Content>

                  <Card.Content extra>
                    <Icon
                      name={isLiked ? 'heart' : 'heart outline'}
                      color='red'
                      style={{ cursor: 'pointer' }}
                      onClick={handleLikePost}
                    />

                    <LikesList
                      postId={post._id}
                      trigger={
                        likes.length > 0 && (
                          <span className='spanLikesList'>{`${likes.length} ${likes.length === 1 ? 'like' : 'likes'}`}</span>
                        )
                      }
                    />

                    <Icon name='comment outline' style={{ marginLeft: '7px' }} color='blue' />

                    {comments.length > 0 &&
                      comments.map((comment) => (
                        <CommentsPost key={comment._id} comment={comment} postId={post._id} user={user} setComments={setComments} />
                      ))}

                    <Divider hidden />
                    <CommentInputField user={user} postId={post._id} setComments={setComments} />
                  </Card.Content>
                </Card>
              )}
            </Segment>
          </Container>
        </>
      )}
    </>
  );
}
