import Axios from 'axios';
import {
  BLOCK_USER_FAIL,
  BLOCK_USER_REQUEST,
  BLOCK_USER_SUCCESS,
  UNBLOCK_USER_FAIL,
  UNBLOCK_USER_REQUEST,
  UNBLOCK_USER_SUCCESS,
} from '../constants/blockConstants';

export const blockUser = (userToBlockId) => async (dispatch, getState) => {
  dispatch({ type: BLOCK_USER_REQUEST, payload: userToBlockId });
  const {
    userLogin: { userInfo },
  } = getState();

  try {
    await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/block/add/${userToBlockId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    const { data } = await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/get/${userToBlockId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: BLOCK_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: BLOCK_USER_FAIL, payload: error.message });
  }
};

export const unBlockUser = (userToUnblockId) => async (dispatch, getState) => {
  dispatch({ type: UNBLOCK_USER_REQUEST, payload: userToUnblockId });
  const {
    userLogin: { userInfo },
  } = getState();

  try {
    await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/block/remove/${userToUnblockId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: UNBLOCK_USER_SUCCESS });
  } catch (error) {
    dispatch({ type: UNBLOCK_USER_FAIL, payload: error.message });
  }
};
