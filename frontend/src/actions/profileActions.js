import Axios from 'axios';
import { FOLLOWER_GET_FAIL, FOLLOWER_GET_REQUEST, FOLLOWER_GET_SUCCESS } from '../constants/followerConstants';
import { BLOCK_GET_ALL_FAIL, BLOCK_GET_ALL_REQUEST, BLOCK_GET_ALL_SUCCESS } from '../constants/blockConstants';
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
  PROFILE_UPDATE_SUCCESS,
} from '../constants/profileConstants';

export const checkIsBlocked = (username) => async (dispatch, getState) => {
  dispatch({ type: PROFILE_CHECK_IS_BLOCKED_REQUEST, payload: username });
  const {
    userLogin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/profile/checkblocked/${username}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: PROFILE_CHECK_IS_BLOCKED_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PROFILE_CHECK_IS_BLOCKED_FAIL, payload: error.message });
  }
};

export const getProfile = (username) => async (dispatch, getState) => {
  dispatch({ type: PROFILE_GET_REQUEST, payload: username });
  const {
    userLogin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/profile/${username}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: PROFILE_GET_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PROFILE_GET_FAIL, payload: error.message });
  }
};

export const getFollower = (userId) => async (dispatch, getState) => {
  dispatch({ type: FOLLOWER_GET_REQUEST, payload: userId });
  const {
    userLogin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/follower/get/${userId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: FOLLOWER_GET_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FOLLOWER_GET_FAIL, payload: error.message });
  }
};

export const getUserPosts = (username) => async (dispatch, getState) => {
  dispatch({ type: PROFILE_GET_POSTS_REQUEST, payload: username });
  const {
    userLogin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/profile/posts/getall/${username}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: PROFILE_GET_POSTS_SUCESS, payload: data });
  } catch (error) {
    dispatch({ type: PROFILE_GET_POSTS_FAIL, payload: error.message });
  }
};

export const getAllBlocks = (userId) => async (dispatch, getState) => {
  dispatch({ type: BLOCK_GET_ALL_REQUEST, payload: userId });
  const {
    userLogin: { userInfo },
  } = getState();

  try {
    const { data } = await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/block/get/${userId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: BLOCK_GET_ALL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: BLOCK_GET_ALL_FAIL, payload: error.message });
  }
};

export const getFollowerByUserId = (userId) => async (dispatch, getState) => {
  dispatch({ type: PROFILE_GET_FOLLOWERS_BY_USERID_REQUEST, payload: userId });
  const {
    userLogin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/profile/followers/${userId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: PROFILE_GET_FOLLOWERS_BY_USERID_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PROFILE_GET_FOLLOWERS_BY_USERID_FAIL,
      payload: error.message,
    });
  }
};

export const getFollowingByUserId = (userId) => async (dispatch, getState) => {
  dispatch({ type: PROFILE_GET_FOLLOWING_BY_USERID_REQUEST, payload: userId });
  const {
    userLogin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/profile/following/${userId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: PROFILE_GET_FOLLOWING_BY_USERID_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PROFILE_GET_FOLLOWING_BY_USERID_FAIL,
      payload: error.message,
    });
  }
};

export const updateProfile = (profile, profilePicUrl) => async (dispatch, getState) => {
  dispatch({ type: PROFILE_UPDATE_REQUEST, payload: profile });
  const {
    userLogin: { userInfo },
  } = getState();
  try {
    const { bio, facebook, youtube, twitter, instagram } = profile;
    if (profilePicUrl) {
      await Axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/profile/update`,
        { bio, facebook, youtube, twitter, instagram, profilePicUrl },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
    } else {
      await Axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/profile/update`,
        { bio, facebook, youtube, twitter, instagram },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
    }
    dispatch({ type: PROFILE_UPDATE_SUCCESS });
  } catch (error) {
    dispatch({
      type: PROFILE_UPDATE_FAIL,
      payload: error.message,
    });
  }
};

export const getUserInfo = async (userToFindId, token) => {
  try {
    const { data } = await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/profile/getinfo/${userToFindId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { name: data.name, profilePicUrl: data.profilePicUrl };
  } catch (error) {
    return { error };
  }
};
