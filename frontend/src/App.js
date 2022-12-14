import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from './components/Layout/Navbar';
import PrivateRoute from './routes/PrivateRoute';
import { useSelector } from 'react-redux';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import NotificationScreen from './screens/NotificationScreen';
import PostScreen from './screens/PostScreen';
import MessageScreen from './screens/MessageScreen';
import ResetScreen from './screens/ResetScreen';
import TokenScreen from './screens/TokenScreen';

function App() {
  const { userInfo } = useSelector((state) => state.userLogin);

  return (
    <BrowserRouter>
      {!userInfo && <NavBar />}
      <Routes>
        <Route
          path='/'
          element={
            <PrivateRoute>
              <HomeScreen />
            </PrivateRoute>
          }
          exact
        />
        <Route
          path='/account/profile/:username'
          element={
            <PrivateRoute>
              <ProfileScreen />
            </PrivateRoute>
          }
        />
        <Route
          path='/notifications'
          element={
            <PrivateRoute>
              <NotificationScreen />
            </PrivateRoute>
          }
        />
        <Route
          path='/post/:id'
          element={
            <PrivateRoute>
              <PostScreen />
            </PrivateRoute>
          }
        />
        <Route
          path='/messages'
          element={
            <PrivateRoute>
              <MessageScreen />
            </PrivateRoute>
          }
        />
        <Route path='/login' element={<LoginScreen />} exact />
        <Route path='/signup' element={<SignupScreen />} exact />
        <Route path='/reset' element={<ResetScreen />} exact />
        <Route path='/reset/:token' element={<TokenScreen />} exact />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
