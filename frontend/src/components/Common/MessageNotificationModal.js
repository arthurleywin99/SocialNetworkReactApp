import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Modal, Segment } from 'semantic-ui-react';
import { calculateTime } from '../../utils/utils';

function MessageNotificationModal({
  socket,
  setShowNewMessageModel,
  showNewMessageModal,
  newMessageReceived,
  user,
}) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setShowNewMessageModel(false);
  };

  const handleSendSubmit = (e) => {
    e.preventDefault();
    socket.current.emit('sendMsgFromNotification', {
      senderId: user._id,
      receiverId: newMessageReceived.sender,
      message: text,
    });

    socket.current.on('msgSentFromNotification', () => {
      setShowNewMessageModel(false);
    });
  };

  return (
    <>
      <Modal size='small' open={showNewMessageModal} onClose={handleClose} closeIcon closeOnDimmerClick>
        <Modal.Header content={`Có tin nhắn mới từ ${newMessageReceived.senderName}`} />
        <Modal.Content>
          <div className='bubbleWrapper'>
            <div className='inlineContainer'>
              <img className='inlineIcon' src={newMessageReceived.senderProfilePic} alt='Avatar' />
            </div>
            <div className='otherBubble other'>{newMessageReceived.msg}</div>
            <span className='other'>{calculateTime(newMessageReceived.date)}</span>
          </div>
          <div style={{ postion: 'sticky', bottom: '0' }}>
            <Segment secondary color='teal' attached='bottom'>
              <Form reply onSubmit={handleSendSubmit}>
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
          </div>
          <div style={{ marginTop: '5px', marginBottom: '5px' }}>
            <Link to={`/messages?message=${newMessageReceived.sender}`}>View All Messages</Link>
          </div>
        </Modal.Content>
      </Modal>
    </>
  );
}

export default MessageNotificationModal;
