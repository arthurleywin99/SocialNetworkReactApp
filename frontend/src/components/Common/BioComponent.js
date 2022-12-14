import React from 'react';
import { Form, Button, Message, TextArea, Divider } from 'semantic-ui-react';

export default function BioComponent({
  user: { bio, facebook, instagram, youtube, twitter },
  handleChange,
  showSocialLinks,
  setShowSocialLinks,
}) {
  return (
    <>
      <Form.Field
        control={TextArea}
        name='bio'
        value={bio}
        onChange={handleChange}
        placeholder='Thông tin cá nhân'
        required
      />

      <Button
        content='Liên kết mạng xã hội'
        color='red'
        icon='at'
        type='button'
        onClick={() => setShowSocialLinks(!showSocialLinks)}
      />

      {showSocialLinks && (
        <>
          <Divider />
          <Form.Input
            icon='facebook f'
            iconPosition='left'
            name='facebook'
            value={facebook}
            onChange={handleChange}
          />

          <Form.Input
            icon='twitter'
            iconPosition='left'
            name='twitter'
            value={twitter}
            onChange={handleChange}
          />

          <Form.Input
            icon='instagram'
            iconPosition='left'
            name='instagram'
            value={instagram}
            onChange={handleChange}
          />

          <Form.Input
            icon='youtube'
            iconPosition='left'
            name='youtube'
            value={youtube}
            onChange={handleChange}
          />

          <Message
            icon='attention'
            info
            size='small'
            header='Liên kết mạng xã hội là chức năng tuỳ chọn, không bắt buộc!'
          />
        </>
      )}
    </>
  );
}
