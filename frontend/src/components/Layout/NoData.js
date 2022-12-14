import { Message } from 'semantic-ui-react';

export const NoProfilePosts = () => (
  <>
    <Message info icon='meh' header='Oops!' content='Chưa đăng bất kỳ bài viết nào!' />
  </>
);

export const NoBlockData = () => (
  <>
    <Message info icon='meh' header='Oops!' content='Chưa chặn bất kỳ người dùng nào!' />
  </>
);

export const NoFollowData = ({ profileName, followersComponent = true, followingComponent = true }) => (
  <>
    {followersComponent && (
      <Message icon='user outline' info content={`${profileName.split(' ')[0] + ' chưa có người theo dõi'}`} />
    )}

    {followingComponent && (
      <Message icon='user outline' info content={`${profileName.split(' ')[0] + ' chưa theo dõi tài khoản nào'}`} />
    )}
  </>
);

export const NoMessages = () => (
  <Message
    info
    icon='telegram plane'
    header='Sorry'
    content='Bạn chưa có tin nhắn nào. Theo dõi người khác và bắt đầu trò chuyện nhé!'
  />
);

export const NoPosts = () => (
  <Message
    info
    icon='meh'
    header='Không có bài đăng nào!'
    content='Chắc chắn rằng bạn đã theo dõi ai đó để hiện bài viết mới!'
  />
);

export const NoProfile = () => <Message info icon='meh' header='Lỗi!' content='Không tìm thấy trang cá nhân.' />;

export const NoNotifications = () => <Message content='Không có thông báo mới' icon='smile' info />;
