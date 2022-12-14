import React from 'react';
import { Menu } from 'semantic-ui-react';

export default function ProfileMenuTabs({
  activeItem,
  handleItemClick,
  followersLength,
  followingLength,
  blockingLength,
  isOwnAccount,
}) {
  return (
    <>
      <Menu pointing secondary>
        <Menu.Item content='Trang cá nhân' active={activeItem === 'profile'} onClick={() => handleItemClick('profile')} />

        {isOwnAccount && (
          <>
            <Menu.Item
              content={`${followersLength} Người theo dõi`}
              active={activeItem === 'followers'}
              onClick={() => handleItemClick('followers')}
            />

            <Menu.Item
              content={`${followingLength} Đang theo dõi`}
              active={activeItem === 'following'}
              onClick={() => handleItemClick('following')}
            />
            <Menu.Item
              content={`${blockingLength} Đang chặn`}
              active={activeItem === 'block'}
              onClick={() => handleItemClick('block')}
            />
            <Menu.Item
              content='Cập Nhật Tài Khoản'
              active={activeItem === 'updateProfile'}
              onClick={() => handleItemClick('updateProfile')}
            />
            <Menu.Item content='Cài Đặt' active={activeItem === 'settings'} onClick={() => handleItemClick('settings')} />
          </>
        )}
      </Menu>
    </>
  );
}
