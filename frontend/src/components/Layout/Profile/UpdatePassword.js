import React, { useEffect, useState } from 'react';
import { Button, Divider, Form, List, Message } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword } from '../../../actions/userActions';
import { PasswordUpdateToastr } from '../Toastr';
import { USER_UPDATE_PASSWORD_RESET } from '../../../constants/userConstants';

export default function UpdatePassword({ setShowUpdatePassword }) {
  const dispatch = useDispatch();

  const [errorMsg, setErrorMsg] = useState(null);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const {
    success,
    loading: updatePasswordLoading,
    error: updatePasswordError,
  } = useSelector((state) => state.updatePassword);

  const [showTypedPassword, setShowTypedPassword] = useState({
    field1: false,
    field2: false,
  });

  const { currentPassword, newPassword } = passwords;
  const { field1, field2 } = showTypedPassword;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updatePassword(passwords));
  };

  useEffect(() => {
    if (updatePasswordError) {
      setErrorMsg(updatePasswordError);
    }
  }, [updatePasswordError]);

  useEffect(() => {
    errorMsg && setTimeout(() => setErrorMsg(null), 5000);
    dispatch({ type: USER_UPDATE_PASSWORD_RESET });
  }, [errorMsg, dispatch]);

  return (
    <>
      {success && <PasswordUpdateToastr />}
      <Form error={errorMsg != null} loading={updatePasswordLoading} onSubmit={handleSubmit}>
        <List.List>
          <List.Item>
            <Form.Input
              fluid
              icon={{
                name: 'eye',
                circular: true,
                link: true,
                onClick: () =>
                  setShowTypedPassword((prev) => ({
                    ...prev,
                    field1: !field1,
                  })),
              }}
              type={field1 ? 'text' : 'password'}
              iconPosition='left'
              label='M???t kh???u c??'
              placeholder='Nh???p m???t kh???u c??'
              name='currentPassword'
              onChange={handleChange}
              value={currentPassword}
            />

            <Form.Input
              fluid
              icon={{
                name: 'eye',
                circular: true,
                link: true,
                onClick: () =>
                  setShowTypedPassword((prev) => ({
                    ...prev,
                    field2: !field2,
                  })),
              }}
              type={field2 ? 'text' : 'password'}
              iconPosition='left'
              label='M???t kh???u m???i'
              placeholder='Nh???p m???t kh???u m???i'
              name='newPassword'
              onChange={handleChange}
              value={newPassword}
            />

            <Button
              disabled={updatePasswordLoading || newPassword === '' || currentPassword === ''}
              compact
              icon='configure'
              type='submit'
              color='teal'
              content='Thay ?????i'
            />

            <Button
              disabled={updatePasswordLoading || newPassword === '' || currentPassword === ''}
              compact
              icon='cancel'
              content='Hu???'
              onClick={() => setShowUpdatePassword(false)}
            />

            <Message error icon='meh' header='C?? l???i x???y ra' content={errorMsg} />
          </List.Item>
        </List.List>
      </Form>

      <Divider hidden />
    </>
  );
}
