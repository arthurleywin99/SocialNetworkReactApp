const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRouter = require('./routers/userRouter.js');
const utilRouter = require('./routers/utilRouter.js');
const searchRouter = require('./routers/searchRouter.js');
const postRouter = require('./routers/postRouter.js');
const profileRouter = require('./routers/profileRouter.js');
const followerRouter = require('./routers/followerRouter.js');
const notificationRouter = require('./routers/notificationRouter.js');
const chatRouter = require('./routers/chatRouter.js');
const blockRouter = require('./routers/blockRouter.js');
const reportRouter = require('./routers/reportRouter.js');
const resetRouter = require('./routers/resetRouter.js');
const adminAccountRouter = require('./routers/adminAccountRouter.js');
const adminUserRouter = require('./routers/adminUserRouter.js');
const adminPostRouter = require('./routers/adminPostRouter.js');
const adminReportRouter = require('./routers/adminReportRouter.js');
const { loadMessages, setMsgToUnread, getUserInfo, sendMsg, deleteMsg, likePost, unLikePost } = require('./utils/utils.js');
const http = require('http');
const { Server } = require('socket.io');
const adminSearchRouter = require('./routers/adminSearchRouter.js');

dotenv.config();

const app = express();

// Fix cors policy
let allowed = ['http://localhost:8000', 'http://localhost:3000', 'http://localhost:8080', 'https://api.ip2location.com'];
function options(req, res) {
  let tmp;
  let origin = req.header('Origin');
  if (allowed.indexOf(origin) > -1) {
    tmp = {
      origin: true,
      optionSuccessStatus: 200,
    };
  } else {
    tmp = {
      origin: 'error',
    };
  }
  res(null, tmp);
}

app.use(cors(options));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((err) => {
    console.log('Connection error: ' + err);
  });

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.status(200).send('Server connect successfully');
});

app.use('/api/user', userRouter);
app.use('/api/util', utilRouter);
app.use('/api/search', searchRouter);
app.use('/api/post', postRouter);
app.use('/api/profile', profileRouter);
app.use('/api/follower', followerRouter);
app.use('/api/notification', notificationRouter);
app.use('/api/chat', chatRouter);
app.use('/api/reset', resetRouter);
app.use('/api/block', blockRouter);
app.use('/api/report', reportRouter);
app.use('/api/admin/account', adminAccountRouter);
app.use('/api/admin/user', adminUserRouter);
app.use('/api/admin/post', adminPostRouter);
app.use('/api/admin/report', adminReportRouter);
app.use('/api/admin/search', adminSearchRouter);

const httpServer = http.Server(app);

httpServer.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

const io = new Server(httpServer, { cors: { origin: '*' } });

global.users = [];

io.on('connection', (socket) => {
  global.chatSocket = socket;
  socket.on('join', ({ userId }) => {
    const users = addUser(userId, socket.id);

    setInterval(() => {
      socket.emit('connectedUsers', {
        users,
      });
    }, 10000);
  });

  socket.on('likePost', async ({ postId, userId, like }) => {
    const { success, name, profilePicUrl, username, postByUserId, error } = like
      ? await likePost(postId, userId)
      : await unLikePost(postId, userId);
    if (success) {
      socket.emit('postLiked');

      if (postByUserId !== userId) {
        const receiver = users.find((user) => user.userId === postByUserId);

        if (receiver && like) {
          io.to(receiver.socketId).emit('newNotificationReceived', {
            name,
            profilePicUrl,
            username,
            postId,
          });
        }
      }
    }
  });

  socket.on('loadMessages', async ({ userId, messagesWith }) => {
    const { chat, error } = await loadMessages(userId, messagesWith);
    const { name, profilePicUrl } = await getUserInfo(messagesWith);

    !error ? socket.emit('messagesLoaded', { chat }) : socket.emit('noChatFound', { name, profilePicUrl });
  });

  socket.on('sendNewMsg', async ({ senderId, receiverId, message }) => {
    const { newMsg, error } = await sendMsg({ senderId, receiverId, message });
    const receiver = users.find((user) => user.userId === receiverId);

    if (receiver) {
      io.to(receiver.socketId).emit('newMsgReceived', { newMsg });
    } else {
      await setMsgToUnread(receiverId);
    }
  });

  socket.on('deleteMsg', async ({ userId, receiverId, messageId }) => {
    const { success } = await deleteMsg(userId, receiverId, messageId);

    if (success) {
      socket.emit('msgDeleted');
    }
  });

  socket.on('sendMsgFromNotification', async ({ senderId, receiverId, message }) => {
    const { newMsg, error } = await sendMsg({
      senderId,
      receiverId,
      message,
    });

    const receiver = users.find((user) => user.userId === receiverId);

    if (receiver) {
      io.to(receiver.socketId).emit('newMsgReceived', { newMsg });
    } else {
      await setMsgToUnread(receiverId);
    }

    !error && socket.emit('msgSentFromNotification');
  });

  socket.on('disconnected', () => {
    users = users.filter((user) => user.socketId !== socket.id);
  });
});

const addUser = async (userId, socketId) => {
  const user = users.find((user) => user.userId === userId);

  if (user && user.socketId === socketId) {
    return users;
  } else {
    if (user && user.socketId !== socketId) {
      removeUser(user.socketId);
    }
    const newUser = { userId, socketId };
    users.push(newUser);
    return users;
  }
};

const removeUser = (socketId) => {
  const indexOf = users.map((user) => user.socketId).indexOf(socketId);
  users.splice(indexOf, 1);
  return;
};
