import {
  NOTIFICATION_GET_FAIL,
  NOTIFICATION_GET_REQUEST,
  NOTIFICATION_GET_SUCCESS,
  NOTIFICATION_READ_FAIL,
  NOTIFICATION_READ_REQUEST,
  NOTIFICATION_READ_SUCCESS,
} from "../constants/notificationConstants";
import Axios from "axios";

export const getNotificationList = () => async (dispatch, getState) => {
  dispatch({ type: NOTIFICATION_GET_REQUEST });
  const {
    userLogin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/notification`,
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );
    dispatch({ type: NOTIFICATION_GET_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: NOTIFICATION_GET_FAIL, payload: error.message });
  }
};

export const readNotification = () => async (dispatch, getState) => {
  dispatch({ type: NOTIFICATION_READ_REQUEST });
  const {
    userLogin: { userInfo },
  } = getState();
  try {
    await Axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/notification`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: NOTIFICATION_READ_SUCCESS });
  } catch (error) {
    dispatch({ type: NOTIFICATION_READ_FAIL, payload: error.message });
  }
};

export const makeNotificationRead = async (token) => {
  try {
    await Axios.get(
      `${process.evn.REACT_APP_BACKEND_URL}/api/notification/read`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
