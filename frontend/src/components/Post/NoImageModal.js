import React from 'react';
import { Modal, Grid, Image, Card, Icon, Divider } from 'semantic-ui-react';
import CommentsPost from './CommentsPost';
import CommentInputField from './CommentInputField';
import { calculateTime } from '../../utils/utils';
import { likePost } from '../../actions/postActions';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import LikesList from './LikesList';
export default function NoImageModal({ post, user, setLikes, likes, isLiked, comments, setComments }) {
  const dispatch = useDispatch();
  const handleLikePost = () => {
    dispatch(likePost(post._id, setLikes, !isLiked));
  };

  return (
    <>
      <Card fluid>
        <Card.Content>
          <Image floated='left' avatar src={post.user.profilePicUrl} />

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

          <Divider hidden />
          <div
            style={{
              overflow: 'auto',
              height: comments.length > 2 ? '240px' : '60px',
              marginBottom: '8px',
            }}
          >
            {comments.length > 0 &&
              comments.map((comment, i) => (
                <CommentsPost key={comment._id} comment={comment} postId={post._id} user={user} setComments={setComments} />
              ))}
          </div>

          <CommentInputField user={user} postId={post._id} setComments={setComments} />
        </Card.Content>
      </Card>
    </>
  );
}
