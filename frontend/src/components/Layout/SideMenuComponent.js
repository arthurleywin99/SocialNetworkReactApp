import React from 'react';
import { List, Icon, Divider, Loader } from 'semantic-ui-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { signout } from '../../actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { makeNotificationRead } from '../../actions/notificationActions';
import { makeMessageRead } from '../../actions/chatActions';

export default function SideMenuComponent({ pc }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo, loading, error } = useSelector((state) => state.userLogin);

  const isActive = (route) => [...location.pathname.split('/')].includes(route);

  const handleNotification = async () => {
    await makeNotificationRead(userInfo.token);
    navigate('/notifications');
  };

  const handleMessage = async () => {
    await makeMessageRead(userInfo.token);
    navigate('/messages');
  };

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
        <List style={{ paddingTop: '1rem' }} size='big' verticalAlign='middle' selection>
          <List.Item
            onClick={() => {
              navigate('/');
            }}
            active={[...location.pathname].length === 1}
          >
            <List.Icon name='home' size='large' color={[...location.pathname].length === 1 && 'teal'} />
            <List.Content>{pc && <List.Header content='Trang Chủ' />}</List.Content>
          </List.Item>

          <Divider hidden />

          <List.Item onClick={handleMessage} active={isActive('/messages')}>
            <List.Icon
              name={userInfo.unreadMessage ? 'hand point right' : 'mail outline'}
              size='large'
              color={(isActive('messages') && 'teal') || (userInfo.unreadMessage && 'orange')}
            />
            <List.Content>{pc && <List.Header content='Tin Nhắn' />}</List.Content>
          </List.Item>

          <Divider hidden />

          <List.Item onClick={handleNotification} active={isActive('notifications')}>
            <Icon
              name={userInfo.unreadNotification ? 'hand point right' : 'bell outline'}
              size='large'
              color={(isActive('notifications') && 'teal') || (userInfo.unreadNotification && 'orange')}
            />
            <List.Content>{pc && <List.Header content='Thông Báo' />}</List.Content>
          </List.Item>

          <Divider hidden />

          <List.Item
            onClick={() => {
              navigate(`/account/profile/${userInfo.username}`);
            }}
            active={isActive('account')}
          >
            <Icon name='user' size='large' color={isActive('account') && 'teal'} />
            <List.Content>{pc && <List.Header content='Tài Khoản' />}</List.Content>
          </List.Item>

          <Divider hidden />

          <List.Item onClick={handleLogout}>
            <Icon name='log out' size='large' />
            <List.Content>{pc && <List.Header content='Đăng Xuất' />}</List.Content>
          </List.Item>
        </List>
      )}
    </>
  );
}
