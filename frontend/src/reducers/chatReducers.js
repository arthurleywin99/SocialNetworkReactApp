import {
  CHAT_DELETE_FAIL,
  CHAT_DELETE_REQUEST,
  CHAT_DELETE_SUCCESS,
  CHAT_GET_ALL_FAIL,
  CHAT_GET_ALL_REQUEST,
  CHAT_GET_ALL_SUCCESS,
} from "../constants/chatConstants";

export const getAllChatMessagesReducer = (
  state = { loading: true, chatMessages: [] },
  action
) => {
  switch (action.type) {
    case CHAT_GET_ALL_REQUEST: {
      return { loading: true };
    }
    case CHAT_GET_ALL_SUCCESS: {
      return { loading: false, chatMessages: action.payload };
    }
    case CHAT_GET_ALL_FAIL: {
      return { loading: false, error: action.payload };
    }
    default: {
      return state;
    }
  }
};

export const deleteChatReducer = (state = {}, action) => {
  switch (action.type) {
    case CHAT_DELETE_REQUEST: {
      return { loading: true };
    }
    case CHAT_DELETE_SUCCESS: {
      return { loading: false, success: true };
    }
    case CHAT_DELETE_FAIL: {
      return { loading: false, error: action.payload };
    }
    default: {
      return state;
    }
  }
};
