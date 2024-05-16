export const API = {
  BASE_URL: 'http://192.180.2.128:5253',
  REGISTRATION: '/api/User/Registration',
  LOGIN: '/api/Login',
  FORGOT_PASS: '/api/Password/ForgetPassword',
  RESET_PASS: '/api/Password/ResetPassword',
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
};

export const SIGNALR_API = {
  BASE_URL: 'http://192.180.2.128:5253/chatHub',
};
