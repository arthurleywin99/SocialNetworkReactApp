import React, { useEffect, useRef, useState } from 'react';
import { Form, Message, Segment, Divider, Button } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import HeaderMessage from '../components/SignUp/HeaderMessage';
import FooterMessage from '../components/SignUp/FooterMessage';
import BioComponent from '../components/Common/BioComponent';
import ImageDropComponent from '../components/Common/ImageDropComponent';
import { register } from '../actions/userActions';
import { uploadImage } from '../actions/utilActions';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { Container } from 'semantic-ui-react';

let cancel;

export default function SignupScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    facebook: '',
    youtube: '',
    twitter: '',
    instagram: '',
  });

  const { name, email, password, bio } = user;

  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const [username, setUsername] = useState('');
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);

  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [highlighted, setHighlighted] = useState(false);

  const inputRef = useRef();

  const { userInfo, error } = useSelector((state) => state.userRegister);
  const { urlData } = useSelector((state) => state.uploadImageCloudinary);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleMediaChange = (e) => {
    const { files } = e.target;
    setMedia(files[0]);
    setMediaPreview(URL.createObjectURL(files[0]));
  };

  useEffect(() => {
    const isUser = Object.values({ name, email, password, bio }).every((item) => Boolean(item));
    setSubmitDisabled(isUser ? false : true);
  }, [name, email, password, bio]);

  const checkUsernameExist = async () => {
    setUsernameLoading(true);
    try {
      cancel && cancel();
      const CancelToken = Axios.CancelToken;

      const res = await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user/${username}`, {
        cancelToken: new CancelToken((canceler) => {
          cancel = canceler;
        }),
      });

      if (errorMsg !== null) {
        setErrorMsg(null);
      }

      if (res.data === 'Available') {
        setUsernameAvailable(true);
        setUser((prev) => ({ ...prev, username }));
      } else {
        setErrorMsg(res.data);
        setUsernameAvailable(false);
      }
    } catch (error) {
      setErrorMsg('Tên đăng nhập không khả dụng');
      setUsernameAvailable(false);
    }
    setUsernameLoading(false);
  };

  useEffect(() => {
    username === '' ? setUsernameAvailable(false) : checkUsernameExist();
  }, [username]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormLoading(true);
    if (media) {
      let formData = new FormData();
      formData.set('file', media);
      dispatch(uploadImage(formData));
    } else {
      setErrorMsg('Phải tải ảnh lên trước');
    }
    setFormLoading(false);
  };

  useEffect(() => {
    if (urlData) {
      dispatch(register({ ...user, username, profilePicUrl: urlData }));
    }
  }, [urlData]);

  useEffect(() => {
    if (userInfo) {
      console.log('Đăng Ký Thành Công');
      navigate('/login');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (error) {
      setErrorMsg(error);
    }
  }, [error]);

  return (
    <>
      <Container style={{ paddingTop: '1rem' }} text>
        <HeaderMessage />

        <Form loading={formLoading} error={errorMsg !== null} onSubmit={handleSubmit}>
          <Message error header='Lỗi!' content={errorMsg} onDismiss={() => setErrorMsg(null)} />
          <Segment>
            <ImageDropComponent
              mediaPreview={mediaPreview}
              setMediaPreview={setMediaPreview}
              highlighted={highlighted}
              setHighlighted={setHighlighted}
              inputRef={inputRef}
              handleMediaChange={handleMediaChange}
              setMedia={setMedia}
            />
            <Form.Input
              label='Họ tên'
              placeholder='Nhập họ và tên'
              name='name'
              value={name}
              onChange={handleChange}
              fluid
              icon='user'
              iconPosition='left'
              required
            />
            <Form.Input
              label='Email'
              placeholder='Nhập địa chỉ email'
              name='email'
              value={email}
              onChange={handleChange}
              fluid
              icon='envelope'
              iconPosition='left'
              type='email'
              required
            />
            <Form.Input
              label='Mật khẩu'
              placeholder='Nhập mật khẩu'
              name='password'
              value={password}
              onChange={handleChange}
              fluid
              icon={{
                name: 'eye',
                circular: true,
                link: true,
                onClick: () => setShowPassword(!showPassword),
              }}
              iconPosition='left'
              type={showPassword ? 'text' : 'password'}
              required
            />
            <Form.Input
              loading={usernameLoading}
              error={!usernameAvailable}
              label='Tên đăng nhập'
              placeholder='Nhập tên đăng nhập'
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              fluid
              icon={usernameAvailable ? 'check' : 'close'}
              iconPosition='left'
              required
            />

            <BioComponent
              user={user}
              showSocialLinks={showSocialLinks}
              setShowSocialLinks={setShowSocialLinks}
              handleChange={handleChange}
            />
            <Divider hidden />
            <Button type='submit' icon='signup' content='Đăng Ký' color='orange' disabled={submitDisabled || !usernameAvailable} />
          </Segment>
        </Form>

        <FooterMessage />
      </Container>
    </>
  );
}
