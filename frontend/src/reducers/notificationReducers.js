import {
  NOTIFICATION_GET_FAIL,
  NOTIFICATION_GET_REQUEST,
  NOTIFICATION_GET_SUCCESS,
  NOTIFICATION_READ_FAIL,
  NOTIFICATION_READ_REQUEST,
  NOTIFICATION_READ_SUCCESS,
} from '../constants/notificationConstants';

export const getNotificationsReducer = (state = { loading: true, notificationList: [] }, action) => {
  switch (action.type) {
    case NOTIFICATION_GET_REQUEST: {
      return { loading: true };
    }
    case NOTIFICATION_GET_SUCCESS: {
      return { loading: false, notificationList: action.payload };
    }
    case NOTIFICATION_GET_FAIL: {
      return { loading: true, error: action.payload };
    }
    default: {
      return state;
    }
  }
};

export const readNotificationReducer = (state = {}, action) => {
  switch (action.type) {
    case NOTIFICATION_READ_REQUEST: {
      return { loading: true };
    }
    case NOTIFICATION_READ_SUCCESS: {
      return { loading: false, success: true };
    }
    case NOTIFICATION_READ_FAIL: {
      return { loading: false, error: action.payload };
    }
    default: {
      return state;
    }
  }
};
