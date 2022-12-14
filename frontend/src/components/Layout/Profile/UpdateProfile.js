import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Loader, Message } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import ImageDropComponent from '../../Common/ImageDropComponent';
import BioComponent from '../../Common/BioComponent';
import { uploadImage } from '../../../actions/utilActions';
import { getProfile, updateProfile } from '../../../actions/profileActions';
import { PostUpdateToastr } from '../Toastr';
import { UTIL_UPLOAD_IMAGE_RESET } from '../../../constants/utilConstants';
import { PROFILE_UPDATE_RESET } from '../../../constants/profileConstants';
import { NoProfile } from '../NoData';

export default function UpdateProfile() {
  const dispatch = useDispatch();

  const { data, loading: getProfileLoading, error: getProfileError } = useSelector((state) => state.getProfile);

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (data) {
      setProfile({
        profilePicUrl: data.profile.user.profilePicUrl,
        bio: data.profile.bio,
        facebook: (data.profile.social && data.profile.social.facebook) || '',
        instagram: (data.profile.social && data.profile.social.instagram) || '',
        youtube: (data.profile.social && data.profile.social.youtube) || '',
        twitter: (data.profile.social && data.profile.social.twitter) || '',
      });
    }
  }, [data]);

  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [highlighted, setHighlighted] = useState(false);
  const [showToastr, setShowToastr] = useState(false);

  const inputRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const {
    urlData,
    loading: uploadImageLoading,
    error: uploadImageError,
  } = useSelector((state) => state.uploadImageCloudinary);

  const {
    success,
    loading: updateProfileLoading,
    error: updateProfileError,
  } = useSelector((state) => state.updateProfile);

  const handleMediaChange = (e) => {
    const { files } = e.target;
    setMedia(files[0]);
    setMediaPreview(URL.createObjectURL(files[0]));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (media) {
      let formData = new FormData();
      formData.set('file', media);
      dispatch(uploadImage(formData));
    } else {
      dispatch(updateProfile(profile));
    }
  };

  useEffect(() => {
    if (urlData) {
      dispatch(updateProfile(profile, urlData));
    }
  }, [urlData, dispatch, profile]);

  useEffect(() => {
    if (success) {
      setShowToastr(true);
      dispatch({ type: UTIL_UPLOAD_IMAGE_RESET });
      dispatch({ type: PROFILE_UPDATE_RESET });
      dispatch(getProfile(data.profile.user.username));
    }
  }, [success, dispatch, data.profile.user.username]);

  useEffect(() => {
    if (getProfileError || uploadImageError || updateProfileError) {
      setErrorMsg(getProfileError || uploadImageError || updateProfileError);
    }
  }, [getProfileError, uploadImageError, updateProfileError]);

  useEffect(() => {
    showToastr &&
      setTimeout(() => {
        setShowToastr(false);
      }, 3000);
  }, [showToastr, dispatch]);

  return (
    <>
      {getProfileLoading || uploadImageLoading || updateProfileLoading ? (
        <Loader />
      ) : getProfileError || uploadImageError || updateProfileError ? (
        <NoProfile />
      ) : (
        <>
          {showToastr && <PostUpdateToastr />}
          <Form loading={uploadImageLoading || updateProfileLoading} error={errorMsg !== null} onSubmit={handleSubmit}>
            <Message error header='Có lỗi xảy ra!' content={errorMsg} onDismiss={() => setErrorMsg(null)} attached />

            {profile && (
              <>
                <ImageDropComponent
                  mediaPreview={mediaPreview}
                  setMediaPreview={setMediaPreview}
                  highlighted={highlighted}
                  setHighlighted={setHighlighted}
                  inputRef={inputRef}
                  handleMediaChange={handleMediaChange}
                  setMedia={setMedia}
                  profilePicUrl={profile.profilePicUrl}
                />

                <BioComponent
                  user={profile}
                  handleChange={handleChange}
                  showSocialLinks={showSocialLinks}
                  setShowSocialLinks={setShowSocialLinks}
                />

                <Button
                  color='blue'
                  disabled={profile.bio === '' || uploadImageLoading || updateProfileLoading}
                  icon='pencil alternate'
                  content='Cập nhật'
                  type='submit'
                />
              </>
            )}
          </Form>
        </>
      )}
    </>
  );
}
