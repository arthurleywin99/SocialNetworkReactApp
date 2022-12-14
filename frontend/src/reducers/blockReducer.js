import {
  BLOCK_GET_ALL_FAIL,
  BLOCK_GET_ALL_REQUEST,
  BLOCK_GET_ALL_SUCCESS,
  BLOCK_USER_FAIL,
  BLOCK_USER_REQUEST,
  BLOCK_USER_RESET,
  BLOCK_USER_SUCCESS,
  UNBLOCK_USER_FAIL,
  UNBLOCK_USER_REQUEST,
  UNBLOCK_USER_RESET,
  UNBLOCK_USER_SUCCESS,
} from '../constants/blockConstants';

export const getAllBlockListReducer = (state = {}, action) => {
  switch (action.type) {
    case BLOCK_GET_ALL_REQUEST: {
      return { loading: true };
    }
    case BLOCK_GET_ALL_SUCCESS: {
      return { loading: false, blockObj: action.payload };
    }
    case BLOCK_GET_ALL_FAIL: {
      return { loading: false, error: action.payload };
    }
    default: {
      return state;
    }
  }
};

export const blockUserReducer = (state = {}, action) => {
  switch (action.type) {
    case BLOCK_USER_REQUEST: {
      return { loading: true };
    }
    case BLOCK_USER_SUCCESS: {
      return { loading: false, userBlock: action.payload };
    }
    case BLOCK_USER_FAIL: {
      return { loading: false, error: action.payload };
    }
    case BLOCK_USER_RESET: {
      return {};
    }
    default: {
      return state;
    }
  }
};

export const unblockUserReducer = (state = {}, action) => {
  switch (action.type) {
    case UNBLOCK_USER_REQUEST: {
      return { loading: true };
    }
    case UNBLOCK_USER_SUCCESS: {
      return { loading: false, success: true };
    }
    case UNBLOCK_USER_FAIL: {
      return { loading: false, error: action.payload };
    }
    case UNBLOCK_USER_RESET: {
      return {};
    }
    default: {
      return state;
    }
  }
};
