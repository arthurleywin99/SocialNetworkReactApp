import { REPORT_SEND_FAIL, REPORT_SEND_REQUEST, REPORT_SEND_RESET, REPORT_SEND_SUCCESS } from '../constants/reportConstants';

export const sendReportReducer = (state = {}, action) => {
  switch (action.type) {
    case REPORT_SEND_REQUEST: {
      return { loading: true };
    }
    case REPORT_SEND_SUCCESS: {
      return { loading: false, success: true };
    }
    case REPORT_SEND_FAIL: {
      return { loading: false, error: action.payload };
    }
    case REPORT_SEND_RESET: {
      return {};
    }
    default: {
      return state;
    }
  }
};
