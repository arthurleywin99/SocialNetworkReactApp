import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Dropdown, Icon, Loader, Menu } from 'semantic-ui-react';
import { signout } from '../../actions/userActions';

export default function MobileHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo, loading, error } = useSelector((state) => state.userLogin);

  const isActive = (route) => [...location.pathname.split('/')].includes(route);

  const handleLogout = () => {
    dispatch(signout());
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Loader />
      ) : (
        <Menu fluid borderless>
          <Container text>
            <Menu.Item header active={[...location.pathname].length === 1} onClick={() => navigate('/')}>
              <Icon name='home' size='large' color={[...location.pathname].length === 1 && 'teal'} />
            </Menu.Item>

            <Menu.Item
              header
              active={isActive('/messages') || userInfo.unreadMessage}
              onClick={() => navigate('/messages')}
            >
              <Icon
                name={userInfo.unreadMessage ? 'hand point right' : 'mail outline'}
                size='large'
                color={(isActive('messages') && 'teal') || (userInfo.unreadMessage && 'orange')}
              />
            </Menu.Item>

            <Menu.Item
              header
              active={isActive('/notifications') || userInfo.unreadNotification}
              onClick={() => navigate('/notifications')}
            >
              <Icon
                name={userInfo.unreadNotification ? 'hand point right' : 'bell outline'}
                size='large'
                color={(isActive('notifications') && 'teal') || (userInfo.unreadNotification && 'orange')}
              />
            </Menu.Item>

            <Dropdown item icon='bars' direction='left'>
              <Dropdown.Menu>
                <Dropdown.Item
                  active={isActive('account')}
                  onClick={() => {
                    navigate(`/account/profile/${userInfo.username}`);
                  }}
                >
                  <Icon name='user' size='large' color={isActive('account') && 'teal'} />
                  Account
                </Dropdown.Item>

                <Dropdown.Item onClick={handleLogout}>
                  <Icon name='sign out alternate' size='large' />
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Container>
        </Menu>
      )}
    </>
  );
}
