import React, { useEffect, useState, useRef } from 'react';
import { Grid, Segment, Header, Divider, Comment, Loader } from 'semantic-ui-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ChatLists from '../components/Chats/ChatLists';
import { NoMessages } from '../components/Layout/NoData';
import { getAllChats, deleteChatBox } from '../actions/chatActions';
import io from 'socket.io-client';
import MessageComponent from '../components/Messages/MessageComponent';
import MessageInputField from '../components/Messages/MessageInputField';
import Banner from '../components/Messages/Banner';
import { POST_GET_ALL_RESET } from '../constants/postConstants';
import { getUserInfo } from '../actions/profileActions';
import NotificationPortal from '../components/Common/NotificationPortal';

const scrollDivToBottom = (divRef) => divRef.current !== null && divRef.current.scrollIntoView({ behaviour: 'smooth' });

export default function MessageScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = new URLSearchParams(useLocation().search);

  const { userInfo: user, loading, error } = useSelector((state) => state.userLogin);

  const { chatMessages } = useSelector((state) => state.getAllChatMessages);
  const { success } = useSelector((state) => state.deleteChat);

  const [chats, setChats] = useState(null);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [bannerData, setBannerData] = useState({ name: '', profilePicUrl: '' });
  const [newNotification, setNewNotification] = useState(null);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  useEffect(() => {
    dispatch(getAllChats());
  }, [dispatch]);

  useEffect(() => {
    if (chatMessages) {
      setChats(chatMessages);

      if (chatMessages.length > 0 && !location.get('message')) {
        navigate(`/messages?message=${chatMessages[0].messagesWith}`);
      }
    }
  }, [chatMessages, location, navigate]);

  const socket = useRef();
  const openChatId = useRef('');
  const divRef = useRef();

  useEffect(() => {
    if (!socket.current) {
      socket.current = io(process.env.REACT_APP_BACKEND_URL);
    }

    if (socket.current) {
      socket.current.emit('join', { userId: user._id });

      socket.current.on('connectedUsers', ({ users }) => {
        users.length > 0 && setConnectedUsers(users);
      });

      socket.current.on('newNotificationReceived', ({ name, profilePicUrl, username, postId }) => {
        setNewNotification({ name, profilePicUrl, username, postId });
        setShowNotificationPopup(true);
      });
    }

    return () => {
      if (socket.current) {
        socket.current.emit('disconnected');
        socket.current.off();
      }
    };
  }, []);

  useEffect(() => {
    if (socket.current) {
      socket.current.on('newMsgReceived', async ({ newMsg }) => {
        if (newMsg.sender === openChatId.current) {
          setMessages((prev) => [...prev, newMsg]);

          setChats((prev) => {
            const previousChat = prev.find((chat) => chat.messagesWith === newMsg.sender);
            previousChat.lastMessage = newMsg.msg;
            previousChat.date = newMsg.date;

            return [...prev];
          });
        } else {
          const isSentMessage = chats.filter((chat) => chat.messagesWith === newMsg.sender).length > 0;

          if (isSentMessage) {
            setChats((prev) => {
              const previousChat = prev.find((chat) => chat.messagesWith === newMsg.sender);

              previousChat.lastMessage = newMsg.msg;
              previousChat.date = newMsg.date;

              return [previousChat, ...prev.filter((chat) => chat.messagesWith !== newMsg.sender)];
            });
          } else {
            const { name, profilePicUrl } = await getUserInfo(newMsg.sender);

            const newChat = {
              messagesWith: newMsg.sender,
              name,
              profilePicUrl,
              lastMessage: newMsg.msg,
              date: newMsg.date,
            };

            setChats((prev) => [newChat, ...prev]);
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    messages.length > 0 && scrollDivToBottom(divRef);
  }, [messages]);

  useEffect(() => {
    if (socket.current && location.get('message')) {
      socket.current.emit('loadMessages', {
        userId: user._id,
        messagesWith: location.get('message'),
      });

      socket.current.on('messagesLoaded', async ({ chat }) => {
        setMessages(chat.messages);
        setBannerData({
          name: chat.messagesWith.name,
          profilePicUrl: chat.messagesWith.profilePicUrl,
        });
        setIsBlocked(chat.isBlocked);

        openChatId.current = chat.messagesWith._id;
        divRef.current && scrollDivToBottom(divRef);
      });

      socket.current.on('noChatFound', async ({ name, profilePicUrl }) => {
        console.log('Hihi');
        setBannerData({ name, profilePicUrl });
        const newChat = {
          messagesWith: location.get('message'),
          name,
          profilePicUrl,
          lastMessage: '',
          date: Date.now(),
        };
        setChats((prev) => [...prev, newChat]);
        console.log(chats);
        setMessages([]);
        openChatId.current = location.get('message');
      });
    }
  }, [location.get('message')]);

  useEffect(() => {
    if (success) {
      navigate('/messages');
    }
  }, [success]);

  const sendMsg = (msg) => {
    if (socket.current) {
      socket.current.emit('sendNewMsg', {
        senderId: user._id,
        receiverId: location.get('message'),
        message: msg,
      });

      const newMsg = {
        sender: user._id,
        receiver: location.get('message'),
        msg,
        date: Date.now(),
      };

      setMessages((prev) => [...prev, newMsg]);

      setChats((prev) => {
        const previousChat = prev.find((chat) => chat.messagesWith === newMsg.receiver);
        if (previousChat) {
          previousChat.lastMessage = newMsg.msg;
          previousChat.date = newMsg.date;
        }

        return [...prev];
      });
    }
  };

  const deleteChat = (messagesWith) => {
    dispatch(deleteChatBox(messagesWith));
  };

  const deleteMsg = (messageId) => {
    if (socket.current) {
      socket.current.emit('deleteMsg', {
        userId: user._id,
        receiverId: openChatId.current,
        messageId,
      });

      socket.current.on('msgDeleted', () => {
        setMessages((prev) => prev.filter((message) => message._id !== messageId));
      });
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Loader />
      ) : (
        <>
          {showNotificationPopup && newNotification && (
            <NotificationPortal
              newNotification={newNotification}
              showNotificationPopup={showNotificationPopup}
              setShowNotificationPopup={setShowNotificationPopup}
            />
          )}
          <Grid>
            <Grid.Column floated='left' width={1} />
            <Grid.Column width={15}>
              <Segment padded basic size='large' style={{ marginTop: '5px' }}>
                <Header
                  icon='home'
                  content='Trang Chủ!'
                  onClick={() => {
                    dispatch({ type: POST_GET_ALL_RESET });
                    navigate('/');
                  }}
                  style={{ cursor: 'pointer' }}
                />

                <Divider hidden />

                {chats && chats.length > 0 ? (
                  <>
                    <>
                      <Grid stackable>
                        <Grid.Column width={4}>
                          <Comment.Group size='big'>
                            <Segment raised style={{ overflow: 'auto', maxHeight: '32rem' }}>
                              {chats.map((chat, i) => (
                                <ChatLists key={i} connectedUsers={connectedUsers} chat={chat} deleteChat={deleteChat} />
                              ))}
                            </Segment>
                          </Comment.Group>
                        </Grid.Column>

                        <Grid.Column width={12}>
                          {location.get('message') && (
                            <>
                              <div
                                style={{
                                  overflow: 'auto',
                                  overflowX: 'hidden',
                                  maxHeight: '35rem',
                                  height: '35rem',
                                  backgroundColor: 'whitesmoke',
                                }}
                              >
                                <>
                                  <div style={{ position: 'sticky', top: '0' }}>
                                    <Banner bannerData={bannerData} />
                                  </div>
                                  {messages.length > 0 && (
                                    <>
                                      {messages.map((message, i) => (
                                        <MessageComponent
                                          divRef={divRef}
                                          key={i}
                                          bannerProfilePic={bannerData.profilePicUrl}
                                          message={message}
                                          user={user}
                                          deleteMsg={deleteMsg}
                                        />
                                      ))}
                                    </>
                                  )}
                                </>
                              </div>
                              <MessageInputField isBlocked={isBlocked} sendMsg={sendMsg} />
                            </>
                          )}
                        </Grid.Column>
                      </Grid>
                    </>
                  </>
                ) : (
                  <NoMessages />
                )}
              </Segment>
            </Grid.Column>
          </Grid>
        </>
      )}
    </>
  );
}
