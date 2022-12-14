import { FOLLOWER_GET_FAIL, FOLLOWER_GET_REQUEST, FOLLOWER_GET_SUCCESS } from '../constants/followerConstants';
import {
  PROFILE_CHECK_IS_BLOCKED_FAIL,
  PROFILE_CHECK_IS_BLOCKED_REQUEST,
  PROFILE_CHECK_IS_BLOCKED_SUCCESS,
  PROFILE_GET_FAIL,
  PROFILE_GET_FOLLOWERS_BY_USERID_FAIL,
  PROFILE_GET_FOLLOWERS_BY_USERID_REQUEST,
  PROFILE_GET_FOLLOWERS_BY_USERID_SUCCESS,
  PROFILE_GET_FOLLOWING_BY_USERID_FAIL,
  PROFILE_GET_FOLLOWING_BY_USERID_REQUEST,
  PROFILE_GET_FOLLOWING_BY_USERID_SUCCESS,
  PROFILE_GET_POSTS_FAIL,
  PROFILE_GET_POSTS_REQUEST,
  PROFILE_GET_POSTS_SUCESS,
  PROFILE_GET_REQUEST,
  PROFILE_GET_SUCCESS,
  PROFILE_UPDATE_FAIL,
  PROFILE_UPDATE_REQUEST,
  PROFILE_UPDATE_RESET,
  PROFILE_UPDATE_SUCCESS,
} from '../constants/profileConstants';

export const checkIsBlockedReducer = (state = {}, action) => {
  switch (action.type) {
    case PROFILE_CHECK_IS_BLOCKED_REQUEST: {
      return { loading: true };
    }
    case PROFILE_CHECK_IS_BLOCKED_SUCCESS: {
      return { loading: false, result: action.payload };
    }
    case PROFILE_CHECK_IS_BLOCKED_FAIL: {
      return { loading: false, error: action.payload };
    }
    default: {
      return state;
    }
  }
};

export const getProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case PROFILE_GET_REQUEST: {
      return { loading: true };
    }
    case PROFILE_GET_SUCCESS: {
      return { loading: false, data: action.payload };
    }
    case PROFILE_GET_FAIL: {
      return { loading: false, error: action.payload };
    }
    default: {
      return state;
    }
  }
};

export const getFollowerReducer = (state = {}, action) => {
  switch (action.type) {
    case FOLLOWER_GET_REQUEST: {
      return { loading: true };
    }
    case FOLLOWER_GET_SUCCESS: {
      return { loading: false, followObj: action.payload };
    }
    case FOLLOWER_GET_FAIL: {
      return { loading: false, error: action.payload };
    }
    default: {
      return state;
    }
  }
};

export const getUserPostsReducer = (state = [], action) => {
  switch (action.type) {
    case PROFILE_GET_POSTS_REQUEST: {
      return { loading: true };
    }
    case PROFILE_GET_POSTS_SUCESS: {
      return { loading: false, posts: action.payload };
    }
    case PROFILE_GET_POSTS_FAIL: {
      return { loading: false, error: action.payload };
    }
    default: {
      return state;
    }
  }
};

export const getFollowerByUserIdReducer = (state = { loading: true, followersList: [] }, action) => {
  switch (action.type) {
    case PROFILE_GET_FOLLOWERS_BY_USERID_REQUEST: {
      return { loading: true };
    }
    case PROFILE_GET_FOLLOWERS_BY_USERID_SUCCESS: {
      return { loading: false, followersList: action.payload };
    }
    case PROFILE_GET_FOLLOWERS_BY_USERID_FAIL: {
      return { loading: false, error: action.payload };
    }
    default: {
      return state;
    }
  }
};

export const getFollowingByUserIdReducer = (state = { loading: true, followingList: [] }, action) => {
  switch (action.type) {
    case PROFILE_GET_FOLLOWING_BY_USERID_REQUEST: {
      return { loading: true };
    }
    case PROFILE_GET_FOLLOWING_BY_USERID_SUCCESS: {
      return { loading: false, followingList: action.payload };
    }
    case PROFILE_GET_FOLLOWING_BY_USERID_FAIL: {
      return { loading: false, error: action.payload };
    }
    default: {
      return state;
    }
  }
};

export const updateProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case PROFILE_UPDATE_REQUEST: {
      return { loading: true };
    }
    case PROFILE_UPDATE_SUCCESS: {
      return { loading: false, success: true };
    }
    case PROFILE_UPDATE_FAIL: {
      return { loading: false, error: action.payload };
    }
    case PROFILE_UPDATE_RESET: {
      return {};
    }
    default: {
      return state;
    }
  }
};
