import {
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USERNAME_CHECK_REQUEST,
  USERNAME_CHECK_SUCCESS,
  USERNAME_CHECK_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_SIGNOUT,
  USER_UPDATE_PASSWORD_REQUEST,
  USER_UPDATE_PASSWORD_SUCCESS,
  USER_UPDATE_PASSWORD_FAIL,
  USER_UPDATE_PASSWORD_RESET,
} from '../constants/userConstants';

export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST: {
      return { loading: true };
    }
    case USER_REGISTER_SUCCESS: {
      return { loading: false, userInfo: action.payload };
    }
    case USER_REGISTER_FAIL: {
      return { loading: false, error: action.payload };
    }
    default: {
      return state;
    }
  }
};

export const checkUsernameReducer = (state = {}, action) => {
  switch (action.type) {
    case USERNAME_CHECK_REQUEST: {
      return { loading: true };
    }
    case USERNAME_CHECK_SUCCESS: {
      return { loading: false, data: action.payload };
    }
    case USERNAME_CHECK_FAIL: {
      return { loading: false, error: action.payload };
    }
    default: {
      return state;
    }
  }
};

export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST: {
      return { loading: true };
    }
    case USER_LOGIN_SUCCESS: {
      return { loading: false, userInfo: action.payload };
    }
    case USER_LOGIN_FAIL: {
      return { loading: false, error: action.payload };
    }
    case USER_SIGNOUT: {
      return {};
    }
    default: {
      return state;
    }
  }
};

export const updatePasswordReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_UPDATE_PASSWORD_REQUEST: {
      return { loading: true };
    }
    case USER_UPDATE_PASSWORD_SUCCESS: {
      return { loading: false, success: true };
    }
    case USER_UPDATE_PASSWORD_FAIL: {
      return { loading: false, error: action.payload };
    }
    case USER_UPDATE_PASSWORD_RESET: {
      return {};
    }
    default: {
      return state;
    }
  }
};
