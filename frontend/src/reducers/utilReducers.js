import {
  UTIL_UPLOAD_IMAGE_FAIL,
  UTIL_UPLOAD_IMAGE_REQUEST,
  UTIL_UPLOAD_IMAGE_RESET,
  UTIL_UPLOAD_IMAGE_SUCESS,
} from '../constants/utilConstants';

export const uploadImageReducer = (state = {}, action) => {
  switch (action.type) {
    case UTIL_UPLOAD_IMAGE_REQUEST: {
      return { loading: true };
    }
    case UTIL_UPLOAD_IMAGE_SUCESS: {
      return { loading: false, urlData: action.payload };
    }
    case UTIL_UPLOAD_IMAGE_FAIL: {
      return { loading: false, error: action.payload };
    }
    case UTIL_UPLOAD_IMAGE_RESET: {
      return {};
    }
    default: {
      return state;
    }
  }
};
