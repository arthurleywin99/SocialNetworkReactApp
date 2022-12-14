import {
  CHAT_DELETE_FAIL,
  CHAT_DELETE_REQUEST,
  CHAT_DELETE_SUCCESS,
  CHAT_GET_ALL_FAIL,
  CHAT_GET_ALL_REQUEST,
  CHAT_GET_ALL_SUCCESS,
} from '../constants/chatConstants';
import Axios from 'axios';

export const getAllChats = () => async (dispatch, getState) => {
  dispatch({ type: CHAT_GET_ALL_REQUEST });
  const {
    userLogin: { userInfo },
  } = getState();

  try {
    const { data } = await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/chat/getall`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: CHAT_GET_ALL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: CHAT_GET_ALL_FAIL, payload: error.message });
  }
};

export const checkIsSent = async (userToSendId, token) => {
  try {
    const { data } = await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/chat/check/${userToSendId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (data.message === 'Sent') {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const deleteChatBox = (messagesWith) => async (dispatch, getState) => {
  dispatch({ type: CHAT_DELETE_REQUEST, payload: messagesWith });
  const {
    userLogin: { userInfo },
  } = getState();

  try {
    const { data } = await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/chat/delete/${messagesWith}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: CHAT_DELETE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: CHAT_DELETE_FAIL, payload: error.message });
  }
};

export const makeMessageRead = async (token) => {
  try {
    await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/chat/read`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};
