import React, { useEffect, useState } from 'react';
import { Divider, List, Message } from 'semantic-ui-react';
import UpdatePassword from './UpdatePassword';

export default function Settings() {
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    success && setTimeout(() => setSuccess(false), 3000);
  }, [success]);

  return (
    <>
      {success && (
        <>
          <Message icon='check circle' header='Cập nhật tài khoản hoàn thành!' success />
          <Divider hidden />
        </>
      )}

      <List size='huge' animated>
        <List.Item>
          <List.Icon name='user secret' size='large' verticalAlign='middle' />
          <List.Content>
            <List.Header
              as={'a'}
              onClick={() => setShowUpdatePassword(!showUpdatePassword)}
              content='Thay đổi mật khẩu'
            />
          </List.Content>
          {showUpdatePassword && (
            <UpdatePassword setSuccess={setSuccess} setShowUpdatePassword={setShowUpdatePassword} />
          )}
        </List.Item>

        <Divider />
      </List>
    </>
  );
}
