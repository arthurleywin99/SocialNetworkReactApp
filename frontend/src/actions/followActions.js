import {
  FOLLOW_USER_FAIL,
  FOLLOW_USER_REQUEST,
  FOLLOW_USER_SUCCESS,
  UNFOLLOW_USER_FAIL,
  UNFOLLOW_USER_REQUEST,
  UNFOLLOW_USER_SUCCESS,
} from '../constants/followerConstants';
import Axios from 'axios';

export const followUser = (userToFollowId) => async (dispatch, getState) => {
  dispatch({ type: FOLLOW_USER_REQUEST, payload: userToFollowId });
  const {
    userLogin: { userInfo },
  } = getState();
  try {
    await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/profile/follow/${userToFollowId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });

    const { data } = await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/get/${userToFollowId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });

    dispatch({ type: FOLLOW_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FOLLOW_USER_FAIL, payload: error.message });
  }
};

export const unFollowUser = (userToUnFollowId) => async (dispatch, getState) => {
  dispatch({ type: UNFOLLOW_USER_REQUEST, payload: userToUnFollowId });
  const {
    userLogin: { userInfo },
  } = getState();
  try {
    await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/profile/unfollow/${userToUnFollowId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: UNFOLLOW_USER_SUCCESS });
  } catch (error) {
    dispatch({ type: UNFOLLOW_USER_FAIL, payload: error.message });
  }
};
