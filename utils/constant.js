const obj = {
  DEFAULT_SUCCESS: {
    code: 10000,
    msg: '',
  },

  DEFAULT_ERROR: {
    code: 188,
    msg: 'System error',
  },

  LACK: {
    code: 199,
    msg: 'Missing required parameter',
  },

  TOKEN_ERROR: {
    code: 401,
    msg: 'Token verification failed',
  },

  LOGIN_ERROR: {
    code: 101,
    msg: 'Wrong user name or password',
  },

  WISH_NOT_EXSIT: {
    code: 102,
    msg: 'Wish information does not exist',
  },

  ADMIN_NOT_EXSIT: {
    code: 103,
    msg: 'Administrator information does not exist',
  },
};

module.exports = obj;
