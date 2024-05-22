export const API = {
  BASE_URL: 'http://192.180.2.128:5253',
  REGISTRATION: '/api/User/Registration',
  LOGIN: '/api/Login',
  FORGOT_PASS: '/api/Password/ForgetPassword',
  RESET_PASS: '/api/Password/ResetPassword',
  SEARCH_STRING: '/api/User?searchString=',
  LOGOUT_USER: '/api/Login/logout',
  USER_GET: '/api/User/profile',
  USER_EDIT: '/api/User',
  UPDATE_PASSWORD: '/api/Password/ChangePassword',
  SET_IMAGE: '/api/File/Profileimage',
  SAVE_FILE:'/api/File/file'
};

export const STATUS_CODES = {
  SUCCESS: 200,
};

export const ROUTES = {
  DEFAULT: '',
  LOGIN: 'login',
  REGISTER: 'register',
  CHAT_HOME: 'chatHome',
  FORGOT_PASS: 'forgotPass',
  WILDCARD: '**',
  HOME_COMPONENT: 'homeComp',
  TESTING: 'testing',
  CHAT: 'chat',
  PROFILE: 'profile',
  EDIT_USER_PASSWORD: 'editUserOrDelete',
};

export const SIGNALR_API = {
  BASE_URL: 'http://192.180.2.128:5253/chatHub',
};

export const DEFAULT_USER_IMG = {
  IMAGE:
    'https://img.freepik.com/premium-vector/default-male-user-profile-icon-vector-illustration_276184-168.jpg',
};

export const QUERY_PARAMS = {
  EDIT_USER: 'editUser',
  CHANGE_PASS: 'changePass',
};
