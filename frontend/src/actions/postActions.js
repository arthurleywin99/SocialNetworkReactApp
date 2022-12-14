import {
  POST_CREATE_FAIL,
  POST_CREATE_REQUEST,
  POST_CREATE_SUCCESS,
  POST_DELETE_FAIL,
  POST_DELETE_REQUEST,
  POST_DELETE_SUCCESS,
  POST_GET_ALL_FAIL,
  POST_GET_ALL_REQUEST,
  POST_GET_ALL_SUCCESS,
  POST_LIKE_REQUEST,
  POST_LIKE_SUCCESS,
  POST_LIKE_FAIL,
  POST_UNLIKE_REQUEST,
  POST_UNLIKE_SUCCESS,
  POST_UNLIKE_FAIL,
  POST_CREATE_COMMENT_REQUEST,
  POST_CREATE_COMMENT_SUCCESS,
  POST_CREATE_COMMENT_FAIL,
  POST_DELETE_COMMENT_SUCCESS,
  POST_DELETE_COMMENT_REQUEST,
  POST_DELETE_COMMENT_FAIL,
  POST_GET_LIKES_LIST_REQUEST,
  POST_GET_LIKES_LIST_FAIL,
  POST_GET_LIKES_LIST_SUCCESS,
  POST_GET_BY_ID_REQUEST,
  POST_GET_BY_ID_SUCCESS,
  POST_GET_BY_ID_FAIL,
} from '../constants/postConstants';
import Axios from 'axios';
import {
  UTIL_DELETE_IMAGE_FAIL,
  UTIL_DELETE_IMAGE_REQUEST,
  UTIL_DELETE_IMAGE_SUCCESS,
} from '../constants/utilConstants';

export const getAllPostsList = (pageNum, setHasMore, setPostList, setPageNumber) => async (dispatch, getState) => {
  dispatch({ type: POST_GET_ALL_REQUEST });
  const {
    userLogin: { userInfo },
  } = getState();

  try {
    const { data } = await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/post/getall`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
      params: { pageNumber: pageNum },
    });
    if (data.length === 0) {
      setHasMore(false);
    }
    setPostList((prev) => [...prev, ...data]);
    setPageNumber((prev) => prev + 1);
    dispatch({ type: POST_GET_ALL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: POST_GET_ALL_FAIL, payload: error.message });
  }
};

export const createPost =
  ({ text, location, picUrl }) =>
  async (dispatch, getState) => {
    dispatch({
      type: POST_CREATE_REQUEST,
      payload: { text, location, picUrl },
    });
    const {
      userLogin: { userInfo },
    } = getState();
    try {
      const { data } = await Axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/post/create`,
        { text, location, picUrl },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: POST_CREATE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: POST_CREATE_FAIL, payload: error.message });
    }
  };

export const deletePost = (postId, setPostList, setShowToastr, imageId) => async (dispatch, getState) => {
  dispatch({ type: POST_DELETE_REQUEST, payload: postId });
  const {
    userLogin: { userInfo },
  } = getState();
  try {
    await Axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/post/delete/${postId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    setPostList((prev) => prev.filter((post) => post._id !== postId));
    setShowToastr(true);
    dispatch({ type: POST_DELETE_SUCCESS });

    dispatch({ type: UTIL_DELETE_IMAGE_REQUEST, payload: imageId });

    const { data } = await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/util/cloudinary-delete/${imageId}`);

    if (data.message === 'Deleted image successfully') {
      dispatch({ type: UTIL_DELETE_IMAGE_SUCCESS });
    } else {
      dispatch({ type: UTIL_DELETE_IMAGE_FAIL });
    }
  } catch (error) {
    dispatch({ type: POST_DELETE_FAIL, payload: error.message });
  }
};

export const likePost = (postId, like) => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState();

  if (like) {
    try {
      dispatch({ type: POST_LIKE_REQUEST, payload: { postId } });
      await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/post/like/${postId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: POST_LIKE_SUCCESS });
    } catch (error) {
      dispatch({ type: POST_LIKE_FAIL, payload: error.message });
    }
  } else if (!like) {
    try {
      dispatch({ type: POST_UNLIKE_REQUEST, payload: { postId } });
      await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/post/unlike/${postId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: POST_UNLIKE_SUCCESS });
    } catch (error) {
      dispatch({ type: POST_UNLIKE_FAIL, payload: error.message });
    }
  }
};

export const commentPost = (postId, text, setComments, setText) => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState();

  dispatch({
    type: POST_CREATE_COMMENT_REQUEST,
    payload: { postId, text },
  });

  try {
    const { data } = await Axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/post/comment/create/${postId}`,
      { text },
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );

    const newComment = {
      _id: data.message,
      user: userInfo,
      text,
      date: Date.now(),
    };

    setComments((prev) => [newComment, ...prev]);
    setText('');
    dispatch({ type: POST_CREATE_COMMENT_SUCCESS, payload: newComment });
  } catch (error) {
    dispatch({ type: POST_CREATE_COMMENT_FAIL, payload: error.message });
  }
};

export const deleteCommentPost = (postId, commentId, setComments) => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState();

  dispatch({
    type: POST_DELETE_COMMENT_REQUEST,
    payload: { postId, commentId },
  });
  try {
    await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/post/comment/delete/${postId}/${commentId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    setComments((prev) => prev.filter((comment) => comment._id !== commentId));
    dispatch({ type: POST_DELETE_COMMENT_SUCCESS });
  } catch (error) {
    dispatch({ type: POST_DELETE_COMMENT_FAIL, payload: error.message });
  }
};

export const getLikesList = (postId) => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState();

  dispatch({ type: POST_GET_LIKES_LIST_REQUEST, payload: postId });
  try {
    const { data } = await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/post/likes/get/${postId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: POST_GET_LIKES_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: POST_GET_LIKES_LIST_FAIL, payload: error.message });
  }
};

export const getPostById = (postId) => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState();

  dispatch({ type: POST_GET_BY_ID_REQUEST, payload: postId });
  try {
    const { data } = await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/post/${postId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: POST_GET_BY_ID_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: POST_GET_BY_ID_FAIL, payload: error.message });
  }
};
