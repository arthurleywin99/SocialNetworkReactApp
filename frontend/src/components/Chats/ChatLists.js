import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Comment, Icon, List } from 'semantic-ui-react';
import { calculateTime } from '../../utils/utils';

export default function ChatLists({ connectedUsers, chat, deleteChat }) {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = new URLSearchParams(location.search).get('messsage');

  const isOnline =
    connectedUsers.length > 0 &&
    connectedUsers.filter((user) => user.userId === chat.messagesWith).length > 0;

  return (
    <>
      <List selection>
        <List.Item
          active={userId === chat.messagesWith._id}
          onClick={() => {
            navigate(`/messages?message=${chat.messagesWith}`);
          }}
        >
          <Comment>
            <Comment.Avatar src={chat.profilePicUrl} />
            <Comment.Content>
              <Comment.Author as='a'>
                {chat.name} {isOnline && <Icon name='circle' size='small' color='green' />}
              </Comment.Author>
              <Comment.Metadata>
                <div>{calculateTime(chat.date)}</div>
                <div
                  style={{
                    position: 'absolute',
                    right: '10px',
                    cursor: 'pointer',
                  }}
                >
                  <Icon name='trash alternate' color='red' onClick={() => deleteChat(chat.messagesWith)} />
                </div>
              </Comment.Metadata>

              <Comment.Text>
                {chat && chat.length > 20 ? `${chat.lastMessage.substring(0, 20)} ...` : chat.lastMessage}
              </Comment.Text>
            </Comment.Content>
          </Comment>
        </List.Item>
      </List>
    </>
  );
}
