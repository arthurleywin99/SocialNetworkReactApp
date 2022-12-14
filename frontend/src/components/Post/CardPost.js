import React, { useEffect, useState } from 'react';
import { Card, Icon, Image, Divider, Segment, Button, Popup, Header, Modal, Loader } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import CommentsPost from './CommentsPost';
import CommentInputField from './CommentInputField';
import { calculateTime } from '../../utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost, likePost } from '../../actions/postActions';
import { sendReport } from '../../actions/reportActions';
import LikesList from './LikesList';
import ImageModal from './ImageModal';
import NoImageModal from './NoImageModal';
import ReportModal from './ReportModal';
import { ReportSentToastr } from '../Layout/Toastr';

export default function CardPost({ post, user, setPostList, setShowToastr, socket }) {
  const dispatch = useDispatch();

  const { success, loading, error } = useSelector((state) => state.sendReport);

  const [likes, setLikes] = useState(post.likes);
  const [describe, setDescribe] = useState(null);
  const isLiked = likes.length > 0 && likes.filter((like) => like.user === user._id).length > 0;
  const [comments, setComments] = useState(post.comments);
  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const getImageId = (imageURL) => imageURL.split('/').reverse()[0].split('.')[0];

  const handleDelete = () => {
    dispatch(deletePost(post._id, setPostList, setShowToastr, getImageId(post.picUrl)));
  };

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

  const handleReport = () => {
    setShowReportModal(true);
  };

  const handleSendReport = () => {
    dispatch(sendReport(post._id, describe));
  };

  useEffect(() => {
    if (success) {
      setShowReportModal(false);
    }
  }, [success]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Loader />
      ) : (
        <>
          {success && <ReportSentToastr />}
          {showModal && (
            <>
              <Modal open={showModal} closeIcon closeOnDimmerClick onClose={() => setShowModal(false)}>
                <Modal.Content>
                  {post.picUrl ? (
                    <ImageModal
                      post={post}
                      user={user}
                      setLikes={setLikes}
                      likes={likes}
                      isLiked={isLiked}
                      comments={comments}
                      setComments={setComments}
                    />
                  ) : (
                    <NoImageModal
                      post={post}
                      user={user}
                      setLikes={setLikes}
                      likes={likes}
                      isLiked={isLiked}
                      comments={comments}
                      setComments={setComments}
                    />
                  )}
                </Modal.Content>
              </Modal>
            </>
          )}

          {showReportModal && (
            <ReportModal
              showReportModal={showReportModal}
              setShowReportModal={setShowReportModal}
              handleSendReport={handleSendReport}
              setDescribe={setDescribe}
            />
          )}

          <Segment>
            <Card color='teal' fluid>
              {post.picUrl && (
                <Image
                  src={post.picUrl}
                  style={{ cursor: 'pointer' }}
                  floated='left'
                  wrapped
                  ui={false}
                  alt='PostImage'
                  onClick={() => setShowModal(true)}
                />
              )}

              <Card.Content>
                <Image floated='left' src={post.user.profilePicUrl} avatar circular />

                {user.role === 'root' || post.user._id === user._id ? (
                  <>
                    <Popup
                      on='click'
                      position='top right'
                      trigger={<Image src='/deleteIcon.svg' style={{ cursor: 'pointer' }} size='mini' floated='right' />}
                    >
                      <Header as='h4' content='Bạn có chắc xoá?' />
                      <p>Hành động này không thể quay lại!</p>
                      <Button color='red' icon='trash' content='Xoá' onClick={handleDelete} />
                    </Popup>
                  </>
                ) : (
                  <>
                    <Button icon='ban' floated='right' size='mini' color='red' onClick={handleReport} />
                  </>
                )}

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
                <Icon name={isLiked ? 'heart' : 'heart outline'} color='red' style={{ cursor: 'pointer' }} onClick={handleLikePost} />

                <LikesList postId={post._id} trigger={likes.length > 0 && <span className='spanLikesList'>{likes.length}</span>} />

                <Icon name='comment outline' style={{ marginLeft: '7px' }} color='blue' />

                <span>{comments.length}</span>

                {comments.length > 0 &&
                  comments.map(
                    (comment, i) =>
                      i < 3 && (
                        <CommentsPost key={comment._id} comment={comment} postId={post._id} user={user} setComments={setComments} />
                      )
                  )}

                {comments.length > 3 && <Button content='Xem thêm' color='teal' basic circular onClick={() => setShowModal(true)} />}

                <Divider hidden />

                <CommentInputField user={user} postId={post._id} setComments={setComments} />
              </Card.Content>
            </Card>
          </Segment>
        </>
      )}
    </>
  );
}
