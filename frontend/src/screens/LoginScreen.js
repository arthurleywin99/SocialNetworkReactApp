import React, { useEffect, useState } from 'react';
import { Form, Message, Segment, Divider, Button } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import HeaderMessage from '../components/SignUp/HeaderMessage';
import FooterMessage from '../components/SignUp/FooterMessage';
import { signin } from '../actions/userActions';
import { Container } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import ModalLocked from '../components/SignUp/ModalLocked';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const { email, password } = user;

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [showModalLocked, setShowModalocked] = useState(false);

  const { userInfo, loading, error } = useSelector((state) => state.userLogin);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signin(email, password));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const isUser = Object.values({ email, password }).every((item) => Boolean(item));
    setSubmitDisabled(isUser ? false : true);
  }, [user]);

  useEffect(() => {
    if (userInfo) {
      if (!userInfo.status) {
        setShowModalocked(true);
      } else {
        navigate('/');
      }
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    if (error) {
      setErrorMsg(error);
    }
  }, [error]);

  return (
    <>
      {showModalLocked && <ModalLocked showModalLocked={showModalLocked} setShowModalocked={setShowModalocked} />}
      <Container style={{ paddingTop: '1rem' }} text>
        <HeaderMessage />

        <Form loading={formLoading} error={errorMsg !== null} onSubmit={handleSubmit}>
          <Message error header='Lỗi!' content={errorMsg} onDismiss={() => setErrorMsg(null)} />
          <Segment>
            <Form.Input
              label='Email'
              placeholder='Email'
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
              placeholder='Mật khẩu'
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

            <Divider hidden />
            <Button icon='signup' type='submit' content='Đăng Nhập' color='orange' loading={loading} disabled={submitDisabled} />
          </Segment>
        </Form>

        <FooterMessage />
      </Container>
    </>
  );
}
