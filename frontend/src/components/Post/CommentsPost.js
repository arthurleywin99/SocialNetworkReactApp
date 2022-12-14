import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Comment, Icon } from "semantic-ui-react";
import { deleteCommentPost } from "../../actions/postActions";
import { calculateTime } from "../../utils/utils";
import { Link } from "react-router-dom";

export default function CommentsPost({ comment, user, setComments, postId }) {
  const dispatch = useDispatch();
  const [disabled, setDisabled] = useState(false);

  const handleDelete = () => {
    dispatch(deleteCommentPost(postId, comment._id, setComments));
  };

  return (
    <>
      <Comment.Group>
        <Comment>
          <Comment.Avatar src={comment.user.profilePicUrl} />
          <Comment.Content>
            <Comment.Author as="a">
              <Link to={`/account/profile/${comment.user.username}`}>
                {comment.user.name}
              </Link>
            </Comment.Author>
            <Comment.Metadata>{calculateTime(comment.date)}</Comment.Metadata>
            <Comment.Text>{comment.text}</Comment.Text>
            <Comment.Actions>
              <Comment.Action>
                {(user.role === "root" || comment.user._id === user._id) && (
                  <Icon
                    disabled={disabled}
                    color="red"
                    name="trash"
                    onClick={handleDelete}
                  />
                )}
              </Comment.Action>
            </Comment.Actions>
          </Comment.Content>
        </Comment>
      </Comment.Group>
    </>
  );
}
