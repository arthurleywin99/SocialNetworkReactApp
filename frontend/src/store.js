import { compose, applyMiddleware, combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { checkUsernameReducer, userRegisterReducer, userLoginReducer, updatePasswordReducer } from './reducers/userReducers';
import { uploadImageReducer } from './reducers/utilReducers';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
  commentPostReducer,
  createPostReducer,
  deleteCommentReducer,
  deletePostReducer,
  getAllPostReducer,
  getLikesListReducer,
  getPostByIdReducer,
  likePostReducer,
} from './reducers/postReducers';
import {
  getProfileReducer,
  getUserPostsReducer,
  getFollowerReducer,
  getFollowerByUserIdReducer,
  getFollowingByUserIdReducer,
  updateProfileReducer,
  checkIsBlockedReducer,
} from './reducers/profileReducers';
import { followUserReducer, unFollowUserReducer } from './reducers/followReducers';
import { getNotificationsReducer, readNotificationReducer } from './reducers/notificationReducers';
import { deleteChatReducer, getAllChatMessagesReducer } from './reducers/chatReducers';
import { blockUserReducer, getAllBlockListReducer, unblockUserReducer } from './reducers/blockReducer';
import { sendReportReducer } from './reducers/reportReducers';

const reducer = combineReducers({
  userRegister: userRegisterReducer,
  checkUsername: checkUsernameReducer,
  uploadImageCloudinary: uploadImageReducer,
  userLogin: userLoginReducer,
  checkIsBlocked: checkIsBlockedReducer,
  getAllPost: getAllPostReducer,
  createPost: createPostReducer,
  deletePost: deletePostReducer,
  likePost: likePostReducer,
  commentPost: commentPostReducer,
  deleteComment: deleteCommentReducer,
  getLikesList: getLikesListReducer,
  getProfile: getProfileReducer,
  getFollower: getFollowerReducer,
  getUserPosts: getUserPostsReducer,
  getFollowerByUserId: getFollowerByUserIdReducer,
  getFollowingByUserId: getFollowingByUserIdReducer,
  followUser: followUserReducer,
  unFollowUser: unFollowUserReducer,
  updateProfile: updateProfileReducer,
  updatePassword: updatePasswordReducer,
  getNotifications: getNotificationsReducer,
  readNotification: readNotificationReducer,
  getPostById: getPostByIdReducer,
  getAllChatMessages: getAllChatMessagesReducer,
  deleteChat: deleteChatReducer,
  getAllBlock: getAllBlockListReducer,
  blockUser: blockUserReducer,
  unblockUser: unblockUserReducer,
  sendReport: sendReportReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['userLogin'],
};

const persistedReducer = persistReducer(persistConfig, reducer);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = configureStore({ reducer: persistedReducer }, composeEnhancers(applyMiddleware(thunk)));

export const persistor = persistStore(store);

export default store;
