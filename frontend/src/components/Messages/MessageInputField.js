import React, { useState } from 'react';
import { Form, Segment } from 'semantic-ui-react';

export default function MessageInputField({ isBlocked, sendMsg }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ postion: 'sticky', bottom: '0' }}>
      {isBlocked ? (
        <Segment secondary color='teal' attached='bottom'>
          <Form
            reply
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Form.Input
              size='large'
              placeholder='Không thể gửi tin nhắn'
              disabled={true}
              action={{
                color: 'blue',
                icon: 'telegram plane',
                disabled: text === '',
                loading: loading,
              }}
            />
          </Form>
        </Segment>
      ) : (
        <Segment secondary color='teal' attached='bottom'>
          <Form
            reply
            onSubmit={(e) => {
              e.preventDefault();
              sendMsg(text);
              setText('');
            }}
          >
            <Form.Input
              size='large'
              placeholder='Gửi tin nhắn mới'
              value={text}
              onChange={(e) => setText(e.target.value)}
              action={{
                color: 'blue',
                icon: 'telegram plane',
                disabled: text === '',
                loading: loading,
              }}
            />
          </Form>
        </Segment>
      )}
    </div>
  );
}
