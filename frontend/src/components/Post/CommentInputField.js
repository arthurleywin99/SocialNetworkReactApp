import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "semantic-ui-react";
import { commentPost } from "../../actions/postActions";

export default function CommentInputField({ user, postId, setComments }) {
  const dispatch = useDispatch();

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const commentCreate = useSelector((state) => state.commentPost);
  const { newComment } = commentCreate;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(commentPost(postId, text, setComments, setText));
  };

  useEffect(() => {
    if (newComment) {
      setLoading(false);
    }
  }, [newComment]);

  return (
    <>
      <Form reply onSubmit={handleSubmit}>
        <Form.Input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          placeholder="Thêm bình luận"
          action={{
            color: "blue",
            icon: "edit",
            loading: loading,
            disabled: text === "" || loading,
          }}
        />
      </Form>
    </>
  );
}
