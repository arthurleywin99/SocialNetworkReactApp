import { REPORT_SEND_FAIL, REPORT_SEND_REQUEST, REPORT_SEND_SUCCESS } from '../constants/reportConstants';
import Axios from 'axios';

export const sendReport = (postId, describe) => async (dispatch, getState) => {
  dispatch({ type: REPORT_SEND_REQUEST });
  const {
    userLogin: { userInfo },
  } = getState();

  try {
    const { data } = await Axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/report/send`,
      { postId, describe },
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );
    dispatch({ type: REPORT_SEND_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: REPORT_SEND_FAIL, payload: error.message });
  }
};
