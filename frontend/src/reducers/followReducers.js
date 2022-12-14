import {
  FOLLOW_USER_FAIL,
  FOLLOW_USER_REQUEST,
  FOLLOW_USER_RESET,
  FOLLOW_USER_SUCCESS,
  UNFOLLOW_USER_FAIL,
  UNFOLLOW_USER_REQUEST,
  UNFOLLOW_USER_RESET,
  UNFOLLOW_USER_SUCCESS,
} from '../constants/followerConstants';

export const followUserReducer = (state = {}, action) => {
  switch (action.type) {
    case FOLLOW_USER_REQUEST: {
      return { loading: true };
    }
    case FOLLOW_USER_SUCCESS: {
      return { loading: false, userFollow: action.payload };
    }
    case FOLLOW_USER_FAIL: {
      return { loading: true, error: action.payload };
    }
    case FOLLOW_USER_RESET: {
      return {};
    }
    default: {
      return state;
    }
  }
};

export const unFollowUserReducer = (state = {}, action) => {
  switch (action.type) {
    case UNFOLLOW_USER_REQUEST: {
      return { loading: true };
    }
    case UNFOLLOW_USER_SUCCESS: {
      return { loading: false, success: true };
    }
    case UNFOLLOW_USER_FAIL: {
      return { loading: true, error: action.payload };
    }
    case UNFOLLOW_USER_RESET: {
      return {};
    }
    default: {
      return state;
    }
  }
};
