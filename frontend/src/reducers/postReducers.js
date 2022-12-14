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
  POST_DELETE_COMMENT_REQUEST,
  POST_DELETE_COMMENT_SUCCESS,
  POST_DELETE_COMMENT_FAIL,
  POST_GET_LIKES_LIST_SUCCESS,
  POST_GET_LIKES_LIST_REQUEST,
  POST_GET_LIKES_LIST_FAIL,
  POST_GET_BY_ID_REQUEST,
  POST_GET_BY_ID_SUCCESS,
  POST_GET_BY_ID_FAIL,
  POST_GET_ALL_RESET,
} from "../constants/postConstants";
import {
  UTIL_DELETE_IMAGE_FAIL,
  UTIL_DELETE_IMAGE_REQUEST,
  UTIL_DELETE_IMAGE_SUCCESS,
} from "../constants/utilConstants";

export const getAllPostReducer = (
  state = { loading: true, posts: [] },
  action
) => {
  switch (action.type) {
    case POST_GET_ALL_REQUEST: {
      return { loading: true };
    }
    case POST_GET_ALL_SUCCESS: {
      return { loading: false, posts: action.payload };
    }
    case POST_GET_ALL_FAIL: {
      return { loading: false, error: action.payload };
    }
    case POST_GET_ALL_RESET: {
      return {};
    }
    default: {
      return state;
    }
  }
};

export const createPostReducer = (state = {}, action) => {
  switch (action.type) {
    case POST_CREATE_REQUEST: {
      return { loading: true };
    }
    case POST_CREATE_SUCCESS: {
      return { loading: false, success: true, data: action.payload };
    }
    case POST_CREATE_FAIL: {
      return { loading: false, success: false, error: action.payload };
    }
    default: {
      return state;
    }
  }
};

export const deletePostReducer = (state = {}, action) => {
  switch (action.type) {
    case POST_DELETE_REQUEST: {
      return { loading: true };
    }
    case POST_DELETE_SUCCESS: {
      return { loading: false, success: true };
    }
    case POST_DELETE_FAIL: {
      return { loading: false, error: action.payload };
    }
    case UTIL_DELETE_IMAGE_REQUEST: {
      return { loading: true };
    }
    case UTIL_DELETE_IMAGE_SUCCESS: {
      return { loading: false, success: true };
    }
    case UTIL_DELETE_IMAGE_FAIL: {
      return { loading: false, success: false };
    }
    default: {
      return state;
    }
  }
};

export const likePostReducer = (state = {}, action) => {
  switch (action.type) {
    case POST_LIKE_REQUEST: {
      return { loading: true };
    }
    case POST_LIKE_SUCCESS: {
      return { loading: false, success: true };
    }
    case POST_LIKE_FAIL: {
      return { loading: false, error: action.payload };
    }
    case POST_UNLIKE_REQUEST: {
      return { loading: true };
    }
    case POST_UNLIKE_SUCCESS: {
      return { loading: false, success: true };
    }
    case POST_UNLIKE_FAIL: {
      return { loading: false, error: action.payload };
    }
    default: {
      return state;
    }
  }
};

export const commentPostReducer = (state = {}, action) => {
  switch (action.type) {
    case POST_CREATE_COMMENT_REQUEST: {
      return { loading: true };
    }
    case POST_CREATE_COMMENT_SUCCESS: {
      return { loading: false, newComment: action.payload };
    }
    case POST_CREATE_COMMENT_FAIL: {
      return { loading: false, error: action.payload };
    }
    default: {
      return state;
    }
  }
};

export const deleteCommentReducer = (state = {}, action) => {
  switch (action.type) {
    case POST_DELETE_COMMENT_REQUEST: {
      return { loading: true };
    }
    case POST_DELETE_COMMENT_SUCCESS: {
      return { loading: false, success: true };
    }
    case POST_DELETE_COMMENT_FAIL: {
      return { loading: false, error: action.payload };
    }
    default: {
      return state;
    }
  }
};

export const getLikesListReducer = (
  state = { loading: true, likes: [] },
  action
) => {
  switch (action.type) {
    case POST_GET_LIKES_LIST_REQUEST: {
      return { loading: true };
    }
    case POST_GET_LIKES_LIST_SUCCESS: {
      return { loading: false, likes: action.payload };
    }
    case POST_GET_LIKES_LIST_FAIL: {
      return { loading: false, error: action.payload };
    }
    default: {
      return state;
    }
  }
};

export const getPostByIdReducer = (state = {}, action) => {
  switch (action.type) {
    case POST_GET_BY_ID_REQUEST: {
      return { loading: true };
    }
    case POST_GET_BY_ID_SUCCESS: {
      return { loading: false, data: action.payload };
    }
    case POST_GET_BY_ID_FAIL: {
      return { loading: false, error: action.payload };
    }
    default: {
      return state;
    }
  }
};
