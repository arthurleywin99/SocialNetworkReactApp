import Axios from 'axios';
import {
  USERNAME_CHECK_REQUEST,
  USERNAME_CHECK_SUCCESS,
  USERNAME_CHECK_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_UPDATE_PASSWORD_REQUEST,
  USER_UPDATE_PASSWORD_SUCCESS,
  USER_UPDATE_PASSWORD_FAIL,
  USER_SIGNOUT,
} from '../constants/userConstants';

export const checkUsernameAvailable = (username) => async (dispatch) => {
  dispatch({ type: USERNAME_CHECK_REQUEST, payload: username });
  try {
    const { data } = await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/${username}`);
    dispatch({ type: USERNAME_CHECK_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USERNAME_CHECK_FAIL,
      payload: error.message,
    });
  }
};

export const register = (user) => async (dispatch) => {
  dispatch({
    type: USER_REGISTER_REQUEST,
    payload: user,
  });
  try {
    const { data } = await Axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/user/signup`, user);
    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload: error.message,
    });
  }
};

export const signin = (email, password) => async (dispatch) => {
  dispatch({ type: USER_LOGIN_REQUEST, payload: { email, password } });
  try {
    const { data } = await Axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/user/signin`, { email, password });
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload: error.message,
    });
  }
};

export const signout = () => async (dispatch) => {
  dispatch({ type: USER_SIGNOUT });
};

export const updatePassword = (passwords) => async (dispatch, getState) => {
  dispatch({ type: USER_UPDATE_PASSWORD_REQUEST, payload: passwords });
  const {
    userLogin: { userInfo },
  } = getState();
  try {
    const { currentPassword, newPassword } = passwords;
    await Axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/profile/settings/password`,
      { currentPassword, newPassword },
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );
    dispatch({ type: USER_UPDATE_PASSWORD_SUCCESS });
  } catch (error) {
    dispatch({
      type: USER_UPDATE_PASSWORD_FAIL,
      payload: error.message,
    });
  }
};
