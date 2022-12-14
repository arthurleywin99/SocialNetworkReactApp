import Axios from "axios";
import {
  UTIL_UPLOAD_IMAGE_FAIL,
  UTIL_UPLOAD_IMAGE_REQUEST,
  UTIL_UPLOAD_IMAGE_SUCESS,
} from "../constants/utilConstants";

export const uploadImage = (formData) => async (dispatch) => {
  dispatch({ type: UTIL_UPLOAD_IMAGE_REQUEST, payload: null });
  try {
    const { data } = await Axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/util/cloudinary-upload`,
      formData
    );
    dispatch({ type: UTIL_UPLOAD_IMAGE_SUCESS, payload: data.message });
  } catch (error) {
    dispatch({ type: UTIL_UPLOAD_IMAGE_FAIL, payload: error.message });
  }
};
